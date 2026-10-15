/**
 * Quantitative Telemetry & Multi-Level Word Frequency Engine
 * Client-Side In-Memory Analytical Core with Zero-CORS Offline Support
 * Royal Islamic Luxury & Linear Data Studio Edition
 */

class TelemetryEngine {
  constructor() {
    this.words = [];
    this.roots = [];
    this.lemmas = [];
    this.hapax = [];
    this.semanticPairs = [];

    this.currentMode = "words"; // "words" | "roots" | "lemmas" | "hapax" | "semantic"
    this.searchQuery = "";
    this.displayLimit = 100;
  }

  async init() {
    try {
      console.log("[Telemetry] Initializing telemetry engine...");
      if (window.QURAN_CORE_DATA) {
        this.words = window.QURAN_CORE_DATA.wordsTop1000 || [];
        this.roots = window.QURAN_CORE_DATA.roots || [];
        this.lemmas = window.QURAN_CORE_DATA.lemmas || [];
        this.hapax = window.QURAN_CORE_DATA.hapax || [];
        this.semanticPairs = window.QURAN_CORE_DATA.semanticPairs || [];
        console.log("[Telemetry] Loaded from window.QURAN_CORE_DATA (Zero-CORS)");
      } else {
        console.log("[Telemetry] Fetching datasets via HTTP...");
        const [wRes, rRes, lRes, hRes, sRes] = await Promise.all([
          fetch('data/quran_word_frequency_top1000.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_roots.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_lemmas.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_hapax_legomena.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_semantic_pairs.json').then(r => r.json()).catch(() => [])
        ]);

        this.words = wRes;
        this.roots = rRes;
        this.lemmas = lRes;
        this.hapax = hRes;
        this.semanticPairs = sRes;
      }

      this.render();
      this.setupEventListeners();
      console.log(`[Telemetry] Initialized with ${this.words.length} words, ${this.roots.length} roots.`);
    } catch (err) {
      console.error("[Telemetry] Failed to load telemetry data:", err);
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById("freq-search-input");
    const clearBtn = document.getElementById("freq-search-clear");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = this.searchQuery ? "block" : "none";
        }
        this.displayLimit = 100;
        this.render();
      });

      // Keyboard shortcut '/' to instantly focus search bar
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        searchInput.value = "";
        this.searchQuery = "";
        clearBtn.style.display = "none";
        this.displayLimit = 100;
        this.render();
        searchInput.focus();
      });
    }

    const filterBtns = document.querySelectorAll(".freq-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentMode = btn.dataset.mode;
        this.displayLimit = 100;
        this.render();
      });
    });

    const loadMoreBtn = document.getElementById("load-more-freq-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.loadMore();
      });
    }
  }

  loadMore() {
    let items = [];
    if (this.currentMode === "words") items = this.filterWords();
    else if (this.currentMode === "roots") items = this.filterRoots();
    else if (this.currentMode === "lemmas") items = this.filterLemmas();
    else if (this.currentMode === "hapax") items = this.filterHapax();

    const prevLimit = this.displayLimit;
    this.displayLimit += 100;
    const nextChunk = items.slice(prevLimit, this.displayLimit);

    const tbody = document.querySelector("#freq-data-container tbody");
    if (!tbody || nextChunk.length === 0) {
      this.render();
      return;
    }

    let appendHtml = "";
    nextChunk.forEach((item, idx) => {
      appendHtml += this.renderRow(item, prevLimit + idx + 1);
    });

    tbody.insertAdjacentHTML("beforeend", appendHtml);

    const loadMoreContainer = document.getElementById("freq-load-more-container");
    if (loadMoreContainer) {
      loadMoreContainer.style.display = (this.displayLimit < items.length) ? "block" : "none";
    }

    this.bindRowEvents(tbody);
  }

  stripTashkeel(text) {
    if (!text) return "";
    return text.replace(/[\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e8\ufb50-\ufdff\ufe70-\ufeff\u200c\u200d\u200e\u200f]/g, "")
               .replace(/[إأآٱ]/g, "ا")
               .replace(/[ة]/g, "ه")
               .replace(/[ى]/g, "ي");
  }

  render() {
    const container = document.getElementById("freq-data-container");
    if (!container) return;

    const loadMoreContainer = document.getElementById("freq-load-more-container");

    if (this.currentMode === "semantic") {
      if (loadMoreContainer) loadMoreContainer.style.display = "none";
      this.renderSemanticPairs(container);
      return;
    }

    let items = [];
    let headers = [];

    if (this.currentMode === "words") {
      items = this.filterWords();
      headers = ["Rank", "Word (Arabic)", "Meaning (English • Roman Urdu)", "Occurrences", "Corpus %", "Surahs", "Action"];
    } else if (this.currentMode === "roots") {
      items = this.filterRoots();
      headers = ["Rank", "Root (Arabic)", "Meaning (English • Roman Urdu)", "Occurrences", "Unique Lemmas", "Sample Lemmas", "Action"];
    } else if (this.currentMode === "lemmas") {
      items = this.filterLemmas();
      headers = ["Rank", "Lemma (Arabic)", "Meaning (English • Roman Urdu)", "Root Base", "POS Tag", "Occurrences", "Action"];
    } else if (this.currentMode === "hapax") {
      items = this.filterHapax();
      headers = ["No.", "Hapax Word", "Meaning (English • Roman Urdu)", "Location", "Word Index", "Action"];
    }

    const visibleItems = items.slice(0, this.displayLimit);

    let html = `
      <div class="data-table-container">
        <div class="table-scroll-wrapper">
          <table class="analytics-table">
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
    `;

    if (visibleItems.length === 0) {
      html += `<tr><td colspan="${headers.length}" style="text-align: center; padding: 40px; color: var(--text-dim); font-size: 1rem;">No matching Quranic records found for "${this.searchQuery}".</td></tr>`;
    } else {
      visibleItems.forEach((item, idx) => {
        html += this.renderRow(item, idx + 1);
      });
    }

    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (loadMoreContainer) {
      loadMoreContainer.style.display = (visibleItems.length < items.length) ? "block" : "none";
    }

    container.innerHTML = html;
    this.bindRowEvents(container);
  }

  filterWords() {
    if (!this.searchQuery) return this.words;
    const q = this.searchQuery;
    const qClean = this.stripTashkeel(q);
    return this.words.filter(w => {
      return (w.token && w.token.includes(q)) ||
             (w.clean && (w.clean.includes(q) || w.clean.includes(qClean))) ||
             (w.meaning_en && w.meaning_en.toLowerCase().includes(q)) ||
             (w.meaning_ur && w.meaning_ur.toLowerCase().includes(q)) ||
             (String(w.rank) === q);
    });
  }

  filterRoots() {
    if (!this.searchQuery) return this.roots;
    const q = this.searchQuery;
    const qClean = this.stripTashkeel(q);
    return this.roots.filter(r => {
      return (r.root_ar && (r.root_ar.includes(q) || r.root_ar.includes(qClean))) ||
             (r.root_bw && r.root_bw.toLowerCase().includes(q)) ||
             (r.root_display && r.root_display.includes(q)) ||
             (r.meaning_en && r.meaning_en.toLowerCase().includes(q)) ||
             (r.meaning_ur && r.meaning_ur.toLowerCase().includes(q));
    });
  }

  filterLemmas() {
    if (!this.searchQuery) return this.lemmas;
    const q = this.searchQuery;
    const qClean = this.stripTashkeel(q);
    return this.lemmas.filter(l => {
      return (l.lemma_ar && (l.lemma_ar.includes(q) || l.lemma_ar.includes(qClean))) ||
             (l.root_ar && l.root_ar.includes(qClean)) ||
             (l.meaning_en && l.meaning_en.toLowerCase().includes(q)) ||
             (l.meaning_ur && l.meaning_ur.toLowerCase().includes(q));
    });
  }

  filterHapax() {
    if (!this.searchQuery) return this.hapax;
    const q = this.searchQuery;
    const qClean = this.stripTashkeel(q);
    return this.hapax.filter(h => {
      return (h.token && h.token.includes(q)) ||
             (h.clean && h.clean.includes(qClean)) ||
             (h.meaning_en && h.meaning_en.toLowerCase().includes(q)) ||
             (h.meaning_ur && h.meaning_ur.toLowerCase().includes(q));
    });
  }

  renderRow(item, rowNum) {
    if (this.currentMode === "words") {
      const rankClass = item.rank === 1 ? 'top-1' : (item.rank === 2 ? 'top-2' : (item.rank === 3 ? 'top-3' : ''));
      const pct = item.percentage || 0;
      return `
        <tr data-type="word" data-token="${item.token}">
          <td><span class="rank-badge ${rankClass}">#${item.rank}</span></td>
          <td class="word-arabic-cell">${item.token}</td>
          <td class="word-meaning-cell">
            <div class="meaning-en">${item.meaning_en || '—'}</div>
            <div class="meaning-ur">${item.meaning_ur || ''}</div>
          </td>
          <td><span class="count-pill">${item.occurrences.toLocaleString()}</span></td>
          <td class="corpus-pct-cell">
            <div class="corpus-pct-val">${pct}%</div>
            <div class="corpus-pct-bar">
              <div class="pct-bar-fill" style="width: ${Math.min(pct * 12, 100)}%;"></div>
            </div>
          </td>
          <td><span class="surah-count-pill">${item.surahs_count} Surahs</span></td>
          <td><button class="filter-btn view-occ-btn" data-type="word" data-val="${encodeURIComponent(JSON.stringify(item))}">View Ayat</button></td>
        </tr>
      `;
    } else if (this.currentMode === "roots") {
      const rankClass = rowNum === 1 ? 'top-1' : (rowNum === 2 ? 'top-2' : (rowNum === 3 ? 'top-3' : ''));
      return `
        <tr data-type="root" data-root="${item.root_ar}">
          <td><span class="rank-badge ${rankClass}">#${rowNum}</span></td>
          <td class="root-display-cell">${item.root_display}</td>
          <td class="word-meaning-cell">
            <div class="meaning-en">${item.meaning_en || '—'}</div>
            <div class="meaning-ur">${item.meaning_ur || ''}</div>
          </td>
          <td><span class="count-pill">${item.occurrences.toLocaleString()}</span></td>
          <td>${item.unique_lemmas_count}</td>
          <td style="font-family: var(--font-arabic); font-size: 1.25rem; color: #38bdf8; direction: rtl; text-align: right;">${(item.lemmas_sample || []).join(' ، ')}</td>
          <td><button class="filter-btn view-occ-btn" data-type="root" data-val="${encodeURIComponent(JSON.stringify(item))}">View Ayat</button></td>
        </tr>
      `;
    } else if (this.currentMode === "lemmas") {
      return `
        <tr data-type="lemma" data-lemma="${item.lemma_ar}">
          <td><span class="rank-badge">#${rowNum}</span></td>
          <td class="word-arabic-cell" style="font-size: 1.55rem;">${item.lemma_ar}</td>
          <td class="word-meaning-cell">
            <div class="meaning-en">${item.meaning_en || '—'}</div>
            <div class="meaning-ur">${item.meaning_ur || ''}</div>
          </td>
          <td class="root-display-cell" style="font-size: 1.15rem;">${item.root_ar}</td>
          <td><span class="surah-count-pill">${(item.pos || []).join(', ')}</span></td>
          <td><span class="count-pill">${item.occurrences.toLocaleString()}</span></td>
          <td><button class="filter-btn view-occ-btn" data-type="lemma" data-val="${encodeURIComponent(JSON.stringify(item))}">View Ayat</button></td>
        </tr>
      `;
    } else if (this.currentMode === "hapax") {
      const loc = item.location || [1, 1, 1];
      return `
        <tr data-type="hapax">
          <td><span class="rank-badge">#${rowNum}</span></td>
          <td class="word-arabic-cell" style="font-size: 1.55rem;">${item.token}</td>
          <td class="word-meaning-cell">
            <div class="meaning-en">${item.meaning_en || '—'}</div>
            <div class="meaning-ur">${item.meaning_ur || ''}</div>
          </td>
          <td><span class="surah-count-pill">Surah ${loc[0]} : Ayah ${loc[1]}</span></td>
          <td>Word #${loc[2]}</td>
          <td><button class="filter-btn jump-to-ayah-btn" data-surah="${loc[0]}" data-ayah="${loc[1]}">Open Surah</button></td>
        </tr>
      `;
    }
    return "";
  }

  renderSemanticPairs(container) {
    let html = `<div class="semantic-grid">`;
    this.semanticPairs.forEach(p => {
      const isBalanced = p.is_balanced || p.term1_count === p.term2_count;
      const tibaqCount = p.tibaq_count || (p.tibaq_sample ? p.tibaq_sample.length : 0);
      const ratioDisplay = p.ratio ? `${p.ratio}:1` : 'N/A';
      html += `
        <div class="semantic-card">
          <div class="semantic-card-header">${p.concept}</div>
          <div class="semantic-terms-row">
            <div class="semantic-term-box">
              <span class="arabic-term">${p.term1_ar}</span>
              <span class="stat-title">${p.term1_label || p.term1_en || ''}</span>
              ${p.term1_ur ? `<span class="stat-urdu-badge">${p.term1_ur}</span>` : ''}
              <span class="term-count">${(p.term1_count || 0).toLocaleString()}</span>
            </div>
            <div style="font-size: 1.5rem; color: var(--text-dim); font-weight: 300;">vs</div>
            <div class="semantic-term-box">
              <span class="arabic-term">${p.term2_ar}</span>
              <span class="stat-title">${p.term2_label || p.term2_en || ''}</span>
              ${p.term2_ur ? `<span class="stat-urdu-badge">${p.term2_ur}</span>` : ''}
              <span class="term-count">${(p.term2_count || 0).toLocaleString()}</span>
            </div>
          </div>
          <div class="balance-status-badge ${isBalanced ? 'balanced' : ''}">
            ${isBalanced ? '✓ Exact Mathematical Balance (1:1)' : `Ratio: ${ratioDisplay}`}
          </div>
          ${tibaqCount > 0 ? `
            <button class="filter-btn view-tibaq-btn" style="margin-top: 12px; width: 100%; justify-content: center; background: rgba(212, 175, 55, 0.12); color: #fbbf24; border-color: rgba(212, 175, 55, 0.3);" data-val="${encodeURIComponent(JSON.stringify(p))}">
              📖 View Tibaq Verses (${tibaqCount} Ayat)
            </button>
          ` : ''}
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.bindRowEvents(container);
  }

  bindRowEvents(container) {
    container.querySelectorAll(".view-occ-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playClick();
        try {
          const raw = decodeURIComponent(btn.dataset.val);
          const data = JSON.parse(raw);
          this.openOccurrenceModal(btn.dataset.type, data);
        } catch (err) {
          console.error("Failed to parse occurrence data:", err);
        }
      });
    });

    container.querySelectorAll(".view-tibaq-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playClick();
        try {
          const raw = decodeURIComponent(btn.dataset.val);
          const data = JSON.parse(raw);
          this.openOccurrenceModal("tibaq", data);
        } catch (err) {
          console.error("Failed to parse tibaq data:", err);
        }
      });
    });

    container.querySelectorAll(".jump-to-ayah-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playTab();
        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);
        if (window.CorpusEngine) {
          window.CorpusEngine.jumpToAyah(sId, aNo);
        }
      });
    });
  }

  openOccurrenceModal(type, data) {
    const modal = document.getElementById("occurrence-modal");
    const modalTitle = document.getElementById("occ-modal-title");
    const modalBody = document.getElementById("occ-modal-body");
    if (!modal || !modalTitle || !modalBody) return;

    if (type === "tibaq" || data.tibaq_sample) {
      const tibaqList = data.tibaq_sample || [];
      modalTitle.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span style="font-family: var(--font-arabic); font-size: 1.8rem; color: #38bdf8; direction: rtl;">${data.term1_ar} • ${data.term2_ar}</span>
            <span class="count-pill">${data.tibaq_count || tibaqList.length} Tibaq Ayat</span>
          </div>
          <div style="font-size: 0.95rem; font-weight: 500; color: #f1f5f9; display: flex; align-items: center; gap: 8px;">
            <span>${data.concept}</span>
            ${data.insight ? `<span style="color: #34d399; font-size: 0.85rem;">(${data.insight})</span>` : ''}
          </div>
        </div>
      `;

      let bodyHtml = "";
      if (tibaqList.length === 0) {
        bodyHtml = `<p style="color: var(--text-dim); text-align: center; padding: 20px;">No sample verses recorded.</p>`;
      } else {
        tibaqList.forEach(v => {
          bodyHtml += `
            <div class="occurrence-item" style="flex-direction: column; align-items: stretch; gap: 8px; margin-bottom: 12px; padding: 14px; background: rgba(255, 255, 255, 0.02); border-left: 3px solid #d4af37; border-radius: var(--radius-sm);">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="occ-ref-badge">Surah ${v.surah} : Ayah ${v.ayah}</span>
                <button class="filter-btn modal-jump-btn" data-surah="${v.surah}" data-ayah="${v.ayah}">View in Context</button>
              </div>
              <div style="font-family: var(--font-arabic); font-size: 1.4rem; line-height: 1.8; color: #f8fafc; direction: rtl; text-align: right;">${v.arabic}</div>
            </div>
          `;
        });
      }
      modalBody.innerHTML = bodyHtml;
      modal.classList.add("open");

      modalBody.querySelectorAll(".modal-jump-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playTab();
          modal.classList.remove("open");
          const sId = parseInt(btn.dataset.surah, 10);
          const aNo = parseInt(btn.dataset.ayah, 10);
          if (window.CorpusEngine) {
            window.CorpusEngine.jumpToAyah(sId, aNo);
          }
        });
      });
      return;
    }

    let displayWord = data.token || data.root_display || data.lemma_ar;
    let occList = data.sample_occurrences || [];
    let meaningEn = data.meaning_en || "";
    let meaningUr = data.meaning_ur || "";

    modalTitle.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-family: var(--font-arabic); font-size: 2rem; color: #38bdf8; direction: rtl;">${displayWord}</span>
          <span class="count-pill">${(data.occurrences || 1).toLocaleString()} Occurrences</span>
          ${data.surahs_count ? `<span class="surah-count-pill">${data.surahs_count} Surahs</span>` : ''}
        </div>
        ${(meaningEn || meaningUr) ? `
          <div style="font-size: 0.95rem; font-weight: 500; color: #f1f5f9; display: flex; align-items: center; gap: 8px;">
            <span>${meaningEn}</span>
            ${meaningUr ? `<span style="color: #fbbf24; font-weight: 600;">• ${meaningUr}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;

    let bodyHtml = "";
    if (occList.length === 0) {
      bodyHtml = `<p style="color: var(--text-dim); text-align: center; padding: 20px;">No sample occurrences recorded.</p>`;
    } else {
      occList.forEach(occ => {
        const sId = occ[0];
        const aNo = occ[1];
        const wIdx = occ[2] || 1;
        bodyHtml += `
          <div class="occurrence-item">
            <span class="occ-ref-badge">Surah ${sId} : Ayah ${aNo}</span>
            <span style="font-size: 0.85rem; color: var(--text-dim);">Word #${wIdx}</span>
            <button class="filter-btn modal-jump-btn" data-surah="${sId}" data-ayah="${aNo}">View in Context</button>
          </div>
        `;
      });
    }

    modalBody.innerHTML = bodyHtml;
    modal.classList.add("open");

    modalBody.querySelectorAll(".modal-jump-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        modal.classList.remove("open");
        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);
        if (window.CorpusEngine) {
          window.CorpusEngine.jumpToAyah(sId, aNo);
        }
      });
    });
  }
}

window.TelemetryEngine = new TelemetryEngine();
