/**
 * ============================================================================
 * Quran Deep Analyzer - Native Full-Page Live Search Studio
 * (js/search-studio.js)
 * ============================================================================
 * High-performance, client-side first Live Search Studio engineered under
 * Antigravity Workspace Directives.
 *
 * Architectural Features:
 *  1. Native Full-Page Studio Canvas (#tab-search) — Zero cramped modal popups.
 *  2. Real-time debounced (<10ms) live search across all 6,236 canonical Ayat.
 *  3. Full-width luxury scripture cards with Grand Arabic Calligraphy (>=2.25rem),
 *     highlighted English translations (<mark class="search-highlight">), and
 *     Urdu Kanzul Iman in Nastaliq.
 *  4. Inline 1-Tap Expandable Exegesis (Sirat-ul-Jinan Tafsir Drawer) preserving
 *     search context without navigating away.
 *  5. Dual multi-filter toolbars: Corpus Categories & Revelation (Makki/Madani).
 *  6. Celebrated default state with quick-access thematic discovery pills.
 *  7. Directive 5 & 7 Compliant (Defensive isolation, Web Audio procedural SFX).
 * ============================================================================
 */

(function (global) {
  'use strict';

  if (typeof window === 'undefined') {
    global.window = global;
  }

  // --- 1. PROCEDURAL ACOUSTIC FEEDBACK (Directive 7 Compliant) ---
  const StudioSound = {
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
    playTab() {
      if (window.AudioSFX && typeof window.AudioSFX.playTab === 'function') {
        window.AudioSFX.playTab();
        return;
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    }
  };

  // --- 2. CELEBRATED DISCOVERY TOPICS & AYAT ---
  const CELEBRATED_TOPICS = [
    { title: "Patience & Perseverance", ar: "الصبر", query: "patient" },
    { title: "Parents & Filial Piety", ar: "الوالدين", query: "parents" },
    { title: "Gratitude & Thankfulness", ar: "الشكر", query: "gratitude" },
    { title: "Forgiveness & Mercy", ar: "المغفرة", query: "forgiveness" },
    { title: "The Straight Path", ar: "الصراط المستقيم", query: "straight path" },
    { title: "Charity & Spending", ar: "الإنفاق", query: "charity" },
    { title: "Paradise & Gardens", ar: "الجنة", query: "paradise" },
    { title: "Day of Judgment", ar: "يوم القيامة", query: "day of judgment" }
  ];

  const CELEBRATED_VERSES = [
    {
      surahId: 1,
      ayahNum: 1,
      surahRoman: "Al-Fatihah",
      surahAr: "الفاتحة",
      rev: "makki",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      urdu: "اللہ کے نام سے شروع جو نہایت مہربان رحمت والا۔"
    },
    {
      surahId: 1,
      ayahNum: 6,
      surahRoman: "Al-Fatihah",
      surahAr: "الفاتحة",
      rev: "makki",
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      english: "Guide us on the Straight Path.",
      urdu: "ہم کو سیدھا راستہ چلا۔"
    },
    {
      surahId: 2,
      ayahNum: 255,
      surahRoman: "Al-Baqarah",
      surahAr: "البقرة",
      rev: "madani",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
      english: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
      urdu: "اللہ ہے جس کے سوا کسی کی بندگی نہیں وہ آپ زندہ اوروں کا قائم رکھنے والا اسے نہ اونگھ آئے نہ نیند اسی کا ہے جو کچھ آسمانوں میں ہے اور جو کچھ زمین میں۔"
    },
    {
      surahId: 2,
      ayahNum: 285,
      surahRoman: "Al-Baqarah",
      surahAr: "البقرة",
      rev: "madani",
      arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
      english: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers.",
      urdu: "رسول ایمان لایا اس پر جو اس کے رب کے پاس سے اس پر اترا اور مسلمان سب نے مانا اللہ اور اس کے فرشتوں اور اس کی کتابوں اور اس کے رسولوں کو۔"
    },
    {
      surahId: 24,
      ayahNum: 35,
      surahRoman: "An-Nur",
      surahAr: "النور",
      rev: "madani",
      arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ",
      english: "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly white star.",
      urdu: "اللہ نور ہے آسمانوں اور زمین کا اس کے نور کی مثال ایسی جیسے ایک طاق کہ اس میں چراغ ہے وہ چراغ ایک فانوس میں ہے فانوس گویا ایک موتی کا سا چمکتا ستارہ۔"
    },
    {
      surahId: 52,
      ayahNum: 16,
      surahRoman: "At-Tur",
      surahAr: "الطور",
      rev: "makki",
      arabic: "اصْلَوْهَا فَاصْبِرُوا أَوْ لَا تَصْبِرُوا سَوَاءٌ عَلَيْكُمْ ۖ إِنَّمَا تُجْزَوْنَ مَا كُنْتُمْ تَعْمَلُونَ",
      english: "[Enter to] burn therein; then be patient or impatient - it is all the same for you. You are only being recompensed for what you used to do.",
      urdu: "اس میں جاؤ اب چاہے صبر کرو یا نہ کرو سب تم پر ایک سا ہے تمہیں اسی کا بدلہ ملے گا جو تم کرتے تھے۔"
    }
  ];

  // --- 3. MASTER SEARCH STUDIO ENGINE ---
  const SearchStudioEngine = {
    isInitialized: false,
    isDenseMode: true,
    activeCategory: 'all',
    activeRevelation: 'all',
    debounceTimer: null,
    lastQuery: '',
    tafsirCache: new Map(),

    init() {
      if (this.isInitialized) return;
      try {
        const input = document.getElementById('search-studio-input');
        const clearBtn = document.getElementById('search-studio-clear');
        const askAiBtn = document.getElementById('search-studio-ask-ai-btn');
        const settingsBtn = document.getElementById('search-studio-settings-btn');

        if (!input) return;

        // Debounced Live Search (15ms for near-instant offline typing response)
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (clearBtn) {
            clearBtn.style.display = val.trim() ? 'flex' : 'none';
          }
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.executeSearch(val);
          }, 15);
        });

        // Keyboard Shortcuts on Input
        input.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.triggerAISynthesis();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            this.clearSearch();
          }
        });

        // Clear Button
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            StudioSound.playClick();
            this.clearSearch();
          });
        }

        // Ask AI Button
        if (askAiBtn) {
          askAiBtn.addEventListener('click', () => {
            this.triggerAISynthesis();
          });
        }

        // Density Switcher Setup
        const densityBtn = document.getElementById('search-density-toggle');
        const resultsEl = document.getElementById('search-studio-results');
        try {
          const savedDensity = localStorage.getItem('quran_search_density');
          if (savedDensity === 'relaxed') {
            this.isDenseMode = false;
            if (resultsEl) resultsEl.classList.remove('search-dense-mode');
            if (densityBtn) {
              densityBtn.classList.remove('active');
              const icon = document.getElementById('density-icon');
              const text = document.getElementById('density-text');
              if (icon) icon.textContent = '📖';
              if (text) text.textContent = 'Relaxed';
            }
          } else {
            this.isDenseMode = true;
            if (resultsEl) resultsEl.classList.add('search-dense-mode');
            if (densityBtn) {
              densityBtn.classList.add('active');
              const icon = document.getElementById('density-icon');
              const text = document.getElementById('density-text');
              if (icon) icon.textContent = '🗜️';
              if (text) text.textContent = 'Dense';
            }
          }
        } catch (e) {}

        if (densityBtn) {
          densityBtn.addEventListener('click', () => {
            this.toggleDensity();
          });
        }

        // Keyboard Shortcut 'D' for Density Toggle
        document.addEventListener('keydown', (e) => {
          if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
              e.preventDefault();
              this.toggleDensity();
            }
          }
        });

        // Category Filter Chips
        const catChips = document.querySelectorAll('#search-category-filters button');
        catChips.forEach((chip) => {
          chip.addEventListener('click', () => {
            StudioSound.playClick();
            catChips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            this.activeCategory = chip.dataset.cat || 'all';
            const curVal = input.value;
            this.executeSearch(curVal);
          });
        });

        // Revelation Filter Chips (All, Makki, Madani)
        const revChips = document.querySelectorAll('#search-revelation-filters button');
        revChips.forEach((chip) => {
          chip.addEventListener('click', () => {
            StudioSound.playClick();
            revChips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            this.activeRevelation = chip.dataset.rev || 'all';
            const curVal = input.value;
            this.executeSearch(curVal);
          });
        });

        // Initial landing display: Celebrated Ayat & Thematic Topics
        this.renderCelebratedLanding();
        this.isInitialized = true;
      } catch (err) {
        console.error('[SearchStudioEngine] Init error:', err);
      }
    },

    onActivated() {
      const input = document.getElementById('search-studio-input');
      if (input) {
        setTimeout(() => {
          input.focus();
          input.select();
        }, 60);
      }
      if (!this.lastQuery) {
        this.renderCelebratedLanding();
      }
    },

    toggleDensity() {
      this.isDenseMode = !this.isDenseMode;
      const resultsEl = document.getElementById('search-studio-results');
      const densityBtn = document.getElementById('search-density-toggle');
      const icon = document.getElementById('density-icon');
      const text = document.getElementById('density-text');

      if (this.isDenseMode) {
        if (resultsEl) resultsEl.classList.add('search-dense-mode');
        if (densityBtn) densityBtn.classList.add('active');
        if (icon) icon.textContent = '🗜️';
        if (text) text.textContent = 'Dense';
        try { localStorage.setItem('quran_search_density', 'dense'); } catch(e) {}
      } else {
        if (resultsEl) resultsEl.classList.remove('search-dense-mode');
        if (densityBtn) densityBtn.classList.remove('active');
        if (icon) icon.textContent = '📖';
        if (text) text.textContent = 'Relaxed';
        try { localStorage.setItem('quran_search_density', 'relaxed'); } catch(e) {}
      }
      StudioSound.playClick();
    },

    clearSearch() {
      const input = document.getElementById('search-studio-input');
      const clearBtn = document.getElementById('search-studio-clear');
      if (input) {
        input.value = '';
        input.focus();
      }
      if (clearBtn) {
        clearBtn.style.display = 'none';
      }
      this.lastQuery = '';
      this.renderCelebratedLanding();
    },

    getSurahMeta(surahId) {
      if (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) {
        const s = window.CorpusEngine.surahsTelemetry.find((x) => x.id === surahId);
        if (s) return s;
      }
      if (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.surahsTelemetry) {
        const s = window.QURAN_CORE_DATA.surahsTelemetry.find((x) => x.id === surahId);
        if (s) return s;
      }
      return { id: surahId, name_roman: `Surah ${surahId}`, name_ar: '', type: 'makki' };
    },

    executeSearch(rawQuery) {
      const resultsContainer = document.getElementById('search-studio-results');
      const counterBadge = document.getElementById('search-studio-counter');
      const aiContainer = document.getElementById('search-studio-ai-container');
      if (!resultsContainer) return;

      const q = (rawQuery || '').trim();
      this.lastQuery = q;

      // When query is empty, restore celebrated welcome view
      if (!q) {
        if (aiContainer) aiContainer.style.display = 'none';
        this.renderCelebratedLanding();
        return;
      }

      const t0 = performance.now();

      // Retrieve matches from AI Search Engine
      let matches = [];
      if (window.QuranAISearchEngine && typeof window.QuranAISearchEngine.search === 'function') {
        matches = window.QuranAISearchEngine.search(q, this.activeCategory, 80);
      } else if (window.QURAN_AYAT_SEARCH_BUNDLE && Array.isArray(window.QURAN_AYAT_SEARCH_BUNDLE)) {
        // Fallback search directly over the 6,236 Ayat bundle
        const qLower = q.toLowerCase();
        for (const v of window.QURAN_AYAT_SEARCH_BUNDLE) {
          const [sId, aNum, sNameRoman, sNameAr, arClean, enTrans, urTrans] = v;
          if (
            (enTrans && enTrans.toLowerCase().includes(qLower)) ||
            (urTrans && urTrans.includes(q)) ||
            (arClean && arClean.includes(q))
          ) {
            matches.push({
              category: 'verse',
              surahId: sId,
              ayahNum: aNum,
              title: `${sNameRoman} ${sId}:${aNum}`,
              subtitle: enTrans,
              arabic: arClean,
              urdu: urTrans,
              action: () => {
                if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(sId, aNum);
              }
            });
            if (matches.length >= 80) break;
          }
        }
      }

      // Filter by Revelation Type (Makki / Madani)
      if (this.activeRevelation !== 'all') {
        matches = matches.filter((m) => {
          if (!m.surahId) return true;
          const meta = this.getSurahMeta(m.surahId);
          return meta.type && meta.type.toLowerCase() === this.activeRevelation.toLowerCase();
        });
      }

      const elapsed = Math.round(performance.now() - t0);

      // Update metrics badge
      if (counterBadge) {
        const countStr = matches.length.toLocaleString();
        counterBadge.innerHTML = `Found <strong>${countStr}</strong> matching ${
          matches.length === 1 ? 'record' : 'records'
        } for "<strong>${this.escapeHtml(q)}</strong>" in <strong>${elapsed}ms</strong>`;
      }

      // Render Results
      this.renderResults(matches, q);
    },

    renderCelebratedLanding() {
      const resultsContainer = document.getElementById('search-studio-results');
      const counterBadge = document.getElementById('search-studio-counter');
      if (!resultsContainer) return;

      if (counterBadge) {
        counterBadge.innerHTML = `Ready • <strong>6,236</strong> Canonical Ayat & <strong>114</strong> Surahs Indexed`;
      }

      let html = `
        <div class="search-studio-welcome">
          <div class="search-welcome-title">🌟 Quran Deep Live Search Studio</div>
          <div class="search-welcome-subtitle">
            Instant full-corpus search across all 6,236 Ayat, English translations, authentic Urdu Kanzul Iman,
            thematic concepts, and classical exegesis. Type any word, translation phrase, or topic above.
          </div>

          <div style="font-size: 0.88rem; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
            ⚡ Quick Topic Explorations:
          </div>
          <div class="search-quick-topics-grid">
            ${CELEBRATED_TOPICS.map(
              (top) => `
              <button class="search-topic-chip" onclick="window.SearchStudioEngine.applyTopicQuery('${top.query}')">
                <span>${top.title}</span>
                <span class="search-topic-ar">${top.ar}</span>
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div style="font-size: 1.15rem; font-weight: 700; color: #f8fafc; margin: 12px 0 16px 4px; display: flex; align-items: center; gap: 8px;">
          <span>📖 Celebrated Scriptural Verses:</span>
        </div>
      `;

      html += CELEBRATED_VERSES.map((v) => this.buildAyahCardHtml(v, '')).join('');
      resultsContainer.innerHTML = html;
      this.bindCardActions(resultsContainer);
    },

    applyTopicQuery(query) {
      StudioSound.playClick();
      const input = document.getElementById('search-studio-input');
      const clearBtn = document.getElementById('search-studio-clear');
      if (input) {
        input.value = query;
        if (clearBtn) clearBtn.style.display = 'flex';
        input.focus();
      }
      this.executeSearch(query);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    },

    renderResults(matches, query) {
      const container = document.getElementById('search-studio-results');
      if (!container) return;

      if (matches.length === 0) {
        container.innerHTML = `
          <div class="search-studio-welcome" style="text-align: center; padding: 48px 24px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">No Direct Matches Found</div>
            <div style="color: #94a3b8; max-width: 540px; margin: 0 auto 20px auto; line-height: 1.6;">
              We couldn't find matches for "<strong>${this.escapeHtml(query)}</strong>" in the selected category.
              Try adjusting your search terms, checking English/Urdu spelling, or asking our AI Scholar.
            </div>
            <button class="search-studio-ask-btn" style="margin: 0 auto;" onclick="window.SearchStudioEngine.triggerAISynthesis()">
              <span class="ai-sparkle">✨</span> Synthesize Answer with Gemini AI
            </button>
          </div>
        `;
        return;
      }

      let html = '';
      matches.forEach((m, idx) => {
        if (m.surahId && m.ayahNum) {
          const meta = this.getSurahMeta(m.surahId);
          const verseObj = {
            surahId: m.surahId,
            ayahNum: m.ayahNum,
            surahRoman: meta.name_roman || `Surah ${m.surahId}`,
            surahAr: meta.name_ar || '',
            rev: meta.type || 'makki',
            arabic: m.arabic || '',
            english: m.subtitle || m.english || '',
            urdu: m.urdu || ''
          };
          html += this.buildAyahCardHtml(verseObj, query, idx + 1);
        } else {
          html += this.buildGenericCardHtml(m, query, idx + 1);
        }
      });

      container.innerHTML = html;
      this.bindCardActions(container);
    },

    buildAyahCardHtml(v, query, rankNum) {
      const highlightedEn = this.highlightText(v.english, query);
      const highlightedUr = this.highlightText(v.urdu, query);
      const revBadge =
        v.rev.toLowerCase() === 'madani'
          ? `<span class="search-rev-badge madani">Madani 🕌</span>`
          : `<span class="search-rev-badge makki">Makki 🕋</span>`;

      return `
        <article class="search-ayah-card" id="search-card-${v.surahId}-${v.ayahNum}">
          <div class="search-ayah-card-header">
            <div class="search-ayah-meta-left">
              <span class="search-ayah-coord-badge">[Surah ${v.surahId}:${v.ayahNum}]</span>
              <span class="search-surah-title-badge">${v.surahRoman} (${v.surahAr})</span>
              ${revBadge}
              ${rankNum ? `<span class="search-ayah-rank-badge">#${rankNum}</span>` : ''}
            </div>

            <!-- Header-Integrated Micro-Actions (Eliminating separate bottom toolbar) -->
            <div class="search-ayah-meta-right">
              <button class="search-micro-action tafsir-btn" data-surah="${v.surahId}" data-ayah="${v.ayahNum}" title="Read Tafsir Sirat-ul-Jinan">
                <span>📖 Tafsir</span>
              </button>
              <button class="search-micro-action analyzer-btn" data-surah="${v.surahId}" data-ayah="${v.ayahNum}" title="Open in Deep Ayah Analyzer">
                <span>🔍 Analyzer ↗</span>
              </button>
              <button class="search-micro-action copy-btn" data-surah="${v.surahId}" data-ayah="${v.ayahNum}" data-arabic="${this.escapeAttr(v.arabic)}" data-english="${this.escapeAttr(v.english)}" data-urdu="${this.escapeAttr(v.urdu)}" title="Copy Verse">
                <span>📋 Copy</span>
              </button>
            </div>
          </div>

          <div class="search-ayah-arabic">${v.arabic}</div>
          <div class="search-ayah-english">${highlightedEn}</div>
          <div class="search-ayah-urdu">${highlightedUr}</div>

          <div class="search-tafsir-drawer" id="search-tafsir-${v.surahId}-${v.ayahNum}" style="display: none;">
            <div class="search-tafsir-header">
              <div class="search-tafsir-title">
                <span>📚 Tafsir Sirat-ul-Jinan</span>
                <span style="font-weight: 400; color: #94a3b8; font-size: 0.85rem;">• Surah ${v.surahRoman} [${v.surahId}:${v.ayahNum}]</span>
              </div>
              <span class="search-tafsir-author">Mufti Muhammad Qasim Qadri</span>
            </div>
            <div class="search-tafsir-body" id="search-tafsir-body-${v.surahId}-${v.ayahNum}">
              <div style="color: #94a3b8; font-style: italic;">Loading scholarly exegesis...</div>
            </div>
          </div>
        </article>
      `;
    },

    buildGenericCardHtml(m, query, rankNum) {
      const highlightedTitle = this.highlightText(m.title, query);
      const highlightedSub = this.highlightText(m.subtitle, query);

      return `
        <article class="search-ayah-card">
          <div class="search-ayah-card-header">
            <div class="search-ayah-meta-left">
              <span class="search-ayah-coord-badge" style="background: rgba(168, 85, 247, 0.2); border-color: rgba(168, 85, 247, 0.4); color: #e9d5ff;">
                ${this.escapeHtml(m.category || 'General')}
              </span>
              <span class="search-surah-title-badge">${highlightedTitle}</span>
              ${rankNum ? `<span class="search-ayah-rank-badge">#${rankNum}</span>` : ''}
            </div>
            <div class="search-ayah-meta-right">
              <button class="search-micro-action analyzer-btn" onclick="(${m.action.toString()})()">
                <span>Explore ↗</span>
              </button>
            </div>
          </div>

          <div class="search-ayah-english" style="font-size: 0.94rem; margin-top: 6px;">
            ${highlightedSub}
          </div>
        </article>
      `;
    },

    bindCardActions(container) {
      // 1. Tafsir Buttons
      container.querySelectorAll('.tafsir-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          StudioSound.playClick();
          const sId = parseInt(btn.dataset.surah, 10);
          const aNum = parseInt(btn.dataset.ayah, 10);
          this.toggleTafsir(sId, aNum, btn);
        });
      });

      // 2. Open in Analyzer Buttons
      container.querySelectorAll('.analyzer-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          StudioSound.playTab();
          const sId = parseInt(btn.dataset.surah, 10);
          const aNum = parseInt(btn.dataset.ayah, 10);
          this.jumpToAnalyzer(sId, aNum);
        });
      });

      // 3. Copy Verse Buttons
      container.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          StudioSound.playClick();
          const sId = btn.dataset.surah;
          const aNum = btn.dataset.ayah;
          const ar = btn.dataset.arabic || '';
          const en = btn.dataset.english || '';
          const ur = btn.dataset.urdu || '';
          const copyText = `Surah ${sId}:${aNum}\n\n${ar}\n\nEnglish: ${en}\n\nUrdu (Kanzul Iman): ${ur}\n\n(Quran Deep Analyzer)`;
          navigator.clipboard.writeText(copyText).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => {
              btn.innerHTML = originalText;
            }, 2000);
          });
        });
      });
    },

    async toggleTafsir(surahId, ayahNum, btn) {
      const drawer = document.getElementById(`search-tafsir-${surahId}-${ayahNum}`);
      const body = document.getElementById(`search-tafsir-body-${surahId}-${ayahNum}`);
      if (!drawer || !body) return;

      const isVisible = drawer.style.display !== 'none';
      if (isVisible) {
        drawer.style.display = 'none';
        btn.classList.remove('active');
        btn.innerHTML = '<span>📖 Tafsir</span>';
        return;
      }

      drawer.style.display = 'block';
      btn.classList.add('active');
      btn.innerHTML = '<span>▲ Close</span>';

      const cacheKey = `${surahId}:${ayahNum}`;
      if (this.tafsirCache.has(cacheKey)) {
        body.innerHTML = this.tafsirCache.get(cacheKey);
        return;
      }

      body.innerHTML = `<div style="color: #94a3b8; font-style: italic;">Fetching Sirat-ul-Jinan commentary...</div>`;

      try {
        const tafsirText = await this.fetchAyahTafsir(surahId, ayahNum);
        const cleaned = this.cleanTafsirHtml(tafsirText);
        this.tafsirCache.set(cacheKey, cleaned);
        body.innerHTML = cleaned;
      } catch (err) {
        body.innerHTML = `<div style="color: #fca5a5;">Unable to load commentary for this verse: ${this.escapeHtml(
          err.message || String(err)
        )}</div>`;
      }
    },

    async fetchAyahTafsir(surahId, ayahNum) {
      // 1. Check if already loaded in memory
      if (window.QURAN_SURAHS && window.QURAN_SURAHS[surahId]) {
        const sData = window.QURAN_SURAHS[surahId];
        const a = sData.ayahs && sData.ayahs.find((x) => x.number === ayahNum);
        if (a && a.tafseer_sirat_ul_jinan) return a.tafseer_sirat_ul_jinan;
      }

      const sPad = String(surahId).padStart(3, '0');

      // 2. HTTP Fetch if online
      if (window.location.protocol.startsWith('http')) {
        try {
          const res = await fetch(`data/surahs/${sPad}.json`);
          if (res.ok) {
            const data = await res.json();
            window.QURAN_SURAHS = window.QURAN_SURAHS || {};
            window.QURAN_SURAHS[surahId] = data;
            const a = data.ayahs && data.ayahs.find((x) => x.number === ayahNum);
            if (a && a.tafseer_sirat_ul_jinan) return a.tafseer_sirat_ul_jinan;
          }
        } catch (e) {}
      }

      // 3. Dynamic Script Loading for Zero-CORS offline file:// support
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `data/surahs_js/${sPad}.js`;
        script.onload = () => {
          const loaded =
            (window.QURAN_SURAHS && window.QURAN_SURAHS[surahId]) ||
            window[`SURAH_${sPad}_DATA`] ||
            window[`SURAH_${surahId}_DATA`];
          if (loaded) {
            window.QURAN_SURAHS = window.QURAN_SURAHS || {};
            window.QURAN_SURAHS[surahId] = loaded;
            const a = loaded.ayahs && loaded.ayahs.find((x) => x.number === ayahNum);
            if (a && a.tafseer_sirat_ul_jinan) {
              resolve(a.tafseer_sirat_ul_jinan);
            } else {
              resolve('No specific exegesis entry recorded for this Ayah in Sirat-ul-Jinan.');
            }
          } else {
            reject(new Error(`Failed to load Surah ${surahId} dataset.`));
          }
        };
        script.onerror = () => reject(new Error(`Could not load dataset script for Surah ${surahId}`));
        document.head.appendChild(script);
      });
    },

    cleanTafsirHtml(text) {
      if (!text || typeof text !== 'string') {
        return '<p style="color: #94a3b8; font-style: italic;">No detailed Tafsir commentary available for this verse.</p>';
      }
      return text
        .replace(/\/\*\s*Style Definitions\s*\*\/[\s\S]*?\{[\s\S]*?\}/g, '')
        .replace(/(?:table|p|span|div|a|li)\.Mso\w*\s*\{[^}]*\}/g, '')
        .replace(/@page\s*\{[^}]*\}/g, '')
        .replace(/style="[^"]*"/gi, '')
        .replace(/class="[^"]*"/gi, '')
        .replace(/<span\s*>\s*<\/span>/gi, '')
        .replace(/<p\s*>\s*(&nbsp;|\s)*<\/p>/gi, '')
        .trim();
    },

    jumpToAnalyzer(surahId, ayahNum) {
      if (window.CorpusEngine && typeof window.CorpusEngine.jumpToAyah === 'function') {
        window.CorpusEngine.jumpToAyah(surahId, ayahNum);
      } else if (window.switchAppTab) {
        window.switchAppTab('ayahs');
      }
    },

    triggerAISynthesis() {
      const input = document.getElementById('search-studio-input');
      const container = document.getElementById('search-studio-ai-container');
      if (!input || !container) return;

      const q = input.value.trim();
      if (!q) {
        input.focus();
        return;
      }

      container.style.display = 'block';
      if (window.QuranAISearchEngine && typeof window.QuranAISearchEngine.synthesizeGeminiAnswer === 'function') {
        window.QuranAISearchEngine.synthesizeGeminiAnswer(q, container);
      } else {
        container.innerHTML = `
          <div class="search-studio-welcome" style="border-color: rgba(245, 158, 11, 0.4);">
            <div style="font-weight: 700; color: #fbbf24; margin-bottom: 6px;">✨ AI Scholar Ready</div>
            <div style="color: #e2e8f0; font-size: 0.95rem;">
              Please configure your free Google Gemini API Key in the settings dialog (⚙️) to unlock live AI summaries.
            </div>
          </div>
        `;
      }
    },

    highlightText(text, query) {
      if (!text) return '';
      if (!query || !query.trim()) return text;

      const cleanQ = query.trim();
      // 1. Try full exact phrase first
      const safePhrase = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const phraseRe = new RegExp(`(${safePhrase})`, 'gi');
      if (phraseRe.test(text)) {
        return text.replace(phraseRe, '<mark class="search-highlight">$1</mark>');
      }

      // 2. Individual tokens > 2 characters
      const tokens = cleanQ
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 2);

      if (tokens.length === 0) return text;
      const pattern = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const tokenRe = new RegExp(`(${pattern})`, 'gi');
      return text.replace(tokenRe, '<mark class="search-highlight">$1</mark>');
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    escapeAttr(str) {
      if (!str) return '';
      return String(str)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, ' ');
    }
  };

  // --- 4. EXPORT TO GLOBAL SCOPE & AUTO-BOOTLOADER ---
  global.SearchStudioEngine = SearchStudioEngine;

  function bootStudio() {
    if (typeof document !== 'undefined') {
      SearchStudioEngine.init();
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootStudio);
    } else {
      bootStudio();
    }
  }
})(typeof window !== 'undefined' ? window : this);
