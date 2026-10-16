/**
 * Quran Advanced Analytics Studio
 * 5-Pillar Master Computational & Linguistic Analysis Engine
 * Zero-CORS Offline Durability & Pure SVG/Canvas Rendering
 */

class AnalyticsStudio {
  constructor() {
    this.entities = null;
    this.opposites = [];
    this.divinePairs = [];
    this.chronology = [];

    this.activeStudioSubTab = "entities"; // "entities" | "opposites" | "chronology" | "divine"
    this.activeEntityCategory = "prophets"; // "prophets" | "places" | "nations" | "figures" | "muqattaat" | "sajdah"
  }

  async init() {
    try {
      console.log("[AnalyticsStudio] Initializing studio datasets...");
      if (window.QURAN_ADVANCED_ANALYTICS) {
        const bundle = window.QURAN_ADVANCED_ANALYTICS;
        this.entities = bundle.entities || {};
        this.opposites = bundle.opposites || [];
        this.divinePairs = bundle.divinePairs || [];
        this.chronology = bundle.chronologyMetrics || [];
        console.log("[AnalyticsStudio] Loaded from window.QURAN_ADVANCED_ANALYTICS (Zero-CORS)");
      } else {
        const [eRes, oRes, dRes, cRes] = await Promise.all([
          fetch('data/quran_named_entities.json').then(r => r.json()).catch(() => ({})),
          fetch('data/quran_opposite_words.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_divine_pairs.json').then(r => r.json()).catch(() => []),
          fetch('data/quran_chronology_metrics.json').then(r => r.json()).catch(() => [])
        ]);
        this.entities = eRes;
        this.opposites = oRes;
        this.divinePairs = dRes;
        this.chronology = cRes;
      }

      this.setupStudioControls();
      this.render();
      console.log("[AnalyticsStudio] Studio initialized successfully.");
    } catch (err) {
      console.error("[AnalyticsStudio] Failed to initialize studio:", err);
    }
  }

  setupStudioControls() {
    const subNavBtns = document.querySelectorAll(".studio-subtab-btn");
    subNavBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        subNavBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeStudioSubTab = btn.dataset.subtab;
        this.render();
      });
    });

    const entityCatBtns = document.querySelectorAll(".entity-cat-btn");
    entityCatBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        entityCatBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeEntityCategory = btn.dataset.cat;
        this.renderEntities();
      });
    });
  }

  render() {
    const panels = {
      entities: document.getElementById("studio-panel-entities"),
      opposites: document.getElementById("studio-panel-opposites"),
      chronology: document.getElementById("studio-panel-chronology"),
      divine: document.getElementById("studio-panel-divine")
    };

    Object.keys(panels).forEach(key => {
      if (panels[key]) {
        if (key === this.activeStudioSubTab) {
          panels[key].style.display = "block";
        } else {
          panels[key].style.display = "none";
        }
      }
    });

    if (this.activeStudioSubTab === "entities") {
      this.renderEntities();
    } else if (this.activeStudioSubTab === "opposites") {
      this.renderOpposites();
    } else if (this.activeStudioSubTab === "chronology") {
      this.renderChronology();
    } else if (this.activeStudioSubTab === "divine") {
      this.renderDivinePairs();
    }
  }

  // 1. NAMED ENTITY DIRECTORY
  renderEntities() {
    const container = document.getElementById("entities-display-container");
    if (!container || !this.entities) return;

    let items = [];
    const cat = this.activeEntityCategory;

    if (cat === "prophets") items = this.entities.prophets || [];
    else if (cat === "places") items = this.entities.places || [];
    else if (cat === "nations") items = this.entities.nations || [];
    else if (cat === "figures") items = this.entities.figures || [];
    else if (cat === "muqattaat") {
      this.renderMuqattaat(container);
      return;
    } else if (cat === "sajdah") {
      this.renderSajdah(container);
      return;
    }

    let html = `<div class="surah-grid">`;
    items.forEach((item, idx) => {
      html += `
        <div class="surah-card entity-card" data-val="${encodeURIComponent(JSON.stringify(item))}">
          <div class="surah-card-header">
            <div class="surah-num-badge" style="color: #38bdf8;">#${idx + 1}</div>
            <div class="surah-titles">
              <div class="surah-name-roman">${item.name_en}</div>
              <span class="surah-type-badge ${item.category ? 'makki' : 'madani'}">${item.title || item.category || 'Canonical Entity'}</span>
            </div>
            <div class="surah-name-arabic" style="font-size: 1.6rem;">${item.name_ar}</div>
          </div>

          <div class="surah-stats-row">
            <div class="surah-stat-col">
              <div class="stat-title">Mentions</div>
              <div class="stat-number" style="color: #34d399; font-size: 1.25rem;">${item.count}</div>
            </div>
            <div class="surah-stat-col">
              <div class="stat-title">Surahs</div>
              <div class="stat-number">${item.surahs_count || (item.surahs ? item.surahs.length : 'Multiple')}</div>
            </div>
            <div class="surah-stat-col">
              <div class="stat-title">Action</div>
              <button class="filter-btn view-entity-occ-btn" style="padding: 4px 10px; font-size: 0.75rem;" data-val="${encodeURIComponent(JSON.stringify(item))}">
                View Ayat
              </button>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;

    container.querySelectorAll(".view-entity-occ-btn, .entity-card").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.AudioSFX) window.AudioSFX.playClick();
        const raw = decodeURIComponent(el.dataset.val);
        const data = JSON.parse(raw);
        this.openEntityModal(data);
      });
    });
  }

  renderMuqattaat(container) {
    const items = this.entities.muqattaat || [];
    let html = `<div class="surah-grid">`;
    items.forEach((m, idx) => {
      html += `
        <div class="surah-card">
          <div class="surah-card-header">
            <div class="surah-num-badge">#${idx + 1}</div>
            <div class="surah-titles">
              <div class="surah-name-roman">${m.trans}</div>
              <span class="surah-type-badge madani">${m.surahs.length} Surahs</span>
            </div>
            <div class="surah-name-arabic" style="font-size: 2rem; color: #fbbf24;">${m.letters}</div>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 8px;">
            Appears at opening of:
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
              ${m.surahs.map(sId => `<button class="filter-btn studio-jump-btn" data-surah="${sId}" data-ayah="1">Surah ${sId}</button>`).join("")}
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.bindStudioJumpBtns(container);
  }

  renderSajdah(container) {
    const items = this.entities.sajdah_verses || [];
    let html = `<div class="surah-grid">`;
    items.forEach((s, idx) => {
      html += `
        <div class="surah-card">
          <div class="surah-card-header">
            <div class="surah-num-badge" style="color: #fbbf24;">۩ ${idx + 1}</div>
            <div class="surah-titles">
              <div class="surah-name-roman">Surah ${s.surah_name}</div>
              <span class="surah-type-badge ${s.school === 'Unanimous' ? 'madani' : 'makki'}">${s.school}</span>
            </div>
            <div class="count-pill">Ayah ${s.surah}:${s.ayah}</div>
          </div>
          <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
            <button class="filter-btn studio-jump-btn" data-surah="${s.surah}" data-ayah="${s.ayah}">
              Open Ayah in Reader
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.bindStudioJumpBtns(container);
  }

  // 2. OPPOSITE WORDS & RHETORICAL TIBAQ
  renderOpposites() {
    const container = document.getElementById("opposites-display-container");
    if (!container) return;

    let html = `<div style="display: flex; flex-direction: column; gap: 16px;">`;

    this.opposites.forEach(op => {
      html += `
        <div class="ayah-card" style="margin-bottom: 0;">
          <div class="ayah-card-meta">
            <span class="ayah-badge" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8;">
              ${op.concept}
            </span>
            <span class="count-pill">
              ${op.is_balanced ? '✓ Exact Mathematical Balance' : `Ratio: ${op.ratio}`}
            </span>
          </div>

          <div class="semantic-terms-row" style="margin: 16px 0; background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: var(--radius-sm);">
            <div class="semantic-term-box">
              <span class="arabic-term">${op.term1_ar}</span>
              <span class="stat-title">${op.term1_en}</span>
              <span class="term-count">${op.term1_count}</span>
            </div>
            <div style="font-size: 2rem; color: var(--text-dim); font-weight: 300;">⇄</div>
            <div class="semantic-term-box">
              <span class="arabic-term">${op.term2_ar}</span>
              <span class="stat-title">${op.term2_en}</span>
              <span class="term-count">${op.term2_count}</span>
            </div>
          </div>

          <div style="font-size: 0.92rem; color: #e2e8f0; line-height: 1.6; border-left: 3px solid #10b981; padding-left: 12px; margin-bottom: 12px;">
            <strong>Linguistic & Rhetorical Insight:</strong> ${op.insight}
          </div>

          ${op.tibaq_count > 0 ? `
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
              <span class="stat-title" style="color: #fbbf24;">Tibaq (Where Both Opposites Meet in the Same Ayah): ${op.tibaq_count} Verses</span>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                ${op.tibaq_sample.map(t => `
                  <div style="background: rgba(255, 255, 255, 0.02); padding: 10px 14px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="font-family: var(--font-arabic); font-size: 1.25rem; color: #f1f5f9; direction: rtl; text-align: right; flex: 1;">${t.arabic}</div>
                    <button class="filter-btn studio-jump-btn" data-surah="${t.surah}" data-ayah="${t.ayah}">Surah ${t.surah}:${t.ayah}</button>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.bindStudioJumpBtns(container);
  }

  // 3. CHRONOLOGICAL STYLOMETRICS (PROCEDURAL SVG TIMELINE)
  renderChronology() {
    const container = document.getElementById("chronology-display-container");
    if (!container || !this.chronology.length) return;

    const data = this.chronology;
    const width = 1000;
    const height = 360;
    const padding = 50;

    const maxAvl = Math.max(...data.map(d => d.avg_verse_length));
    const minAvl = Math.min(...data.map(d => d.avg_verse_length));

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.avg_verse_length - minAvl) / (maxAvl - minAvl)) * (height - 2 * padding);
      return { x, y, d };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    let svgHtml = `
      <div class="data-table-container" style="padding: 20px; overflow-x: auto;">
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 1.15rem; color: var(--text-main);">23-Year Revelation Stylometric Trajectory</h3>
          <p style="font-size: 0.85rem; color: var(--text-dim);">Average Verse Length (Words per Ayah) across the 114 Revelation Order Points (Early Makki to Late Madani)</p>
        </div>

        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; min-width: 800px; height: auto; background: rgba(0,0,0,0.3); border-radius: var(--radius-sm);">
          <!-- Epoch Background Guides -->
          <rect x="${padding}" y="${padding}" width="${(width - 2*padding)*0.38}" height="${height - 2*padding}" fill="rgba(245, 158, 11, 0.05)" />
          <rect x="${padding + (width - 2*padding)*0.38}" y="${padding}" width="${(width - 2*padding)*0.38}" height="${height - 2*padding}" fill="rgba(6, 182, 212, 0.05)" />
          <rect x="${padding + (width - 2*padding)*0.76}" y="${padding}" width="${(width - 2*padding)*0.24}" height="${height - 2*padding}" fill="rgba(16, 185, 129, 0.07)" />

          <text x="${padding + 10}" y="${padding + 20}" fill="#fbbf24" font-size="12" font-weight="700">Early Makki Epoch (Cadence)</text>
          <text x="${padding + (width - 2*padding)*0.38 + 10}" y="${padding + 20}" fill="#38bdf8" font-size="12" font-weight="700">Middle / Late Makki (Epics)</text>
          <text x="${padding + (width - 2*padding)*0.76 + 10}" y="${padding + 20}" fill="#34d399" font-size="12" font-weight="700">Madani Epoch (Legislation)</text>

          <!-- Trend Area -->
          <path d="${pathD} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z" fill="url(#gradLine)" opacity="0.3" />
          
          <!-- Trend Line -->
          <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="2.5" />

          <!-- Gradient Definition -->
          <defs>
            <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Interactive Points -->
          ${points.map(p => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${p.d.place === 'Makki' ? '#fbbf24' : '#10b981'}" style="cursor: pointer;">
              <title>Rev #${p.d.revelation_order}: Surah ${p.d.name_roman} (${p.d.place}) - Avg Verse: ${p.d.avg_verse_length} words</title>
            </circle>
          `).join('')}
        </svg>

        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-dim); margin-top: 8px;">
          <span>← First Revelation (Surah Al-Alaq 96)</span>
          <span>Final Revelation (Surah An-Nasr 110) →</span>
        </div>
      </div>
    `;

    container.innerHTML = svgHtml;
  }

  // 4. DIVINE NAMES CLOSING MATRIX
  renderDivinePairs() {
    const container = document.getElementById("divine-display-container");
    if (!container) return;

    let html = `<div class="surah-grid">`;
    this.divinePairs.forEach((dp, idx) => {
      html += `
        <div class="surah-card">
          <div class="surah-card-header">
            <div class="surah-num-badge">#${idx + 1}</div>
            <div class="surah-titles">
              <div class="surah-name-roman">${dp.pair_en}</div>
              <span class="surah-type-badge madani">${dp.theme}</span>
            </div>
            <div class="surah-name-arabic" style="font-size: 1.5rem; color: #38bdf8;">${dp.pair_ar}</div>
          </div>

          <div class="surah-stats-row">
            <div class="surah-stat-col">
              <div class="stat-title">Fawasil Occurrences</div>
              <div class="stat-number" style="color: #34d399;">${dp.count} Times</div>
            </div>
            <div class="surah-stat-col" style="grid-column: span 2;">
              <button class="filter-btn view-divine-occ-btn" style="width: 100%;" data-val="${encodeURIComponent(JSON.stringify(dp))}">
                View Concluding Verses
              </button>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;

    container.querySelectorAll(".view-divine-occ-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const data = JSON.parse(decodeURIComponent(btn.dataset.val));
        this.openDivineModal(data);
      });
    });
  }

  openEntityModal(data) {
    const modal = document.getElementById("occurrence-modal");
    const modalTitle = document.getElementById("occ-modal-title");
    const modalBody = document.getElementById("occ-modal-body");
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `
      <span>${data.name_en}</span>
      <span style="font-family: var(--font-arabic); font-size: 1.5rem; color: #38bdf8;">${data.name_ar}</span>
      <span class="count-pill">${data.count} Mentions</span>
    `;

    this.renderOccurrenceCards(modalBody, data.occurrences || []);
    modal.classList.add("open");
  }

  openDivineModal(data) {
    const modal = document.getElementById("occurrence-modal");
    const modalTitle = document.getElementById("occ-modal-title");
    const modalBody = document.getElementById("occ-modal-body");
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `
      <span>Pair: ${data.pair_en}</span>
      <span style="font-family: var(--font-arabic); font-size: 1.5rem; color: #38bdf8;">${data.pair_ar}</span>
      <span class="count-pill">${data.count} Ayat</span>
    `;

    this.renderOccurrenceCards(modalBody, data.occurrences || []);
    modal.classList.add("open");
  }

  renderOccurrenceCards(container, occs) {
    if (!occs || occs.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-dim); padding: 20px;">No exact verse references mapped.</p>`;
      return;
    }

    let html = "";
    occs.forEach((occ, idx) => {
      const sId = occ[0];
      const aNo = occ[1];
      const p = (window.CorpusEngine && window.CorpusEngine.getParaForAyah) ? window.CorpusEngine.getParaForAyah(sId, aNo) : null;
      const pBadge = p ? `<span class="para-badge-inline" title="Para ${p.para}: ${p.name_ar}">Para ${p.para}</span> ` : '';
      html += `
        <div class="occurrence-item occ-verse-card" id="studio-occ-card-${idx}">
          <div class="occ-card-top">
            <span class="occ-ref-badge" id="studio-occ-badge-${idx}">${pBadge}Surah ${sId} : Ayah ${aNo}</span>
            <button class="occ-arrow-btn studio-jump-btn" data-surah="${sId}" data-ayah="${aNo}" title="Open Surah ${sId}:${aNo} in Ayah Analyzer" aria-label="Go to Ayah">
              <span class="jump-arrow">↗</span>
            </button>
          </div>
          <div class="occ-verse-content" id="studio-occ-content-${idx}">
            <div class="occ-loading-spinner">Loading Ayah ${sId}:${aNo}...</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.bindStudioJumpBtns(container);

    // Asynchronously populate Ayah text and translations
    Promise.all(occs.map(async (occ, idx) => {
      const sId = occ[0];
      const aNo = occ[1];
      const contentEl = document.getElementById(`studio-occ-content-${idx}`);
      const badgeEl = document.getElementById(`studio-occ-badge-${idx}`);
      if (!contentEl) return;

      const p = (window.CorpusEngine && window.CorpusEngine.getParaForAyah) ? window.CorpusEngine.getParaForAyah(sId, aNo) : null;

      if (window.CorpusEngine && window.CorpusEngine.getAyahData) {
        try {
          const ayahObj = await window.CorpusEngine.getAyahData(sId, aNo);
          if (ayahObj && ayahObj.ayah) {
            const a = ayahObj.ayah;
            const s = ayahObj.surah;
            if (badgeEl && s && s.name_roman) {
              const paraBadge = p ? `<span class="para-badge-inline" title="Para ${p.para}: ${p.name_ar} (${p.name_roman})">Para ${p.para}</span> ` : '';
              badgeEl.innerHTML = `${paraBadge}Surah ${s.name_roman} (${sId}:${aNo})`;
            }
            const ar = a.arabic || a.arabicText || a.text || '';
            const ur = a.translation_urdu_kanzul_iman || a.translation_ur_ki || a.translation_ur || '';
            const en = a.translation_english || a.translation_en || '';
            contentEl.innerHTML = `
              ${ar ? `<div class="occ-ayah-arabic" dir="rtl">${ar}</div>` : ''}
              <div class="occ-translations">
                ${ur ? `<div class="occ-trans-ur" dir="rtl"><span class="compact-trans-tag ur-ki">کنز الایمان</span> ${ur}</div>` : ''}
                ${en ? `<div class="occ-trans-en"><strong>EN:</strong> ${en}</div>` : ''}
              </div>
            `;
            return;
          }
        } catch (e) {
          console.error("Error loading ayah:", e);
        }
      }
      contentEl.innerHTML = `<div style="color: var(--text-dim); font-size: 0.85rem;">Ayah ${sId}:${aNo}</div>`;
    }));
  }

  bindStudioJumpBtns(container) {
    container.querySelectorAll(".studio-jump-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playTab();
        const modal = document.getElementById("occurrence-modal");
        if (modal) modal.classList.remove("open");

        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);
        if (window.CorpusEngine) {
          window.CorpusEngine.jumpToAyah(sId, aNo);
        }
      });
    });
  }
}

window.AnalyticsStudio = new AnalyticsStudio();
