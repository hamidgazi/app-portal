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

  // Auto-collapse telemetry banner on reading tabs to maximize vertical reading area
  const banner = document.getElementById("global-metrics-banner");
  const btnIcon = document.getElementById("telemetry-btn-icon");
  const btnText = document.getElementById("telemetry-btn-text");
  const readingTabs = ["ayahs", "thematic", "mutashabihat", "waqf"];

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
}
window.switchAppTab = switchAppTab;

function initTabs() {
  const navBtns = document.querySelectorAll(".nav-tab-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      switchAppTab(tabName);
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`tab-${hash}`)) {
    switchAppTab(hash);
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

const OmnisearchEngine = {
  isOpen: false,
  activeCategory: "all",
  selectedIndex: -1,
  results: [],

  init() {
    const modal = document.getElementById("omnisearch-modal");
    const openBtn = document.getElementById("open-omnisearch-btn");
    const input = document.getElementById("omnisearch-input");
    if (!modal || !input) return;

    if (openBtn) {
      openBtn.addEventListener("click", () => this.open());
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
      this.executeSearch(e.target.value.trim());
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
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
        if (this.isOpen) this.close();
        else this.open();
      } else if (e.key === "/" && !this.isOpen) {
        const activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA" && activeTag !== "SELECT") {
          e.preventDefault();
          this.open();
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
    const modal = document.getElementById("omnisearch-modal");
    const input = document.getElementById("omnisearch-input");
    if (!modal) return;
    this.isOpen = true;
    modal.style.display = "flex";
    if (window.AudioSFX) window.AudioSFX.playClick();
    if (input) {
      input.value = "";
      input.focus();
    }
    this.executeSearch("");
  },

  close() {
    const modal = document.getElementById("omnisearch-modal");
    if (!modal) return;
    this.isOpen = false;
    modal.style.display = "none";
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
    const q = rawQuery.toLowerCase();

    // 1. Coordinate Pattern
    const coordMatch = rawQuery.match(/^(\d{1,3})[:,\s]+(\d{1,3})$/);
    if (coordMatch) {
      const sId = parseInt(coordMatch[1], 10);
      const aNo = parseInt(coordMatch[2], 10);
      if (sId >= 1 && sId <= 114) {
        const surah = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry)
          ? window.CorpusEngine.surahsTelemetry.find(s => s.id === sId) : null;
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

    // 2. Direct Para / Juz Pattern
    const paraMatch = rawQuery.match(/^(?:para|juz|p|پارہ)\s*(\d{1,2})$/i);
    if (paraMatch) {
      const pNum = parseInt(paraMatch[1], 10);
      if (pNum >= 1 && pNum <= 30) {
        const pList = window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras) || [];
        const pObj = pList.find(p => p.para === pNum);
        if (pObj) {
          const startSurah = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry)
            ? window.CorpusEngine.surahsTelemetry.find(s => s.id === pObj.start_surah) : null;
          const sName = startSurah ? startSurah.name_roman : `Surah ${pObj.start_surah}`;
          this.results.push({
            category: `Para #${pObj.para}`,
            categoryClass: "para",
            title: `Jump to Para ${pObj.para}: ${pObj.name_roman} (${pObj.name_ar})`,
            subtitle: `Starts at Surah ${sName} ${pObj.start_surah}:${pObj.start_ayah} • Spans ${pObj.surahs ? pObj.surahs.length : ''} Surahs`,
            action: () => {
              if (window.CorpusEngine) window.CorpusEngine.jumpToPara(pObj.para);
            }
          });
        }
      }
    }

    // 3. Paras (Juz 1-30) Query Matching
    if ((this.activeCategory === "all" || this.activeCategory === "paras") && (window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras))) {
      const pList = window.QURAN_PARAS || (window.CorpusEngine && window.CorpusEngine.paras) || [];
      const matchedParas = pList.filter(p => {
        if (!q) return this.activeCategory === "paras";
        const nameNorm = (p.name_roman || "").toLowerCase().replace(/-/g, " ");
        const qNorm = q.replace(/-/g, " ");
        return nameNorm.includes(qNorm) ||
               (p.name_ar && p.name_ar.includes(rawQuery)) ||
               String(p.para) === q ||
               q.startsWith("para") ||
               q.startsWith("juz") ||
               rawQuery.includes("پارہ");
      }).slice(0, (this.activeCategory === "paras" ? 30 : 4));

      matchedParas.forEach(p => {
        if (this.results.some(r => r.title && r.title.includes(`Para ${p.para}:`))) return;
        const startSurah = (window.CorpusEngine && window.CorpusEngine.surahsTelemetry)
          ? window.CorpusEngine.surahsTelemetry.find(s => s.id === p.start_surah) : null;
        const sName = startSurah ? startSurah.name_roman : `Surah ${p.start_surah}`;
        this.results.push({
          category: `Para #${p.para}`,
          categoryClass: "para",
          title: `Para ${p.para}: ${p.name_roman} (${p.name_ar})`,
          subtitle: `Starts at Surah ${sName} ${p.start_surah}:${p.start_ayah} • Spans ${p.surahs ? p.surahs.length : ''} Surahs`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToPara(p.para);
          }
        });
      });
    }

    // 4. Surahs
    if ((this.activeCategory === "all" || this.activeCategory === "surahs") && window.CorpusEngine && window.CorpusEngine.surahsTelemetry) {
      const matchedSurahs = window.CorpusEngine.surahsTelemetry.filter(s => {
        if (!q) return true;
        const nameNorm = (s.name_roman || "").toLowerCase().replace(/-/g, " ");
        const qNorm = q.replace(/-/g, " ");
        return nameNorm.includes(qNorm) ||
               (s.name_ar && s.name_ar.includes(rawQuery)) ||
               String(s.id) === q ||
               (s.meaning_en && s.meaning_en.toLowerCase().includes(q));
      }).slice(0, (q ? 8 : 4));

      matchedSurahs.forEach(s => {
        this.results.push({
          category: `Surah #${s.id}`,
          categoryClass: "surah",
          title: `${s.id}. ${s.name_roman} (${s.name_ar})`,
          subtitle: `${s.place} • ${s.total_ayat} Ayat • ${s.total_words.toLocaleString()} Words`,
          action: () => {
            if (window.CorpusEngine) window.CorpusEngine.jumpToAyah(s.id, 1);
          }
        });
      });
    }

    // 3. Prophets & Sacred Figures
    if ((this.activeCategory === "all" || this.activeCategory === "prophets") && window.QURAN_ADVANCED_ANALYTICS && window.QURAN_ADVANCED_ANALYTICS.entities) {
      const prophets = window.QURAN_ADVANCED_ANALYTICS.entities.prophets || [];
      const matched = prophets.filter(p => {
        if (!q) return false;
        return p.name_en.toLowerCase().includes(q) ||
               p.name_ar.includes(rawQuery) ||
               (p.title && p.title.toLowerCase().includes(q));
      }).slice(0, 5);

      matched.forEach(p => {
        this.results.push({
          category: "Prophet",
          categoryClass: "prophet",
          title: `Prophet ${p.name_en} (${p.name_ar})`,
          subtitle: `${p.title} • Mentioned ${p.count} times across ${p.surahs_count} Surahs`,
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

    // 4. Thematic Topics (Matalib al-Quran)
    if ((this.activeCategory === "all" || this.activeCategory === "topics") && window.CorpusEngine && window.CorpusEngine.thematicGraph) {
      const matchedTopics = window.CorpusEngine.thematicGraph.filter(t => {
        if (!q) return false;
        return t.heading.toLowerCase().includes(q);
      }).slice(0, 6);

      matchedTopics.forEach(t => {
        this.results.push({
          category: "Theme",
          categoryClass: "theme",
          title: t.heading,
          subtitle: `${t.references_count} Ayat indexed • Matalib al-Quran`,
          action: () => {
            if (window.switchAppTab) window.switchAppTab("thematic");
            const searchInput = document.getElementById("thematic-search-input");
            if (searchInput) searchInput.value = t.heading;
            if (window.CorpusEngine) window.CorpusEngine.renderThematicGraph(t.heading.toLowerCase());
          }
        });
      });
    }

    // 5. Semantic Pairs
    if ((this.activeCategory === "all" || this.activeCategory === "words") && window.TelemetryEngine && window.TelemetryEngine.semanticPairs) {
      const matchedPairs = window.TelemetryEngine.semanticPairs.filter(p => {
        if (!q) return false;
        return (p.concept && p.concept.toLowerCase().includes(q)) ||
               (p.term1_label && p.term1_label.toLowerCase().includes(q)) ||
               (p.term2_label && p.term2_label.toLowerCase().includes(q)) ||
               (p.term1_ar && p.term1_ar.includes(rawQuery)) ||
               (p.term2_ar && p.term2_ar.includes(rawQuery));
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
    }

    if (this.results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-dim); font-size: 0.9rem;">
          <p style="margin-bottom: 6px;">No results found for "${rawQuery}"</p>
          <span style="font-size: 0.78rem; color: #64748b;">Try searching for a Surah ("Kahf", "18"), coordinate ("2:255"), or Prophet ("Musa").</span>
        </div>
      `;
      return;
    }

    let html = "";
    this.results.forEach((item, idx) => {
      html += `
        <div class="omni-item" data-index="${idx}">
          <div class="omni-item-left">
            <span class="omni-category-badge ${item.categoryClass || 'word'}">${item.category}</span>
            <div style="min-width: 0;">
              <div class="omni-item-title">${item.title}</div>
              <div class="omni-item-desc">${item.subtitle}</div>
            </div>
          </div>
          <div class="omni-item-right">↵</div>
        </div>
      `;
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
  console.log("[BOOT] Starting Quran Deep Analyzer bootloader...");

  const modules = [
    { name: "AudioSFX", init: () => window.AudioSFX && window.AudioSFX.init() },
    { name: "Tabs", init: () => initTabs() },
    { name: "TelemetryToolbar", init: () => initTelemetryToolbar() },
    { name: "ModalHandlers", init: () => initModalHandlers() },
    { name: "OmnisearchEngine", init: () => window.OmnisearchEngine && window.OmnisearchEngine.init() },
    { name: "TelemetryEngine", init: () => window.TelemetryEngine && window.TelemetryEngine.init() },
    { name: "CorpusEngine", init: () => window.CorpusEngine && window.CorpusEngine.init() },
    { name: "AnalyticsStudio", init: () => window.AnalyticsStudio && window.AnalyticsStudio.init() }
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
}

document.addEventListener("DOMContentLoaded", bootApp);
