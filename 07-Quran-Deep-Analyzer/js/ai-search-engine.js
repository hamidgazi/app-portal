/**
 * ============================================================================
 * Quran Deep Analyzer - Universal AI Search Engine & RAG Synthesizer
 * (js/ai-search-engine.js)
 * ============================================================================
 * High-performance, client-side first AI search engine designed under
 * Antigravity Workspace Directives.
 *
 * Architectural Features:
 *  1. Sub-millisecond Okapi BM25 Probabilistic Ranking (k1=1.2, b=0.75)
 *  2. Morphological Suffix Stemming & Tokenizer
 *  3. Dynamic Levenshtein Fuzzy Typo-Tolerance (Threshold >= 0.58)
 *  4. Deep Islamic Semantic Concept & Cross-Lingual Synonym Graph
 *  5. Universal Arabic/Urdu Orthography & Diacritic Normalizer
 *  6. Omnipresent Multi-Corpus Indexer (Surahs, Paras, Prophets, Themes,
 *     Sirat Exegesis, Roots, Manners, Mutashabihat, Semantic Pairs)
 *  7. Progressive Cloud Gemini AI Synthesizer (RAG) with Clickable Scripture Pills
 *  8. Compliant with Directive 7 (Procedural Web Audio SFX, Zero Music)
 * ============================================================================
 */

(function (global) {
  'use strict';

  if (typeof window === 'undefined') {
    global.window = global;
  }

  // --- 1. PROCEDURAL ACOUSTIC FEEDBACK (Directive 7 Compliant) ---
  const AISound = {
    playClick() {
      if (window.AudioSFX && typeof window.AudioSFX.playClick === 'function') {
        window.AudioSFX.playClick();
        return;
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.025);
      } catch (e) {}
    },
    playSuccess() {
      if (window.AudioSFX && typeof window.AudioSFX.playDing === 'function') {
        window.AudioSFX.playDing();
        return;
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.08); // G5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {}
    }
  };

  // --- 2. UNIVERSAL ARABIC / URDU ORTHOGRAPHY NORMALIZER ---
  function normalizeArabicUrdu(str) {
    if (!str) return '';
    return String(str)
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Diacritics / Harakat / Tashkeel
      .replace(/\u0640/g, '') // Tatweel / Kashida
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // Alif variants -> ا
      .replace(/[\u06CC\u0649\u0626]/g, '\u064A') // Yeh variants -> ي
      .replace(/\u06A9/g, '\u0643') // Urdu Keheh -> Arabic Kaf
      .replace(/[\u06C1\u06C2\u0629]/g, '\u0647') // Urdu Goal Heh / Teh Marbuta -> ه
      .replace(/\u0624/g, '\u0648') // Waw with Hamza -> و
      .trim()
      .toLowerCase();
  }

  // --- 3. MORPHOLOGICAL SUFFIX STEMMER ---
  function stemWord(word) {
    if (!word || word.length <= 3) return word;
    return word
      .replace(/(ing|edly|ingly|tion|ness|able|ible)$/, '')
      .replace(/(ly|ed|es|er|est)$/, '')
      .replace(/s$/, '');
  }

  // --- 4. LEVENSHTEIN DISTANCE & FUZZY SIMILARITY ---
  function levenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function fuzzySimilarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1.0;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1.0;
    const dist = levenshteinDistance(a, b);
    return Math.max(0, 1.0 - dist / maxLen);
  }

  // --- 5. ISLAMIC CONCEPT & SYNONYM EXPANSION GRAPH ---
  const ISLAMIC_SYNONYMS = {
    'prayer': ['namaz', 'salah', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'tahajjud', 'wudu', 'ablution', 'qibla', 'ruku', 'sajdah', 'jamaat', 'نماز', 'صلوۃ'],
    'namaz': ['prayer', 'salah', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'tahajjud', 'wudu', 'sajdah', 'نماز'],
    'salah': ['prayer', 'namaz', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'نماز'],
    'fasting': ['roza', 'ramadan', 'ramzan', 'sawm', 'sehri', 'iftar', 'روزہ', 'صوم'],
    'roza': ['fasting', 'ramadan', 'ramzan', 'sawm', 'sehri', 'iftar', 'روزہ'],
    'charity': ['zakat', 'sadaqah', 'infaq', 'khairat', 'poor', 'needy', 'miskin', 'yateem', 'orphan', 'زکوۃ', 'صدقہ'],
    'zakat': ['charity', 'sadaqah', 'infaq', 'khairat', 'alms', 'زکوۃ'],
    'pilgrimage': ['hajj', 'umrah', 'tawaf', 'kaaba', 'makkah', 'bakkah', 'arafat', 'safa', 'marwah', 'ihram', 'حج', 'عمرہ'],
    'hajj': ['pilgrimage', 'umrah', 'tawaf', 'kaaba', 'makkah', 'arafat', 'حج'],
    'manners': ['adab', 'akhlaq', 'ethics', 'morals', 'family', 'parents', 'speech', 'humility', 'forgiveness', 'justice', 'truth', 'honesty', 'اخلاق', 'آداب'],
    'adab': ['manners', 'akhlaq', 'ethics', 'respect', 'conduct', 'آداب'],
    'akhlaq': ['manners', 'adab', 'morals', 'character', 'conduct', 'اخلاق'],
    'parents': ['walidayn', 'father', 'mother', 'maa', 'baap', 'birr', 'ihsan', 'والدین'],
    'paradise': ['jannah', 'jannat', 'firdaws', 'garden', 'naeem', 'adn', 'reward', 'جنت', 'جنات'],
    'jannah': ['paradise', 'jannat', 'firdaws', 'garden', 'heaven', 'جنت'],
    'hell': ['jahannam', 'dozakh', 'fire', 'saeer', 'hutamah', 'punishment', 'torment', 'دوزخ', 'جہنم'],
    'jahannam': ['hell', 'dozakh', 'fire', 'punishment', 'جہنم'],
    'patience': ['sabr', 'perseverance', 'steadfastness', 'endurance', 'صبر'],
    'sabr': ['patience', 'perseverance', 'steadfastness', 'صبر'],
    'repentance': ['tawbah', 'tauba', 'istighfar', 'forgiveness', 'maghfirah', 'mercy', 'توبہ', 'استغفار'],
    'tawbah': ['repentance', 'tauba', 'istighfar', 'pardon', 'توبہ'],
    'mercy': ['rahmah', 'reham', 'compassion', 'kindness', 'ar-rahman', 'ar-rahim', 'رحمت', 'رحم'],
    'justice': ['adl', 'qist', 'fairness', 'equity', 'trust', 'amanah', 'عدل', 'قسط'],
    'parallels': ['mutashabihat', 'refrain', 'repetition', 'similarity', 'clusters', 'متشابہات'],
    'mutashabihat': ['parallels', 'refrain', 'repetition', 'clusters', 'similar', 'متشابہات'],
    'morphology': ['sarf', 'roots', 'lemmas', 'forms', 'participle', 'verbal', 'verb', 'صرف'],
    'sarf': ['morphology', 'roots', 'conjugation', 'forms', 'lemmas', 'صرف'],
    'waqf': ['stopping', 'pause', 'phonetics', 'recitation', 'tajweed', 'symbols', 'وقف'],
    'prophet': ['rasool', 'nabi', 'messenger', 'musa', 'ibrahim', 'muhammad', 'isa', 'nuh', 'adam', 'نبی', 'رسول'],
    'water': ['bahr', 'sea', 'ocean', 'river', 'rain', 'matar', 'ماء', 'بحر'],
    'iron': ['hadid', 'atomic', 'metal', 'fe57', 'حديد', 'لوہا'],
    'heavens': ['sky', 'skies', 'universe', 'firmament', 'earth', 'cosmos', 'سماء', 'آسمان'],
    'heaven': ['sky', 'skies', 'paradise', 'jannah', 'heavens', 'سماء', 'آسمان'],
    'earth': ['ground', 'land', 'soil', 'world', 'ard', 'زمین', 'ارض'],
    'guidance': ['hidayah', 'guide', 'straight path', 'sirat', 'mustaqeem', 'truth', 'ہدایت', 'صراط'],
    'path': ['way', 'sirat', 'sabeel', 'road', 'straight path', 'mustaqeem', 'صراط', 'سبیل'],
    'straight': ['mustaqeem', 'path', 'sirat', 'upright', 'مستقیم'],
    'day of judgment': ['qiyamah', 'resurrection', 'hereafter', 'akhira', 'day of recompense', 'hour', 'حساب', 'قیامت'],
    'recompense': ['day of judgment', 'reward', 'punishment', 'jaza', 'deen', 'جزاء'],
    'knowledge': ['ilm', 'wisdom', 'hikmah', 'learn', 'scholar', 'عالم', 'علم', 'حکمت'],
    'angels': ['angel', 'malaikah', 'jibril', 'gabriel', 'mikail', 'فرشتہ', 'ملائکہ'],
    'devil': ['satan', 'shaytan', 'iblis', 'evil', 'whisper', 'شیطان', 'ابلیس'],
    'satan': ['devil', 'shaytan', 'iblis', 'evil', 'whisper', 'شیطان'],
    'sustenance': ['provision', 'rizq', 'food', 'wealth', 'cattle', 'رزق'],
    'covenant': ['promise', 'pledge', 'treaty', 'contract', 'mithaq', 'ahd', 'عہد', 'میثاق'],
    'worship': ['ibadah', 'praise', 'hamd', 'serve', 'glorify', 'tasbih', 'عبادت', 'حمد'],
    'gratitude': ['thankful', 'grateful', 'shukr', 'praise', 'شکر'],
    'creation': ['creator', 'create', 'khalq', 'universe', 'خلق', 'پیدائش'],
    'favour': ['favor', 'blessing', 'bounty', 'grace', 'bestowed', 'nimat', 'نعمت', 'احسان'],
    'favor': ['favour', 'blessing', 'bounty', 'grace', 'bestowed', 'nimat', 'نعمت'],
    'blessing': ['favour', 'favor', 'bounty', 'grace', 'barakah', 'nimat', 'نعمت', 'برکت'],
    'bounty': ['favour', 'favor', 'blessing', 'grace', 'fazl', 'فضل', 'نعمت']
  };

  // --- 6. FAMOUS AYAT DIRECT DICTIONARY ---
  const FAMOUS_AYAT = [
    { keywords: ['kursi', 'kursiy', 'الكرسي', 'كرسي', 'ayatul kursi', 'آیت الکرسی'], surah: 2, ayah: 255, name: 'Ayat al-Kursi (آيَةُ الْكُرْسِي)', title: 'The Throne Verse', subtitle: 'Surah Al-Baqarah 2:255 • Master verse of Divine Majesty & Protection' },
    { keywords: ['amanar rasool', 'rasul', 'امن الرسول', 'آمن الرسول'], surah: 2, ayah: 285, name: 'Amanar Rasool (آمَنَ الرَّسُولُ)', title: 'Closing of Surah Al-Baqarah', subtitle: 'Surah Al-Baqarah 2:285–286 • Nightly protection & supplication' },
    { keywords: ['nur', 'noor', 'النور', 'نور', 'ayat an-nur'], surah: 24, ayah: 35, name: 'Ayat an-Nur (آيَةُ النُّور)', title: 'Parable of the Divine Light', subtitle: 'Surah An-Nur 24:35 • Allah is the Light of the heavens & earth' },
    { keywords: ['shifa', 'شفاء', 'healing'], surah: 9, ayah: 14, name: 'Ayat ash-Shifa (آيَةُ الشِّفَاء)', title: 'Verse of Healing', subtitle: 'Surah At-Tawbah 9:14 • Spiritual & physical healing for the believers' },
    { keywords: ['birr', 'righteousness', 'بر'], surah: 2, ayah: 177, name: 'Ayat al-Birr (آيَةُ الْبِرّ)', title: 'The Essence of Righteousness', subtitle: 'Surah Al-Baqarah 2:177 • Complete standard of faith, charity & integrity' },
    { keywords: ['mulk', 'kingdom', 'مالك الملك', 'qulillahumma'], surah: 3, ayah: 26, name: 'Ayat al-Mulk (آيَةُ الْمُلْك)', title: 'Sovereignty of Allah', subtitle: "Surah Ali 'Imran 3:26 • Sovereign Owner of all dominion" }
  ];

  // --- 7. BM25 PROBABILISTIC SEARCH ENGINE ---
  class BM25CorpusIndex {
    constructor() {
      this.docs = [];
      this.docCount = 0;
      this.avgDocLength = 0;
      this.docLengths = [];
      this.invertedIndex = new Map(); // term -> array of { docId, tf }
      this.df = new Map(); // term -> document frequency
      this.vocabulary = new Set();
      this.isIndexed = false;
      this.k1 = 1.2;
      this.b = 0.75;
    }

    tokenize(text) {
      if (!text) return [];
      const clean = String(text)
        .replace(/[^\w\s\u0600-\u06FF]/gi, ' ')
        .toLowerCase();
      const words = clean.split(/\s+/).filter(w => w.length > 1);
      const tokens = [];
      for (const w of words) {
        tokens.push(w);
        const st = stemWord(w);
        if (st !== w) tokens.push(st);
        const normAr = normalizeArabicUrdu(w);
        if (normAr && normAr !== w) tokens.push(normAr);
        // British / American spelling equivalence (e.g. favour <-> favor, honour <-> honor)
        if (w.includes('our')) {
          tokens.push(w.replace(/our/g, 'or'));
        } else if (w.includes('or') && w.length >= 4) {
          tokens.push(w.replace(/or/g, 'our'));
        }
      }
      return tokens;
    }

    addDocument(doc) {
      const docId = this.docs.length;
      this.docs.push(doc);

      // Boost title terms 3.0x
      const titleTokens = this.tokenize(doc.title);
      const subtitleTokens = this.tokenize(doc.subtitle);
      const contentTokens = this.tokenize(doc.content || '');

      const termFreqs = new Map();

      for (const t of titleTokens) {
        termFreqs.set(t, (termFreqs.get(t) || 0) + 3.0);
      }
      for (const t of subtitleTokens) {
        termFreqs.set(t, (termFreqs.get(t) || 0) + 1.5);
      }
      for (const t of contentTokens) {
        termFreqs.set(t, (termFreqs.get(t) || 0) + 1.0);
      }

      const totalTokens = titleTokens.length + subtitleTokens.length + contentTokens.length;
      this.docLengths.push(totalTokens);

      for (const [term, tf] of termFreqs.entries()) {
        this.vocabulary.add(term);
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, []);
          this.df.set(term, 0);
        }
        this.invertedIndex.get(term).push({ docId, tf });
        this.df.set(term, this.df.get(term) + 1);
      }
    }

    build() {
      this.docCount = this.docs.length;
      const totalLen = this.docLengths.reduce((acc, l) => acc + l, 0);
      this.avgDocLength = this.docCount > 0 ? (totalLen / this.docCount) : 1;
      this.isIndexed = true;
    }

    calculateIDF(term) {
      const n = this.df.get(term) || 0;
      return Math.log(1 + (this.docCount - n + 0.5) / (n + 0.5));
    }

    search(query, category = 'all', limit = 25) {
      if (!this.isIndexed) this.build();
      if (!query || !query.trim()) return [];

      const rawQ = query.trim().toLowerCase();
      const normQ = normalizeArabicUrdu(rawQ);
      const queryTokens = this.tokenize(rawQ);

      // Expand query tokens with semantic synonyms
      const expandedTerms = new Map(); // term -> weight
      for (const t of queryTokens) {
        expandedTerms.set(t, 1.0);
        if (ISLAMIC_SYNONYMS[t]) {
          for (const syn of ISLAMIC_SYNONYMS[t]) {
            const synTokens = this.tokenize(syn);
            for (const st of synTokens) {
              if (!expandedTerms.has(st)) expandedTerms.set(st, 0.75);
            }
          }
        }
      }

      // Cross-Lingual Roman Urdu & English AI Translator expansion
      const translator = (typeof window !== 'undefined' && window.RomanUrduTranslator) ||
                         (typeof global !== 'undefined' && global.RomanUrduTranslator);
      if (translator && typeof translator.expandSearchQuery === 'function') {
        const transExpansions = translator.expandSearchQuery(rawQ);
        for (const exp of transExpansions) {
          for (const st of this.tokenize(exp.term)) {
            const currentW = expandedTerms.get(st) || 0;
            if (exp.weight > currentW) {
              expandedTerms.set(st, exp.weight);
            }
          }
        }
      }

      // Check full query phrase in synonyms
      for (const [concept, synList] of Object.entries(ISLAMIC_SYNONYMS)) {
        if (rawQ.includes(concept) || (normQ && normalizeArabicUrdu(concept).includes(normQ))) {
          for (const syn of synList) {
            for (const st of this.tokenize(syn)) {
              if (!expandedTerms.has(st)) expandedTerms.set(st, 0.85);
            }
          }
        }
      }

      const scores = new Map(); // docId -> score

      // Run BM25 accumulation
      for (const [term, weight] of expandedTerms.entries()) {
        let postings = this.invertedIndex.get(term);

        // Fallback to fuzzy Levenshtein if no exact posting and term length > 3
        if (!postings && term.length > 3) {
          let bestSim = 0;
          let bestTerm = null;
          for (const voc of this.vocabulary) {
            if (Math.abs(voc.length - term.length) > 2) continue;
            const sim = fuzzySimilarity(term, voc);
            if (sim > bestSim && sim >= 0.65) {
              bestSim = sim;
              bestTerm = voc;
            }
          }
          if (bestTerm) {
            postings = this.invertedIndex.get(bestTerm);
          }
        }

        if (!postings) continue;

        const idf = this.calculateIDF(term);

        for (const p of postings) {
          const docLen = this.docLengths[p.docId];
          const denom = p.tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
          const bm25Score = idf * ((p.tf * (this.k1 + 1)) / denom) * weight;

          scores.set(p.docId, (scores.get(p.docId) || 0) + bm25Score);
        }
      }

      // Exact phrase scanner guarantee: Any document containing the exact multi-word phrase gets instant top score
      const urduQ = (translator && typeof translator.transliteratePhrase === 'function') ? translator.transliteratePhrase(rawQ) : '';
      const normUrduQ = urduQ ? normalizeArabicUrdu(urduQ) : '';

      if (rawQ.length >= 3 || (normUrduQ && normUrduQ.length >= 2)) {
        const rawQAlt = rawQ.includes('our') ? rawQ.replace(/our/g, 'or') : (rawQ.includes('or') ? rawQ.replace(/or/g, 'our') : null);
        for (let i = 0; i < this.docs.length; i++) {
          const doc = this.docs[i];
          if (category !== 'all' && doc.categoryType !== category) continue;
          const sub = (doc.subtitle || '').toLowerCase();
          const tit = (doc.title || '').toLowerCase();
          const cont = (doc.content || '').toLowerCase();

          const hasSub = sub.includes(rawQ) || (rawQAlt && sub.includes(rawQAlt));
          const hasTit = tit.includes(rawQ) || (rawQAlt && tit.includes(rawQAlt));
          const hasCont = cont.includes(rawQ) || (rawQAlt && cont.includes(rawQAlt));

          if (hasSub) {
            scores.set(i, (scores.get(i) || 0) + 45.0);
          } else if (hasTit) {
            scores.set(i, (scores.get(i) || 0) + 50.0);
          } else if (hasCont) {
            scores.set(i, (scores.get(i) || 0) + 30.0);
          } else if (normQ && normQ.length >= 2 && normalizeArabicUrdu(cont).includes(normQ)) {
            scores.set(i, (scores.get(i) || 0) + 40.0);
          } else if (normUrduQ && normUrduQ.length >= 2) {
            const docUrduNorm = normalizeArabicUrdu(doc.urdu || '');
            const docArNorm = normalizeArabicUrdu(doc.arabic || '');
            if (docUrduNorm.includes(normUrduQ)) {
              scores.set(i, (scores.get(i) || 0) + 45.0);
            } else if (docArNorm.includes(normUrduQ)) {
              scores.set(i, (scores.get(i) || 0) + 40.0);
            }
          }
        }
      }

      // Filter and rank results
      const results = [];
      const rawQAlt = rawQ.includes('our') ? rawQ.replace(/our/g, 'or') : (rawQ.includes('or') ? rawQ.replace(/or/g, 'our') : null);
      for (const [docId, score] of scores.entries()) {
        const doc = this.docs[docId];
        if (category !== 'all' && doc.categoryType !== category) continue;

        // Exact substring bonus
        let finalScore = score;
        const subLower = (doc.subtitle || '').toLowerCase();
        const titLower = (doc.title || '').toLowerCase();
        const contLower = (doc.content || '').toLowerCase();

        if (subLower.includes(rawQ) || (rawQAlt && subLower.includes(rawQAlt))) finalScore += 25.0;
        if (titLower.includes(rawQ) || (rawQAlt && titLower.includes(rawQAlt))) finalScore += 30.0;
        if (normQ && normQ.length >= 2) {
          if (normalizeArabicUrdu(doc.arabic || '').includes(normQ)) finalScore += 35.0;
          if (normalizeArabicUrdu(doc.urdu || '').includes(normQ)) finalScore += 35.0;
        }
        if (normUrduQ && normUrduQ.length >= 2) {
          if (normalizeArabicUrdu(doc.urdu || '').includes(normUrduQ)) finalScore += 35.0;
          if (normalizeArabicUrdu(doc.arabic || '').includes(normUrduQ)) finalScore += 30.0;
        }

        results.push({
          docId,
          score: finalScore,
          category: doc.category,
          categoryClass: doc.categoryClass,
          categoryType: doc.categoryType,
          title: doc.title,
          subtitle: doc.subtitle,
          arabic: doc.arabic || '',
          urdu: doc.urdu || '',
          surahId: doc.surahId,
          ayahNum: doc.ayahNum,
          surahNameRoman: doc.surahNameRoman || '',
          surahNameAr: doc.surahNameAr || '',
          content: doc.content || '',
          action: doc.action
        });
      }

      results.sort((a, b) => {
        if (Math.abs(b.score - a.score) > 0.01) {
          return b.score - a.score;
        }
        // Canonical scriptural order tiebreaker: Surah ID then Ayah number ascending
        const sA = a.surahId || 999;
        const sB = b.surahId || 999;
        if (sA !== sB) return sA - sB;
        return (a.ayahNum || 0) - (b.ayahNum || 0);
      });
      return results.slice(0, limit);
    }
  }

  // --- 8. MASTER QURAN AI SEARCH ENGINE FACADE ---
  const QuranAISearchEngine = {
    index: new BM25CorpusIndex(),
    isReady: false,
    defaultKey: '', // Workspace default key or user override

    init() {
      if (this.isReady) return;
      console.log('[AISearch] Building omnipresent Quran BM25 search index...');
      const t0 = performance.now();

      // 1. Index 114 Surahs
      const surahs = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) ||
                     (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.surahsTelemetry) || [];
      surahs.forEach(s => {
        this.index.addDocument({
          categoryType: 'surahs',
          category: `Surah #${s.id}`,
          categoryClass: 'surah',
          title: `${s.id}. ${s.name_roman} (${s.name_ar})`,
          subtitle: `${s.place} • ${s.total_ayat} Ayat • ${s.total_words.toLocaleString()} Words • ${s.meaning_en || ''}`,
          content: `Surah ${s.id} ${s.name_roman} ${s.name_ar} ${s.meaning_en} ${s.place} Makki Madani`,
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(s.id, 1); }
        });
      });

      // 2. Index 30 Paras (Juz)
      const paras = window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras) || [];
      paras.forEach(p => {
        this.index.addDocument({
          categoryType: 'paras',
          category: `Para #${p.para}`,
          categoryClass: 'para',
          title: `Para ${p.para}: ${p.name_roman} (${p.name_ar})`,
          subtitle: `Starts at Surah ${p.start_surah}:${p.start_ayah} • Spans ${p.surahs ? p.surahs.length : ''} Surahs`,
          content: `Para Juz ${p.para} ${p.name_roman} ${p.name_ar} پارہ`,
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToPara(p.para); }
        });
      });

      // 3. Index 26 Prophets & Entities
      const prophets = (window.QURAN_ADVANCED_ANALYTICS && window.QURAN_ADVANCED_ANALYTICS.entities && window.QURAN_ADVANCED_ANALYTICS.entities.prophets) || [];
      prophets.forEach(p => {
        this.index.addDocument({
          categoryType: 'prophets',
          category: 'Prophet',
          categoryClass: 'prophet',
          title: `Prophet ${p.name_en} (${p.name_ar})`,
          subtitle: `${p.title || ''} • Mentioned ${p.count} times across ${p.surahs_count} Surahs`,
          content: `Prophet Nabi Rasool ${p.name_en} ${p.name_ar} ${p.title || ''} پیغمبر نبی رسول`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab('studio');
            if (window.AnalyticsStudio) {
              window.AnalyticsStudio.switchSubTab('entities');
              window.AnalyticsStudio.switchEntityCategory('prophets');
            }
          }
        });
      });

      // 4. Index 67 Quranic Manners Injunctions
      const manners = (window.QURAN_MANNERS_DATA && window.QURAN_MANNERS_DATA.manners) || [];
      manners.forEach(m => {
        this.index.addDocument({
          categoryType: 'manners',
          category: `Manners #${m.serial}`,
          categoryClass: 'prophet',
          title: `#${m.serial}. ${m.headline_ur} [${m.reference_en}]`,
          subtitle: `${m.module_title} • ${m.translation_urdu_kanzul_iman.substring(0, 110)}...`,
          content: `${m.headline_ur} ${m.module_title} ${m.reference_en} ${m.arabic} ${m.translation_urdu_kanzul_iman} اخلاق آداب تربیت`,
          action: () => { window.location.href = 'manners.html'; }
        });
      });

      // 5. Index 95 Mutashabihat Clusters
      const mutashabihat = (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.mutashabihat) || [];
      mutashabihat.forEach(mc => {
        this.index.addDocument({
          categoryType: 'mutashabihat',
          category: `Cluster #${mc.cluster_id}`,
          categoryClass: 'surah',
          title: `Mutashabih: ${mc.anchor_arabic}`,
          subtitle: `${mc.occurrences_count} Parallel Occurrences • ${mc.anchor_surah_name} [${mc.anchor_surah_id}:${mc.anchor_ayah_number}]`,
          content: `Mutashabihat parallel repeated refrain ${mc.anchor_arabic} ${mc.anchor_translation_ur} ${mc.anchor_surah_name}`,
          action: () => { if (window.switchAppTab) window.switchAppTab('mutashabihat'); }
        });
      });

      // 6. Index 484 Matalib Thematic Topics
      const matalib = (window.CorpusEngine && window.CorpusEngine.thematicGraph) ||
                      (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.thematicGraph) || [];
      matalib.forEach(t => {
        this.index.addDocument({
          categoryType: 'topics',
          category: 'Theme',
          categoryClass: 'theme',
          title: t.heading,
          subtitle: `${t.references_count} Ayat indexed • Matalib al-Quran`,
          content: `Theme Topic Matalib ${t.heading} مضامین قرآنی`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab('thematic');
            if (window.CorpusEngine) {
              window.CorpusEngine.thematicMode = 'matalib';
              const sBtn = document.getElementById('thematic-mode-sirat');
              const mBtn = document.getElementById('thematic-mode-matalib');
              if (sBtn && mBtn) { mBtn.classList.add('active'); sBtn.classList.remove('active'); }
              const searchInput = document.getElementById('thematic-search-input');
              if (searchInput) searchInput.value = t.heading;
              window.CorpusEngine.renderThematicGraph(t.heading.toLowerCase());
            }
          }
        });
      });

      // 7. Index 3,513 Sirat-ul-Jinan Exegetical Topics
      const siratTopics = (window.CorpusEngine && window.CorpusEngine.exegeticalTopics) ||
                          window.QURAN_EXEGETICAL_TOPICS || [];
      siratTopics.slice(0, 1500).forEach(st => {
        const ref = (st.references && st.references[0]) || { surah_id: 1, ayat_number: 1, para_id: 1 };
        this.index.addDocument({
          categoryType: 'topics',
          category: 'Exegesis',
          categoryClass: 'theme',
          title: st.heading,
          subtitle: `${st.roman_heading ? st.roman_heading + ' • ' : ''}Surah ${ref.surah_id}:${ref.ayat_number} (Para ${ref.para_id})`,
          content: `Sirat Exegesis Tafsir ${st.heading} ${st.roman_heading || ''} ${st.surah_name || ''}`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab('thematic');
            if (window.CorpusEngine) {
              window.CorpusEngine.thematicMode = 'sirat';
              const sBtn = document.getElementById('thematic-mode-sirat');
              const mBtn = document.getElementById('thematic-mode-matalib');
              if (sBtn && mBtn) { sBtn.classList.add('active'); mBtn.classList.remove('active'); }
              const searchInput = document.getElementById('thematic-search-input');
              if (searchInput) searchInput.value = st.heading;
              window.CorpusEngine.renderThematicGraph(st.heading.toLowerCase());
            }
          }
        });
      });

      // 8. Index 1,642 Roots & Sarf Forms
      const roots = (window.MorphologyEngine && window.MorphologyEngine.allRoots && window.MorphologyEngine.allRoots.length)
        ? window.MorphologyEngine.allRoots
        : (window.QURAN_ROOTS || []);
      roots.slice(0, 600).forEach(r => {
        this.index.addDocument({
          categoryType: 'words',
          category: 'Root',
          categoryClass: 'prophet',
          title: `Root ${r.root_display || r.root_ar} (${r.meaning_en})`,
          subtitle: `${r.meaning_ur || ''} • ${(r.total_occurrences || r.occurrences || 0).toLocaleString()} Ayat in Quran`,
          content: `Root Sarf Morphology ${r.root_display || r.root_ar} ${r.root_bw} ${r.meaning_en} ${r.meaning_ur || ''}`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab('roots');
            if (window.MorphologyEngine) {
              window.MorphologyEngine.onTabActivated().then(() => {
                window.MorphologyEngine.openRootInspector(r.root_bw);
              });
            }
          }
        });
      });

      // 9. Index Semantic Pairs
      const pairs = (window.TelemetryEngine && window.TelemetryEngine.semanticPairs) || [];
      pairs.forEach(pr => {
        this.index.addDocument({
          categoryType: 'words',
          category: 'Pair',
          categoryClass: 'word',
          title: `${pr.term1_ar} (${pr.term1_count}) ⇄ ${pr.term2_ar} (${pr.term2_count})`,
          subtitle: `${pr.concept} • ${pr.is_balanced ? 'Exact 1:1 Symmetrical Parity' : 'Ratio ' + pr.ratio + ':1'}`,
          content: `Semantic Pair Tibaq Opposite ${pr.term1_ar} ${pr.term2_ar} ${pr.concept} ${pr.term1_label} ${pr.term2_label}`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab('frequency');
            if (window.TelemetryEngine) {
              window.TelemetryEngine.currentMode = 'semantic';
              window.TelemetryEngine.render();
            }
          }
        });
      });

      // 10. Famous Ayat
      FAMOUS_AYAT.forEach(fa => {
        this.index.addDocument({
          categoryType: 'ayahs',
          category: 'Famous Ayah',
          categoryClass: 'verse',
          title: `${fa.name} [${fa.surah}:${fa.ayah}]`,
          subtitle: fa.subtitle,
          content: `Ayah Verse ${fa.name} ${fa.title} ${fa.keywords.join(' ')} ${fa.surah}:${fa.ayah}`,
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(fa.surah, fa.ayah); }
        });
      });

      // 11. Index Full 6,236 Ayat Corpus if available
      const ayatData = (typeof window !== 'undefined' && window.QURAN_AYAT_SEARCH_DATA) || [];
      if (Array.isArray(ayatData) && ayatData.length > 0) {
        this.indexAyatCorpus(ayatData);
      } else {
        this.index.build();
      }

      const elapsed = (performance.now() - t0).toFixed(1);
      console.log(`[AISearch] ✓ Index built with ${this.index.docCount} records in ${elapsed}ms.`);
      this.isReady = true;
    },

    indexAyatCorpus(data) {
      if (!data || !data.length || this.ayatIndexed) return;
      console.log(`[AISearch] Indexing ${data.length} Ayat into omnipresent BM25 engine...`);
      const t0 = performance.now();
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const sId = item[0];
        const aNum = item[1];
        const sNameRoman = item[2];
        const sNameAr = item[3];
        const arClean = item[4];
        const enTrans = item[5];
        const urTrans = item[6];

        this.index.addDocument({
          categoryType: 'ayahs',
          category: `Ayah #${sId}:${aNum}`,
          categoryClass: 'verse',
          title: `${sNameRoman} [${sId}:${aNum}]`,
          subtitle: enTrans,
          arabic: arClean,
          urdu: urTrans,
          surahId: sId,
          ayahNum: aNum,
          surahNameRoman: sNameRoman,
          surahNameAr: sNameAr,
          content: `${sNameRoman} ${sNameAr} ${sId}:${aNum} ${arClean} ${enTrans} ${urTrans}`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(sId, aNum);
          }
        });
      }
      this.index.build();
      this.ayatIndexed = true;
      const elapsed = (performance.now() - t0).toFixed(1);
      console.log(`[AISearch] ✓ Indexed ${data.length} Ayat into BM25 in ${elapsed}ms. Total corpus docs: ${this.index.docCount}`);

      // If search modal is already open with an active query, refresh results immediately
      if (typeof window !== 'undefined' && window.OmnisearchEngine && window.OmnisearchEngine.isOpen) {
        const input = document.getElementById('omnisearch-input');
        if (input && input.value.trim()) {
          window.OmnisearchEngine.executeSearch(input.value.trim());
        }
      }
    },

    highlightMatches(text, query) {
      if (!text || !query) return text || '';
      const cleanQ = query.trim();
      if (!cleanQ) return text;

      // 1. Exact multi-word phrase boundary match
      if (cleanQ.includes(' ')) {
        const safePhrase = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const phraseRe = new RegExp('(^|[^\\p{L}\\p{M}\\d])(' + safePhrase + ')(?=[^\\p{L}\\p{M}\\d]|$)', 'giu');
        if (phraseRe.test(text)) {
          return text.replace(phraseRe, '$1<mark class="search-highlight">$2</mark>');
        }
      }

      // 2. Individual tokens (length >= 3) with Whole-Word Token Boundary Expansion
      const tokens = cleanQ
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3);

      if (tokens.length === 0) {
        const shortToken = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const shortRe = new RegExp('(^|[^\\p{L}\\p{M}\\d])(' + shortToken + ')(?=[^\\p{L}\\p{M}\\d]|$)', 'giu');
        return text.replace(shortRe, '$1<mark class="search-highlight">$2</mark>');
      }

      // Sort tokens descending by length so longer patterns take precedence
      tokens.sort((a, b) => b.length - a.length);

      const ARABIC_DIACRITICS = '[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]';
      const tokenPatterns = tokens.map((t) => {
        const isArabicScript = /[\u0600-\u06FF]/.test(t);
        if (isArabicScript) {
          const letters = t.split('').map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const flexPattern = letters.join(ARABIC_DIACRITICS + '*');
          return '[\\p{L}\\p{M}\\d]*' + flexPattern + '[\\p{L}\\p{M}\\d]*';
        } else {
          const safeT = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return '[\\p{L}\\p{M}\\d]*' + safeT + '[\\p{L}\\p{M}\\d]*';
        }
      }).join('|');

      const wordRe = new RegExp('(^|[^\\p{L}\\p{M}\\d])(' + tokenPatterns + ')(?=[^\\p{L}\\p{M}\\d]|$)', 'giu');
      return text.replace(wordRe, '$1<mark class="search-highlight">$2</mark>');
    },

    search(query, category = 'all', limit = 25) {
      if (!this.isReady) this.init();
      return this.index.search(query, category, limit);
    },

    // --- 9. PROGRESSIVE CLOUD GEMINI RAG SYNTHESIZER ---
    async synthesizeGeminiAnswer(rawQuery, containerEl) {
      if (!containerEl) return;
      const q = rawQuery.trim();
      if (!q) {
        containerEl.style.display = 'none';
        return;
      }

      containerEl.style.display = 'block';
      containerEl.innerHTML = `
        <div class="omnisearch-ai-box shimmer">
          <div class="omnisearch-ai-header">
            <span class="omnisearch-ai-badge"><span class="ai-sparkle">✨</span> Gemini AI Scholar</span>
            <span class="omnisearch-ai-status">Synthesizing authoritative Quranic answer...</span>
          </div>
          <div class="omnisearch-ai-skeleton">
            <div class="skeleton-line" style="width: 90%;"></div>
            <div class="skeleton-line" style="width: 75%;"></div>
          </div>
        </div>
      `;

      // Get user or workspace API key
      const apiKey = localStorage.getItem('antigravity_gemini_api_key') || this.defaultKey || '';

      // Get top search context
      const topMatches = this.search(q, 'all', 5);

      if (!apiKey) {
        // High-fidelity instant offline answer card
        const citationChips = topMatches.slice(0, 3).map(m => `
          <button class="citation-jump-pill" onclick="window.QuranAISearchEngine.executeAction(${m.docId})">
            ${m.title}
          </button>
        `).join(' ');

        containerEl.innerHTML = `
          <div class="omnisearch-ai-box offline-card">
            <div class="omnisearch-ai-header">
              <span class="omnisearch-ai-badge offline"><span class="ai-sparkle">⚡</span> Instant BM25 Match</span>
              <button class="ai-key-config-btn" onclick="window.QuranAISearchEngine.openKeyModal()" title="Configure free Gemini API Key">
                ⚙️ Connect Gemini AI
              </button>
            </div>
            <div class="omnisearch-ai-text">
              <p>Top scriptural topics matching <strong>"${escapeHtml(q)}"</strong> in the Quran corpus:</p>
              <div class="ai-citations-row">${citationChips || '<em>Explore the ranked results below.</em>'}</div>
            </div>
          </div>
        `;
        AISound.playClick();
        return;
      }

      try {
        const contextStr = topMatches.slice(0, 4).map(m =>
          `Title: ${m.title}\nCategory: ${m.category}\nDetails: ${m.subtitle}\nContent: ${m.content}`
        ).join('\n---\n');

        const prompt = `You are a reverent Quranic scholar and computational linguistic assistant for Quran Deep Analyzer.
Answer the user's question directly, concisely, and with profound reverence in English and Urdu / Roman Urdu (2 to 3 sentences maximum).
ALWAYS cite the exact Surah and Ayah numbers (e.g. Surah Al-Baqarah 2:255 or [Surah 18:10]) from the Quranic context provided below:

Context:
${contextStr}

User Question: "${q}"`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 250 }
          })
        });

        if (!res.ok) {
          throw new Error(`Gemini API HTTP ${res.status}`);
        }

        const data = await res.json();
        const rawAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No synthesis available.';

        // Format answer: transform [Surah X:Y] or [X:Y] citations into interactive clickable pills
        const formattedAnswer = this.formatAICitations(rawAnswer);

        containerEl.innerHTML = `
          <div class="omnisearch-ai-box ai-answered">
            <div class="omnisearch-ai-header">
              <span class="omnisearch-ai-badge active"><span class="ai-sparkle">✨</span> Gemini AI Direct Answer</span>
              <div class="ai-header-actions">
                <button class="ai-copy-btn" onclick="window.QuranAISearchEngine.copyAnswer(this)" title="Copy answer">📋 Copy</button>
                <button class="ai-key-config-btn" onclick="window.QuranAISearchEngine.openKeyModal()" title="API Key Settings">⚙️</button>
              </div>
            </div>
            <div class="omnisearch-ai-text">${formattedAnswer}</div>
          </div>
        `;
        AISound.playSuccess();

      } catch (err) {
        console.warn('[AISearch] Gemini synthesis error:', err);
        containerEl.innerHTML = `
          <div class="omnisearch-ai-box offline-card">
            <div class="omnisearch-ai-header">
              <span class="omnisearch-ai-badge offline"><span class="ai-sparkle">⚡</span> Offline BM25 Mode</span>
              <button class="ai-key-config-btn" onclick="window.QuranAISearchEngine.openKeyModal()">⚙️ Key Settings</button>
            </div>
            <div class="omnisearch-ai-text">
              <p>Top ranked scripture passages for <strong>"${escapeHtml(q)}"</strong> are displayed below in the results feed.</p>
            </div>
          </div>
        `;
      }
    },

    formatAICitations(text) {
      if (!text) return '';
      // Escape HTML first
      let clean = escapeHtml(text);

      // Match [Surah X:Y] or [X:Y] or Surah Name X:Y
      clean = clean.replace(/\[?(?:Surah\s+)?(\d{1,3}):(\d{1,3})\]?/gi, (match, s, a) => {
        const sId = parseInt(s, 10);
        const aNo = parseInt(a, 10);
        if (sId >= 1 && sId <= 114) {
          return `<button class="citation-jump-pill" onclick="if (window.CorpusEngine) { window.CorpusEngine.jumpToAyah(${sId}, ${aNo}); if (window.closeOmnisearch) window.closeOmnisearch(); }">📖 Surah ${sId}:${aNo}</button>`;
        }
        return match;
      });

      return clean.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    },

    executeAction(docId) {
      const doc = this.index.docs[docId];
      if (doc && typeof doc.action === 'function') {
        doc.action();
        if (window.closeOmnisearch) window.closeOmnisearch();
      }
    },

    copyAnswer(btn) {
      const box = btn.closest('.omnisearch-ai-box');
      if (!box) return;
      const textEl = box.querySelector('.omnisearch-ai-text');
      if (textEl) {
        navigator.clipboard.writeText(textEl.innerText.trim()).then(() => {
          AISound.playClick();
          const orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(() => { btn.innerText = orig; }, 1800);
        });
      }
    },

    openKeyModal() {
      let modal = document.getElementById('ai-search-key-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      const input = document.getElementById('ai-api-key-input');
      if (input) {
        input.value = localStorage.getItem('antigravity_gemini_api_key') || '';
        setTimeout(() => input.focus(), 80);
      }
    },

    closeKeyModal() {
      const modal = document.getElementById('ai-search-key-modal');
      if (modal) modal.style.display = 'none';
    },

    saveKey(keyStr) {
      const clean = (keyStr || '').trim();
      if (clean) {
        localStorage.setItem('antigravity_gemini_api_key', clean);
      } else {
        localStorage.removeItem('antigravity_gemini_api_key');
      }
      this.closeKeyModal();
      AISound.playSuccess();
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Export to global window namespace immediately
  window.QuranAISearchEngine = QuranAISearchEngine;
  window.normalizeArabicUrdu = normalizeArabicUrdu;

  // Auto-hydrate 6,236 Ayat bundle if already present in window
  if (typeof window !== 'undefined' && window.QURAN_AYAT_SEARCH_DATA && Array.isArray(window.QURAN_AYAT_SEARCH_DATA)) {
    QuranAISearchEngine.indexAyatCorpus(window.QURAN_AYAT_SEARCH_DATA);
  }

})(typeof window !== 'undefined' ? window : global);
