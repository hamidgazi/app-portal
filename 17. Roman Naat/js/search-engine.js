/**
 * Roman Naat Studio - Smart Phonetic & Diacritic-Tolerant Roman Search Engine
 * Handles complex Roman Urdu transliterations, macrons, vowel variations, and consonant digraphs.
 */

class RomanSearchEngine {
    constructor() {
        this.cache = new Map();
        this.index = [];
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
             .replace(/ie/g, 'i');
             
        // 4. Consonant harmonization for common Roman Urdu spellings
        // Note: We harmonize to common phonetic bases
        s = s.replace(/kh/g, 'k')
             .replace(/gh/g, 'g')
             .replace(/q/g, 'k')
             .replace(/zh/g, 'z')
             .replace(/dh/g, 'z')
             .replace(/th/g, 's')
             .replace(/chh/g, 'c')
             .replace(/ch/g, 'c')
             .replace(/sh/g, 's');
             
        // 5. Deduplicate double consonants (e.g. mustafaa / mustuffa, hussain / husain)
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
     * Pre-indexes all couplets across all books for instant sub-10ms search
     */
    buildIndex(kalams) {
        this.index = [];
        for (let i = 0; i < kalams.length; i++) {
            const k = kalams[i];
            const kTitleNorm = this.normalize(k.title);
            const kAuthorNorm = this.normalize(k.author);
            
            for (let j = 0; j < k.shers.length; j++) {
                const s = k.shers[j];
                const sRomanNorm = this.normalize(s.roman);
                const sEngNorm = s.english ? this.normalize(s.english) : '';
                
                this.index.push({
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
                    // Pre-combined full text for high-speed multi-term matching
                    fullTextNorm: `${kTitleNorm} ${sRomanNorm} ${sEngNorm}`
                });
            }
        }
        this.isIndexed = true;
        console.log(`[SearchEngine] Indexed ${this.index.length} couplets across ${kalams.length} kalams.`);
    }

    /**
     * Executes instant multi-term phonetic search with filtering
     * @param {string} query Search input string
     * @param {string} bookFilter 'all' or specific book_id
     * @param {string} categoryFilter 'all' or specific category (Naat, Hamd, Salaam, etc.)
     * @param {number} limit Max results to return (default: 150)
     */
    search(query, bookFilter = 'all', categoryFilter = 'all', limit = 150) {
        if (!this.isIndexed) return [];
        
        const qRaw = (query || '').trim();
        const tokens = this.tokenize(qRaw);
        
        // If query is empty, return latest / initial slice or filtered results
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

            // 1. Check book filter
            if (bookFilter !== 'all' && item.bookId !== bookFilter) {
                continue;
            }

            // 2. Check category filter
            if (categoryFilter !== 'all' && item.category !== categoryFilter) {
                continue;
            }

            // 3. Scoring & Matching
            let score = 0;

            // Direct literal substring match in original text receives highest priority
            const romanLower = item.roman.toLowerCase();
            const titleLower = item.kalamTitle.toLowerCase();
            
            if (romanLower.includes(rawLower) || titleLower.includes(rawLower)) {
                score += 150;
            }

            // Tokenized phonetic matching across normalized full text
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
                results.push({
                    item: item,
                    score: score
                });
            }
        }

        // Sort by relevance score descending
        results.sort((a, b) => b.score - a.score);

        return results.slice(0, limit).map(r => r.item);
    }

    /**
     * Highlights matched words in the original text preserving original casing
     */
    highlight(text, query) {
        if (!text || !query) return text;
        
        const rawWords = query.trim().split(/\s+/).filter(w => w.length > 1);
        if (rawWords.length === 0) return text;

        // Escape regex special characters
        const escaped = rawWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
        
        return text.replace(pattern, '<mark class="highlight">$1</mark>');
    }
}

window.SearchEngine = new RomanSearchEngine();
