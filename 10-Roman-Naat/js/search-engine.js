/**
 * Roman Naat Studio - Smart Phonetic & Diacritic-Tolerant Roman Search Engine
 * Handles complex Roman Urdu transliterations, macrons, vowel variations, and consonant digraphs.
 */

class RomanSearchEngine {
    constructor() {
        this.cache = new Map();
        this.index = [];
        this.kalamIndex = [];
        this.rawKalams = [];
        this.isIndexed = false;
    }

    /**
     * Normalizes Roman text for diacritic-insensitive & phonetic search
     */
    normalize(str) {
        if (!str) return '';
        
        let s = str.toLowerCase();
        
        // 1. Remove standard diacritics / macrons
        s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Custom Urdu/Arabic transliteration characters
        s = s.replace(/[ā]/g, 'a')
             .replace(/[ī]/g, 'i')
             .replace(/[ū]/g, 'u')
             .replace(/[ē]/g, 'e')
             .replace(/[ō]/g, 'o')
             .replace(/[ḥ]/g, 'h')
             .replace(/[ṣ]/g, 's')
             .replace(/[ṭ]/g, 't')
             .replace(/[ẓ]/g, 'z')
             .replace(/[ḍ]/g, 'd')
             .replace(/[ñ]/g, 'n')
             .replace(/[ʿ‘’'`´]/g, ''); // Hamza / Ayn / Quotes
             
        // 2. Remove punctuation but keep letters and spaces
        s = s.replace(/[^a-z0-9\s]/g, ' ');
        
        // 3. Vowel harmonization (aa -> a, ee -> i, oo -> u, etc.)
        s = s.replace(/aa+/g, 'a')
             .replace(/ee+/g, 'i')
             .replace(/oo+/g, 'u')
             .replace(/ou+/g, 'u')
             .replace(/ai/g, 'ay')
             .replace(/ie/g, 'i')
             .replace(/eh/g, 'ah'); // Rehmat <-> Rahmat, Mehfil <-> Mahfil
             
        // 4. Consonant harmonization for common Roman Urdu spellings
        s = s.replace(/kh/g, 'k')
             .replace(/gh/g, 'g')
             .replace(/q/g, 'k')
             .replace(/zh/g, 'z')
             .replace(/dh/g, 'z')
             .replace(/th/g, 's')
             .replace(/chh/g, 'c')
             .replace(/ch/g, 'c')
             .replace(/sh/g, 's');
             
        // 5. Deduplicate double consonants
        s = s.replace(/([b-df-hj-np-tv-z])\1+/g, '$1');
        
        // 6. Clean whitespace
        s = s.replace(/\s+/g, ' ').trim();
        return s;
    }

    /**
     * Tokenizes a normalized string into clean non-empty words
     */
    tokenize(str) {
        const norm = this.normalize(str);
        return norm ? norm.split(' ').filter(w => w.length > 0) : [];
    }

    /**
     * Pre-indexes all couplets and kalams across all books for instant sub-10ms search
     */
    buildIndex(kalams) {
        this.rawKalams = kalams;
        this.index = [];
        this.kalamIndex = [];

        for (let i = 0; i < kalams.length; i++) {
            const k = kalams[i];
            const kTitleNorm = this.normalize(k.title);
            const kAuthorNorm = this.normalize(k.author);
            
            const indexedShers = [];
            let allShersNormText = '';

            for (let j = 0; j < k.shers.length; j++) {
                const s = k.shers[j];
                const sRomanNorm = this.normalize(s.roman);
                const sEngNorm = s.english ? this.normalize(s.english) : '';
                allShersNormText += ` ${sRomanNorm} ${sEngNorm}`;

                const sherItem = {
                    kalamId: k.id,
                    kalamTitle: k.title,
                    kalamTitleNorm: kTitleNorm,
                    bookId: k.book_id,
                    bookTitle: k.book_title,
                    author: k.author,
                    authorNorm: kAuthorNorm,
                    category: k.category,
                    sherIndex: s.sher_index,
                    page: s.page,
                    roman: s.roman,
                    romanNorm: sRomanNorm,
                    english: s.english || '',
                    englishNorm: sEngNorm,
                    fullTextNorm: `${kTitleNorm} ${sRomanNorm} ${sEngNorm}`
                };

                this.index.push(sherItem);
                indexedShers.push(sherItem);
            }

            this.kalamIndex.push({
                kalam: k,
                id: k.id,
                title: k.title,
                titleNorm: kTitleNorm,
                bookId: k.book_id,
                bookTitle: k.book_title,
                author: k.author,
                authorNorm: kAuthorNorm,
                category: k.category,
                page: k.page,
                totalShers: k.shers.length,
                matla: k.shers.length > 0 ? k.shers[0] : null,
                shers: indexedShers,
                fullKalamNorm: `${kTitleNorm} ${kAuthorNorm} ${allShersNormText}`
            });
        }

        this.isIndexed = true;
        console.log(`[SearchEngine] Indexed ${this.index.length} couplets and ${this.kalamIndex.length} full kalams.`);
    }

    /**
     * Executes instant multi-term phonetic search for individual couplets (shers)
     */
    search(query, bookFilter = 'all', categoryFilter = 'all', limit = 150) {
        if (!this.isIndexed) return [];
        
        const qRaw = (query || '').trim();
        const tokens = this.tokenize(qRaw);
        
        if (tokens.length === 0) {
            let res = this.index;
            if (bookFilter !== 'all') {
                res = res.filter(item => item.bookId === bookFilter);
            }
            if (categoryFilter !== 'all') {
                res = res.filter(item => item.category === categoryFilter);
            }
            return res.slice(0, limit);
        }

        const rawLower = qRaw.toLowerCase();
        const results = [];

        for (let i = 0; i < this.index.length; i++) {
            const item = this.index[i];

            if (bookFilter !== 'all' && item.bookId !== bookFilter) continue;
            if (categoryFilter !== 'all' && item.category !== categoryFilter) continue;

            let score = 0;
            const romanLower = item.roman.toLowerCase();
            const titleLower = item.kalamTitle.toLowerCase();
            
            if (romanLower.includes(rawLower) || titleLower.includes(rawLower)) {
                score += 150;
            }

            let allTokensFound = true;
            for (let t = 0; t < tokens.length; t++) {
                const token = tokens[t];
                if (item.fullTextNorm.includes(token)) {
                    score += 25;
                } else {
                    allTokensFound = false;
                    break;
                }
            }

            if (allTokensFound) {
                results.push({ item: item, score: score });
            }
        }

        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit).map(r => r.item);
    }

    /**
     * Executes deep search across full Kalams (matching titles and internal verses)
     * @returns {Array} Array of { kalam, score, matchedSherIndex, matchedSher, matchType }
     */
    searchKalams(query, bookFilter = 'all', categoryFilter = 'all', limit = 100) {
        if (!this.isIndexed) return [];

        const qRaw = (query || '').trim();
        const tokens = this.tokenize(qRaw);

        // If query is empty, return kalams according to filters
        if (tokens.length === 0) {
            let list = this.kalamIndex;
            if (bookFilter !== 'all') {
                list = list.filter(k => k.bookId === bookFilter);
            }
            if (categoryFilter !== 'all') {
                list = list.filter(k => k.category === categoryFilter);
            }
            return list.slice(0, limit).map(item => ({
                kalam: item.kalam,
                score: 1,
                matchedSherIndex: 1,
                matchedSher: item.matla,
                matchType: 'default'
            }));
        }

        const rawLower = qRaw.toLowerCase();
        const results = [];

        for (let i = 0; i < this.kalamIndex.length; i++) {
            const kItem = this.kalamIndex[i];

            if (bookFilter !== 'all' && kItem.bookId !== bookFilter) continue;
            if (categoryFilter !== 'all' && kItem.category !== categoryFilter) continue;

            // Check if all tokens match anywhere in the entire Kalam
            let allTokensFoundInKalam = true;
            for (let t = 0; t < tokens.length; t++) {
                if (!kItem.fullKalamNorm.includes(tokens[t])) {
                    allTokensFoundInKalam = false;
                    break;
                }
            }
            if (!allTokensFoundInKalam) continue;

            let score = 0;
            let matchType = 'verse';
            let bestSherIndex = 1;
            let bestSher = kItem.matla;
            let maxSherTokenMatches = -1;

            const titleLower = kItem.title.toLowerCase();

            // 1. Title match boost
            if (titleLower.includes(rawLower)) {
                score += 500;
                matchType = 'title';
            } else {
                let titleTokenMatches = 0;
                for (let t = 0; t < tokens.length; t++) {
                    if (kItem.titleNorm.includes(tokens[t])) titleTokenMatches++;
                }
                if (titleTokenMatches > 0) {
                    score += titleTokenMatches * 60;
                    matchType = 'title';
                }
            }

            // 2. Identify best matching internal sher for snippet preview
            for (let j = 0; j < kItem.shers.length; j++) {
                const s = kItem.shers[j];
                let sTokensFound = 0;
                const sRomanLower = s.roman.toLowerCase();

                if (sRomanLower.includes(rawLower)) {
                    sTokensFound += 10;
                }
                for (let t = 0; t < tokens.length; t++) {
                    if (s.romanNorm.includes(tokens[t]) || s.englishNorm.includes(tokens[t])) {
                        sTokensFound++;
                    }
                }

                if (sTokensFound > maxSherTokenMatches) {
                    maxSherTokenMatches = sTokensFound;
                    bestSherIndex = s.sherIndex;
                    bestSher = kItem.kalam.shers[j];
                }
            }

            score += Math.max(0, maxSherTokenMatches * 30);

            if (bestSherIndex === 1 && matchType !== 'title') {
                matchType = 'matla';
                score += 40;
            }

            results.push({
                kalam: kItem.kalam,
                score: score,
                matchedSherIndex: bestSherIndex,
                matchedSher: bestSher,
                matchType: matchType
            });
        }

        results.sort((a, b) => b.score - a.score);
        return results.slice(0, limit);
    }

    /**
     * Highlights matched words in the original text preserving original casing
     */
    highlight(text, query) {
        if (!text || !query) return text;
        
        const rawWords = query.trim().split(/\s+/).filter(w => w.length > 1);
        if (rawWords.length === 0) return text;

        // Escape regex special characters and build pattern
        const escaped = rawWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
        
        return text.replace(pattern, '<mark class="highlight">$1</mark>');
    }
}

window.SearchEngine = new RomanSearchEngine();
