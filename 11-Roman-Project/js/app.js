/**
 * ============================================================================
 * ROMAN URDU ISLAMIC LIBRARY — MOBILE PWA APPLICATION LOGIC
 * ============================================================================
 * Features:
 *   - Unified Multi-Book Studio (Ghalat Fehmiyan, Qareena-e-Zindagi, Bahar-e-Shariat 16)
 *   - Defensive Component Bootloader Isolation (Directive 5)
 *   - Strict DOM Identifier & Variable Hygiene (Directive 5)
 *   - Procedural Web Audio SFX (Clicks & Chimes, Zero Music - Directive 7)
 *   - WhatsApp-Ready Clipboard Exporter (Single Item & Complete Chapter)
 *   - Real-time Cross-Book & Scoped Search Engine with Keyword Highlighting
 *   - Off-canvas TOC & Bookmarks Drawers with LocalStorage Persistence
 *   - Tri-Theme AMOLED / Sepia / Light & Dynamic Typography Scaler
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================
  // APPLICATION STATE
  // ==========================================
  const AppState = {
    currentBookId: "bahar_e_shariat_16", // Default to Bahar-e-Shariat 16
    searchQuery: "",
    searchScope: "current", // "current" | "all"
    theme: "amoled",        // "amoled" | "sepia" | "light"
    fontSize: 16,           // 14 to 22 px
    soundEnabled: true,
    bookmarks: [],          // [{ id, bookId, bookTitle, chapterTitle, label, previewText }]
    renderedChapterCount: 4 // Virtual lazy pagination
  };

  // Cached DOM elements container
  const DOM = {};

  // ==========================================
  // DIRECTIVE 7: PROCEDURAL WEB AUDIO SFX (ZERO MUSIC)
  // ==========================================
  const SoundFX = {
    ctx: null,

    init() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn("Web Audio not available on this browser:", e);
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    },

    // Subtle tactile mechanical click (30ms blip)
    playClick() {
      if (!AppState.soundEnabled || !this.ctx) return;
      try {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } catch (err) {
        // Silent fail on audio restriction
      }
    },

    // Soft alert chime for copy success (two ascending harmonized tones)
    playChime() {
      if (!AppState.soundEnabled || !this.ctx) return;
      try {
        this.resume();
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880.00, now + 0.08); // A5

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(880.00, now);
        osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      } catch (err) {
        // Silent fail
      }
    }
  };

  // ==========================================
  // TOAST NOTIFICATION BANNER
  // ==========================================
  let toastTimer = null;
  function showToast(message, icon = "📋") {
    if (!DOM.toastBanner || !DOM.toastMessage || !DOM.toastIcon) return;
    DOM.toastIcon.textContent = icon;
    DOM.toastMessage.textContent = message;
    DOM.toastBanner.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toastBanner.classList.remove("show");
    }, 2800);
  }

  // ==========================================
  // CLIPBOARD ENGINE (WITH FALLBACK)
  // ==========================================
  async function copyToClipboard(text, successMsg = "Copied to clipboard!") {
    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (e) {
        success = false;
      }
    }

    // Fallback using temporary textarea
    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        success = false;
      }
    }

    if (success) {
      SoundFX.playChime();
      showToast(successMsg, "📋");
    } else {
      showToast("Unable to copy to clipboard", "⚠️");
    }
    return success;
  }

  // ==========================================
  // WHATSAPP FORMATTING BUILDERS
  // ==========================================
  function formatItemForWhatsApp(book, chapter, item) {
    const bookTitle = book ? book.title : "Roman Islamic Library";
    const chTitle = chapter ? (chapter.title || `Chapter ${chapter.number}`) : "";
    const typeLabel = item.label || (item.type === "hadith" ? "Hadees Shareef" : (item.type === "masala" ? "Shar'i Mas'ala" : "Nasihat / Hukm"));

    let out = `*📗 ${bookTitle}*\n`;
    if (chTitle) {
      out += `*📌 ${chTitle}*\n`;
    }
    out += `------------------------------\n`;
    out += `*${typeLabel}:*\n`;

    if (item.scripture || (item.is_arabic && item.text)) {
      out += `\n_${item.scripture || item.text}_\n\n`;
    }

    if (item.type !== "scripture" && (!item.is_arabic || item.scripture)) {
      out += `${item.text || ""}\n`;
    }

    if (item.citation || chapter.hawala) {
      out += `\n📚 *Hawala / Reference:* ${item.citation || chapter.hawala}\n`;
    }

    out += `------------------------------\n`;
    out += `📲 _Roman Islamic Library — Curated by Hamid Gazi_\n`;
    out += `🔗 https://hamidgazi.github.io/app-portal/`;
    return out;
  }

  function formatChapterForWhatsApp(book, chapter) {
    const bookTitle = book ? book.title : "Roman Islamic Library";
    const chTitle = chapter ? (chapter.title || `Chapter ${chapter.number}`) : "";

    let out = `*📗 ${bookTitle}*\n`;
    out += `*📖 ${chTitle} (Complete Chapter)*\n`;
    if (chapter.subtitle) {
      out += `_${chapter.subtitle}_\n`;
    }
    out += `==============================\n\n`;

    if (chapter.items && Array.isArray(chapter.items)) {
      chapter.items.forEach((item, idx) => {
        const itemHeading = item.label || (item.type === "hadith" ? `[Hadees ${idx + 1}]` : (item.type === "masala" ? `[Mas'ala ${idx + 1}]` : ""));
        if (itemHeading) {
          out += `*${itemHeading}*\n`;
        }
        if (item.scripture) {
          out += `_${item.scripture}_\n`;
        }
        out += `${item.text || ""}\n\n`;
      });
    }

    if (chapter.hawala) {
      out += `📚 *Hawala:* ${chapter.hawala}\n`;
    }

    out += `==============================\n`;
    out += `📲 _Roman Islamic Library — Curated by Hamid Gazi_\n`;
    out += `🔗 https://hamidgazi.github.io/app-portal/`;
    return out;
  }

  function shareDirectWhatsApp(text) {
    SoundFX.playClick();
    const encoded = encodeURIComponent(text);
    const url = `whatsapp://send?text=${encoded}`;
    window.location.href = url;
  }

  // ==========================================
  // DATA ACCESS HELPERS
  // ==========================================
  function getLibrary() {
    return window.ROMAN_LIBRARY_DATA || { books: [] };
  }

  function getCurrentBook() {
    const lib = getLibrary();
    return lib.books.find(b => b.id === AppState.currentBookId) || lib.books[0] || null;
  }

  function getBookById(id) {
    const lib = getLibrary();
    return lib.books.find(b => b.id === id) || null;
  }

  // ==========================================
  // ESCAPE HTML & SEARCH HIGHLIGHTING
  // ==========================================
  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function highlightMatches(text, query) {
    if (!query || !query.trim() || !text) {
      return escapeHTML(text);
    }
    const escapedText = escapeHTML(text);
    const qClean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${qClean})`, "gi");
    return escapedText.replace(regex, `<mark class="search-match">$1</mark>`);
  }

  // Check if string contains Arabic characters
  function containsArabic(str) {
    if (!str) return false;
    return /[\u0600-\u06FF\u0750-\u077F]/.test(str);
  }

  // ==========================================
  // MODULE: THEME & TYPOGRAPHY MANAGER
  // ==========================================
  function initThemeManager() {
    try {
      const savedTheme = localStorage.getItem("roman_reader_theme") || "amoled";
      const savedFont = parseInt(localStorage.getItem("roman_reader_fontsize"), 10) || 16;
      const savedSound = localStorage.getItem("roman_reader_sound") !== "false";

      AppState.theme = savedTheme;
      AppState.fontSize = Math.min(Math.max(savedFont, 14), 22);
      AppState.soundEnabled = savedSound;

      applyTheme(AppState.theme, false);
      applyFontSize(AppState.fontSize, false);

      if (DOM.soundToggle) {
        DOM.soundToggle.checked = AppState.soundEnabled;
        DOM.soundToggle.addEventListener("change", function () {
          AppState.soundEnabled = this.checked;
          localStorage.setItem("roman_reader_sound", AppState.soundEnabled.toString());
          if (AppState.soundEnabled) SoundFX.playClick();
        });
      }

      if (DOM.themeBtns) {
        DOM.themeBtns.forEach(btn => {
          btn.addEventListener("click", function () {
            SoundFX.playClick();
            const t = this.getAttribute("data-theme-val");
            applyTheme(t, true);
          });
        });
      }

      if (DOM.fontDecBtn) {
        DOM.fontDecBtn.addEventListener("click", () => {
          SoundFX.playClick();
          if (AppState.fontSize > 14) {
            applyFontSize(AppState.fontSize - 1, true);
          }
        });
      }

      if (DOM.fontIncBtn) {
        DOM.fontIncBtn.addEventListener("click", () => {
          SoundFX.playClick();
          if (AppState.fontSize < 22) {
            applyFontSize(AppState.fontSize + 1, true);
          }
        });
      }
    } catch (err) {
      console.error("[ThemeManager] Error initializing:", err);
    }
  }

  function applyTheme(themeName, persist = true) {
    document.documentElement.setAttribute("data-theme", themeName);
    AppState.theme = themeName;
    if (persist) {
      localStorage.setItem("roman_reader_theme", themeName);
    }
    if (DOM.themeBtns) {
      DOM.themeBtns.forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-theme-val") === themeName);
      });
    }
  }

  function applyFontSize(size, persist = true) {
    AppState.fontSize = size;
    document.documentElement.style.setProperty("--base-font-size", `${size}px`);
    if (DOM.fontIndicator) {
      DOM.fontIndicator.textContent = `${size}px`;
    }
    if (persist) {
      localStorage.setItem("roman_reader_fontsize", size.toString());
    }
  }

  // ==========================================
  // MODULE: BOOKMARKS MANAGER
  // ==========================================
  function initBookmarksManager() {
    try {
      const stored = localStorage.getItem("roman_reader_bookmarks");
      if (stored) {
        AppState.bookmarks = JSON.parse(stored) || [];
      }
      updateBookmarksBadge();
    } catch (err) {
      console.error("[BookmarksManager] Error initializing:", err);
      AppState.bookmarks = [];
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem("roman_reader_bookmarks", JSON.stringify(AppState.bookmarks));
      updateBookmarksBadge();
    } catch (err) {
      console.error("[BookmarksManager] Error saving bookmarks:", err);
    }
  }

  function isItemBookmarked(itemId) {
    return AppState.bookmarks.some(b => b.id === itemId);
  }

  function toggleBookmark(itemData) {
    SoundFX.playClick();
    const idx = AppState.bookmarks.findIndex(b => b.id === itemData.id);
    if (idx >= 0) {
      AppState.bookmarks.splice(idx, 1);
      showToast("Removed from Saved Masail", "🗑️");
    } else {
      AppState.bookmarks.push(itemData);
      showToast("Saved to Bookmarks!", "⭐");
    }
    saveBookmarks();
    renderBookmarksDrawerList();
    renderCurrentBookStream(); // Re-render to refresh star icons
  }

  function updateBookmarksBadge() {
    if (DOM.bookmarkBadge) {
      const count = AppState.bookmarks.length;
      DOM.bookmarkBadge.textContent = count > 0 ? count : "";
      DOM.bookmarkBadge.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  function renderBookmarksDrawerList() {
    if (!DOM.bookmarksList) return;
    if (AppState.bookmarks.length === 0) {
      DOM.bookmarksList.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 2rem; margin-bottom: 8px;">⭐</div>
          <p>No saved Masail yet.</p>
          <small>Tap the star icon on any Hadith or Mas'ala to save for quick reading.</small>
        </div>
      `;
      return;
    }

    let html = "";
    AppState.bookmarks.forEach(bm => {
      html += `
        <li class="drawer-list-item" data-bm-book="${escapeHTML(bm.bookId)}" data-bm-item="${escapeHTML(bm.id)}">
          <div style="flex: 1; padding-right: 8px;">
            <div class="item-title" style="font-weight: 600;">${escapeHTML(bm.label || bm.chapterTitle)}</div>
            <div class="item-meta">📖 ${escapeHTML(bm.bookTitle)} • ${escapeHTML(bm.previewText ? bm.previewText.substring(0, 60) + '...' : '')}</div>
          </div>
          <button class="icon-btn delete-btn" title="Remove" data-remove-bm="${escapeHTML(bm.id)}" style="width:36px; height:36px; min-width:36px; min-height:36px;">
            ✕
          </button>
        </li>
      `;
    });
    DOM.bookmarksList.innerHTML = html;

    // Attach listeners
    DOM.bookmarksList.querySelectorAll(".drawer-list-item").forEach(item => {
      item.addEventListener("click", function (e) {
        if (e.target.closest(".delete-btn")) return;
        const bId = this.getAttribute("data-bm-book");
        const itemId = this.getAttribute("data-bm-item");
        closeDrawers();
        switchToBook(bId, () => {
          jumpToElement(itemId);
        });
      });
    });

    DOM.bookmarksList.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idToRemove = this.getAttribute("data-remove-bm");
        const idx = AppState.bookmarks.findIndex(b => b.id === idToRemove);
        if (idx >= 0) {
          AppState.bookmarks.splice(idx, 1);
          saveBookmarks();
          renderBookmarksDrawerList();
          renderCurrentBookStream();
        }
      });
    });
  }

  // ==========================================
  // MODULE: NAVIGATION & BOOK SWITCHER
  // ==========================================
  function initNavigation() {
    try {
      // Book switcher tabs
      if (DOM.bookTabsContainer) {
        DOM.bookTabsContainer.querySelectorAll(".book-tab").forEach(tab => {
          tab.addEventListener("click", function () {
            SoundFX.playClick();
            const bId = this.getAttribute("data-book-id");
            switchToBook(bId);
          });
        });
      }

      // TOC button
      if (DOM.tocToggleBtn) {
        DOM.tocToggleBtn.addEventListener("click", () => {
          SoundFX.playClick();
          openDrawer("toc");
        });
      }

      // Bookmark button
      if (DOM.bookmarkToggleBtn) {
        DOM.bookmarkToggleBtn.addEventListener("click", () => {
          SoundFX.playClick();
          renderBookmarksDrawerList();
          openDrawer("bookmarks");
        });
      }

      // Settings button
      if (DOM.settingsToggleBtn) {
        DOM.settingsToggleBtn.addEventListener("click", () => {
          SoundFX.playClick();
          openModal("settings");
        });
      }

      // Drawer close buttons
      if (DOM.drawerCloseBtns) {
        DOM.drawerCloseBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            SoundFX.playClick();
            closeDrawers();
          });
        });
      }

      // Modal close buttons
      if (DOM.modalCloseBtns) {
        DOM.modalCloseBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            SoundFX.playClick();
            closeModals();
          });
        });
      }

      // Overlay clicks
      if (DOM.drawerOverlay) {
        DOM.drawerOverlay.addEventListener("click", closeDrawers);
      }
      if (DOM.settingsModal) {
        DOM.settingsModal.addEventListener("click", function (e) {
          if (e.target === this) closeModals();
        });
      }

      // Back to top FAB
      if (DOM.fabTop) {
        DOM.fabTop.addEventListener("click", () => {
          SoundFX.playClick();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", () => {
          if (window.scrollY > 350) {
            DOM.fabTop.classList.add("visible");
          } else {
            DOM.fabTop.classList.remove("visible");
          }
        }, { passive: true });
      }

      // TOC Search filter input
      if (DOM.tocFilterInput) {
        DOM.tocFilterInput.addEventListener("input", function () {
          filterTOC(this.value.trim().toLowerCase());
        });
      }
    } catch (err) {
      console.error("[Navigation] Error initializing:", err);
    }
  }

  function switchToBook(bookId, callback) {
    AppState.currentBookId = bookId;
    AppState.renderedChapterCount = 4; // Reset virtual paging
    AppState.searchQuery = "";
    if (DOM.searchInput) DOM.searchInput.value = "";
    if (DOM.searchClearBtn) DOM.searchClearBtn.classList.remove("visible");
    if (DOM.searchStats) DOM.searchStats.textContent = "";

    document.body.setAttribute("data-current-book", bookId);

    // Update active tab UI
    if (DOM.bookTabsContainer) {
      DOM.bookTabsContainer.querySelectorAll(".book-tab").forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-book-id") === bookId);
      });
    }

    renderTOCDrawerList();
    renderCurrentBookStream();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof callback === "function") {
      setTimeout(callback, 100);
    }
  }

  function openDrawer(type) {
    if (DOM.drawerOverlay) DOM.drawerOverlay.classList.add("open");
    if (type === "toc" && DOM.tocDrawer) {
      DOM.tocDrawer.classList.add("open");
      if (DOM.tocFilterInput) DOM.tocFilterInput.focus();
    } else if (type === "bookmarks" && DOM.bookmarksDrawer) {
      DOM.bookmarksDrawer.classList.add("open");
    }
  }

  function closeDrawers() {
    if (DOM.drawerOverlay) DOM.drawerOverlay.classList.remove("open");
    if (DOM.tocDrawer) DOM.tocDrawer.classList.remove("open");
    if (DOM.bookmarksDrawer) DOM.bookmarksDrawer.classList.remove("open");
  }

  function openModal(type) {
    if (type === "settings" && DOM.settingsModal) {
      DOM.settingsModal.classList.add("open");
    }
  }

  function closeModals() {
    if (DOM.settingsModal) DOM.settingsModal.classList.remove("open");
  }

  function jumpToElement(elemId) {
    // If element is not rendered yet, expand rendered chapters to include it
    let target = document.getElementById(elemId);
    if (!target) {
      const book = getCurrentBook();
      if (book) {
        AppState.renderedChapterCount = book.chapters.length;
        renderCurrentBookStream();
        target = document.getElementById(elemId);
      }
    }

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("highlighted");
      setTimeout(() => target.classList.remove("highlighted"), 2500);
    }
  }

  // ==========================================
  // MODULE: TOC DRAWER RENDERING
  // ==========================================
  function renderTOCDrawerList() {
    if (!DOM.tocList) return;
    const book = getCurrentBook();
    if (!book || !book.chapters) {
      DOM.tocList.innerHTML = `<div class="empty-state">No chapters found</div>`;
      return;
    }

    if (DOM.tocBookTitle) {
      DOM.tocBookTitle.textContent = book.title;
    }

    let html = "";
    book.chapters.forEach(ch => {
      const itemCount = ch.items ? ch.items.length : 0;
      html += `
        <li class="drawer-list-item toc-item" data-ch-id="${escapeHTML(ch.id)}">
          <div style="flex: 1;">
            <div class="item-title">${escapeHTML(ch.title)}</div>
            ${ch.title_urdu ? `<div class="item-meta" style="direction: rtl; font-family: var(--font-arabic); font-size: 0.95rem;">${escapeHTML(ch.title_urdu)}</div>` : ''}
            <div class="item-meta">${itemCount} ahkaam / masail</div>
          </div>
          <span style="color: var(--accent-light); font-size: 1.1rem;">›</span>
        </li>
      `;
    });

    DOM.tocList.innerHTML = html;

    DOM.tocList.querySelectorAll(".toc-item").forEach(item => {
      item.addEventListener("click", function () {
        SoundFX.playClick();
        const chId = this.getAttribute("data-ch-id");
        closeDrawers();
        jumpToElement(chId);
      });
    });
  }

  function filterTOC(filterText) {
    if (!DOM.tocList) return;
    const items = DOM.tocList.querySelectorAll(".toc-item");
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(filterText) ? "flex" : "none";
    });
  }

  // ==========================================
  // MODULE: SEARCH ENGINE (SCOPED & ALL BOOKS)
  // ==========================================
  let searchDebounceTimer = null;

  function initSearchEngine() {
    try {
      if (DOM.searchInput) {
        DOM.searchInput.addEventListener("input", function () {
          const val = this.value;
          if (DOM.searchClearBtn) {
            DOM.searchClearBtn.classList.toggle("visible", val.length > 0);
          }
          if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
          searchDebounceTimer = setTimeout(() => {
            executeSearch(val.trim());
          }, 180);
        });
      }

      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.addEventListener("click", () => {
          SoundFX.playClick();
          DOM.searchInput.value = "";
          DOM.searchClearBtn.classList.remove("visible");
          executeSearch("");
          DOM.searchInput.focus();
        });
      }

      if (DOM.searchScopePills) {
        DOM.searchScopePills.forEach(pill => {
          pill.addEventListener("click", function () {
            SoundFX.playClick();
            const scope = this.getAttribute("data-scope");
            AppState.searchScope = scope;
            DOM.searchScopePills.forEach(p => p.classList.toggle("active", p === this));
            if (AppState.searchQuery) {
              executeSearch(AppState.searchQuery);
            }
          });
        });
      }
    } catch (err) {
      console.error("[SearchEngine] Error initializing:", err);
    }
  }

  function executeSearch(query) {
    AppState.searchQuery = query;

    if (!query) {
      if (DOM.searchStats) DOM.searchStats.textContent = "";
      renderCurrentBookStream();
      return;
    }

    const lib = getLibrary();
    const queryLower = query.toLowerCase();
    const booksToSearch = AppState.searchScope === "all" ? lib.books : [getCurrentBook()];

    let totalMatches = 0;
    const results = [];

    booksToSearch.forEach(book => {
      if (!book || !book.chapters) return;
      book.chapters.forEach(ch => {
        let chapterMatched = false;
        const matchingItems = [];

        // Check chapter title
        const chTitleMatch = ch.title && ch.title.toLowerCase().includes(queryLower);
        const chUrduMatch = ch.title_urdu && ch.title_urdu.includes(query);

        if (ch.items && Array.isArray(ch.items)) {
          ch.items.forEach(item => {
            const textMatch = item.text && item.text.toLowerCase().includes(queryLower);
            const scriptMatch = item.scripture && item.scripture.includes(query);
            const labelMatch = item.label && item.label.toLowerCase().includes(queryLower);

            if (textMatch || scriptMatch || labelMatch || chTitleMatch || chUrduMatch) {
              matchingItems.push(item);
              totalMatches++;
            }
          });
        }

        if (matchingItems.length > 0) {
          results.push({
            book: book,
            chapter: ch,
            items: matchingItems
          });
        }
      });
    });

    if (DOM.searchStats) {
      const scopeLabel = AppState.searchScope === "all" ? "across all 3 books" : "in current book";
      DOM.searchStats.textContent = `Found ${totalMatches} matches ${scopeLabel}`;
    }

    renderSearchResultsStream(results, query);
  }

  function renderSearchResultsStream(results, query) {
    if (!DOM.contentStream) return;
    if (results.length === 0) {
      DOM.contentStream.innerHTML = `
        <div class="empty-state" style="padding: 60px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <div style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">No matches found</div>
          <p style="color: var(--text-tertiary);">No rulings or Hadiths matched "<strong>${escapeHTML(query)}</strong>".</p>
          <div style="margin-top: 16px;">
            <button class="icon-btn" id="btn-search-all-scope" style="width: auto; padding: 8px 18px; border-radius: 999px;">
              Try searching across all 3 books
            </button>
          </div>
        </div>
      `;
      const searchAllBtn = document.getElementById("btn-search-all-scope");
      if (searchAllBtn) {
        searchAllBtn.addEventListener("click", () => {
          AppState.searchScope = "all";
          if (DOM.searchScopePills) {
            DOM.searchScopePills.forEach(p => p.classList.toggle("active", p.getAttribute("data-scope") === "all"));
          }
          executeSearch(query);
        });
      }
      return;
    }

    let html = "";
    results.forEach(group => {
      const { book, chapter, items } = group;
      html += `
        <div class="chapter-container">
          <div class="chapter-header-card">
            <div class="chapter-header-top">
              <div class="chapter-title-group">
                <span class="chapter-number-tag">📖 ${escapeHTML(book.title)}</span>
                <h3 class="chapter-main-title">${highlightMatches(chapter.title, query)}</h3>
                ${chapter.title_urdu ? `<div class="chapter-urdu-title">${escapeHTML(chapter.title_urdu)}</div>` : ''}
              </div>
            </div>
          </div>
          <div class="chapter-items-wrap">
      `;

      items.forEach(item => {
        html += renderItemCardHTML(book, chapter, item, query);
      });

      html += `
          </div>
        </div>
      `;
    });

    DOM.contentStream.innerHTML = html;
    attachItemEventListeners();
  }

  // ==========================================
  // MODULE: BOOK STREAM & ITEM RENDERING
  // ==========================================
  function renderCurrentBookStream() {
    if (!DOM.contentStream) return;
    const book = getCurrentBook();
    if (!book) {
      DOM.contentStream.innerHTML = `<div class="empty-state">No book data available</div>`;
      return;
    }

    let html = `
      <div class="book-hero-banner">
        <div class="book-badge-row">
          <span class="book-badge">${escapeHTML(book.badge || 'Islamic Classical')}</span>
          <span class="chapter-count-pill">${book.chapters.length} Chapters / Topics</span>
        </div>
        <h1 class="book-hero-title">${escapeHTML(book.title)}</h1>
        ${book.title_urdu ? `<div class="book-hero-urdu">${escapeHTML(book.title_urdu)}</div>` : ''}
        ${book.subtitle ? `<div class="book-hero-subtitle">${escapeHTML(book.subtitle)}</div>` : ''}
        <div class="book-hero-meta">
          <div class="meta-item">✍️ <strong>Musannif:</strong> ${escapeHTML(book.author)}</div>
          <div class="meta-item">💻 <strong>Compiler:</strong> ${escapeHTML(book.compiler)}</div>
        </div>
      </div>
    `;

    // Virtual pagination: Render only first N chapters initially for ultra-responsive mobile performance
    const chaptersToRender = book.chapters.slice(0, AppState.renderedChapterCount);

    chaptersToRender.forEach(chapter => {
      html += `
        <section class="chapter-container" id="${escapeHTML(chapter.id)}">
          <div class="chapter-header-card">
            <div class="chapter-header-top">
              <div class="chapter-title-group">
                <span class="chapter-number-tag">Section / Chapter ${chapter.number}</span>
                <h2 class="chapter-main-title">${escapeHTML(chapter.title)}</h2>
                ${chapter.title_urdu ? `<div class="chapter-urdu-title">${escapeHTML(chapter.title_urdu)}</div>` : ''}
                ${chapter.subtitle ? `<div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">${escapeHTML(chapter.subtitle)}</div>` : ''}
                ${chapter.hawala ? `<div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:4px; font-style:italic;">${escapeHTML(chapter.hawala)}</div>` : ''}
              </div>
              <div class="chapter-actions">
                <button class="chapter-copy-btn btn-copy-chapter" data-ch-id="${escapeHTML(chapter.id)}" title="Copy Complete Chapter">
                  <span>📋 Copy Chapter</span>
                </button>
                <button class="chapter-copy-btn btn-share-chapter" data-ch-id="${escapeHTML(chapter.id)}" title="Share Chapter to WhatsApp">
                  <span>💬 Share</span>
                </button>
              </div>
            </div>
          </div>
          <div class="chapter-items-wrap">
      `;

      if (chapter.items && Array.isArray(chapter.items)) {
        chapter.items.forEach(item => {
          html += renderItemCardHTML(book, chapter, item, "");
        });
      }

      html += `
          </div>
        </section>
      `;
    });

    // Load More Button if remaining chapters exist
    if (book.chapters.length > AppState.renderedChapterCount) {
      const remaining = book.chapters.length - AppState.renderedChapterCount;
      html += `
        <div class="loading-wrap">
          <button class="load-more-btn" id="btn-load-more-chapters">
            📖 Load Next 6 Chapters (${remaining} remaining)
          </button>
        </div>
      `;
    }

    DOM.contentStream.innerHTML = html;
    attachItemEventListeners();

    const loadMoreBtn = document.getElementById("btn-load-more-chapters");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        SoundFX.playClick();
        AppState.renderedChapterCount += 6;
        renderCurrentBookStream();
      });
    }
  }

  function renderItemCardHTML(book, chapter, item, searchQuery = "") {
    const isBookmarked = isItemBookmarked(item.id);
    const tagClass = item.type === "hadith" ? "type-hadith" : (item.type === "masala" ? "type-masala" : "");
    const tagLabel = item.label || (item.type === "hadith" ? "Hadees" : (item.type === "masala" ? "Mas'ala" : "Ahkaam"));

    // Check if item text has Arabic script
    const hasArabicText = item.is_arabic || containsArabic(item.text) || item.scripture;

    return `
      <article class="item-card" id="${escapeHTML(item.id)}" data-item-id="${escapeHTML(item.id)}" data-ch-id="${escapeHTML(chapter.id)}" data-book-id="${escapeHTML(book.id)}">
        <div class="item-card-header">
          <span class="item-tag ${tagClass}">
            ${escapeHTML(tagLabel)}
          </span>
          <div class="item-actions">
            <button class="mini-action-btn btn-copy-item" title="Copy to Clipboard" data-item-id="${escapeHTML(item.id)}">
              📋
            </button>
            <button class="mini-action-btn btn-share-item" title="Share via WhatsApp" data-item-id="${escapeHTML(item.id)}">
              💬
            </button>
            <button class="mini-action-btn btn-bookmark-item ${isBookmarked ? 'bookmarked' : ''}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Mas\'ala'}" data-item-id="${escapeHTML(item.id)}">
              ${isBookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>

        ${item.scripture ? `
          <div class="scripture-box">
            ${highlightMatches(item.scripture, searchQuery)}
          </div>
        ` : ''}

        ${item.is_arabic && !item.scripture ? `
          <div class="scripture-box">
            ${highlightMatches(item.text, searchQuery)}
          </div>
        ` : ''}

        ${(!item.is_arabic || item.scripture) && item.text ? `
          <div class="item-body">
            <p>${highlightMatches(item.text, searchQuery)}</p>
          </div>
        ` : ''}

        ${item.citation ? `
          <div class="item-citation">
            📚 ${highlightMatches(item.citation, searchQuery)}
          </div>
        ` : ''}
      </article>
    `;
  }

  function attachItemEventListeners() {
    if (!DOM.contentStream) return;

    // Single item Copy buttons
    DOM.contentStream.querySelectorAll(".btn-copy-item").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const card = this.closest(".item-card");
        if (!card) return;
        const bId = card.getAttribute("data-book-id");
        const chId = card.getAttribute("data-ch-id");
        const itemId = card.getAttribute("data-item-id");

        const book = getBookById(bId);
        const chapter = book && book.chapters.find(c => c.id === chId);
        const item = chapter && chapter.items.find(i => i.id === itemId);

        if (book && chapter && item) {
          const text = formatItemForWhatsApp(book, chapter, item);
          copyToClipboard(text, "Mas'ala copied! Ready for WhatsApp");
        }
      });
    });

    // Single item WhatsApp Share buttons
    DOM.contentStream.querySelectorAll(".btn-share-item").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const card = this.closest(".item-card");
        if (!card) return;
        const bId = card.getAttribute("data-book-id");
        const chId = card.getAttribute("data-ch-id");
        const itemId = card.getAttribute("data-item-id");

        const book = getBookById(bId);
        const chapter = book && book.chapters.find(c => c.id === chId);
        const item = chapter && chapter.items.find(i => i.id === itemId);

        if (book && chapter && item) {
          const text = formatItemForWhatsApp(book, chapter, item);
          shareDirectWhatsApp(text);
        }
      });
    });

    // Single item Bookmark buttons
    DOM.contentStream.querySelectorAll(".btn-bookmark-item").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const card = this.closest(".item-card");
        if (!card) return;
        const bId = card.getAttribute("data-book-id");
        const chId = card.getAttribute("data-ch-id");
        const itemId = card.getAttribute("data-item-id");

        const book = getBookById(bId);
        const chapter = book && book.chapters.find(c => c.id === chId);
        const item = chapter && chapter.items.find(i => i.id === itemId);

        if (book && chapter && item) {
          toggleBookmark({
            id: item.id,
            bookId: book.id,
            bookTitle: book.title,
            chapterTitle: chapter.title,
            label: item.label || `Item ${item.id}`,
            previewText: item.text ? item.text.substring(0, 100) : (item.scripture || "")
          });
        }
      });
    });

    // Complete Chapter Copy buttons
    DOM.contentStream.querySelectorAll(".btn-copy-chapter").forEach(btn => {
      btn.addEventListener("click", function () {
        const chId = this.getAttribute("data-ch-id");
        const book = getCurrentBook();
        const chapter = book && book.chapters.find(c => c.id === chId);
        if (book && chapter) {
          const text = formatChapterForWhatsApp(book, chapter);
          copyToClipboard(text, "Full chapter copied! Ready for WhatsApp");
        }
      });
    });

    // Complete Chapter WhatsApp Share buttons
    DOM.contentStream.querySelectorAll(".btn-share-chapter").forEach(btn => {
      btn.addEventListener("click", function () {
        const chId = this.getAttribute("data-ch-id");
        const book = getCurrentBook();
        const chapter = book && book.chapters.find(c => c.id === chId);
        if (book && chapter) {
          const text = formatChapterForWhatsApp(book, chapter);
          shareDirectWhatsApp(text);
        }
      });
    });
  }

  // ==========================================
  // DIRECTIVE 5: DEFENSIVE COMPONENT BOOTLOADER
  // ==========================================
  function cacheDOMElements() {
    DOM.bookTabsContainer = document.getElementById("book-tabs-container");
    DOM.contentStream = document.getElementById("content-stream");
    DOM.searchInput = document.getElementById("search-input");
    DOM.searchClearBtn = document.getElementById("search-clear-btn");
    DOM.searchStats = document.getElementById("search-stats");
    DOM.searchScopePills = document.querySelectorAll(".scope-pill");
    DOM.tocToggleBtn = document.getElementById("btn-toggle-toc");
    DOM.bookmarkToggleBtn = document.getElementById("btn-toggle-bookmarks");
    DOM.settingsToggleBtn = document.getElementById("btn-toggle-settings");
    DOM.bookmarkBadge = document.getElementById("bookmark-count-badge");
    DOM.drawerOverlay = document.getElementById("drawer-overlay");
    DOM.tocDrawer = document.getElementById("toc-drawer");
    DOM.tocList = document.getElementById("toc-list");
    DOM.tocBookTitle = document.getElementById("toc-book-title");
    DOM.tocFilterInput = document.getElementById("toc-filter-input");
    DOM.bookmarksDrawer = document.getElementById("bookmarks-drawer");
    DOM.bookmarksList = document.getElementById("bookmarks-list");
    DOM.settingsModal = document.getElementById("settings-modal");
    DOM.drawerCloseBtns = document.querySelectorAll(".drawer-close-btn");
    DOM.modalCloseBtns = document.querySelectorAll(".modal-close-btn");
    DOM.fabTop = document.getElementById("fab-back-to-top");
    DOM.toastBanner = document.getElementById("toast-banner");
    DOM.toastIcon = document.getElementById("toast-icon");
    DOM.toastMessage = document.getElementById("toast-message");
    DOM.themeBtns = document.querySelectorAll(".theme-btn");
    DOM.fontDecBtn = document.getElementById("btn-font-dec");
    DOM.fontIncBtn = document.getElementById("btn-font-inc");
    DOM.fontIndicator = document.getElementById("font-size-val");
    DOM.soundToggle = document.getElementById("sound-fx-toggle");
  }

  function appBootloader() {
    console.log("🕌 Bootloading Roman Urdu Islamic Library PWA...");

    // 1. Audio System
    try {
      SoundFX.init();
    } catch (e) {
      console.warn("Audio module skipped:", e);
    }

    // 2. Cache DOM targets
    try {
      cacheDOMElements();
    } catch (e) {
      console.error("DOM caching error:", e);
    }

    // 3. Theme & Font Size
    try {
      initThemeManager();
    } catch (e) {
      console.error("Theme manager error:", e);
    }

    // 4. Bookmarks System
    try {
      initBookmarksManager();
    } catch (e) {
      console.error("Bookmarks manager error:", e);
    }

    // 5. Navigation & Tabs
    try {
      initNavigation();
    } catch (e) {
      console.error("Navigation error:", e);
    }

    // 6. Search Engine
    try {
      initSearchEngine();
    } catch (e) {
      console.error("Search engine error:", e);
    }

    // 7. Initial Data Render
    try {
      const lib = getLibrary();
      if (lib && lib.books && lib.books.length > 0) {
        switchToBook(AppState.currentBookId);
      } else {
        console.error("No library data found. Ensure library_catalog.js is loaded.");
      }
    } catch (e) {
      console.error("Initial data render error:", e);
    }

    console.log("✨ Roman Islamic Library Initialized Successfully!");
  }

  // Run bootloader on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", appBootloader);
  } else {
    appBootloader();
  }

})();
