/**
 * MannersEngine - Quranic Manners & Social Ethics Engine (Adab-e-Qurani)
 * Part of Quran Deep Analyzer Suite
 * Supports Single Page Application (SPA) native tab mounting (#tab-manners) and standalone mode
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const instance = factory();
    module.exports = instance;
    if (root) root.MannersEngine = instance;
  } else {
    root.MannersEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  let initialized = false;
  let data = null;

  const moduleEnTitles = {
    m1: "Speech, Truth & Voice Modality",
    m2: "Walking, Humility & Public Demeanor",
    m3: "Privacy, Entering Homes & Boundaries",
    m4: "Social Harmony, Peace & Anti-Malice",
    m5: "Financial Integrity & Vulnerable Care",
    m6: "Filial Piety, Family & Generational Mercy",
    m7: "Racial Equality, Dignity & Fraternal Justice",
    m8: "Intellectual Rigor, Rumor Resistance & Tabayyun",
    m9: "Forgiveness, Anger Dissolution & Noble Repulsion"
  };

  // State
  let activeModule = "all";
  let activeLang = "both-ur";
  let activeView = "cards";
  let activeSortMode = "default";
  let searchQuery = "";
  const tafsirCache = new Map();

  const CHUNK_SIZE = 15;
  let renderedCount = 0;
  let currentFilteredItems = [];
  let observer = null;

  function initData() {
    data = window.QURAN_MANNERS_DATA;
    if (data && data.modules) {
      data.modules.forEach(m => {
        (m.items || []).forEach(it => {
          it.module_id = m.id;
          it.module_title = m.title_ur;
          it.module_icon = m.icon;
          const words = (it.arabic || "").trim().split(/\s+/).filter(Boolean);
          it.word_count = words.length;
          const rawFirstWord = words[0] || "";
          it.clean_first_word = rawFirstWord.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
        });
      });
    }
    try {
      const savedLang = localStorage.getItem("quran_bidi_lang_order");
      if (savedLang) activeLang = savedLang;
    } catch(e) {}
  }

  function getBookmarks() {
    try {
      const saved = localStorage.getItem("quran_manners_starred");
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  }

  function isBookmarked(serial) {
    return getBookmarks().includes(serial);
  }

  function toggleBookmark(serial) {
    let list = getBookmarks();
    if (list.includes(serial)) {
      list = list.filter(id => id !== serial);
      showToast("Removed from saved manners");
    } else {
      list.push(serial);
      showToast("Saved manner ⭐");
    }
    try {
      localStorage.setItem("quran_manners_starred", JSON.stringify(list));
    } catch(e) {}
    renderList();
  }

  function showToast(msg) {
    const toast = document.getElementById("toast-popup") || document.getElementById("copy-toast") || document.getElementById("native-toast-popup");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 2400);
  }

  function highlightText(text, query) {
    if (!query || !text) return text || "";
    const cleanQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQ})`, "gi");
    return text.replace(regex, `<mark class="cmd-highlight">$1</mark>`);
  }

  function getAllItems() {
    if (!data || !data.modules) return [];
    let all = [];
    data.modules.forEach(m => {
      if (activeModule === "all" || activeModule === m.id) {
        all.push(...(m.items || []));
      }
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      all = all.filter(it => {
        return (
          (it.title_ur && it.title_ur.includes(q)) ||
          (it.arabic && it.arabic.includes(q)) ||
          (it.urdu_kanzul_iman && it.urdu_kanzul_iman.includes(q)) ||
          (it.english && it.english.toLowerCase().includes(q)) ||
          (it.surah_name_roman && it.surah_name_roman.toLowerCase().includes(q)) ||
          (it.reference_badge && it.reference_badge.toLowerCase().includes(q)) ||
          (`${it.surah_id}:${it.ayah_num}`.includes(q))
        );
      });
    }

    if (activeSortMode === "words_asc") {
      all.sort((a, b) => a.word_count - b.word_count || a.global_serial - b.global_serial);
    } else if (activeSortMode === "words_desc") {
      all.sort((a, b) => b.word_count - a.word_count || a.global_serial - b.global_serial);
    } else if (activeSortMode === "alpha") {
      all.sort((a, b) => a.clean_first_word.localeCompare(b.clean_first_word, "ar") || a.global_serial - b.global_serial);
    } else if (activeSortMode === "surah") {
      all.sort((a, b) => (a.surah_id - b.surah_id) || (a.ayah_num - b.ayah_num) || a.global_serial - b.global_serial);
    } else {
      all.sort((a, b) => a.global_serial - b.global_serial);
    }

    return all;
  }

  function formatWhatsApp(it) {
    const arText = window.WaqfEngine ? window.WaqfEngine.appendPlainTextStopSign(it.arabic, it.ayah_num) : it.arabic;
    return `🌿 *Quranic Manners & Social Ethics (#${it.global_serial})* 🌿\n` +
           `🏷️ *${it.title_ur}*\n` +
           `📍 *Surah ${it.surah_name_roman} (${it.surah_name_ar}) [${it.surah_id}:${it.ayah_num}]*\n\n` +
           `📖 *Sacred Arabic:*\n«${arText}»\n\n` +
           `💎 *Kanzul Iman Urdu Translation:*\n${it.urdu_kanzul_iman}\n\n` +
           `🌐 *English Translation:*\n${it.english}\n\n` +
           `✨ *Quran Deep Analyzer*\nhttps://hamidgazi.github.io/app-portal/`;
  }

  function copyCardText(it) {
    const text = formatWhatsApp(it);
    navigator.clipboard.writeText(text).then(() => {
      showToast("Manner copied to clipboard!");
    }).catch(() => {
      showToast("Manner copied to clipboard!");
    });
  }

  async function loadTafsir(surahId, ayahNum, serial, btn) {
    const drawer = document.getElementById(`manner-tafsir-${serial}`);
    const body = document.getElementById(`manner-tafsir-body-${serial}`);
    if (!drawer || !body) return;

    const isVisible = drawer.style.display !== "none";
    if (isVisible) {
      drawer.style.display = "none";
      btn.innerHTML = "<span>📖 Tafsir</span>";
      btn.classList.remove("active");
      return;
    }

    drawer.style.display = "block";
    btn.innerHTML = "<span>✕ Close</span>";
    btn.classList.add("active");

    const cacheKey = `${surahId}:${ayahNum}`;
    if (tafsirCache.has(cacheKey)) {
      body.innerHTML = tafsirCache.get(cacheKey);
      return;
    }

    body.innerHTML = `<div style="color: #94a3b8; font-style: italic;">Fetching Sirat-ul-Jinan commentary...</div>`;
    try {
      const sNum = String(surahId).padStart(3, "0");
      const resp = await fetch(`data/surahs/${sNum}.json`);
      if (!resp.ok) throw new Error("Network error fetching exegesis");
      const sData = await resp.json();
      const verse = (sData.ayat || []).find(a => (a.number === ayahNum || a.ayahNum === ayahNum));
      if (verse && verse.tafseer_sirat_ul_jinan) {
        let cleaned = verse.tafseer_sirat_ul_jinan
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<p[^>]*class="?MsoNormal"?[^>]*>/gi, '<p>')
          .replace(/style="[^"]*"/gi, '')
          .replace(/lang="[^"]*"/gi, '');
        tafsirCache.set(cacheKey, cleaned);
        body.innerHTML = cleaned;
      } else {
        body.innerHTML = `<div style="color: #94a3b8;">Commentary not indexed for this verse.</div>`;
      }
    } catch(err) {
      body.innerHTML = `<div style="color: #fca5a5;">Unable to load commentary: ${err.message || String(err)}</div>`;
    }
  }

  function jumpToAnalyzer(surahId, ayahNum) {
    if (window.NavigationHistory && typeof window.NavigationHistory.pushReturnContext === 'function') {
      window.NavigationHistory.pushReturnContext({
        originTab: 'manners',
        label: `Return to Manners`,
        scrollY: window.scrollY
      });
    }
    if (typeof window.switchAppTab === 'function') {
      window.switchAppTab('ayahs');
    }
    if (window.CorpusEngine && typeof window.CorpusEngine.jumpToAyah === 'function') {
      window.CorpusEngine.jumpToAyah(surahId, ayahNum);
    }
  }

  function buildMannerCardHTML(it, idx) {
    const serialNum = it.global_serial || (idx + 1);
    const bookmarked = isBookmarked(serialNum);
    const starChar = bookmarked ? "★" : "☆";

    const hTitle = highlightText(it.title_ur, searchQuery);
    const hAr = highlightText(it.arabic, searchQuery);
    const hUr = highlightText(it.urdu_kanzul_iman, searchQuery);
    const hEn = it.english ? highlightText(it.english, searchQuery) : "";

    const isBoth = activeLang.startsWith("both");
    const showUrdu = isBoth || activeLang === "ur";
    const showEnglish = (isBoth || activeLang === "en") && !!it.english;
    const isEngFirst = activeLang === "both-en";

    const enModTitle = moduleEnTitles[it.module_id] || it.module_title || "Ethics";
    const formattedAr = window.WaqfEngine ? window.WaqfEngine.formatArabicWithStopSigns(hAr, it.ayah_num) : hAr;

    return `
      <article class="manner-card" id="manner-card-${serialNum}">
        <div class="streamlined-card-header">
          <div class="streamlined-header-left">
            <span class="manner-serial-pill">#${serialNum}</span>
            <span class="command-cat-badge">${it.module_icon || '📖'} ${enModTitle}</span>
            <span class="command-surah-pill">Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</span>
            <span class="manner-words-pill">📏 ${it.word_count}w</span>
          </div>
          <div class="streamlined-header-right">
            <button class="manner-star-btn ${bookmarked ? 'bookmarked' : ''}" data-serial="${serialNum}" title="${bookmarked ? 'Remove bookmark' : 'Save bookmark'}">
              <span>${starChar} ${bookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button class="manner-btn-pill copy-manner-btn" data-idx="${idx}" title="Copy Manner">
              <span>📋</span>
            </button>
            <button class="manner-btn-pill tafsir-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" data-serial="${serialNum}" title="Read Tafsir Sirat-ul-Jinan">
              <span>📖 Tafsir</span>
            </button>
            <button class="manner-btn-pill analyzer-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" title="Open in Deep Ayah Analyzer">
              <span>🔍 ↗</span>
            </button>
            <button class="manner-btn-pill whatsapp-btn" data-idx="${idx}" title="Share on WhatsApp">
              <span>📲</span>
            </button>
          </div>
        </div>

        <div class="streamlined-arabic-box" dir="rtl">«${formattedAr}»</div>

        <div class="manner-content-grid ${!showEnglish ? 'urdu-only-grid' : (!showUrdu ? 'en-only-grid' : '')} ${isEngFirst ? 'mobile-order-en-first' : ''}">
          ${showUrdu ? `
            <div class="manner-pane-ur">
              <div class="manner-title-ur" dir="rtl">${hTitle}</div>
              <div class="manner-urdu-kanzuliman" dir="rtl"><span style="color: #fbbf24; font-size: 0.74rem; font-weight: 700; margin-left: 6px;">(کنز الایمان)</span> ${hUr}</div>
            </div>
          ` : ''}

          ${showEnglish ? `
            <div class="manner-pane-en">
              <div class="manner-title-en" dir="ltr"><span style="color: #38bdf8; font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Saheeh International</span> • ${it.chapter_coordinate || ''}</div>
              <div class="manner-en-translation" dir="ltr">${hEn}</div>
            </div>
          ` : ''}
        </div>

        <div class="manner-tafsir-drawer" id="manner-tafsir-${serialNum}" style="display: none;">
          <div class="manner-tafsir-header">
            <span>📖 Tafsir Sirat-ul-Jinan — Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</span>
            <span class="tafsir-author">Mufti Muhammad Qasim Qadri</span>
          </div>
          <div class="manner-tafsir-body" id="manner-tafsir-body-${serialNum}">
            <div style="color: #94a3b8; font-style: italic;">Loading Tafsir commentary...</div>
          </div>
        </div>
      </article>
    `;
  }

  function buildMannerCompactRowHTML(it, idx) {
    const serialNum = it.global_serial || (idx + 1);
    const bookmarked = isBookmarked(serialNum);
    const starChar = bookmarked ? "★" : "☆";
    const hTitle = highlightText(it.title_ur, searchQuery);

    return `
      <div class="compact-manner-row" id="compact-row-${serialNum}">
        <div class="compact-left-meta">
          <button class="manner-star-btn ${bookmarked ? 'bookmarked' : ''}" data-serial="${serialNum}" style="font-size: 1.05rem; padding: 0 4px;">${starChar}</button>
          <span class="compact-serial">#${serialNum}</span>
          <span class="manner-ref-badge" style="font-size: 0.75rem; padding: 1px 6px;">${it.reference_badge}</span>
          <span class="compact-title">${it.module_icon || '📖'} ${hTitle}</span>
          <span class="compact-subtext">${it.urdu_kanzul_iman.substring(0, 75)}...</span>
        </div>
        <div class="compact-actions">
          <button class="compact-micro-btn analyzer-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" style="color: #34d399;" title="Open in Deep Ayah Analyzer">
            <span>🔍 ↗</span>
          </button>
          <button class="compact-micro-btn whatsapp-btn" data-idx="${idx}" title="Share on WhatsApp">
            <span>📲</span>
          </button>
          <button class="compact-micro-btn copy-manner-btn" data-idx="${idx}" title="Copy Verse">
            <span>📋</span>
          </button>
        </div>
      </div>
    `;
  }

  function getContainer() {
    return document.getElementById("native-manners-list") || document.getElementById("manners-list");
  }

  function getSentinel() {
    return document.getElementById("native-manners-sentinel") || document.getElementById("manners-scroll-sentinel");
  }

  function renderNextChunk() {
    if (renderedCount >= currentFilteredItems.length) return;
    const slice = currentFilteredItems.slice(renderedCount, renderedCount + CHUNK_SIZE);
    const isCards = activeView === "cards";
    const container = getContainer();
    if (!container) return;

    let chunkHtml = slice.map((it, i) => isCards ? buildMannerCardHTML(it, renderedCount + i) : buildMannerCompactRowHTML(it, renderedCount + i)).join("");

    if (renderedCount === 0) {
      if (!isCards) {
        chunkHtml = `<div class="compact-checklist-container">${chunkHtml}</div>`;
      }
      const sentinel = getSentinel();
      if (sentinel) {
        container.innerHTML = chunkHtml;
        container.appendChild(sentinel);
        sentinel.style.display = "block";
      } else {
        container.innerHTML = chunkHtml + `<div id="native-manners-sentinel" class="scroll-sentinel" style="height: 40px; width: 100%;"></div>`;
      }
      setupObserver();
    } else {
      const sentinel = getSentinel();
      if (!isCards) {
        const wrap = container.querySelector(".compact-checklist-container");
        if (wrap) wrap.insertAdjacentHTML("beforeend", chunkHtml);
      } else {
        if (sentinel) {
          sentinel.insertAdjacentHTML("beforebegin", chunkHtml);
        } else {
          container.insertAdjacentHTML("beforeend", chunkHtml);
        }
      }
    }

    renderedCount += slice.length;
    if (renderedCount >= currentFilteredItems.length) {
      if (observer) observer.disconnect();
      const sentinel = getSentinel();
      if (sentinel) sentinel.style.display = "none";
    }
  }

  function ensureRenderedUpToIndex(idx) {
    while (renderedCount <= idx && renderedCount < currentFilteredItems.length) {
      renderNextChunk();
    }
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    const sentinel = getSentinel();
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderNextChunk();
        }
      });
    }, { rootMargin: "300px" });

    observer.observe(sentinel);
  }

  function setupDelegation(container) {
    if (!container || container._hasMannersDelegation) return;
    container._hasMannersDelegation = true;

    container.addEventListener("click", (e) => {
      // 1. Star / Bookmark
      const starBtn = e.target.closest(".manner-star-btn");
      if (starBtn) {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playClick();
        const sNum = parseInt(starBtn.dataset.serial, 10);
        toggleBookmark(sNum);
        return;
      }

      // 2. Tafsir
      const tafsirBtn = e.target.closest(".tafsir-btn");
      if (tafsirBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const sId = parseInt(tafsirBtn.dataset.surah, 10);
        const aNum = parseInt(tafsirBtn.dataset.ayah, 10);
        const sNum = parseInt(tafsirBtn.dataset.serial, 10);
        loadTafsir(sId, aNum, sNum, tafsirBtn);
        return;
      }

      // 3. Analyzer Jump
      const analyzerBtn = e.target.closest(".analyzer-btn");
      if (analyzerBtn) {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(analyzerBtn.dataset.surah, 10);
        const aNum = parseInt(analyzerBtn.dataset.ayah, 10);
        jumpToAnalyzer(sId, aNum);
        return;
      }

      // 4. WhatsApp
      const waBtn = e.target.closest(".whatsapp-btn");
      if (waBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const itemIdx = parseInt(waBtn.dataset.idx, 10);
        const targetItem = currentFilteredItems[itemIdx];
        if (targetItem) {
          const text = formatWhatsApp(targetItem);
          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
          window.open(waUrl, "_blank");
        }
        return;
      }

      // 5. Copy
      const copyBtn = e.target.closest(".copy-manner-btn");
      if (copyBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const itemIdx = parseInt(copyBtn.dataset.idx, 10);
        const targetItem = currentFilteredItems[itemIdx];
        if (targetItem) copyCardText(targetItem);
        return;
      }
    });
  }

  function renderList() {
    initData();
    currentFilteredItems = getAllItems();
    const container = getContainer();
    const countBadge = document.getElementById("manners-count-badge") || document.getElementById("native-manners-count-badge");
    const sentinel = getSentinel();

    if (countBadge) countBadge.textContent = `${currentFilteredItems.length} Manners`;
    if (!container) return;

    container.innerHTML = "";
    renderedCount = 0;

    if (sentinel) {
      container.appendChild(sentinel);
      sentinel.style.display = "block";
    }

    if (currentFilteredItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-dim); background: var(--bg-card-glass); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <div style="font-size: 1.15rem; font-weight: 700; color: #fbbf24;">No manners found</div>
          <p style="margin-top: 6px; font-size: 0.9rem;">Please try a different search query or select another category.</p>
        </div>
      `;
      return;
    }

    renderNextChunk();
    setupObserver();
    setupDelegation(container);

    // Initialize or Update Universal Edge QuickScrubber
    if (window.QuickScrubber) {
      window.QuickScrubber.init({
        containerId: container.id,
        itemSelector: ".manner-card, .compact-manner-row",
        totalItems: currentFilteredItems.length,
        unitName: "manners",
        modalTitle: "Jump to Quranic Manner",
        getItemLabel: (idx) => {
          const it = currentFilteredItems[idx - 1];
          return {
            title: `Manner #${it ? it.global_serial : idx}`,
            subtitle: it ? it.title_ur : ""
          };
        },
        onJump: (targetIdx) => {
          ensureRenderedUpToIndex(targetIdx - 1);
          const it = currentFilteredItems[targetIdx - 1];
          if (!it) return;
          const card = document.getElementById(`manner-card-${it.global_serial}`) || document.getElementById(`compact-row-${it.global_serial}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            card.style.borderColor = "#fbbf24";
            card.style.boxShadow = "0 0 20px rgba(251, 191, 36, 0.4)";
            setTimeout(() => {
              card.style.borderColor = "";
              card.style.boxShadow = "";
            }, 2000);
          }
        }
      });
    }
  }

  function bindToolbarEvents(scope) {
    const rootEl = scope || document;

    // Search Input
    const searchInput = rootEl.querySelector("#manners-search") || rootEl.querySelector("#native-manners-search");
    const searchClear = rootEl.querySelector("#manners-search-clear") || rootEl.querySelector("#native-manners-search-clear");
    if (searchInput && !searchInput._bound) {
      searchInput._bound = true;
      let timer = null;
      searchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        if (searchClear) searchClear.style.display = val ? "block" : "none";
        clearTimeout(timer);
        timer = setTimeout(() => {
          searchQuery = val;
          renderList();
        }, 120);
      });
      if (searchClear) {
        searchClear.addEventListener("click", () => {
          searchInput.value = "";
          searchClear.style.display = "none";
          searchQuery = "";
          renderList();
        });
      }
    }

    // Display Modal Trigger and Close
    const displayBtn = rootEl.querySelector("#manners-display-btn") || rootEl.querySelector("#native-manners-display-btn");
    const displayModal = rootEl.querySelector("#manners-display-modal");
    const modalClose = rootEl.querySelector("#manners-modal-close");

    function updateConfigPreview() {
      const preview = rootEl.querySelector("#native-manners-config-preview") || rootEl.querySelector("#manners-config-preview");
      if (preview) {
        const viewLabel = activeView === "compact" ? "Checklist" : "Cards";
        const langLabel = activeLang === "ur" ? "Urdu" : (activeLang === "en" ? "English" : "Bilingual");
        preview.textContent = `${viewLabel} • ${langLabel}`;
      }
    }

    if (displayBtn && displayModal && !displayBtn._bound) {
      displayBtn._bound = true;
      displayBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        displayModal.classList.add("open");
      });
      if (modalClose) {
        modalClose.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          displayModal.classList.remove("open");
        });
      }
      displayModal.addEventListener("click", (e) => {
        if (e.target === displayModal) {
          displayModal.classList.remove("open");
        }
      });
    }

    // Sort Select
    const sortSelect = rootEl.querySelector("#manners-sort-select") || rootEl.querySelector("#native-manners-sort-select");
    if (sortSelect && !sortSelect._bound) {
      sortSelect._bound = true;
      sortSelect.addEventListener("change", (e) => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        activeSortMode = e.target.value;
        updateConfigPreview();
        renderList();
      });
    }

    // View Mode Filters
    rootEl.querySelectorAll(".segmented-pill-group[id*='view-mode'] .segment-btn").forEach(btn => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        btn.parentElement.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeView = btn.dataset.view;
        updateConfigPreview();
        renderList();
      });
    });

    // Language Filters
    rootEl.querySelectorAll(".segmented-pill-group[id*='lang-filters'] .segment-btn").forEach(btn => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        btn.parentElement.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLang = btn.dataset.lang;
        try { localStorage.setItem("quran_bidi_lang_order", activeLang); } catch(e) {}
        updateConfigPreview();
        renderList();
      });
    });

    // Module Nav Pills
    rootEl.querySelectorAll(".modules-nav .module-pill, .module-filter-chip").forEach(btn => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeModule = btn.dataset.module;
        renderList();
      });
    });
  }

  return {
    init: function () {
      initData();
      const scope = document.getElementById("tab-manners") || document;
      bindToolbarEvents(scope);
      renderList();
      initialized = true;
    },

    onTabActivated: function () {
      if (!initialized) {
        this.init();
      } else {
        renderList();
      }
      if (window.QuickScrubber) {
        window.QuickScrubber.show();
      }
    },

    toggleBookmark: toggleBookmark,
    jumpToAnalyzer: jumpToAnalyzer,
    formatWhatsApp: formatWhatsApp
  };
});
