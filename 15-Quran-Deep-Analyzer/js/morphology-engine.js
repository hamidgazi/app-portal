/**
 * ==============================================================================
 * 🌿 QURANIC ROOT & LEMMA MORPHOLOGY ENGINE (علم الصرف)
 * ==============================================================================
 * Authoritative computational Sarf laboratory for the Holy Quran.
 * Classifies all 1,642 Quranic roots into augmented Verb Forms (I to X),
 * Tenses (Madi, Mudari', Amr), Participles (Ism Fa'il / Maf'ul), and Verbal Nouns.
 * 
 * Features:
 * - On-demand Zero-CORS script injection (quran_morphology_bundle.js).
 * - Interactive 28-letter Arabic Alphabet Ribbon filter.
 * - Multi-criteria search (Arabic, English meanings, Roman Urdu).
 * - Cyber-Glass Sarf Inspector Modal with interactive tense pills.
 * - Bilingual Verse Concordance Drawer with origin-preserving Jump navigation.
 * ==============================================================================
 */

class MorphologyEngine {
  constructor() {
    this.rootsData = null;
    this.allRoots = [];
    this.alphabet = [];
    this.isLoading = false;
    this.activeLetter = "all";
    this.searchQuery = "";
    this.sortBy = "freq-desc";
    this.selectedRoot = null;
    this.renderedCount = 60;
    this.currentFiltered = [];
  }

  init() {
    console.log("[MorphologyEngine] Initializing Sarf engine listeners...");

    const searchInput = document.getElementById("roots-search-input");
    const clearBtn = document.getElementById("roots-search-clear");
    const sortSelect = document.getElementById("roots-sort-select");
    const modal = document.getElementById("root-inspector-modal");
    const closeBtn = document.getElementById("root-inspector-close");

    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          if (clearBtn) clearBtn.style.display = this.searchQuery ? "block" : "none";
          this.renderedCount = 60;
          this.renderRootsGrid();
        }, 180);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        if (searchInput) searchInput.value = "";
        this.searchQuery = "";
        clearBtn.style.display = "none";
        this.renderedCount = 60;
        this.renderRootsGrid();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.sortBy = e.target.value;
        this.renderedCount = 60;
        this.renderRootsGrid();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        modal.style.display = "none";
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display !== "none") {
          modal.style.display = "none";
        }
      });
    }
  }

  async onTabActivated() {
    if (this.rootsData) return;
    await this.loadMorphologyData();
  }

  async loadMorphologyData() {
    if (this.isLoading) return;
    this.isLoading = true;

    const container = document.getElementById("roots-grid-container");
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 14px; animation: spin 2s linear infinite;">🌿</div>
          <div style="font-size: 1.15rem; font-weight: 600; color: #fbbf24; margin-bottom: 6px;">Loading Quranic Morphology Dataset...</div>
          <div style="font-size: 0.88rem; color: #94a3b8;">Indexing 1,642 Roots, Verb Forms I–X, and Derivations (Zero-CORS)</div>
        </div>
      `;
    }

    try {
      // 1. Check if bundle is already in memory
      if (window.QURAN_MORPHOLOGY_DATA) {
        this.rootsData = window.QURAN_MORPHOLOGY_DATA;
        this.allRoots = this.rootsData.roots || [];
        this.alphabet = this.rootsData.metadata?.alphabet || [];
        this.finishLoading();
        return;
      }

      // 2. Try HTTP fetch if served over HTTP/HTTPS
      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("data/quran_roots_morphology.json");
          if (res.ok) {
            this.rootsData = await res.json();
            window.QURAN_MORPHOLOGY_DATA = this.rootsData;
            this.allRoots = this.rootsData.roots || [];
            this.alphabet = this.rootsData.metadata?.alphabet || [];
            this.finishLoading();
            return;
          }
        } catch (fetchErr) {
          console.warn("[MorphologyEngine] HTTP fetch failed, falling back to script injection:", fetchErr);
        }
      }

      // 3. Dynamic script injection (Zero-CORS for file:// protocol)
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "data/quran_morphology_bundle.js";
        script.onload = () => {
          if (window.QURAN_MORPHOLOGY_DATA) {
            this.rootsData = window.QURAN_MORPHOLOGY_DATA;
            this.allRoots = this.rootsData.roots || [];
            this.alphabet = this.rootsData.metadata?.alphabet || [];
            resolve();
          } else {
            reject(new Error("Morphology bundle loaded without window.QURAN_MORPHOLOGY_DATA"));
          }
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });

      this.finishLoading();

    } catch (err) {
      console.error("[MorphologyEngine] Failed to load morphology dataset:", err);
      if (container) {
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
            Failed to load morphological data. Please verify <code>data/quran_morphology_bundle.js</code> exists.
          </div>
        `;
      }
    } finally {
      this.isLoading = false;
    }
  }

  finishLoading() {
    console.log(`[MorphologyEngine] Loaded ${this.allRoots.length} roots successfully.`);
    const badge = document.getElementById("roots-stats-badge");
    if (badge) {
      badge.innerHTML = `<span class="stat-highlight">${this.allRoots.length.toLocaleString()}</span> Roots • <span class="stat-highlight">4,832</span> Lemmas`;
    }
    this.renderAlphabetRibbon();
    this.renderRootsGrid();
  }

  renderAlphabetRibbon() {
    const ribbon = document.getElementById("roots-alphabet-ribbon");
    if (!ribbon) return;

    let html = `<button class="alphabet-chip ${this.activeLetter === 'all' ? 'active' : ''}" data-letter="all">كُلّ (All)</button>`;

    // Default canonical 28 Arabic letters if not in metadata
    const letters = (this.alphabet && this.alphabet.length) 
      ? this.alphabet 
      : ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"];

    letters.forEach(letter => {
      const isActive = this.activeLetter === letter;
      html += `<button class="alphabet-chip ${isActive ? 'active' : ''}" data-letter="${letter}">${letter}</button>`;
    });

    ribbon.innerHTML = html;

    ribbon.querySelectorAll(".alphabet-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        ribbon.querySelectorAll(".alphabet-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeLetter = chip.dataset.letter;
        this.renderedCount = 60;
        this.renderRootsGrid();
      });
    });
  }

  renderRootsGrid() {
    const container = document.getElementById("roots-grid-container");
    if (!container) return;

    if (!this.allRoots || this.allRoots.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">No roots loaded.</div>`;
      return;
    }

    // 1. Filter by letter
    let filtered = this.allRoots;
    if (this.activeLetter !== "all") {
      filtered = filtered.filter(r => r.first_letter === this.activeLetter || (r.root_ar && r.root_ar.startsWith(this.activeLetter)));
    }

    // 2. Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(r => {
        return (r.root_ar && r.root_ar.includes(q)) ||
               (r.root_bw && r.root_bw.toLowerCase().includes(q)) ||
               (r.meaning_en && r.meaning_en.toLowerCase().includes(q)) ||
               (r.meaning_ur && r.meaning_ur.toLowerCase().includes(q));
      });
    }

    // 3. Sort
    filtered.sort((a, b) => {
      if (this.sortBy === "freq-desc") return b.total_occurrences - a.total_occurrences;
      if (this.sortBy === "freq-asc") return a.total_occurrences - b.total_occurrences;
      if (this.sortBy === "forms-desc") return b.verb_forms_count - a.verb_forms_count;
      if (this.sortBy === "alpha-asc") return (a.root_ar || "").localeCompare(b.root_ar || "", "ar");
      return b.total_occurrences - a.total_occurrences;
    });

    this.currentFiltered = filtered;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-dim);">
          <div style="font-size: 2rem; margin-bottom: 10px;">🔍</div>
          <div>No roots match your filter: <strong>"${this.searchQuery || this.activeLetter}"</strong></div>
        </div>
      `;
      return;
    }

    const visibleItems = filtered.slice(0, this.renderedCount);

    let html = "";
    visibleItems.forEach(r => {
      const formsCount = r.verb_forms_count || (r.verb_forms ? r.verb_forms.length : 0);
      const actPcplsCount = (r.participles && r.participles.active) ? r.participles.active.length : 0;
      const vnCount = (r.verbal_nouns) ? r.verbal_nouns.length : 0;

      html += `
        <div class="root-card" data-root="${r.root_bw}">
          <div>
            <div class="root-card-top-row">
              <span class="root-card-calligraphy">${r.root_display || r.root_ar}</span>
              <span class="root-card-count-badge">${r.total_occurrences.toLocaleString()} Ayat</span>
            </div>
            <div class="root-card-meanings">
              <div class="root-meaning-en">${r.meaning_en || 'Root meaning'}</div>
              <div class="root-meaning-ur">${r.meaning_ur || ''}</div>
            </div>
          </div>

          <div class="root-card-forms-row">
            ${formsCount > 0 ? `<span class="root-form-tag form-i">${formsCount} Verb Form${formsCount > 1 ? 's' : ''}</span>` : ''}
            ${actPcplsCount > 0 ? `<span class="root-form-tag pcpl">Participle (${actPcplsCount})</span>` : ''}
            ${vnCount > 0 ? `<span class="root-form-tag vn">Masdar (${vnCount})</span>` : ''}
            <span class="root-form-tag" style="background: rgba(255,255,255,0.05); color: var(--text-dim); border-color: rgba(255,255,255,0.1);">In ${r.unique_surahs_count || 1} Surahs</span>
          </div>
        </div>
      `;
    });

    if (filtered.length > this.renderedCount) {
      html += `
        <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
          <button id="roots-load-more-btn" class="concordance-jump-btn" style="padding: 10px 24px; font-size: 0.95rem;">
            Load More Roots (${filtered.length - this.renderedCount} remaining)
          </button>
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach card click handlers
    container.querySelectorAll(".root-card").forEach(card => {
      card.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const rootBw = card.dataset.root;
        this.openRootInspector(rootBw);
      });
    });

    const loadMoreBtn = document.getElementById("roots-load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        this.renderedCount += 60;
        this.renderRootsGrid();
      });
    }
  }

  openRootInspector(rootBw) {
    const root = this.allRoots.find(r => r.root_bw === rootBw);
    if (!root) return;

    this.selectedRoot = root;
    const modal = document.getElementById("root-inspector-modal");
    const titleAr = document.getElementById("inspector-root-ar");
    const meanings = document.getElementById("inspector-root-meanings");
    const meta = document.getElementById("inspector-root-meta");
    const content = document.getElementById("root-inspector-content");

    if (titleAr) titleAr.textContent = root.root_display || root.root_ar;
    if (meanings) meanings.textContent = `${root.meaning_en} • ${root.meaning_ur}`;
    if (meta) {
      meta.textContent = `${root.total_occurrences.toLocaleString()} Total Occurrences • Found in ${root.unique_surahs_count || 1} Surahs • ${root.verb_forms_count || 0} Augmented Verb Forms`;
    }

    if (content) {
      let html = "";

      // 1. Verb Forms Grid (Forms I to X)
      if (root.verb_forms && root.verb_forms.length > 0) {
        html += `
          <div>
            <div class="sarf-section-title">
              <span>📖 Augmented Verb Forms (أوزان الأفعال)</span>
              <span class="section-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${root.verb_forms.length} Forms Found</span>
            </div>
            <div class="sarf-forms-grid">
        `;

        root.verb_forms.forEach(vf => {
          html += `
            <div class="sarf-form-card">
              <div class="sarf-form-header">
                <span class="sarf-form-title">${vf.form_name}</span>
                <span class="sarf-form-count">${vf.count} Occurrences</span>
              </div>
          `;

          // Past Tense (Madi)
          if (vf.perf && vf.perf.length > 0) {
            html += `
              <div class="sarf-tense-group">
                <div class="sarf-tense-label">Past (الماضي)</div>
                <div class="sarf-words-row">
                  ${vf.perf.map(w => `
                    <button class="sarf-word-pill inspect-vf-btn" data-form="${vf.form}" data-word="${w.word}">
                      <span>${w.word}</span>
                      <span class="sarf-word-count">(${w.count})</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }

          // Present Tense (Mudari')
          if (vf.impf && vf.impf.length > 0) {
            html += `
              <div class="sarf-tense-group">
                <div class="sarf-tense-label">Present / Future (المضارع)</div>
                <div class="sarf-words-row">
                  ${vf.impf.map(w => `
                    <button class="sarf-word-pill inspect-vf-btn" data-form="${vf.form}" data-word="${w.word}">
                      <span>${w.word}</span>
                      <span class="sarf-word-count">(${w.count})</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }

          // Imperative (Amr)
          if (vf.impv && vf.impv.length > 0) {
            html += `
              <div class="sarf-tense-group">
                <div class="sarf-tense-label">Imperative (الأمر)</div>
                <div class="sarf-words-row">
                  ${vf.impv.map(w => `
                    <button class="sarf-word-pill inspect-vf-btn" data-form="${vf.form}" data-word="${w.word}">
                      <span>${w.word}</span>
                      <span class="sarf-word-count">(${w.count})</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }

          // Passive Voice (Majhul)
          if (vf.pass && vf.pass.length > 0) {
            html += `
              <div class="sarf-tense-group">
                <div class="sarf-tense-label">Passive Voice (المجهول)</div>
                <div class="sarf-words-row">
                  ${vf.pass.map(w => `
                    <button class="sarf-word-pill inspect-vf-btn" data-form="${vf.form}" data-word="${w.word}">
                      <span>${w.word}</span>
                      <span class="sarf-word-count">(${w.count})</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }

          html += `</div>`;
        });

        html += `</div></div>`;
      }

      // 2. Participles Shelves (Ism Fa'il / Ism Maf'ul)
      const actPcpls = root.participles?.active || [];
      const passPcpls = root.participles?.passive || [];
      if (actPcpls.length > 0 || passPcpls.length > 0) {
        html += `
          <div>
            <div class="sarf-section-title">
              <span>⚖️ Participles (اسم الفاعل والمفعول)</span>
            </div>
            <div class="sarf-shelf-grid">
        `;

        actPcpls.forEach(p => {
          const formText = p.forms && p.forms.length ? `Form ${p.forms.join(', ')}` : 'Active Participle';
          html += `
            <div class="sarf-shelf-card inspect-pcpl-btn" data-type="active" data-lemma="${p.lemma}">
              <div>
                <div class="shelf-card-ar">${p.lemma}</div>
                <div style="font-size: 0.78rem; color: #c084fc;">Ism Fa'il (${formText})</div>
              </div>
              <span class="shelf-card-count">${p.count} Ayat</span>
            </div>
          `;
        });

        passPcpls.forEach(p => {
          const formText = p.forms && p.forms.length ? `Form ${p.forms.join(', ')}` : 'Passive Participle';
          html += `
            <div class="sarf-shelf-card inspect-pcpl-btn" data-type="passive" data-lemma="${p.lemma}">
              <div>
                <div class="shelf-card-ar">${p.lemma}</div>
                <div style="font-size: 0.78rem; color: #fbbf24;">Ism Maf'ul (${formText})</div>
              </div>
              <span class="shelf-card-count" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">${p.count} Ayat</span>
            </div>
          `;
        });

        html += `</div></div>`;
      }

      // 3. Verbal Nouns (Masdar)
      const vns = root.verbal_nouns || [];
      if (vns.length > 0) {
        html += `
          <div>
            <div class="sarf-section-title">
              <span>📜 Verbal Nouns (المصادر • Masdar)</span>
            </div>
            <div class="sarf-shelf-grid">
        `;

        vns.forEach(vn => {
          html += `
            <div class="sarf-shelf-card inspect-vn-btn" data-lemma="${vn.lemma}">
              <div>
                <div class="shelf-card-ar">${vn.lemma}</div>
                <div style="font-size: 0.78rem; color: #34d399;">Verbal Noun (Masdar)</div>
              </div>
              <span class="shelf-card-count" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">${vn.count} Ayat</span>
            </div>
          `;
        });

        html += `</div></div>`;
      }

      // 4. Common Derived Nouns & Adjectives
      const nouns = root.nouns || [];
      if (nouns.length > 0) {
        html += `
          <div>
            <div class="sarf-section-title">
              <span>🏷️ Other Derived Nouns & Names (الأسماء والصفات)</span>
            </div>
            <div class="sarf-shelf-grid">
        `;

        nouns.forEach(n => {
          html += `
            <div class="sarf-shelf-card inspect-noun-btn" data-lemma="${n.lemma}">
              <div>
                <div class="shelf-card-ar">${n.lemma}</div>
                <div style="font-size: 0.78rem; color: #94a3b8;">${n.pos === 'ADJ' ? 'Adjective / Sifah' : 'Noun / Ism'}</div>
              </div>
              <span class="shelf-card-count" style="background: rgba(255, 255, 255, 0.08); color: #cbd5e1;">${n.count} Ayat</span>
            </div>
          `;
        });

        html += `</div></div>`;
      }

      // Drawer container for verse concordance
      html += `<div id="sarf-concordance-drawer-wrap"></div>`;

      content.innerHTML = html;

      // Event delegation for opening verse concordance
      content.querySelectorAll(".inspect-vf-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          const formNum = btn.dataset.form;
          const word = btn.dataset.word;
          const vf = root.verb_forms.find(v => v.form === formNum);
          if (vf && vf.occurrences) {
            this.renderVerseConcordance(`Verb Form ${vf.form} (${word})`, vf.occurrences);
          }
        });
      });

      content.querySelectorAll(".inspect-pcpl-btn").forEach(card => {
        card.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          const lemma = card.dataset.lemma;
          const type = card.dataset.type;
          const pool = type === "active" ? root.participles.active : root.participles.passive;
          const p = pool.find(item => item.lemma === lemma);
          if (p && p.occurrences) {
            this.renderVerseConcordance(`Participle: ${lemma}`, p.occurrences);
          }
        });
      });

      content.querySelectorAll(".inspect-vn-btn").forEach(card => {
        card.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          const lemma = card.dataset.lemma;
          const vn = root.verbal_nouns.find(item => item.lemma === lemma);
          if (vn && vn.occurrences) {
            this.renderVerseConcordance(`Masdar (Verbal Noun): ${lemma}`, vn.occurrences);
          }
        });
      });

      content.querySelectorAll(".inspect-noun-btn").forEach(card => {
        card.addEventListener("click", () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          const lemma = card.dataset.lemma;
          const n = root.nouns.find(item => item.lemma === lemma);
          if (n && n.occurrences) {
            this.renderVerseConcordance(`Noun: ${lemma}`, n.occurrences);
          }
        });
      });
    }

    if (modal) modal.style.display = "flex";
  }

  async renderVerseConcordance(title, occurrences) {
    const wrap = document.getElementById("sarf-concordance-drawer-wrap");
    if (!wrap) return;

    wrap.innerHTML = `
      <div class="sarf-concordance-drawer">
        <div class="concordance-drawer-header">
          <span class="concordance-drawer-title">📜 ${title} (${occurrences.length} Sample Verses)</span>
          <button id="close-concordance-btn" class="modal-close-btn" style="padding: 2px 8px; font-size: 0.9rem;">✕</button>
        </div>
        <div id="concordance-verses-list">
          <div style="text-align: center; padding: 20px; color: var(--text-dim);">Loading verses...</div>
        </div>
      </div>
    `;

    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const closeBtn = document.getElementById("close-concordance-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        wrap.innerHTML = "";
      });
    }

    const listContainer = document.getElementById("concordance-verses-list");
    if (!listContainer) return;

    let versesHtml = "";

    // Show up to 15 sample occurrences
    const sampleLocs = occurrences.slice(0, 15);

    for (let i = 0; i < sampleLocs.length; i++) {
      const loc = sampleLocs[i];
      const sId = loc[0];
      const aNo = loc[1];

      let surahData = window.QURAN_SURAHS && window.QURAN_SURAHS[sId];
      if (!surahData && window.CorpusEngine) {
        await window.CorpusEngine.loadSurah(sId);
        surahData = window.QURAN_SURAHS && window.QURAN_SURAHS[sId];
      }

      if (surahData && surahData.ayat) {
        const ayahObj = surahData.ayat.find(a => a.number === aNo) || surahData.ayat[aNo - 1];
        if (ayahObj) {
          const arText = ayahObj.ar || ayahObj.text || "";
          const urText = ayahObj.ur_kanzuliman || ayahObj.ur || "";
          const enText = ayahObj.en || "";

          versesHtml += `
            <div class="concordance-verse-card">
              <div class="concordance-verse-meta">
                <span style="font-weight: 700; color: #fbbf24;">Surah ${surahData.name_roman || sId} (${sId}:${aNo})</span>
                <button class="concordance-jump-btn jump-to-ayah-btn" data-surah="${sId}" data-ayah="${aNo}">
                  <span>Read in Ayah Analyzer ↗</span>
                </button>
              </div>
              <div class="concordance-verse-ar">${arText}</div>
              ${urText ? `<div class="concordance-verse-ur">${urText}</div>` : ''}
              ${enText ? `<div class="concordance-verse-en">${enText}</div>` : ''}
            </div>
          `;
        }
      }
    }

    if (!versesHtml) {
      versesHtml = `<div style="text-align: center; padding: 20px; color: var(--text-dim);">No verse text loaded.</div>`;
    }

    listContainer.innerHTML = versesHtml;

    // Jump to Ayah with Return to Origin state preservation
    listContainer.querySelectorAll(".jump-to-ayah-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.AudioSFX) window.AudioSFX.playClick();
        const sId = parseInt(btn.dataset.surah, 10);
        const aNo = parseInt(btn.dataset.ayah, 10);

        if (window.NavigationHistory) {
          window.NavigationHistory.pushState("roots", `Root: ${this.selectedRoot?.root_ar || 'Morphology'}`, () => {
            if (window.switchAppTab) window.switchAppTab("roots");
            if (this.selectedRoot) this.openRootInspector(this.selectedRoot.root_bw);
          });
        }

        const modal = document.getElementById("root-inspector-modal");
        if (modal) modal.style.display = "none";

        if (window.CorpusEngine) {
          window.CorpusEngine.jumpToAyah(sId, aNo);
        }
      });
    });
  }
}

window.MorphologyEngine = new MorphologyEngine();
