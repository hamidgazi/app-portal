/**
 * js/waqf-engine.js
 * Universal Quranic Waqf & Stop Sign Engine
 * Provides:
 * - Authentic Golden Ayah Stop Sign (۝ [number]) with English standard digits
 * - Interactive Trilingual Tooltips (Urdu + Roman Urdu + English) for all Quranic pause symbols
 * - Comprehensive Waqf Guide Reference Modal
 * - Plaintext helpers for Copy & WhatsApp sharing
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WaqfEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WAQF_DEFINITIONS = {
    ayah_end: {
      key: "ayah_end",
      symbol: "۝",
      name_ur: "آیت کا نشان (وقفِ تام)",
      name_roman: "Ayah Stop Sign (Waqf Tamm)",
      action_roman: "Mukammal thheherna Sunnat aur behtar hai",
      name_en: "Full Stop (End of Ayah)",
      rule_en: "End of the verse. It is the Prophetic Sunnah to stop, breathe, and reflect before proceeding.",
      color: "#fbbf24"
    },
    mutlaq: {
      key: "mutlaq",
      symbol: "ؕ",
      name_ur: "وقفِ مطلق (ط / ؕ)",
      name_roman: "Waqf Mutlaq",
      action_roman: "Baat mukammal ho gayi, yahan thheherna behtar hai",
      name_en: "Absolute Stop",
      rule_en: "The sentence thought is complete. Highly recommended to stop here.",
      color: "#f59e0b"
    },
    lazim: {
      key: "lazim",
      symbol: "ۘ",
      name_ur: "وقفِ لازم (مـ / ۘ)",
      name_roman: "Waqf Lazim",
      action_roman: "Yahan thheherna zaroori hai taake ma'na na badle",
      name_en: "Compulsory Stop",
      rule_en: "Must stop here; continuing without stopping could change the intended theological meaning.",
      color: "#f43f5e"
    },
    jaiz: {
      key: "jaiz",
      symbol: "ۚ",
      name_ur: "وقفِ جائز (ج / ۚ)",
      name_roman: "Waqf Ja'iz",
      action_roman: "Thheherna aur milana dono jaiz hain",
      name_en: "Permissible Pause",
      rule_en: "Permissible to pause or continue; both choices are equally valid.",
      color: "#38bdf8"
    },
    mujawwaz: {
      key: "mujawwaz",
      symbol: "ۖ",
      name_ur: "وقفِ مجوَّز (ز / ۖ)",
      name_roman: "Waqf Mujawwaz",
      action_roman: "Mila kar padhna behtar hai, thheherna bhi jaiz hai",
      name_en: "Good to Continue",
      rule_en: "Continuing is preferable, though pausing is allowed.",
      color: "#10b981"
    },
    murakhkhas: {
      key: "murakhkhas",
      symbol: "ۗ",
      name_ur: "وقفِ مرخَّص (ص / ۗ)",
      name_roman: "Waqf Murakh-khas",
      action_roman: "Saans tootne par thheherne ki rukhsat hai",
      name_en: "License Pause",
      rule_en: "Permissible to stop if running out of breath; resume or repeat if appropriate.",
      color: "#60a5fa"
    },
    la: {
      key: "la",
      symbol: "ۙ",
      name_ur: "لا وقف (لا / ۙ)",
      name_roman: "La Waqf (Do Not Stop)",
      action_roman: "Yahan mat rukein, aage mila kar padhein",
      name_en: "Do Not Stop",
      rule_en: "Do not stop here because the sentence meaning continues (unless at the end of an ayah).",
      color: "#fb923c"
    },
    qif: {
      key: "qif",
      symbol: "قف",
      name_ur: "قِف (ٹھہریے)",
      name_roman: "Qif (Pause)",
      action_roman: "Yahan zara thheherna behtar hai",
      name_en: "Pause Here",
      rule_en: "Recommended to pause here to enhance clarity of the recitation.",
      color: "#c084fc"
    },
    muanaqah: {
      key: "muanaqah",
      symbol: "ۛ",
      name_ur: "مُعَانَقَہ (ۛ ... ۛ)",
      name_roman: "Mu'anaqah (Embracing Stop)",
      action_roman: "Kisi ek nishan par rukein, dono par nahi",
      name_en: "Embracing Paired Stop",
      rule_en: "These appear in pairs. You may stop at either the first or second mark, but never at both.",
      color: "#fbbf24"
    },
    kadhalik: {
      key: "kadhalik",
      symbol: "۫",
      name_ur: "وقفِ کذٰلک (ک / ۫)",
      name_roman: "Waqf Kadhalik",
      action_roman: "Is ka hukm pichle waqf jaisa hai",
      name_en: "Similar to Preceding Stop",
      rule_en: "Takes the same pause ruling as the preceding waqf mark in the sentence.",
      color: "#38bdf8"
    },
    saktah: {
      key: "saktah",
      symbol: "ۜ",
      name_ur: "سکتہ (س / ۜ)",
      name_roman: "Saktah (Silence Without Breath)",
      action_roman: "Saans tode baghair thodi der aawaz rokein",
      name_en: "Brief Breathless Pause",
      rule_en: "Pause sound briefly without breaking breath before resuming.",
      color: "#a855f7"
    },
    sajdah: {
      key: "sajdah",
      symbol: "۩",
      name_ur: "آیتِ سجدہ (۩)",
      name_roman: "Ayah Sajdah",
      action_roman: "Yahan Sajdah-e-Tilawat wajib/sunnat hai",
      name_en: "Prostration Indicator",
      rule_en: "Indicates a verse of prostration (Sajdah Tilawat).",
      color: "#10b981"
    }
  };

  class WaqfEngine {
    constructor() {
      this.definitions = WAQF_DEFINITIONS;
      this.activePopover = null;
      this.initGlobalListeners();
    }

    /**
     * Format Arabic Scripture with End-of-Ayah Golden Medallion and Interactive Waqf Marks
     * @param {string} arabicText - The raw or Tajweed-marked Arabic verse text
     * @param {number|string} ayahNum - Ayah number
     * @param {object} options - Optional flags { includeInlineWaqf: true }
     * @returns {string} HTML string
     */
    formatArabicWithStopSigns(arabicText, ayahNum, options = {}) {
      if (!arabicText) return '';
      let text = String(arabicText).trim();
      const num = (ayahNum !== undefined && ayahNum !== null) ? String(ayahNum) : '';

      // 1. Wrap inline waqf marks if enabled (default: true)
      if (options.includeInlineWaqf !== false) {
        text = this.wrapInlineWaqfSymbols(text);
      }

      // 2. Append End-of-Ayah Sign (۝ [number]) if ayahNum provided and not already present
      if (num && !text.includes('quran-ayah-stop-mark') && !text.includes('۝')) {
        // Strip trailing dashes, waqf mutlaq at very end or spaces
        text = text.replace(/[\s\-\u0615\u06D5-\u06DC\u06EB\u06EA\u06EC\u06ED\u06E2\u06E9]+$/, '');
        const digitsClass = num.length >= 3 ? ' digits-3' : '';
        const endSignHtml = ` <span class="quran-ayah-stop-mark" data-waqf-key="ayah_end" data-ayah="${num}" data-digits="${num.length}" role="button" tabindex="0" title="End of Ayah ${num} • وقفِ تام" aria-label="End of Ayah ${num}"><span class="quran-ayah-stop-symbol">۝</span><span class="quran-ayah-stop-num${digitsClass}">${num}</span></span>`;
        text = text + endSignHtml;
      }

      return text;
    }

    /**
     * Wrap inline pause marks with interactive clickable spans
     */
    wrapInlineWaqfSymbols(text) {
      if (!text) return '';

      // Pattern covering standard Unicode Quranic pause diacritics:
      // \u0615 (Small High Tah ؕ - Mutlaq)
      // \u06D6 (Sad-Lam ۖ - Mujawwaz)
      // \u06D7 (Qaf-Lam ۗ - Murakhkhas)
      // \u06D8 (Small High Meem ۘ - Lazim)
      // \u06D9 (Small High Lam-Alif ۙ - La Waqf)
      // \u06DA (Small High Jeem ۚ - Jaiz)
      // \u06DB (Three dots ۛ - Muanaqah)
      // \u06DC (Small Seen ۜ - Saktah)
      // \u06EB (Empty Centre Stop ۫ - Kadhalik)
      // \u06EA (Empty Centre Low Stop ۪ - Kadhalik)
      // \u06EC (Rounded High Stop ۬ - Kadhalik)
      // \u06ED (Small Low Meem ۭ - Lazim)
      // \u06E2 (Small High Meem ۢ - Lazim)
      // \u06E9 (Place of Sajdah ۩ - Sajdah)
      // Also matches attached Indo-Pak hyphens (e.g., ؕ-, ۫-) and sanitizes them cleanly
      let result = text.replace(/([\u0615\u06D5\u06D6-\u06DC\u06EB\u06EA\u06EC\u06ED\u06E2\u06E9])(?:\s*[\-\u200C\u200D\u200E\u200F\u00A0]*\-)?/g, (match, char) => {
        let key = "mutlaq";
        if (char === '\u06D8' || char === '\u06E2' || char === '\u06ED') key = "lazim";
        else if (char === '\u06DA') key = "jaiz";
        else if (char === '\u06D6') key = "mujawwaz";
        else if (char === '\u06D7') key = "murakhkhas";
        else if (char === '\u06D9') key = "la";
        else if (char === '\u06DB') key = "muanaqah";
        else if (char === '\u0615' || char === '\u06D5') key = "mutlaq";
        else if (char === '\u06EB' || char === '\u06EA' || char === '\u06EC') key = "kadhalik";
        else if (char === '\u06DC') key = "saktah";
        else if (char === '\u06E9') key = "sajdah";

        const def = this.definitions[key] || this.definitions.mutlaq;
        return `<span class="quran-waqf-inline-mark" data-waqf-key="${key}" role="button" tabindex="0" title="${def.name_ur} • ${def.name_en}" aria-label="${def.name_roman}">${char}</span>`;
      });

      // Remove unwanted whitespace before inline waqf spans so they attach smoothly to preceding words
      result = result.replace(/([^\s>])\s+(<span class="quran-waqf-inline-mark")/g, '$1$2');

      // Guarantee single standard space after waqf mark when followed by another word
      result = result.replace(/(<\/span>)(?=[^\s<])/g, '$1 ');

      // Sanitize any orphaned trailing hyphens leftover from old data
      result = result.replace(/(\S)\-(?=\s|$)/g, '$1');

      // Collapse multiple consecutive spaces
      result = result.replace(/[ \t\u00A0]{2,}/g, ' ');

      return result.trim();
    }

    /**
     * Append clean plaintext stop mark for Clipboard and WhatsApp sharing
     * e.g. "وَسَیَجْزِی اللّٰهُ الشّٰكِرِیْنَ ۝ 144"
     */
    appendPlainTextStopSign(arabicText, ayahNum) {
      if (!arabicText) return '';
      let clean = String(arabicText).replace(/<[^>]+>/g, '').replace(/[«»]/g, '').trim();
      const num = (ayahNum !== undefined && ayahNum !== null) ? String(ayahNum) : '';
      if (num && !clean.includes('۝')) {
        clean = clean.replace(/[\s\-\u0615\u06D5-\u06DB\u06EB]+$/, '') + ` ۝ ${num}`;
      }
      return clean;
    }

    /**
     * Initialize Global Click & Hover Listeners
     */
    initGlobalListeners() {
      if (typeof document === 'undefined') return;

      document.addEventListener('click', (e) => {
        const mark = e.target.closest('.quran-ayah-stop-mark, .quran-waqf-inline-mark');
        if (mark) {
          e.preventDefault();
          e.stopPropagation();
          if (window.AudioSFX) window.AudioSFX.playClick();
          this.showPopover(mark);
          return;
        }

        // Close on clicking outside
        if (this.activePopover && !e.target.closest('#quran-waqf-popover')) {
          this.hidePopover();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hidePopover();
          this.closeGuideModal();
        }
      });
    }

    /**
     * Render and position Trilingual Micro-Tooltip Popover
     */
    showPopover(targetEl) {
      this.hidePopover();

      const key = targetEl.dataset.waqfKey || 'ayah_end';
      const ayahNum = targetEl.dataset.ayah || '';
      const def = this.definitions[key] || this.definitions.ayah_end;

      let popover = document.getElementById('quran-waqf-popover');
      if (!popover) {
        popover = document.createElement('div');
        popover.id = 'quran-waqf-popover';
        popover.className = 'quran-waqf-popover-tooltip';
        document.body.appendChild(popover);
      }

      const displaySymbol = key === 'ayah_end' ? `۝ ${ayahNum}` : def.symbol;
      const titleUrdu = key === 'ayah_end' && ayahNum ? `آیت کا نشان (آیت ${ayahNum} • وقفِ تام)` : def.name_ur;

      popover.innerHTML = `
        <div class="waqf-popover-header">
          <div class="waqf-popover-symbol-badge" style="color: ${def.color}; border-color: ${def.color};">
            ${displaySymbol}
          </div>
          <div class="waqf-popover-titles">
            <div class="waqf-popover-title-ur">${titleUrdu}</div>
            <div class="waqf-popover-title-en">${def.name_en}</div>
          </div>
          <button class="waqf-popover-close-btn" aria-label="Close" onclick="window.WaqfEngine.hidePopover()">✕</button>
        </div>

        <div class="waqf-popover-body">
          <div class="waqf-popover-section roman">
            <span class="waqf-lang-tag">Roman Urdu</span>
            <p class="waqf-popover-text">${def.action_roman}</p>
          </div>
          <div class="waqf-popover-section en">
            <span class="waqf-lang-tag">Rule & Action</span>
            <p class="waqf-popover-text">${def.rule_en}</p>
          </div>
        </div>

        <div class="waqf-popover-footer">
          <button class="waqf-open-guide-link" onclick="window.WaqfEngine.openGuideModal(); window.WaqfEngine.hidePopover();">
            <span>🛑 All Stop Signs Guide</span>
          </button>
        </div>
      `;

      // Position Popover above or below target
      const rect = targetEl.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      popover.style.display = 'block';
      popover.style.visibility = 'hidden';

      const popoverWidth = Math.min(330, window.innerWidth - 24);
      popover.style.width = `${popoverWidth}px`;

      const popoverHeight = popover.offsetHeight;
      let top = rect.bottom + scrollY + 8;
      let left = rect.left + scrollX + (rect.width / 2) - (popoverWidth / 2);

      // Boundary protection
      if (left < 12) left = 12;
      if (left + popoverWidth > window.innerWidth - 12) {
        left = window.innerWidth - popoverWidth - 12;
      }

      // If overflowing bottom, display above
      if (rect.bottom + popoverHeight + 16 > window.innerHeight && rect.top > popoverHeight + 16) {
        top = rect.top + scrollY - popoverHeight - 8;
      }

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.style.visibility = 'visible';
      popover.classList.add('show');

      this.activePopover = popover;
    }

    hidePopover() {
      if (this.activePopover) {
        this.activePopover.classList.remove('show');
        this.activePopover.style.display = 'none';
        this.activePopover = null;
      }
    }

    /**
     * Open Full Reference Guide Modal for All 9 Quranic Waqf Stop Signs
     */
    openGuideModal() {
      let modal = document.getElementById('waqf-guide-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'waqf-guide-modal';
        modal.className = 'waqf-modal-backdrop';
        document.body.appendChild(modal);
      }

      const rows = Object.values(this.definitions).map(d => `
        <tr class="waqf-guide-row">
          <td class="waqf-symbol-col">
            <span class="waqf-guide-symbol" style="color: ${d.color}; border-color: ${d.color};">${d.symbol}</span>
          </td>
          <td class="waqf-urdu-col">
            <div class="guide-ur-name">${d.name_ur}</div>
            <div class="guide-roman-name">${d.name_roman}</div>
          </td>
          <td class="waqf-desc-col">
            <div class="guide-roman-action"><strong>Roman Urdu:</strong> ${d.action_roman}</div>
            <div class="guide-en-rule"><strong>Rule:</strong> ${d.rule_en}</div>
          </td>
        </tr>
      `).join('');

      modal.innerHTML = `
        <div class="waqf-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="waqf-guide-title">
          <div class="waqf-modal-header">
            <div class="waqf-modal-title-wrap">
              <span class="waqf-modal-icon">🛑</span>
              <h2 id="waqf-guide-title" class="waqf-modal-heading">Quranic Stop Signs & Waqf Rules Guide</h2>
            </div>
            <button class="waqf-modal-close-btn" aria-label="Close" onclick="window.WaqfEngine.closeGuideModal()">✕</button>
          </div>

          <div class="waqf-modal-intro">
            <p>In the Holy Quran, pause marks (رموزِ اوقاف) guide the reader where to stop, breathe, or continue so that the divine meanings are preserved in complete purity.</p>
          </div>

          <div class="waqf-modal-body">
            <table class="waqf-guide-table">
              <thead>
                <tr>
                  <th>Sign</th>
                  <th>Classical Name</th>
                  <th>Guidance & Action (Trilingual)</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

          <div class="waqf-modal-footer">
            <span style="font-size: 0.82rem; color: #94a3b8;">💡 Tip: Tap any pause symbol or Ayah stop sign anywhere in the app to see instant trilingual guidance.</span>
            <button class="waqf-btn-primary" onclick="window.WaqfEngine.closeGuideModal()">Got It</button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
      modal.classList.add('show');
    }

    closeGuideModal() {
      const modal = document.getElementById('waqf-guide-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    }
  }

  return new WaqfEngine();
}));
