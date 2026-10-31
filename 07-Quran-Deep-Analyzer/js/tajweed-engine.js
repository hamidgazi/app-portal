/**
 * js/tajweed-engine.js
 * Quran Deep Analyzer Version 2.0 — Dynamic Phonological Tajweed Rule Calligraphy
 * Canonical Tajweed Standard (Dar Al-Ma'rifah & Quran.com Compliant)
 * Automatically parses Arabic scripture and annotates Tajweed rules:
 * - Ghunnah (غنہ - Emerald Green #10b981, 2 Counts)
 * - Qalqalah (قلقلہ - Sky Blue #38bdf8, Echoing Bounce)
 * - Madd Lazim (مد لازم - Deep Crimson #be123c, 6 Counts / 3 Alifs)
 * - Madd Muttasil (مد واجب متصل - Scarlet Rose #f43f5e, 4-5 Counts)
 * - Madd Munfasil (مد جائز منفصل - Coral Rose #fb7185, 4-5 Counts)
 * - General Madd (مد - Prolongation #f43f5e, 4-6 Counts)
 * - Ikhfa (اخفاء - Teal #14b8a6, Light Concealment 2 Counts)
 * - Idgham Bi-Ghunnah (ادغام مع الغنہ - Spring Green #22c55e, 2 Counts)
 * - Idgham Bila-Ghunnah (ادغام بلا غنہ - Tangerine Orange #f97316)
 * - General Idgham (ادغام - Amethyst Purple #c084fc)
 * - Iqlab (اقلاب - Amber Gold #f59e0b, Meem Conversion 2 Counts)
 * - Tafkheem (تفخیم - Royal Blue #3b82f6, Heavy Isti'la Letters)
 * - Silent Letters & Hamzatul Wasl (حرف صامت / همزة الوصل - Slate Gray #94a3b8)
 */

(function (global) {
  'use strict';

  const TAJWEED_RULES = {
    ghunnah: {
      id: 'ghunnah',
      name_ur: 'غنہ مشددہ (Ghunnah - 2 Harakat / 1 Alif)',
      name_en: 'Compulsory Nasal Resonance (2 Harakat / 1 Alif)',
      timing: '2 Harakat (1 Alif / 2 Counts)',
      color: '#10b981',
      bg_color: 'rgba(16, 185, 129, 0.20)',
      description: 'نون مشدد (نّ) یا میم مشدد (مّ) پر دو حرکات (1 الف) کی مقدار ناک (خیشوم) سے آواز نکال کر غنہ کرنا واجب ہے۔'
    },
    qalqalah: {
      id: 'qalqalah',
      name_ur: 'قلقلہ (Qalqalah - قطب جد)',
      name_en: 'Echoing Vocalic Bounce',
      timing: 'Kinetic Bounce (Echo / جھٹکا اور گونج)',
      color: '#38bdf8',
      bg_color: 'rgba(56, 189, 248, 0.20)',
      description: 'حروف قطب جد (ق، ط، ب، ج، د) جب ساکن ہوں تو ان میں مخرج سے ٹکرا کر گونج دار جھٹکا پیدا کیا جاتا ہے۔ (صغریٰ درمیان میں، کبریٰ وقف پر)'
    },
    madd_lazim: {
      id: 'madd_lazim',
      name_ur: 'مد لازم (Madd Lazim - 6 Harakat / 3 Alifs)',
      name_en: 'Compulsory Prolongation (6 Harakat / 3 Alifs)',
      timing: '6 Harakat (3 Alifs / لازم کھینچنا)',
      color: '#ef4444',
      bg_color: 'rgba(239, 68, 68, 0.20)',
      description: 'حرفِ مد کے بعد سکونِ اصلی یا تشدید آئے تو آواز کو لازماً 6 حرکات (3 الف) لمبا کیا جاتا ہے۔ (مثلاً: دَآبَّةٌ، الحَآقَّة)'
    },
    madd_muttasil: {
      id: 'madd_muttasil',
      name_ur: 'مد واجب متصل (Madd Muttasil - 4-5 Harakat)',
      name_en: 'Obligatory Connected Madd (4-5 Harakat / 2-2.5 Alifs)',
      timing: '4-5 Harakat (2-2.5 Alifs / متصل)',
      color: '#f87171',
      bg_color: 'rgba(248, 113, 113, 0.18)',
      description: 'ایک ہی کلمہ میں حرفِ مد کے فوراً بعد ہمزہ آئے تو 4 سے 5 حرکات (2 سے 2.5 الف) لمبا کرنا واجب ہے۔ (مثلاً: جَآءَ، سُوٓءَ)'
    },
    madd_munfasil: {
      id: 'madd_munfasil',
      name_ur: 'مد جائز منفصل (Madd Munfasil - 4-5 Harakat)',
      name_en: 'Permissible Detached Madd (4-5 Harakat / 2-2.5 Alifs)',
      timing: '4-5 Harakat (2-2.5 Alifs / منفصل)',
      color: '#fb923c',
      bg_color: 'rgba(251, 146, 60, 0.18)',
      description: 'کلمہ کے آخر میں حرفِ مد اور اگلے کلمہ کے شروع میں ہمزہ آئے تو 4 سے 5 حرکات تک کھینچتے ہیں۔ (مثلاً: إِنَّآ أَنزَلْنَاهُ)'
    },
    madd_aaridh: {
      id: 'madd_aaridh',
      name_ur: 'مد عارض للسکون (Madd Aaridh - 2, 4, 6 Harakat)',
      name_en: 'Secondary Stopping Madd (2, 4, 6 Harakat / 1-3 Alifs)',
      timing: '2, 4, or 6 Harakat (1-3 Alifs / وقف کا مد)',
      color: '#facc15',
      bg_color: 'rgba(250, 204, 21, 0.18)',
      description: 'حرفِ مد کے بعد وقف کی وجہ سے سکون عارض ہو تو 2، 4 یا 6 حرکات (قصر، توسط، طول) تک لمبا کرنا جائز ہے۔ (مثلاً: الرَّحِيمْ، تَعْلَمُونَ)'
    },
    madd: {
      id: 'madd',
      name_ur: 'مد (Madd - 4-6 Harakat)',
      name_en: 'Prolongation (4-6 Harakat / 2-3 Alifs)',
      timing: '4-6 Harakat (2-3 Alifs)',
      color: '#f87171',
      bg_color: 'rgba(248, 113, 113, 0.18)',
      description: 'حروف مدہ کے بعد ہمزہ یا سکون آنے پر آواز کو 4 سے 6 حرکات (2 سے 3 الف) تک لمبا کیا جاتا ہے۔'
    },
    ikhfa: {
      id: 'ikhfa',
      name_ur: 'اخفاء حقیقی و شفوی (Ikhfa - 2 Harakat / 1 Alif)',
      name_en: 'Nasal Concealment (2 Harakat / 1 Alif)',
      timing: '2 Harakat (1 Alif / اخفاء)',
      color: '#2dd4bf',
      bg_color: 'rgba(45, 212, 191, 0.18)',
      description: 'نون ساکن یا تنوین کے بعد 15 حروف اخفاء یا میم ساکن کے بعد باء آئے تو آواز کو ناک میں چھپا کر پڑھتے ہیں۔'
    },
    idgham_ghunnah: {
      id: 'idgham_ghunnah',
      name_ur: 'ادغام مع الغنہ (Idgham Bi-Ghunnah - 2 Harakat)',
      name_en: 'Assimilation with Ghunnah (2 Harakat / 1 Alif)',
      timing: '2 Harakat (1 Alif / غنہ کے ساتھ ملاؤ)',
      color: '#06b6d4',
      bg_color: 'rgba(6, 182, 212, 0.18)',
      description: 'نون ساکن یا تنوین کے بعد حروف ینمو (ی، ن، م، و) آئیں تو آواز کو ملا کر 2 حرکات غنہ کے ساتھ ادا کرتے ہیں۔'
    },
    idgham_no_ghunnah: {
      id: 'idgham_no_ghunnah',
      name_ur: 'ادغام بلا غنہ (Idgham Bila-Ghunnah)',
      name_en: 'Assimilation without Ghunnah (0 Counts)',
      timing: '0 Counts (بغیر غنہ کے مکمل ملاؤ)',
      color: '#94a3b8',
      bg_color: 'rgba(148, 163, 184, 0.14)',
      description: 'نون ساکن یا تنوین کے بعد لام (ل) یا راء (ر) آئے تو مکمل ادغام بغیر غنہ کے کیا جاتا ہے۔ (مثلاً: مِن رَّبِّهِمْ)'
    },
    idgham: {
      id: 'idgham',
      name_ur: 'ادغام (Idgham - یرملون)',
      name_en: 'Phonetic Assimilation / Merging',
      timing: 'Merging (ادغام)',
      color: '#a855f7',
      bg_color: 'rgba(168, 85, 247, 0.18)',
      description: 'نون ساکن یا تنوین کے بعد حروف یرملون (ی، ر، م، ل، و، ن) آئیں تو ادغام کیا جاتا ہے۔'
    },
    iqlab: {
      id: 'iqlab',
      name_ur: 'اقلاب (Iqlab - ن → م)',
      name_en: 'Conversion to Meem (2 Harakat / 1 Alif)',
      timing: '2 Harakat (1 Alif / نون کو میم سے بدلنا)',
      color: '#c084fc',
      bg_color: 'rgba(192, 132, 252, 0.20)',
      description: 'نون ساکن یا تنوین کے بعد باء (ب) آئے تو نون کو خالص میم مخفف سے بدل کر غنہ کے ساتھ 2 حرکات پڑھتے ہیں۔ (مثلاً: مِنۢ بَعْدِ)'
    },
    tafkheem: {
      id: 'tafkheem',
      name_ur: 'تفخیم (Tafkheem - پر حروف)',
      name_en: 'Heavy / Full Mouth Resonance',
      timing: 'Heavy Resonance (پر / موٹی آواز)',
      color: '#60a5fa',
      bg_color: 'rgba(96, 165, 250, 0.18)',
      description: 'حروف مستعلیہ (خص ضغط قظ) اور پر پڑھی جانے والی راء کو منہ بھر کر موٹی آواز سے پڑھا جاتا ہے۔'
    },
    silent: {
      id: 'silent',
      name_ur: 'حرف صامت (Silent / Hamzatul Wasl)',
      name_en: 'Silent Letter / Dropped in Flow',
      timing: '0 Counts (ساقط / خاموش حروف)',
      color: '#94a3b8',
      bg_color: 'rgba(148, 163, 184, 0.12)',
      description: 'وہ حروف جو رسم الخط میں موجود ہوتے ہیں لیکن وصل کی حالت میں پڑھے نہیں جاتے جیسے ہمزۃ الوصل۔'
    }
  };

  // Dual-joining Arabic letters (can connect forward to the next letter)
  const DUAL_JOINING = new Set([
    'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ',
    'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ي', 'ى', 'ئ',
    'پ', 'چ', 'ژ', 'ک', 'گ', 'ں', 'ی', 'ے'
  ]);

  // Right-joining only letters (never connect forward)
  const RIGHT_JOINING_ONLY = new Set([
    'ا', 'آ', 'أ', 'إ', 'ٱ', 'د', 'ذ', 'ر', 'ز', 'و', 'ۄ', 'ة'
  ]);

  // Non-spacing Tashkeel / diacritical combining marks to skip when checking base consonants
  const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0653\u0654\u0655\u06DF\u06E0\u06E1\u200C\u200D]/;

  function canJoinForward(char) {
    if (!char) return false;
    return DUAL_JOINING.has(char);
  }

  function canJoinBackward(char) {
    if (!char) return false;
    if (char === 'ء' || char === '\u0621') return false;
    return DUAL_JOINING.has(char) || RIGHT_JOINING_ONLY.has(char);
  }

  function getFirstBaseChar(str) {
    if (!str) return null;
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (!TASHKEEL_REGEX.test(c)) return c;
    }
    return null;
  }

  function getLastBaseChar(str) {
    if (!str) return null;
    for (let i = str.length - 1; i >= 0; i--) {
      const c = str[i];
      if (!TASHKEEL_REGEX.test(c)) return c;
    }
    return null;
  }

  function getBaseCharBefore(str, offset, spans) {
    let i = offset - 1;
    while (i >= 0) {
      if (str[i] === '_') {
        const sub = str.slice(0, i + 1);
        const match = sub.match(/___TJTAG_(\d+)___$/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (spans && spans[id]) {
            const c = getLastBaseChar(spans[id].innerText);
            if (c) return c;
          }
          i -= match[0].length;
          continue;
        }
      }
      const c = str[i];
      if (!TASHKEEL_REGEX.test(c)) {
        return c;
      }
      i--;
    }
    return null;
  }

  function getBaseCharAfter(str, offset, spans) {
    let i = offset;
    while (i < str.length) {
      if (str.startsWith('___TJTAG_', i)) {
        const match = str.slice(i).match(/^___TJTAG_(\d+)___/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (spans && spans[id]) {
            const c = getFirstBaseChar(spans[id].innerText);
            if (c) return c;
          }
          i += match[0].length;
          continue;
        }
      }
      const c = str[i];
      if (!TASHKEEL_REGEX.test(c)) {
        return c;
      }
      i++;
    }
    return null;
  }

  const TajweedEngine = {
    isEnabled: false,
    activeHighlightRule: null,
    _delegationInitialized: false,

    init() {
      try {
        const saved = localStorage.getItem('quran_tajweed_enabled');
        if (saved === 'true') this.isEnabled = true;
      } catch (e) {}

      this.updateContainerClass();
      this.setupLegendDelegation();
      console.log('[TajweedEngine] ✓ Version 2.0 Dynamic Phonological Tajweed Engine initialized (Dar Al-Ma\'rifah & Quran.com Standard).');
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
        else {
          ayahsContainer.classList.remove('tajweed-active');
          this.clearFilter();
        }
      }
      const toggleBtn = document.getElementById('tajweed-toggle-btn');
      if (toggleBtn) {
        if (this.isEnabled) toggleBtn.classList.add('active');
        else toggleBtn.classList.remove('active');
      }
      const toggleChip = document.getElementById('chip-layer-tajweed');
      if (toggleChip) {
        toggleChip.classList.toggle('active', this.isEnabled);
      }
      const toggleInput = document.getElementById('toggle-layer-tajweed');
      if (toggleInput) {
        toggleInput.checked = this.isEnabled;
      }
    },

    setupLegendDelegation() {
      if (typeof document === 'undefined') return;
      if (this._delegationInitialized) return;
      this._delegationInitialized = true;

      document.addEventListener('click', (e) => {
        const pill = e.target.closest('.tj-pill');
        if (pill && pill.dataset && pill.dataset.rule) {
          e.preventDefault();
          this.highlightRule(pill.dataset.rule);
        }
      });
    },

    highlightRule(ruleId) {
      if (typeof document === 'undefined') return;
      const legendMount = document.getElementById('tajweed-legend-mount');
      const ayahsContainer = document.getElementById('tab-ayahs');
      if (!ayahsContainer) return;

      if (this.activeHighlightRule === ruleId) {
        // Toggle OFF filter
        this.clearFilter();
      } else {
        // Toggle ON filter
        this.activeHighlightRule = ruleId;
        ayahsContainer.classList.add('tj-filter-active');
        if (legendMount) {
          legendMount.querySelectorAll('.tj-pill').forEach(p => {
            if (p.getAttribute('data-rule') === ruleId) p.classList.add('active-filter');
            else p.classList.remove('active-filter');
          });
        }
        ayahsContainer.querySelectorAll('span[data-rule]').forEach(el => {
          const rule = el.getAttribute('data-rule');
          const isMatch = (rule === ruleId) ||
            (ruleId === 'madd' && rule.startsWith('madd')) ||
            (ruleId === 'idgham' && rule.startsWith('idgham'));
          if (isMatch) {
            el.classList.add('tj-focused');
            el.classList.remove('tj-dimmed');
          } else {
            el.classList.remove('tj-focused');
            el.classList.add('tj-dimmed');
          }
        });
      }
    },

    clearFilter() {
      this.activeHighlightRule = null;
      if (typeof document === 'undefined') return;
      const legendMount = document.getElementById('tajweed-legend-mount');
      const ayahsContainer = document.getElementById('tab-ayahs');
      if (ayahsContainer) {
        ayahsContainer.classList.remove('tj-filter-active');
        ayahsContainer.querySelectorAll('span[data-rule]').forEach(el => {
          el.classList.remove('tj-focused', 'tj-dimmed');
        });
      }
      if (legendMount) {
        legendMount.querySelectorAll('.tj-pill').forEach(p => p.classList.remove('active-filter'));
      }
    },

    parse(arabicText) {
      if (!arabicText || typeof arabicText !== 'string') return '';

      let text = arabicText;
      const spans = [];
      const makeTag = (classes, rule, title, innerText) => {
        const id = spans.length;
        spans.push({ classes, rule, title, innerText });
        return `___TJTAG_${id}___`;
      };

      // 1. Madd Lazim (مد لازم - 6 counts): Maddah followed by Shaddah
      text = text.replace(/(\u0622|[\u0621-\u064A\u06CC\u0671]\u0653)([\u0621-\u064A\u06CC][\u0651\u065F])/gu,
        (m, p1, p2) => makeTag('tj-madd', 'madd_lazim', 'Madd Lazim (مد لازم - 6 Counts / 3 Alifs)', p1) + p2);

      // 2. Madd Muttasil (مد واجب متصل - 4-5 counts): Maddah followed by Hamzah in same word
      text = text.replace(/(\u0622|[\u0621-\u064A\u06CC\u0671]\u0653)([\u0621\u0623\u0625\u0626\u0624])/gu,
        (m, p1, p2) => makeTag('tj-madd', 'madd_muttasil', 'Madd Wajib Muttasil (مد واجب متصل - 4-5 Counts)', p1) + p2);

      // 3. Madd Munfasil (مد جائز منفصل - 4-5 counts): Maddah followed by Hamzah across space
      text = text.replace(/(\u0622|[\u0621-\u064A\u06CC\u0671]\u0653)(\s+[\u0621\u0623\u0625\u0671\u0622])/gu,
        (m, p1, p2) => makeTag('tj-madd', 'madd_munfasil', "Madd Ja'iz Munfasil (مد جائز منفصل - 4-5 Counts)", p1) + p2);

      // 4. General Madd (مد - 4-6 counts): Any remaining Maddah
      text = text.replace(/(\u0622|[\u0621-\u064A\u06CC\u0671]\u0653)/gu,
        (m, p1) => makeTag('tj-madd', 'madd', 'Madd (مد - Prolongation 4-6 Counts)', p1));

      // 5. Madd Aaridh lil-Sukun (مد عارض للسکون - 2, 4, 6 counts): Vowel letter before final consonant at stop/waqf/verse-end
      text = text.replace(/([\u064E\u064F\u0650]?[\u0648\u064A\u06CC\u0627\u0670])([\u0621-\u064A\u06CC][\u064B-\u0652\u0670]?\s*(?:[۝\u06DD]|[ۖ-ۛ]|[.,;!?\u061F]|\s*$))/gu,
        (m, p1, p2) => makeTag('tj-madd', 'madd_aaridh', 'Madd Aaridh lil-Sukun (مد عارض للسکون - 2, 4, 6 Counts at Stop)', p1) + p2);

      // 6. Iqlab (اقلاب - Conversion to Meem 2 counts): Tanween or Noon Sakinah followed by small Meem or Baa
      text = text.replace(/((?:[\u064B\u064C\u064D][\u0627\u0671\u0649\u0670]?|ن[\u0652\u06E1]?))(\s*(?:[\u06E2\u06ED]|\u0628))/gu,
        (m, p1, p2) => makeTag('tj-iqlab', 'iqlab', 'Iqlab (اقلاب - Conversion to Meem 2 Counts)', p1) + p2);

      // 7. Idgham Bi-Ghunnah (ادغام مع الغنہ - 2 counts): Tanween or Noon Sakinah before [ينمو], or Meem Sakinah before Meem with Shaddah
      text = text.replace(/((?:[\u064B\u064C\u064D][\u0627\u0671\u0649\u0670]?|ن[\u0652\u06E1]?))(\s+)([\u064A\u06CC\u0646\u0645\u0648][\u0651\u065F\u064E\u064F\u0650]?)/gu,
        (m, p1, p2, p3) => makeTag('tj-idgham', 'idgham_ghunnah', 'Idgham Bi-Ghunnah (ادغام مع الغنہ - Assimilation with Ghunnah 2 Counts)', p1) + p2 + p3);
      text = text.replace(/((?:م[\u0652\u06E1]|م))(\s+)(م[\u0651\u065F][\u064E\u064F\u0650]?)/gu,
        (m, p1, p2, p3) => makeTag('tj-idgham', 'idgham_ghunnah', 'Idgham Shafawi / Mithlayn (ادغام شفوی - 2 Counts)', p1) + p2 + p3);

      // 8. Idgham Bila-Ghunnah (ادغام بلا غنہ): Tanween or Noon Sakinah before [لر]
      text = text.replace(/((?:[\u064B\u064C\u064D][\u0627\u0671\u0649\u0670]?|ن[\u0652\u06E1]?))(\s+)([\u0644\u0631][\u0651\u065F\u064E\u064F\u0650]?)/gu,
        (m, p1, p2, p3) => makeTag('tj-idgham', 'idgham_no_ghunnah', 'Idgham Bila-Ghunnah (ادغام بلا غنہ - Complete Assimilation)', p1) + p2 + p3);

      // 9. Ikhfa (اخفاء - 2 counts): Tanween or Noon Sakinah before 15 Ikhfa letters
      text = text.replace(/((?:[\u064B\u064C\u064D][\u0627\u0671\u0649\u0670]?|ن[\u0652\u06E1]?))(\s*)([تثجدذزسشصضطظفقك])/gu,
        (m, p1, p2, p3) => makeTag('tj-ikhfa', 'ikhfa', 'Ikhfa (اخفاء - Light Concealment 2 Counts)', p1) + p2 + p3);
      // Ikhfa Shafawi (اخفاء شفوی): Meem Sakinah before Baa
      text = text.replace(/((?:م[\u0652\u06E1]|م))(\s+)(ب[\u064E\u064F\u0650]?)/gu,
        (m, p1, p2, p3) => makeTag('tj-ikhfa', 'ikhfa', 'Ikhfa Shafawi (اخفاء شفوی - 2 Counts)', p1) + p2 + p3);

      // 10. Ghunnah (غنہ - 2 counts): Noon or Meem with Shaddah (نّ or مّ)
      text = text.replace(/([نم][\u0651\u065F][\u064E\u064F\u0650\u0670]?)/gu,
        (m, p1) => makeTag('tj-ghunnah', 'ghunnah', 'Ghunnah (غنہ - Nasalization 2 Counts)', p1));


      // 11. Qalqalah (قلقلہ - Echoing Bounce): قطب جد with Sukun OR at verse end/waqf
      text = text.replace(/([قطبجد][\u0652\u06E1\u06DF])/gu,
        (m, p1) => makeTag('tj-qalqalah', 'qalqalah', 'Qalqalah (قلقلہ - Echoing Bounce)', p1));
      text = text.replace(/([قطبجد][\u0651\u065F]?[\u064B-\u0650\u0670]?)(\s*(?:[۝\u06DD]|[ۖ-ۛ]|[.,;!?\u061F]|\s*$))/gu,
        (m, p1, p2) => makeTag('tj-qalqalah', 'qalqalah', 'Qalqalah at Waqf (قلقلہ کبریٰ - Echo at Stop)', p1) + p2);


      // 12. Silent Letters & Hamzatul Wasl (حرف صامت / همزة الوصل)
      text = text.replace(/(\u0671|\u0627\u06DF)/gu,
        (m, p1) => makeTag('tj-silent', 'silent', 'Silent Letter / Hamzatul Wasl (حرف صامت / همزة الوصل)', p1));

      // 13. Tafkheem (تفخیم - Heavy Isti'la letters & Raa): [خصضغظ], [طق] (when not already qalqalah), and Raa with Fathah/Dammah
      text = text.replace(/([خصضغظ][\u064E\u064F\u0650\u0651\u0652\u06E1\u064B\u064C\u064D]?|[طق][\u064E\u064F\u0650\u0651\u064B\u064C\u064D]|ر[\u0651]?[\u064E\u064F\u064B\u064C\u0670])/gu,
        (m, p1) => makeTag('tj-tafkheem', 'tafkheem', "Tafkheem (تفخیم - Heavy Letter / Isti'la)", p1));

      // 14. Unpack all placeholders with intelligent context-aware Zero-Width Joiner (ZWJ) ligature healing
      text = text.replace(/___TJTAG_(\d+)___/g, (match, idStr, offset, fullStr) => {
        const id = parseInt(idStr, 10);
        const tag = spans[id];
        if (!tag) return match;

        const inner = tag.innerText;
        const firstBaseChar = getFirstBaseChar(inner);
        const lastBaseChar = getLastBaseChar(inner);

        const prevChar = getBaseCharBefore(fullStr, offset, spans);
        const nextChar = getBaseCharAfter(fullStr, offset + match.length, spans);

        const joinBefore = canJoinForward(prevChar) && canJoinBackward(firstBaseChar);
        const joinAfter = canJoinForward(lastBaseChar) && canJoinBackward(nextChar);

        const leadOutside = joinBefore ? '\u200D' : '';
        const leadInside = joinBefore ? '\u200D' : '';
        const trailInside = joinAfter ? '\u200D' : '';
        const trailOutside = joinAfter ? '\u200D' : '';

        return `${leadOutside}<span class="${tag.classes}" data-rule="${tag.rule}" title="${tag.title}">${leadInside}${inner}${trailInside}</span>${trailOutside}`;
      });

      return text;
    },

    renderLegend() {
      return `
        <div class="tajweed-legend-bar" id="tajweed-legend-bar" aria-label="Interactive Tajweed Rules Legend">
          <div class="tajweed-legend-title">
            <div class="tj-title-group">
              <span class="tj-title-main">🎨 احکامِ تجوید کلید (Tajweed Legend):</span>
              <span class="tajweed-legend-hint">Tap rule to filter • 2 Harakat = 1 Alif • 6 Harakat = 3 Alifs</span>
            </div>
            <button type="button" class="tajweed-rulebook-btn" onclick="openTajweedGuideModal()" title="Open Complete Tajweed Rule Book (مفصل قواعدِ تجوید کتاب)">
              📖 Rule Book (احکامِ تجوید)
            </button>
          </div>
          <div class="tajweed-legend-pills">
            <span class="tj-pill tj-madd-lazim" data-rule="madd_lazim" title="${TAJWEED_RULES.madd_lazim.description}">● مد لازم (Lazim • 6H / 3A)</span>
            <span class="tj-pill tj-madd-muttasil" data-rule="madd_muttasil" title="${TAJWEED_RULES.madd_muttasil.description}">● مد متصل (Muttasil • 4-5H)</span>
            <span class="tj-pill tj-madd-munfasil" data-rule="madd_munfasil" title="${TAJWEED_RULES.madd_munfasil.description}">● مد منفصل (Munfasil • 4-5H)</span>
            <span class="tj-pill tj-madd-aaridh" data-rule="madd_aaridh" title="${TAJWEED_RULES.madd_aaridh.description}">● مد عارض (Aaridh • 2,4,6H)</span>
            <span class="tj-pill tj-ghunnah" data-rule="ghunnah" title="${TAJWEED_RULES.ghunnah.description}">● غنہ مشددہ (Ghunnah • 2H / 1A)</span>
            <span class="tj-pill tj-ikhfa" data-rule="ikhfa" title="${TAJWEED_RULES.ikhfa.description}">● اخفاء (Ikhfa • 2H / 1A)</span>
            <span class="tj-pill tj-idgham-ghunnah" data-rule="idgham_ghunnah" title="${TAJWEED_RULES.idgham_ghunnah.description}">● ادغام مع الغنہ (2H / 1A)</span>
            <span class="tj-pill tj-idgham-no-ghunnah" data-rule="idgham_no_ghunnah" title="${TAJWEED_RULES.idgham_no_ghunnah.description}">● ادغام بلا غنہ (Merge)</span>
            <span class="tj-pill tj-iqlab" data-rule="iqlab" title="${TAJWEED_RULES.iqlab.description}">● اقلاب (Iqlab • Meem)</span>
            <span class="tj-pill tj-qalqalah" data-rule="qalqalah" title="${TAJWEED_RULES.qalqalah.description}">● قلقلہ (Qalqalah • Echo)</span>
            <span class="tj-pill tj-tafkheem" data-rule="tafkheem" title="${TAJWEED_RULES.tafkheem.description}">● تفخیم (Tafkheem • Pur)</span>
            <span class="tj-pill tj-silent" data-rule="silent" title="${TAJWEED_RULES.silent.description}">● حرف صامت (Silent)</span>
          </div>
        </div>
      `;
    }
  };

  global.TajweedEngine = TajweedEngine;
  global.TAJWEED_RULES = TAJWEED_RULES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TajweedEngine;
  }

})(typeof window !== 'undefined' ? window : this);
