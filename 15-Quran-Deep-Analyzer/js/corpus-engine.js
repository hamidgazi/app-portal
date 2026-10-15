/**
 * Corpus Engine - Surah Navigator, Deep Ayah Analyzer, Thematic Graph & Mutashabihat
 * Client-Side Modular Reader with Zero-CORS Dynamic Script Loading
 */

class CorpusEngine {
  constructor() {
    this.surahsTelemetry = [];
    this.thematicGraph = [];
    this.mutashabihat = [];
    this.waqfRules = [];

    this.activeSurahId = 1;
    this.currentSurahData = null;
    this.surahFilterMode = "all"; // "all" | "makki" | "madani" | "length" | "order"
    this.surahSearchQuery = "";
    this.ayahViewMode = "compact"; // "compact" | "deep"
    this.showEnglish = true;
    this.showKanzulIman = true;
    this.showKanzulIrfan = false;
    this.showWordPills = false;
  }

  async init() {
    try {
      console.log("[CorpusEngine] Initializing corpus engine...");

      if (window.QURAN_CORE_DATA) {
        this.surahsTelemetry = window.QURAN_CORE_DATA.surahsTelemetry || [];
        this.thematicGraph = window.QURAN_CORE_DATA.thematicGraph || [];
        this.mutashabihat = window.QURAN_CORE_DATA.mutashabihat || [];
        this.waqfRules = window.QURAN_CORE_DATA.waqfRules || [];
        console.log("[CorpusEngine] Loaded from window.QURAN_CORE_DATA (Zero-CORS)");
      } else {
        console.log("[CorpusEngine] Fetching metadata via HTTP...");
        const [sRes, tRes, mRes, wRes] = await Promise.all([
          fetch('data/quran_surah_telemetry.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_thematic_graph.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_mutashabihat.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_waqf_rules.json').then(r => r.json()).catch(() => [])
        ]);

        this.surahsTelemetry = sRes;
        this.thematicGraph = tRes;
        this.mutashabihat = mRes;
        this.waqfRules = wRes;
      }

      this.renderSurahNavigator();
      this.populateSurahDropdown();
      this.renderThematicGraph();
      this.renderMutashabihat();
      this.renderWaqfRules();
      this.setupSurahControls();

      // Load initial Surah (Al-Fatihah)
      await this.loadSurah(1);

      console.log(`[CorpusEngine] Initialized with ${this.surahsTelemetry.length} Surahs.`);
    } catch (err) {
      console.error("[CorpusEngine] Failed to initialize:", err);
    }
  }

  setupSurahControls() {
    const searchInput = document.getElementById("surah-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.surahSearchQuery = e.target.value.trim().toLowerCase();
        this.renderSurahNavigator();
      });
    }

    const filterBtns = document.querySelectorAll(".surah-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.surahFilterMode = btn.dataset.filter;
        this.renderSurahNavigator();
      });
    });

    const surahSelect = document.getElementById("active-surah-select");
    if (surahSelect) {
      surahSelect.addEventListener("change", (e) => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(e.target.value, 10);
        this.loadSurah(sId);
      });
    }

    const thematicSearch = document.getElementById("thematic-search-input");
    if (thematicSearch) {
      thematicSearch.addEventListener("input", (e) => {
        this.renderThematicGraph(e.target.value.trim().toLowerCase());
      });
    }

    // Density Mode Buttons
    const btnCompact = document.getElementById("view-mode-compact");
    const btnDeep = document.getElementById("view-mode-deep");
    if (btnCompact && btnDeep) {
      btnCompact.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.setAyahViewMode("compact");
      });
      btnDeep.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.setAyahViewMode("deep");
      });
    }

    // Layer Toggles
    const setupToggle = (id, prop, chipId) => {
      const el = document.getElementById(id);
      const chip = document.getElementById(chipId);
      if (el) {
        el.addEventListener("change", (e) => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          this[prop] = e.target.checked;
          if (chip) chip.classList.toggle("active", e.target.checked);
          this.applyAyahLayerVisibility();
        });
      }
    };
    setupToggle("toggle-layer-en", "showEnglish", "chip-layer-en");
    setupToggle("toggle-layer-ki", "showKanzulIman", "chip-layer-ki");
    setupToggle("toggle-layer-kr", "showKanzulIrfan", "chip-layer-kr");
    setupToggle("toggle-layer-words", "showWordPills", "chip-layer-words");
  }

  setAyahViewMode(mode) {
    this.ayahViewMode = mode;
    const btnCompact = document.getElementById("view-mode-compact");
    const btnDeep = document.getElementById("view-mode-deep");
    const container = document.getElementById("ayahs-list-container");

    if (mode === "compact") {
      if (btnCompact) btnCompact.classList.add("active");
      if (btnDeep) btnDeep.classList.remove("active");
      if (container) container.classList.add("compact-mode");
      if (container) container.classList.remove("deep-mode");
      this.showEnglish = true;
      this.showKanzulIman = true;
      this.showKanzulIrfan = false;
      this.showWordPills = false;
    } else {
      if (btnCompact) btnCompact.classList.remove("active");
      if (btnDeep) btnDeep.classList.add("active");
      if (container) container.classList.remove("compact-mode");
      if (container) container.classList.add("deep-mode");
      this.showEnglish = true;
      this.showKanzulIman = true;
      this.showKanzulIrfan = true;
      this.showWordPills = true;
    }

    // Sync UI elements
    const chkEn = document.getElementById("toggle-layer-en");
    const chkKi = document.getElementById("toggle-layer-ki");
    const chkKr = document.getElementById("toggle-layer-kr");
    const chkWords = document.getElementById("toggle-layer-words");
    if (chkEn) chkEn.checked = this.showEnglish;
    if (chkKi) chkKi.checked = this.showKanzulIman;
    if (chkKr) chkKr.checked = this.showKanzulIrfan;
    if (chkWords) chkWords.checked = this.showWordPills;

    const chipEn = document.getElementById("chip-layer-en");
    const chipKi = document.getElementById("chip-layer-ki");
    const chipKr = document.getElementById("chip-layer-kr");
    const chipWords = document.getElementById("chip-layer-words");
    if (chipEn) chipEn.classList.toggle("active", this.showEnglish);
    if (chipKi) chipKi.classList.toggle("active", this.showKanzulIman);
    if (chipKr) chipKr.classList.toggle("active", this.showKanzulIrfan);
    if (chipWords) chipWords.classList.toggle("active", this.showWordPills);

    this.applyAyahLayerVisibility();
  }

  applyAyahLayerVisibility() {
    const container = document.getElementById("ayahs-list-container");
    if (!container) return;

    container.querySelectorAll(".trans-layer-en").forEach(el => {
      el.style.display = this.showEnglish ? "flex" : "none";
    });
    container.querySelectorAll(".trans-layer-ki").forEach(el => {
      el.style.display = this.showKanzulIman ? "flex" : "none";
    });
    container.querySelectorAll(".trans-layer-kr").forEach(el => {
      el.style.display = this.showKanzulIrfan ? "flex" : "none";
    });
    container.querySelectorAll(".ayah-words-pills-container").forEach(el => {
      el.style.display = this.showWordPills ? "flex" : "none";
    });
  }

  populateSurahDropdown() {
    const select = document.getElementById("active-surah-select");
    if (!select) return;

    let html = "";
    this.surahsTelemetry.forEach(s => {
      html += `<option value="${s.id}">${s.id}. ${s.name_roman} (${s.name_ar}) - ${s.total_ayat} Ayat</option>`;
    });
    select.innerHTML = html;
  }

  renderSurahNavigator() {
    const container = document.getElementById("surah-grid-container");
    if (!container) return;

    let list = [...this.surahsTelemetry];

    if (this.surahFilterMode === "makki") {
      list = list.filter(s => (s.place || "").toLowerCase().includes("makki") || /مک|مك/.test(s.place || ""));
    } else if (this.surahFilterMode === "madani") {
      list = list.filter(s => (s.place || "").toLowerCase().includes("madani") || /مدن/.test(s.place || ""));
    } else if (this.surahFilterMode === "length") {
      list.sort((a, b) => b.total_words - a.total_words);
    } else if (this.surahFilterMode === "order") {
      list.sort((a, b) => a.revelation_order - b.revelation_order);
    }

    if (this.surahSearchQuery) {
      const q = this.surahSearchQuery.replace(/-/g, ' ');
      list = list.filter(s => {
        const rName = (s.name_roman || '').toLowerCase().replace(/-/g, ' ');
        return rName.includes(q) ||
               (s.name_ar && s.name_ar.includes(this.surahSearchQuery)) ||
               String(s.id) === this.surahSearchQuery ||
               String(s.revelation_order) === this.surahSearchQuery;
      });
    }

    let html = "";
    if (list.length === 0) {
      html = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">No Surahs match your query.</div>`;
    } else {
      list.forEach(s => {
        const isMakki = (s.place || "").toLowerCase().includes("makki") || /مک|مك/.test(s.place || "");
        html += `
          <div class="surah-card" data-surah="${s.id}">
            <div class="surah-card-header">
              <div class="surah-num-badge">${s.id}</div>
              <div class="surah-titles">
                <div class="surah-name-roman">${s.name_roman}</div>
                <span class="surah-type-badge ${isMakki ? 'makki' : 'madani'}">${isMakki ? 'Makki' : 'Madani'} • Rev #${s.revelation_order}</span>
              </div>
              <div class="surah-name-arabic">${s.name_ar}</div>
            </div>

            <div class="surah-stats-row">
              <div class="surah-stat-col">
                <div class="stat-title">Verses</div>
                <div class="stat-number">${s.total_ayat}</div>
              </div>
              <div class="surah-stat-col">
                <div class="stat-title">Words</div>
                <div class="stat-number">${s.total_words.toLocaleString()}</div>
              </div>
              <div class="surah-stat-col">
                <div class="stat-title">TTR %</div>
                <div class="stat-number" style="color: #34d399;">${s.lexical_diversity_ttr}%</div>
              </div>
            </div>

            <div class="surah-top-words">
              <span class="stat-title" style="margin-right: 4px;">Top Vocab:</span>
              ${(s.top_10_words || []).slice(0, 4).map(w => `<span class="top-word-chip">${w.word} (${w.count})</span>`).join("")}
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;

    container.querySelectorAll(".surah-card").forEach(card => {
      card.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(card.dataset.surah, 10);
        this.jumpToAyah(sId, 1);
      });
    });
  }

  async loadSurah(surahId) {
    try {
      this.activeSurahId = surahId;
      const select = document.getElementById("active-surah-select");
      if (select) select.value = surahId;

      // 1. Check if already loaded in memory
      if (window.QURAN_SURAHS && window.QURAN_SURAHS[surahId]) {
        this.currentSurahData = window.QURAN_SURAHS[surahId];
        this.renderAyahAnalyzer();
        return;
      }

      // 2. Try HTTP fetch if online
      if (window.location.protocol.startsWith("http")) {
        try {
          const filename = String(surahId).padStart(3, '0') + '.json';
          const res = await fetch(`data/surahs/${filename}`);
          if (res.ok) {
            this.currentSurahData = await res.json();
            window.QURAN_SURAHS = window.QURAN_SURAHS || {};
            window.QURAN_SURAHS[surahId] = this.currentSurahData;
            this.renderAyahAnalyzer();
            return;
          }
        } catch (fetchErr) {
          // Fall through to script loader
        }
      }

      // 3. Dynamic script injection (Zero-CORS offline under file://)
      await new Promise((resolve, reject) => {
        const sName = String(surahId).padStart(3, '0');
        const script = document.createElement("script");
        script.src = `data/surahs_js/${sName}.js`;
        script.onload = () => {
          if (window.QURAN_SURAHS && window.QURAN_SURAHS[surahId]) {
            this.currentSurahData = window.QURAN_SURAHS[surahId];
            this.renderAyahAnalyzer();
            resolve();
          } else {
            reject(new Error(`Surah ${surahId} not found in script.`));
          }
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });

    } catch (err) {
      console.error(`Failed to load Surah ${surahId}:`, err);
    }
  }

  jumpToAyah(surahId, ayahNumber) {
    if (window.switchAppTab) {
      window.switchAppTab("ayahs");
    }
    this.loadSurah(surahId).then(() => {
      setTimeout(() => {
        const target = document.getElementById(`ayah-node-${ayahNumber}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.borderColor = "var(--border-focus)";
          target.style.boxShadow = "0 0 25px rgba(16, 185, 129, 0.4)";
          setTimeout(() => {
            target.style.borderColor = "";
            target.style.boxShadow = "";
          }, 2500);
        }
      }, 150);
    });
  }

  renderAyahAnalyzer() {
    const headerContainer = document.getElementById("active-surah-meta-banner");
    const ayatContainer = document.getElementById("ayahs-list-container");
    if (!this.currentSurahData || !ayatContainer) return;

    const s = this.currentSurahData;
    const isMakki = (s.place || "").toLowerCase().includes("makki") || /مک|مك/.test(s.place || "");

    if (headerContainer) {
      headerContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 1.35rem; color: var(--text-main);">${s.surah_id}. Surah ${s.name_roman}</h2>
            <p style="font-size: 0.85rem; color: var(--text-dim);">${isMakki ? 'Makki (مکی)' : 'Madani (مدنی)'} • Revelation Order: #${s.revelation_order} • ${s.total_ayat} Ayat • ${s.total_ruku} Ruku</p>
          </div>
          <div style="font-family: var(--font-arabic); font-size: 2.2rem; color: #38bdf8;">${s.name_ar}</div>
        </div>
        ${s.intro ? `<div style="font-family: var(--font-urdu); font-size: 1.15rem; color: #cbd5e1; direction: rtl; text-align: right; margin-top: 10px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">${s.intro}</div>` : ''}
      `;
    }

    let html = "";
    (s.ayat || []).forEach(a => {
      html += `
        <div class="ayah-card ${this.ayahViewMode === 'compact' ? 'compact-card' : ''}" id="ayah-node-${a.number}">
          <div class="ayah-card-meta">
            <div class="ayah-meta-left">
              <span class="ayah-badge">Ayah ${s.surah_id}:${a.number}</span>
              <span class="ayah-stat-chip">${a.word_count} Words</span>
            </div>
            <div class="ayah-meta-actions">
              <button class="ayah-tool-btn toggle-ayah-words-btn" data-target="words-box-${a.number}" title="Toggle Word-by-Word Breakdown">
                🔤 Words (${a.word_count})
              </button>
              ${a.tafseer_sirat_ul_jinan ? `
                <button class="ayah-tool-btn toggle-ayah-tafsir-btn" data-target="tafsir-box-${a.number}" title="Read Tafsir Sirat-ul-Jinan">
                  📖 Tafsir
                </button>
              ` : ''}
              <button class="ayah-tool-btn copy-ayah-btn" data-arabic="${encodeURIComponent(a.arabic)}" title="Copy Arabic Verse">
                📋 Copy
              </button>
            </div>
          </div>

          <div class="ayah-arabic-text">${a.arabic}</div>

          <div class="ayah-words-pills-container" id="words-box-${a.number}" style="${this.showWordPills ? 'display:flex;' : 'display:none;'}">
            ${(a.words || []).map(w => `
              <div class="word-pill" title="Word #${w.index}: ${w.clean}">
                <span class="pill-ar">${w.token}</span>
                <span class="pill-idx">#${w.index}</span>
              </div>
            `).join("")}
          </div>

          <div class="translations-block">
            ${a.translation_english ? `
              <div class="translation-item trans-layer-en" dir="ltr" style="${this.showEnglish ? 'display:flex;' : 'display:none;'}">
                <span class="compact-trans-tag en">EN</span>
                <div class="trans-text english">${a.translation_english}</div>
              </div>
            ` : ''}

            ${a.translation_urdu_kanzul_iman ? `
              <div class="translation-item trans-layer-ki" dir="rtl" style="${this.showKanzulIman ? 'display:flex;' : 'display:none;'}">
                <span class="compact-trans-tag ur-ki">کنز الایمان</span>
                <div class="trans-text urdu" dir="rtl">${a.translation_urdu_kanzul_iman}</div>
              </div>
            ` : ''}

            ${a.translation_urdu_kanzul_irfan ? `
              <div class="translation-item trans-layer-kr" dir="rtl" style="${this.showKanzulIrfan ? 'display:flex;' : 'display:none;'}">
                <span class="compact-trans-tag ur-kr">کنز العرفان</span>
                <div class="trans-text urdu" dir="rtl">${a.translation_urdu_kanzul_irfan}</div>
              </div>
            ` : ''}
          </div>

          ${a.tafseer_sirat_ul_jinan ? `
            <div class="tafsir-content-drawer" id="tafsir-box-${a.number}">
              ${a.tafseer_sirat_ul_jinan}
            </div>
          ` : ''}
        </div>
      `;
    });

    ayatContainer.innerHTML = html;

    // Wire Per-Ayah Word Toggle
    ayatContainer.querySelectorAll(".toggle-ayah-words-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const targetId = btn.dataset.target;
        const box = document.getElementById(targetId);
        if (box) {
          const isHidden = box.style.display === "none";
          box.style.display = isHidden ? "flex" : "none";
          btn.classList.toggle("active", isHidden);
        }
      });
    });

    // Wire Per-Ayah Tafsir Toggle
    ayatContainer.querySelectorAll(".toggle-ayah-tafsir-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const targetId = btn.dataset.target;
        const drawer = document.getElementById(targetId);
        if (drawer) {
          drawer.classList.toggle("open");
          btn.classList.toggle("active", drawer.classList.contains("open"));
        }
      });
    });

    // Wire Per-Ayah Copy Button
    ayatContainer.querySelectorAll(".copy-ayah-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const text = decodeURIComponent(btn.dataset.arabic);
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = "✓ Copied";
          btn.style.borderColor = "#34d399";
          btn.style.color = "#34d399";
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.borderColor = "";
            btn.style.color = "";
          }, 1500);
        }).catch(err => {
          console.error("Failed to copy:", err);
        });
      });
    });

    // Wire Word Pills Animation
    ayatContainer.querySelectorAll(".word-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        pill.style.transform = "scale(1.15)";
        setTimeout(() => pill.style.transform = "", 150);
      });
    });
  }

  renderThematicGraph(query = "") {
    const container = document.getElementById("thematic-topics-container");
    if (!container) return;

    let topics = this.thematicGraph;
    if (query) {
      topics = topics.filter(t => t.heading.toLowerCase().includes(query));
    }

    let html = "";
    if (topics.length === 0) {
      html = `<div style="text-align: center; padding: 40px; color: var(--text-dim);">No topics found matching "${query}".</div>`;
    } else {
      topics.slice(0, 60).forEach(t => {
        html += `
          <div class="semantic-card" style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
              <h4 style="font-family: var(--font-urdu); font-size: 1.35rem; color: #38bdf8; direction: rtl; text-align: right;">${t.heading}</h4>
              <span class="count-pill">${t.references_count} Ayat</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              ${(t.references || []).map(r => `
                <button class="filter-btn jump-to-ayah-btn" data-surah="${r.surah_id}" data-ayah="${r.ayat_number}">
                  Surah ${r.surah_id}:${r.ayat_number}
                </button>
              `).join("")}
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;

    container.querySelectorAll(".jump-to-ayah-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);
        this.jumpToAyah(sId, aNo);
      });
    });
  }

  renderMutashabihat() {
    const container = document.getElementById("mutashabihat-container");
    if (!container) return;

    let html = "";
    this.mutashabihat.slice(0, 40).forEach(c => {
      html += `
        <div class="ayah-card" style="margin-bottom: 16px;">
          <div class="ayah-card-meta">
            <span class="ayah-badge" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8;">Cluster #${c.cluster_id}</span>
            <span class="count-pill">${c.match_count} Similar Verses</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
            ${(c.occurrences || []).map(occ => `
              <div style="background: rgba(255, 255, 255, 0.02); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-emerald);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <span class="surah-count-pill">Surah ${occ.surah_id} : Ayah ${occ.ayat_number}</span>
                  <button class="filter-btn jump-to-ayah-btn" data-surah="${occ.surah_id}" data-ayah="${occ.ayat_number}">View in Context</button>
                </div>
                <div style="font-family: var(--font-arabic); font-size: 1.45rem; line-height: 1.8; color: #f8fafc; direction: rtl; text-align: right;">${occ.arabic}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll(".jump-to-ayah-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);
        this.jumpToAyah(sId, aNo);
      });
    });
  }

  renderWaqfRules() {
    const container = document.getElementById("waqf-rules-container");
    if (!container) return;

    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">`;
    this.waqfRules.forEach(w => {
      html += `
        <div class="semantic-card">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--border-accent); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-family: var(--font-arabic); font-size: 2rem; color: #34d399;">
              ${w.symbol}
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Waqf Sign</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">${w.symbol}</div>
            </div>
          </div>
          <div style="font-family: var(--font-urdu); font-size: 1.25rem; line-height: 1.8; color: #cbd5e1; direction: rtl; text-align: right; margin-top: 8px;">
            ${w.description}
          </div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
  }
}

window.CorpusEngine = new CorpusEngine();
