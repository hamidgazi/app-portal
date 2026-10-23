/**
 * js/tajweed-engine.js
 * Quran Deep Analyzer Version 2.0 — Dynamic Phonological Tajweed Rule Calligraphy
 * Automatically parses Arabic scripture and annotates Tajweed rules:
 * - Ghunnah (غنہ - Emerald Green #10b981)
 * - Qalqalah (قلقلہ - Sky Blue #38bdf8)
 * - Madd (مد - Crimson Rose #f43f5e)
 * - Ikhfa (اخفاء - Teal #2dd4bf)
 * - Idgham (ادغام - Amethyst Purple #c084fc)
 * - Iqlab (اقلاب - Amber Gold #f59e0b)
 */

(function (global) {
  'use strict';

  const TAJWEED_RULES = {
    ghunnah: {
      id: 'ghunnah',
      name_ur: 'غنہ (Ghunnah)',
      name_en: 'Nasalization (2 Counts)',
      color: '#10b981',
      description: 'نّ یا مّ پر دو حرکات کی مقدار ناک سے آواز نکال کر غنہ کرنا واجب ہے۔'
    },
    qalqalah: {
      id: 'qalqalah',
      name_ur: 'قلقلہ (Qalqalah)',
      name_en: 'Echoing Bounce',
      color: '#38bdf8',
      description: 'حروف قطب جد (ق، ط، ب، ج، د) جب ساکن ہوں تو ان میں مخرج کو ہلا کر گونج پیدا کی جاتی ہے۔'
    },
    madd: {
      id: 'madd',
      name_ur: 'مد (Madd)',
      name_en: 'Prolongation (4-6 Counts)',
      color: '#f43f5e',
      description: 'حروف مدہ کے بعد ہمزہ یا سکون آنے پر آواز کو 4 سے 6 حرکات تک لمبا کیا جاتا ہے۔'
    },
    ikhfa: {
      id: 'ikhfa',
      name_ur: 'اخفاء (Ikhfa)',
      name_en: 'Light Concealment',
      color: '#2dd4bf',
      description: 'نون ساکن یا تنوین کے بعد 15 حروف اخفاء میں سے کوئی حرف آئے تو آواز کو ناک میں چھپا کر پڑھتے ہیں۔'
    },
    idgham: {
      id: 'idgham',
      name_ur: 'ادغام (Idgham)',
      name_en: 'Assimilation / Merging',
      color: '#c084fc',
      description: 'نون ساکن یا تنوین کے بعد حروف یرملون (ی، ر، م، ل، و، ن) آئیں تو ادغام کیا جاتا ہے۔'
    },
    iqlab: {
      id: 'iqlab',
      name_ur: 'اقلاب (Iqlab)',
      name_en: 'Conversion to Meem',
      color: '#f59e0b',
      description: 'نون ساکن یا تنوین کے بعد باء (ب) آئے تو نون کو میم مخفف سے بدل کر غنہ کے ساتھ پڑھتے ہیں۔'
    }
  };

  const TajweedEngine = {
    isEnabled: false,
    activeHighlightRule: null,

    init() {
      try {
        const saved = localStorage.getItem('quran_tajweed_enabled');
        if (saved === 'true') this.isEnabled = true;
      } catch (e) {}

      this.updateContainerClass();
      console.log('[TajweedEngine] ✓ Version 2.0 Dynamic Phonological Tajweed Engine initialized.');
    },

    toggle() {
      this.isEnabled = !this.isEnabled;
      try { localStorage.setItem('quran_tajweed_enabled', String(this.isEnabled)); } catch(e) {}
      this.updateContainerClass();
      return this.isEnabled;
    },

    updateContainerClass() {
      if (typeof document === 'undefined') return;
      const ayahsContainer = document.getElementById('tab-ayahs');
      if (ayahsContainer) {
        if (this.isEnabled) ayahsContainer.classList.add('tajweed-active');
        else ayahsContainer.classList.remove('tajweed-active');
      }
      const toggleBtn = document.getElementById('tajweed-toggle-btn');
      if (toggleBtn) {
        if (this.isEnabled) toggleBtn.classList.add('active');
        else toggleBtn.classList.remove('active');
      }
    },

    parse(arabicText) {
      if (!arabicText || typeof arabicText !== 'string') return '';

      let text = arabicText;

      // 1. Madd (~ or Maddah Alif)
      text = text.replace(/(\u0622|[\u0621-\u064A]\u0653)/gu, '<span class="tj-madd" data-rule="madd" title="Madd (مد - 4-6 Counts)">$1</span>');

      // 2. Ghunnah (Noon/Meem with Shaddah: نّ or مّ)
      text = text.replace(/([نم][\u0651\u065F])/gu, '<span class="tj-ghunnah" data-rule="ghunnah" title="Ghunnah (غنہ - 2 Counts)">$1</span>');

      // 3. Qalqalah (ق، ط، ب، ج، د with Sukun)
      text = text.replace(/([قطبجد]\u0652)/gu, '<span class="tj-qalqalah" data-rule="qalqalah" title="Qalqalah (قلقلہ - Echoing Bounce)">$1</span>');

      // 4. Iqlab (Tanween or Noon Sakinah followed by small Meem ۭ / ۢ or followed by Ba)
      text = text.replace(/([\u064B\u064C\u064D]|ن\u0652?)(\s*)([\u06E2\u06ED]|\u0628)/gu, '<span class="tj-iqlab" data-rule="iqlab" title="Iqlab (اقلاب - Conversion to Meem)">$1</span>$2$3');

      // 5. Idgham (Noon Sakinah / Tanween before Yarmaloon: ي، ر، م، ل، و، ن)
      text = text.replace(/([\u064B\u064C\u064D]|ن\u0652?)(\s+)([يرملون])/gu, '<span class="tj-idgham" data-rule="idgham" title="Idgham (ادغام - Merging)">$1</span>$2$3');

      // 6. Ikhfa (Noon Sakinah / Tanween before 15 Ikhfa letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك)
      text = text.replace(/([\u064B\u064C\u064D]|ن\u0652?)(\s*)([تثجدذزسشصضطظفقك])/gu, '<span class="tj-ikhfa" data-rule="ikhfa" title="Ikhfa (اخفاء - Light Concealment)">$1</span>$2$3');

      return text;
    },

    renderLegend() {
      return `
        <div class="tajweed-legend-bar" id="tajweed-legend-bar">
          <div class="tajweed-legend-title">
            <span>🎨 تجوید کلید (Tajweed Rules):</span>
          </div>
          <div class="tajweed-legend-pills">
            <span class="tj-pill tj-ghunnah" data-rule="ghunnah" title="${TAJWEED_RULES.ghunnah.description}">● غنہ (Ghunnah)</span>
            <span class="tj-pill tj-qalqalah" data-rule="qalqalah" title="${TAJWEED_RULES.qalqalah.description}">● قلقلہ (Qalqalah)</span>
            <span class="tj-pill tj-madd" data-rule="madd" title="${TAJWEED_RULES.madd.description}">● مد (Madd)</span>
            <span class="tj-pill tj-ikhfa" data-rule="ikhfa" title="${TAJWEED_RULES.ikhfa.description}">● اخفاء (Ikhfa)</span>
            <span class="tj-pill tj-idgham" data-rule="idgham" title="${TAJWEED_RULES.idgham.description}">● ادغام (Idgham)</span>
            <span class="tj-pill tj-iqlab" data-rule="iqlab" title="${TAJWEED_RULES.iqlab.description}">● اقلاب (Iqlab)</span>
          </div>
        </div>
      `;
    }
  };

  global.TajweedEngine = TajweedEngine;
  global.TAJWEED_RULES = TAJWEED_RULES;

})(typeof window !== 'undefined' ? window : this);
