/**
 * js/notebook-engine.js
 * Quran Deep Analyzer Version 2.0 — Personal Research Notebook & Tadabbur Studio
 * Allows scholars and students to curate thematic dossiers, attach personal reflection notes
 * to any Ayah, categorize with tags, and export complete Markdown research dossiers.
 */

(function (global) {
  'use strict';

  const DEFAULT_FOLDERS = [
    { id: 'patience', name: 'صبر و استقامت (Patience & Fortitude)', icon: '🌿', color: '#10b981' },
    { id: 'duas', name: 'قرآنی دعائیں (Quranic Duas)', icon: '🤲', color: '#fbbf24' },
    { id: 'ethics', name: 'اخلاق و آداب (Manners & Ethics)', icon: '🌸', color: '#f43f5e' },
    { id: 'reflection', name: 'تدبر و تفکر (Deep Reflections)', icon: '💡', color: '#38bdf8' },
    { id: 'miracles', name: 'اعجاز و بصائر (Linguistic & Cosmic Wonders)', icon: '🔭', color: '#c084fc' }
  ];

  const NotebookEngine = {
    folders: [],
    notes: [],
    activeFolderId: 'all',
    searchQuery: '',
    isInitialized: false,

    init() {
      if (this.isInitialized || typeof window === 'undefined') return;

      this.loadFromStorage();
      this.render();
      this.isInitialized = true;
      console.log('[NotebookEngine] ✓ Version 2.0 Tadabbur Research Studio mounted.');
    },

    loadFromStorage() {
      try {
        const rawF = localStorage.getItem('quran_v2_notebook_folders');
        this.folders = rawF ? JSON.parse(rawF) : [...DEFAULT_FOLDERS];
      } catch (e) {
        this.folders = [...DEFAULT_FOLDERS];
      }

      try {
        const rawN = localStorage.getItem('quran_v2_notebook_notes');
        this.notes = rawN ? JSON.parse(rawN) : [];
      } catch (e) {
        this.notes = [];
      }
    },

    saveToStorage() {
      try {
        localStorage.setItem('quran_v2_notebook_folders', JSON.stringify(this.folders));
        localStorage.setItem('quran_v2_notebook_notes', JSON.stringify(this.notes));
      } catch (e) {}
    },

    addFolder(name, icon = '📁', color = '#fbbf24') {
      const id = 'f_' + Date.now();
      const folder = { id, name, icon, color };
      this.folders.push(folder);
      this.saveToStorage();
      this.render();
      return folder;
    },

    createFolder(name, color = '#fbbf24', desc = '') {
      return this.addFolder(name, '📁', color);
    },

    saveNote(dataOrSurah, ayahNum, text, tags, folderId) {
      if (typeof dataOrSurah === 'object' && dataOrSurah !== null) {
        const d = dataOrSurah;
        return this.addNote(d.surahId, d.ayahNum, d.body || d.text || d.title, d.tags || [], d.folderId);
      }
      return this.addNote(dataOrSurah, ayahNum, text, tags, folderId);
    },

    searchNotes(query) {
      if (!query) return this.notes;
      const q = query.toLowerCase();
      return this.notes.filter(n =>
        (n.text && n.text.toLowerCase().includes(q)) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q))) ||
        `surah ${n.surahId}:${n.ayahNum}`.includes(q)
      );
    },

    generateMarkdownDossier() {
      return this.exportMarkdownDossier();
    },

    addNote(surahId, ayahNum, text, tags = [], folderId = 'reflection') {
      const id = 'note_' + Date.now();
      const cleanTags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
      const note = {
        id,
        surahId: parseInt(surahId, 10),
        ayahNum: parseInt(ayahNum, 10),
        text: text.trim(),
        tags: cleanTags,
        folderId: folderId || 'reflection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.notes.unshift(note);
      this.saveToStorage();
      this.render();
      return note;
    },

    deleteNote(noteId) {
      this.notes = this.notes.filter(n => n.id !== noteId);
      this.saveToStorage();
      this.render();
    },

    getNotesForAyah(surahId, ayahNum) {
      return this.notes.filter(n => n.surahId === parseInt(surahId, 10) && n.ayahNum === parseInt(ayahNum, 10));
    },

    exportMarkdownDossier() {
      const dateStr = new Date().toLocaleDateString('en-GB');
      let md = `# 📖 Quran Deep Analyzer — Personal Tadabbur Research Dossier\n\n`;
      md += `*Generated on: ${dateStr} | Total Study Notes: ${this.notes.length} | Thematic Folders: ${this.folders.length}*\n\n`;
      md += `---\n\n`;

      this.folders.forEach(f => {
        const fNotes = this.notes.filter(n => n.folderId === f.id);
        if (fNotes.length === 0) return;

        md += `## ${f.icon} ${f.name}\n\n`;

        fNotes.forEach((n, idx) => {
          md += `### ${idx + 1}. Surah ${n.surahId}:${n.ayahNum}\n`;
          if (n.tags && n.tags.length > 0) {
            md += `*Tags: ${n.tags.map(t => '`' + t + '`').join(' ')}*\n\n`;
          }
          md += `> **Personal Reflection & Tadabbur:**\n> ${n.text.replace(/\n/g, '\n> ')}\n\n`;
          md += `---\n\n`;
        });
      });

      // Trigger download
      if (typeof document !== 'undefined') {
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Quran_Tadabbur_Dossier_${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      return md;
    },

    render() {
      if (typeof document === 'undefined') return;
      const container = document.getElementById('notebook-studio-mount');
      if (!container) return;

      const totalNotes = this.notes.length;
      const filteredNotes = this.notes.filter(n => {
        const matchesFolder = (this.activeFolderId === 'all' || n.folderId === this.activeFolderId);
        const matchesSearch = !this.searchQuery ||
          n.text.toLowerCase().includes(this.searchQuery) ||
          String(n.surahId).includes(this.searchQuery) ||
          String(n.ayahNum).includes(this.searchQuery) ||
          (n.tags && n.tags.some(t => t.toLowerCase().includes(this.searchQuery)));
        return matchesFolder && matchesSearch;
      });

      container.innerHTML = `
        <div class="notebook-studio-container">
          <!-- Notebook Executive KPI Bar -->
          <div class="notebook-kpi-ribbon">
            <div class="kpi-pill">
              <span class="kpi-num">${totalNotes}</span>
              <span class="kpi-label">تحقیقی نوٹس (Study Notes)</span>
            </div>
            <div class="kpi-pill">
              <span class="kpi-num">${this.folders.length}</span>
              <span class="kpi-label">موضوعاتی فولڈرز (Folders)</span>
            </div>
            <div class="kpi-pill">
              <span class="kpi-num">${new Set(this.notes.map(n => n.surahId)).size}</span>
              <span class="kpi-label">زیرِ مطالعہ سورتیں (Surahs)</span>
            </div>
            <button class="kpi-pill gold export-btn" id="notebook-export-btn" title="Export Markdown Dossier">
              <span class="kpi-num">📥 ڈوزیئر</span>
              <span class="kpi-label">ایکسپورٹ Markdown</span>
            </button>
          </div>

          <!-- Thematic Folders Navigation Ribbon -->
          <div class="notebook-folders-ribbon" id="notebook-folders-ribbon">
            <button class="module-tab-btn ${this.activeFolderId === 'all' ? 'active' : ''}" data-fid="all">
              <span>تمام نوٹس</span>
              <span class="module-tab-badge">${totalNotes}</span>
            </button>
            ${this.folders.map(f => {
              const count = this.notes.filter(n => n.folderId === f.id).length;
              return `
                <button class="module-tab-btn ${this.activeFolderId === f.id ? 'active' : ''}" data-fid="${f.id}">
                  <span>${f.icon}</span>
                  <span>${f.name}</span>
                  <span class="module-tab-badge">${count}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Notebook Search & Note Creator Toolbar -->
          <div class="notebook-toolbar">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="notebook-search-input" class="manners-search-field" placeholder="نوٹس یا ٹیگز تلاش کریں..." value="${this.searchQuery}">
            </div>
            <button class="notebook-add-btn" id="notebook-add-open-btn">
              <span>✍ نیا نوٹ شامل کریں</span>
            </button>
          </div>

          <!-- Note Quick Creation Drawer (Hidden by default) -->
          <div class="notebook-creator-drawer" id="notebook-creator-drawer" style="display: none;">
            <div class="creator-header">
              <span>✍ نیا تفسیری و تحقیقی نوٹ</span>
              <button class="creator-close-btn" id="notebook-creator-close">✕</button>
            </div>
            <div class="creator-body">
              <div class="creator-row">
                <input type="number" id="note-surah-input" placeholder="Surah #" min="1" max="114" style="width: 100px;">
                <input type="number" id="note-ayah-input" placeholder="Ayah #" min="1" max="286" style="width: 100px;">
                <select id="note-folder-select" class="audio-reciter-select">
                  ${this.folders.map(f => `<option value="${f.id}">${f.icon} ${f.name}</option>`).join('')}
                </select>
                <input type="text" id="note-tags-input" placeholder="ٹیگز (e.g. #صبر, #دعا, #حکمت)" style="flex: 1;">
              </div>
              <textarea id="note-text-input" class="creator-textarea" placeholder="اس آیت کے تحت اپنا ذاتی تدبر، نکتہ، یا فقہی فائدہ تحریر فرمائیں..."></textarea>
              <button class="notebook-save-btn" id="notebook-save-btn">محفوظ فرمائیں (Save Note)</button>
            </div>
          </div>

          <!-- Notes Stream -->
          <div class="notebook-notes-list">
            ${filteredNotes.length === 0 ? `
              <div style="text-align: center; padding: 48px 20px; color: #94a3b8; background: var(--bg-card-glass); border-radius: var(--radius-lg);">
                <div style="font-size: 2.2rem; margin-bottom: 8px;">📝</div>
                <div style="font-size: 1.15rem; font-weight: 700; color: #fbbf24;">کوئی تحقیقی نوٹ موجود نہیں ہے</div>
                <p style="margin-top: 6px; font-size: 0.88rem;">اوپر موجود بٹن یا کسی بھی آیت کے کارڈ سے نیا تدبر نوٹ شامل فرمائیں۔</p>
              </div>
            ` : filteredNotes.map(n => {
              const fObj = this.folders.find(f => f.id === n.folderId) || this.folders[0];
              const datePretty = new Date(n.createdAt).toLocaleDateString('en-GB');
              return `
                <article class="notebook-card" id="note-card-${n.id}">
                  <div class="notebook-card-header">
                    <div class="notebook-meta-left">
                      <span class="search-ayah-coord-badge">[Surah ${n.surahId}:${n.ayahNum}]</span>
                      <span class="notebook-folder-badge" style="border-color: ${fObj.color}; color: ${fObj.color};">
                        ${fObj.icon} ${fObj.name}
                      </span>
                      <span style="font-size: 0.78rem; color: #64748b;">${datePretty}</span>
                    </div>
                    <div class="notebook-meta-right">
                      <button class="search-micro-action analyzer-btn" onclick="window.CorpusEngine && window.CorpusEngine.jumpToAyah(${n.surahId}, ${n.ayahNum})">
                        <span>🔍 Analyzer ↗</span>
                      </button>
                      <button class="search-micro-action note-del-btn" data-nid="${n.id}" title="Delete Note" style="color: #fca5a5;">
                        <span>🗑</span>
                      </button>
                    </div>
                  </div>
                  <div class="notebook-card-body">
                    ${this.escapeHtml(n.text).replace(/\n/g, '<br>')}
                  </div>
                  ${n.tags && n.tags.length > 0 ? `
                    <div class="notebook-tags-wrap">
                      ${n.tags.map(t => `<span class="note-tag-chip">${this.escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </article>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // Bind interactions
      // Folder switching
      container.querySelectorAll('.notebook-folders-ribbon button').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          this.activeFolderId = btn.dataset.fid;
          this.render();
        });
      });

      // Search input
      const searchEl = document.getElementById('notebook-search-input');
      if (searchEl) {
        searchEl.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.render();
        });
      }

      // Drawer toggle
      const addOpenBtn = document.getElementById('notebook-add-open-btn');
      const drawer = document.getElementById('notebook-creator-drawer');
      const drawerClose = document.getElementById('notebook-creator-close');
      const saveBtn = document.getElementById('notebook-save-btn');

      if (addOpenBtn && drawer) {
        addOpenBtn.addEventListener('click', () => {
          if (window.AudioSFX) window.AudioSFX.playClick();
          drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
        });
      }

      if (drawerClose && drawer) {
        drawerClose.addEventListener('click', () => {
          drawer.style.display = 'none';
        });
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const sVal = document.getElementById('note-surah-input').value;
          const aVal = document.getElementById('note-ayah-input').value;
          const fVal = document.getElementById('note-folder-select').value;
          const tVal = document.getElementById('note-tags-input').value;
          const textVal = document.getElementById('note-text-input').value;

          if (!sVal || !aVal || !textVal.trim()) {
            alert('براہ کرم سورت نمبر، آیت نمبر، اور تدبر نوٹ تحریر فرمائیں۔');
            return;
          }

          if (window.AudioSFX) window.AudioSFX.playClick();
          this.addNote(sVal, aVal, textVal, tVal, fVal);
        });
      }

      // Delete buttons
      container.querySelectorAll('.note-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const nid = btn.dataset.nid;
          if (confirm('کیا آپ اس نوٹ کو حذف کرنا چاہتے ہیں؟')) {
            if (window.AudioSFX) window.AudioSFX.playClick();
            this.deleteNote(nid);
          }
        });
      });

      // Export button
      const exportBtn = document.getElementById('notebook-export-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          if (window.AudioSFX) window.AudioSFX.playTab();
          this.exportMarkdownDossier();
        });
      }
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  global.NotebookEngine = NotebookEngine;

})(typeof window !== 'undefined' ? window : this);
