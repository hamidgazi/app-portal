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
  let activeLang = "both-ur"; // 'both-ur', 'iman', 'irfan', 'all-three'

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
        btn.innerHTML = starred ? `<span>⭐ Starred</span>` : `<span>☆ Star</span>`;
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
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // Diacritics
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

  function buildDuaCardHtml(d) {
    const isStarred = isBookmarked(d.serial);
    const isPlaying = currentlyPlayingSerial === d.serial;

    // Type badge format
    let typeBadgeLabel = "قرآنی دعا";
    if (d.type === "40_rabbana") typeBadgeLabel = "۴۰ ربنا دعا";
    else if (d.type === "rabbi") typeBadgeLabel = "ربِّ ندا";
    else if (d.type === "prophet") typeBadgeLabel = "دعائے انبیاء";
    else if (d.type === "believer") typeBadgeLabel = "دعائے مؤمنین";

    return `
      <article class="dua-card ${isPlaying ? 'playing-now' : ''}" id="dua-card-${d.serial}" data-serial="${d.serial}">
        <header class="dua-card-header">
          <div class="dua-meta-left">
            <span class="dua-serial-pill">#${d.serial_ur} (${d.serial})</span>
            <span class="dua-coord-pill">[سورۃ ${d.surah_name_ar} ${d.surah_id}:${d.ayah_coordinate}]</span>
            <span class="dua-surah-title">${escapeHtml(d.surah_name_roman)}</span>
            <span class="dua-type-tag">${typeBadgeLabel}</span>
            <span class="dua-speaker-tag">${escapeHtml(d.speaker_ur)}</span>
          </div>

          <div class="dua-micro-actions">
            <button class="dua-micro-btn play-btn" onclick="DuasEngine.playDua(${d.serial})" title="Listen to Mishary Alafasy Recitation">
              <span>${isPlaying ? '⏸️ Pause' : '▶ Recite'}</span>
            </button>
            <button class="dua-micro-btn analyzer-btn" onclick="DuasEngine.jumpToQuran(${d.surah_id}, ${d.ayah_start})" title="Open in Quran Deep Ayah Analyzer">
              <span>🔍 Open in Quran ↗</span>
            </button>
            <button class="dua-micro-btn star-btn ${isStarred ? 'starred' : ''}" data-serial="${d.serial}" onclick="DuasEngine.toggleStar(${d.serial})" title="Bookmark Dua">
              <span>${isStarred ? '⭐ Starred' : '☆ Star'}</span>
            </button>
            <button class="dua-micro-btn copy-btn" onclick="DuasEngine.copyDua(${d.serial})" title="Copy Full Dua with Exegesis">
              <span>📋 Copy</span>
            </button>
            <button class="dua-micro-btn whatsapp-btn" onclick="DuasEngine.shareWhatsApp(${d.serial})" title="Share on WhatsApp">
              <span>💬 WhatsApp</span>
            </button>
          </div>
        </header>

        <!-- Tier 1: Scriptural Core -->
        <div class="dua-arabic" dir="rtl">
          ${escapeHtml(d.arabic)} <span class="dua-ayah-num">${d.ayah_coordinate}</span>
        </div>

        <!-- High-Density Dual Translation: Kanzul Iman on Right, Kanzul Irfan on Left -->
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

        <div class="dua-english" dir="ltr">
          ${escapeHtml(d.english)}
        </div>

        <!-- 3-Tier Structured Context Box -->
        <div class="dua-context-box">
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
              <div class="dua-tier-title-ur"><strong>کس مقصد کے لیے؟ (Spiritual Virtues & Benefits):</strong> ${escapeHtml(d.purpose_virtue_ur)}</div>
              <div class="dua-tier-title-en">${escapeHtml(d.purpose_virtue_en)}</div>
            </div>
          </div>

          <!-- Tier 4: Quranic Context & Reason for Revelation -->
          <div class="dua-tier-item revelation">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
              <div class="dua-tier-icon">📜</div>
              <div class="dua-tier-content">
                <div class="dua-tier-title-ur"><strong>شانِ نزول و قرآنی پس منظر:</strong> ${escapeHtml(d.reason_for_revelation_ur)}</div>
                <div class="dua-tier-title-en">${escapeHtml(d.reason_for_revelation_en)}</div>
              </div>
            </div>

            <!-- Exegesis Snippet from Sirat-ul-Jinan -->
            ${d.tafsir_snippet_ur ? `
              <div class="dua-tafsir-snippet" id="tafsir-snippet-${d.serial}">
                <strong>تفسیر صراط الجنان کا خلاصہ:</strong> ${escapeHtml(d.tafsir_snippet_ur)}
              </div>
              <button class="dua-tafsir-toggle-btn" onclick="DuasEngine.toggleTafsirSnippet(${d.serial})">
                [ 📖 مکمل تفسیر صراط الجنان دیکھیں / سمیٹیں ]
              </button>
            ` : ''}
          </div>
        </div>
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

    // Category chips
    const catChips = scope.querySelectorAll(".duas-cat-chip");
    catChips.forEach(c => {
      c.addEventListener("click", () => {
        playClickSfx();
        catChips.forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        activeCategory = c.getAttribute("data-cat") || "all";
        renderList();
      });
    });

    // Prophet chips
    const prophetChips = scope.querySelectorAll(".duas-prophet-chip");
    prophetChips.forEach(pr => {
      pr.addEventListener("click", () => {
        playClickSfx();
        prophetChips.forEach(x => x.classList.remove("active"));
        pr.classList.add("active");
        activeProphet = pr.getAttribute("data-prophet") || "all";
        renderList();
      });
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
      const playBtn = c.querySelector(".play-btn span");
      if (playBtn) playBtn.textContent = isPlay ? "⏸️ Pause" : "▶ Recite";
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

  return {
    init: function () {
      initData();
      const scope = document.getElementById("tab-duas") || document;
      bindEvents(scope);
      renderList();
      setupIntersectionObserver();
      initialized = true;
    },

    onTabActivated: function () {
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
    setSearchQuery: function(q) {
      searchQuery = q;
      const searchInput = document.getElementById("native-duas-search") || document.getElementById("duas-search-input");
      if (searchInput) searchInput.value = q;
      renderList();
    }
  };
});
