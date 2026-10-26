/**
 * CommandsEngine - Quranic Divine Commands & Injunctions Engine (Ahkam-e-Ilahi)
 * Part of Quran Deep Analyzer Suite
 * Supports Single Page Application (SPA) native tab mounting (#tab-commands) and standalone mode
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    const instance = factory();
    module.exports = instance;
    if (root) root.CommandsEngine = instance;
  } else {
    root.CommandsEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this), function () {
  'use strict';

  let initialized = false;
  let data = null;

  const categoryMap = {
    health: { name_en: "Health & Hygiene", icon: "🥗" },
    speech: { name_en: "Speech & Truth", icon: "🗣️" },
    compassion: { name_en: "Charity & Feeding", icon: "🍲" },
    social_peace: { name_en: "Social Harmony", icon: "🤝" },
    mental_peace: { name_en: "Mental Peace & Sabr", icon: "🧠" },
    finance: { name_en: "Financial Ethics", icon: "⚖️" },
    family: { name_en: "Parents & Family", icon: "👨‍👩‍👧" },
    justice: { name_en: "Justice & Humility", icon: "🏛️" }
  };

  // State
  let activePolarity = "all";
  let activeCategory = "all";
  let activeLang = "both-ur";
  let activeView = "cards";
  let activeSortMode = "default";
  let searchQuery = "";
  const tafsirCache = new Map();

  const CHUNK_SIZE = 12;
  let renderedCount = 0;
  let currentFilteredItems = [];
  let observer = null;

  // Audio state
  let audioPlayer = null;
  let currentlyPlayingIndex = -1;

  function initData() {
    data = window.QURAN_COMMANDS_DATA;
    if (data && data.items) {
      data.items.forEach(it => {
        const words = (it.arabic || "").trim().split(/\s+/).filter(Boolean);
        it.word_count = words.length;
        const rawFirstWord = words[0] || "";
        it.clean_first_word = rawFirstWord.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
      });
    }
    try {
      const savedLang = localStorage.getItem("quran_bidi_lang_order");
      if (savedLang) activeLang = savedLang;
    } catch(e) {}
  }

  function getBookmarks() {
    try {
      const saved = localStorage.getItem("quran_commands_starred");
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
    let list = getBookmarks();
    if (list.includes(serial)) {
      list = list.filter(id => id !== serial);
      showToast("Removed from saved directives");
    } else {
      list.push(serial);
      showToast("Saved to directives ⭐");
    }
    try {
      localStorage.setItem("quran_commands_starred", JSON.stringify(list));
    } catch(e) {}
    renderList();
  }

  function showToast(msg) {
    const toast = document.getElementById("toast-popup") || document.getElementById("native-toast-popup");
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

  function computeFilteredItems() {
    if (!data || !data.items) return [];
    let items = [...data.items];

    if (activePolarity !== "all") {
      if (activePolarity === "starred") {
        const starred = getBookmarks();
        items = items.filter(it => starred.includes(it.serial));
      } else {
        items = items.filter(it => it.polarity === activePolarity);
      }
    }

    if (activeCategory !== "all") {
      items = items.filter(it => it.category_id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(it => {
        return (
          (it.title_en && it.title_en.toLowerCase().includes(q)) ||
          (it.title_ur && it.title_ur.includes(q)) ||
          (it.arabic && it.arabic.includes(q)) ||
          (it.translation_english && it.translation_english.toLowerCase().includes(q)) ||
          (it.translation_urdu_kanzul_iman && it.translation_urdu_kanzul_iman.includes(q)) ||
          (it.wisdom_benefit_en && it.wisdom_benefit_en.toLowerCase().includes(q)) ||
          (it.wisdom_benefit_ur && it.wisdom_benefit_ur.includes(q)) ||
          (it.chapter_coordinate && it.chapter_coordinate.includes(q)) ||
          (`${it.surah_id}:${it.ayah_num}`.includes(q))
        );
      });
    }

    if (activeSortMode === "words_asc") {
      items.sort((a, b) => a.word_count - b.word_count || a.serial - b.serial);
    } else if (activeSortMode === "words_desc") {
      items.sort((a, b) => b.word_count - a.word_count || a.serial - b.serial);
    } else if (activeSortMode === "alpha") {
      items.sort((a, b) => a.clean_first_word.localeCompare(b.clean_first_word, "ar") || a.serial - b.serial);
    } else if (activeSortMode === "surah") {
      items.sort((a, b) => (a.surah_id - b.surah_id) || (a.ayah_num - b.ayah_num) || a.serial - b.serial);
    } else {
      items.sort((a, b) => a.serial - b.serial);
    }

    return items;
  }

  function getReciterFolder() {
    const reciterSelect = document.getElementById("audio-reciter-select") || document.getElementById("native-audio-reciter-select");
    return reciterSelect ? reciterSelect.value : "Alafasy_128kbps";
  }

  function getAudioUrl(surahId, ayahNum) {
    const sStr = String(surahId).padStart(3, "0");
    const aStr = String(ayahNum).padStart(3, "0");
    return `https://everyayah.com/data/${getReciterFolder()}/${sStr}${aStr}.mp3`;
  }

  function playAyahByIndex(idx) {
    if (idx < 0 || idx >= currentFilteredItems.length) return;
    const it = currentFilteredItems[idx];
    currentlyPlayingIndex = idx;
    const url = getAudioUrl(it.surah_id, it.ayah_num);

    const miniDock = document.getElementById("audio-mini-dock") || document.getElementById("native-commands-mini-dock");
    const miniDockTitle = document.getElementById("mini-dock-title") || document.getElementById("native-mini-dock-title");
    const miniDockSub = document.getElementById("mini-dock-sub") || document.getElementById("native-mini-dock-sub");
    const miniDockPlayBtn = document.getElementById("mini-dock-play-btn") || document.getElementById("native-mini-dock-play-btn");
    const miniDockAutoplay = document.getElementById("mini-dock-autoplay") || document.getElementById("native-mini-dock-autoplay");

    if (miniDockTitle) miniDockTitle.textContent = `#${it.serial} • ${it.title_en}`;
    if (miniDockSub) miniDockSub.textContent = `Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]`;
    if (miniDock) miniDock.classList.add("show");
    if (miniDockPlayBtn) miniDockPlayBtn.innerHTML = "⏸";

    if (!audioPlayer) {
      audioPlayer = document.getElementById("quran-audio-player") || document.getElementById("native-commands-audio-player") || new Audio();
    }

    document.querySelectorAll(".command-card").forEach(c => c.classList.remove("playing-now"));
    const cardElem = document.getElementById(`card-${it.serial}`);
    if (cardElem) cardElem.classList.add("playing-now");

    audioPlayer.src = url;
    audioPlayer.play().then(() => {
      updatePlayButtons(true, it.serial);
    }).catch(err => {
      console.warn("Audio play error:", err);
      showToast("Audio unavailable for this verse");
      if (miniDockPlayBtn) miniDockPlayBtn.innerHTML = "▶";
      updatePlayButtons(false, it.serial);
    });

    audioPlayer.onended = () => {
      updatePlayButtons(false, it.serial);
      if (miniDockPlayBtn) miniDockPlayBtn.innerHTML = "▶";
      if (cardElem) cardElem.classList.remove("playing-now");

      if (miniDockAutoplay && miniDockAutoplay.checked) {
        const nextIdx = currentlyPlayingIndex + 1;
        if (nextIdx < currentFilteredItems.length) {
          playAyahByIndex(nextIdx);
        }
      }
    };
  }

  function updatePlayButtons(isPlaying, activeSerial) {
    document.querySelectorAll(".card-action-btn.play-btn").forEach(btn => {
      const serial = parseInt(btn.dataset.serial, 10);
      if (serial === activeSerial && isPlaying) {
        btn.innerHTML = '<span>⏸ Pause</span>';
        btn.style.background = '#10b981';
        btn.style.color = '#022c22';
      } else {
        btn.innerHTML = activeView === 'checklist' ? '▶' : '<span>▶ Recite</span>';
        btn.style.background = '';
        btn.style.color = '';
      }
    });
  }

  function toggleAudioPlayback() {
    const miniDockPlayBtn = document.getElementById("mini-dock-play-btn") || document.getElementById("native-mini-dock-play-btn");
    if (!audioPlayer || !audioPlayer.src) {
      if (currentFilteredItems.length > 0) playAyahByIndex(0);
      return;
    }
    if (audioPlayer.paused) {
      audioPlayer.play().then(() => {
        if (miniDockPlayBtn) miniDockPlayBtn.innerHTML = "⏸";
        if (currentlyPlayingIndex >= 0) {
          const it = currentFilteredItems[currentlyPlayingIndex];
          if (it) updatePlayButtons(true, it.serial);
        }
      });
    } else {
      audioPlayer.pause();
      if (miniDockPlayBtn) miniDockPlayBtn.innerHTML = "▶";
      if (currentlyPlayingIndex >= 0) {
        const it = currentFilteredItems[currentlyPlayingIndex];
        if (it) updatePlayButtons(false, it.serial);
      }
    }
  }

  function formatWhatsApp(it) {
    const arText = window.WaqfEngine ? window.WaqfEngine.appendPlainTextStopSign(it.arabic, it.ayah_num) : it.arabic;
    const pBadge = it.polarity === "command" ? "✅ COMMAND (DO THIS)" : "🚫 PROHIBITION (AVOID THIS)";
    return `📜 *Divine Commands & Injunctions (#${it.serial})* 📜\n` +
           `🏷️ *${it.title_en}* [${pBadge}]\n` +
           `📌 *${it.title_ur}*\n` +
           `📍 *Surah ${it.surah_name_roman} (${it.surah_name_ar}) [${it.surah_id}:${it.ayah_num}]*\n\n` +
           `📖 *Sacred Arabic:*\n«${arText}»\n\n` +
           `💎 *Kanzul Iman Urdu Translation (Imam Ahmad Raza Khan):*\n${it.translation_urdu_kanzul_iman}\n\n` +
           `🌐 *English Translation (Saheeh International):*\n${it.translation_english}\n\n` +
           `💡 *Human Flourishing & Health Wisdom:*\n${it.wisdom_benefit_en}\n\n` +
           `✨ *Quran Deep Analyzer*\nhttps://hamidgazi.github.io/app-portal/`;
  }

  function copyCardText(it) {
    const text = formatWhatsApp(it);
    navigator.clipboard.writeText(text).then(() => {
      showToast("Directive copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy");
    });
  }

  async function loadTafsir(surahId, ayahNum, serial, btn) {
    const drawer = document.getElementById(`tafsir-drawer-${serial}`);
    const body = document.getElementById(`tafsir-body-${serial}`);
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
        originTab: 'commands',
        label: `Return to Commands`,
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

  function buildCardHTML(it, idx) {
    const isCommand = it.polarity === "command";
    const polarityBadge = isCommand
      ? `<span class="command-polarity-badge command">✅ COMMAND (DO THIS)</span>`
      : `<span class="command-polarity-badge prohibition">🚫 PROHIBITION (AVOID THIS)</span>`;

    const isStarred = isBookmarked(it.serial);
    const starBtnHtml = `
      <button class="card-action-btn star-btn ${isStarred ? 'bookmarked' : ''}" data-serial="${it.serial}" title="${isStarred ? 'Remove from Saved' : 'Save Directive'}">
        <span>${isStarred ? '★' : '☆'}</span>
      </button>
    `;

    const hTitleEn = highlightText(it.title_en, searchQuery);
    const hTitleUr = highlightText(it.title_ur, searchQuery);
    const hAr = highlightText(it.arabic, searchQuery);
    const hUr = highlightText(it.translation_urdu_kanzul_iman, searchQuery);
    const hEn = highlightText(it.translation_english, searchQuery);
    const hWisdomEn = highlightText(it.wisdom_benefit_en, searchQuery);
    const hWisdomUr = highlightText(it.wisdom_benefit_ur, searchQuery);

    const isBoth = activeLang.startsWith("both");
    const showUrdu = isBoth || activeLang === "ur";
    const showEnglish = isBoth || activeLang === "en";
    const isEngFirst = activeLang === "both-en";

    const formattedAr = window.WaqfEngine ? window.WaqfEngine.formatArabicWithStopSigns(hAr, it.ayah_num) : hAr;

    if (activeView === "cards") {
      return `
        <article class="command-card ${isCommand ? 'command-type' : 'prohibition-type'}" id="card-${it.serial}">
          <div class="command-card-header">
            <div class="command-headline">
              <span class="command-serial-pill">#${it.serial}</span>
              ${polarityBadge}
              <span class="command-sphere-tag">${categoryMap[it.category_id]?.icon || '📜'} ${it.category_name_en}</span>
              <span class="command-words-tag">📏 ${it.word_count} Words</span>
            </div>
            <div class="command-header-actions">
              ${starBtnHtml}
              <div class="command-ref-badge">Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</div>
            </div>
          </div>

          <div class="command-arabic-text" dir="rtl">«${formattedAr}»</div>

          <div class="command-content-grid ${!showEnglish ? 'urdu-only-grid' : (!showUrdu ? 'en-only-grid' : '')} ${isEngFirst ? 'mobile-order-en-first' : ''}">
            ${showUrdu ? `
              <div class="command-pane-ur">
                <div class="command-title-ur" dir="rtl">${hTitleUr}</div>
                <div class="command-translation-ur" dir="rtl"><span class="ki-gold">(کنز الایمان)</span> ${hUr}</div>
              </div>
            ` : ''}

            ${showEnglish ? `
              <div class="command-pane-en">
                <div class="command-title-en" dir="ltr">${hTitleEn}</div>
                <div class="command-translation-en" dir="ltr">${hEn}</div>
              </div>
            ` : ''}
          </div>

          <div class="command-wisdom-drawer" id="wisdom-drawer-${it.serial}" style="display: none;">
            <div class="wisdom-title">💡 Human Flourishing & Health Rationale:</div>
            <div class="wisdom-en">${hWisdomEn}</div>
            <div class="wisdom-ur" dir="rtl">${hWisdomUr}</div>
          </div>

          <div class="command-card-footer">
            <div class="card-actions-left">
              <button class="card-action-btn play-btn" data-serial="${it.serial}" data-idx="${idx}" title="Listen to Tartil Recitation">
                <span>▶ Recite</span>
              </button>
              <button class="card-action-btn wisdom-toggle-btn" data-serial="${it.serial}" title="View Human Flourishing & Health Wisdom">
                <span>💡 Wisdom</span>
              </button>
              <button class="card-action-btn tafsir-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" data-serial="${it.serial}" title="Read Tafsir Sirat-ul-Jinan">
                <span>📖 Tafsir</span>
              </button>
              <button class="card-action-btn analyzer-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" title="Open in Deep Ayah Analyzer">
                <span>🔍 Deep Analyzer ↗</span>
              </button>
              <button class="card-action-btn whatsapp-btn" data-idx="${idx}" title="Share on WhatsApp">
                <span>📲 WhatsApp</span>
              </button>
              <button class="card-action-btn copy-btn" data-idx="${idx}" title="Copy Directive">
                <span>📋 Copy</span>
              </button>
            </div>
            <span class="card-footer-coord">Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</span>
          </div>

          <div class="command-tafsir-drawer" id="tafsir-drawer-${it.serial}" style="display: none;">
            <div class="tafsir-header-title">📖 Tafsir Sirat-ul-Jinan — Surah ${it.surah_name_roman} Ayah ${it.ayah_num}</div>
            <div class="tafsir-content-body" id="tafsir-body-${it.serial}"></div>
          </div>
        </article>
      `;
    } else if (activeView === "collapsible") {
      return `
        <article class="command-card collapsible-mode" id="card-${it.serial}">
          <div class="command-card-header">
            <div class="command-headline">
              <span class="command-serial-pill">#${it.serial}</span>
              ${polarityBadge}
              <span class="command-sphere-tag">${categoryMap[it.category_id]?.icon || '📜'} ${it.category_name_en}</span>
              <span class="command-words-tag">📏 ${it.word_count} Words</span>
            </div>
            <div class="command-header-actions">
              ${starBtnHtml}
              <div class="command-ref-badge">Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</div>
            </div>
          </div>

          <div class="command-content-grid ${!showEnglish ? 'urdu-only-grid' : (!showUrdu ? 'en-only-grid' : '')} ${isEngFirst ? 'mobile-order-en-first' : ''}">
            ${showUrdu ? `<div class="command-pane-ur"><div class="command-title-ur" dir="rtl">${hTitleUr}</div></div>` : ''}
            ${showEnglish ? `<div class="command-pane-en"><div class="command-title-en" dir="ltr">${hTitleEn}</div></div>` : ''}
          </div>

          <div class="command-collapsible-body" id="col-body-${it.serial}">
            <div class="command-arabic-text" dir="rtl">«${formattedAr}»</div>
            <div class="command-content-grid ${!showEnglish ? 'urdu-only-grid' : (!showUrdu ? 'en-only-grid' : '')} ${isEngFirst ? 'mobile-order-en-first' : ''}">
              ${showUrdu ? `<div class="command-pane-ur"><div class="command-translation-ur" dir="rtl">${hUr}</div></div>` : ''}
              ${showEnglish ? `<div class="command-pane-en"><div class="command-translation-en" dir="ltr">${hEn}</div></div>` : ''}
            </div>
            <div class="command-card-footer">
              <div class="card-actions-left">
                <button class="card-action-btn play-btn" data-serial="${it.serial}" data-idx="${idx}" title="Listen to Tartil Recitation"><span>▶ Recite</span></button>
                <button class="card-action-btn wisdom-toggle-btn" data-serial="${it.serial}"><span>💡 Wisdom</span></button>
                <button class="card-action-btn tafsir-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" data-serial="${it.serial}"><span>📖 Tafsir</span></button>
                <button class="card-action-btn analyzer-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}"><span>🔍 Deep Analyzer ↗</span></button>
              </div>
            </div>
            <div class="command-tafsir-drawer" id="tafsir-drawer-${it.serial}" style="display: none;">
              <div class="tafsir-header-title">📖 Tafsir Sirat-ul-Jinan — Surah ${it.surah_name_roman} Ayah ${it.ayah_num}</div>
              <div class="tafsir-content-body" id="tafsir-body-${it.serial}"></div>
            </div>
          </div>
        </article>
      `;
    } else {
      return `
        <div class="checklist-row" id="check-${it.serial}">
          <div class="checklist-left">
            <span class="checklist-serial">#${it.serial}</span>
            <span class="checklist-polarity-icon">${isCommand ? '✅' : '🚫'}</span>
            <span class="checklist-title" style="direction: ltr; text-align: left;">${hTitleEn}</span>
            <span class="checklist-ref">Surah ${it.surah_name_roman} [${it.surah_id}:${it.ayah_num}]</span>
          </div>
          <div class="checklist-actions">
            <button class="card-action-btn play-btn" data-serial="${it.serial}" data-idx="${idx}" title="Listen to Tartil">▶</button>
            <button class="card-action-btn star-btn ${isStarred ? 'bookmarked' : ''}" data-serial="${it.serial}" title="Bookmark">${isStarred ? '★' : '☆'}</button>
            <button class="card-action-btn whatsapp-btn" data-idx="${idx}" title="Share on WhatsApp">📲</button>
            <button class="card-action-btn analyzer-btn" data-surah="${it.surah_id}" data-ayah="${it.ayah_num}" title="Open in Ayah Analyzer">↗</button>
          </div>
        </div>
      `;
    }
  }

  function getContainer() {
    return document.getElementById("native-commands-list") || document.getElementById("commands-list-mount");
  }

  function getSentinel() {
    return document.getElementById("native-commands-sentinel") || document.getElementById("scroll-sentinel");
  }

  function renderNextChunk() {
    if (renderedCount >= currentFilteredItems.length) return;
    const nextBatch = currentFilteredItems.slice(renderedCount, renderedCount + CHUNK_SIZE);
    const container = getContainer();
    if (!container) return;

    let chunkHTML = "";
    let prevCat = renderedCount > 0 ? currentFilteredItems[renderedCount - 1].category_id : null;

    nextBatch.forEach((it, i) => {
      const globalIdx = renderedCount + i;
      if (activeCategory === "all" && !searchQuery && activeSortMode === "default" && it.category_id !== prevCat) {
        const catInfo = categoryMap[it.category_id] || { name_en: it.category_name_en, icon: it.category_icon };
        chunkHTML += `
          <div class="category-section-header" id="category-section-${it.category_id}">
            <div class="cat-sec-title-wrap">
              <span class="cat-sec-icon">${catInfo.icon}</span>
              <h3 class="cat-sec-title" style="direction: ltr; font-family: var(--font-ui), sans-serif; font-size: 1.15rem;">${catInfo.name_en}</h3>
            </div>
            <span class="cat-sec-badge" style="font-family: var(--font-urdu), serif; font-size: 0.95rem;">${it.category_name_ur}</span>
          </div>
        `;
        prevCat = it.category_id;
      }
      chunkHTML += buildCardHTML(it, globalIdx);
    });

    const sentinel = getSentinel();
    if (sentinel) {
      sentinel.insertAdjacentHTML("beforebegin", chunkHTML);
    } else {
      container.insertAdjacentHTML("beforeend", chunkHTML);
    }

    renderedCount += nextBatch.length;
    if (renderedCount >= currentFilteredItems.length) {
      if (observer) observer.disconnect();
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
    if (!container || container._hasCommandsDelegation) return;
    container._hasCommandsDelegation = true;

    container.addEventListener("click", (e) => {
      // 1. Play Button
      const playBtn = e.target.closest(".play-btn");
      if (playBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const idx = parseInt(playBtn.dataset.idx, 10);
        if (!isNaN(idx)) playAyahByIndex(idx);
        return;
      }

      // 2. Star / Bookmark Button
      const starBtn = e.target.closest(".star-btn");
      if (starBtn) {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playClick();
        const serial = parseInt(starBtn.dataset.serial, 10);
        toggleBookmark(serial);
        return;
      }

      // 3. Wisdom Toggle
      const wisdomBtn = e.target.closest(".wisdom-toggle-btn");
      if (wisdomBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const serial = parseInt(wisdomBtn.dataset.serial, 10);
        const drawer = document.getElementById(`wisdom-drawer-${serial}`);
        if (drawer) {
          const isHidden = drawer.style.display === "none";
          drawer.style.display = isHidden ? "block" : "none";
          wisdomBtn.classList.toggle("active", isHidden);
        }
        return;
      }

      // 4. Tafsir Button
      const tafsirBtn = e.target.closest(".tafsir-btn");
      if (tafsirBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const sId = parseInt(tafsirBtn.dataset.surah, 10);
        const aNum = parseInt(tafsirBtn.dataset.ayah, 10);
        const serial = parseInt(tafsirBtn.dataset.serial, 10);
        loadTafsir(sId, aNum, serial, tafsirBtn);
        return;
      }

      // 5. Deep Analyzer Jump
      const analyzerBtn = e.target.closest(".analyzer-btn");
      if (analyzerBtn) {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(analyzerBtn.dataset.surah, 10);
        const aNum = parseInt(analyzerBtn.dataset.ayah, 10);
        jumpToAnalyzer(sId, aNum);
        return;
      }

      // 6. WhatsApp Share
      const waBtn = e.target.closest(".whatsapp-btn");
      if (waBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const idx = parseInt(waBtn.dataset.idx, 10);
        const it = currentFilteredItems[idx];
        if (it) {
          const text = formatWhatsApp(it);
          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
          window.open(waUrl, "_blank");
        }
        return;
      }

      // 7. Copy
      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const idx = parseInt(copyBtn.dataset.idx, 10);
        const it = currentFilteredItems[idx];
        if (it) copyCardText(it);
        return;
      }
    });
  }

  function renderList() {
    initData();
    currentFilteredItems = computeFilteredItems();
    const container = getContainer();
    const counterBadge = document.getElementById("commands-counter-badge") || document.getElementById("native-commands-counter-badge");
    const sentinel = getSentinel();

    if (counterBadge) counterBadge.textContent = `${currentFilteredItems.length} Directives`;
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
          <div style="font-size: 2.8rem; margin-bottom: 10px;">🔍</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: #fbbf24;">No directives found</div>
          <p style="margin-top: 6px; font-size: 0.92rem;">Please try a different search query or change filters.</p>
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
        itemSelector: ".command-card, .collapsible-mode, .checklist-row",
        totalItems: currentFilteredItems.length,
        unitName: "directives",
        modalTitle: "Jump to Divine Directive",
        getItemLabel: (idx) => {
          const it = currentFilteredItems[idx - 1];
          return {
            title: `Directive #${it ? it.serial : idx}`,
            subtitle: it ? it.title_en : ""
          };
        },
        onJump: (targetIdx) => {
          ensureRenderedUpToIndex(targetIdx - 1);
          const it = currentFilteredItems[targetIdx - 1];
          if (!it) return;
          const card = document.getElementById(`card-${it.serial}`) || document.getElementById(`check-${it.serial}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            card.classList.add('playing-now');
            setTimeout(() => card.classList.remove('playing-now'), 2000);
          }
        }
      });
    }
  }

  function bindToolbarEvents(scope) {
    const rootEl = scope || document;

    // Search Input
    const searchInput = rootEl.querySelector("#commands-search-input") || rootEl.querySelector("#native-commands-search-input");
    const searchClear = rootEl.querySelector("#search-clear-btn") || rootEl.querySelector("#native-commands-search-clear");
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

    // Sort Select
    const sortSelect = rootEl.querySelector("#commands-sort-select") || rootEl.querySelector("#native-commands-sort-select");
    if (sortSelect && !sortSelect._bound) {
      sortSelect._bound = true;
      sortSelect.addEventListener("change", (e) => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        activeSortMode = e.target.value;
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
        renderList();
      });
    });

    // Polarity Filters
    rootEl.querySelectorAll(".segmented-pill-group[id*='polarity-filters'] .segment-btn").forEach(btn => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        btn.parentElement.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activePolarity = btn.dataset.polarity;
        renderList();
      });
    });

    // Category Ribbon Chips
    rootEl.querySelectorAll(".cat-filter-chip").forEach(btn => {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        btn.parentElement.querySelectorAll(".cat-filter-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.cat;
        renderList();
      });
    });

    // Audio Mini-Dock Buttons
    const miniDockPlay = rootEl.querySelector("#mini-dock-play-btn") || rootEl.querySelector("#native-mini-dock-play-btn");
    const miniDockPrev = rootEl.querySelector("#mini-dock-prev-btn") || rootEl.querySelector("#native-mini-dock-prev-btn");
    const miniDockNext = rootEl.querySelector("#mini-dock-next-btn") || rootEl.querySelector("#native-mini-dock-next-btn");
    const miniDockClose = rootEl.querySelector("#mini-dock-close-btn") || rootEl.querySelector("#native-mini-dock-close-btn");

    if (miniDockPlay && !miniDockPlay._bound) {
      miniDockPlay._bound = true;
      miniDockPlay.addEventListener("click", toggleAudioPlayback);
    }
    if (miniDockPrev && !miniDockPrev._bound) {
      miniDockPrev._bound = true;
      miniDockPrev.addEventListener("click", () => {
        if (currentlyPlayingIndex > 0) playAyahByIndex(currentlyPlayingIndex - 1);
      });
    }
    if (miniDockNext && !miniDockNext._bound) {
      miniDockNext._bound = true;
      miniDockNext.addEventListener("click", () => {
        if (currentlyPlayingIndex < currentFilteredItems.length - 1) playAyahByIndex(currentlyPlayingIndex + 1);
      });
    }
    if (miniDockClose && !miniDockClose._bound) {
      miniDockClose._bound = true;
      miniDockClose.addEventListener("click", () => {
        if (audioPlayer) audioPlayer.pause();
        const miniDock = document.getElementById("audio-mini-dock") || document.getElementById("native-commands-mini-dock");
        if (miniDock) miniDock.classList.remove("show");
        updatePlayButtons(false, -1);
      });
    }
  }

  return {
    init: function () {
      initData();
      const scope = document.getElementById("tab-commands") || document;
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

    playAyah: playAyahByIndex,
    toggleBookmark: toggleBookmark,
    jumpToAnalyzer: jumpToAnalyzer,
    formatWhatsApp: formatWhatsApp
  };
});
