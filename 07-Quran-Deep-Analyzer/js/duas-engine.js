/**
 * DuasEngine - Quranic Duas & Supplications Encyclopedia Engine
 * Part of Quran Deep Analyzer Suite
 * Supports Single Page Application (SPA) native tab mounting (#tab-duas) and standalone mode (duas.html)
 * Defensive Bootloader Isolation & AMOLED Cyber-Glass Architecture
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const instance = factory();
    module.exports = instance;
    if (root) root.DuasEngine = instance;
  } else {
    root.DuasEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  let initialized = false;
  let duasData = null;
  let audioPlayer = null;
  let currentlyPlayingSerial = null;

  // Filter & Search State
  let activeQuickFilter = "all"; // 'all', '40_rabbana', 'rabbi', 'prophet', 'believer', 'starred'
  let activeCategory = "all";
  let activeProphet = "all";
  let searchQuery = "";

  // Executive Dual-Mode & Typography Engine State (Finding F-09)
  let viewMode = "devotional"; // 'devotional' (default clean) or 'study' (full exegesis)
  let fontScale = 1.0; // 0.85 to 1.40
  let fontFamily = "nastaleeq"; // 'nastaleeq' or 'naskh'
  let defaultCardTrans = "iman"; // 'iman', 'irfan', 'both', 'english'
  const cardTransState = new Map(); // serial -> 'iman'|'irfan'|'both'|'english'

  // Load preferences from localStorage safely
  try {
    const savedMode = localStorage.getItem("quran_duas_view_mode");
    if (savedMode === "devotional" || savedMode === "study") {
      viewMode = savedMode;
    }
    const savedScale = parseFloat(localStorage.getItem("quran_duas_font_scale"));
    if (!isNaN(savedScale) && savedScale >= 0.8 && savedScale <= 1.5) {
      fontScale = Math.round(savedScale * 100) / 100;
    }
    const savedFont = localStorage.getItem("quran_duas_font_family");
    if (savedFont === "nastaleeq" || savedFont === "naskh") {
      fontFamily = savedFont;
    }
    const savedTrans = localStorage.getItem("quran_duas_default_trans");
    if (savedTrans) {
      defaultCardTrans = savedTrans;
    }
  } catch(e) {}

  // Virtualization / Chunk rendering state
  const CHUNK_SIZE = 15;
  let renderedCount = 0;
  let currentFilteredItems = [];
  let observer = null;

  // Audio Context SFX generator (Directive 7: strict zero music, procedural clicks allowed)
  let audioCtx = null;
  function playClickSfx() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      }
    } catch (e) {}
  }

  function initData() {
    if (window.QURAN_DUAS_DATA && window.QURAN_DUAS_DATA.duas) {
      duasData = window.QURAN_DUAS_DATA.duas;
    } else {
      duasData = [];
    }
  }

  function getBookmarks() {
    try {
      const saved = localStorage.getItem("quran_duas_starred");
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  }

  function isBookmarked(serial) {
    const list = getBookmarks();
    return list.includes(serial);
  }

  function toggleBookmark(serial) {
    playClickSfx();
    try {
      let list = getBookmarks();
      if (list.includes(serial)) {
        list = list.filter(x => x !== serial);
      } else {
        list.push(serial);
      }
      localStorage.setItem("quran_duas_starred", JSON.stringify(list));

      // Update UI button
      const btn = document.querySelector(`.star-btn[data-serial="${serial}"]`);
      if (btn) {
        const starred = list.includes(serial);
        btn.classList.toggle("starred", starred);
        btn.innerHTML = `<span>${starred ? '⭐' : '☆'}</span>`;
      }

      if (activeQuickFilter === "starred") {
        renderList();
      }
    } catch(e) {}
  }

  function normalizeText(txt) {
    if (!txt) return "";
    return txt
      .toLowerCase()
      .replace(/[ً-ٰٟۖ-ۭ]/g, "") // Diacritics
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ہ")
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .trim();
  }

  function filterItems() {
    if (!duasData) return [];
    const starredList = getBookmarks();
    const q = normalizeText(searchQuery);

    return duasData.filter(d => {
      // 1. Quick Filter
      if (activeQuickFilter === "40_rabbana" && d.type !== "40_rabbana") return false;
      if (activeQuickFilter === "rabbi" && d.type !== "rabbi") return false;
      if (activeQuickFilter === "prophet" && d.type !== "prophet") return false;
      if (activeQuickFilter === "believer" && (d.type === "prophet" || d.type === "40_rabbana")) return false;
      if (activeQuickFilter === "starred" && !starredList.includes(d.serial)) return false;

      // 2. Category Filter
      if (activeCategory !== "all" && d.category_id !== activeCategory) return false;

      // 3. Prophet Filter
      if (activeProphet !== "all") {
        if (!d.prophet_tag || !d.prophet_tag.includes(activeProphet)) return false;
      }

      // 4. Search Query
      if (q) {
        const coord = `${d.surah_id}:${d.ayah_start}`;
        const matchCoord = coord.includes(q) || `${d.surah_id}:${d.ayah_end}`.includes(q);
        const matchTitle = normalizeText(d.title_ur).includes(q) || (d.title_en && d.title_en.toLowerCase().includes(q));
        const matchSurah = normalizeText(d.surah_name_ar).includes(q) || (d.surah_name_roman && d.surah_name_roman.toLowerCase().includes(q));
        const matchArabic = normalizeText(d.arabic).includes(q);
        const matchIman = normalizeText(d.urdu_kanzul_iman).includes(q);
        const matchIrfan = normalizeText(d.urdu_kanzul_irfan).includes(q);
        const matchEnglish = d.english && d.english.toLowerCase().includes(q);
        const matchWhen = normalizeText(d.when_to_use_ur).includes(q) || (d.when_to_use_en && d.when_to_use_en.toLowerCase().includes(q));
        const matchPurpose = normalizeText(d.purpose_virtue_ur).includes(q) || (d.purpose_virtue_en && d.purpose_virtue_en.toLowerCase().includes(q));
        const matchRev = normalizeText(d.reason_for_revelation_ur).includes(q) || (d.reason_for_revelation_en && d.reason_for_revelation_en.toLowerCase().includes(q));
        const matchSpeaker = normalizeText(d.speaker_ur).includes(q) || (d.speaker && d.speaker.toLowerCase().includes(q));

        if (!matchCoord && !matchTitle && !matchSurah && !matchArabic && !matchIman && !matchIrfan && !matchEnglish && !matchWhen && !matchPurpose && !matchRev && !matchSpeaker) {
          return false;
        }
      }

      return true;
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

    /**
   * Format Sacred Arabic Verse with canonical End-of-Ayah Rosette Medallions
   * - Strips trailing waqf pause marks (e.g. \u06e0) to prevent glyph collisions
   * - Renders pure canonical Ayah numbers (e.g. 286 instead of 2:286)
   * - Supports multi-ayah duas by formatting each embedded rosette boundary
   */
  function formatArabicVerse(d) {
    if (!d || !d.arabic) return "";
    const raw = String(d.arabic).trim();
    const start = d.ayah_start;
    const end = d.ayah_end;

    // Check if text contains pre-embedded \u06dd or ۝ rosettes
    if (raw.includes("\u06dd") || raw.includes("۝")) {
      let curr = start;
      const parts = raw.split(/[\u06dd۝]/);
      const res = [];
      for (let idx = 0; idx < parts.length; idx++) {
        const pClean = parts[idx].trim().replace(/[\s\-\u0615\u06D5-\u06DC\u06DF-\u06ED]+$/, "");
        if (pClean) {
          res.push(escapeHtml(pClean));
        }
        if (idx < parts.length - 1) {
          const num = (curr !== undefined && curr !== null) ? String(curr) : "";
          const digitsClass = num.length >= 3 ? " digits-3" : "";
          res.push(` <span class="dua-ayah-num${digitsClass}" data-ayah="${num}" role="button" tabindex="0" title="Ayah ${num}">${num}</span> `);
          if (curr !== undefined && curr !== null && (end === undefined || curr < end)) {
            curr++;
          }
        }
      }
      return res.join("").trim();
    } else {
      // Single Ayah: strip trailing pause marks & append single canonical rosette
      const pClean = raw.replace(/[\s\-\u0615\u06D5-\u06DC\u06DF-\u06ED]+$/, "");
      const num = (start !== undefined && start !== null) ? String(start) : String(d.ayah_coordinate || "");
      const digitsClass = num.length >= 3 ? " digits-3" : "";
      return `${escapeHtml(pClean)} <span class="dua-ayah-num${digitsClass}" data-ayah="${num}" role="button" tabindex="0" title="Ayah ${num}">${num}</span>`;
    }
  }

  function buildDuaCardHtml(d) {
    const isStarred = isBookmarked(d.serial);
    const isPlaying = currentlyPlayingSerial === d.serial;
    const cardTrans = cardTransState.get(d.serial) || defaultCardTrans;

    // Type badge format
    let typeBadgeLabel = "قرآنی دعا";
    if (d.type === "40_rabbana") typeBadgeLabel = "۴۰ ربنا دعا";
    else if (d.type === "rabbi") typeBadgeLabel = "ربِّ ندا";
    else if (d.type === "prophet") typeBadgeLabel = "دعائے انبیاء";
    else if (d.type === "believer") typeBadgeLabel = "دعائے مؤمنین";

    return `
      <article class="dua-card mode-${viewMode} ${isPlaying ? 'playing-now' : ''}" id="dua-card-${d.serial}" data-serial="${d.serial}" data-active-trans="${cardTrans}">
        <header class="dua-card-header">
          <div class="dua-meta-left">
            <span class="dua-serial-pill">#${d.serial_ur} (${d.serial})</span>
            <span class="dua-coord-pill">[سورۃ ${d.surah_name_ar} ${d.surah_id}:${d.ayah_coordinate}]</span>
            <span class="dua-surah-title">${escapeHtml(d.surah_name_roman)}</span>
            <span class="dua-type-tag">${typeBadgeLabel}</span>
            <span class="dua-speaker-tag">${escapeHtml(d.speaker_ur)}</span>
          </div>

          <!-- Minimal Header Actions: Discreet Recite & Bookmark -->
          <div class="dua-header-actions">
            <button type="button" class="dua-header-btn play-btn ${isPlaying ? 'playing' : ''}" onclick="DuasEngine.playDua(${d.serial})" title="Listen to Mishary Alafasy Recitation" aria-label="Play Recitation">
              <span>${isPlaying ? '⏸️' : '▶'}</span>
              <span class="btn-label-text">${isPlaying ? 'Pause' : 'Recite'}</span>
            </button>
            <button type="button" class="dua-header-btn star-btn ${isStarred ? 'starred' : ''}" data-serial="${d.serial}" onclick="DuasEngine.toggleStar(${d.serial})" title="Bookmark Dua" aria-label="Bookmark">
              <span>${isStarred ? '⭐' : '☆'}</span>
            </button>
          </div>
        </header>

        <!-- Tier 1: Scriptural Core (HERO: Placed Directly Below Header) -->
        <div class="dua-arabic" dir="rtl">
          ${formatArabicVerse(d)}
        </div>

        <!-- Integrated Translation Container with Sleek Segmented Switcher Header -->
        <div class="dua-translation-container">
          <div class="dua-trans-segmented-bar" role="tablist" aria-label="Translation Selector">
            <button type="button" class="dua-segment-btn ${cardTrans === 'iman' ? 'active' : ''}" data-trans="iman" onclick="DuasEngine.switchCardTranslation(${d.serial}, 'iman')" title="امام احمد رضا خان علیہ الرحمہ">
              <span>👑 ایمان</span>
            </button>
            <button type="button" class="dua-segment-btn ${cardTrans === 'irfan' ? 'active' : ''}" data-trans="irfan" onclick="DuasEngine.switchCardTranslation(${d.serial}, 'irfan')" title="مفتی محمد قاسم قادری">
              <span>📖 عرفان</span>
            </button>
            <button type="button" class="dua-segment-btn ${cardTrans === 'both' ? 'active' : ''}" data-trans="both" onclick="DuasEngine.switchCardTranslation(${d.serial}, 'both')" title="دونوں اردو تراجم ساتھ ساتھ">
              <span>⊞ دونوں</span>
            </button>
            <button type="button" class="dua-segment-btn ${cardTrans === 'english' ? 'active' : ''}" data-trans="english" onclick="DuasEngine.switchCardTranslation(${d.serial}, 'english')" title="English Translation">
              <span>🌐 EN</span>
            </button>
          </div>

          <div class="dua-translation-body">
            <!-- High-Density Dual Translation Grid -->
            <div class="dua-tarjuma-grid">
              <div class="dua-tarjuma-pane iman">
                <div class="dua-tarjuma-label">
                  <span>👑 کنز الایمان (امام احمد رضا خان علیہ الرحمہ)</span>
                </div>
                <div class="dua-tarjuma-text">${escapeHtml(d.urdu_kanzul_iman)}</div>
              </div>

              <div class="dua-tarjuma-pane irfan">
                <div class="dua-tarjuma-label">
                  <span>📖 کنز العرفان (مفتی محمد قاسم قادری)</span>
                </div>
                <div class="dua-tarjuma-text">${escapeHtml(d.urdu_kanzul_irfan)}</div>
              </div>
            </div>

            <!-- English Translation -->
            <div class="dua-english" dir="ltr">
              ${escapeHtml(d.english)}
            </div>
          </div>
        </div>

        <!-- 1-Tap Expandable Context & Exegesis Drawer -->
        <button type="button" class="dua-drawer-trigger ${viewMode === 'study' ? 'open' : ''}" id="dua-drawer-trigger-${d.serial}" onclick="DuasEngine.toggleContextDrawer(${d.serial})" aria-expanded="${viewMode === 'study'}">
          <span>💡 حکمت، فضائل و پس منظر (کب پڑھیں، کس مقصد کے لیے، شانِ نزول)</span>
          <span class="drawer-chevron">▾</span>
        </button>

        <div class="dua-drawer-content ${viewMode === 'study' ? 'drawer-open' : ''}" id="dua-drawer-content-${d.serial}">
          <div class="dua-context-box" style="margin-top: 0; padding-top: 4px; border-top: none;">
            <!-- Tier 2: When to Use -->
            <div class="dua-tier-item occasion">
              <div class="dua-tier-icon">⏱️</div>
              <div class="dua-tier-content">
                <div class="dua-tier-title-ur"><strong>کب پڑھیں؟ (Occasions & Times):</strong> ${escapeHtml(d.when_to_use_ur)}</div>
                <div class="dua-tier-title-en">${escapeHtml(d.when_to_use_en)}</div>
              </div>
            </div>

            <!-- Tier 3: Purpose & Spiritual Virtues -->
            <div class="dua-tier-item purpose">
              <div class="dua-tier-icon">🎯</div>
              <div class="dua-tier-content">
                <div class="dua-tier-title-ur"><strong>کس مقصد کے لیے؟ (Virtues & Benefits):</strong> ${escapeHtml(d.purpose_virtue_ur)}</div>
                <div class="dua-tier-title-en">${escapeHtml(d.purpose_virtue_en)}</div>
              </div>
            </div>

            <!-- Tier 4: Asbab al-Nuzul & Sirat-ul-Jinan Exegesis -->
            <div class="dua-tier-item revelation">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="dua-tier-icon">📖</span>
                <span class="dua-tier-title-ur" style="color: #c084fc;"><strong>شانِ نزول و تفسیری پس منظر (صراط الجنان):</strong></span>
              </div>
              <div class="dua-tier-title-ur" style="color: #e2e8f0; font-size: 0.95rem;">
                ${escapeHtml(d.reason_for_revelation_ur)}
              </div>
              ${d.sirat_ul_jinan_snippet ? `
                <div class="dua-tafsir-snippet" id="tafsir-snippet-${d.serial}">
                  ${escapeHtml(d.sirat_ul_jinan_snippet)}
                </div>
                <button class="dua-tafsir-toggle-btn" onclick="DuasEngine.toggleTafsirSnippet(${d.serial})">
                  مکمل تفسیری نوٹ پڑھیں ▾
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Discreet Card Footer Action Bar (Zero visual pollution above scripture) -->
        <footer class="dua-card-footer">
          <button type="button" class="dua-footer-btn analyzer-btn" onclick="DuasEngine.jumpToQuran(${d.surah_id}, ${d.ayah_start})" title="Open in Quran Deep Ayah Analyzer">
            <span>🔍 Open in Quran ↗</span>
          </button>
          <button type="button" class="dua-footer-btn copy-btn" onclick="DuasEngine.copyDua(${d.serial})" title="Copy Full Dua with Exegesis">
            <span>📋 Copy</span>
          </button>
          <button type="button" class="dua-footer-btn whatsapp-btn" onclick="DuasEngine.shareWhatsApp(${d.serial})" title="Share on WhatsApp">
            <span>💬 WhatsApp</span>
          </button>
        </footer>
      </article>
    `;
  }

  function renderList() {
    const container = document.getElementById("native-duas-list") || document.getElementById("duas-list-mount");
    const countBadge = document.getElementById("native-duas-count-badge") || document.getElementById("duas-count-badge");
    if (!container) return;

    currentFilteredItems = filterItems();
    renderedCount = 0;

    if (countBadge) {
      countBadge.textContent = `${currentFilteredItems.length} Duas (دعائیں)`;
    }

    if (currentFilteredItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: #94a3b8; background: rgba(15,23,42,0.6); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🤲</div>
          <h3 style="color: #f8fafc; margin-bottom: 6px;">کوئی دعا نہیں ملی (No Duas Found)</h3>
          <p style="font-size: 0.9rem;">اپنی تلاش یا فلٹرز کو تبدیل کر کے دوبارہ کوشش کریں۔</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    renderNextChunk();
  }

  function renderNextChunk() {
    const container = document.getElementById("native-duas-list") || document.getElementById("duas-list-mount");
    if (!container) return;

    const slice = currentFilteredItems.slice(renderedCount, renderedCount + CHUNK_SIZE);
    if (slice.length === 0) return;

    const html = slice.map(d => buildDuaCardHtml(d)).join("");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    while (tempDiv.firstChild) {
      container.appendChild(tempDiv.firstChild);
    }

    renderedCount += slice.length;
  }

  function setupIntersectionObserver() {
    const sentinel = document.getElementById("native-duas-sentinel") || document.getElementById("duas-scroll-sentinel");
    if (!sentinel) return;

    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && renderedCount < currentFilteredItems.length) {
        renderNextChunk();
      }
    }, { rootMargin: "400px" });

    observer.observe(sentinel);
  }

  function applyTypographyAndModeStyles() {
    try {
      document.documentElement.style.setProperty("--dua-font-scale", fontScale.toString());

      const scope = document.getElementById("tab-duas") || document.body;
      if (fontFamily === "naskh") {
        scope.classList.add("font-mode-naskh");
      } else {
        scope.classList.remove("font-mode-naskh");
      }

      // Update Toolbar indicators if present
      const scaleDisplays = document.querySelectorAll(".dua-font-scale-val");
      scaleDisplays.forEach(el => {
        el.textContent = `${Math.round(fontScale * 100)}%`;
      });

      const fontToggles = document.querySelectorAll(".dua-font-toggle-btn");
      fontToggles.forEach(el => {
        el.textContent = fontFamily === "naskh" ? "📖 نسخ" : "🖋️ نستعلیق";
      });

      // Update View mode buttons
      const modeDevoBtns = document.querySelectorAll(".dua-mode-btn[data-mode='devotional']");
      modeDevoBtns.forEach(btn => btn.classList.toggle("active", viewMode === "devotional"));
      const modeStudyBtns = document.querySelectorAll(".dua-mode-btn[data-mode='study']");
      modeStudyBtns.forEach(btn => btn.classList.toggle("active", viewMode === "study"));
    } catch(e) {}
  }

  function bindEvents(scope) {
    if (!scope) scope = document;

    // Search input
    const searchInput = scope.querySelector("#native-duas-search") || scope.querySelector("#duas-search-input");
    const searchClear = scope.querySelector("#native-duas-search-clear") || scope.querySelector("#duas-search-clear");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchClear) searchClear.style.display = searchQuery ? "flex" : "none";
        renderList();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClear.style.display = "none";
        renderList();
        searchInput.focus();
      });
    }

    // Quick filter pills
    const pills = scope.querySelectorAll(".duas-pill-btn");
    pills.forEach(p => {
      p.addEventListener("click", () => {
        playClickSfx();
        pills.forEach(x => x.classList.remove("active"));
        p.classList.add("active");
        activeQuickFilter = p.getAttribute("data-filter") || "all";
        renderList();
      });
    });

    // Category chips (if rendered as chips)
    const catChips = scope.querySelectorAll(".duas-cat-chip");
    catChips.forEach(c => {
      c.addEventListener("click", () => {
        playClickSfx();
        catChips.forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        activeCategory = c.getAttribute("data-cat") || "all";
        // Sync dropdown if exists
        const catSelect = scope.querySelector("#duas-cat-select") || scope.querySelector("#native-duas-cat-select");
        if (catSelect) catSelect.value = activeCategory;
        renderList();
      });
    });

    // Category dropdown select
    const catSelect = scope.querySelector("#duas-cat-select") || scope.querySelector("#native-duas-cat-select");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        playClickSfx();
        activeCategory = e.target.value;
        renderList();
      });
    }

    // Prophet chips (if rendered as chips)
    const prophetChips = scope.querySelectorAll(".duas-prophet-chip");
    prophetChips.forEach(pr => {
      pr.addEventListener("click", () => {
        playClickSfx();
        prophetChips.forEach(x => x.classList.remove("active"));
        pr.classList.add("active");
        activeProphet = pr.getAttribute("data-prophet") || "all";
        // Sync dropdown if exists
        const prophetSelect = scope.querySelector("#duas-prophet-select") || scope.querySelector("#native-duas-prophet-select");
        if (prophetSelect) prophetSelect.value = activeProphet;
        renderList();
      });
    });

    // Prophet dropdown select
    const prophetSelect = scope.querySelector("#duas-prophet-select") || scope.querySelector("#native-duas-prophet-select");
    if (prophetSelect) {
      prophetSelect.addEventListener("change", (e) => {
        playClickSfx();
        activeProphet = e.target.value;
        renderList();
      });
    }

    // View Mode Switchers
    const modeBtns = scope.querySelectorAll(".dua-mode-btn");
    modeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetMode = btn.getAttribute("data-mode");
        if (targetMode) setViewMode(targetMode);
      });
    });

    // Font Scaler Buttons
    const decBtn = scope.querySelector("#dua-font-dec") || scope.querySelector("#native-dua-font-dec");
    if (decBtn) {
      decBtn.addEventListener("click", () => setFontScale(-0.1));
    }
    const incBtn = scope.querySelector("#dua-font-inc") || scope.querySelector("#native-dua-font-inc");
    if (incBtn) {
      incBtn.addEventListener("click", () => setFontScale(0.1));
    }
    const resetBtn = scope.querySelector("#dua-font-reset") || scope.querySelector("#native-dua-font-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => setFontScale(0));
    }

    // Font Switcher (Nastaleeq / Naskh)
    const fontToggles = scope.querySelectorAll(".dua-font-toggle-btn");
    fontToggles.forEach(toggle => {
      toggle.addEventListener("click", () => toggleFontFamily());
    });
  }

  // Audio Playback
  function playDua(serial) {
    playClickSfx();
    const d = duasData.find(x => x.serial === serial);
    if (!d || !d.audio_url) return;

    if (!audioPlayer) {
      audioPlayer = new Audio();
      audioPlayer.addEventListener("ended", () => {
        currentlyPlayingSerial = null;
        updatePlayingCardState();
        updateDockUI(false);
      });
    }

    if (currentlyPlayingSerial === serial && !audioPlayer.paused) {
      audioPlayer.pause();
      currentlyPlayingSerial = null;
      updatePlayingCardState();
      updateDockUI(false);
    } else {
      audioPlayer.src = d.audio_url;
      audioPlayer.play().then(() => {
        currentlyPlayingSerial = serial;
        updatePlayingCardState();
        updateDockUI(true, d);
      }).catch(err => {
        console.warn("[DuasEngine] Audio playback error:", err);
      });
    }
  }

  function updatePlayingCardState() {
    document.querySelectorAll(".dua-card").forEach(c => {
      const ser = parseInt(c.getAttribute("data-serial"), 10);
      const isPlay = ser === currentlyPlayingSerial;
      c.classList.toggle("playing-now", isPlay);
      const playBtn = c.querySelector(".play-btn");
      if (playBtn) {
        playBtn.classList.toggle("playing", isPlay);
        const iconSpan = playBtn.querySelector("span:first-child");
        if (iconSpan) iconSpan.textContent = isPlay ? "⏸️" : "▶";
        const textSpan = playBtn.querySelector(".btn-label-text");
        if (textSpan) textSpan.textContent = isPlay ? "Pause" : "Recite";
      }
    });
  }

  function updateDockUI(isPlaying, duaObj) {
    const dock = document.getElementById("native-duas-dock") || document.getElementById("duas-audio-dock");
    if (!dock) return;

    if (isPlaying && duaObj) {
      dock.classList.add("show");
      const titleEl = dock.querySelector(".dock-dua-title");
      if (titleEl) titleEl.textContent = `[Surah ${duaObj.surah_name_roman} ${duaObj.surah_id}:${duaObj.ayah_coordinate}] ${duaObj.title_ur}`;
      const playBtn = dock.querySelector(".main-play");
      if (playBtn) playBtn.innerHTML = "⏸️";
    } else {
      if (!currentlyPlayingSerial) {
        dock.classList.remove("show");
      }
      const playBtn = dock.querySelector(".main-play");
      if (playBtn) playBtn.innerHTML = "▶";
    }
  }

  function jumpToQuran(surahId, ayahNum) {
    playClickSfx();
    try {
      localStorage.setItem("quran_return_origin", JSON.stringify({
        originTab: "duas",
        originScrollY: window.scrollY,
        label: "Quranic Duas (78)"
      }));
    } catch(e) {}

    // Check if in SPA mode with CorpusEngine / QuranApp available
    if (typeof window.QuranApp !== "undefined" && typeof window.QuranApp.navigateToAyah === "function") {
      window.QuranApp.navigateToAyah(surahId, ayahNum);
      return;
    }

    if (window.CorpusEngine && typeof window.CorpusEngine.loadSurahDirect === "function") {
      // Trigger navigation tab to ayahs
      const tabBtn = document.querySelector('[data-tab="ayahs"]');
      if (tabBtn) tabBtn.click();
      window.CorpusEngine.loadSurahDirect(surahId, ayahNum);
      return;
    }

    // Fallback: Standalone redirection to index.html with parameters
    window.location.href = `index.html?surah=${surahId}&ayah=${ayahNum}&from=duas#ayahs`;
  }

  function copyDua(serial) {
    playClickSfx();
    const d = duasData.find(x => x.serial === serial);
    if (!d) return;

    const text = `🤲 [دعاؤں کا قرآنی انسائیکلوپیڈیا - دعا #${d.serial_ur}]
${d.arabic}

👑 کنز الایمان:
${d.urdu_kanzul_iman}

📖 کنز العرفان:
${d.urdu_kanzul_irfan}

🌐 English:
${d.english}

⏱️ کب پڑھیں؟: ${d.when_to_use_ur}
🎯 مقصد و فضیلت: ${d.purpose_virtue_ur}
📜 شانِ نزول: ${d.reason_for_revelation_ur}

📍 مقام: سورۃ ${d.surah_name_ar} (${d.surah_name_roman}) [آیت ${d.ayah_coordinate}]
Source: Quran Deep Analyzer`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert("✅ دعا متن، تراجم اور شانِ نزول کامیابی کے ساتھ کاپی ہو گئے۔");
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("✅ دعا متن کامیابی سے کاپی ہو گیا۔");
  }

  function shareWhatsApp(serial) {
    playClickSfx();
    const d = duasData.find(x => x.serial === serial);
    if (!d) return;

    const text = `🤲 *دعاؤں کا قرآنی انسائیکلوپیڈیا*
*${d.title_ur}* [سورۃ ${d.surah_name_ar} ${d.surah_id}:${d.ayah_coordinate}]

${d.arabic}

*کنز الایمان:*
${d.urdu_kanzul_iman}

*کنز العرفان:*
${d.urdu_kanzul_irfan}

⏱️ *کب پڑھیں؟:* ${d.when_to_use_ur}
🎯 *مقصد:* ${d.purpose_virtue_ur}
📜 *شانِ نزول:* ${d.reason_for_revelation_ur}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function toggleTafsirSnippet(serial) {
    playClickSfx();
    const snippet = document.getElementById(`tafsir-snippet-${serial}`);
    if (snippet) {
      snippet.classList.toggle("expanded");
    }
  }

  // In-Card Translation Switcher
  function switchCardTranslation(serial, transMode) {
    playClickSfx();
    cardTransState.set(serial, transMode);
    try {
      localStorage.setItem("quran_duas_default_trans", transMode);
      defaultCardTrans = transMode;
    } catch(e) {}

    const card = document.getElementById(`dua-card-${serial}`);
    if (card) {
      card.setAttribute("data-active-trans", transMode);
      const segments = card.querySelectorAll(".dua-segment-btn");
      segments.forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-trans") === transMode);
      });
    }
  }

  // 1-Tap Expandable Drawer
  function toggleContextDrawer(serial) {
    playClickSfx();
    const content = document.getElementById(`dua-drawer-content-${serial}`);
    const trigger = document.getElementById(`dua-drawer-trigger-${serial}`);
    if (content) {
      const isOpen = content.classList.toggle("drawer-open");
      if (trigger) {
        trigger.classList.toggle("open", isOpen);
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    }
  }

  // View Mode Switcher
  function setViewMode(mode) {
    playClickSfx();
    if (mode !== "devotional" && mode !== "study") return;
    viewMode = mode;
    try {
      localStorage.setItem("quran_duas_view_mode", mode);
    } catch(e) {}

    // Update all cards on screen
    document.querySelectorAll(".dua-card").forEach(c => {
      c.classList.remove("mode-devotional", "mode-study");
      c.classList.add(`mode-${mode}`);

      const trigger = c.querySelector(".dua-drawer-trigger");
      const content = c.querySelector(".dua-drawer-content");
      if (mode === "study") {
        if (trigger) {
          trigger.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
        if (content) content.classList.add("drawer-open");
      } else {
        if (trigger) {
          trigger.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        }
        if (content) content.classList.remove("drawer-open");
      }
    });

    applyTypographyAndModeStyles();
  }

  function toggleViewMode() {
    setViewMode(viewMode === "devotional" ? "study" : "devotional");
  }

  // Font Scaler
  function setFontScale(delta) {
    playClickSfx();
    if (delta === 0) {
      fontScale = 1.0;
    } else {
      fontScale = Math.min(1.4, Math.max(0.85, Math.round((fontScale + delta) * 10) / 10));
    }
    try {
      localStorage.setItem("quran_duas_font_scale", fontScale.toString());
    } catch(e) {}
    applyTypographyAndModeStyles();
  }

  // Font Family Switcher
  function toggleFontFamily() {
    playClickSfx();
    fontFamily = (fontFamily === "nastaleeq") ? "naskh" : "nastaleeq";
    try {
      localStorage.setItem("quran_duas_font_family", fontFamily);
    } catch(e) {}
    applyTypographyAndModeStyles();
  }

  return {
    init: function () {
      initData();
      applyTypographyAndModeStyles();
      const scope = document.getElementById("tab-duas") || document;
      bindEvents(scope);
      renderList();
      setupIntersectionObserver();
      initialized = true;
    },

    onTabActivated: function () {
      applyTypographyAndModeStyles();
      if (!initialized) {
        this.init();
      } else {
        renderList();
      }
    },

    playDua: playDua,
    jumpToQuran: jumpToQuran,
    toggleStar: toggleBookmark,
    copyDua: copyDua,
    shareWhatsApp: shareWhatsApp,
    toggleTafsirSnippet: toggleTafsirSnippet,
    switchCardTranslation: switchCardTranslation,
    toggleContextDrawer: toggleContextDrawer,
    setViewMode: setViewMode,
    toggleViewMode: toggleViewMode,
    setFontScale: setFontScale,
    toggleFontFamily: toggleFontFamily,
    getViewMode: () => viewMode,
    getFontScale: () => fontScale,
    getFontFamily: () => fontFamily,
    formatArabicVerse: formatArabicVerse,

    setSearchQuery: function(q) {
      searchQuery = q;
      const searchInput = document.getElementById("native-duas-search") || document.getElementById("duas-search-input");
      if (searchInput) searchInput.value = q;
      renderList();
    }
  };
});
