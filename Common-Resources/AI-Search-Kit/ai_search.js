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

  // --- 2.85 LOCALSTORAGE PINNED SHORTCUTS & FAVORITES MANAGER ---
  const PinnedSearches = {
    STORAGE_KEY: 'antigravity_pinned_searches',
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
      const storage = PinnedSearches._getStorage();
      try {
        if (storage) {
          const raw = storage.getItem(PinnedSearches.STORAGE_KEY);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.filter(item => item && (typeof item === 'object' ? (item.title || item.query) : (typeof item === 'string' && item.trim().length > 0)));
          }
          PinnedSearches.clear();
          return [];
        }
      } catch (err) {
        try {
          if (storage) storage.removeItem(PinnedSearches.STORAGE_KEY);
        } catch (e) {}
      }
      return PinnedSearches._memoryFallback || [];
    },

    add(item) {
      if (!item) return;
      const entry = typeof item === 'string' ? { id: item, title: item, query: item, isQuery: true } : item;
      if (!entry.title && !entry.query) return;
      const entryId = entry.id || entry.url || entry.title || entry.query;

      let list = PinnedSearches.getAll();
      list = list.filter(p => {
        const pid = typeof p === 'string' ? p : (p.id || p.url || p.title || p.query);
        return pid !== entryId;
      });
      list.unshift(entry);
      if (list.length > PinnedSearches.MAX_ITEMS) {
        list = list.slice(0, PinnedSearches.MAX_ITEMS);
      }

      PinnedSearches._memoryFallback = list;
      const storage = PinnedSearches._getStorage();
      try {
        if (storage) storage.setItem(PinnedSearches.STORAGE_KEY, JSON.stringify(list));
      } catch (err) {}
    },

    remove(id) {
      if (!id) return;
      let list = PinnedSearches.getAll().filter(p => {
        const pid = typeof p === 'string' ? p : (p.id || p.url || p.title || p.query);
        return pid !== id;
      });
      PinnedSearches._memoryFallback = list;
      const storage = PinnedSearches._getStorage();
      try {
        if (storage) storage.setItem(PinnedSearches.STORAGE_KEY, JSON.stringify(list));
      } catch (err) {}
    },

    isPinned(id) {
      if (!id) return false;
      const list = PinnedSearches.getAll();
      return list.some(p => {
        const pid = typeof p === 'string' ? p : (p.id || p.url || p.title || p.query);
        return pid === id;
      });
    },

    toggle(item) {
      if (!item) return false;
      const id = typeof item === 'string' ? item : (item.id || item.url || item.title || item.query);
      if (PinnedSearches.isPinned(id)) {
        PinnedSearches.remove(id);
        return false;
      } else {
        PinnedSearches.add(item);
        return true;
      }
    },

    clear() {
      PinnedSearches._memoryFallback = [];
      const storage = PinnedSearches._getStorage();
      try {
        if (storage) storage.removeItem(PinnedSearches.STORAGE_KEY);
      } catch (err) {}
    }
  };

  PinnedSearches.getAll = PinnedSearches.getAll.bind(PinnedSearches);
  PinnedSearches.add = PinnedSearches.add.bind(PinnedSearches);
  PinnedSearches.remove = PinnedSearches.remove.bind(PinnedSearches);
  PinnedSearches.isPinned = PinnedSearches.isPinned.bind(PinnedSearches);
  PinnedSearches.toggle = PinnedSearches.toggle.bind(PinnedSearches);
  PinnedSearches.clear = PinnedSearches.clear.bind(PinnedSearches);

  // --- 2.9 IN-MODAL PROCEDURAL MATH EVALUATOR (Safe zero-eval calculator) ---
  const MathEvaluator = {
    isMathQuery(query) {
      if (!query || typeof query !== 'string') return false;
      const q = query.trim();
      if (q.startsWith('=') && q.length > 1) return true;
      if (/^(calc|cal):/i.test(q)) return true;
      const cleaned = q.replace(/,/g, '').replace(/×/g, '*').replace(/÷/g, '/');
      if (/^[0-9+\-*/%^().\s]+$/.test(cleaned) && /[0-9]/.test(cleaned) && /[+\-*/%^]/.test(cleaned)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(q) && !/^-\d+$/.test(q)) {
          return true;
        }
      }
      return false;
    },

    evaluate(query) {
      if (!query || typeof query !== 'string') return null;
      let clean = query.trim();
      if (clean.startsWith('=')) clean = clean.substring(1).trim();
      if (/^(calc|cal):/i.test(clean)) clean = clean.replace(/^(calc|cal):/i, '').trim();

      clean = clean.replace(/,/g, '').replace(/×/g, '*').replace(/÷/g, '/');

      // Percentage phrase replacements
      clean = clean.replace(/([0-9.]+)%\s*(?:of|\*)\s*([0-9.]+)/gi, function (_, p1, p2) {
        return '(' + p1 + ' / 100 * ' + p2 + ')';
      });
      clean = clean.replace(/([0-9.]+)\s*([+-])\s*([0-9.]+)%/gi, function (_, p1, op, p2) {
        return '(' + p1 + ' ' + op + ' (' + p1 + ' * ' + p2 + ' / 100))';
      });
      clean = clean.replace(/([0-9.]+)%/gi, function (_, p1) {
        return '(' + p1 + ' / 100)';
      });

      if (!/^[0-9+\-*/().^%\s]|sqrt|abs|round|floor|ceil|pi|e/i.test(clean)) return null;
      const stripped = clean.replace(/sqrt|abs|round|floor|ceil|pi|e/gi, '');
      if (/[a-zA-Z]/.test(stripped)) return null;

      try {
        const tokens = clean.match(/([0-9.]+|[+\-*/^()]|sqrt|abs|round|floor|ceil|pi|e)/gi);
        if (!tokens || tokens.length === 0) return null;

        let pos = 0;
        function peek() { return tokens[pos]; }
        function consume(expected) {
          const t = tokens[pos++];
          if (expected && t !== expected) throw new Error('Expected ' + expected);
          return t;
        }

        function parseExpr() {
          let val = parseTerm();
          while (pos < tokens.length && (peek() === '+' || peek() === '-')) {
            const op = consume();
            const next = parseTerm();
            val = (op === '+') ? val + next : val - next;
          }
          return val;
        }

        function parseTerm() {
          let val = parseFactor();
          while (pos < tokens.length && (peek() === '*' || peek() === '/' || peek() === '%')) {
            const op = consume();
            const next = parseFactor();
            if (op === '/') {
              if (next === 0) return Infinity;
              val = val / next;
            } else if (op === '%') {
              val = val % next;
            } else {
              val = val * next;
            }
          }
          return val;
        }

        function parseFactor() {
          let val = parsePrimary();
          while (pos < tokens.length && peek() === '^') {
            consume();
            const next = parsePrimary();
            val = Math.pow(val, next);
          }
          return val;
        }

        function parsePrimary() {
          const t = peek();
          if (!t) throw new Error('Unexpected end of input');
          if (t === '+') { consume(); return parsePrimary(); }
          if (t === '-') { consume(); return -parsePrimary(); }
          if (t === '(') {
            consume('(');
            const val = parseExpr();
            consume(')');
            return val;
          }
          if (/^sqrt$/i.test(t)) {
            consume();
            consume('(');
            const val = parseExpr();
            consume(')');
            return Math.sqrt(val);
          }
          if (/^abs$/i.test(t)) {
            consume();
            consume('(');
            const val = parseExpr();
            consume(')');
            return Math.abs(val);
          }
          if (/^round$/i.test(t)) {
            consume();
            consume('(');
            const val = parseExpr();
            consume(')');
            return Math.round(val);
          }
          if (/^floor$/i.test(t)) {
            consume();
            consume('(');
            const val = parseExpr();
            consume(')');
            return Math.floor(val);
          }
          if (/^ceil$/i.test(t)) {
            consume();
            consume('(');
            const val = parseExpr();
            consume(')');
            return Math.ceil(val);
          }
          if (/^pi$/i.test(t)) { consume(); return Math.PI; }
          if (/^e$/i.test(t)) { consume(); return Math.E; }
          if (!isNaN(Number(t))) {
            consume();
            return Number(t);
          }
          throw new Error('Unexpected token: ' + t);
        }

        const rawResult = parseExpr();
        if (pos < tokens.length) return null;

        if (!isFinite(rawResult) || isNaN(rawResult)) {
          return null; // Division by zero, overflow, or NaN safely returns null
        }

        const rounded = Math.round(rawResult * 1000000) / 1000000;
        const formattedResult = rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });

        return {
          expression: query.replace(/^(=|calc:|cal:)\s*/i, '').trim(),
          rawResult,
          formattedResult
        };
      } catch (e) {
        return null;
      }
    }
  };

  // --- 2.10 RAYCAST-STYLE ACTION STUDIO & COMMAND PALETTE ---
  const ActionStudio = {
    isActionQuery(query) {
      if (!query || typeof query !== 'string') return false;
      return query.trim().startsWith('>');
    },

    getCommands(paletteInstance) {
      return [
        {
          id: 'cmd-theme',
          name: '> theme',
          title: 'Toggle Theme (Dark / Light / AMOLED)',
          description: 'Switch between Dark, Light, and AMOLED Black modes',
          icon: '🌓',
          shortcut: '↵ to toggle',
          execute: () => {
            if (typeof document === 'undefined') return 'Theme toggled';
            const html = document.documentElement;
            const current = (html && typeof html.getAttribute === 'function' ? html.getAttribute('data-theme') : null) ||
              (document.body && document.body.classList && document.body.classList.contains('light-theme') ? 'light' : 'dark');
            const next = current === 'dark' || current === 'amoled' ? 'light' : 'dark';
            if (html && typeof html.setAttribute === 'function') {
              html.setAttribute('data-theme', next);
            }
            if (document.body && document.body.classList) {
              if (next === 'light') {
                document.body.classList.add('light-theme');
              } else {
                document.body.classList.remove('light-theme');
              }
            }
            return `Switched to ${next.toUpperCase()} theme`;
          }
        },
        {
          id: 'cmd-copy-url',
          name: '> copy-url',
          title: 'Copy Current Page URL',
          description: 'Copies browser location address or anchor link to clipboard',
          icon: '📋',
          shortcut: '↵ to copy',
          execute: () => {
            if (typeof window === 'undefined') return 'URL copied';
            const url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(url).catch(() => {});
            }
            return `Copied: ${url}`;
          }
        },
        {
          id: 'cmd-export-results',
          name: '> export-results',
          title: 'Export Search Results to Markdown',
          description: 'Downloads current query results as a structured Markdown file',
          icon: '📥',
          shortcut: '↵ to export',
          execute: (palette) => {
            if (typeof document === 'undefined' || !palette) return 'Exported';
            const results = palette.results || palette.unfilteredResults || [];
            if (results.length === 0) return 'No results to export';
            let md = `# Search Export Report\n\n- Generated: ${new Date().toISOString()}\n- Total Matches: ${results.length}\n\n| # | Title | Score | Category | Content Preview |\n|---|---|---|---|---|\n`;
            results.forEach((r, idx) => {
              const cleanContent = (r.content || '').replace(/[\r\n]+/g, ' ').slice(0, 100);
              md += `| ${idx + 1} | ${r.title || 'Untitled'} | ${r.score || 0} | ${r.category || 'General'} | ${cleanContent}... |\n`;
            });
            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `search-export-${Date.now()}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return `Exported ${results.length} results to Markdown`;
          }
        },
        {
          id: 'cmd-clear-history',
          name: '> clear-history',
          title: 'Clear All Search History & Pinned Shortcuts',
          description: 'Purges localStorage recent searches and resets pinned items',
          icon: '🗑️',
          shortcut: '↵ to purge',
          execute: (palette) => {
            if (typeof RecentSearches !== 'undefined') RecentSearches.clear();
            if (typeof PinnedSearches !== 'undefined') PinnedSearches.clear();
            if (palette) palette.renderEmptyState();
            return 'Search history and pins wiped';
          }
        },
        {
          id: 'cmd-scroll-top',
          name: '> scroll-top',
          title: 'Scroll to Top of Page',
          description: 'Smoothly scrolls the browser viewport to the top',
          icon: '⬆️',
          shortcut: '↵ to scroll',
          execute: () => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return 'Scrolled to top';
          }
        },
        {
          id: 'cmd-scroll-bottom',
          name: '> scroll-bottom',
          title: 'Scroll to Bottom of Page',
          description: 'Smoothly scrolls the browser viewport to the bottom',
          icon: '⬇️',
          shortcut: '↵ to scroll',
          execute: () => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            return 'Scrolled to bottom';
          }
        },
        {
          id: 'cmd-help',
          name: '> help',
          title: 'Open Search Shortcuts & Help Cheatsheet',
          description: 'View the interactive keyboard controls and power features overlay',
          icon: '❓',
          shortcut: '↵ to view',
          execute: (palette) => {
            if (palette) palette.renderHelpState();
            return 'Help opened';
          }
        }
      ];
    },

    matchCommands(query, paletteInstance) {
      const raw = (query || '').trim();
      const clean = raw.startsWith('>') ? raw.substring(1).trim().toLowerCase() : raw.toLowerCase();
      const all = ActionStudio.getCommands(paletteInstance);
      if (!clean) return all;
      return all.filter(c => 
        c.name.toLowerCase().includes(clean) || 
        c.title.toLowerCase().includes(clean) || 
        c.description.toLowerCase().includes(clean)
      );
    }
  };

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

  // --- 3.5 DYNAMIC CENTERED KEYWORD WINDOWING & MATCH CLASSIFIER ---
  function extractDynamicSnippet(content, queryTokens, maxLength = 160) {
    if (!content || typeof content !== 'string') {
      return { snippet: '', matchType: 'Exact' };
    }

    const rawTokens = (queryTokens || [])
      .map(t => (t || '').toLowerCase().trim())
      .filter(t => t.length > 0);

    if (rawTokens.length === 0) {
      let clean = content.replace(/\s+/g, ' ').trim();
      let snip = clean.length > maxLength ? clean.slice(0, maxLength) + '...' : clean;
      return { snippet: snip, matchType: 'Exact' };
    }

    const cleanContent = content.replace(/\s+/g, ' ').trim();
    const words = cleanContent.split(' ');
    const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\u0900-\u097F]/g, ''));

    let bestWordIndex = -1;
    let detectedMatchType = 'Exact';

    for (let i = 0; i < lowerWords.length; i++) {
      const lw = lowerWords[i];
      if (!lw) continue;

      for (const qt of rawTokens) {
        if (lw === qt || lw.includes(qt) || (qt.length > 3 && qt.includes(lw))) {
          bestWordIndex = i;
          detectedMatchType = 'Exact';
          break;
        }
        if (typeof ROMAN_TRANSLITERATION !== 'undefined' && ROMAN_TRANSLITERATION[qt]) {
          const trans = ROMAN_TRANSLITERATION[qt];
          if (lw === trans || lw.includes(trans)) {
            bestWordIndex = i;
            detectedMatchType = 'Transliterated';
            break;
          }
        }
        if (typeof soundex === 'function' && qt.length >= 3 && lw.length >= 3) {
          if (soundex(qt) === soundex(lw)) {
            bestWordIndex = i;
            detectedMatchType = 'Phonetic';
            break;
          }
        }
        if (typeof DEFAULT_SYNONYMS !== 'undefined' && DEFAULT_SYNONYMS[qt]) {
          if (DEFAULT_SYNONYMS[qt].some(s => lw === s || lw.includes(s))) {
            bestWordIndex = i;
            detectedMatchType = 'Synonym';
            break;
          }
        }
      }
      if (bestWordIndex !== -1 && detectedMatchType === 'Exact') break;
    }

    if (bestWordIndex === -1) {
      let snippet = words.slice(0, 24).join(' ');
      if (words.length > 24) snippet += '...';
      return { snippet, matchType: 'Relevant' };
    }

    const startWordIdx = Math.max(0, bestWordIndex - 10);
    const endWordIdx = Math.min(words.length, bestWordIndex + 16);

    let snippetWords = words.slice(startWordIdx, endWordIdx);
    let snippet = snippetWords.join(' ');

    if (startWordIdx > 0) snippet = '... ' + snippet;
    if (endWordIdx < words.length) snippet = snippet + ' ...';

    // Highlight tokens
    const highlightTokens = new Set(rawTokens);
    rawTokens.forEach(qt => {
      if (typeof ROMAN_TRANSLITERATION !== 'undefined' && ROMAN_TRANSLITERATION[qt]) {
        highlightTokens.add(ROMAN_TRANSLITERATION[qt]);
      }
      if (typeof DEFAULT_SYNONYMS !== 'undefined' && DEFAULT_SYNONYMS[qt]) {
        DEFAULT_SYNONYMS[qt].forEach(s => highlightTokens.add(s));
      }
    });

    highlightTokens.forEach(tok => {
      if (tok && tok.length > 1) {
        const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped}[a-z]*)\\b`, 'gi');
        snippet = snippet.replace(regex, '<mark class="ai-search-highlight">$1</mark>');
      }
    });

    return { snippet, matchType: detectedMatchType };
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
          const dynamicResult = extractDynamicSnippet(doc.content, rawTokens, 160);
          ranked.push({
            ...doc,
            score: Math.round(score * 100) / 100,
            snippet: dynamicResult.snippet,
            matchType: dynamicResult.matchType
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
      const res = extractDynamicSnippet(content, queryTokens, maxLength);
      return res.snippet;
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

  // --- 5.5 DEFAULT WORKSPACE APPS CATALOG (Offline fallback) ---
  const DEFAULT_WORKSPACE_CATALOG = [
    {
      id: 'app-quran-analyzer',
      title: 'Quran Deep Analyzer',
      description: 'Authoritative multidimensional analytical system, morphology & roots for the Holy Quran.',
      category: 'Islamic & Faith',
      badge: '114 Surahs • Corpus',
      icon: '📖',
      tags: ['quran', 'ayat', 'surah', 'arabic', 'tafsir', 'morphology', 'concordance'],
      url: '../../15-Quran-Deep-Analyzer/index.html'
    },
    {
      id: 'app-hadith-portal',
      title: 'Faizan-e-Hadees (Roman Urdu Portal)',
      description: 'Complete 6-book classical Hadith encyclopedia with full Arabic text, Urdu and Roman Urdu search.',
      category: 'Islamic & Faith',
      badge: '7,882 Hadiths • AI Search',
      icon: '📜',
      tags: ['hadith', 'hadees', 'bukhari', 'muslim', 'sunnah', 'roman urdu'],
      url: '../../03-Hadith-Roman-Urdu/web/index.html'
    },
    {
      id: 'app-namaz-times',
      title: 'Namaz Prayer Times & Qibla',
      description: 'Precision astronomical solar engine, Jean Meeus ephemeris prayer times and Qibla compass.',
      category: 'Islamic & Faith',
      badge: 'Astronomical • PWA',
      icon: '🕌',
      tags: ['namaz', 'prayer', 'salah', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'qibla'],
      url: '../../02-Namaz-Prayer-Times/index.html'
    },
    {
      id: 'app-pincode-search',
      title: 'India Pincode Search & Postal Directory',
      description: 'Sub-millisecond offline post office locator and district pincode search engine.',
      category: 'Productivity & Utilities',
      badge: 'Offline • 155k Pincodes',
      icon: '📮',
      tags: ['pincode', 'postal', 'post office', 'india', 'courier', 'delivery'],
      url: '../../08-Pincode-Search/index.html'
    },
    {
      id: 'app-weight-gain',
      title: 'Sustainable Weight Gain Guide & Dashboard',
      description: 'Precision human physiology, liquid calorie surplus, and calisthenics hypertrophy protocols.',
      category: 'Health & Nutrition',
      badge: 'Health • Dashboard',
      icon: '🥗',
      tags: ['weight', 'diet', 'calories', 'food', 'nutrition', 'fitness', 'gain', 'khana'],
      url: '../../13-Sustainable-Weight-Gain-Guide/Weight_Gain_Dashboard.html'
    },
    {
      id: 'app-thela-stock',
      title: 'Thela Stock Manager',
      description: 'Inventory management and real-time Google Sheets webhook sync for logistics.',
      category: 'Productivity & Utilities',
      badge: 'Inventory • Cloud Sync',
      icon: '📦',
      tags: ['stock', 'inventory', 'thela', 'courier', 'sheets', 'warehouse'],
      url: '../../14-Thela-Stock-Manager/index.html'
    },
    {
      id: 'app-fatawa-reader',
      title: 'Fatawa Razviya Short Rulings Reader',
      description: 'Imam Ahmad Raza Khan 30-volume rulings encyclopedia with thematic search.',
      category: 'Islamic & Faith',
      badge: '30 Volumes • Fiqh',
      icon: '📚',
      tags: ['fatawa', 'razvia', 'razviya', 'fiqh', 'rulings', 'shariat', 'masail'],
      url: '../../12-Fatawa-Project/output/fatawa_reader.html'
    },
    {
      id: 'app-system-accel',
      title: 'System Acceleration Suite',
      description: 'Zero-bloat Windows performance tuning, SSD optimization, and RAM reclaim scripts.',
      category: 'Knowledge & Engineering',
      badge: 'Windows OS • Tuning',
      icon: '⚡',
      tags: ['system', 'windows', 'acceleration', 'ram', 'cleaner', 'pc', 'speed'],
      url: '../../07-System-Acceleration/README.md'
    },
    {
      id: 'app-update-software',
      title: 'PC Software Updater & Winget Hub',
      description: 'Automated Windows software package management and driver assistant auditor.',
      category: 'Knowledge & Engineering',
      badge: 'Winget • Desktop',
      icon: '🔄',
      tags: ['update', 'software', 'winget', 'pc', 'apps', 'install'],
      url: '../../06-Update-Software/README.md'
    },
    {
      id: 'app-events-countdown',
      title: 'Events Countdown & Tracker',
      description: 'Milestone and Islamic calendar event countdown manager with local storage.',
      category: 'Islamic & Faith',
      badge: 'PWA • Storage',
      icon: '📅',
      tags: ['events', 'countdown', 'calendar', 'dates', 'tracker'],
      url: '../../01-Events-Countdown/index.html'
    }
  ];

  // --- 6. SPOTLIGHT COMMAND PALETTE UI ---
  class SpotlightUI {
    constructor(engine, options = {}) {
      this.engine = engine;
      this.options = Object.assign({
        placeholder: 'Search content, headings, or ask AI (Ctrl+K)...',
        geminiApiKey: '',
        enableSound: true,
        categories: null,
        onSelect: null,
        catalogEngine: null,
        catalogItems: null
      }, options);

      this.isOpen = false;
      this.activeIndex = -1;
      this.results = [];
      this.unfilteredResults = [];
      this.activeCategory = 'All';
      this.autocompleteSuggestions = [];
      this.activeAutocompleteIndex = -1;

      // Scope & Actions state
      this.activeScope = 'page'; // 'page' or 'apps'
      this.catalogEngine = this.options.catalogEngine || null;
      const rawCatalog = this.options.catalogItems ||
        (typeof window !== 'undefined' && window.PORTAL_CATALOG && Array.isArray(window.PORTAL_CATALOG.apps) ? window.PORTAL_CATALOG.apps : null) ||
        (typeof window !== 'undefined' && Array.isArray(window.PORTAL_CATALOG) ? window.PORTAL_CATALOG : null) ||
        (typeof DEFAULT_WORKSPACE_CATALOG !== 'undefined' ? DEFAULT_WORKSPACE_CATALOG : []);
      this.catalogItems = Array.isArray(rawCatalog) ? rawCatalog : [];
      if (!this.catalogEngine && Array.isArray(this.catalogItems) && this.catalogItems.length > 0) {
        try {
          this.catalogEngine = new BM25Engine({ synonyms: this.options.synonyms || {} });
          this.catalogItems.forEach(item => {
            this.catalogEngine.addDocument({
              id: item.id || item.url || item.title,
              title: item.title,
              content: (item.description || '') + ' ' + (Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || '')),
              category: item.category || 'Workspace App',
              url: item.portalHref || item.url || item.serverHref || (item.relPath ? ('./' + item.relPath) : '#'),
              icon: item.icon || '🚀',
              isApp: true
            });
          });
        } catch (catErr) {
          console.warn('[AISearch] Default catalog indexing warning:', catErr);
        }
      }
      this.scopeBar = null;
      this.activeCalcCopy = null;
      this.lastCatalogHits = [];

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

          <div class="ai-search-scope-bar" id="ai-search-scope-bar" role="tablist" aria-label="Search Scope">
            <button type="button" class="ai-search-scope-pill ai-search-scope-active" data-scope="page" role="tab" aria-selected="true" id="ai-scope-page">
              <span class="ai-search-scope-icon">📄</span>
              <span class="ai-search-scope-label">This Page</span>
            </button>
            <button type="button" class="ai-search-scope-pill" data-scope="apps" role="tab" aria-selected="false" id="ai-scope-apps">
              <span class="ai-search-scope-icon">📦</span>
              <span class="ai-search-scope-label">All Workspace Apps</span>
              <span class="ai-search-scope-count" id="ai-scope-apps-count"></span>
            </button>
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
      this.scopeBar = root.querySelector('#ai-search-scope-bar');
      this.autocompleteContainer = root.querySelector('#ai-search-autocomplete');
      this.dymEl = root.querySelector('#ai-search-dym');
      this.micBtn = root.querySelector('#ai-search-mic-btn');
      this.isListening = false;
      this.recognition = null;
      this.initVoiceRecognition();
      this.updateScopeCounts();

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
          if (this.activeCalcCopy) {
            this.activeCalcCopy();
            return;
          }
          if (this.activeIndex >= 0 && this.results[this.activeIndex]) {
            this.selectResult(this.results[this.activeIndex]);
          } else if (this.results.length > 0) {
            this.selectResult(this.results[0]);
          }
        }
      });

      // Scope switching pills click delegation
      if (this.scopeBar) {
        this.scopeBar.querySelectorAll('.ai-search-scope-pill').forEach(pill => {
          pill.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const sc = pill.getAttribute('data-scope');
            if (sc) this.setScope(sc);
          });
        });
      }

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

    updateScopeCounts() {
      if (!this.modalEl) return;
      const countEl = this.modalEl.querySelector('#ai-scope-apps-count');
      if (countEl) {
        const count = this.catalogItems ? this.catalogItems.length : 0;
        countEl.textContent = count > 0 ? count : '';
        countEl.style.display = count > 0 ? 'inline-block' : 'none';
      }
    }

    setScope(scope) {
      if (!scope || (scope !== 'page' && scope !== 'apps')) return;
      this.activeScope = scope;
      if (this.options.enableSound) SoundFX.click();
      if (this.scopeBar) {
        this.scopeBar.querySelectorAll('.ai-search-scope-pill').forEach(p => {
          const isAct = p.getAttribute('data-scope') === scope;
          if (isAct) {
            p.classList.add('ai-search-scope-active');
            p.setAttribute('aria-selected', 'true');
          } else {
            p.classList.remove('ai-search-scope-active');
            p.setAttribute('aria-selected', 'false');
          }
        });
      }
      const q = this.inputEl ? this.inputEl.value.trim() : '';
      if (q) {
        this.performSearch(q);
      } else {
        this.renderEmptyState();
      }
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
      const cleanQ = (query || '').trim();
      this.activeCalcCopy = null;

      // 1. Math Calculation check
      if (typeof MathEvaluator !== 'undefined' && MathEvaluator.isMathQuery(cleanQ)) {
        const calcRes = MathEvaluator.evaluate(cleanQ);
        if (calcRes) {
          this.renderCalculation(calcRes);
          return;
        }
      }

      // 2. Action Studio check
      if (typeof ActionStudio !== 'undefined' && ActionStudio.isActionQuery(cleanQ)) {
        const cmds = ActionStudio.matchCommands(cleanQ, this);
        this.renderActions(cmds);
        return;
      }

      // 3. History tracking
      if (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined') {
        if (cleanQ && cleanQ !== '?' && cleanQ.toLowerCase() !== 'help' && !cleanQ.startsWith('>')) {
          RecentSearches.add(cleanQ);
        }
      }

      // 4. Scope-dependent search
      if (this.activeScope === 'apps' && this.catalogEngine) {
        this.unfilteredResults = this.catalogEngine.search(cleanQ, 20);
      } else {
        this.unfilteredResults = this.engine.search(cleanQ, 16);
      }
      this.activeIndex = -1;

      const rawTokens = tokenize(cleanQ);
      const activeEng = (this.activeScope === 'apps' && this.catalogEngine) ? this.catalogEngine : this.engine;
      const suggestion = activeEng.getSpellingSuggestion(rawTokens, this.unfilteredResults);
      this.renderDidYouMean(suggestion);

      if (this.unfilteredResults.length === 0) {
        // Fallback: If page search yielded zero hits, check if catalog apps match
        let catalogFallback = [];
        if (this.activeScope === 'page' && this.catalogEngine) {
          catalogFallback = this.catalogEngine.search(cleanQ, 4).filter(r => r.score >= 0.8);
        }

        if (catalogFallback.length > 0) {
          this.results = [];
          this.renderNoPageMatchesWithCatalogFallback(cleanQ, catalogFallback);
          this.aiCardContainer.style.display = 'none';
          return;
        }

        this.results = [];
        this.resultsContainer.innerHTML = `
          <div class="ai-search-empty-state">
            <p class="ai-search-empty-title">No matching ${this.activeScope === 'apps' ? 'apps' : 'sections'} found</p>
            <p class="ai-search-empty-desc">Try searching for broader keywords, synonyms, or check your spelling.</p>
          </div>
        `;
        this.aiCardContainer.style.display = 'none';
        return;
      }

      this.filterResultsByCategory(this.activeCategory);

      // Trigger optional Gemini AI synthesis if configured
      if (this.options.geminiApiKey) {
        this.synthesizeGeminiAnswer(cleanQ, this.results.length > 0 ? this.results : this.unfilteredResults);
      } else {
        this.aiCardContainer.style.display = 'none';
      }
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
            <span class="ai-search-help-title">💡 Antigravity Search & Command Palette Cheatsheet</span>
            <span class="ai-search-help-badge">v3.0 Hybrid</span>
          </div>
          <div class="ai-search-help-grid">
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">Keyboard Navigation</div>
              <ul class="ai-search-help-card-list">
                <li><kbd>Ctrl+K</kbd> / <kbd>Cmd+K</kbd> Open / focus palette</li>
                <li><kbd>↑</kbd> <kbd>↓</kbd> Navigate search results</li>
                <li><kbd>Enter</kbd> Select result or execute</li>
                <li><kbd>Tab</kbd> Accept top query suggestion</li>
                <li><kbd>Esc</kbd> Close command palette</li>
              </ul>
            </div>
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">Omnisearch & Actions</div>
              <ul class="ai-search-help-card-list">
                <li><code>= 25 * 40</code> Instant safe math calculator</li>
                <li><code>> theme</code> Toggle dark / light theme</li>
                <li><code>> copy-url</code> Copy current page link</li>
                <li><code>> export-results</code> Export search results</li>
                <li><code>[This Page] / [All Apps]</code> Scope switcher</li>
              </ul>
            </div>
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">Multilingual & Transliteration</div>
              <ul class="ai-search-help-card-list">
                <li><code>khana</code> ➔ food &amp; nutrition</li>
                <li><code>wazan</code> ➔ weight &amp; mass</li>
                <li><code>dawa</code> ➔ medicine &amp; health</li>
                <li><code>namaz</code> ➔ prayer timing &amp; fiqh</li>
                <li><code>khat</code> ➔ post &amp; logistics</li>
              </ul>
            </div>
            <div class="ai-search-help-card">
              <div class="ai-search-help-card-title">Smart Features</div>
              <ul class="ai-search-help-card-list">
                <li><code>⭐ Pin</code> Pin search shortcuts to top</li>
                <li><code>🎙️ Voice</code> Native Indian English / Hindi speech</li>
                <li><code>Typo tolerance</code> Automatic BM25 fuzzy matching</li>
                <li><code>Did you mean?</code> Intelligent spelling suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    renderCalculation(calcRes) {
      this.results = [];
      this.unfilteredResults = [];
      this.activeIndex = 0;
      this.hideAutocomplete();
      if (this.dymEl) this.dymEl.style.display = 'none';
      this.aiCardContainer.style.display = 'none';

      const escapeHtml = (str) => {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };

      this.resultsContainer.innerHTML = `
        <div class="ai-search-calc-card">
          <div class="ai-search-calc-header">
            <span class="ai-search-calc-badge">⚡ Instant Calculator</span>
            <span class="ai-search-match-badge ai-search-badge-calc">Math Engine</span>
          </div>
          <div class="ai-search-calc-body">
            <div class="ai-search-calc-expr">${escapeHtml(calcRes.expression)}</div>
            <div class="ai-search-calc-result">= ${calcRes.formattedResult}</div>
          </div>
          <div class="ai-search-calc-footer">
            <button type="button" class="ai-search-calc-copy-btn" id="ai-search-copy-calc">
              📋 Copy Result (${calcRes.formattedResult})
            </button>
            <span class="ai-search-calc-hint"><kbd>↵</kbd> to copy</span>
          </div>
        </div>
      `;

      const copyBtn = this.resultsContainer.querySelector('#ai-search-copy-calc');
      if (copyBtn) {
        const doCopy = () => {
          if (this.options.enableSound) SoundFX.click();
          if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(String(calcRes.rawResult)).catch(() => {});
          }
          copyBtn.innerHTML = `✓ Copied to Clipboard!`;
          copyBtn.classList.add('ai-search-copy-success');
          setTimeout(() => {
            if (copyBtn) {
              copyBtn.innerHTML = `📋 Copy Result (${calcRes.formattedResult})`;
              copyBtn.classList.remove('ai-search-copy-success');
            }
          }, 1800);
        };
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          doCopy();
        });
        this.activeCalcCopy = doCopy;
      }
    }

    renderActions(cmds) {
      this.results = cmds.map(c => ({
        ...c,
        isAction: true
      }));
      this.unfilteredResults = this.results;
      this.activeIndex = this.results.length > 0 ? 0 : -1;
      this.hideAutocomplete();
      if (this.dymEl) this.dymEl.style.display = 'none';
      this.aiCardContainer.style.display = 'none';

      if (cmds.length === 0) {
        this.resultsContainer.innerHTML = `
          <div class="ai-search-empty-state">
            <p class="ai-search-empty-title">No matching action commands</p>
            <p class="ai-search-empty-desc">Type <code>&gt;</code> to view all available commands.</p>
          </div>
        `;
        return;
      }

      let html = '<div class="ai-search-actions-list">';
      cmds.forEach((cmd, idx) => {
        const isSel = idx === 0;
        html += `
          <div class="ai-search-action-item ${isSel ? 'ai-search-item-selected' : ''}" data-index="${idx}" role="option">
            <span class="ai-search-action-icon">${cmd.icon}</span>
            <div class="ai-search-action-info">
              <div class="ai-search-action-name-row">
                <span class="ai-search-action-name">${cmd.name}</span>
                <span class="ai-search-match-badge ai-search-badge-action">Command</span>
              </div>
              <div class="ai-search-action-title">${cmd.title}</div>
              <div class="ai-search-action-desc">${cmd.description}</div>
            </div>
            <span class="ai-search-action-shortcut"><kbd>${cmd.shortcut}</kbd></span>
          </div>
        `;
      });
      html += '</div>';

      this.resultsContainer.innerHTML = html;

      this.resultsContainer.querySelectorAll('.ai-search-action-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-index'), 10);
          if (this.results[idx]) {
            this.executeAction(this.results[idx]);
          }
        });
      });
    }

    executeAction(cmd) {
      if (!cmd) return;
      if (this.options.enableSound) SoundFX.select();
      if (typeof cmd.execute === 'function') {
        try {
          cmd.execute(this);
        } catch (e) {}
      }
      this.close();
    }

    renderNoPageMatchesWithCatalogFallback(query, fallbackApps) {
      let html = `
        <div class="ai-search-empty-state" style="padding-bottom: 8px;">
          <p class="ai-search-empty-title">No matching sections on this page</p>
          <p class="ai-search-empty-desc">Found <strong>${fallbackApps.length}</strong> matching application${fallbackApps.length === 1 ? '' : 's'} across the workspace for "<em>${query}</em>":</p>
        </div>
        <div class="ai-search-catalog-divider" style="margin-top: 0;">
          <div class="ai-search-catalog-header">
            <span>📦 Workspace Apps &amp; Tools</span>
            <button type="button" class="ai-search-switch-scope-btn" id="ai-search-fallback-switch">View All Apps</button>
          </div>
        </div>
      `;

      fallbackApps.forEach((catApp, cIdx) => {
        const itemId = catApp.id || catApp.url || catApp.title;
        const isPinned = typeof PinnedSearches !== 'undefined' ? PinnedSearches.isPinned(itemId) : false;
        html += `
          <div class="ai-search-result-item ai-search-catalog-item" data-catalog-index="${cIdx}" role="option">
            <div class="ai-search-item-header">
              <span class="ai-search-item-icon">${catApp.icon || '🚀'}</span>
              <span class="ai-search-item-title">${catApp.title}</span>
              <div class="ai-search-item-meta">
                <span class="ai-search-match-badge ai-search-badge-app">App</span>
                <span class="ai-search-score-pill">BM25: ${catApp.score}</span>
                <button type="button" class="ai-search-pin-btn ${isPinned ? 'ai-search-pin-active' : ''}" data-catalog-index="${cIdx}" title="${isPinned ? 'Unpin' : 'Pin to top'}">
                  ${isPinned ? '★' : '☆'}
                </button>
              </div>
            </div>
            <div class="ai-search-item-snippet">${catApp.snippet}</div>
          </div>
        `;
      });

      this.resultsContainer.innerHTML = html;
      this.lastCatalogHits = fallbackApps;

      this.resultsContainer.querySelectorAll('.ai-search-catalog-item').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.ai-search-pin-btn')) return;
          const cIdx = parseInt(el.getAttribute('data-catalog-index'), 10);
          if (this.lastCatalogHits && this.lastCatalogHits[cIdx]) {
            this.selectResult(this.lastCatalogHits[cIdx]);
          }
        });
      });

      this.resultsContainer.querySelectorAll('.ai-search-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cIdx = parseInt(btn.getAttribute('data-catalog-index'), 10);
          const item = this.lastCatalogHits ? this.lastCatalogHits[cIdx] : null;
          if (item && typeof PinnedSearches !== 'undefined') {
            const isNowPinned = PinnedSearches.toggle(item);
            if (this.options.enableSound) SoundFX.click();
            btn.innerHTML = isNowPinned ? '★' : '☆';
            btn.classList.toggle('ai-search-pin-active', isNowPinned);
          }
        });
      });

      const fallbackSwitchBtn = this.resultsContainer.querySelector('#ai-search-fallback-switch');
      if (fallbackSwitchBtn) {
        fallbackSwitchBtn.addEventListener('click', () => this.setScope('apps'));
      }
    }

    renderResults(results) {
      let html = '';
      results.forEach((item, index) => {
        const itemId = item.id || item.url || item.title;
        const isPinned = typeof PinnedSearches !== 'undefined' ? PinnedSearches.isPinned(itemId) : false;
        const matchType = item.isApp ? 'App' : (item.matchType || 'Exact');
        const badgeClass = `ai-search-badge-${matchType.toLowerCase()}`;
        const icon = item.icon || (item.isApp ? '📦' : '📄');

        html += `
          <div class="ai-search-result-item ${index === this.activeIndex ? 'ai-search-item-selected' : ''}" data-index="${index}" role="option">
            <div class="ai-search-item-header">
              <span class="ai-search-item-icon">${icon}</span>
              <span class="ai-search-item-title">${item.title}</span>
              <div class="ai-search-item-meta">
                <span class="ai-search-match-badge ${badgeClass}">${matchType}</span>
                <span class="ai-search-score-pill">BM25: ${item.score}</span>
                <button type="button" class="ai-search-pin-btn ${isPinned ? 'ai-search-pin-active' : ''}" data-index="${index}" title="${isPinned ? 'Unpin' : 'Pin to top'}">
                  ${isPinned ? '★' : '☆'}
                </button>
              </div>
            </div>
            <div class="ai-search-item-snippet">${item.snippet}</div>
          </div>
        `;
      });

      // Auto-blend: if in page scope and catalog items matched
      if (this.activeScope === 'page' && this.catalogEngine && this.inputEl) {
        const q = this.inputEl.value.trim();
        if (q && q.length > 2 && !q.startsWith('>') && !q.startsWith('=')) {
          const catHits = this.catalogEngine.search(q, 3).filter(c => c.score >= 0.9);
          if (catHits.length > 0) {
            html += `
              <div class="ai-search-catalog-divider">
                <div class="ai-search-catalog-header">
                  <span>📦 Matching Workspace Apps &amp; Tools</span>
                  <button type="button" class="ai-search-switch-scope-btn" id="ai-search-switch-to-apps">
                    View All Apps
                  </button>
                </div>
              </div>
            `;
            catHits.forEach((catApp, cIdx) => {
              const itemId = catApp.id || catApp.url || catApp.title;
              const isPinned = typeof PinnedSearches !== 'undefined' ? PinnedSearches.isPinned(itemId) : false;
              html += `
                <div class="ai-search-result-item ai-search-catalog-item" data-catalog-index="${cIdx}" role="option">
                  <div class="ai-search-item-header">
                    <span class="ai-search-item-icon">${catApp.icon || '🚀'}</span>
                    <span class="ai-search-item-title">${catApp.title}</span>
                    <div class="ai-search-item-meta">
                      <span class="ai-search-match-badge ai-search-badge-app">App</span>
                      <span class="ai-search-score-pill">BM25: ${catApp.score}</span>
                      <button type="button" class="ai-search-pin-btn ${isPinned ? 'ai-search-pin-active' : ''}" data-catalog-index="${cIdx}" title="${isPinned ? 'Unpin' : 'Pin to top'}">
                        ${isPinned ? '★' : '☆'}
                      </button>
                    </div>
                  </div>
                  <div class="ai-search-item-snippet">${catApp.snippet}</div>
                </div>
              `;
            });
            this.lastCatalogHits = catHits;
          } else {
            this.lastCatalogHits = [];
          }
        }
      }

      this.resultsContainer.innerHTML = html;

      // Click binding on normal results
      this.resultsContainer.querySelectorAll('.ai-search-result-item:not(.ai-search-catalog-item)').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.ai-search-pin-btn')) return;
          const idx = parseInt(el.getAttribute('data-index'), 10);
          if (this.results[idx]) {
            this.selectResult(this.results[idx]);
          }
        });
      });

      // Click binding on catalog items
      this.resultsContainer.querySelectorAll('.ai-search-catalog-item').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.ai-search-pin-btn')) return;
          const cIdx = parseInt(el.getAttribute('data-catalog-index'), 10);
          if (this.lastCatalogHits && this.lastCatalogHits[cIdx]) {
            this.selectResult(this.lastCatalogHits[cIdx]);
          }
        });
      });

      // Pin button binding
      this.resultsContainer.querySelectorAll('.ai-search-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let item = null;
          if (btn.hasAttribute('data-index')) {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            item = this.results[idx];
          } else if (btn.hasAttribute('data-catalog-index')) {
            const cIdx = parseInt(btn.getAttribute('data-catalog-index'), 10);
            item = this.lastCatalogHits ? this.lastCatalogHits[cIdx] : null;
          }
          if (item && typeof PinnedSearches !== 'undefined') {
            const isNowPinned = PinnedSearches.toggle(item);
            if (this.options.enableSound) SoundFX.click();
            btn.innerHTML = isNowPinned ? '★' : '☆';
            btn.classList.toggle('ai-search-pin-active', isNowPinned);
          }
        });
      });

      // Switch to apps scope button
      const switchBtn = this.resultsContainer.querySelector('#ai-search-switch-to-apps');
      if (switchBtn) {
        switchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setScope('apps');
        });
      }
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

      const pinnedList = (typeof PinnedSearches !== 'undefined')
        ? PinnedSearches.getAll()
        : [];

      const recentList = (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined')
        ? RecentSearches.getAll()
        : [];

      let pinnedHtml = '';
      if (pinnedList.length > 0) {
        pinnedHtml = `
          <div class="ai-search-pinned-section">
            <div class="ai-search-pinned-header">
              <span class="ai-search-pinned-title">⭐ Pinned Shortcuts</span>
              <button type="button" class="ai-search-clear-pins-btn" id="ai-search-clear-pins">Clear</button>
            </div>
            <div class="ai-search-pinned-chips">
              ${pinnedList.map(item => {
                const title = typeof item === 'object' ? (item.title || item.query) : item;
                const id = typeof item === 'object' ? (item.id || item.url || item.title || item.query) : item;
                const icon = (typeof item === 'object' && item.icon) ? item.icon : '📌';
                return `
                  <button type="button" class="ai-search-pinned-chip" data-id="${id.replace(/"/g, '&quot;')}" title="${title}">
                    <span class="ai-search-pinned-icon">${icon}</span>
                    <span class="ai-search-pinned-label">${title.replace(/</g, '&lt;')}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

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
          ${pinnedHtml}
          ${recentHtml}
          <p class="ai-search-empty-title">Instant Semantic Omnisearch</p>
          <p class="ai-search-empty-desc">Type keywords, math (<code>= 25*40</code>), commands (<code>&gt; theme</code>), or voice queries.</p>
          <div class="ai-search-tip-chips">
            <span class="ai-search-chip">⚡ Sub-millisecond</span>
            <span class="ai-search-chip">📦 26+ Apps Omnisearch</span>
            <span class="ai-search-chip">🧮 Math &amp; Commands</span>
          </div>
        </div>
      `;

      // Wire clear pins & clear history
      const clearPinsBtn = this.resultsContainer.querySelector('#ai-search-clear-pins');
      if (clearPinsBtn) {
        clearPinsBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.options.enableSound) SoundFX.click();
          if (typeof PinnedSearches !== 'undefined') PinnedSearches.clear();
          this.renderEmptyState();
        });
      }

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

      // Wire pinned chips click
      this.resultsContainer.querySelectorAll('.ai-search-pinned-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = chip.getAttribute('data-id');
          const pList = typeof PinnedSearches !== 'undefined' ? PinnedSearches.getAll() : [];
          const found = pList.find(p => (typeof p === 'object' ? (p.id || p.url || p.title || p.query) : p) === id);
          if (found && typeof found === 'object' && !found.isQuery) {
            this.selectResult(found);
          } else {
            const q = (found && typeof found === 'object') ? (found.query || found.title) : id;
            if (q) {
              if (this.options.enableSound) SoundFX.click();
              this.inputEl.value = q;
              this.performSearch(q);
              this.inputEl.focus();
            }
          }
        });
      });

      // Wire recent chips click
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

    selectResult(result) {
      if (!result) return;
      if (this.options.enableSound) SoundFX.select();
      if (this.options.enableHistory !== false && typeof RecentSearches !== 'undefined') {
        const q = this.inputEl ? this.inputEl.value.trim() : '';
        if (q && q !== '?' && q.toLowerCase() !== 'help' && !q.startsWith('>')) {
          RecentSearches.add(q);
        }
      }
      this.close();

      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(result);
        return;
      }

      // Check if result is an Action Command
      if (result.isAction && typeof result.execute === 'function') {
        try {
          result.execute(this);
        } catch (e) {}
        return;
      }

      // Check if result is a Workspace App
      if (result.isApp) {
        if (result.url) {
          window.location.href = result.url;
        }
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
        if (result.url.startsWith('#')) {
          window.location.hash = result.url.replace(/^#/, '');
        } else {
          window.location.href = result.url;
        }
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
    catalogEngine: null,
    ui: null,

    init(options = {}) {
      try {
        const config = Object.assign({
          autoCrawl: true,
          containerSelector: '',
          excludeSelector: '',
          data: null,
          catalog: null,
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

        // Build workspace catalog engine if catalog data exists or fallback
        const catalogSource = Array.isArray(config.catalog) ? config.catalog :
          (typeof window !== 'undefined' && window.PORTAL_CATALOG && Array.isArray(window.PORTAL_CATALOG.apps)) ? window.PORTAL_CATALOG.apps :
          (typeof window !== 'undefined' && Array.isArray(window.PORTAL_CATALOG)) ? window.PORTAL_CATALOG :
          (typeof DEFAULT_WORKSPACE_CATALOG !== 'undefined' ? DEFAULT_WORKSPACE_CATALOG : []);

        if (Array.isArray(catalogSource) && catalogSource.length > 0) {
          this.catalogEngine = new BM25Engine({ synonyms: config.synonyms });
          catalogSource.forEach(item => {
            this.catalogEngine.addDocument({
              id: item.id || item.url || item.title,
              title: item.title,
              content: (item.description || '') + ' ' + (Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || '')),
              category: item.category || 'Workspace App',
              url: item.portalHref || item.url || item.serverHref || (item.relPath ? ('./' + item.relPath) : '#'),
              icon: item.icon || '🚀',
              isApp: true
            });
          });
          config.catalogEngine = this.catalogEngine;
          config.catalogItems = catalogSource;
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

    searchCatalog(query, options = 5) {
      if (!this.catalogEngine) return [];
      const hits = this.catalogEngine.search(query, options);
      return hits.map(h => ({ ...h, isApp: true }));
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
    DEFAULT_SYNONYMS,
    DEFAULT_WORKSPACE_CATALOG,
    MathEvaluator,
    evaluateMath: (expr) => MathEvaluator.evaluate(expr),
    ActionStudio,
    getActionCommands: () => ActionStudio.getCommands(),
    executeAction: (id, ctx) => ActionStudio.execute(id, ctx),
    PinnedSearches,
    addPinnedSearch: (q) => PinnedSearches.add(q),
    removePinnedSearch: (q) => PinnedSearches.remove(q),
    getPinnedSearches: () => PinnedSearches.getAll(),
    clearPinnedSearches: () => PinnedSearches.clear(),
    extractDynamicSnippet
  };

  // Node.js / CommonJS vs Browser export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AISearch;
  } else {
    global.AISearch = AISearch;
  }

})(typeof window !== 'undefined' ? window : globalThis);
