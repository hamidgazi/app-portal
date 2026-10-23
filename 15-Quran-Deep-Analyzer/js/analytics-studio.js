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
              <div class="stat-title">${item.tokens_count && item.verses_count && item.tokens_count !== item.verses_count ? 'Words / Verses' : 'Mentions'}</div>
              <div class="stat-number" style="color: #34d399; font-size: 1.1rem; white-space: nowrap;">
                ${item.tokens_count && item.verses_count && item.tokens_count !== item.verses_count 
                  ? `${item.tokens_count}w • ${item.verses_count}v` 
                  : (item.tokens_count || item.count)}
              </div>
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
      const p = (window.CorpusEngine && window.CorpusEngine.getParaForAyah) ? window.CorpusEngine.getParaForAyah(s.surah, s.ayah) : null;
      const pBadge = p ? `<span class="para-badge-inline" title="Para ${p.para}: ${p.name_ar}">Para ${p.para}</span> ` : '';
      const labelText = `Sajdah: Surah ${s.surah_name} (${s.surah}:${s.ayah})`;
      html += `
        <div class="surah-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div class="surah-card-header">
            <div class="surah-num-badge" style="color: #fbbf24;">۩ ${idx + 1}</div>
            <div class="surah-titles">
              <div class="surah-name-roman">${pBadge}Surah ${s.surah_name}</div>
              <span class="surah-type-badge ${s.school === 'Unanimous' ? 'madani' : 'makki'}">${s.school}</span>
            </div>
            <div class="count-pill">Ayah ${s.surah}:${s.ayah}</div>
          </div>
          <div id="sajdah-card-ayah-${idx}" class="occ-verse-content" style="margin: 12px 0; min-height: 48px;">
            <div class="occ-loading-spinner" style="font-size: 0.8rem;">Loading Ayah ${s.surah}:${s.ayah}...</div>
          </div>
          <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
            <button class="filter-btn studio-jump-btn" data-surah="${s.surah}" data-ayah="${s.ayah}" data-label="${labelText}">
              Open Ayah in Reader ↗
            </button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.bindStudioJumpBtns(container);

    // Asynchronously populate clean Arabic text for all 15 Sajdah verses
    items.forEach(async (s, idx) => {
      const el = document.getElementById(`sajdah-card-ayah-${idx}`);
      if (!el) return;
      if (window.CorpusEngine && window.CorpusEngine.getAyahData) {
        try {
          const ayahObj = await window.CorpusEngine.getAyahData(s.surah, s.ayah);
          if (ayahObj && ayahObj.ayah) {
            const ar = ayahObj.ayah.arabic || ayahObj.ayah.arabicText || ayahObj.ayah.text || '';
            el.innerHTML = ar ? `<div class="occ-ayah-arabic" dir="rtl" style="font-size: 1.35rem; line-height: 1.9; color: #f8fafc;">${ar}</div>` : '';
            return;
          }
        } catch (e) {}
      }
      el.innerHTML = `<div style="color: var(--text-dim); font-size: 0.85rem;">Ayah ${s.surah}:${s.ayah}</div>`;
    });
  }

  // 2. OPPOSITE WORDS & RHETORICAL TIBAQ (HIGH-DENSITY RESPONSIVE GRID)
  renderOpposites() {
    const container = document.getElementById("opposites-display-container");
    if (!container) return;

    this.activeOppositesFilter = this.activeOppositesFilter || "all";

    const totalCount = this.opposites.length;
    const balancedCount = this.opposites.filter(op => op.is_balanced).length;
    const cosmicCount = this.opposites.filter(op => Boolean(op.ratio_label)).length;
    const theologicalCount = this.opposites.filter(op => !op.is_balanced && !op.ratio_label).length;

    let filtered = this.opposites;
    if (this.activeOppositesFilter === "balanced") {
      filtered = this.opposites.filter(op => op.is_balanced);
    } else if (this.activeOppositesFilter === "cosmic") {
      filtered = this.opposites.filter(op => Boolean(op.ratio_label));
    } else if (this.activeOppositesFilter === "theological") {
      filtered = this.opposites.filter(op => !op.is_balanced && !op.ratio_label);
    }

    let html = `
      <div class="opposites-filter-ribbon">
        <span style="font-size: 0.80rem; font-weight: 700; color: #fbbf24; margin-right: 4px;">فہرست زمرہ جات:</span>
        <button class="opposites-filter-chip ${this.activeOppositesFilter === 'all' ? 'active' : ''}" onclick="window.AnalyticsStudio.setOppositesFilter('all')">
          🌟 سبھی جوڑے (${totalCount})
        </button>
        <button class="opposites-filter-chip ${this.activeOppositesFilter === 'balanced' ? 'active' : ''}" onclick="window.AnalyticsStudio.setOppositesFilter('balanced')">
          ⚖️ برابری 1:1 (${balancedCount})
        </button>
        <button class="opposites-filter-chip ${this.activeOppositesFilter === 'cosmic' ? 'active' : ''}" onclick="window.AnalyticsStudio.setOppositesFilter('cosmic')">
          🪐 کائناتی و سائنسی (${cosmicCount})
        </button>
        <button class="opposites-filter-chip ${this.activeOppositesFilter === 'theological' ? 'active' : ''}" onclick="window.AnalyticsStudio.setOppositesFilter('theological')">
          ⚡ بلاغتی و ایمانی (${theologicalCount})
        </button>
      </div>

      <div class="opposites-grid">
    `;

    filtered.forEach((op) => {
      const origIdx = this.opposites.indexOf(op);
      let cardClass = "theological";
      let badgeHTML = '';

      if (op.is_balanced) {
        cardClass = "balanced";
        badgeHTML = `<span class="count-pill" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-weight: 700; padding: 2px 9px; font-size: 0.74rem; border-radius: var(--radius-full);">✓ 1:1 Parity</span>`;
      } else if (op.ratio_label) {
        cardClass = "cosmic";
        badgeHTML = `<span class="count-pill" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); font-weight: 700; padding: 2px 9px; font-size: 0.74rem; border-radius: var(--radius-full);">${op.ratio_label}</span>`;
      } else {
        cardClass = "theological";
        badgeHTML = `<span class="count-pill" style="background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.35); font-weight: 700; padding: 2px 9px; font-size: 0.74rem; border-radius: var(--radius-full);">Ratio: ${op.ratio}</span>`;
      }

      html += `
        <article class="opposite-compact-card ${cardClass}" id="opposite-card-${origIdx}">
          <div class="opposite-card-head">
            <span class="ayah-badge" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8; font-weight: 700; font-size: 0.78rem;">
              ${op.concept}
            </span>
            ${badgeHTML}
          </div>

          <div class="opposite-terms-compact-row">
            <div class="opposite-term-unit">
              <span class="ar-term">${op.term1_ar}</span>
              <span class="en-label">${op.term1_en}</span>
              <span class="cnt-num" style="color: ${op.is_balanced ? '#34d399' : '#fbbf24'};">${op.term1_count}</span>
            </div>
            <div style="font-size: 1.3rem; color: var(--text-dim); font-weight: 300; user-select: none;">⇄</div>
            <div class="opposite-term-unit">
              <span class="ar-term">${op.term2_ar}</span>
              <span class="en-label">${op.term2_en}</span>
              <span class="cnt-num" style="color: ${op.is_balanced ? '#34d399' : '#fbbf24'};">${op.term2_count}</span>
            </div>
          </div>

          <div class="opposite-compact-insight">
            ${op.insight}
          </div>

          <div class="opposite-actions-row">
            ${(op.tibaq_count > 0 && op.tibaq_sample && op.tibaq_sample.length > 0) ? `
              <button class="card-action-btn" onclick="window.AnalyticsStudio.openTibaqModal(${origIdx})" style="background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.35); color: #fbbf24; padding: 3px 10px; font-size: 0.74rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 4px;">
                <span>📖 شواہد آیاتِ طباق (${op.tibaq_count}) ↗</span>
              </button>
            ` : `<span style="font-size: 0.74rem; color: #64748b;">(قرآنی الفاظ کا مفہومی تقابل)</span>`}
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">#${origIdx + 1}</span>
          </div>
        </article>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  setOppositesFilter(filter) {
    if (window.AudioSFX) window.AudioSFX.playClick();
    this.activeOppositesFilter = filter;
    this.renderOpposites();
  }

  openTibaqModal(idx) {
    if (window.AudioSFX) window.AudioSFX.playClick();
    const op = this.opposites[idx];
    if (!op) return;

    const modal = document.getElementById("tibaq-modal");
    const title = document.getElementById("tibaq-modal-title");
    const meta = document.getElementById("tibaq-modal-meta");
    const body = document.getElementById("tibaq-modal-body");
    if (!modal || !title || !meta || !body) return;

    title.innerHTML = `شواہد آیاتِ طباق: ${op.term1_ar} (${op.term1_count}) ⇄ ${op.term2_ar} (${op.term2_count})`;
    meta.innerHTML = `<strong>${op.concept}:</strong> ${op.insight} • مجموعی آیاتِ طباق: ${op.tibaq_count || op.tibaq_sample.length}`;

    if (op.tibaq_sample && op.tibaq_sample.length > 0) {
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${op.tibaq_sample.map(t => `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 12px 16px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
              <div style="font-family: var(--font-arabic); font-size: 1.28rem; color: #fef08a; direction: rtl; text-align: right; flex: 1 1 280px; line-height: 2.0;">${t.arabic}</div>
              <button class="filter-btn studio-jump-btn" data-surah="${t.surah}" data-ayah="${t.ayah}" onclick="window.AnalyticsStudio.closeTibaqModal()" style="flex-shrink: 0; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; font-weight: 700; padding: 5px 12px; border-radius: var(--radius-full); cursor: pointer;">Surah ${t.surah}:${t.ayah} ↗</button>
            </div>
          `).join("")}
        </div>
      `;
    } else {
      body.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 20px;">کوئی نمونہ آیات دستیاب نہیں ہیں۔</div>`;
    }

    modal.classList.add("open");
    modal.style.display = "flex";
    this.bindStudioJumpBtns(body);
  }

  closeTibaqModal() {
    if (window.AudioSFX) window.AudioSFX.playClick();
    const modal = document.getElementById("tibaq-modal");
    if (modal) {
      modal.classList.remove("open");
      modal.style.display = "none";
    }
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

    const dualText = (data.tokens_count && data.verses_count && data.tokens_count !== data.verses_count)
      ? `${data.tokens_count} Words • ${data.verses_count} Verses`
      : `${data.tokens_count || data.count} Mentions`;

    modalTitle.innerHTML = `
      <span>${data.name_en}</span>
      <span style="font-family: var(--font-arabic); font-size: 1.5rem; color: #38bdf8;">${data.name_ar}</span>
      <span class="count-pill">${dualText}</span>
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
            contentEl.innerHTML = ar ? `<div class="occ-ayah-arabic" dir="rtl">${ar}</div>` : '';
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
        const modalBody = document.getElementById("occ-modal-body");
        const modalTitle = document.getElementById("occ-modal-title");
        const isModalOpen = modal && modal.classList.contains("open");
        const titleText = isModalOpen
          ? (modalTitle ? modalTitle.innerText.trim() : "Word Occurrences")
          : (btn.dataset.label || "Analytics Studio");
        const scrollTop = (isModalOpen && modalBody) ? modalBody.scrollTop : 0;

        if (window.NavigationHistory) {
          window.NavigationHistory.pushReturnContext({
            originTab: "studio",
            originScrollY: window.scrollY,
            modalOpen: isModalOpen,
            modalScrollTop: scrollTop,
            label: titleText
          });
        }

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
