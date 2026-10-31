/**
 * ThemeEngine - Curated Multi-Theme Orchestrator
 * (Cyber / OLED Black / Warm Parchment)
 */
const ThemeEngine = {
  themes: ['cyber', 'oled', 'parchment'],
  themeIcons: {
    cyber: '🌙',
    oled: '🖤',
    parchment: '📜'
  },
  themeLabels: {
    cyber: 'Cyber',
    oled: 'OLED',
    parchment: 'Book'
  },
  init() {
    let saved = 'cyber';
    try {
      saved = localStorage.getItem('quran_theme') || 'cyber';
    } catch(e) {}
    this.applyTheme(saved);
  },
  getTheme() {
    return document.body.getAttribute('data-theme') || 'cyber';
  },
  applyTheme(theme) {
    if (!this.themes.includes(theme)) theme = 'cyber';
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('quran_theme', theme);
    } catch(e) {}
    const iconEl = document.getElementById('theme-toggle-icon');
    const labelEl = document.getElementById('theme-toggle-label');
    if (iconEl) iconEl.textContent = this.themeIcons[theme] || '🌙';
    if (labelEl) labelEl.textContent = this.themeLabels[theme] || 'Theme';
  },
  toggleNextTheme() {
    const curr = this.getTheme();
    const idx = this.themes.indexOf(curr);
    const next = this.themes[(idx + 1) % this.themes.length];
    if (window.AudioSFX) window.AudioSFX.playClick();
    this.applyTheme(next);
  }
};
window.ThemeEngine = ThemeEngine;

// Mobile More Tools Bottom Sheet Controllers
window.openMobileMoreSheet = function() {
  const sheet = document.getElementById("mobile-more-sheet");
  if (sheet) {
    sheet.style.display = "flex";
    setTimeout(() => sheet.classList.add("open"), 10);
    if (window.AudioSFX) window.AudioSFX.playClick();
  }
};

window.closeMobileMoreSheet = function() {
  const sheet = document.getElementById("mobile-more-sheet");
  if (sheet) {
    sheet.classList.remove("open");
    setTimeout(() => { sheet.style.display = "none"; }, 250);
  }
};

/**
 * Quran Deep Analyzer - Master Bootloader & State Orchestrator
 * Defensive Component Bootloader Isolation (Workspace Directive 5)
 */

function switchAppTab(tabName) {
  if (window.AudioSFX) window.AudioSFX.playTab();

  const navBtns = document.querySelectorAll(".nav-tab-btn");
  navBtns.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const tabPanels = document.querySelectorAll(".tab-panel");
  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });

  window.location.hash = tabName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Synchronize mobile bottom dock buttons
  const dockBtns = document.querySelectorAll(".mobile-dock-btn");
  dockBtns.forEach(btn => {
    btn.classList.remove("active");
    if (tabName === "ayahs" && btn.id === "dock-btn-read") btn.classList.add("active");
    else if (tabName === "search" && btn.id === "dock-btn-search") btn.classList.add("active");
    else if (tabName === "commands" && btn.id === "dock-btn-commands") btn.classList.add("active");
    else if (tabName === "manners" && btn.id === "dock-btn-manners") btn.classList.add("active");
    else if (!["ayahs", "search", "commands", "manners"].includes(tabName) && btn.id === "dock-btn-more") btn.classList.add("active");
  });

  // Automatically close mobile bottom sheet on navigation
  if (window.closeMobileMoreSheet) window.closeMobileMoreSheet();

  // Floating Reading Controller visibility (Reader view only)
  const floatCtrl = document.getElementById("reading-floating-controller");
  if (floatCtrl) {
    floatCtrl.style.display = (tabName === "ayahs") ? "flex" : "none";
  }


  // Auto-collapse telemetry banner on reading tabs to maximize vertical reading area
  const banner = document.getElementById("global-metrics-banner");
  const btnIcon = document.getElementById("telemetry-btn-icon");
  const btnText = document.getElementById("telemetry-btn-text");
  const readingTabs = ["search", "ayahs", "roots", "thematic", "mutashabihat", "waqf", "notebook", "manners", "commands"];

  if (tabName === "search" && window.SearchStudioEngine) {
    window.SearchStudioEngine.onActivated();
  }

  if (tabName === "roots" && window.MorphologyEngine) {
    window.MorphologyEngine.onTabActivated();
  }

  if (tabName === "notebook" && window.NotebookEngine) {
    window.NotebookEngine.render();
  }

  if (tabName === "manners" && window.MannersEngine) {
    window.MannersEngine.onTabActivated();
    if (typeof window.MannersEngine.syncQuickScrubber === 'function') {
      window.MannersEngine.syncQuickScrubber();
    }
  }

  if (tabName === "commands" && window.CommandsEngine) {
    window.CommandsEngine.onTabActivated();
    if (typeof window.CommandsEngine.syncQuickScrubber === 'function') {
      window.CommandsEngine.syncQuickScrubber();
    }
  }

  if (tabName === "ayahs" && window.CorpusEngine) {
    if (typeof window.CorpusEngine.syncQuickScrubber === 'function') {
      window.CorpusEngine.syncQuickScrubber();
    }
  }

  // Synchronize High-Velocity QuickScrubber Visibility
  if (window.QuickScrubber) {
    if (tabName === "ayahs" || tabName === "commands" || tabName === "manners") {
      window.QuickScrubber.show();
    } else {
      window.QuickScrubber.hide();
    }
  }

  if (readingTabs.includes(tabName)) {
    if (banner && !banner.classList.contains("user-pinned-open")) {
      banner.classList.add("collapsed");
      if (btnIcon) btnIcon.textContent = "▼";
      if (btnText) btnText.textContent = "Show Telemetry";
    }
  } else {
    if (banner && !banner.classList.contains("user-pinned-closed")) {
      banner.classList.remove("collapsed");
      if (btnIcon) btnIcon.textContent = "▲";
      if (btnText) btnText.textContent = "Collapse Telemetry";
    }
  }

  if (window.NavigationHistory) {
    window.NavigationHistory.updateBanner();
  }
}
window.switchAppTab = switchAppTab;

function initTabs() {
  const navBtns = document.querySelectorAll(".nav-tab-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      if (tabName) {
        switchAppTab(tabName);
      }
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchAppTab(hash);
  }
  // Mobile dock internal tab switches
  const dockRead = document.getElementById("dock-btn-read");
  if (dockRead) {
    dockRead.addEventListener("click", (e) => {
      e.preventDefault();
      switchAppTab("ayahs");
    });
  }
  const dockSearch = document.getElementById("dock-btn-search");
  if (dockSearch) {
    dockSearch.addEventListener("click", (e) => {
      e.preventDefault();
      switchAppTab("search");
    });
  }
  const dockMore = document.getElementById("dock-btn-more");
  if (dockMore) {
    dockMore.addEventListener("click", (e) => {
      e.preventDefault();
      window.openMobileMoreSheet();
    });
  }

  const moreCloseBtn = document.getElementById("more-sheet-close");
  if (moreCloseBtn) {
    moreCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.closeMobileMoreSheet();
    });
  }

  const moreSheetOverlay = document.getElementById("mobile-more-sheet");
  if (moreSheetOverlay) {
    moreSheetOverlay.addEventListener("click", (e) => {
      if (e.target === moreSheetOverlay) {
        window.closeMobileMoreSheet();
      }
    });
  }
  const dockCommands = document.getElementById("dock-btn-commands");
  if (dockCommands) {
    dockCommands.addEventListener("click", (e) => {
      e.preventDefault();
      switchAppTab("commands");
    });
  }
  const dockManners = document.getElementById("dock-btn-manners");
  if (dockManners) {
    dockManners.addEventListener("click", (e) => {
      e.preventDefault();
      switchAppTab("manners");
    });
  }

}

function initModalHandlers() {
  const modal = document.getElementById("occurrence-modal");
  const closeBtn = document.getElementById("occ-modal-close");
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (window.AudioSFX) window.AudioSFX.playClick();
      modal.classList.remove("open");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });
}

const NavigationHistory = {
  stack: [],

  init() {
    const returnBtn = document.getElementById("btn-return-to-origin");
    const stickyReturnBtn = document.getElementById("sticky-return-btn");
    const dismissBtn = document.getElementById("btn-dismiss-return");
    const floatingReturnBtn = document.getElementById("floating-return-pill");

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        this.returnToOrigin();
      });
    }

    if (stickyReturnBtn) {
      stickyReturnBtn.addEventListener("click", () => {
        this.returnToOrigin();
      });
    }

    if (floatingReturnBtn) {
      floatingReturnBtn.addEventListener("click", () => {
        this.returnToOrigin();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.clear();
      });
    }

    // Browser and mobile hardware back navigation support
    window.addEventListener("popstate", (e) => {
      if (this.hasContext()) {
        const currentTab = (document.querySelector(".nav-tab-btn.active") || {}).dataset?.tab;
        if (currentTab === "ayahs") {
          this.returnToOrigin();
        }
      }
    });

    // Keyboard shortcut: Alt+ArrowLeft
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "ArrowLeft") {
        if (this.hasContext()) {
          const currentTab = (document.querySelector(".nav-tab-btn.active") || {}).dataset?.tab;
          if (currentTab === "ayahs") {
            e.preventDefault();
            this.returnToOrigin();
          }
        }
      }
    });

    this.updateBanner();
  },

  pushReturnContext(ctx) {
    const origin = (ctx.originTab === "analytics") ? "studio" : (ctx.originTab || "studio");
    this.stack.push({
      originTab: origin,
      originScrollY: typeof ctx.originScrollY === "number" ? ctx.originScrollY : window.scrollY,
      modalOpen: !!ctx.modalOpen,
      modalScrollTop: ctx.modalScrollTop || 0,
      label: ctx.label || "Previous Location"
    });
    this.updateBanner();

    // Push browser history state for seamless back gesture
    try {
      history.pushState({ isAyahJump: true }, "", "#ayahs");
    } catch (e) {}
  },

  hasContext() {
    return this.stack.length > 0;
  },

  getLatest() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  },

  popContext() {
    return this.stack.pop();
  },

  clear() {
    this.stack = [];
    this.updateBanner();
  },

  updateBanner() {
    const banner = document.getElementById("ayah-return-banner");
    const labelEl = document.getElementById("return-banner-text");
    const stickyReturnBtn = document.getElementById("sticky-return-btn");
    const stickyReturnLabel = document.getElementById("sticky-return-label");
    const returnDivider = document.querySelector(".sticky-divider.return-divider");
    const floatingPill = document.getElementById("floating-return-pill");
    const floatingLabel = document.getElementById("floating-return-label");

    const ctx = this.getLatest();
    const currentTab = (document.querySelector(".nav-tab-btn.active") || {}).dataset?.tab;

    if (ctx && currentTab === "ayahs") {
      if (banner) banner.style.display = "flex";
      if (labelEl) labelEl.textContent = ctx.label;
      if (stickyReturnBtn) {
        stickyReturnBtn.style.display = "inline-flex";
        if (stickyReturnLabel) {
          const shortLabel = ctx.label.length > 20 ? ctx.label.substring(0, 18) + '...' : ctx.label;
          stickyReturnLabel.textContent = `Back: ${shortLabel}`;
        }
      }
      if (returnDivider) returnDivider.style.display = "block";
      if (floatingPill) {
        floatingPill.style.display = "inline-flex";
        if (floatingLabel) {
          const shortLabel = ctx.label.length > 25 ? ctx.label.substring(0, 22) + '...' : ctx.label;
          floatingLabel.textContent = shortLabel;
        }
      }
    } else {
      if (banner) banner.style.display = "none";
      if (stickyReturnBtn) stickyReturnBtn.style.display = "none";
      if (returnDivider) returnDivider.style.display = "none";
      if (floatingPill) floatingPill.style.display = "none";
    }
  },

  returnToOrigin() {
    const ctx = this.popContext();
    if (!ctx) return;

    if (window.AudioSFX) window.AudioSFX.playTab();

    // If navigating back to Quranic Manners standalone app
    if (ctx.originTab === "manners") {
      window.location.href = "manners.html";
      return;
    }
    // If navigating back to Divine Commands standalone app
    if (ctx.originTab === "commands") {
      window.location.href = "commands.html";
      return;
    }

    // 1. Switch back to the origin tab
    const targetTab = (ctx.originTab === "analytics") ? "studio" : (ctx.originTab || "studio");
    if (window.switchAppTab) {
      window.switchAppTab(targetTab);
    }

    // 2. Restore window scroll position and modal state
    setTimeout(() => {
      window.scrollTo({ top: ctx.originScrollY, behavior: "smooth" });

      if (ctx.modalOpen) {
        const modal = document.getElementById("occurrence-modal");
        const modalBody = document.getElementById("occ-modal-body");
        if (modal) {
          modal.classList.add("open");
          if (modalBody && typeof ctx.modalScrollTop === "number") {
            setTimeout(() => {
              modalBody.scrollTop = ctx.modalScrollTop;
            }, 60);
          }
        }
      }
    }, 120);

    this.updateBanner();
  }
};
window.NavigationHistory = NavigationHistory;

function normalizeArabicUrdu(str) {
  if (!str) return "";
  return String(str)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // Diacritics / Harakat
    .replace(/\u0640/g, "") // Tatweel
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // Alif variants
    .replace(/[\u06CC\u0649\u0626]/g, "\u064A") // Yeh variants
    .replace(/\u06A9/g, "\u0643") // Kaf variants
    .replace(/[\u06C1\u06C2\u0629]/g, "\u0647") // Heh variants
    .replace(/\u0624/g, "\u0648") // Waw variants
    .trim()
    .toLowerCase();
}

const FAMOUS_AYAT = [
  { keywords: ["kursi", "kursiy", "كرسي", "الكرسي", "ayatul kursi", "آیت الکرسی"], surah: 2, ayah: 255, name: "Ayat al-Kursi (آيَةُ الْكُرْسِي)", title: "The Throne Verse", subtitle: "Surah Al-Baqarah 2:255 • Master verse of Divine Majesty & Protection" },
  { keywords: ["amanar rasool", "rasul", "امن الرسول", "آمن الرسول"], surah: 2, ayah: 285, name: "Amanar Rasool (آمَنَ الرَّسُولُ)", title: "Closing of Surah Al-Baqarah", subtitle: "Surah Al-Baqarah 2:285–286 • Nightly protection & supplication" },
  { keywords: ["nur", "noor", "نور", "النور", "ayat an-nur"], surah: 24, ayah: 35, name: "Ayat an-Nur (آيَةُ النُّور)", title: "Parable of the Divine Light", subtitle: "Surah An-Nur 24:35 • Allah is the Light of the heavens & earth" },
  { keywords: ["shifa", "شفاء", "healing"], surah: 9, ayah: 14, name: "Ayat ash-Shifa (آيَةُ الشِّفَاء)", title: "Verse of Spiritual & Physical Healing", subtitle: "Surah At-Tawbah 9:14 • Healing for the breasts of believers" },
  { keywords: ["birr", "righteousness", "بر"], surah: 2, ayah: 177, name: "Ayat al-Birr (آيَةُ الْبِرّ)", title: "The Essence of True Righteousness", subtitle: "Surah Al-Baqarah 2:177 • Complete standard of faith, charity & integrity" },
  { keywords: ["mulk", "kingdom", "مالك الملك", "qulillahumma"], surah: 3, ayah: 26, name: "Ayat al-Mulk (آيَةُ الْمُلْك)", title: "Sovereignty of Allah", subtitle: "Surah Ali 'Imran 3:26 • Sovereign Owner of all dominion" }
];

const OmnisearchEngine = {
  isOpen: false,
  activeCategory: "all",
  selectedIndex: -1,
  results: [],

  init() {
    const modal = document.getElementById("omnisearch-modal");
    const openBtn = document.getElementById("open-omnisearch-btn");
    const input = document.getElementById("omnisearch-input");
    const closeBtn = document.getElementById("omnisearch-close-btn");
    const escHint = modal ? modal.querySelector(".omnisearch-esc-hint") : null;
    if (!modal || !input) return;

    if (openBtn) {
      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });
      openBtn.onclick = (e) => {
        e && e.preventDefault && e.preventDefault();
        this.open();
      };
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
      closeBtn.onclick = () => this.close();
    }

    if (escHint) {
      escHint.addEventListener("click", () => this.close());
      escHint.onclick = () => this.close();
    }

    const chips = modal.querySelectorAll(".omni-filter-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeCategory = chip.dataset.cat;
        this.executeSearch(input.value.trim());
      });
    });

    input.addEventListener("input", (e) => {
      const val = e.target.value;
      this.renderTransliterationBar(val);
      this.executeSearch(val.trim());
    });

    const askAiBtn = document.getElementById("omnisearch-ask-ai-btn");
    const settingsBtn = document.getElementById("omnisearch-settings-btn");

    if (askAiBtn) {
      askAiBtn.addEventListener("click", () => this.triggerAISynthesis());
    }
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        if (window.QuranAISearchEngine) window.QuranAISearchEngine.openKeyModal();
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.triggerAISynthesis();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigateResults(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigateResults(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        this.selectResult(this.selectedIndex);
      } else if (e.key === "Escape") {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (typeof window.switchAppTab === "function") {
          window.switchAppTab("search");
          if (window.SearchStudioEngine) window.SearchStudioEngine.onActivated();
        } else if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      } else if (e.key === "/" && !this.isOpen) {
        const activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA" && activeTag !== "SELECT") {
          e.preventDefault();
          if (typeof window.switchAppTab === "function") {
            window.switchAppTab("search");
            if (window.SearchStudioEngine) window.SearchStudioEngine.onActivated();
          } else {
            this.open();
          }
        }
      } else if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.close();
    });
  },

  open() {
    if (typeof window.switchAppTab === "function") {
      window.switchAppTab("search");
      if (window.SearchStudioEngine) window.SearchStudioEngine.onActivated();
      return;
    }
    const modal = document.getElementById("omnisearch-modal");
    const input = document.getElementById("omnisearch-input");
    const aiContainer = document.getElementById("omnisearch-ai-container");
    if (!modal) return;
    this.isOpen = true;
    modal.style.display = "flex";
    if (aiContainer) aiContainer.style.display = "none";
    if (window.AudioSFX) window.AudioSFX.playClick();
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 60);
    }
    this.executeSearch("");
  },

  triggerAISynthesis() {
    const input = document.getElementById("omnisearch-input");
    const aiContainer = document.getElementById("omnisearch-ai-container");
    if (!input || !aiContainer) return;
    const q = input.value.trim();
    if (!q) return;
    if (window.QuranAISearchEngine) {
      window.QuranAISearchEngine.synthesizeGeminiAnswer(q, aiContainer);
    }
  },

  renderTransliterationBar(val) {
    const bar = document.getElementById("omnisearch-transliteration-bar");
    if (!bar) return;
    const q = (val || "").trim();
    if (!q || !window.RomanUrduTranslator) {
      bar.style.display = "none";
      bar.innerHTML = "";
      return;
    }
    const data = window.RomanUrduTranslator.getSmartPills(q);
    if (!data || !data.pills || !data.pills.length) {
      bar.style.display = "none";
      bar.innerHTML = "";
      return;
    }
    const escapeHtml = (str) => String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    bar.style.display = "flex";
    let html = "";
    for (const pill of data.pills) {
      const safeLabel = escapeHtml(pill.label);
      const safeVal = escapeHtml(pill.value || pill.text || "");
      if (pill.type === "lang") {
        html += `<span class="trans-lang-tag">${safeLabel}</span>`;
      } else if (pill.type === "urdu") {
        html += `<button type="button" class="trans-chip-urdu" data-val="${safeVal}" title="1-Tap Search">${safeLabel}</button>`;
      } else if (pill.type === "english") {
        html += `<button type="button" class="trans-chip-en" data-val="${safeVal}" title="1-Tap Search">${safeLabel}</button>`;
      } else if (pill.type === "arabic") {
        html += `<button type="button" class="trans-chip-ar" data-val="${safeVal}" title="1-Tap Search">${safeLabel}</button>`;
      } else if (pill.type === "roman") {
        html += `<button type="button" class="trans-chip-en" data-val="${safeVal}" title="1-Tap Search">${safeLabel}</button>`;
      }
    }

    // Add extra variant pills if available
    if (Array.isArray(data.variants)) {
      for (const v of data.variants.slice(0, 3)) {
        if (v && v !== data.urduScript && v !== data.arabicTerm) {
          const safeV = escapeHtml(v);
          html += `<button type="button" class="trans-chip-variant" data-val="${safeV}" title="Filter variant">${safeV}</button>`;
        }
      }
    }

    bar.innerHTML = html;
    bar.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.AudioSFX) window.AudioSFX.playClick();
        const targetVal = btn.getAttribute("data-val");
        const input = document.getElementById("omnisearch-input");
        if (targetVal && input) {
          input.value = targetVal;
          input.focus();
          this.executeSearch(targetVal);
          this.renderTransliterationBar(targetVal);
        }
      });
    });
  },

  close() {
    const modal = document.getElementById("omnisearch-modal");
    if (!modal) return;
    this.isOpen = false;
    modal.style.display = "none";
    const bar = document.getElementById("omnisearch-transliteration-bar");
    if (bar) {
      bar.style.display = "none";
      bar.innerHTML = "";
    }
  },

  navigateResults(delta) {
    if (this.results.length === 0) return;
    this.selectedIndex = (this.selectedIndex + delta + this.results.length) % this.results.length;
    const items = document.querySelectorAll(".omni-item");
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove("selected");
      }
    });
  },

  selectResult(idx) {
    if (idx < 0 || idx >= this.results.length) {
      if (this.results.length > 0) idx = 0;
      else return;
    }
    const item = this.results[idx];
    if (item && typeof item.action === "function") {
      if (window.AudioSFX) window.AudioSFX.playTab();
      item.action();
      this.close();
    }
  },

  executeSearch(rawQuery) {
    const resultsContainer = document.getElementById("omnisearch-results");
    if (!resultsContainer) return;

    this.results = [];
    this.selectedIndex = -1;
    const q = rawQuery.toLowerCase().trim();
    const qNorm = normalizeArabicUrdu(rawQuery);

    // 0. Empty query default curated views
    if (!q) {
      if (this.activeCategory === "all") {
        // High-value quick shortcuts
        this.results.push({
          category: "Commands",
          categoryClass: "prophet",
          title: "📜 Divine Commands & Injunctions (80 Directives)",
          subtitle: "Health, diet, gentle speech, financial ethics & human flourishing • Jump to Commands Studio",
          action: () => { window.location.href = "commands.html"; }
        });
        this.results.push({
          category: "Manners",
          categoryClass: "prophet",
          title: "🌿 Quranic Manners & Social Ethics (67 Injunctions)",
          subtitle: "Authentic Kanzul Iman Urdu translation across 9 life spheres • Jump to Manners Compendium",
          action: () => { window.location.href = "manners.html"; }
        });
        this.results.push({
          category: "Parallels",
          categoryClass: "surah",
          title: "⚖️ Mutashabihat al-Lafz Concordance (95 Clusters)",
          subtitle: "Explore high-frequency repeated verses, refrain matrices & search filters",
          action: () => { if (window.switchAppTab) window.switchAppTab("mutashabihat"); }
        });
        this.results.push({
          category: "Morphology",
          categoryClass: "word",
          title: "🌿 Root & Morphology Explorer (1,642 Roots)",
          subtitle: "Augmented Verb Forms I–X, participles, verbal nouns & Sarf classifications",
          action: () => { if (window.switchAppTab) window.switchAppTab("roots"); }
        });
        this.results.push({
          category: "Ayah",
          categoryClass: "verse",
          title: "Ayat al-Kursi (آيَةُ الْكُرْسِي) [2:255]",
          subtitle: "Surah Al-Baqarah 2:255 • Master verse of Divine Majesty & Protection",
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(2, 255); }
        });
        this.results.push({
          category: "Surah",
          categoryClass: "surah",
          title: "1. Al-Fatihah (اَلْفَاتِحَة)",
          subtitle: "The Opening • 7 Ayat • 29 Words",
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(1, 1); }
        });
        this.results.push({
          category: "Surah",
          categoryClass: "surah",
          title: "18. Al-Kahf (اَلْـكَهْف)",
          subtitle: "The Cave • 110 Ayat • 1,583 Words • Friday recitation",
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(18, 1); }
        });
        this.results.push({
          category: "Surah",
          categoryClass: "surah",
          title: "36. Ya-Sin (يٰسٓ)",
          subtitle: "The Heart of the Quran • 83 Ayat • 733 Words",
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(36, 1); }
        });
        this.results.push({
          category: "Surah",
          categoryClass: "surah",
          title: "67. Al-Mulk (اَلْمُلْك)",
          subtitle: "The Dominion • 30 Ayat • 337 Words • Nightly protector",
          action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(67, 1); }
        });
      } else if (this.activeCategory === "surahs") {
        const sList = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) || (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.surahsTelemetry) || [];
        sList.slice(0, 16).forEach(s => {
          this.results.push({
            category: `Surah #${s.id}`,
            categoryClass: "surah",
            title: `${s.id}. ${s.name_roman} (${s.name_ar})`,
            subtitle: `${s.place} • ${s.total_ayat} Ayat • ${s.total_words.toLocaleString()} Words`,
            action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(s.id, 1); }
          });
        });
      } else if (this.activeCategory === "paras") {
        const pList = window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras) || [];
        pList.forEach(p => {
          this.results.push({
            category: `Para #${p.para}`,
            categoryClass: "para",
            title: `Para ${p.para}: ${p.name_roman} (${p.name_ar})`,
            subtitle: `Starts at Surah ${p.start_surah}:${p.start_ayah} • Spans ${p.surahs ? p.surahs.length : ''} Surahs`,
            action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToPara(p.para); }
          });
        });
      } else if (this.activeCategory === "ayahs") {
        FAMOUS_AYAT.forEach(fa => {
          this.results.push({
            category: "Famous Ayah",
            categoryClass: "verse",
            title: `${fa.name} [${fa.surah}:${fa.ayah}]`,
            subtitle: fa.subtitle,
            action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(fa.surah, fa.ayah); }
          });
        });
      } else if (this.activeCategory === "prophets") {
        const prophets = (window.QURAN_ADVANCED_ANALYTICS && window.QURAN_ADVANCED_ANALYTICS.entities && window.QURAN_ADVANCED_ANALYTICS.entities.prophets) || [];
        prophets.forEach(p => {
          this.results.push({
            category: "Prophet",
            categoryClass: "prophet",
            title: `Prophet ${p.name_en} (${p.name_ar})`,
            subtitle: `${p.title || ''} • Mentioned ${p.count} times across ${p.surahs_count} Surahs`,
            action: () => {
              if (window.switchAppTab) window.switchAppTab("studio");
              if (window.AnalyticsStudio) {
                window.AnalyticsStudio.switchSubTab("entities");
                window.AnalyticsStudio.switchEntityCategory("prophets");
              }
            }
          });
        });
      } else if (this.activeCategory === "topics") {
        const topics = (window.CorpusEngine && window.CorpusEngine.thematicGraph) || (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.thematicGraph) || [];
        topics.slice(0, 16).forEach(t => {
          this.results.push({
            category: "Theme",
            categoryClass: "theme",
            title: t.heading,
            subtitle: `${t.references_count} Ayat indexed • Matalib al-Quran`,
            action: () => {
              if (window.switchAppTab) window.switchAppTab("thematic");
              if (window.CorpusEngine) {
                window.CorpusEngine.thematicMode = "matalib";
                const sBtn = document.getElementById("thematic-mode-sirat");
                const mBtn = document.getElementById("thematic-mode-matalib");
                if (sBtn && mBtn) { mBtn.classList.add("active"); sBtn.classList.remove("active"); }
                const searchInput = document.getElementById("thematic-search-input");
                if (searchInput) searchInput.value = t.heading;
                window.CorpusEngine.renderThematicGraph(t.heading.toLowerCase());
              }
            }
          });
        });
      } else if (this.activeCategory === "words") {
        const pairs = (window.TelemetryEngine && window.TelemetryEngine.semanticPairs) || [];
        pairs.slice(0, 8).forEach(p => {
          this.results.push({
            category: "Pair",
            categoryClass: "word",
            title: `${p.term1_ar} (${p.term1_count}) ⇄ ${p.term2_ar} (${p.term2_count})`,
            subtitle: `${p.concept} • ${p.is_balanced ? 'Exact 1:1 Symmetrical Parity' : 'Ratio ' + p.ratio + ':1'}`,
            action: () => {
              if (window.switchAppTab) window.switchAppTab("frequency");
              if (window.TelemetryEngine) {
                window.TelemetryEngine.currentMode = "semantic";
                const sBtns = document.querySelectorAll(".freq-filter-btn");
                sBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === "semantic"));
                window.TelemetryEngine.render();
              }
            }
          });
        });
      }
      this.renderOmnisearchItems(resultsContainer, rawQuery);
      return;
    }

    // 1. Flexible Coordinate Pattern (e.g. "2:255", "surah 2:255", "2 255", "surah 18 ayah 10")
    const coordMatch = rawQuery.match(/(?:surah\s*)?(\d{1,3})\s*[:\s,]\s*(?:ayah\s*)?(\d{1,3})/i);
    if (coordMatch) {
      const sId = parseInt(coordMatch[1], 10);
      const aNo = parseInt(coordMatch[2], 10);
      if (sId >= 1 && sId <= 114) {
        const surahs = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) || (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.surahsTelemetry) || [];
        const surah = surahs.find(s => s.id === sId);
        const sName = surah ? surah.name_roman : `Surah ${sId}`;
        this.results.push({
          category: "Verse",
          categoryClass: "verse",
          title: `Jump to Surah ${sName} : Ayah ${aNo}`,
          subtitle: `Direct Scripture Coordinate [${sId}:${aNo}]`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(sId, aNo);
          }
        });
      }
    }

    // 2. Famous Ayat Keyword Recognition
    FAMOUS_AYAT.forEach(fa => {
      const isMatch = fa.keywords.some(k => q.includes(k) || (qNorm && normalizeArabicUrdu(k).includes(qNorm)));
      if (isMatch) {
        if (!this.results.some(r => r.title && r.title.includes(`[${fa.surah}:${fa.ayah}]`))) {
          this.results.push({
            category: "Famous Ayah",
            categoryClass: "verse",
            title: `${fa.name} [${fa.surah}:${fa.ayah}]`,
            subtitle: fa.subtitle,
            action: () => { if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(fa.surah, fa.ayah); }
          });
        }
      }
    });

    // 3. Module & Portal Keywords
    if (q.includes("manner") || q.includes("adab") || q.includes("akhlaq") || qNorm.includes(normalizeArabicUrdu("ادب")) || qNorm.includes(normalizeArabicUrdu("اخلاق"))) {
      this.results.push({
        category: "Manners",
        categoryClass: "prophet",
        title: "🌿 Quranic Manners & Social Ethics (67 Injunctions)",
        subtitle: "Authentic Kanzul Iman Urdu translation across 9 life spheres • Standalone PWA Viewer",
        action: () => { window.location.href = "manners.html"; }
      });
    }

    if (q.includes("mutashab") || q.includes("parallel") || q.includes("refrain") || qNorm.includes(normalizeArabicUrdu("متشابہ"))) {
      this.results.push({
        category: "Parallels",
        categoryClass: "surah",
        title: "⚖️ Mutashabihat al-Lafz Concordance (95 Clusters)",
        subtitle: "Explore repeated verses, refrain matrix grids & instant cluster search",
        action: () => { if (window.switchAppTab) window.switchAppTab("mutashabihat"); }
      });
    }

    if (q.includes("waqf") || q.includes("stop") || q.includes("pause") || qNorm.includes(normalizeArabicUrdu("وقف"))) {
      this.results.push({
        category: "Waqf",
        categoryClass: "theme",
        title: "⏸️ Phonetic & Stopping Science (Waqf)",
        subtitle: "15 Quranic stopping symbols, definitions & recitation rules",
        action: () => { if (window.switchAppTab) window.switchAppTab("waqf"); }
      });
    }

    if (q.includes("root") || q.includes("sarf") || q.includes("morph") || qNorm.includes(normalizeArabicUrdu("صرف"))) {
      this.results.push({
        category: "Morphology",
        categoryClass: "word",
        title: "🌿 Root & Morphology Explorer (علم الصرف)",
        subtitle: "Derivational analysis of 1,642 roots into Verb Forms I–X, participles & verbal nouns",
        action: () => { if (window.switchAppTab) window.switchAppTab("roots"); }
      });
    }

    // 4. Paras (Juz 1-30) Query Matching
    if (this.activeCategory === "all" || this.activeCategory === "paras") {
      const pList = window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras) || [];
      const matchedParas = pList.filter(p => {
        const nameNorm = (p.name_roman || "").toLowerCase().replace(/-/g, " ");
        const arNorm = normalizeArabicUrdu(p.name_ar);
        const qClean = q.replace(/-/g, " ");
        return nameNorm.includes(qClean) ||
               (arNorm && arNorm.includes(qNorm)) ||
               String(p.para) === q ||
               q === `para ${p.para}` ||
               q === `juz ${p.para}`;
      }).slice(0, (this.activeCategory === "paras" ? 30 : 4));

      matchedParas.forEach(p => {
        if (this.results.some(r => r.title && r.title.includes(`Para ${p.para}:`))) return;
        this.results.push({
          category: `Para #${p.para}`,
          categoryClass: "para",
          title: `Para ${p.para}: ${p.name_roman} (${p.name_ar})`,
          subtitle: `Starts at Surah ${p.start_surah}:${p.start_ayah} • Spans ${p.surahs ? p.surahs.length : ''} Surahs`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToPara(p.para);
          }
        });
      });
    }

    // 5. Surahs Query Matching (Arabic normalized, Roman, English meaning, number)
    if (this.activeCategory === "all" || this.activeCategory === "surahs") {
      const surahs = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry) || (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.surahsTelemetry) || [];
      const matchedSurahs = surahs.filter(s => {
        const nameNorm = (s.name_roman || "").toLowerCase().replace(/-/g, " ");
        const arNorm = normalizeArabicUrdu(s.name_ar);
        const qClean = q.replace(/-/g, " ");
        return nameNorm.includes(qClean) ||
               (arNorm && arNorm.includes(qNorm)) ||
               String(s.id) === q ||
               (s.meaning_en && s.meaning_en.toLowerCase().includes(q));
      }).slice(0, (this.activeCategory === "surahs" ? 25 : 8));

      matchedSurahs.forEach(s => {
        if (this.results.some(r => r.title && r.title.startsWith(`${s.id}. `))) return;
        this.results.push({
          category: `Surah #${s.id}`,
          categoryClass: "surah",
          title: `${s.id}. ${s.name_roman} (${s.name_ar})`,
          subtitle: `${s.place} • ${s.total_ayat} Ayat • ${s.total_words.toLocaleString()} Words • ${s.meaning_en || ''}`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(s.id, 1);
          }
        });
      });
    }

    // 6. Prophets & Sacred Figures
    if (this.activeCategory === "all" || this.activeCategory === "prophets") {
      const prophets = (window.QURAN_ADVANCED_ANALYTICS && window.QURAN_ADVANCED_ANALYTICS.entities && window.QURAN_ADVANCED_ANALYTICS.entities.prophets) || [];
      const matched = prophets.filter(p => {
        const arNorm = normalizeArabicUrdu(p.name_ar);
        return p.name_en.toLowerCase().includes(q) ||
               (arNorm && arNorm.includes(qNorm)) ||
               (p.title && p.title.toLowerCase().includes(q));
      }).slice(0, (this.activeCategory === "prophets" ? 26 : 5));

      matched.forEach(p => {
        this.results.push({
          category: "Prophet",
          categoryClass: "prophet",
          title: `Prophet ${p.name_en} (${p.name_ar})`,
          subtitle: `${p.title || ''} • Mentioned ${p.count} times across ${p.surahs_count} Surahs`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("studio");
            if (window.AnalyticsStudio) {
              window.AnalyticsStudio.switchSubTab("entities");
              window.AnalyticsStudio.switchEntityCategory("prophets");
            }
          }
        });
      });
    }

    // 7. Thematic Topics (Matalib al-Quran & Sirat-ul-Jinan)
    if (this.activeCategory === "all" || this.activeCategory === "topics") {
      const matalibTopics = (window.CorpusEngine && window.CorpusEngine.thematicGraph) || (window.QURAN_CORE_DATA && window.QURAN_CORE_DATA.thematicGraph) || [];
      const matchedMatalib = matalibTopics.filter(t => {
        const hNorm = normalizeArabicUrdu(t.heading);
        return t.heading.toLowerCase().includes(q) || (hNorm && hNorm.includes(qNorm));
      }).slice(0, 6);

      matchedMatalib.forEach(t => {
        this.results.push({
          category: "Theme",
          categoryClass: "theme",
          title: t.heading,
          subtitle: `${t.references_count} Ayat indexed • Matalib al-Quran`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("thematic");
            if (window.CorpusEngine) {
              window.CorpusEngine.thematicMode = "matalib";
              const sBtn = document.getElementById("thematic-mode-sirat");
              const mBtn = document.getElementById("thematic-mode-matalib");
              if (sBtn && mBtn) { mBtn.classList.add("active"); sBtn.classList.remove("active"); }
              const searchInput = document.getElementById("thematic-search-input");
              if (searchInput) searchInput.value = t.heading;
              window.CorpusEngine.renderThematicGraph(t.heading.toLowerCase());
            }
          }
        });
      });

      const exeTopics = (window.CorpusEngine && window.CorpusEngine.exegeticalTopics) || window.QURAN_EXEGETICAL_TOPICS || [];
      const matchedExe = exeTopics.filter(t => {
        const hNorm = normalizeArabicUrdu(t.heading);
        return (t.heading && (t.heading.toLowerCase().includes(q) || (hNorm && hNorm.includes(qNorm)))) ||
               (t.roman_heading && t.roman_heading.toLowerCase().includes(q)) ||
               (t.surah_name && t.surah_name.toLowerCase().includes(q));
      }).slice(0, 6);

      matchedExe.forEach(t => {
        const ref = (t.references && t.references[0]) || { surah_id: 1, ayat_number: 1, para_id: 1 };
        this.results.push({
          category: "Exegesis",
          categoryClass: "theme",
          title: t.heading,
          subtitle: `${t.roman_heading ? t.roman_heading + ' • ' : ''}Surah ${ref.surah_id}:${ref.ayat_number} (Para ${ref.para_id})`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("thematic");
            if (window.CorpusEngine) {
              window.CorpusEngine.thematicMode = "sirat";
              const sBtn = document.getElementById("thematic-mode-sirat");
              const mBtn = document.getElementById("thematic-mode-matalib");
              if (sBtn && mBtn) { sBtn.classList.add("active"); mBtn.classList.remove("active"); }
              const searchInput = document.getElementById("thematic-search-input");
              if (searchInput) searchInput.value = t.heading;
              window.CorpusEngine.renderThematicGraph(t.heading.toLowerCase());
            }
          }
        });
      });
    }

    // 8. Semantic Pairs & Roots
    if (this.activeCategory === "all" || this.activeCategory === "words") {
      const pairs = (window.TelemetryEngine && window.TelemetryEngine.semanticPairs) || [];
      const matchedPairs = pairs.filter(p => {
        const t1Norm = normalizeArabicUrdu(p.term1_ar);
        const t2Norm = normalizeArabicUrdu(p.term2_ar);
        return (p.concept && p.concept.toLowerCase().includes(q)) ||
               (p.term1_label && p.term1_label.toLowerCase().includes(q)) ||
               (p.term2_label && p.term2_label.toLowerCase().includes(q)) ||
               (t1Norm && t1Norm.includes(qNorm)) ||
               (t2Norm && t2Norm.includes(qNorm));
      }).slice(0, 4);

      matchedPairs.forEach(p => {
        this.results.push({
          category: "Pair",
          categoryClass: "word",
          title: `${p.term1_ar} (${p.term1_count}) ⇄ ${p.term2_ar} (${p.term2_count})`,
          subtitle: `${p.concept} • ${p.is_balanced ? 'Exact 1:1 Symmetrical Parity' : 'Ratio ' + p.ratio + ':1'}`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("frequency");
            if (window.TelemetryEngine) {
              window.TelemetryEngine.currentMode = "semantic";
              const sBtns = document.querySelectorAll(".freq-filter-btn");
              sBtns.forEach(b => b.classList.toggle("active", b.dataset.mode === "semantic"));
              window.TelemetryEngine.render();
            }
          }
        });
      });

      const rootsList = (window.MorphologyEngine && window.MorphologyEngine.allRoots && window.MorphologyEngine.allRoots.length)
        ? window.MorphologyEngine.allRoots
        : (window.QURAN_ROOTS || []);
      const matchedRoots = rootsList.filter(r => {
        const rNorm = normalizeArabicUrdu(r.root_ar);
        return (rNorm && rNorm.includes(qNorm)) ||
               (r.root_bw && r.root_bw.toLowerCase().includes(q)) ||
               (r.meaning_en && r.meaning_en.toLowerCase().includes(q)) ||
               (r.meaning_ur && r.meaning_ur.toLowerCase().includes(q));
      }).slice(0, 5);

      matchedRoots.forEach(r => {
        this.results.push({
          category: "Root",
          categoryClass: "prophet",
          title: `Root ${r.root_display || r.root_ar} (${r.meaning_en})`,
          subtitle: `${r.meaning_ur || ''} • ${(r.total_occurrences || r.occurrences || 0).toLocaleString()} Ayat in Quran`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("roots");
            if (window.MorphologyEngine) {
              window.MorphologyEngine.onTabActivated().then(() => {
                window.MorphologyEngine.openRootInspector(r.root_bw);
              });
            }
          }
        });
      });
    }

    // 9. Sub-millisecond BM25 Probabilistic Ranking & Ayah Translation Search
    if (window.QuranAISearchEngine) {
      const limit = this.activeCategory === 'ayahs' ? 50 : 35;
      const bm25Matches = window.QuranAISearchEngine.search(rawQuery, this.activeCategory, limit);

      if (this.activeCategory === 'ayahs') {
        this.results = bm25Matches;
      } else {
        const highMatches = [];
        const lowMatches = [];
        bm25Matches.forEach(bm => {
          if (!this.results.some(r => r.title === bm.title)) {
            if (bm.score >= 30.0) {
              highMatches.push(bm);
            } else {
              lowMatches.push(bm);
            }
          }
        });
        // Insert high matches near the top (after any exact coordinate match)
        const insertIdx = (this.results.length > 0 && this.results[0].category === 'Verse' && this.results[0].title.startsWith('Jump to')) ? 1 : 0;
        this.results.splice(insertIdx, 0, ...highMatches);
        this.results.push(...lowMatches);
      }
    }

    this.renderOmnisearchItems(resultsContainer, rawQuery);
  },

  renderOmnisearchItems(resultsContainer, rawQuery) {
    if (this.results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-dim); font-size: 0.9rem;">
          <p style="margin-bottom: 6px;">No matches found for "${rawQuery}"</p>
          <span style="font-size: 0.78rem; color: #64748b;">Try searching for English phrases ("straight path", "mercy"), Surahs ("Kahf", "18"), coordinates ("2:255"), or topics.</span>
        </div>
      `;
      return;
    }

    let html = "";
    this.results.forEach((item, idx) => {
      if (item.categoryType === 'ayahs') {
        const highlightedEn = window.QuranAISearchEngine
          ? window.QuranAISearchEngine.highlightMatches(item.subtitle, rawQuery)
          : item.subtitle;
        const highlightedAr = item.arabic || '';
        const highlightedUr = (item.urdu && item.urdu !== item.subtitle) ? item.urdu : '';

        html += `
          <div class="omni-item omni-item-ayah-luxury" data-index="${idx}">
            <div class="omni-ayah-card-body">
              <div class="omni-ayah-card-header">
                <div class="omni-ayah-pill-wrap">
                  <span class="omni-category-badge verse">Ayah</span>
                  <span class="omni-ayah-coord-pill">${item.title}</span>
                </div>
                <span class="omni-ayah-jump-hint">📖 Read in Analyzer ↗</span>
              </div>
              ${highlightedAr ? `<div class="omni-ayah-card-arabic" dir="rtl">${highlightedAr}</div>` : ''}
              <div class="omni-ayah-card-trans">${highlightedEn}</div>
              ${highlightedUr ? `<div class="omni-ayah-card-urdu" dir="rtl">${highlightedUr}</div>` : ''}
            </div>
          </div>
        `;
      } else {
        const highlightedTitle = window.QuranAISearchEngine
          ? window.QuranAISearchEngine.highlightMatches(item.title, rawQuery)
          : item.title;
        const highlightedSub = window.QuranAISearchEngine
          ? window.QuranAISearchEngine.highlightMatches(item.subtitle, rawQuery)
          : item.subtitle;

        html += `
          <div class="omni-item" data-index="${idx}">
            <div class="omni-item-left">
              <span class="omni-category-badge ${item.categoryClass || 'word'}">${item.category}</span>
              <div style="min-width: 0;">
                <div class="omni-item-title">${highlightedTitle}</div>
                <div class="omni-item-desc">${highlightedSub}</div>
              </div>
            </div>
            <div class="omni-item-right">↵</div>
          </div>
        `;
      }
    });
    resultsContainer.innerHTML = html;

    resultsContainer.querySelectorAll(".omni-item").forEach((el, idx) => {
      el.addEventListener("click", () => this.selectResult(idx));
      el.addEventListener("mouseenter", () => {
        this.selectedIndex = idx;
        resultsContainer.querySelectorAll(".omni-item").forEach((item, i) => {
          item.classList.toggle("selected", i === idx);
        });
      });
    });

    if (this.results.length > 0) {
      this.selectedIndex = 0;
      const first = resultsContainer.querySelector(".omni-item");
      if (first) first.classList.add("selected");
    }
  }
};
window.OmnisearchEngine = OmnisearchEngine;
window.openOmnisearch = () => OmnisearchEngine.open();
window.closeOmnisearch = () => OmnisearchEngine.close();

function initTelemetryToolbar() {
  const toggleBtn = document.getElementById("toggle-telemetry-btn");
  const banner = document.getElementById("global-metrics-banner");
  const btnIcon = document.getElementById("telemetry-btn-icon");
  const btnText = document.getElementById("telemetry-btn-text");
  if (!toggleBtn || !banner) return;

  toggleBtn.addEventListener("click", () => {
    if (window.AudioSFX) window.AudioSFX.playClick();
    const isCollapsed = banner.classList.contains("collapsed");
    if (isCollapsed) {
      banner.classList.remove("collapsed");
      banner.classList.remove("user-pinned-closed");
      banner.classList.add("user-pinned-open");
      if (btnIcon) btnIcon.textContent = "▲";
      if (btnText) btnText.textContent = "Collapse Telemetry";
    } else {
      banner.classList.add("collapsed");
      banner.classList.remove("user-pinned-open");
      banner.classList.add("user-pinned-closed");
      if (btnIcon) btnIcon.textContent = "▼";
      if (btnText) btnText.textContent = "Show Telemetry";
    }
  });
}

function bootApp() {
  // Horizontal mouse-wheel delegation for sleek single-row tab ribbon
  try {
    const navTier = document.querySelector('nav.app-nav-tier');
    if (navTier) {
      navTier.addEventListener('wheel', (evt) => {
        if (evt.deltaY !== 0 && navTier.scrollWidth > navTier.clientWidth) {
          evt.preventDefault();
          navTier.scrollLeft += evt.deltaY;
        }
      }, { passive: false });
    }
  } catch(e) {}

  console.log("[BOOT] Starting Quran Deep Analyzer bootloader...");

  const modules = [
    { name: "ThemeEngine", init: () => window.ThemeEngine && window.ThemeEngine.init() },
    { name: "AudioSFX", init: () => window.AudioSFX && window.AudioSFX.init() },
    { name: "Tabs", init: () => initTabs() },
    { name: "TelemetryToolbar", init: () => initTelemetryToolbar() },
    { name: "ModalHandlers", init: () => initModalHandlers() },
    { name: "QuranAISearchEngine", init: () => window.QuranAISearchEngine && window.QuranAISearchEngine.init() },
    { name: "OmnisearchEngine", init: () => window.OmnisearchEngine && window.OmnisearchEngine.init() },
    { name: "NavigationHistory", init: () => window.NavigationHistory && window.NavigationHistory.init() },
    { name: "TelemetryEngine", init: () => window.TelemetryEngine && window.TelemetryEngine.init() },
    { name: "CorpusEngine", init: () => window.CorpusEngine && window.CorpusEngine.init() },
    { name: "AnalyticsStudio", init: () => window.AnalyticsStudio && window.AnalyticsStudio.init() },
    { name: "MorphologyEngine", init: () => window.MorphologyEngine && window.MorphologyEngine.init() },
    { name: "AudioTartilCompanion", init: () => window.AudioTartilCompanion && window.AudioTartilCompanion.init() },
    { name: "TajweedEngine", init: () => window.TajweedEngine && window.TajweedEngine.init() },
    { name: "NotebookEngine", init: () => window.NotebookEngine && window.NotebookEngine.init() },
    { name: "CommandsEngine", init: () => window.CommandsEngine && window.CommandsEngine.init() },
    { name: "MannersEngine", init: () => window.MannersEngine && window.MannersEngine.init() }
  ];

  modules.forEach(mod => {
    try {
      mod.init();
      console.log(`[BOOT] ✓ ${mod.name} initialized successfully.`);
    } catch (err) {
      console.error(`[CRITICAL] Failure in module ${mod.name}:`, err);
    }
  });

  console.log("[BOOT] Application successfully mounted.");

  // Ensure correct tab & QuickScrubber context if hash was specified
  try {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`tab-${hash}`)) {
      switchAppTab(hash);
    }
  } catch(e) {}

  // Handle URL parameters for deep-linking (e.g. from manners.html?surah=2&ayah=83#ayahs)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const surahParam = urlParams.get("surah");
    const ayahParam = urlParams.get("ayah");
    const fromParam = urlParams.get("from");
    if (surahParam && window.CorpusEngine) {
      const sId = parseInt(surahParam, 10);
      const aNum = ayahParam ? parseInt(ayahParam, 10) : 1;
      if (window.NavigationHistory) {
        let originTab = "search";
        let label = "Previous Location";
        if (fromParam === "manners") {
          originTab = "manners";
          label = "Quranic Manners (67)";
        } else if (fromParam === "commands") {
          originTab = "commands";
          label = "Divine Commands (80)";
        }
        window.NavigationHistory.pushReturnContext({
          originTab,
          originScrollY: 0,
          label
        });
      }
      setTimeout(() => {
        window.CorpusEngine.jumpToAyah(sId, aNum);
      }, 250);
    }
  } catch (e) {
    console.warn("[BOOT] Deep link parse warning:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}
