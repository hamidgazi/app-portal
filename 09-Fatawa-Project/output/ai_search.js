/**
 * ============================================================================
 * Antigravity Universal AI Search Kit (ai_search.js)
 * ============================================================================
 * Production-ready, zero-dependency hybrid search engine and Spotlight palette.
 * 
 * Features:
 *  - 100% Client-Side & Offline by default (zero API keys required)
 *  - BM25 Probabilistic Relevance Ranking (Term Frequency + Inverse Document Frequency)
 *  - Morphological Tokenizer & Stemming
 *  - N-Gram & Levenshtein Distance Fuzzy Spelling Tolerance
 *  - Semantic Synonym Expansion Graph
 *  - Automatic DOM Content Crawler (zero-config page indexing)
 *  - Universal Spotlight Command Palette (Ctrl+K / Cmd+K)
 *  - Procedural Non-Musical Acoustic UI Feedback (Web Audio API)
 *  - Smooth Auto-Scroll & Pulsing Visual Section Illuminator
 *  - Optional Progressive Cloud Gemini AI Synthesizer (RAG)
 * 
 * Complies with Antigravity Workspace Directives:
 *  - Directive 5: Defensive bootloader, DOM identifier hygiene, mobile ergonomics
 *  - Directive 7: Strict zero-music jurisprudence (functional acoustic SFX only)
 * ============================================================================
 */

(function (global) {
  'use strict';

  // --- 1. PROCEDURAL ACOUSTIC FEEDBACK (Zero external audio, zero music) ---
  const SoundFX = {
    ctx: null,
    init() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          try {
            this.ctx = new AudioCtx();
          } catch (e) {
            this.ctx = null;
          }
        }
      }
    },
    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    },
    // Subtle tactile tick (25ms)
    click() {
      try {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {}
    },
    // Soft neutral chime on result selection (60ms)
    select() {
      try {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06); // A5
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    }
  };

  // --- 2. SEMANTIC SYNONYM GRAPH ---
  const DEFAULT_SYNONYMS = {
    'food': ['nutrition', 'diet', 'meal', 'calories', 'eating', 'shake', 'protein', 'carbs', 'snack', 'breakfast', 'lunch', 'dinner'],
    'diet': ['nutrition', 'food', 'meal', 'calories', 'protocol', 'eating', 'macros'],
    'protein': ['whey', 'shake', 'amino', 'muscle', 'egg', 'paneer', 'chicken', 'soya'],
    'weight': ['fat', 'mass', 'bulk', 'muscle', 'gain', 'skinny', 'lean', 'physique', 'body', 'heavy'],
    'gain': ['bulk', 'increase', 'build', 'growth', 'mass', 'weight', 'surplus'],
    'courier': ['shipment', 'parcel', 'tracking', 'delivery', 'docket', 'consignment', 'awb', 'post', 'logistics', 'dtdc', 'speedpost'],
    'tracking': ['track', 'status', 'trace', 'location', 'docket', 'awb', 'shipment', 'consignment'],
    'parcel': ['package', 'packet', 'box', 'shipment', 'courier', 'consignment'],
    'prayer': ['namaz', 'salah', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'tahajjud', 'wudu', 'ablution', 'jamaat'],
    'namaz': ['prayer', 'salah', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'tahajjud'],
    'fasting': ['roza', 'ramadan', 'sehri', 'iftar', 'sawm'],
    'pincode': ['postal', 'zip', 'zipcode', 'area', 'postoffice', 'taluk', 'district', 'city', 'location', 'pin'],
    'portal': ['dashboard', 'hub', 'home', 'navigator', 'index', 'links', 'apps', 'menu'],
    'code': ['developer', 'script', 'javascript', 'python', 'programming', 'software', 'git', 'terminal', 'api'],
    'tool': ['utility', 'kit', 'software', 'script', 'app', 'system'],
    'setting': ['config', 'configuration', 'preference', 'options', 'toggle', 'theme', 'darkmode'],
    'help': ['guide', 'support', 'docs', 'documentation', 'manual', 'faq', 'tutorial', 'instructions'],
    'fast': ['quick', 'speed', 'express', 'rapid', 'instant', 'prompt'],
    'search': ['find', 'lookup', 'explore', 'query', 'filter', 'locate']
  };

  // Morphological stemmer for suffix stripping
  function stem(word) {
    if (!word || word.length <= 3) return word;
    return word
      .replace(/(ing|edly|ingly|tion|ness|able|ible)$/, '')
      .replace(/(ly|ed|es|er|est)$/, '')
      .replace(/s$/, '');
  }

  // --- 2.5 PHONETIC HASHING (SOUNDEX) ---
  function soundex(word, normalize = false) {
    if (!word || typeof word !== 'string') return '';
    let clean = word.toLowerCase().trim();
    if (normalize) {
      clean = clean
        .replace(/ph/g, 'f')
        .replace(/^kn/g, 'n')
        .replace(/^wr/g, 'r')
        .replace(/^wh/g, 'w')
        .replace(/q/g, 'k')
        .replace(/kh/g, 'k')
        .replace(/gh/g, 'g')
        .replace(/sh/g, 's')
        .replace(/ch/g, 'c')
        .replace(/th/g, 't')
        .replace(/dh/g, 'd');
    }
    clean = clean.toUpperCase().replace(/[^A-Z]/g, '');
    if (!clean.length) return '';

    const mapping = {
      B: '1', F: '1', P: '1', V: '1',
      C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
      D: '3', T: '3',
      L: '4',
      M: '5', N: '5',
      R: '6'
    };

    const firstChar = clean[0];
    let code = firstChar;
    let prevDigit = mapping[firstChar] || '0';

    for (let i = 1; i < clean.length; i++) {
      const char = clean[i];
      const digit = mapping[char] || '0';
      if (digit !== '0' && digit !== prevDigit) {
        code += digit;
      }
      prevDigit = digit;
      if (code.length === 4) break;
    }

    return code.padEnd(4, '0');
  }

  // --- 2.6 PHONETIC ENCODING (METAPHONE) ---
  function metaphone(word) {
    if (!word || typeof word !== 'string') return '';
    let s = word.toLowerCase().trim().replace(/[^a-z]/g, '');
    if (!s.length) return '';

    // Drop duplicate adjacent letters except 'c'
    let dedup = '';
    for (let i = 0; i < s.length; i++) {
      if (i === 0 || s[i] !== s[i - 1] || s[i] === 'c') {
        dedup += s[i];
      }
    }
    s = dedup;

    // Initial silent letters
    if (s.startsWith('kn') || s.startsWith('gn') || s.startsWith('pn') || s.startsWith('wr')) {
      s = s.slice(1);
    } else if (s.startsWith('x')) {
      s = 's' + s.slice(1);
    } else if (s.startsWith('wh')) {
      s = 'w' + s.slice(2);
    }

    // Digraphs & phonetic substitutions
    s = s.replace(/qu/g, 'k')
         .replace(/ck/g, 'k')
         .replace(/ph/g, 'f')
         .replace(/th/g, '0')
         .replace(/sh/g, 'x')
         .replace(/ch/g, 'x')
         .replace(/c(?=[eiy])/g, 's')
         .replace(/c/g, 'k')
         .replace(/dg(?=[eiy])/g, 'j')
         .replace(/d/g, 't')
         .replace(/gh/g, '')
         .replace(/g(?=[eiy])/g, 'j')
         .replace(/g/g, 'k')
         .replace(/v/g, 'f')
         .replace(/z/g, 's')
         .replace(/q/g, 'k')
         .replace(/x/g, 'ks');

    // Retain first letter if vowel, otherwise strip all vowels
    let res = '';
    const isVowel = c => 'aeiou'.includes(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (i === 0 && isVowel(c)) {
        res += c.toUpperCase();
      } else if (!isVowel(c)) {
        res += c.toUpperCase();
      }
    }

    // Deduplicate adjacent identical codes
    let finalCode = '';
    for (let i = 0; i < res.length; i++) {
      if (i === 0 || res[i] !== res[i - 1]) {
        finalCode += res[i];
      }
    }
    return finalCode;
  }

  // --- 2.7 ROMAN URDU & HINDI TRANSLITERATION DICTIONARY ---
  // Comprehensive mapping of colloquial South Asian terms to canonical English roots
  const ROMAN_TRANSLITERATION = {
    // Food, Diet & Nutrition
    'khana': 'food',
    'khaana': 'food',
    'ghiza': 'nutrition',
    'khorak': 'diet',
    'roti': 'bread',
    'chawal': 'rice',
    'gosht': 'meat',
    'ande': 'eggs',
    'anda': 'egg',
    'doodh': 'milk',
    'dahi': 'yogurt',
    'paneer': 'cheese',
    'phal': 'fruit',
    'sabzi': 'vegetables',
    'sabji': 'vegetables',
    'nashta': 'breakfast',
    'dopahar': 'lunch',
    'raat': 'dinner',
    'bhook': 'hunger',
    'paani': 'water',
    'chaye': 'tea',
    'kahwa': 'tea',
    'meetha': 'sweet',

    // Weight, Mass, Fitness & Health
    'wazan': 'weight',
    'vajan': 'weight',
    'mota': 'fat',
    'motapa': 'obesity',
    'patla': 'thin',
    'dubla': 'skinny',
    'sehat': 'health',
    'tanmand': 'healthy',
    'kasrat': 'exercise',
    'varzish': 'exercise',
    'taqat': 'strength',
    'quwwat': 'energy',
    'tawanai': 'energy',
    'kamzori': 'weakness',
    'jism': 'body',
    'haddi': 'bone',
    'pet': 'stomach',
    'seena': 'chest',
    'bazu': 'arms',

    // Medicine, Illness & Healthcare
    'dawa': 'medicine',
    'davai': 'medicine',
    'dawakhana': 'pharmacy',
    'ilaj': 'treatment',
    'shifa': 'healing',
    'marz': 'disease',
    'bimari': 'illness',
    'dard': 'pain',
    'bukhar': 'fever',
    'khansi': 'cough',
    'zukam': 'cold',
    'nuskha': 'prescription',
    'tabeeb': 'physician',
    'hakeem': 'doctor',
    'aspataal': 'hospital',
    'marham': 'ointment',
    'goli': 'pill',

    // Faith, Fiqh & Islamic Timings
    'namaz': 'prayer',
    'salaat': 'prayer',
    'salah': 'prayer',
    'salat': 'prayer',
    'roza': 'fasting',
    'roze': 'fasting',
    'sehri': 'suhoor',
    'suhoor': 'sehri',
    'iftar': 'fasting',
    'iftari': 'fasting',
    'fajr': 'dawn',
    'zuhr': 'noon',
    'asr': 'afternoon',
    'maghrib': 'sunset',
    'isha': 'night',
    'tahajjud': 'prayer',
    'wudu': 'ablution',
    'ghusl': 'bath',
    'qibla': 'mecca',
    'masjid': 'mosque',
    'jamaat': 'congregation',
    'azan': 'prayer',
    'adhan': 'prayer',
    'dua': 'supplication',
    'zikr': 'remembrance',
    'tasbeeh': 'praises',
    'quran': 'scripture',
    'surah': 'chapter',
    'ayat': 'verse',
    'hadith': 'tradition',
    'sunnah': 'tradition',
    'hajj': 'pilgrimage',
    'umrah': 'pilgrimage',
    'zakat': 'charity',
    'sadqah': 'charity',
    'eid': 'festival',
    'ramadan': 'fasting',
    'fatawa': 'rulings',
    'fatwa': 'ruling',
    'halal': 'lawful',
    'haram': 'forbidden',
    'makruh': 'disliked',

    // Logistics, Courier, Postal & Navigation
    'khat': 'post',
    'chitthi': 'letter',
    'dak': 'post',
    'dak khana': 'postoffice',
    'dakkhana': 'postoffice',
    'pata': 'address',
    'shehar': 'city',
    'zila': 'district',
    'sooba': 'state',
    'gari': 'vehicle',
    'thela': 'cart',
    'maal': 'cargo',
    'rasad': 'logistics',
    'rawana': 'dispatch',
    'pahunch': 'deliver',
    'pohncha': 'delivered',
    'tarseel': 'shipment',
    'basta': 'package',
    'sandook': 'box',
    'wazni': 'heavy',
    'halka': 'light',

    // General, Actions & Commercial
    'hisab': 'accounting',
    'kharcha': 'expense',
    'kamai': 'income',
    'munafa': 'profit',
    'nuqsan': 'loss',
    'qeemat': 'price',
    'sasta': 'cheap',
    'mehenga': 'expensive',
    'tareekh': 'date',
    'waqt': 'time',
    'din': 'day',
    'mahina': 'month',
    'saal': 'year',
    'dastaveez': 'document',
    'kitab': 'book',
    'madad': 'help',
    'rahnumai': 'guidance',
    'talash': 'search',
    'khoj': 'search',
    'jankari': 'information',
    'maloomat': 'information',
    'saboot': 'tracking',
    'nishan': 'trace',
    'surat': 'status',
    'haal': 'status',
    'khabar': 'news',
    'ittela': 'notification',
    'tareeqa': 'method',
    'nizam': 'system',
    'sahulat': 'service',
    'rabta': 'contact',
    'jagah': 'location',
    'thikana': 'location',
    'manzil': 'destination',
    'safarnama': 'tracking',
    'rasta': 'route',
    'seedha': 'direct',
    'jaldi': 'quick',
    'tez': 'fast',
    'aahista': 'slow',
    'aasan': 'easy',
    'mushkil': 'hard',
    'durust': 'correct',
    'galat': 'error',
    'shuru': 'start',
    'khatam': 'end',
    'band': 'closed',
    'khula': 'open',
    'naya': 'new',
    'purana': 'old'
  };

  // --- 2.8 LOCALSTORAGE SEARCH HISTORY MANAGER ---
  // --- 2.8 LOCALSTORAGE SEARCH HISTORY MANAGER ---
  const RecentSearches = {
    STORAGE_KEY: 'antigravity_recent_searches',
    MAX_ITEMS: 6,
    _memoryFallback: [],

    _getStorage() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
        if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
        if (typeof localStorage !== 'undefined') return localStorage;
      } catch (e) {}
      return null;
    },

    getAll() {
      const storage = RecentSearches._getStorage();
      try {
        if (storage) {
          const raw = storage.getItem(RecentSearches.STORAGE_KEY);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === 'string' && item.trim().length > 0);
          }
          RecentSearches.clear();
          return [];
        }
      } catch (err) {
        try {
          if (storage) {
            storage.removeItem(RecentSearches.STORAGE_KEY);
          }
        } catch (e) {}
      }
      return RecentSearches._memoryFallback || [];
    },

    add(query) {
      if (!query || typeof query !== 'string') return;
      const clean = query.trim();
      if (!clean) return;

      let list = RecentSearches.getAll();
      list = list.filter(item => item.toLowerCase() !== clean.toLowerCase());
      list.unshift(clean);
      if (list.length > RecentSearches.MAX_ITEMS) {
        list = list.slice(0, RecentSearches.MAX_ITEMS);
      }

      RecentSearches._memoryFallback = list;
      const storage = RecentSearches._getStorage();
      try {
        if (storage) {
          storage.setItem(RecentSearches.STORAGE_KEY, JSON.stringify(list));
        }
      } catch (err) {}
    },

    remove(query) {
      if (!query || typeof query !== 'string') return;
      const clean = query.trim().toLowerCase();
      let list = RecentSearches.getAll().filter(item => item.toLowerCase() !== clean);
      RecentSearches._memoryFallback = list;
      const storage = RecentSearches._getStorage();
      try {
        if (storage) {
          storage.setItem(RecentSearches.STORAGE_KEY, JSON.stringify(list));
        }
      } catch (err) {}
    },

    clear() {
      RecentSearches._memoryFallback = [];
      const storage = RecentSearches._getStorage();
      try {
        if (storage) {
          storage.removeItem(RecentSearches.STORAGE_KEY);
        }
      } catch (err) {}
    }
  };

  RecentSearches.getAll = RecentSearches.getAll.bind(RecentSearches);
  RecentSearches.add = RecentSearches.add.bind(RecentSearches);
  RecentSearches.remove = RecentSearches.remove.bind(RecentSearches);
  RecentSearches.clear = RecentSearches.clear.bind(RecentSearches);

  // --- 3. TOKENIZER & TEXT UTILITIES ---
  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF\u0900-\u097F]/g, ' ') // Keep alphanumeric, Arabic, and Devanagari
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  // Levenshtein distance for fuzzy matching
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

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

  // Fuzzy similarity score between 0.0 and 1.0
  function fuzzyMatch(termA, termB) {
    if (termA === termB) return 1.0;
    if (termA.length >= 3 && termB.includes(termA)) return 0.9;
    if (termB.length >= 3 && termA.includes(termB)) return 0.9;

    const stemA = stem(termA);
    const stemB = stem(termB);
    if (stemA === stemB) return 0.95;

    const minLen = Math.min(termA.length, termB.length);
    const maxLen = Math.max(termA.length, termB.length);
    if (minLen < 3) return 0.0;

    const dist = levenshtein(termA, termB);
    const maxAllowedDist = maxLen <= 4 ? 1 : maxLen <= 7 ? 2 : 3;
    if (dist <= maxAllowedDist) {
      return 1.0 - (dist / maxLen);
    }

    if (stemA !== termA || stemB !== termB) {
      const stemMaxLen = Math.max(stemA.length, stemB.length);
      const stemDist = levenshtein(stemA, stemB);
      const stemMaxAllowed = stemMaxLen <= 4 ? 1 : stemMaxLen <= 7 ? 2 : 3;
      if (stemDist <= stemMaxAllowed) {
        return 1.0 - (stemDist / stemMaxLen);
      }
    }

    return 0.0;
  }

  // --- 4. BM25 PROBABILISTIC RANKING ENGINE ---
  class BM25Engine {
    constructor(options = {}) {
      this.k1 = options.k1 || 1.2;
      this.b = options.b || 0.75;
      this.synonyms = Object.assign({}, DEFAULT_SYNONYMS, options.synonyms || {});
      this.transliteration = options.transliteration || null;
      this.documents = [];
      this.docLengths = [];
      this.avgDocLength = 0;
      this.df = new Map(); // Document frequency for terms
      this.rawVocabulary = new Set();
      this.totalDocs = 0;
    }

    addDocument(doc) {
      // doc: { id, title, content, element, category, url, raw }
      const titleTokens = tokenize(doc.title || '');
      const contentTokens = tokenize(doc.content || '');
      const allTokens = [...titleTokens, ...contentTokens];

      // Track raw vocabulary for clean autocompletion
      if (!this.rawVocabulary) {
        this.rawVocabulary = new Set();
      }
      titleTokens.forEach(term => this.rawVocabulary.add(term));
      contentTokens.forEach(term => this.rawVocabulary.add(term));

      const termFreqs = new Map();
      const uniqueTerms = new Set();

      const addTokenWithStem = (term, weight) => {
        termFreqs.set(term, (termFreqs.get(term) || 0) + weight);
        uniqueTerms.add(term);
        const st = stem(term);
        if (st && st !== term && st.length > 2) {
          termFreqs.set(st, (termFreqs.get(st) || 0) + (weight * 0.9));
          uniqueTerms.add(st);
        }
      };

      // Weighted frequencies: Title matches receive 3x boost
      titleTokens.forEach(term => addTokenWithStem(term, 3.0));
      contentTokens.forEach(term => addTokenWithStem(term, 1.0));

      const docIndex = this.documents.length;
      this.documents.push({
        ...doc,
        index: docIndex,
        termFreqs,
        tokenCount: allTokens.length
      });

      this.docLengths.push(allTokens.length);
      uniqueTerms.forEach(term => {
        this.df.set(term, (this.df.get(term) || 0) + 1);
      });

      this.totalDocs = this.documents.length;
      const totalLen = this.docLengths.reduce((acc, len) => acc + len, 0);
      this.avgDocLength = this.totalDocs > 0 ? totalLen / this.totalDocs : 0;
    }

    // Expand query with synonyms and Roman Urdu / Hindi transliterations
    expandQuery(queryTokens) {
      const expanded = new Map(); // term -> weight multiplier
      const transMap = this.transliteration || (typeof ROMAN_TRANSLITERATION !== 'undefined' ? ROMAN_TRANSLITERATION : null);

      queryTokens.forEach(rawToken => {
        const token = (rawToken || '').toLowerCase().trim();
        if (!token) return;

        expanded.set(token, 1.0);

        // 1. Direct Synonyms expansion
        const synList = this.synonyms[token];
        if (synList && Array.isArray(synList)) {
          synList.forEach(syn => {
            if (!expanded.has(syn)) {
              expanded.set(syn, 0.7); // 70% weight for synonyms
            }
          });
        }

        // 2. Roman Urdu & Hindi Transliteration expansion
        if (transMap && transMap[token]) {
          const rootTarget = transMap[token];
          const rootTerms = rootTarget.split(/\s+/).filter(t => t.length > 1);
          rootTerms.forEach(root => {
            if (!expanded.has(root)) {
              expanded.set(root, 0.95);
            }
            // Chain transliterated root's synonyms
            const rootSyns = this.synonyms[root];
            if (rootSyns && Array.isArray(rootSyns)) {
              rootSyns.forEach(rs => {
                if (!expanded.has(rs)) {
                  expanded.set(rs, 0.75);
                }
              });
            }
          });
        }
      });
      return expanded;
    }

    search(query, options = 8) {
      let limit = 8;
      let filterCategory = null;
      if (typeof options === 'number') {
        limit = options;
      } else if (options && typeof options === 'object') {
        if (typeof options.limit === 'number') limit = options.limit;
        if (options.category && typeof options.category === 'string') {
          filterCategory = options.category.trim();
        }
      }

      const rawTokens = tokenize(query);
      if (rawTokens.length === 0) {
        const emptyRes = [];
        emptyRes.didYouMean = null;
        return emptyRes;
      }

      const queryMap = this.expandQuery(rawTokens);
      const scores = new Map(); // docIndex -> score

      queryMap.forEach((qWeight, qTerm) => {
        // Document frequency for this term
        let docFreq = this.df.get(qTerm) || 0;

        // If exact term not found in vocabulary, check fuzzy matches
        let fuzzyCandidates = [];
        if (docFreq === 0) {
          for (const [vocabTerm, count] of this.df.entries()) {
            const sim = fuzzyMatch(qTerm, vocabTerm);
            if (sim >= 0.58) {
              fuzzyCandidates.push({ term: vocabTerm, weight: sim * 0.8, count });
            }
          }
        }

        // Standard BM25 IDF
        const calcIdf = (df) => {
          return Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
        };

        const targetTerms = docFreq > 0
          ? [{ term: qTerm, weight: qWeight, idf: calcIdf(docFreq) }]
          : fuzzyCandidates.map(c => ({ term: c.term, weight: qWeight * c.weight, idf: calcIdf(c.count) }));

        targetTerms.forEach(({ term, weight, idf }) => {
          this.documents.forEach(doc => {
            const tf = doc.termFreqs.get(term) || 0;
            if (tf > 0) {
              const numerator = tf * (this.k1 + 1);
              const denominator = tf + this.k1 * (1 - this.b + this.b * (doc.tokenCount / (this.avgDocLength || 1)));
              const bm25Score = idf * (numerator / denominator) * weight;

              scores.set(doc.index, (scores.get(doc.index) || 0) + bm25Score);
            }
          });
        });
      });

      // Format results
      let ranked = [];
      scores.forEach((score, docIndex) => {
        if (score > 0.05) {
          const doc = this.documents[docIndex];
          ranked.push({
            ...doc,
            score: Math.round(score * 100) / 100,
            snippet: this.generateSnippet(doc.content, rawTokens)
          });
        }
      });

      if (filterCategory) {
        const catLower = filterCategory.toLowerCase();
        if (catLower === 'all') {
          // Keep all
        } else if (catLower === 'headings') {
          ranked = ranked.filter(r => 
            (r.category || '').toLowerCase().startsWith('head') || 
            r.isHeading === true || 
            (r.element && /^h[1-6]$/i.test(r.element.tagName))
          );
        } else {
          ranked = ranked.filter(r => 
            (r.category || '').toLowerCase() === catLower
          );
        }
      }

      ranked.sort((a, b) => b.score - a.score);
      const results = ranked.slice(0, limit);
      const suggestion = this.getSpellingSuggestion(rawTokens, results);
      results.didYouMean = suggestion;
      return results;
    }

    generateSnippet(content, queryTokens, maxLength = 160) {
      if (!content) return '';
      const lower = content.toLowerCase();
      let bestPos = -1;

      for (const tok of queryTokens) {
        const pos = lower.indexOf(tok);
        if (pos !== -1) {
          bestPos = pos;
          break;
        }
      }

      let start = 0;
      if (bestPos > 40) {
        start = Math.max(0, bestPos - 30);
      }

      let end = Math.min(content.length, start + maxLength);
      let snippet = content.substring(start, end).trim();
      if (start > 0) snippet = '...' + snippet;
      if (end < content.length) snippet = snippet + '...';

      // Highlight query tokens
      queryTokens.forEach(tok => {
        if (tok.length > 2) {
          const regex = new RegExp(`(${tok})`, 'gi');
          snippet = snippet.replace(regex, '<mark class="ai-search-highlight">$1</mark>');
        }
      });

      return snippet;
    }

    /**
     * Detects spelling mistakes in raw query tokens and suggests corrections
     * based on vocabulary document frequency, Levenshtein edit distance, and Soundex phonetics.
     *
     * @param {string[]|string} rawTokens - Query tokens or raw query string
     * @param {Array} [exactResults] - Results from initial BM25 search
     * @returns {string|null} Suggested query string, or null if exact hits exist or no candidate >= 0.55
     */
    getSpellingSuggestion(rawTokens, exactResults = []) {
      if (typeof rawTokens === 'string') {
        rawTokens = tokenize(rawTokens);
      }
      if (!rawTokens || !Array.isArray(rawTokens) || rawTokens.length === 0) {
        return null;
      }

      // Helper: Determine if a token is an exact known vocabulary word or synonym
      const isKnown = (tok) => {
        if ((this.df.get(tok) || 0) > 0) return true;
        if (this.synonyms && this.synonyms[tok]) return true;
        if (this.transliteration && this.transliteration[tok]) return true;
        if (typeof ROMAN_TRANSLITERATION !== 'undefined' && ROMAN_TRANSLITERATION[tok]) return true;
        return false;
      };

      // Suppression Rule 1: If all tokens in query are exact known words, suppress suggestion
      const allKnown = rawTokens.every(tok => isKnown(tok));
      if (allKnown) {
        return null;
      }

      // Suppression Rule 2: If exactResults contains a document whose title contains the verbatim query
      if (Array.isArray(exactResults) && exactResults.length > 0) {
        const queryStr = rawTokens.join(' ').toLowerCase();
        const topDoc = exactResults[0];
        if (topDoc.title && topDoc.title.toLowerCase().includes(queryStr) && topDoc.score >= 1.0) {
          return null;
        }
      }

      // 1. Build candidate vocabulary pool: df.keys() + synonyms + transliteration
      const candidatePool = new Map(); // term -> dfCount
      for (const [term, count] of this.df.entries()) {
        if (term.length >= 3) {
          candidatePool.set(term, count);
        }
      }

      // Ingest synonyms
      if (this.synonyms) {
        Object.keys(this.synonyms).forEach(k => {
          if (k.length >= 3 && !candidatePool.has(k)) {
            candidatePool.set(k, this.df.get(k) || 0);
          }
          const syns = this.synonyms[k];
          if (Array.isArray(syns)) {
            syns.forEach(s => {
              if (s.length >= 3 && !candidatePool.has(s)) {
                candidatePool.set(s, this.df.get(s) || 0);
              }
            });
          }
        });
      }

      // Ingest transliteration dictionary if present
      const transMap = this.transliteration || (typeof ROMAN_TRANSLITERATION !== 'undefined' ? ROMAN_TRANSLITERATION : null);
      if (transMap) {
        Object.keys(transMap).forEach(k => {
          if (k.length >= 3 && !candidatePool.has(k)) {
            candidatePool.set(k, this.df.get(k) || 0);
          }
        });
      }

      // 2. Evaluate each query token
      let replacedAny = false;
      const suggestedTokens = rawTokens.map(token => {
        // If token is already a known word, keep it
        if (isKnown(token)) {
          return token;
        }

        let bestCandidate = null;
        let bestScore = 0;

        for (const [candidate, dfCount] of candidatePool.entries()) {
          if (candidate.toLowerCase() === token.toLowerCase()) continue;

          const dist = levenshtein(token, candidate);
          const maxLen = Math.max(token.length, candidate.length);
          const levSim = maxLen > 0 ? 1.0 - (dist / maxLen) : 0;

          // Phonetic Boost using normalized Soundex
          let phoneticBoost = 0.0;
          if (typeof soundex === 'function') {
            const targetSdx = soundex(token, true);
            const candSdx = soundex(candidate, true);
            if (targetSdx && candSdx && targetSdx === candSdx) {
              phoneticBoost = 0.40;
            }
          }

          // Document Frequency Boost (up to 0.10)
          const dfBoost = Math.min(0.10, Math.log10(1 + (dfCount || 0)) * 0.05);

          // Total Score
          const totalScore = (levSim * 0.60) + phoneticBoost + dfBoost;

          // Acceptance Threshold: Score >= 0.55 and within 2 edits or exact phonetic match
          if (totalScore >= 0.55 && (dist <= 2 || phoneticBoost > 0)) {
            if (totalScore > bestScore) {
              bestScore = totalScore;
              bestCandidate = candidate;
            }
          }
        }

        if (bestCandidate && bestCandidate.toLowerCase() !== token.toLowerCase()) {
          replacedAny = true;
          return bestCandidate;
        }

        return token;
      });

      if (!replacedAny) {
        return null;
      }

      const suggestion = suggestedTokens.join(' ');
      return suggestion !== rawTokens.join(' ') ? suggestion : null;
    }

    /**
     * Alias for getSpellingSuggestion to support getDidYouMean contract
     */
    getDidYouMean(rawTokens, exactResults = []) {
      return this.getSpellingSuggestion(rawTokens, exactResults);
    }

    /**
     * Live prefix search against vocabulary, sorted by document frequency.
     *
     * @param {string} prefix - Query prefix to match
     * @param {number} [limit=5] - Maximum suggestions to return
     * @returns {string[]} Matching candidate terms
     */
    getAutocomplete(prefix, limit = 5) {
      if (!prefix || typeof prefix !== 'string') return [];
      const clean = prefix.trim();
      if (clean.length < 2) return [];

      const parts = clean.split(/\s+/);
      const targetPrefix = parts[parts.length - 1].toLowerCase();
      const head = parts.slice(0, -1).join(' ');

      if (targetPrefix.length < 2) return [];

      const candidateMap = new Map(); // term (lowercase) -> score/df

      // 1. Scan vocabulary from indexed documents
      if (this.rawVocabulary && this.rawVocabulary.size > 0) {
        for (const term of this.rawVocabulary) {
          const tLower = term.toLowerCase();
          if (tLower.startsWith(targetPrefix)) {
            const dfCount = this.df.get(tLower) || this.df.get(term) || 1;
            candidateMap.set(tLower, Math.max(candidateMap.get(tLower) || 0, dfCount));
          }
        }
      } else {
        // Defensive fallback to df map
        for (const [term, dfCount] of this.df.entries()) {
          const tLower = term.toLowerCase();
          if (tLower.startsWith(targetPrefix)) {
            candidateMap.set(tLower, Math.max(candidateMap.get(tLower) || 0, dfCount));
          }
        }
      }

      // 2. Scan synonym graph (keys & values)
      if (this.synonyms && typeof this.synonyms === 'object') {
        for (const [key, synList] of Object.entries(this.synonyms)) {
          const kLower = key.toLowerCase();
          if (kLower.startsWith(targetPrefix) && !candidateMap.has(kLower)) {
            candidateMap.set(kLower, 0.1);
          }
          if (Array.isArray(synList)) {
            for (const s of synList) {
              if (typeof s === 'string') {
                const sLower = s.toLowerCase();
                if (sLower.startsWith(targetPrefix) && !candidateMap.has(sLower)) {
                  candidateMap.set(sLower, 0.05);
                }
              }
            }
          }
        }
      }

      // 3. Scan Roman transliteration dictionary (if defined)
      const translit = this.transliteration || (typeof ROMAN_TRANSLITERATION !== 'undefined' ? ROMAN_TRANSLITERATION : null);
      if (translit && typeof translit === 'object') {
        for (const [rKey, rRoots] of Object.entries(translit)) {
          const rLower = rKey.toLowerCase();
          if (rLower.startsWith(targetPrefix) && !candidateMap.has(rLower)) {
            candidateMap.set(rLower, 0.1);
          }
          if (Array.isArray(rRoots)) {
            for (const root of rRoots) {
              if (typeof root === 'string') {
                const rootLower = root.toLowerCase();
                if (rootLower.startsWith(targetPrefix) && !candidateMap.has(rootLower)) {
                  candidateMap.set(rootLower, 0.05);
                }
              }
            }
          }
        }
      }

      // Sort by document frequency descending, preserving insertion order on tie
      const sortedTerms = Array.from(candidateMap.keys()).sort((a, b) => {
        const diff = (candidateMap.get(b) || 0) - (candidateMap.get(a) || 0);
        if (diff !== 0) return diff;
        return 0; // Stable sort
      });

      const topCandidates = sortedTerms.slice(0, limit);
      if (head.length > 0) {
        return topCandidates.map(term => head + ' ' + term);
      }
      return topCandidates;
    }

    /**
     * Discovers and aggregates unique document categories.
     * Returns: ['All', 'Headings', ...domainCategories] (sorted alphabetically)
     */
    getCategories() {
      const categories = ['All', 'Headings'];
      const domainMap = new Map();

      if (Array.isArray(this.documents)) {
        this.documents.forEach(doc => {
          if (doc && typeof doc.category === 'string') {
            const raw = doc.category.trim();
            if (!raw) return;
            const lower = raw.toLowerCase();
            // Exclude baseline structural categories and generic fallback
            if (lower !== 'all' && !lower.startsWith('head') && lower !== 'content') {
              if (!domainMap.has(lower)) {
                // Format with initial uppercase letter
                const display = raw.charAt(0).toUpperCase() + raw.slice(1);
                domainMap.set(lower, display);
              }
            }
          }
        });
      }

      const sortedDomains = Array.from(domainMap.values()).sort((a, b) => a.localeCompare(b));
      return categories.concat(sortedDomains);
    }
  }

  // Prototype aliases and helpers
  BM25Engine.prototype.getAutocompleteSuggestions = BM25Engine.prototype.getAutocomplete;
  BM25Engine.prototype.soundex = soundex;

  // --- 5. AUTOMATIC DOM CRAWLER ---
  function crawlDOM(rootElement = document.body, customExcludeSelector = '') {
    const documents = [];
    const baseExcludes = [
      'script', 'style', 'nav', 'footer', 'noscript',
      '.ai-search-modal-backdrop', '.ai-search-modal-card', '[aria-hidden="true"]'
    ];
    if (customExcludeSelector && typeof customExcludeSelector === 'string') {
      const trimmed = customExcludeSelector.trim().replace(/,\s*$/, '');
      if (trimmed) baseExcludes.push(trimmed);
    }
    const excludeSelector = baseExcludes.join(', ');

    const isExcluded = (el) => {
      if (!el || el === document.body) return false;
      try {
        if (el.matches && el.matches(excludeSelector)) return true;
      } catch (err) {
        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        if (['script', 'style', 'nav', 'footer', 'noscript'].includes(tag)) return true;
      }
      return el.parentElement ? isExcluded(el.parentElement) : false;
    };

    // Candidates: headings, paragraphs, list items, table rows, cards
    const candidates = rootElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote, .card, [data-searchable]');
    let currentHeading = document.title || 'General';
    let currentHeadingCategory = null;
    let docCounter = 0;

    candidates.forEach((el) => {
      if (isExcluded(el)) return;

      const tag = el.tagName.toLowerCase();
      const text = (el.innerText || el.textContent || '').trim();
      if (text.length < 5) return;

      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag);
      if (isHeading) {
        currentHeading = text;
      }

      // --- Category Ingestion Logic ---
      let extractedCategory = null;

      // 1. Direct [data-category] on element or closest ancestor
      const dataCatEl = (el.hasAttribute && el.hasAttribute('data-category')) 
        ? el 
        : (el.closest ? el.closest('[data-category]') : null);
      if (dataCatEl) {
        const catVal = dataCatEl.getAttribute('data-category');
        if (catVal && catVal.trim()) extractedCategory = catVal.trim();
      }

      // 2. Direct child badge (.badge-tag, .category-badge, [data-badge])
      if (!extractedCategory && el.querySelector) {
        const badgeEl = el.querySelector('.badge-tag, .category-badge, [data-badge]');
        if (badgeEl) {
          const bText = (badgeEl.innerText || badgeEl.textContent || '').trim();
          if (bText && bText.length <= 30) extractedCategory = bText;
        }
      }

      // 3. Nearest enclosing card or section badge
      if (!extractedCategory && el.closest) {
        const cardContainer = el.closest('.content-card, .card, article, section, [data-searchable]');
        if (cardContainer) {
          const cardBadge = cardContainer.querySelector('.badge-tag, .category-badge, [data-badge]');
          if (cardBadge) {
            const cbText = (cardBadge.innerText || cardBadge.textContent || '').trim();
            if (cbText && cbText.length <= 30) extractedCategory = cbText;
          }
        }
      }

      // 4. Inherit active heading category for body elements (p, li, blockquote)
      if (!extractedCategory && !isHeading && currentHeadingCategory) {
        extractedCategory = currentHeadingCategory;
      }

      // Headings establish or reset active heading category
      if (isHeading) {
        currentHeadingCategory = extractedCategory || null;
      }

      // 5. Fallback logic: Headings (H1-H6) -> 'Headings', generic body -> 'Content'
      const finalCategory = extractedCategory || (isHeading ? 'Headings' : 'Content');

      // Ensure element has an ID for smooth jumping
      if (!el.id) {
        el.id = `ai-search-anchor-${++docCounter}`;
      }

      documents.push({
        id: el.id,
        title: currentHeading,
        content: text,
        element: el,
        category: finalCategory,
        isHeading: isHeading,
        url: `#${el.id}`
      });
    });

    return documents;
  }

  // --- 6. SPOTLIGHT COMMAND PALETTE UI ---
  class SpotlightUI {
    constructor(engine, options = {}) {
      this.engine = engine;
      this.options = Object.assign({
        placeholder: 'Search content, headings, or ask AI (Ctrl+K)...',
        geminiApiKey: '',
        enableSound: true,
        categories: null,
        onSelect: null
      }, options);

      this.isOpen = false;
      this.activeIndex = -1;
      this.results = [];
      this.unfilteredResults = [];
      this.activeCategory = 'All';
      this.autocompleteSuggestions = [];
      this.activeAutocompleteIndex = -1;

      this.modalEl = null;
      this.inputEl = null;
      this.resultsContainer = null;
      this.aiCardContainer = null;
      this.categoriesBar = null;
      this.autocompleteContainer = null;
      this.dymEl = null;

      this.initDOM();
      this.bindEvents();
    }

    initDOM() {
      if (document.getElementById('ai-search-root')) {
        this.modalEl = document.getElementById('ai-search-root');
        return;
      }

      const root = document.createElement('div');
      root.id = 'ai-search-root';
      root.className = 'ai-search-modal-backdrop';
      root.setAttribute('aria-hidden', 'true');

      root.innerHTML = `
        <div class="ai-search-modal-card" role="dialog" aria-modal="true" aria-label="Antigravity AI Search">
          <div class="ai-search-header" id="ai-search-header">
            <div class="ai-search-input-wrapper">
              <svg class="ai-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="ai-search-input" class="ai-search-input" placeholder="${this.options.placeholder}" autocomplete="off" spellcheck="false" />
              <button type="button" class="ai-search-mic-btn" id="ai-search-mic-btn" aria-label="Voice Search" title="Voice Search (Speak)">
                <svg class="ai-search-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
              <button type="button" class="ai-search-clear-btn" id="ai-search-clear" aria-label="Clear Search" style="display:none;">&times;</button>
            </div>
            <div class="ai-search-shortcuts">
              <span class="ai-search-badge"><kbd>ESC</kbd> to close</span>
            </div>
          </div>

          <div class="ai-search-categories-bar" id="ai-search-categories" role="tablist" aria-label="Search Categories" style="display: none;"></div>
          <div id="ai-search-autocomplete" class="ai-search-autocomplete" style="display: none;" role="region" aria-label="Suggestions"></div>

          <div id="ai-search-ai-answer" class="ai-search-ai-card" style="display: none;"></div>

          <div class="ai-search-body">
            <div id="ai-search-dym" class="ai-search-did-you-mean" style="display: none;" role="status"></div>
            <div id="ai-search-results" class="ai-search-results-list" role="listbox">
              <div class="ai-search-empty-state">
                <p class="ai-search-empty-title">Instant Semantic Search</p>
                <p class="ai-search-empty-desc">Type keywords, typos, or natural queries. BM25 and fuzzy logic index this page in real time.</p>
                <div class="ai-search-tip-chips">
                  <span class="ai-search-chip">⚡ Sub-millisecond</span>
                  <span class="ai-search-chip">🔒 100% Offline</span>
                  <span class="ai-search-chip">🎯 Typo-Tolerant</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ai-search-footer">
            <div class="ai-search-nav-hint">
              <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to select</span>
            </div>
            <button type="button" class="ai-search-help-btn" id="ai-search-help-btn" title="View search shortcuts and features">❓ Shortcuts & Help</button>
            <div class="ai-search-branding">
              <span>Antigravity AI Search</span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(root);
      this.modalEl = root;
      this.inputEl = root.querySelector('#ai-search-input');
      this.resultsContainer = root.querySelector('#ai-search-results');
      this.aiCardContainer = root.querySelector('#ai-search-ai-answer');
      this.categoriesBar = root.querySelector('#ai-search-categories');
      this.autocompleteContainer = root.querySelector('#ai-search-autocomplete');
      this.dymEl = root.querySelector('#ai-search-dym');
      this.micBtn = root.querySelector('#ai-search-mic-btn');
      this.isListening = false;
      this.recognition = null;
      this.initVoiceRecognition();

      // Floating Action Pill for Mobile Ergonomics (Directive 5)
      if (this.options.enableFloatingPill !== false && typeof document !== 'undefined') {
        let pill = document.getElementById('ai-search-floating-pill');
        if (!pill) {
          pill = document.createElement('button');
          pill.id = 'ai-search-floating-pill';
          pill.className = 'ai-search-floating-pill';
          pill.setAttribute('type', 'button');
          pill.setAttribute('aria-label', 'Open AI Search');
          pill.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          `;
          pill.addEventListener('click', () => {
            this.open();
          });
          document.body.appendChild(pill);
          this.floatingPill = pill;
        }
      }
    }

    initVoiceRecognition() {
      if (typeof window === 'undefined') return;
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        if (this.micBtn) {
          this.micBtn.style.opacity = '0.4';
          this.micBtn.title = 'Voice Search not supported in this browser';
        }
        return;
      }

      try {
        this.recognition = new SpeechRec();
        this.recognition.lang = this.options.voiceLang || 'en-IN';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.micBtn) this.micBtn.classList.add('ai-search-listening');
          if (this.inputEl) {
            this.inputEl.placeholder = 'Listening... Speak in English/Hindi/Urdu';
          }
        };

        this.recognition.onresult = (event) => {
          const transcript = (event.results && event.results[0] && event.results[0][0])
            ? event.results[0][0].transcript
            : '';
          if (transcript) {
            this.handleVoiceResult(transcript);
          }
        };

        this.recognition.onerror = () => {
          this.stopVoiceRecognition();
        };

        this.recognition.onend = () => {
          this.stopVoiceRecognition();
        };
      } catch (err) {
        this.recognition = null;
      }
    }

    toggleVoiceRecognition() {
      if (this.isListening) {
        this.stopVoiceRecognition();
      } else {
        this.startVoiceRecognition();
      }
    }

    startVoiceRecognition() {
      if (!this.recognition) {
        this.initVoiceRecognition();
      }
      if (!this.recognition) return;
      try {
        if (this.options.enableSound) SoundFX.click();
        this.recognition.start();
      } catch (err) {
        // Recognition already active
      }
    }

    stopVoiceRecognition() {
      this.isListening = false;
      if (this.micBtn) {
        this.micBtn.classList.remove('ai-search-listening');
      }
      if (this.inputEl) {
        this.inputEl.placeholder = this.options.placeholder || 'Search by keyword, typo, or topic...';
      }
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }
    }

    handleVoiceResult(transcript) {
      if (!transcript) return;
      const clean = transcript.trim();
      if (!clean) return;

      if (this.options.enableSound) SoundFX.select();
      if (this.inputEl) {
        this.inputEl.value = clean;
        const clearBtn = this.modalEl ? this.modalEl.querySelector('#ai-search-clear') : null;
        if (clearBtn) clearBtn.style.display = 'block';
        this.inputEl.focus();
      }

      if (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined') {
        RecentSearches.add(clean);
      }

      this.hideAutocomplete();
      this.performSearch(clean);
      this.stopVoiceRecognition();
    }

    bindEvents() {
      // Global hotkey in capture phase: Ctrl+K, Cmd+K, or Slash (/) when not inside form field
      const handleGlobalKeyDown = (e) => {
        const isK = e.key === 'k' || e.key === 'K' || e.code === 'KeyK';
        if ((e.ctrlKey || e.metaKey) && isK) {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        } else if (e.key === 'Escape' && this.isOpen) {
          e.preventDefault();
          e.stopPropagation();
          this.close();
        } else if (e.key === '/' && !this.isOpen) {
          const active = document.activeElement;
          const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
          if (!isInput) {
            e.preventDefault();
            this.open();
          }
        }
      };
      window.addEventListener('keydown', handleGlobalKeyDown, true);

      // Backdrop click to close & delegation inside modal card
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
          return;
        }

        // Did-You-Mean suggestion button click
        const dymBtn = e.target.closest && e.target.closest('.ai-search-suggestion-btn, .ai-search-suggestion-link');
        if (dymBtn) {
          e.preventDefault();
          e.stopPropagation();
          const query = dymBtn.getAttribute('data-query') || dymBtn.textContent.trim();
          if (query) {
            if (this.options.enableSound) SoundFX.click();
            this.inputEl.value = query;
            const clearBtn = this.modalEl.querySelector('#ai-search-clear');
            if (clearBtn) clearBtn.style.display = 'block';
            this.hideAutocomplete();
            this.performSearch(query);
            this.inputEl.focus();
          }
          return;
        }

        // Autocomplete chip click
        const chip = e.target.closest && e.target.closest('.ai-search-autocomplete-chip, .ai-search-autocomplete-item');
        if (chip) {
          e.preventDefault();
          e.stopPropagation();
          const targetQuery = chip.getAttribute('data-query');
          if (targetQuery) {
            this.applyAutocomplete(targetQuery);
          }
          return;
        }
      });

      // Clear button
      const clearBtn = this.modalEl.querySelector('#ai-search-clear');
      clearBtn.addEventListener('click', () => {
        this.inputEl.value = '';
        clearBtn.style.display = 'none';
        this.hideAutocomplete();
        if (this.dymEl) {
          this.dymEl.style.display = 'none';
          this.dymEl.innerHTML = '';
        }
        this.renderEmptyState();
        this.inputEl.focus();
      });

      // Help button
      const helpBtn = this.modalEl.querySelector('#ai-search-help-btn');
      if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.inputEl.value = '?';
          clearBtn.style.display = 'block';
          this.hideAutocomplete();
          if (this.dymEl) {
            this.dymEl.style.display = 'none';
            this.dymEl.innerHTML = '';
          }
          this.renderHelpState();
          this.inputEl.focus();
        });
      }

      // Input wrapper click focuses input
      const inputWrap = this.modalEl.querySelector('.ai-search-input-wrapper');
      if (inputWrap) {
        inputWrap.addEventListener('click', () => {
          if (this.inputEl) this.inputEl.focus();
        });
      }

      // Input changes
      let debounceTimer = null;
      this.inputEl.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = this.inputEl.value.trim();
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';

        if (query === '?' || query.toLowerCase() === 'help') {
          this.hideAutocomplete();
          if (this.dymEl) {
            this.dymEl.style.display = 'none';
            this.dymEl.innerHTML = '';
          }
          this.renderHelpState();
          return;
        }

        if (query.length < 2) {
          this.hideAutocomplete();
          if (this.dymEl) {
            this.dymEl.style.display = 'none';
            this.dymEl.innerHTML = '';
          }
          this.renderEmptyState();
          return;
        }

        // Trigger instant suggestions without waiting for debounce
        this.renderAutocomplete(query);

        debounceTimer = setTimeout(() => {
          this.performSearch(query);
        }, 80);
      });

      // Keyboard navigation in results & Tab completion
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (this.autocompleteSuggestions && this.autocompleteSuggestions.length > 0 &&
              this.autocompleteContainer && this.autocompleteContainer.style.display !== 'none') {
            e.preventDefault();
            e.stopPropagation();
            const targetQuery = this.autocompleteSuggestions[this.activeAutocompleteIndex >= 0 ? this.activeAutocompleteIndex : 0];
            this.applyAutocomplete(targetQuery);
            return;
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveActive(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveActive(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.activeIndex >= 0 && this.results[this.activeIndex]) {
            this.selectResult(this.results[this.activeIndex]);
          } else if (this.results.length > 0) {
            this.selectResult(this.results[0]);
          }
        }
      });

      // Document-level delegation for any elements with class .ai-search-trigger
      document.addEventListener('click', (e) => {
        const trigger = e.target && e.target.closest && e.target.closest('.ai-search-trigger');
        if (trigger) {
          e.preventDefault();
          e.stopPropagation();
          this.open();
        }
      });
    }

    open() {
      if (this.isOpen) return;
      if (this.options.enableSound) SoundFX.click();
      this.isOpen = true;
      this.activeCategory = 'All';
      this.renderCategoriesBar();
      this.modalEl.classList.add('ai-search-active');
      this.modalEl.setAttribute('aria-hidden', 'false');
      document.body.classList.add('ai-search-scroll-lock');
      setTimeout(() => {
        if (this.inputEl) {
          this.inputEl.focus();
          this.inputEl.select();
        }
      }, 30);
    }

    close() {
      if (!this.isOpen) return;
      if (this.options.enableSound) SoundFX.click();
      this.isOpen = false;

      // Abort active voice recognition session on modal close (Directive 5 / R3)
      if (this.isListening && this.recognition) {
        try {
          this.recognition.abort();
        } catch (e) {}
        this.stopVoiceRecognition();
      }

      this.hideAutocomplete();
      if (this.dymEl) {
        this.dymEl.style.display = 'none';
        this.dymEl.innerHTML = '';
      }
      this.modalEl.classList.remove('ai-search-active');
      this.modalEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('ai-search-scroll-lock');
    }

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }

    renderAutocomplete(query) {
      if (!this.engine || typeof this.engine.getAutocomplete !== 'function') {
        this.hideAutocomplete();
        return;
      }

      const suggestions = this.engine.getAutocomplete(query, 5);
      this.autocompleteSuggestions = suggestions;
      this.activeAutocompleteIndex = suggestions.length > 0 ? 0 : -1;

      if (!this.autocompleteContainer) {
        this.autocompleteContainer = this.modalEl ? this.modalEl.querySelector('#ai-search-autocomplete') : null;
      }
      if (!this.autocompleteContainer) return;

      if (!suggestions || suggestions.length === 0) {
        this.hideAutocomplete();
        return;
      }

      const escapeHtml = (str) => {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };

      let html = `
        <div class="ai-search-autocomplete-inner">
          <span class="ai-search-autocomplete-label">
            <svg class="ai-search-autocomplete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            Suggest
          </span>
          <div class="ai-search-autocomplete-chips" role="listbox">
      `;

      suggestions.forEach((item, idx) => {
        const isPrimary = idx === 0;
        html += `
          <button type="button" 
            class="ai-search-autocomplete-chip ${isPrimary ? 'ai-search-chip-active' : ''}" 
            data-query="${escapeHtml(item)}" 
            role="option" 
            aria-selected="${isPrimary}">
            ${isPrimary ? '<span class="ai-search-tab-badge"><kbd>Tab ⇥</kbd></span>' : ''}
            <span class="ai-search-chip-text">${escapeHtml(item)}</span>
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;

      this.autocompleteContainer.innerHTML = html;
      this.autocompleteContainer.style.display = 'block';
    }

    hideAutocomplete() {
      this.autocompleteSuggestions = [];
      this.activeAutocompleteIndex = -1;
      if (this.autocompleteContainer) {
        this.autocompleteContainer.style.display = 'none';
        this.autocompleteContainer.innerHTML = '';
      }
    }

    applyAutocomplete(query) {
      if (!query) return;
      if (this.options.enableSound) SoundFX.click();
      this.inputEl.value = query;
      this.hideAutocomplete();

      const clearBtn = this.modalEl.querySelector('#ai-search-clear');
      if (clearBtn) clearBtn.style.display = 'block';

      this.performSearch(query);
      this.inputEl.focus();
      try {
        this.inputEl.setSelectionRange(query.length, query.length);
      } catch (_) {}
    }

    renderDidYouMean(suggestion) {
      if (!this.dymEl) return;
      if (!suggestion) {
        this.dymEl.style.display = 'none';
        this.dymEl.innerHTML = '';
        return;
      }

      this.dymEl.innerHTML = `
        <span class="ai-search-dym-label">Did you mean:</span>
        <button type="button" class="ai-search-suggestion-btn ai-search-suggestion-link" data-query="${suggestion}">
          <em>${suggestion}</em>
        </button>?
      `;
      this.dymEl.style.display = 'flex';
    }

    renderCategoriesBar() {
      if (!this.categoriesBar) return;
      const categories = (Array.isArray(this.options.categories) && this.options.categories.length > 0)
        ? this.options.categories
        : (this.engine && typeof this.engine.getCategories === 'function' ? this.engine.getCategories() : ['All', 'Headings']);

      if (categories.length <= 1) {
        this.categoriesBar.style.display = 'none';
        return;
      }
      this.categoriesBar.style.display = 'flex';

      let html = '';
      categories.forEach(cat => {
        const isActive = cat.toLowerCase() === this.activeCategory.toLowerCase();
        html += `
          <button type="button" 
                  class="ai-search-category-pill ${isActive ? 'ai-search-pill-active' : ''}" 
                  data-category="${cat}" 
                  role="tab" 
                  aria-selected="${isActive ? 'true' : 'false'}"
                  tabindex="${isActive ? '0' : '-1'}">
            <span class="ai-search-pill-label">${cat}</span>
          </button>
        `;
      });

      this.categoriesBar.innerHTML = html;

      // Whole-container click binding (Directive 5)
      this.categoriesBar.querySelectorAll('.ai-search-category-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cat = pill.getAttribute('data-category');
          if (cat) this.filterResultsByCategory(cat);
        });
      });
    }

    filterResultsByCategory(category) {
      if (!category) return;
      this.activeCategory = category;

      if (this.options.enableSound) {
        SoundFX.click();
      }

      // Update visual tab selection and scroll into view smoothly
      if (this.categoriesBar) {
        this.categoriesBar.querySelectorAll('.ai-search-category-pill').forEach(pill => {
          const pCat = pill.getAttribute('data-category');
          const isMatch = pCat && pCat.toLowerCase() === category.toLowerCase();
          if (isMatch) {
            pill.classList.add('ai-search-pill-active');
            pill.setAttribute('aria-selected', 'true');
            pill.setAttribute('tabindex', '0');
            if (typeof pill.scrollIntoView === 'function') {
              pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
          } else {
            pill.classList.remove('ai-search-pill-active');
            pill.setAttribute('aria-selected', 'false');
            pill.setAttribute('tabindex', '-1');
          }
        });
      }

      // 0ms in-memory filtering of existing results without DOM crawling
      if (!this.unfilteredResults || this.unfilteredResults.length === 0) return;

      const catLower = category.toLowerCase();
      let filtered = [];

      if (catLower === 'all') {
        filtered = this.unfilteredResults;
      } else if (catLower === 'headings') {
        filtered = this.unfilteredResults.filter(r => 
          (r.category || '').toLowerCase().startsWith('head') || 
          r.isHeading === true || 
          (r.element && /^h[1-6]$/i.test(r.element.tagName))
        );
      } else {
        filtered = this.unfilteredResults.filter(r => 
          (r.category || '').toLowerCase() === catLower
        );
      }

      this.results = filtered;
      this.activeIndex = -1;

      if (this.results.length === 0) {
        this.renderCategoryEmptyState(category);
      } else {
        this.renderResults(this.results);
      }
    }

    renderCategoryEmptyState(category) {
      this.resultsContainer.innerHTML = `
        <div class="ai-search-empty-state">
          <p class="ai-search-empty-title">No matches in "${category}"</p>
          <p class="ai-search-empty-desc">Found ${this.unfilteredResults.length} matching result${this.unfilteredResults.length === 1 ? '' : 's'} in other categories.</p>
          <div style="margin-top: 14px;">
            <button type="button" class="ai-search-switch-all-btn" id="ai-search-switch-all">
              View All (${this.unfilteredResults.length}) Results
            </button>
          </div>
        </div>
      `;
      const btn = this.resultsContainer.querySelector('#ai-search-switch-all');
      if (btn) {
        btn.addEventListener('click', () => this.filterResultsByCategory('All'));
      }
    }

    moveActive(direction) {
      if (this.results.length === 0) return;
      if (this.options.enableSound) SoundFX.click();

      this.activeIndex += direction;
      if (this.activeIndex < 0) this.activeIndex = this.results.length - 1;
      if (this.activeIndex >= this.results.length) this.activeIndex = 0;

      const items = this.resultsContainer.querySelectorAll('.ai-search-result-item');
      items.forEach((item, idx) => {
        if (idx === this.activeIndex) {
          item.classList.add('ai-search-item-selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('ai-search-item-selected');
        }
      });
    }

    performSearch(query) {
      if (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined') {
        const cleanQ = (query || '').trim();
        if (cleanQ && cleanQ !== '?' && cleanQ.toLowerCase() !== 'help') {
          RecentSearches.add(cleanQ);
        }
      }

      this.unfilteredResults = this.engine.search(query, 16);
      this.activeIndex = -1;

      const rawTokens = tokenize(query);
      const suggestion = this.engine.getSpellingSuggestion(rawTokens, this.unfilteredResults);
      this.renderDidYouMean(suggestion);

      if (this.unfilteredResults.length === 0) {
        this.results = [];
        this.resultsContainer.innerHTML = `
          <div class="ai-search-empty-state">
            <p class="ai-search-empty-title">No matching sections found</p>
            <p class="ai-search-empty-desc">Try searching for broader keywords, synonyms, or check your spelling.</p>
          </div>
        `;
        this.aiCardContainer.style.display = 'none';
        return;
      }

      this.filterResultsByCategory(this.activeCategory);

      // Trigger optional Gemini AI synthesis if configured
      if (this.options.geminiApiKey) {
        this.synthesizeGeminiAnswer(query, this.results.length > 0 ? this.results : this.unfilteredResults);
      } else {
        this.aiCardContainer.style.display = 'none';
      }
    }

    renderResults(results) {
      let html = '';
      results.forEach((item, index) => {
        html += `
          <div class="ai-search-result-item" data-index="${index}" role="option">
            <div class="ai-search-item-header">
              <span class="ai-search-item-title">${item.title}</span>
              <span class="ai-search-score-pill">BM25: ${item.score}</span>
            </div>
            <div class="ai-search-item-snippet">${item.snippet}</div>
          </div>
        `;
      });

      this.resultsContainer.innerHTML = html;

      // Click binding
      this.resultsContainer.querySelectorAll('.ai-search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'), 10);
          if (this.results[idx]) {
            this.selectResult(this.results[idx]);
          }
        });
      });
    }

    renderEmptyState() {
      this.results = [];
      this.unfilteredResults = [];
      this.activeIndex = -1;
      this.hideAutocomplete();
      if (this.dymEl) {
        this.dymEl.style.display = 'none';
        this.dymEl.innerHTML = '';
      }
      this.aiCardContainer.style.display = 'none';

      const recentList = (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined')
        ? RecentSearches.getAll()
        : [];

      let recentHtml = '';
      if (recentList.length > 0) {
        recentHtml = `
          <div class="ai-search-recent-section">
            <div class="ai-search-recent-header">
              <span class="ai-search-recent-title">🕒 Recent Searches</span>
              <button type="button" class="ai-search-clear-history-btn" id="ai-search-clear-history">Clear all</button>
            </div>
            <div class="ai-search-recent-chips">
              ${recentList.map(item => `
                <button type="button" class="ai-search-recent-chip" data-query="${item.replace(/"/g, '&quot;')}">
                  ${item.replace(/</g, '&lt;')}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      this.resultsContainer.innerHTML = `
        <div class="ai-search-empty-state">
          ${recentHtml}
          <p class="ai-search-empty-title">Instant Semantic Search</p>
          <p class="ai-search-empty-desc">Type keywords, typos, or natural queries. BM25 and fuzzy logic index this page in real time.</p>
          <div class="ai-search-tip-chips">
            <span class="ai-search-chip">⚡ Sub-millisecond</span>
            <span class="ai-search-chip">🔒 100% Offline</span>
            <span class="ai-search-chip">🎯 Typo-Tolerant</span>
          </div>
        </div>
      `;

      // Wire clear history button and recent chips
      const clearHistoryBtn = this.resultsContainer.querySelector('#ai-search-clear-history');
      if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.options.enableSound) SoundFX.click();
          if (typeof RecentSearches !== 'undefined') RecentSearches.clear();
          this.renderEmptyState();
        });
      }

      this.resultsContainer.querySelectorAll('.ai-search-recent-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const q = chip.getAttribute('data-query');
          if (q) {
            if (this.options.enableSound) SoundFX.click();
            this.inputEl.value = q;
            const clearBtn = this.modalEl ? this.modalEl.querySelector('#ai-search-clear') : null;
            if (clearBtn) clearBtn.style.display = 'block';
            this.hideAutocomplete();
            this.performSearch(q);
            this.inputEl.focus();
          }
        });
      });
    }

    renderHelpState() {
      this.results = [];
      this.unfilteredResults = [];
      this.activeIndex = -1;
      this.hideAutocomplete();
      if (this.dymEl) {
        this.dymEl.style.display = 'none';
        this.dymEl.innerHTML = '';
      }
      this.aiCardContainer.style.display = 'none';
      this.resultsContainer.innerHTML = `
        <div class="ai-search-help-panel">
          <div class="ai-search-help-header">
            <span class="ai-search-help-title">🚀 Search Shortcuts & Power Features</span>
            <span class="ai-search-help-badge">100% Offline Engine</span>
          </div>
          <div class="ai-search-help-grid">
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">⌨️ Keyboard Controls</div>
              <ul class="ai-search-help-card-list">
                <li><kbd>Ctrl+K</kbd> / <kbd>Cmd+K</kbd> : Toggle search modal</li>
                <li><kbd>/</kbd> : Quick search (outside inputs)</li>
                <li><kbd>↓</kbd> <kbd>↑</kbd> : Cycle ranked cards</li>
                <li><kbd>↵</kbd> : Jump to section & pulse</li>
                <li><kbd>ESC</kbd> : Close modal</li>
              </ul>
            </div>
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">🧠 Smart Features</div>
              <ul class="ai-search-help-card-list">
                <li><strong>Typo Tolerance:</strong> Levenshtein edit distance</li>
                <li><strong>Synonyms:</strong> Semantic concept graph</li>
                <li><strong>Stemming:</strong> Strips suffixes (-ing, -ly, -ed)</li>
                <li><strong>BM25 Scoring:</strong> Title matches score 3x</li>
              </ul>
            </div>
          </div>
          <div class="ai-search-help-tip">
            💡 <span>Tip: Type any search query or delete '?' to return to instant search.</span>
          </div>
        </div>
      `;
    }

    selectResult(result) {
      if (this.options.enableSound) SoundFX.select();
      if (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined') {
        const q = this.inputEl ? this.inputEl.value.trim() : '';
        if (q && q !== '?' && q.toLowerCase() !== 'help') {
          RecentSearches.add(q);
        }
      }
      this.close();

      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(result);
        return;
      }

      // Smooth scroll to element and apply glowing pulse
      if (result.element && typeof result.element.scrollIntoView === 'function') {
        result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        result.element.classList.remove('ai-search-target-pulse');
        void result.element.offsetWidth; // Trigger reflow
        result.element.classList.add('ai-search-target-pulse');

        setTimeout(() => {
          result.element.classList.remove('ai-search-target-pulse');
        }, 3200);
      } else if (result.url) {
        window.location.hash = result.url.replace(/^#/, '');
      }
    }

    // Optional progressive cloud RAG synthesis
    async synthesizeGeminiAnswer(query, topResults) {
      this.aiCardContainer.style.display = 'block';
      this.aiCardContainer.innerHTML = `
        <div class="ai-search-ai-badge">🤖 Gemini AI Synthesizer</div>
        <div class="ai-search-ai-text">Synthesizing answer from page context...</div>
      `;

      try {
        const contextText = topResults.slice(0, 3).map(r => `Section: ${r.title}\nContent: ${r.content}`).join('\n\n');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.options.geminiApiKey}`;

        const prompt = `You are a concise AI search assistant. Answer the user's question directly in maximum 2 clear sentences using ONLY this page context:\n\n${contextText}\n\nQuestion: "${query}"`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) throw new Error('API response failed');
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary could be synthesized.';

        this.aiCardContainer.innerHTML = `
          <div class="ai-search-ai-badge">🤖 Gemini AI Direct Answer</div>
          <div class="ai-search-ai-text">${answer}</div>
        `;
      } catch (err) {
        this.aiCardContainer.innerHTML = `
          <div class="ai-search-ai-badge">⚡ Offline BM25 Mode</div>
          <div class="ai-search-ai-text">Instant client-side match displayed below.</div>
        `;
      }
    }
  }

  BM25Engine.prototype.soundex = soundex;
  BM25Engine.prototype.metaphone = metaphone;
  BM25Engine.prototype.ROMAN_TRANSLITERATION = ROMAN_TRANSLITERATION;

  // --- 7. PUBLIC API FACADE ---
  const AISearch = {
    engine: null,
    ui: null,

    init(options = {}) {
      try {
        const config = Object.assign({
          autoCrawl: true,
          containerSelector: '',
          excludeSelector: '',
          data: null,
          synonyms: {},
          geminiApiKey: '',
          enableSound: true,
          onSelect: null
        }, options);

        this.engine = new BM25Engine({ synonyms: config.synonyms });

        // Ingest custom JSON data feed if provided
        if (Array.isArray(config.data)) {
          config.data.forEach(item => this.engine.addDocument(item));
        }

        // 1. Initialize UI FIRST in browser environment so shortcuts and triggers ALWAYS work
        if (typeof document !== 'undefined') {
          this.ui = new SpotlightUI(this.engine, config);
        }

        // 2. Auto-crawl DOM if enabled (isolated)
        if (config.autoCrawl && typeof document !== 'undefined') {
          try {
            const root = config.containerSelector ? document.querySelector(config.containerSelector) : document.body;
            if (root) {
              const docs = crawlDOM(root, config.excludeSelector);
              docs.forEach(doc => this.engine.addDocument(doc));
            }
          } catch (crawlErr) {
            console.warn('[AISearch] DOM crawl non-fatal warning:', crawlErr);
          }
        }

        return this;
      } catch (err) {
        console.error('[AISearch] Bootloader initialization error:', err);
        return null;
      }
    },

    open() {
      if (this.ui) this.ui.open();
    },

    close() {
      if (this.ui) this.ui.close();
    },

    search(query, options = 8) {
      return this.engine ? this.engine.search(query, options) : [];
    },

    // Classes & utilities exported for modular usage and testing
    BM25Engine,
    tokenize,
    levenshtein,
    fuzzyMatch,
    soundex,
    metaphone,
    ROMAN_TRANSLITERATION,
    TRANSLITERATION_MAP: ROMAN_TRANSLITERATION,
    RecentSearches,
    addRecentSearch: (q) => RecentSearches.add(q),
    getRecentSearches: () => RecentSearches.getAll(),
    clearRecentSearches: () => RecentSearches.clear(),
    DEFAULT_SYNONYMS
  };

  // Node.js / CommonJS vs Browser export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AISearch;
  } else {
    global.AISearch = AISearch;
  }

})(typeof window !== 'undefined' ? window : globalThis);
