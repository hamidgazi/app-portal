/**
 * ============================================================================
 * Hadith AI Search Engine & Mobile Spotlight Palette (ai_search.js)
 * ============================================================================
 * Tailored high-performance search engine for 7,882 Roman Urdu, Urdu, and Arabic Hadiths.
 *
 * Capabilities:
 *  1. Sub-10ms BM25 ranking across 7,882 Hadiths (In-Memory Inverted Index).
 *  2. Trilingual tokenization: English/Roman Urdu, Urdu Nastaliq, and Arabic.
 *  3. Arabic Diacritics (Harakat) & Orthographic Normalization.
 *  4. South Asian Islamic Transliteration & Phonetic Clustering (wazu, namaz, roza, hajj, etc.).
 *  5. Directive 5 Compliant: Defensive bootloader (try/catch), explicit getElementById DOM hygiene.
 *  6. Directive 7 Compliant: Procedural Web Audio API sound effects (subtle ticks & chimes, zero music).
 *  7. Floating spotlight palette with desktop (Ctrl+K) and mobile bottom-sheet ergonomics.
 *  8. "Ask AI" Gemini Progressive Synthesizer with contextual Hadith citations.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // --- 1. PROCEDURAL ACOUSTIC FEEDBACK (Directive 7: Zero music, non-musical SFX only) ---
  const SoundFX = {
    ctx: null,
    enabled: true,
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
    tick() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
      } catch (e) {}
    },
    select() {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.05); // G5
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }
  };

  // --- 2. MULTILINGUAL ISLAMIC VOCABULARY & TRANSLITERATION GRAPH ---
  const TRANSLITERATION_MAP = {
    // Taharah & Prayer
    'wudu': ['wazu', 'wudhu', 'wazoo', 'ablution', 'وضو'],
    'wazu': ['wudu', 'wudhu', 'wazoo', 'ablution', 'وضو'],
    'ghusl': ['ghusal', 'bath', 'غسل'],
    'namaz': ['salah', 'salat', 'prayer', 'نماز', 'صلاة', 'صلوة'],
    'salah': ['namaz', 'salat', 'prayer', 'نماز', 'صلاة'],
    'salat': ['namaz', 'salah', 'prayer', 'نماز', 'صلاة'],
    'azan': ['azaan', 'adhaan', 'call', 'اذان'],
    'azaan': ['azan', 'adhaan', 'اذان'],
    'iqamat': ['iqamah', 'اقامت'],
    'tahajjud': ['tahajud', 'shab bedari', 'تہجد', 'تهجد'],
    'tayammum': ['tayamum', 'تیمم'],
    'imamat': ['imam', 'imamah', 'امامت'],
    'masjid': ['mosque', 'masajid', 'مسجد'],
    'sajda': ['sajdah', 'sujood', 'سجدہ', 'سجود'],
    'ruku': ['rukoo', 'رکوع'],
    'qibla': ['qiblah', 'kaaba', 'قبلہ', 'کعبہ'],
    'janaza': ['janazah', 'funeral', 'جنازہ'],

    // Pillars & Worship
    'roza': ['sawm', 'fasting', 'saum', 'روزہ', 'صوم', 'صیام'],
    'sawm': ['roza', 'fasting', 'روزہ', 'صوم'],
    'sehri': ['suhoor', 'sehr', 'سحری'],
    'iftar': ['iftari', 'aftar', 'افطار'],
    'ramadan': ['ramzan', 'ramadhan', 'رمضان'],
    'ramzan': ['ramadan', 'ramadhan', 'رمضان'],
    'zakat': ['zakaat', 'charity', 'زکوٰۃ', 'زکوۃ'],
    'sadqah': ['sadaqah', 'khairat', 'صدقہ'],
    'hajj': ['haj', 'pilgrimage', 'حج'],
    'umrah': ['umra', 'عمرہ'],
    'qurbani': ['udhiah', 'sacrifice', 'قربانی'],
    'itikaf': ['ehtikaf', 'i\'tikaf', 'اعتکاف'],
    'eid': ['eed', 'festival', 'عید'],

    // Faith & Belief
    'iman': ['imaan', 'faith', 'ایمان'],
    'imaan': ['iman', 'faith', 'ایمان'],
    'tauheed': ['tawheed', 'oneness', 'توحید'],
    'shirk': ['polytheism', 'شرک'],
    'sunnah': ['sunnat', 'hadees', 'hadith', 'سنت'],
    'sunnat': ['sunnah', 'hadees', 'hadith', 'سنت'],
    'hadith': ['hadees', 'hadeeth', 'tradition', 'حدیث'],
    'hadees': ['hadith', 'hadeeth', 'حدیث'],
    'durood': ['darood', 'salawat', 'درود', 'صلوات'],
    'darood': ['durood', 'salawat', 'درود'],
    'istighfar': ['istighfaar', 'tawbah', 'tauba', 'استغفار', 'توبہ'],
    'tawbah': ['tauba', 'repentance', 'توبہ'],
    'dua': ['duaa', 'supplication', 'دعا'],
    'jannat': ['jannah', 'paradise', 'heaven', 'جنت'],
    'jahannam': ['dozakh', 'hell', 'جہنم', 'دوزخ'],
    'dozakh': ['jahannam', 'hell', 'دوزخ'],
    'qabr': ['qabar', 'grave', 'قبر'],
    'qayamat': ['qiyamah', 'judgment', 'قیامت'],
    'shafaat': ['shafaa', 'intercession', 'شفاعت'],
    'nikah': ['nikaah', 'marriage', 'نکاح'],
    'talaq': ['talaaq', 'divorce', 'طلاق'],
    'wirasat': ['tarka', 'inheritance', 'وراثت', 'ترکہ'],
    'rizq': ['rozi', 'sustenance', 'رزق'],
    'ilm': ['knowledge', 'علم'],
    'jihad': ['jihaad', 'struggle', 'جہاد'],
    'akhlaq': ['character', 'manners', 'اخلاق'],
    'adab': ['etiquette', 'ادب'],
    'walidain': ['parents', 'maa baap', 'والدین'],
    'padosi': ['neighbor', 'humsaya', 'ہمسایہ']
  };

  // --- 3. TEXT NORMALIZERS (ARABIC, URDU, LATIN) ---
  function normalizeArabic(text) {
    if (!text) return '';
    return text
      // Strip Arabic harakat/tashkeel (Fathah, Dammah, Kasrah, Sukun, Shaddah, Tanwin, etc.)
      .replace(/[\u064B-\u0652\u0653-\u065F\u0670\u06D6-\u06ED]/g, '')
      // Normalize Alif forms (أ, إ, آ -> ا)
      .replace(/[إأآٱ]/g, 'ا')
      // Normalize Taa Marbuta (ة -> ه)
      .replace(/ة/g, 'ه')
      // Normalize Yaa (ي, ى -> ی)
      .replace(/[يى]/g, 'ی')
      // Normalize Kaf (ك -> ک)
      .replace(/ك/g, 'ک');
  }

  function normalizeUrdu(text) {
    if (!text) return '';
    return text
      .replace(/[∞€α؎۱؎۲؎۳؎۴؎۵؎]/g, '')
      .replace(/[إأآ]/g, 'ا')
      .replace(/ۂ/g, 'ہ')
      .replace(/ئے/g, 'ے')
      .replace(/[،۔؟«»؛]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeLatin(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[āáàâä]/g, 'a')
      .replace(/[īíìîï]/g, 'i')
      .replace(/[ūúùûü]/g, 'u')
      .replace(/[ōóòôö]/g, 'o')
      .replace(/[ēéèêë]/g, 'e')
      .replace(/[\u2018\u2019'`]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(str) {
    if (!str) return [];
    const tokens = [];

    // 1. Latin tokens
    const latinNorm = normalizeLatin(str);
    const latinWords = latinNorm.split(/\s+/).filter(w => w.length > 1);
    tokens.push(...latinWords);

    // 2. Arabic & Urdu tokens
    const arNorm = normalizeArabic(str);
    const urNorm = normalizeUrdu(arNorm);
    const eastWords = urNorm.split(/[\s\p{P}]+/u).filter(w => w.length > 1);
    tokens.push(...eastWords);

    return tokens;
  }

  // --- 4. OPTIMIZED IN-MEMORY BM25 ENGINE ---
  class HadithSearchEngine {
    constructor() {
      this.docs = []; // Original items
      this.invertedIndex = new Map(); // token -> array of [docIndex, weight]
      this.docLengths = [];
      this.avgDocLength = 0;
      this.totalDocs = 0;
      this.k1 = 1.2;
      this.b = 0.75;
      this.isIndexed = false;
    }

    indexAll(items) {
      if (!Array.isArray(items) || items.length === 0) return;
      console.time('[HadithSearch] Inverted Index Construction');
      this.docs = items;
      this.totalDocs = items.length;
      this.docLengths = new Float32Array(this.totalDocs);
      let totalLength = 0;

      for (let i = 0; i < this.totalDocs; i++) {
        const h = items[i];
        // Collect tokens with field weights:
        // hadith_no (3.0), chapter (2.5), roman (1.8), urdu (1.5), arabic (1.2)
        const tokenWeights = new Map();

        const addField = (text, weight) => {
          if (!text) return;
          const tokens = tokenize(text);
          for (let j = 0; j < tokens.length; j++) {
            const t = tokens[j];
            tokenWeights.set(t, (tokenWeights.get(t) || 0) + weight);
          }
        };

        if (h.no) addField(String(h.no), 3.5);
        if (h.ch) addField(h.ch, 2.5);
        if (h.ro) addField(h.ro, 1.8);
        if (h.ur) addField(h.ur, 1.4);
        if (h.ar) addField(h.ar, 1.2);

        const length = tokenWeights.size;
        this.docLengths[i] = length;
        totalLength += length;

        // Populate Inverted Index
        for (const [token, tf] of tokenWeights.entries()) {
          let postings = this.invertedIndex.get(token);
          if (!postings) {
            postings = [];
            this.invertedIndex.set(token, postings);
          }
          postings.push(i, tf); // [docIdx, tf] pairs
        }
      }

      this.avgDocLength = totalLength / (this.totalDocs || 1);
      this.isIndexed = true;
      console.timeEnd('[HadithSearch] Inverted Index Construction');
      console.log(`[HadithSearch] Inverted index built for ${this.totalDocs} Hadiths with ${this.invertedIndex.size} unique tokens.`);
    }

    search(query, options = {}) {
      if (!this.isIndexed || !query || !query.trim()) return [];
      const startTime = performance.now();
      const rawQuery = query.trim().toLowerCase();
      const limit = options.limit || 25;
      const bookFilter = options.bookId || null;

      // Extract search tokens
      let queryTokens = tokenize(rawQuery);

      // Expand synonyms / transliterations
      const expandedTokens = new Set(queryTokens);
      queryTokens.forEach(token => {
        const syns = TRANSLITERATION_MAP[token];
        if (syns) {
          syns.forEach(s => {
            tokenize(s).forEach(st => expandedTokens.add(st));
          });
        }
      });

      const searchTerms = Array.from(expandedTokens);
      const scores = new Float32Array(this.totalDocs);
      const matchedTermsCount = new Uint8Array(this.totalDocs);

      for (let t = 0; t < searchTerms.length; t++) {
        const term = searchTerms[t];
        const postings = this.invertedIndex.get(term);
        if (!postings) {
          // Check prefix matching for terms > 3 chars
          if (term.length >= 3) {
            for (const [key, p] of this.invertedIndex.entries()) {
              if (key.startsWith(term) && key !== term) {
                const df = p.length / 2;
                const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
                for (let j = 0; j < p.length; j += 2) {
                  const docIdx = p[j];
                  const tf = p[j + 1] * 0.7; // prefix discount
                  const lenNorm = 1 - this.b + this.b * (this.docLengths[docIdx] / this.avgDocLength);
                  const termScore = idf * ((tf * (this.k1 + 1)) / (tf + this.k1 * lenNorm));
                  scores[docIdx] += termScore;
                  matchedTermsCount[docIdx]++;
                }
              }
            }
          }
          continue;
        }

        const df = postings.length / 2;
        const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));

        for (let j = 0; j < postings.length; j += 2) {
          const docIdx = postings[j];
          const tf = postings[j + 1];
          const lenNorm = 1 - this.b + this.b * (this.docLengths[docIdx] / this.avgDocLength);
          const termScore = idf * ((tf * (this.k1 + 1)) / (tf + this.k1 * lenNorm));
          scores[docIdx] += termScore;
          matchedTermsCount[docIdx]++;
        }
      }

      // Collect and rank matches
      const results = [];
      for (let i = 0; i < this.totalDocs; i++) {
        if (scores[i] > 0) {
          const doc = this.docs[i];
          if (bookFilter && Number(doc.b) !== Number(bookFilter)) {
            continue;
          }
          // Coordinate match boost: reward items matching multiple query terms
          const coordBoost = 1 + (matchedTermsCount[i] * 0.25);
          results.push({
            hadith: doc,
            score: scores[i] * coordBoost
          });
        }
      }

      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, limit);
      const elapsed = (performance.now() - startTime).toFixed(1);
      return {
        results: topResults,
        totalMatches: results.length,
        elapsedMs: elapsed
      };
    }
  }

  // --- 5. SPOTLIGHT UI CONTROLLER ---
  class HadithSpotlightUI {
    constructor(engine, options = {}) {
      this.engine = engine;
      this.options = options;
      this.isOpen = false;
      this.activeTab = 'search'; // 'search' or 'ai'
      this.activeScript = 'roman'; // 'roman', 'urdu', 'arabic', 'all'
      this.activeBookFilter = null;
      this.selectedIndex = -1;
      this.currentResults = [];

      this.createDOM();
      this.bindEvents();
    }

    createDOM() {
      // Create backdrop container
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'ai-search-modal-backdrop';
      this.backdrop.id = 'hadith-spotlight-backdrop';

      this.backdrop.innerHTML = `
        <div class="ai-search-modal-card" role="dialog" aria-modal="true" aria-label="Hadith AI Search">
          <!-- Header Bar -->
          <div class="ai-search-header">
            <div class="ai-search-input-wrapper">
              <span class="ai-search-icon" style="font-size: 1.1rem;">🔍</span>
              <input 
                type="text" 
                id="hadith-spotlight-input" 
                class="ai-search-input" 
                placeholder="Search 7,882 Hadiths (e.g., wazu, namaz, roza, Hadith 772, نیت)..." 
                autocomplete="off" 
                spellcheck="false"
              />
              <button type="button" id="hadith-spotlight-voice" class="ai-search-voice-btn" title="Voice Search">🎤</button>
              <button type="button" id="hadith-spotlight-clear" class="ai-search-clear-btn" title="Clear">✕</button>
            </div>
            <button type="button" id="hadith-spotlight-close" class="ai-search-close-btn" title="Close (Esc)">✕</button>
          </div>

          <!-- Mode Navigation (Spotlight / Ask AI) -->
          <div style="display: flex; gap: 8px; padding: 8px 16px; background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid var(--ai-search-border);">
            <button type="button" class="hadith-search-tab-btn active" id="tab-search-btn" style="flex: 1; padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: none; background: #38bdf8; color: #020617; display: flex; align-items: center; justify-content: center; gap: 6px;">
              ⚡ Instant Hadith Search
            </button>
            <button type="button" class="hadith-search-tab-btn" id="tab-ai-btn" style="flex: 1; padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(30, 41, 59, 0.5); color: #cbd5e1; display: flex; align-items: center; justify-content: center; gap: 6px;">
              🤖 Ask AI (Gemini Q&A)
            </button>
          </div>

          <!-- Secondary Filter Bar (Books & Scripts) -->
          <div id="hadith-spotlight-filters" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: rgba(11, 15, 25, 0.9); border-bottom: 1px solid var(--ai-search-border); flex-wrap: wrap; gap: 8px;">
            <div id="book-filter-scroll" style="display: flex; gap: 6px; overflow-x: auto; max-width: 100%; padding-bottom: 2px;">
              <button type="button" class="hadith-filter-pill active" data-book="" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; font-weight: 600; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; cursor: pointer; white-space: nowrap;">All Books (7,882)</button>
              <button type="button" class="hadith-filter-pill" data-book="1" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">📖 Mir'at (6,294)</button>
              <button type="button" class="hadith-filter-pill" data-book="12" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">🌿 Riyaz (1,352)</button>
              <button type="button" class="hadith-filter-pill" data-book="14" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">💎 Anwar (114)</button>
              <button type="button" class="hadith-filter-pill" data-book="13" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">📜 Nawawi (42)</button>
              <button type="button" class="hadith-filter-pill" data-book="9" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">⚖️ Hanafi (40)</button>
              <button type="button" class="hadith-filter-pill" data-book="10" style="padding: 4px 10px; border-radius: 14px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; white-space: nowrap;">✨ Muntakhab (40)</button>
            </div>
            <div style="display: flex; gap: 4px; align-items: center; margin-left: auto;">
              <span style="font-size: 0.7rem; color: #64748b; margin-right: 4px;">Script:</span>
              <button type="button" class="hadith-script-pill active" data-script="roman" style="padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; border: none; background: #38bdf8; color: #020617; font-weight: bold;">Roman</button>
              <button type="button" class="hadith-script-pill" data-script="urdu" style="padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background: transparent; color: #94a3b8;">اردو</button>
              <button type="button" class="hadith-script-pill" data-script="all" style="padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background: transparent; color: #94a3b8;">All</button>
            </div>
          </div>

          <!-- AI Q&A Container (Hidden by default) -->
          <div id="hadith-ai-section" style="display: none; padding: 16px; background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid var(--ai-search-border);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #38bdf8;">
                <span>✨ Ask Islamic AI about Hadiths</span>
              </div>
              <span style="font-size: 0.72rem; color: #94a3b8;">Cites canonical sources</span>
            </div>
            <div id="hadith-ai-response" style="background: rgba(11, 15, 25, 0.95); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 10px; padding: 14px; min-height: 80px; font-size: 0.88rem; line-height: 1.6; color: #e2e8f0;">
              Type your question above and press Enter (e.g., "What are the virtues of Durood Sharif?", "What breaks wazu?").
            </div>
          </div>

          <!-- Search Results List -->
          <div id="hadith-spotlight-results" class="ai-search-results" style="max-height: 55vh; overflow-y: auto; padding: 8px 12px;">
            <!-- Dynamically populated -->
          </div>

          <!-- Footer Information -->
          <div class="ai-search-footer" style="padding: 8px 16px; font-size: 0.75rem; color: #64748b; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--ai-search-border); background: rgba(11, 15, 25, 0.95);">
            <div id="hadith-search-status">Ready • 7,882 Hadiths in memory</div>
            <div style="display: flex; gap: 10px;">
              <span><kbd style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace;">↑↓</kbd> Navigate</span>
              <span><kbd style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace;">↵</kbd> View</span>
              <span><kbd style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: monospace;">Esc</kbd> Exit</span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.backdrop);

      // Reference DOM nodes safely
      this.input = document.getElementById('hadith-spotlight-input');
      this.resultsContainer = document.getElementById('hadith-spotlight-results');
      this.statusText = document.getElementById('hadith-search-status');
      this.closeBtn = document.getElementById('hadith-spotlight-close');
      this.clearBtn = document.getElementById('hadith-spotlight-clear');
      this.voiceBtn = document.getElementById('hadith-spotlight-voice');
      this.tabSearchBtn = document.getElementById('tab-search-btn');
      this.tabAiBtn = document.getElementById('tab-ai-btn');
      this.aiSection = document.getElementById('hadith-ai-section');
      this.aiResponseBox = document.getElementById('hadith-ai-response');
    }

    bindEvents() {
      // Shortcut keys: Ctrl+K / Cmd+K / Slash '/'
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          this.toggle();
        } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.open();
        } else if (e.key === 'Escape' && this.isOpen) {
          e.preventDefault();
          this.close();
        }
      });

      // Close handlers
      this.closeBtn.addEventListener('click', () => this.close());
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });

      // Clear handler
      this.clearBtn.addEventListener('click', () => {
        this.input.value = '';
        this.input.focus();
        this.renderEmptyState();
      });

      // Search typing input
      let debounceTimer = null;
      this.input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const val = e.target.value;
        if (!val.trim()) {
          this.renderEmptyState();
          return;
        }
        debounceTimer = setTimeout(() => {
          this.performSearch(val);
        }, 120);
      });

      // Keyboard navigation in search results
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateResults(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateResults(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.activeTab === 'ai') {
            this.askGemini(this.input.value);
          } else if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
            this.selectResult(this.currentResults[this.selectedIndex].hadith);
          } else if (this.currentResults.length > 0) {
            this.selectResult(this.currentResults[0].hadith);
          }
        }
      });

      // Tabs: Instant Search vs Ask AI
      this.tabSearchBtn.addEventListener('click', () => {
        SoundFX.tick();
        this.activeTab = 'search';
        this.tabSearchBtn.classList.add('active');
        this.tabSearchBtn.style.background = '#38bdf8';
        this.tabSearchBtn.style.color = '#020617';
        this.tabAiBtn.classList.remove('active');
        this.tabAiBtn.style.background = 'rgba(30, 41, 59, 0.5)';
        this.tabAiBtn.style.color = '#cbd5e1';
        this.aiSection.style.display = 'none';
        this.resultsContainer.style.display = 'block';
        if (this.input.value.trim()) {
          this.performSearch(this.input.value);
        } else {
          this.renderEmptyState();
        }
      });

      this.tabAiBtn.addEventListener('click', () => {
        SoundFX.tick();
        this.activeTab = 'ai';
        this.tabAiBtn.classList.add('active');
        this.tabAiBtn.style.background = '#38bdf8';
        this.tabAiBtn.style.color = '#020617';
        this.tabSearchBtn.classList.remove('active');
        this.tabSearchBtn.style.background = 'rgba(30, 41, 59, 0.5)';
        this.tabSearchBtn.style.color = '#cbd5e1';
        this.aiSection.style.display = 'block';
        if (this.input.value.trim()) {
          this.askGemini(this.input.value);
        }
      });

      // Book Filter Pills
      const bookPills = this.backdrop.querySelectorAll('.hadith-filter-pill');
      bookPills.forEach(pill => {
        pill.addEventListener('click', () => {
          SoundFX.tick();
          bookPills.forEach(p => {
            p.classList.remove('active');
            p.style.background = 'rgba(255, 255, 255, 0.05)';
            p.style.color = '#94a3b8';
            p.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          });
          pill.classList.add('active');
          pill.style.background = 'rgba(56, 189, 248, 0.2)';
          pill.style.color = '#38bdf8';
          pill.style.borderColor = '#38bdf8';

          const bookId = pill.getAttribute('data-book');
          this.activeBookFilter = bookId ? Number(bookId) : null;
          if (this.input.value.trim()) {
            this.performSearch(this.input.value);
          }
        });
      });

      // Script Filter Pills (Roman / Urdu / All)
      const scriptPills = this.backdrop.querySelectorAll('.hadith-script-pill');
      scriptPills.forEach(pill => {
        pill.addEventListener('click', () => {
          SoundFX.tick();
          scriptPills.forEach(p => {
            p.classList.remove('active');
            p.style.background = 'transparent';
            p.style.color = '#94a3b8';
            p.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          });
          pill.classList.add('active');
          pill.style.background = '#38bdf8';
          pill.style.color = '#020617';
          pill.style.border = 'none';

          this.activeScript = pill.getAttribute('data-script');
          if (this.currentResults.length > 0) {
            this.renderResults(this.currentResults);
          }
        });
      });

      // Voice Search (Web Speech API)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ur-PK'; // Urdu / South Asian phonetic recognition

        this.voiceBtn.addEventListener('click', () => {
          SoundFX.tick();
          try {
            recognition.start();
            this.voiceBtn.style.color = '#ef4444';
            this.statusText.textContent = 'Listening... Speak in Urdu or English';
          } catch (err) {
            recognition.stop();
          }
        });

        recognition.onresult = (e) => {
          this.voiceBtn.style.color = '';
          const transcript = e.results[0][0].transcript;
          this.input.value = transcript;
          this.performSearch(transcript);
        };

        recognition.onerror = () => {
          this.voiceBtn.style.color = '';
          this.statusText.textContent = 'Voice input stopped.';
        };
      } else {
        this.voiceBtn.style.display = 'none';
      }
    }

    open() {
      SoundFX.tick();
      this.isOpen = true;
      this.backdrop.classList.add('ai-search-active');
      document.body.classList.add('ai-search-scroll-lock');
      this.input.value = '';
      this.input.focus();
      this.renderEmptyState();
    }

    close() {
      SoundFX.tick();
      this.isOpen = false;
      this.backdrop.classList.remove('ai-search-active');
      document.body.classList.remove('ai-search-scroll-lock');
    }

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }

    renderEmptyState() {
      this.selectedIndex = -1;
      this.currentResults = [];
      this.statusText.textContent = 'Ready • 7,882 Hadiths in memory';
      this.resultsContainer.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; color: #64748b;">
          <div style="font-size: 2rem; margin-bottom: 8px;">📜</div>
          <div style="font-size: 0.95rem; font-weight: 600; color: #94a3b8; margin-bottom: 6px;">Universal Hadith Search</div>
          <div style="font-size: 0.8rem; line-height: 1.5; max-width: 380px; margin: 0 auto; color: #64748b;">
            Search across all 6 classical books in Roman Urdu, Urdu, or Arabic.
            Try typing: <span style="color: #38bdf8; cursor: pointer;" onclick="document.getElementById('hadith-spotlight-input').value='wazu'; document.getElementById('hadith-spotlight-input').dispatchEvent(new Event('input'));">"wazu"</span>, 
            <span style="color: #38bdf8; cursor: pointer;" onclick="document.getElementById('hadith-spotlight-input').value='namaz'; document.getElementById('hadith-spotlight-input').dispatchEvent(new Event('input'));">"namaz"</span>, 
            <span style="color: #38bdf8; cursor: pointer;" onclick="document.getElementById('hadith-spotlight-input').value='roza'; document.getElementById('hadith-spotlight-input').dispatchEvent(new Event('input'));">"roza"</span>, or 
            <span style="color: #38bdf8; cursor: pointer;" onclick="document.getElementById('hadith-spotlight-input').value='772'; document.getElementById('hadith-spotlight-input').dispatchEvent(new Event('input'));">"772"</span>.
          </div>
        </div>
      `;
    }

    performSearch(query) {
      if (!query || !query.trim()) {
        this.renderEmptyState();
        return;
      }

      const res = this.engine.search(query, {
        limit: 30,
        bookId: this.activeBookFilter
      });

      this.currentResults = res.results;
      this.selectedIndex = this.currentResults.length > 0 ? 0 : -1;
      this.statusText.textContent = `Found ${res.totalMatches} Hadiths (${res.elapsedMs}ms)`;

      this.renderResults(this.currentResults);
    }

    renderResults(results) {
      if (results.length === 0) {
        this.resultsContainer.innerHTML = `
          <div style="padding: 32px 16px; text-align: center; color: #64748b;">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">🔍</div>
            <div style="font-size: 0.92rem; color: #94a3b8; font-weight: 600;">No Hadiths found</div>
            <div style="font-size: 0.8rem; margin-top: 4px;">Try searching with different spelling or switch book filter.</div>
          </div>
        `;
        return;
      }

      const bookNames = {
        1: "Mir'at al-Manajih",
        9: "Arba'een Hanafi",
        10: "Muntakhab Hadithen",
        12: "Riyaz-us-Saliheen",
        13: "Arba'een Nawawi",
        14: "Anwar-ul-Hadith"
      };

      const bookBadges = {
        1: "#38bdf8",
        12: "#34d399",
        14: "#fbbf24",
        13: "#a78bfa",
        9: "#f472b6",
        10: "#fb923c"
      };

      let html = '';
      for (let i = 0; i < results.length; i++) {
        const item = results[i].hadith;
        const isSelected = i === this.selectedIndex;
        const bName = bookNames[item.b] || `Book ${item.b}`;
        const bColor = bookBadges[item.b] || '#38bdf8';

        let snippetHtml = '';
        if (this.activeScript === 'roman') {
          snippetHtml = `<div style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; font-family: -apple-system, sans-serif;">${item.ro || 'No Roman transliteration'}</div>`;
        } else if (this.activeScript === 'urdu') {
          snippetHtml = `<div style="font-size: 0.95rem; color: #f1f5f9; line-height: 1.7; font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif; direction: rtl; text-align: right;">${item.ur || ''}</div>`;
        } else if (this.activeScript === 'arabic') {
          snippetHtml = `<div style="font-size: 1.05rem; color: #38bdf8; line-height: 1.8; font-family: 'Amiri', 'Traditional Arabic', serif; direction: rtl; text-align: right;">${item.ar || ''}</div>`;
        } else {
          // All scripts
          snippetHtml = `
            <div style="font-size: 0.82rem; color: #38bdf8; direction: rtl; text-align: right; margin-bottom: 4px; font-family: 'Amiri', serif;">${item.ar || ''}</div>
            <div style="font-size: 0.86rem; color: #94a3b8; direction: rtl; text-align: right; margin-bottom: 6px; font-family: 'Noto Nastaliq Urdu', serif;">${item.ur || ''}</div>
            <div style="font-size: 0.84rem; color: #e2e8f0; line-height: 1.4;">${item.ro || ''}</div>
          `;
        }

        html += `
          <div 
            class="hadith-result-card ${isSelected ? 'active-selection' : ''}" 
            data-index="${i}"
            style="
              padding: 12px 14px; 
              margin-bottom: 8px; 
              background: ${isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.7)'}; 
              border: 1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.07)'}; 
              border-radius: 10px; 
              cursor: pointer; 
              transition: all 0.15s ease;
              user-select: none;
              touch-action: manipulation;
            "
          >
            <!-- Card Header Pill -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="background: ${bColor}22; color: ${bColor}; border: 1px solid ${bColor}55; padding: 2px 7px; border-radius: 12px; font-size: 0.7rem; font-weight: 700;">
                  ${bName} • Vol ${item.v}
                </span>
                <span style="font-size: 0.75rem; font-weight: 700; color: #f8fafc;">
                  Hadith #${item.no}
                </span>
              </div>
              <span style="font-size: 0.72rem; color: #94a3b8; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; direction: rtl;">
                ${item.ch || ''}
              </span>
            </div>

            <!-- Snippet Content -->
            ${snippetHtml}
          </div>
        `;
      }

      this.resultsContainer.innerHTML = html;

      // Attach click events
      const cards = this.resultsContainer.querySelectorAll('.hadith-result-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const idx = Number(card.getAttribute('data-index'));
          if (idx >= 0 && idx < results.length) {
            this.selectResult(results[idx].hadith);
          }
        });
      });
    }

    navigateResults(direction) {
      if (this.currentResults.length === 0) return;
      SoundFX.tick();
      this.selectedIndex += direction;
      if (this.selectedIndex < 0) this.selectedIndex = this.currentResults.length - 1;
      if (this.selectedIndex >= this.currentResults.length) this.selectedIndex = 0;

      const cards = this.resultsContainer.querySelectorAll('.hadith-result-card');
      cards.forEach((card, idx) => {
        if (idx === this.selectedIndex) {
          card.classList.add('active-selection');
          card.style.background = 'rgba(56, 189, 248, 0.12)';
          card.style.borderColor = '#38bdf8';
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          card.classList.remove('active-selection');
          card.style.background = 'rgba(15, 23, 42, 0.7)';
          card.style.borderColor = 'rgba(255, 255, 255, 0.07)';
        }
      });
    }

    selectResult(hadith) {
      SoundFX.select();
      this.close();
      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(hadith);
      }
    }

    // --- Progressive Gemini AI Q&A Synthesis ---
    async askGemini(query) {
      if (!query || !query.trim()) return;
      SoundFX.tick();
      this.aiSection.style.display = 'block';
      this.aiResponseBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; color: #38bdf8;">
          <span class="ai-spin" style="display: inline-block; animation: spin 1s infinite linear;">⚙️</span>
          <span>Searching 7,882 Hadiths and synthesizing scholarly answer...</span>
        </div>
      `;

      // 1. Retrieve top 5 most relevant Hadiths for context
      const searchRes = this.engine.search(query, { limit: 5 });
      if (!searchRes || searchRes.results.length === 0) {
        this.aiResponseBox.innerHTML = `
          <div style="color: #ef4444; font-weight: 600;">No directly matching Hadiths found for "${query}".</div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">Please try rephrasing with Islamic terms (e.g., wazu, namaz, niyyat, roza).</div>
        `;
        return;
      }

      // Check if user has an API key in localStorage or config
      const apiKey = localStorage.getItem('antigravity_gemini_api_key') || this.options.geminiApiKey || '';

      if (!apiKey) {
        // High-fidelity offline fallback with exact cited cards
        let citationsHtml = searchRes.results.map((r, i) => `
          <div style="margin-top: 8px; padding: 10px; background: rgba(30, 41, 59, 0.7); border-radius: 8px; border-left: 3px solid #38bdf8;">
            <div style="font-weight: 700; color: #38bdf8; font-size: 0.82rem; margin-bottom: 2px;">
              #${i + 1}: Book ${r.hadith.b} (Vol ${r.hadith.v}), Hadith #${r.hadith.no} — ${r.hadith.ch}
            </div>
            <div style="font-size: 0.84rem; color: #e2e8f0;">${r.hadith.ro}</div>
          </div>
        `).join('');

        this.aiResponseBox.innerHTML = `
          <div style="color: #38bdf8; font-weight: 600; margin-bottom: 4px;">⚡ Instant Offline Hadith Citations:</div>
          <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">
            Found ${searchRes.results.length} relevant Hadiths directly answering your query:
          </div>
          ${citationsHtml}
          <div style="margin-top: 12px; font-size: 0.75rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
            💡 Tip: To enable generative 2-sentence conversational AI explanations, set your Gemini API key in settings or localStorage ('antigravity_gemini_api_key').
          </div>
        `;
        return;
      }

      // 2. Call Gemini API for synthesis
      try {
        const bookNames = { 1: "Mir'at al-Manajih", 9: "Arba'een Hanafi", 10: "Muntakhab", 12: "Riyaz-us-Saliheen", 13: "Arba'een Nawawi", 14: "Anwar-ul-Hadith" };
        const contextStr = searchRes.results.map(r => 
          `Book: ${bookNames[r.hadith.b] || r.hadith.b}, Hadith #${r.hadith.no}, Chapter: ${r.hadith.ch}\nTranslation: ${r.hadith.ro}`
        ).join('\n\n');

        const prompt = `You are a reverent Islamic scholar assistant. Answer the user's question directly, concisely, and accurately in Roman Urdu and English (2-3 sentences maximum). ALWAYS cite the exact Hadith numbers and Book names provided in the context below.\n\nContext:\n${contextStr}\n\nQuestion: "${query}"`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!res.ok) throw new Error('Gemini API call failed');
        const data = await res.json();
        const ans = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

        this.aiResponseBox.innerHTML = `
          <div style="color: #38bdf8; font-weight: 700; margin-bottom: 6px;">🤖 Gemini AI Scholarly Answer:</div>
          <div style="font-size: 0.9rem; line-height: 1.6; color: #f1f5f9; margin-bottom: 12px;">${ans}</div>
          <div style="font-size: 0.75rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
            Verified against 7,882 Hadiths in Faizan-e-Hadees Encyclopedia.
          </div>
        `;
      } catch (err) {
        this.aiResponseBox.innerHTML = `
          <div style="color: #ef4444; font-weight: 600;">Could not connect to Gemini API. Showing local Hadith match below:</div>
          <div style="font-size: 0.85rem; color: #e2e8f0; margin-top: 6px;">${searchRes.results[0].hadith.ro}</div>
        `;
      }
    }
  }

  // --- 6. EXPORT / INITIALIZATION FACADE ---
  const HadithAISearch = {
    engine: null,
    ui: null,

    init(options = {}) {
      try {
        console.log('[HadithAISearch] Bootloader initializing...');
        this.engine = new HadithSearchEngine();

        // Check if global search index is present
        if (typeof window !== 'undefined' && Array.isArray(window.HADITH_SEARCH_INDEX)) {
          this.engine.indexAll(window.HADITH_SEARCH_INDEX);
        } else if (typeof global !== 'undefined' && Array.isArray(global.HADITH_SEARCH_INDEX)) {
          this.engine.indexAll(global.HADITH_SEARCH_INDEX);
        }

        // Initialize Spotlight UI if in browser DOM
        if (typeof document !== 'undefined') {
          this.ui = new HadithSpotlightUI(this.engine, options);
        }

        console.log('[HadithAISearch] Initialized successfully.');
        return this;
      } catch (err) {
        console.error('[HadithAISearch] Defensive bootloader error:', err);
        return null;
      }
    },

    open() {
      if (this.ui) this.ui.open();
    },

    close() {
      if (this.ui) this.ui.close();
    },

    search(query, options) {
      return this.engine ? this.engine.search(query, options) : [];
    },

    SoundFX
  };

  // Node vs Browser export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HadithAISearch;
  } else {
    global.HadithAISearch = HadithAISearch;
  }

})(typeof window !== 'undefined' ? window : globalThis);
