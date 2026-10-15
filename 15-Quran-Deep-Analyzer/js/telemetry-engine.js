/**
 * Quantitative Telemetry & Multi-Level Word Frequency Engine
 * Client-Side In-Memory Analytical Core
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
      console.log("[Telemetry] Loading datasets...");
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

      this.render();
      this.setupEventListeners();
      console.log("[Telemetry] Datasets initialized successfully.");
    } catch (err) {
      console.error("[Telemetry] Failed to load telemetry data:", err);
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById("freq-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.displayLimit = 100;
        this.render();
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
        this.displayLimit += 100;
        this.render();
      });
    }
  }

  stripTashkeel(text) {
    if (!text) return "";
    return text.replace(/[\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e8]/g, "")
               .replace(/[إأآٱ]/g, "ا")
               .replace(/[ة]/g, "ه")
               .replace(/[ى]/g, "ي");
  }

  render() {
    const container = document.getElementById("freq-data-container");
    if (!container) return;

    if (this.currentMode === "semantic") {
      this.renderSemanticPairs(container);
      return;
    }

    let items = [];
    let headers = [];

    if (this.currentMode === "words") {
      items = this.filterWords();
      headers = ["Rank", "Word (Arabic)", "Clean Text", "Occurrences", "Corpus %", "Surahs", "Action"];
    } else if (this.currentMode === "roots") {
      items = this.filterRoots();
      headers = ["Rank", "Root (Arabic)", "Transliteration", "Occurrences", "Unique Lemmas", "Sample Lemmas", "Action"];
    } else if (this.currentMode === "lemmas") {
      items = this.filterLemmas();
      headers = ["Rank", "Lemma (Arabic)", "Root Base", "POS Tag", "Occurrences", "Action"];
    } else if (this.currentMode === "hapax") {
      items = this.filterHapax();
      headers = ["No.", "Hapax Word", "Normalized", "Location (Surah:Ayah)", "Word Index", "Action"];
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
      html += `<tr><td colspan="${headers.length}" style="text-align: center; padding: 30px; color: var(--text-dim);">No matching records found.</td></tr>`;
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

    const loadMoreContainer = document.getElementById("freq-load-more-container");
    if (loadMoreContainer) {
      loadMoreContainer.style.display = (visibleItems.length < items.length) ? "block" : "none";
    }

    container.innerHTML = html;
    this.bindRowEvents(container);
  }

  filterWords() {
    if (!this.searchQuery) return this.words;
    const qClean = this.stripTashkeel(this.searchQuery);
    return this.words.filter(w => {
      return (w.token && w.token.includes(this.searchQuery)) ||
             (w.clean && (w.clean.includes(this.searchQuery) || w.clean.includes(qClean))) ||
             (String(w.rank) === this.searchQuery);
    });
  }

  filterRoots() {
    if (!this.searchQuery) return this.roots;
    const qClean = this.stripTashkeel(this.searchQuery);
    return this.roots.filter(r => {
      return (r.root_ar && (r.root_ar.includes(this.searchQuery) || r.root_ar.includes(qClean))) ||
             (r.root_bw && r.root_bw.toLowerCase().includes(this.searchQuery)) ||
             (r.root_display && r.root_display.includes(this.searchQuery));
    });
  }

  filterLemmas() {
    if (!this.searchQuery) return this.lemmas;
    const qClean = this.stripTashkeel(this.searchQuery);
    return this.lemmas.filter(l => {
      return (l.lemma_ar && (l.lemma_ar.includes(this.searchQuery) || l.lemma_ar.includes(qClean))) ||
             (l.root_ar && l.root_ar.includes(qClean));
    });
  }

  filterHapax() {
    if (!this.searchQuery) return this.hapax;
    const qClean = this.stripTashkeel(this.searchQuery);
    return this.hapax.filter(h => {
      return (h.token && h.token.includes(this.searchQuery)) ||
             (h.clean && h.clean.includes(qClean));
    });
  }

  renderRow(item, rowNum) {
    if (this.currentMode === "words") {
      return `
        <tr data-type="word" data-token="${item.token}">
          <td><span class="rank-badge ${item.rank <= 3 ? 'top-3' : ''}">#${item.rank}</span></td>
          <td class="word-arabic-cell">${item.token}</td>
          <td>${item.clean}</td>
          <td><span class="count-pill">${item.occurrences.toLocaleString()}</span></td>
          <td>${item.percentage}%</td>
          <td><span class="surah-count-pill">${item.surahs_count} Surahs</span></td>
          <td><button class="filter-btn view-occ-btn" data-type="word" data-val="${encodeURIComponent(JSON.stringify(item))}">View Ayat</button></td>
        </tr>
      `;
    } else if (this.currentMode === "roots") {
      return `
        <tr data-type="root" data-root="${item.root_ar}">
          <td><span class="rank-badge">#${rowNum}</span></td>
          <td class="root-display-cell">${item.root_display}</td>
          <td><code>${item.root_bw}</code></td>
          <td><span class="count-pill">${item.occurrences.toLocaleString()}</span></td>
          <td>${item.unique_lemmas_count}</td>
          <td style="font-family: var(--font-arabic); font-size: 1.1rem; color: #38bdf8;">${(item.lemmas_sample || []).join(' ، ')}</td>
          <td><button class="filter-btn view-occ-btn" data-type="root" data-val="${encodeURIComponent(JSON.stringify(item))}">View Ayat</button></td>
        </tr>
      `;
    } else if (this.currentMode === "lemmas") {
      return `
        <tr data-type="lemma" data-lemma="${item.lemma_ar}">
          <td><span class="rank-badge">#${rowNum}</span></td>
          <td class="word-arabic-cell">${item.lemma_ar}</td>
          <td class="root-display-cell">${item.root_ar}</td>
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
          <td class="word-arabic-cell">${item.token}</td>
          <td>${item.clean}</td>
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
      html += `
        <div class="semantic-card">
          <div class="semantic-card-header">${p.concept}</div>
          <div class="semantic-terms-row">
            <div class="semantic-term-box">
              <span class="arabic-term">${p.term1_ar}</span>
              <span class="stat-title">${p.term1_label}</span>
              <span class="term-count">${p.term1_count}</span>
            </div>
            <div style="font-size: 1.5rem; color: var(--text-dim); font-weight: 300;">vs</div>
            <div class="semantic-term-box">
              <span class="arabic-term">${p.term2_ar}</span>
              <span class="stat-title">${p.term2_label}</span>
              <span class="term-count">${p.term2_count}</span>
            </div>
          </div>
          <div class="balance-status-badge ${p.is_balanced ? 'balanced' : ''}">
            ${p.is_balanced ? '✓ Exact Mathematical Balance (1:1)' : `Ratio: ${p.ratio || 'N/A'}`}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
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

    let titleText = "";
    let occList = [];

    if (type === "word") {
      titleText = `Occurrences for: <span style="font-family: var(--font-arabic); color: #38bdf8; font-size: 1.4rem;">${data.token}</span> (${data.occurrences} times)`;
      occList = data.sample_occurrences || [];
    } else if (type === "root") {
      titleText = `Occurrences for Root: <span style="font-family: var(--font-arabic); color: #34d399; font-size: 1.4rem;">${data.root_display}</span> (${data.occurrences} times)`;
      occList = data.sample_occurrences || [];
    } else if (type === "lemma") {
      titleText = `Occurrences for Lemma: <span style="font-family: var(--font-arabic); color: #38bdf8; font-size: 1.4rem;">${data.lemma_ar}</span> (${data.occurrences} times)`;
      occList = data.sample_occurrences || [];
    }

    modalTitle.innerHTML = titleText;

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
            <button class="filter-btn modal-jump-btn" data-surah="${sId}" data-ayah="${aNo}">View in Surah</button>
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
