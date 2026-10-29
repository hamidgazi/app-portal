/**
 * ============================================================================
 * ROMAN URDU ISLAMIC LIBRARY — REDESIGNED EDITORIAL APPLICATION LOGIC
 * ============================================================================
 * Features:
 *   - Seamless Editorial Article Reader (Unbroken Prose Flow, Zero Chopped Cards)
 *   - In-Text Hadith & Mas'ala Badges with 1-Tap Quick-Copy Buttons
 *   - Single-Article View with Sticky Bottom Navigation Dock (Prev / Next / TOC)
 *   - Instant Search Results Deck with Direct Article Anchor Jumping
 *   - WhatsApp-Formatted Exporter (Individual Ruling & Complete Article)
 *   - LocalStorage Bookmarks Drawer for Saved Articles & Masail
 *   - Procedural Web Audio API Sound SFX (Tactile Clicks & Chimes - Zero Music)
 *   - Tri-Theme AMOLED / Sepia / Light & Dynamic Typography Scaler
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================
  // APPLICATION STATE
  // ==========================================
  const AppState = {
    currentBookId: "bahar_e_shariat_16", // Default to Bahar-e-Shariat Part 16
    currentChapterIndex: 0,             // Active reading chapter index
    searchQuery: "",
    theme: "amoled",                    // "amoled" | "sepia" | "light"
    fontSize: 16,                       // 14 to 22 px
    soundEnabled: true,
    bookmarks: []                       // Saved items
  };

  // Cached DOM elements
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
        console.warn("Web Audio not available:", e);
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    },

    // Subtle mechanical tactile tap (30ms blip)
    playClick() {
      if (!AppState.soundEnabled || !this.ctx) return;
      try {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } catch (err) {
        // Silent fail
      }
    },

    // Soft alert chime for copy success (two harmonized ascending tones)
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
  // CLIPBOARD ENGINE (WITH SECURE FALLBACK)
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
  function formatRulingForWhatsApp(book, chapter, block) {
    const bookTitle = book ? book.title : "Roman Islamic Library";
    const chTitle = chapter ? (chapter.title || `Chapter ${chapter.number}`) : "";
    const typeLabel = block.label || (block.type === "hadith" ? "Hadees Shareef" : "Shar'i Mas'ala");

    let out = `*📗 ${bookTitle}*\n`;
    if (chTitle) {
      out += `*📌 ${chTitle}*\n`;
    }
    out += `------------------------------\n`;
    out += `*${typeLabel}:*\n`;

    if (block.scripture) {
      out += `\n_${block.scripture}_\n\n`;
    }

    if (block.text) {
      out += `${block.text}\n`;
    }

    if (chapter.hawala) {
      out += `\n📚 *Hawala / Reference:* ${chapter.hawala}\n`;
    }

    out += `------------------------------\n`;
    out += `📲 _Roman Islamic Library — Curated by Hamid Gazi_\n`;
    out += `🔗 https://hamidgazi.github.io/app-portal/`;
    return out;
  }

  function formatFullArticleForWhatsApp(book, chapter) {
    const bookTitle = book ? book.title : "Roman Islamic Library";
    const chTitle = chapter ? (chapter.title || `Chapter ${chapter.number}`) : "";

    let out = `*📗 ${bookTitle}*\n`;
    out += `*📖 ${chTitle}*\n`;
    if (chapter.subtitle) {
      out += `_${chapter.subtitle}_\n`;
    }
    out += `==============================\n\n`;

    if (chapter.blocks && Array.isArray(chapter.blocks)) {
      chapter.blocks.forEach(block => {
        if (block.type === "p") {
          out += `${block.text}\n\n`;
        } else if (block.type === "scripture") {
          out += `_${block.text}_\n\n`;
        } else if (block.type === "hadith" || block.type === "masala") {
          out += `*${block.label}:*\n${block.text}\n\n`;
        } else if (block.type === "quote") {
          out += `> _${block.text}_\n\n`;
        } else if (block.type === "heading") {
          out += `*${block.text}*\n\n`;
        }
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

  function isItemBookmarked(id) {
    return AppState.bookmarks.some(b => b.id === id);
  }

  function toggleArticleBookmark(book, chapter) {
    SoundFX.playClick();
    const chId = chapter.id;
    const idx = AppState.bookmarks.findIndex(b => b.id === chId);
    if (idx >= 0) {
      AppState.bookmarks.splice(idx, 1);
      showToast("Removed from Saved Articles", "🗑️");
    } else {
      AppState.bookmarks.push({
        id: chId,
        bookId: book.id,
        bookTitle: book.title,
        chapterIndex: AppState.currentChapterIndex,
        title: chapter.title,
        subtitle: chapter.subtitle || chapter.title_urdu || ""
      });
      showToast("Article Bookmarked!", "⭐");
    }
    saveBookmarks();
    renderBookmarksDrawerList();
    renderCurrentArticle(); // Refresh bookmark button state
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
          <div style="font-size: 2.2rem; margin-bottom: 8px;">⭐</div>
          <div style="font-weight: 700; margin-bottom: 4px;">No saved bookmarks yet</div>
          <small>Tap the Bookmark button in any article header to save for quick reading.</small>
        </div>
      `;
      return;
    }

    let html = "";
    AppState.bookmarks.forEach(bm => {
      html += `
        <li class="drawer-list-item" data-bm-book="${escapeHTML(bm.bookId)}" data-bm-ch-idx="${bm.chapterIndex}">
          <div style="flex: 1; padding-right: 8px;">
            <div class="item-title" style="font-weight: 700;">${escapeHTML(bm.title)}</div>
            <div class="item-meta">📖 ${escapeHTML(bm.bookTitle)} ${bm.subtitle ? `• ${escapeHTML(bm.subtitle)}` : ''}</div>
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
        const chIdx = parseInt(this.getAttribute("data-bm-ch-idx"), 10) || 0;
        closeDrawers();
        switchToBook(bId, chIdx);
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
          renderCurrentArticle();
        }
      });
    });
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
    book.chapters.forEach((ch, idx) => {
      const isCurrent = (idx === AppState.currentChapterIndex);
      const metaInfo = (ch.hadith_count || ch.masala_count) 
        ? `${ch.hadith_count || 0} Ahadith • ${ch.masala_count || 0} Masail`
        : `Topic ${ch.number}`;

      html += `
        <li class="drawer-list-item toc-item ${isCurrent ? 'active' : ''}" data-ch-idx="${idx}">
          <div style="flex: 1;">
            <div class="item-title">${escapeHTML(ch.title)}</div>
            ${ch.title_urdu ? `<div class="item-meta" style="direction: rtl; font-family: var(--font-arabic); font-size: 0.95rem;">${escapeHTML(ch.title_urdu)}</div>` : ''}
            <div class="item-meta">${metaInfo}</div>
          </div>
          <span style="color: var(--accent-light); font-size: 1.15rem;">›</span>
        </li>
      `;
    });

    DOM.tocList.innerHTML = html;

    DOM.tocList.querySelectorAll(".toc-item").forEach(item => {
      item.addEventListener("click", function () {
        SoundFX.playClick();
        const chIdx = parseInt(this.getAttribute("data-ch-idx"), 10) || 0;
        closeDrawers();
        goToChapter(chIdx);
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
            switchToBook(bId, 0);
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

      // Bookmarks button
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

      // Search deck close button
      if (DOM.searchDeckCloseBtn) {
        DOM.searchDeckCloseBtn.addEventListener("click", () => {
          SoundFX.playClick();
          closeSearchDeck();
        });
      }

      // Overlay clicks
      if (DOM.drawerOverlay) {
        DOM.drawerOverlay.addEventListener("click", closeDrawers);
      }
      if (DOM.searchDeckOverlay) {
        DOM.searchDeckOverlay.addEventListener("click", function (e) {
          if (e.target === this) closeSearchDeck();
        });
      }
      if (DOM.settingsModal) {
        DOM.settingsModal.addEventListener("click", function (e) {
          if (e.target === this) closeModals();
        });
      }

      // Bottom Command Dock Buttons
      if (DOM.dockPrevBtn) {
        DOM.dockPrevBtn.addEventListener("click", () => {
          goToPrevChapter();
        });
      }
      if (DOM.dockNextBtn) {
        DOM.dockNextBtn.addEventListener("click", () => {
          goToNextChapter();
        });
      }
      if (DOM.dockIndicator) {
        DOM.dockIndicator.addEventListener("click", () => {
          SoundFX.playClick();
          openDrawer("toc");
        });
      }

      // Back to top FAB
      if (DOM.fabTop) {
        DOM.fabTop.addEventListener("click", () => {
          SoundFX.playClick();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", () => {
          if (window.scrollY > 300) {
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

  function switchToBook(bookId, chapterIndex = 0) {
    AppState.currentBookId = bookId;
    AppState.currentChapterIndex = chapterIndex;
    AppState.searchQuery = "";
    if (DOM.searchInput) DOM.searchInput.value = "";
    if (DOM.searchClearBtn) DOM.searchClearBtn.classList.remove("visible");

    document.body.setAttribute("data-current-book", bookId);

    // Update active tab UI
    if (DOM.bookTabsContainer) {
      DOM.bookTabsContainer.querySelectorAll(".book-tab").forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-book-id") === bookId);
      });
    }

    renderTOCDrawerList();
    renderCurrentArticle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToChapter(index) {
    const book = getCurrentBook();
    if (!book || !book.chapters) return;
    const clampedIndex = Math.max(0, Math.min(index, book.chapters.length - 1));
    AppState.currentChapterIndex = clampedIndex;
    renderTOCDrawerList();
    renderCurrentArticle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPrevChapter() {
    SoundFX.playClick();
    if (AppState.currentChapterIndex > 0) {
      goToChapter(AppState.currentChapterIndex - 1);
    }
  }

  function goToNextChapter() {
    SoundFX.playClick();
    const book = getCurrentBook();
    if (book && AppState.currentChapterIndex < book.chapters.length - 1) {
      goToChapter(AppState.currentChapterIndex + 1);
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

  function openSearchDeck() {
    if (DOM.searchDeckOverlay) DOM.searchDeckOverlay.classList.add("open");
  }

  function closeSearchDeck() {
    if (DOM.searchDeckOverlay) DOM.searchDeckOverlay.classList.remove("open");
  }

  // ==========================================
  // MODULE: SEAMLESS ARTICLE RENDERING PIPELINE
  // ==========================================
  function renderCurrentArticle() {
    if (!DOM.articleContainer) return;
    const book = getCurrentBook();
    if (!book || !book.chapters || book.chapters.length === 0) {
      DOM.articleContainer.innerHTML = `<div class="empty-state">No book data available</div>`;
      return;
    }

    const chapter = book.chapters[AppState.currentChapterIndex] || book.chapters[0];
    const isBookmarked = isItemBookmarked(chapter.id);
    const totalChapters = book.chapters.length;
    const currentNum = AppState.currentChapterIndex + 1;

    // Build Header HTML
    let headerHTML = `
      <header class="article-header">
        <div class="article-top-meta">
          <span class="book-category-badge">${escapeHTML(book.badge || 'Islamic Classical')}</span>
          <span class="article-seq-indicator">${currentNum} / ${totalChapters}</span>
        </div>
        <h1 class="article-title">${escapeHTML(chapter.title)}</h1>
        ${chapter.title_urdu ? `<div class="article-urdu-title">${escapeHTML(chapter.title_urdu)}</div>` : ''}
        ${chapter.subtitle ? `<div class="article-subtitle">${escapeHTML(chapter.subtitle)}</div>` : ''}
        ${chapter.hawala ? `<div class="article-hawala">📚 ${escapeHTML(chapter.hawala)}</div>` : ''}
        
        <div class="article-actions-bar">
          <button class="article-action-btn btn-primary-action" id="btn-copy-full-article" title="Copy complete article formatted for WhatsApp">
            📋 Copy Full Article
          </button>
          <button class="article-action-btn" id="btn-share-full-article" title="Share complete article to WhatsApp">
            💬 Share WhatsApp
          </button>
          <button class="article-action-btn ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark-article" title="${isBookmarked ? 'Remove Bookmark' : 'Save Article'}">
            ${isBookmarked ? '★ Bookmarked' : '⭐ Bookmark'}
          </button>
        </div>
      </header>
    `;

    // Build Continuous Prose Body HTML
    let proseHTML = `<div class="article-prose">`;

    if (chapter.blocks && Array.isArray(chapter.blocks)) {
      chapter.blocks.forEach(block => {
        if (block.type === "p") {
          proseHTML += `<p class="article-p">${escapeHTML(block.text)}</p>`;
        } else if (block.type === "scripture") {
          proseHTML += `<div class="scripture-box">${escapeHTML(block.text)}</div>`;
        } else if (block.type === "hadith") {
          proseHTML += `
            <div class="ruling-block hadith-block" id="${escapeHTML(block.id)}" data-ruling-id="${escapeHTML(block.id)}">
              <div class="ruling-header">
                <span class="ruling-badge hadith-badge">📜 ${escapeHTML(block.label)}</span>
                <button class="inline-copy-btn btn-copy-ruling" data-ruling-id="${escapeHTML(block.id)}" title="Copy ${escapeHTML(block.label)} for WhatsApp">
                  📋 Copy
                </button>
              </div>
              ${block.scripture ? `<div class="scripture-box">${escapeHTML(block.scripture)}</div>` : ''}
              <div class="ruling-body">${escapeHTML(block.text)}</div>
            </div>
          `;
        } else if (block.type === "masala") {
          proseHTML += `
            <div class="ruling-block masala-block" id="${escapeHTML(block.id)}" data-ruling-id="${escapeHTML(block.id)}">
              <div class="ruling-header">
                <span class="ruling-badge masala-badge">⚖️ ${escapeHTML(block.label)}</span>
                <button class="inline-copy-btn btn-copy-ruling" data-ruling-id="${escapeHTML(block.id)}" title="Copy ${escapeHTML(block.label)} for WhatsApp">
                  📋 Copy
                </button>
              </div>
              ${block.scripture ? `<div class="scripture-box">${escapeHTML(block.scripture)}</div>` : ''}
              <div class="ruling-body">${escapeHTML(block.text)}</div>
            </div>
          `;
        } else if (block.type === "quote") {
          proseHTML += `<blockquote class="article-quote">${escapeHTML(block.text)}</blockquote>`;
        } else if (block.type === "heading") {
          proseHTML += `<h3 class="article-heading">${escapeHTML(block.text)}</h3>`;
        } else if (block.type === "footnote") {
          proseHTML += `<div class="article-footnote">${escapeHTML(block.text)}</div>`;
        }
      });
    }

    proseHTML += `</div>`;

    // Inject into viewport
    DOM.articleContainer.innerHTML = headerHTML + proseHTML;

    // Update Bottom Command Dock
    if (DOM.dockPrevBtn) {
      DOM.dockPrevBtn.disabled = (AppState.currentChapterIndex === 0);
    }
    if (DOM.dockNextBtn) {
      DOM.dockNextBtn.disabled = (AppState.currentChapterIndex === totalChapters - 1);
    }
    if (DOM.dockIndicatorTitle && DOM.dockIndicatorSub) {
      DOM.dockIndicatorTitle.textContent = chapter.title;
      DOM.dockIndicatorSub.textContent = `${currentNum} of ${totalChapters} • Tap for Index`;
    }

    attachArticleEventListeners(book, chapter);
  }

  function attachArticleEventListeners(book, chapter) {
    // Copy Full Article
    const copyFullBtn = document.getElementById("btn-copy-full-article");
    if (copyFullBtn) {
      copyFullBtn.addEventListener("click", () => {
        const text = formatFullArticleForWhatsApp(book, chapter);
        copyToClipboard(text, "Full article copied! Ready for WhatsApp");
      });
    }

    // Share Full Article
    const shareFullBtn = document.getElementById("btn-share-full-article");
    if (shareFullBtn) {
      shareFullBtn.addEventListener("click", () => {
        const text = formatFullArticleForWhatsApp(book, chapter);
        shareDirectWhatsApp(text);
      });
    }

    // Bookmark Article
    const bookmarkBtn = document.getElementById("btn-bookmark-article");
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        toggleArticleBookmark(book, chapter);
      });
    }

    // Inline Ruling Copy Buttons
    DOM.articleContainer.querySelectorAll(".btn-copy-ruling").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const rId = this.getAttribute("data-ruling-id");
        const block = chapter.blocks && chapter.blocks.find(b => b.id === rId);
        if (block) {
          const text = formatRulingForWhatsApp(book, chapter, block);
          copyToClipboard(text, `${block.label} copied! Ready for WhatsApp`);
        }
      });
    });
  }

  // ==========================================
  // MODULE: SEARCH ENGINE & RESULTS DECK
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
          closeSearchDeck();
          DOM.searchInput.focus();
        });
      }
    } catch (err) {
      console.error("[SearchEngine] Error initializing:", err);
    }
  }

  function executeSearch(query) {
    AppState.searchQuery = query;

    if (!query || query.length < 2) {
      closeSearchDeck();
      return;
    }

    const lib = getLibrary();
    const queryLower = query.toLowerCase();
    const results = [];

    // Search across all books
    lib.books.forEach(book => {
      if (!book || !book.chapters) return;
      book.chapters.forEach((ch, chIdx) => {
        const chTitleMatch = ch.title && ch.title.toLowerCase().includes(queryLower);
        const chUrduMatch = ch.title_urdu && ch.title_urdu.includes(query);

        if (ch.blocks && Array.isArray(ch.blocks)) {
          ch.blocks.forEach(block => {
            const textMatch = block.text && block.text.toLowerCase().includes(queryLower);
            const scriptMatch = block.scripture && block.scripture.includes(query);
            const labelMatch = block.label && block.label.toLowerCase().includes(queryLower);

            if (textMatch || scriptMatch || labelMatch || chTitleMatch || chUrduMatch) {
              results.push({
                book: book,
                chapter: ch,
                chapterIndex: chIdx,
                block: block,
                preview: block.text ? block.text.substring(0, 140) + "..." : (block.scripture || "")
              });
            }
          });
        }
      });
    });

    renderSearchDeckResults(results, query);
  }

  function renderSearchDeckResults(results, query) {
    if (!DOM.searchDeckBody || !DOM.searchDeckTitle) return;

    DOM.searchDeckTitle.textContent = `Found ${results.length} results for "${query}"`;

    if (results.length === 0) {
      DOM.searchDeckBody.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <p>No rulings or topics matched "<strong>${escapeHTML(query)}</strong>".</p>
        </div>
      `;
      openSearchDeck();
      return;
    }

    let html = "";
    // Show up to 50 best results
    results.slice(0, 50).forEach(res => {
      const { book, chapter, chapterIndex, block, preview } = res;
      const blockLabel = block.label || (block.type === "scripture" ? "Aayah / Hadees" : "Ruling");

      html += `
        <div class="search-result-card" data-book-id="${escapeHTML(book.id)}" data-ch-idx="${chapterIndex}" data-block-id="${escapeHTML(block.id || '')}">
          <div class="search-result-badge-row">
            <span class="search-result-book">${escapeHTML(book.badge || book.title)}</span>
            <span style="font-size: 0.72rem; color: var(--accent-light); font-weight: 700;">${escapeHTML(blockLabel)}</span>
          </div>
          <div class="search-result-chapter">${highlightMatches(chapter.title, query)}</div>
          <div class="search-result-snippet">${highlightMatches(preview, query)}</div>
        </div>
      `;
    });

    DOM.searchDeckBody.innerHTML = html;
    openSearchDeck();

    // Attach click to jump
    DOM.searchDeckBody.querySelectorAll(".search-result-card").forEach(card => {
      card.addEventListener("click", function () {
        SoundFX.playClick();
        const bId = this.getAttribute("data-book-id");
        const chIdx = parseInt(this.getAttribute("data-ch-idx"), 10) || 0;
        const blockId = this.getAttribute("data-block-id");

        closeSearchDeck();
        switchToBook(bId, chIdx);

        if (blockId) {
          setTimeout(() => {
            const anchor = document.getElementById(blockId);
            if (anchor) {
              anchor.scrollIntoView({ behavior: "smooth", block: "center" });
              anchor.classList.add("target-anchor-highlight");
              setTimeout(() => anchor.classList.remove("target-anchor-highlight"), 2500);
            }
          }, 150);
        }
      });
    });
  }

  // ==========================================
  // DIRECTIVE 5: DEFENSIVE COMPONENT BOOTLOADER
  // ==========================================
  function cacheDOMElements() {
    DOM.bookTabsContainer = document.getElementById("book-tabs-container");
    DOM.articleContainer = document.getElementById("article-viewport");
    DOM.searchInput = document.getElementById("search-input");
    DOM.searchClearBtn = document.getElementById("search-clear-btn");
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

    // Redesigned Bottom Dock & Search Deck Elements
    DOM.dockPrevBtn = document.getElementById("btn-dock-prev");
    DOM.dockNextBtn = document.getElementById("btn-dock-next");
    DOM.dockIndicator = document.getElementById("dock-chapter-indicator");
    DOM.dockIndicatorTitle = document.getElementById("dock-indicator-title");
    DOM.dockIndicatorSub = document.getElementById("dock-indicator-sub");
    DOM.searchDeckOverlay = document.getElementById("search-deck-overlay");
    DOM.searchDeckBody = document.getElementById("search-deck-body");
    DOM.searchDeckTitle = document.getElementById("search-deck-title");
    DOM.searchDeckCloseBtn = document.getElementById("btn-close-search-deck");
  }

  function appBootloader() {
    console.log("🕌 Bootloading Roman Urdu Islamic Library (Seamless Editorial Edition)...");

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

    // 7. Initial Article Render
    try {
      const lib = getLibrary();
      if (lib && lib.books && lib.books.length > 0) {
        switchToBook(AppState.currentBookId, 0);
      } else {
        console.error("No library data found. Ensure library_catalog.js is loaded.");
      }
    } catch (e) {
      console.error("Initial article render error:", e);
    }

    console.log("✨ Roman Islamic Library Seamless Reader Initialized Successfully!");
  }

  // Run bootloader on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", appBootloader);
  } else {
    appBootloader();
  }

})();
