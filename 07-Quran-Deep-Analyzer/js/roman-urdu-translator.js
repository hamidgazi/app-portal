/**
 * ============================================================================
 * Quran Deep Analyzer - Roman Urdu AI Translator & Cross-Lingual Search Studio
 * (js/roman-urdu-translator.js)
 * ============================================================================
 * High-performance, client-side first linguistic engine engineered under
 * Antigravity Workspace Directives.
 *
 * Architectural Features:
 *  1. Automatic Language Detection (Roman Urdu, English, Urdu Nastaleeq, Arabic)
 *  2. 2,500+ Curated Islamic & Conversational Lexicon with homophone disambiguation
 *     (sabr -> صبر, sawab -> ثواب, zalim -> ظالم, tauba -> توبہ, jannat -> جنت,
 *      jahannam -> جہنم, walidain -> والدین, rehmat -> رحمت, namaz -> نماز, roza -> روزہ)
 *  3. Contextual Phonetic Digraph Fallback for unlisted words (kh, gh, sh, ch, th, ph, dh, jh)
 *  4. Live Transliteration Pill Bar UI with 1-tap chip filtering & instant search
 *  5. Cross-Lingual BM25 Search Expansion across Kanzul Iman Urdu, Saheeh English, and Arabic
 * ============================================================================
 */

(function (global) {
  'use strict';

  if (typeof window === 'undefined') {
    global.window = global;
  }

  // --- 1. CURATED LEXICON (2660 Curated Entries) ---
  const LEXICON = {
  "sabr": {
    "ro": "sabr",
    "ur": "صبر",
    "en": "Patience / Perseverance",
    "ar": "صبر",
    "alt": [
      "saber",
      "sabar",
      "sabir",
      "sabireen"
    ],
    "cat": "islamic"
  },
  "sawab": {
    "ro": "sawab",
    "ur": "ثواب",
    "en": "Spiritual Merit / Divine Reward",
    "ar": "ثواب",
    "alt": [
      "swab",
      "sawaab",
      "sawaban"
    ],
    "cat": "islamic"
  },
  "zalim": {
    "ro": "zalim",
    "ur": "ظالم",
    "en": "Oppressor / Wrongdoer",
    "ar": "ظالم",
    "alt": [
      "zaalim",
      "zalimeen",
      "zalimoon"
    ],
    "cat": "islamic"
  },
  "zulm": {
    "ro": "zulm",
    "ur": "ظلم",
    "en": "Injustice / Oppression / Darkness",
    "ar": "ظلم",
    "alt": [
      "zulum",
      "zulmat",
      "zulumat"
    ],
    "cat": "islamic"
  },
  "tauba": {
    "ro": "tauba",
    "ur": "توبہ",
    "en": "Repentance / Turning to Allah",
    "ar": "توبة",
    "alt": [
      "tawbah",
      "tobah",
      "taubat"
    ],
    "cat": "islamic"
  },
  "jannat": {
    "ro": "jannat",
    "ur": "جنت",
    "en": "Concealment / Paradise / Garden",
    "ar": "جنة",
    "alt": [
      "jannah",
      "jannate",
      "jannatain",
      "firdous"
    ],
    "cat": "islamic"
  },
  "jahannam": {
    "ro": "jahannam",
    "ur": "جہنم",
    "en": "Hellfire / Gehenna",
    "ar": "جهنم",
    "alt": [
      "dozakh",
      "nar",
      "jahannama"
    ],
    "cat": "islamic"
  },
  "walidain": {
    "ro": "walidain",
    "ur": "والدین",
    "en": "Parents / Mother and Father",
    "ar": "والدين",
    "alt": [
      "walidayn",
      "maa baap",
      "walid",
      "walida"
    ],
    "cat": "islamic"
  },
  "rehmat": {
    "ro": "rehmat",
    "ur": "رحمت",
    "en": "Divine Mercy / Grace",
    "ar": "رحمة",
    "alt": [
      "rahmat",
      "reham",
      "rahamat",
      "rahmah"
    ],
    "cat": "islamic"
  },
  "namaz": {
    "ro": "namaz",
    "ur": "نماز",
    "en": "Prayer / Blessings / Supplication",
    "ar": "صلاة",
    "alt": [
      "salah",
      "salat",
      "salaat",
      "namazein",
      "namazi"
    ],
    "cat": "islamic"
  },
  "roza": {
    "ro": "roza",
    "ur": "روزہ",
    "en": "Fasting / Abstinence",
    "ar": "صوم",
    "alt": [
      "sawm",
      "roze",
      "rozedar",
      "rozey",
      "siyam"
    ],
    "cat": "islamic"
  },
  "zakat": {
    "ro": "zakat",
    "ur": "زکوۃ",
    "en": "Obligatory Charity / Alms",
    "ar": "زكاة",
    "alt": [
      "zakaat",
      "zakah"
    ],
    "cat": "islamic"
  },
  "hajj": {
    "ro": "hajj",
    "ur": "حج",
    "en": "Pilgrimage to Makkah",
    "ar": "حج",
    "alt": [
      "haj",
      "haji",
      "hujjaj"
    ],
    "cat": "islamic"
  },
  "umrah": {
    "ro": "umrah",
    "ur": "عمرہ",
    "en": "Lesser Pilgrimage",
    "ar": "عمرة",
    "alt": [
      "umra"
    ],
    "cat": "islamic"
  },
  "shaitan": {
    "ro": "shaitan",
    "ur": "شیطان",
    "en": "Satan / The Devil",
    "ar": "شيطان",
    "alt": [
      "shaytan",
      "iblis",
      "shateen"
    ],
    "cat": "islamic"
  },
  "farishta": {
    "ro": "farishta",
    "ur": "فرشتہ",
    "en": "Angel / Heavenly Messenger",
    "ar": "ملاك",
    "alt": [
      "farishtay",
      "malaikah",
      "malaika",
      "malak"
    ],
    "cat": "islamic"
  },
  "iman": {
    "ro": "iman",
    "ur": "ایمان",
    "en": "Faith / Belief in One God",
    "ar": "إيمان",
    "alt": [
      "eeman",
      "imandar",
      "imani"
    ],
    "cat": "islamic"
  },
  "islam": {
    "ro": "islam",
    "ur": "اسلام",
    "en": "Islam / Submission to Divine Will",
    "ar": "إسلام",
    "alt": [
      "islami",
      "musalman"
    ],
    "cat": "islamic"
  },
  "deen": {
    "ro": "deen",
    "ur": "دین",
    "en": "Religion / Complete Way of Life",
    "ar": "دين",
    "alt": [
      "deeni",
      "al-deen"
    ],
    "cat": "islamic"
  },
  "quran": {
    "ro": "quran",
    "ur": "قرآن",
    "en": "The Holy Quran / The Recitation",
    "ar": "قرآن",
    "alt": [
      "quraan",
      "qurani",
      "furqan"
    ],
    "cat": "islamic"
  },
  "hadith": {
    "ro": "hadith",
    "ur": "حدیث",
    "en": "Prophetic Tradition / Saying",
    "ar": "حديث",
    "alt": [
      "hadees",
      "ahadith",
      "sunnah"
    ],
    "cat": "islamic"
  },
  "sunnat": {
    "ro": "sunnat",
    "ur": "سنت",
    "en": "Prophetic Way / Practice",
    "ar": "سنة",
    "alt": [
      "sunnah",
      "sunan"
    ],
    "cat": "islamic"
  },
  "rasool": {
    "ro": "rasool",
    "ur": "رسول",
    "en": "Messenger of God",
    "ar": "رسول",
    "alt": [
      "rasul",
      "rusul",
      "risalat"
    ],
    "cat": "islamic"
  },
  "nabi": {
    "ro": "nabi",
    "ur": "نبی",
    "en": "Prophet of God",
    "ar": "نبي",
    "alt": [
      "anbiya",
      "nabuwat",
      "peghambar"
    ],
    "cat": "islamic"
  },
  "sahaba": {
    "ro": "sahaba",
    "ur": "صحابہ",
    "en": "Companions of Prophet Muhammad ﷺ",
    "ar": "صحابة",
    "alt": [
      "sahabi",
      "ashab"
    ],
    "cat": "islamic"
  },
  "allah": {
    "ro": "allah",
    "ur": "اللہ",
    "en": "Allah / The One True God",
    "ar": "الله",
    "alt": [
      "allah tala",
      "allahu"
    ],
    "cat": "islamic"
  },
  "khuda": {
    "ro": "khuda",
    "ur": "خدا",
    "en": "Lord / God",
    "ar": "الله",
    "alt": [
      "khudawand"
    ],
    "cat": "islamic"
  },
  "rab": {
    "ro": "rab",
    "ur": "رب",
    "en": "Lord / Cherisher / Sustainer",
    "ar": "رب",
    "alt": [
      "rabb",
      "parwardigar",
      "rabbi"
    ],
    "cat": "islamic"
  },
  "wudu": {
    "ro": "wudu",
    "ur": "وضو",
    "en": "Ritual Ablution",
    "ar": "وضوء",
    "alt": [
      "wazoo",
      "wudhu"
    ],
    "cat": "islamic"
  },
  "ghusl": {
    "ro": "ghusl",
    "ur": "غسل",
    "en": "Full Ritual Purification Bath",
    "ar": "غسل",
    "alt": [
      "ghusal"
    ],
    "cat": "islamic"
  },
  "azaan": {
    "ro": "azaan",
    "ur": "اذان",
    "en": "Ear / Permission / Announcement",
    "ar": "أذان",
    "alt": [
      "azan",
      "adhaan"
    ],
    "cat": "islamic"
  },
  "dua": {
    "ro": "dua",
    "ur": "دعا",
    "en": "Prayer / Blessings / Supplication",
    "ar": "دعاء",
    "alt": [
      "duayein",
      "munajat"
    ],
    "cat": "islamic"
  },
  "zikr": {
    "ro": "zikr",
    "ur": "ذکر",
    "en": "Remembrance of Allah",
    "ar": "ذكر",
    "alt": [
      "dhikr",
      "azkar"
    ],
    "cat": "islamic"
  },
  "tasbih": {
    "ro": "tasbih",
    "ur": "تسبیح",
    "en": "Glorification of Allah",
    "ar": "تسبيح",
    "alt": [
      "tasbeeh",
      "subhanallah"
    ],
    "cat": "islamic"
  },
  "istighfar": {
    "ro": "istighfar",
    "ur": "استغفار",
    "en": "Seeking Divine Forgiveness",
    "ar": "استغفار",
    "alt": [
      "astaghfirullah",
      "maghfirat"
    ],
    "cat": "islamic"
  },
  "maghfirat": {
    "ro": "maghfirat",
    "ur": "مغفرت",
    "en": "Forgiveness / Absolution",
    "ar": "مغفرة",
    "alt": [
      "maghfirah",
      "bakhshish"
    ],
    "cat": "islamic"
  },
  "gunah": {
    "ro": "gunah",
    "ur": "گناہ",
    "en": "Sin / Moral Transgression",
    "ar": "ذنب",
    "alt": [
      "gunaah",
      "sayyiat",
      "khata"
    ],
    "cat": "islamic"
  },
  "shirk": {
    "ro": "shirk",
    "ur": "شرک",
    "en": "Polytheism / Idolatry",
    "ar": "شرك",
    "alt": [
      "mushrik",
      "mushrikeen"
    ],
    "cat": "islamic"
  },
  "kufr": {
    "ro": "kufr",
    "ur": "کفر",
    "en": "Disbelief / Ingratitude",
    "ar": "كفر",
    "alt": [
      "kafir",
      "kaafir",
      "kuffar"
    ],
    "cat": "islamic"
  },
  "munafiq": {
    "ro": "munafiq",
    "ur": "منافق",
    "en": "Hypocrite in Religion",
    "ar": "منافق",
    "alt": [
      "munafiqeen",
      "nifaq"
    ],
    "cat": "islamic"
  },
  "momin": {
    "ro": "momin",
    "ur": "مومن",
    "en": "True Believer",
    "ar": "مؤمن",
    "alt": [
      "momineen",
      "mumin"
    ],
    "cat": "islamic"
  },
  "muttaqi": {
    "ro": "muttaqi",
    "ur": "متقی",
    "en": "Pious / God-Conscious Believer",
    "ar": "متقي",
    "alt": [
      "muttaqeen",
      "parhezgar"
    ],
    "cat": "islamic"
  },
  "taqwa": {
    "ro": "taqwa",
    "ur": "تقویٰ",
    "en": "Piety / God-Consciousness",
    "ar": "تقوى",
    "alt": [
      "parhezgari"
    ],
    "cat": "islamic"
  },
  "ikhlas": {
    "ro": "ikhlas",
    "ur": "اخلاص",
    "en": "Sincerity / Pure Devotion",
    "ar": "إخلاص",
    "alt": [
      "mukhlis",
      "mukhleseen"
    ],
    "cat": "islamic"
  },
  "adab": {
    "ro": "adab",
    "ur": "آداب",
    "en": "Manners / Respect / Etiquette",
    "ar": "آداب",
    "alt": [
      "aadaab",
      "adabi"
    ],
    "cat": "islamic"
  },
  "akhlaq": {
    "ro": "akhlaq",
    "ur": "اخلاق",
    "en": "Moral Character / Ethics",
    "ar": "أخلاق",
    "alt": [
      "khuluq",
      "husn-e-akhlaq"
    ],
    "cat": "islamic"
  },
  "sadaqah": {
    "ro": "sadaqah",
    "ur": "صدقہ",
    "en": "Voluntary Charity / Almsgiving",
    "ar": "صدقة",
    "alt": [
      "sadqa",
      "khairat"
    ],
    "cat": "islamic"
  },
  "infaq": {
    "ro": "infaq",
    "ur": "انفاق",
    "en": "Spending in the Cause of Allah",
    "ar": "إنفاق",
    "alt": [
      "kharch"
    ],
    "cat": "islamic"
  },
  "rizq": {
    "ro": "rizq",
    "ur": "رزق",
    "en": "Divine Provision / Sustenance",
    "ar": "رزق",
    "alt": [
      "rozi",
      "maash"
    ],
    "cat": "islamic"
  },
  "barakah": {
    "ro": "barakah",
    "ur": "برکت",
    "en": "Divine Blessing / Prosperity",
    "ar": "بركة",
    "alt": [
      "barkat",
      "mubarak"
    ],
    "cat": "islamic"
  },
  "nimat": {
    "ro": "nimat",
    "ur": "نعمت",
    "en": "Divine Favor / Blessing / Bounty",
    "ar": "نعمة",
    "alt": [
      "niamat",
      "anamta"
    ],
    "cat": "islamic"
  },
  "shukr": {
    "ro": "shukr",
    "ur": "شکر",
    "en": "Gratitude / Thankfulness",
    "ar": "شكر",
    "alt": [
      "shukrana",
      "shakir"
    ],
    "cat": "islamic"
  },
  "hamd": {
    "ro": "hamd",
    "ur": "حمد",
    "en": "Praise / Adoration of Allah",
    "ar": "حمد",
    "alt": [
      "alhamdulillah",
      "mahmood"
    ],
    "cat": "islamic"
  },
  "adl": {
    "ro": "adl",
    "ur": "عدل",
    "en": "Justice / Divine Balance / Equity",
    "ar": "عدل",
    "alt": [
      "insaaf",
      "qist"
    ],
    "cat": "islamic"
  },
  "haq": {
    "ro": "haq",
    "ur": "حق",
    "en": "Truth / Right / Sovereign Reality",
    "ar": "حق",
    "alt": [
      "haqq",
      "haqiqat"
    ],
    "cat": "islamic"
  },
  "batil": {
    "ro": "batil",
    "ur": "باطل",
    "en": "Falsehood / Vanity",
    "ar": "باطل",
    "alt": [
      "baatil",
      "jhoot"
    ],
    "cat": "islamic"
  },
  "sach": {
    "ro": "sach",
    "ur": "سچ",
    "en": "Truth / Right / Reality",
    "ar": "صدق",
    "alt": [
      "sacha",
      "sadiq",
      "sidq"
    ],
    "cat": "islamic"
  },
  "jhoot": {
    "ro": "jhoot",
    "ur": "جھوٹ",
    "en": "Lie / Deceit",
    "ar": "كذب",
    "alt": [
      "jhoota",
      "kizb",
      "kazib"
    ],
    "cat": "islamic"
  },
  "amanat": {
    "ro": "amanat",
    "ur": "امانت",
    "en": "Trust / Sacred Custody",
    "ar": "أمانة",
    "alt": [
      "amanatdari",
      "ameen"
    ],
    "cat": "islamic"
  },
  "khayanat": {
    "ro": "khayanat",
    "ur": "خیانت",
    "en": "Betrayal / Breach of Trust",
    "ar": "خيانة",
    "alt": [
      "khain",
      "ghaddari"
    ],
    "cat": "islamic"
  },
  "ahd": {
    "ro": "ahd",
    "ur": "عہد",
    "en": "Covenant / Pledge / Solemn Oath",
    "ar": "عهد",
    "alt": [
      "waada",
      "mithaq"
    ],
    "cat": "islamic"
  },
  "mout": {
    "ro": "mout",
    "ur": "موت",
    "en": "Death / Transition to Hereafter",
    "ar": "موت",
    "alt": [
      "maut",
      "intiqal",
      "wafat"
    ],
    "cat": "islamic"
  },
  "qabar": {
    "ro": "qabar",
    "ur": "قبر",
    "en": "Grave / Tomb",
    "ar": "قبر",
    "alt": [
      "qabr",
      "marqad"
    ],
    "cat": "islamic"
  },
  "barzakh": {
    "ro": "barzakh",
    "ur": "برزخ",
    "en": "Intermediate Realm after Death",
    "ar": "برزخ",
    "alt": [
      "parda"
    ],
    "cat": "islamic"
  },
  "hashr": {
    "ro": "hashr",
    "ur": "حشر",
    "en": "Day of Gathering / Assembly",
    "ar": "حشر",
    "alt": [
      "mahshar"
    ],
    "cat": "islamic"
  },
  "qayamat": {
    "ro": "qayamat",
    "ur": "قیامت",
    "en": "Day of Resurrection",
    "ar": "قيامة",
    "alt": [
      "qiyamah",
      "hasrat"
    ],
    "cat": "islamic"
  },
  "hisaab": {
    "ro": "hisaab",
    "ur": "حساب",
    "en": "Reckoning / Judgment",
    "ar": "حساب",
    "alt": [
      "hisab",
      "kitab"
    ],
    "cat": "islamic"
  },
  "mizaan": {
    "ro": "mizaan",
    "ur": "میزان",
    "en": "Divine Scales of Deeds",
    "ar": "ميزان",
    "alt": [
      "mizan",
      "tarazu"
    ],
    "cat": "islamic"
  },
  "sirat": {
    "ro": "sirat",
    "ur": "صراط",
    "en": "The Path / Bridge of Reckoning",
    "ar": "صراط",
    "alt": [
      "pul sirat",
      "mustaqeem"
    ],
    "cat": "islamic"
  },
  "shafaat": {
    "ro": "shafaat",
    "ur": "شفاعت",
    "en": "Intercession of the Holy Prophet ﷺ",
    "ar": "شفاعة",
    "alt": [
      "shafii",
      "bakhshwana"
    ],
    "cat": "islamic"
  },
  "kausar": {
    "ro": "kausar",
    "ur": "کوثر",
    "en": "Abundance / Celestial Pool",
    "ar": "كوثر",
    "alt": [
      "kousar",
      "hauz"
    ],
    "cat": "islamic"
  },
  "aakhirat": {
    "ro": "aakhirat",
    "ur": "آخرت",
    "en": "The Eternal Hereafter",
    "ar": "آخرة",
    "alt": [
      "akhirat",
      "baqa"
    ],
    "cat": "islamic"
  },
  "duniya": {
    "ro": "duniya",
    "ur": "دنیا",
    "en": "Temporal World / Earthly Realm",
    "ar": "دنيا",
    "alt": [
      "alam",
      "jahan"
    ],
    "cat": "islamic"
  },
  "rooh": {
    "ro": "rooh",
    "ur": "روح",
    "en": "Soul / Divine Spirit",
    "ar": "روح",
    "alt": [
      "jaan",
      "nafs"
    ],
    "cat": "islamic"
  },
  "jism": {
    "ro": "jism",
    "ur": "جسم",
    "en": "Physical Body",
    "ar": "جسم",
    "alt": [
      "badan",
      "wujood"
    ],
    "cat": "islamic"
  },
  "dil": {
    "ro": "dil",
    "ur": "دل",
    "en": "Heart / Turning / Conversion",
    "ar": "قلب",
    "alt": [
      "qalb",
      "man"
    ],
    "cat": "islamic"
  },
  "aql": {
    "ro": "aql",
    "ur": "عقل",
    "en": "Intellect / Wisdom / Reason",
    "ar": "عقل",
    "alt": [
      "danish",
      "shaoor"
    ],
    "cat": "islamic"
  },
  "ilm": {
    "ro": "ilm",
    "ur": "علم",
    "en": "Knowledge / Sacred Learning",
    "ar": "علم",
    "alt": [
      "taleem",
      "dars"
    ],
    "cat": "islamic"
  },
  "hikmat": {
    "ro": "hikmat",
    "ur": "حکمت",
    "en": "Wisdom / Judgment / Governance",
    "ar": "حكمة",
    "alt": [
      "danishmandi",
      "hikam"
    ],
    "cat": "islamic"
  },
  "insan": {
    "ro": "insan",
    "ur": "انسان",
    "en": "Human Being / Humanity",
    "ar": "إنسان",
    "alt": [
      "insaniyat",
      "bashar",
      "aadmi"
    ],
    "cat": "islamic"
  },
  "qawm": {
    "ro": "qawm",
    "ur": "قوم",
    "en": "To stand / People / Community",
    "ar": "قوم",
    "alt": [
      "ummat",
      "ummah"
    ],
    "cat": "islamic"
  },
  "dost": {
    "ro": "dost",
    "ur": "دوست",
    "en": "Friend / Companion",
    "ar": "صديق",
    "alt": [
      "dosti",
      "yaar",
      "sathi"
    ],
    "cat": "islamic"
  },
  "dushman": {
    "ro": "dushman",
    "ur": "دشمن",
    "en": "Enemy / Foe",
    "ar": "عدو",
    "alt": [
      "dushmani",
      "adu"
    ],
    "cat": "islamic"
  },
  "mohabbat": {
    "ro": "mohabbat",
    "ur": "محبت",
    "en": "Love / Devotion",
    "ar": "محبة",
    "alt": [
      "pyar",
      "ishq",
      "ulfat"
    ],
    "cat": "islamic"
  },
  "nafrat": {
    "ro": "nafrat",
    "ur": "نفرت",
    "en": "Hatred / Disdain",
    "ar": "بغض",
    "alt": [
      "bughz",
      "adawat"
    ],
    "cat": "islamic"
  },
  "hasad": {
    "ro": "hasad",
    "ur": "حسد",
    "en": "Malicious Envy / Jealousy",
    "ar": "حسد",
    "alt": [
      "keena",
      "jalan"
    ],
    "cat": "islamic"
  },
  "ghuroor": {
    "ro": "ghuroor",
    "ur": "غرور",
    "en": "Arrogance / Pride",
    "ar": "تكبر",
    "alt": [
      "takabbur",
      "ghamand"
    ],
    "cat": "islamic"
  },
  "aajizi": {
    "ro": "aajizi",
    "ur": "عاجزی",
    "en": "Humility / Meekness",
    "ar": "تواضع",
    "alt": [
      "inkisar",
      "tawazu"
    ],
    "cat": "islamic"
  },
  "haya": {
    "ro": "haya",
    "ur": "حیا",
    "en": "Modesty / Shyness / Decency",
    "ar": "حياء",
    "alt": [
      "sharam",
      "hijab"
    ],
    "cat": "islamic"
  },
  "parda": {
    "ro": "parda",
    "ur": "پردہ",
    "en": "Modest Veil / Screen",
    "ar": "حجاب",
    "alt": [
      "hijab",
      "satr"
    ],
    "cat": "islamic"
  },
  "halal": {
    "ro": "halal",
    "ur": "حلال",
    "en": "Lawful / Permissible",
    "ar": "حلال",
    "alt": [
      "halaal",
      "pak",
      "tayyab"
    ],
    "cat": "islamic"
  },
  "haram": {
    "ro": "haram",
    "ur": "حرام",
    "en": "Forbidden / Prohibited",
    "ar": "حرام",
    "alt": [
      "haraam",
      "napaak"
    ],
    "cat": "islamic"
  },
  "makrooh": {
    "ro": "makrooh",
    "ur": "مکروہ",
    "en": "Disapproved / Detestable",
    "ar": "مكروه",
    "alt": [
      "na-pasand"
    ],
    "cat": "islamic"
  },
  "mustahab": {
    "ro": "mustahab",
    "ur": "مستحب",
    "en": "Recommended / Commendable",
    "ar": "مستحب",
    "alt": [
      "pasandeeda"
    ],
    "cat": "islamic"
  },
  "farz": {
    "ro": "farz",
    "ur": "فرض",
    "en": "Divine Obligation / Duty",
    "ar": "فرض",
    "alt": [
      "fard",
      "farayez"
    ],
    "cat": "islamic"
  },
  "wajib": {
    "ro": "wajib",
    "ur": "واجب",
    "en": "Necessary / Binding Practice",
    "ar": "واجب",
    "alt": [
      "zaroori"
    ],
    "cat": "islamic"
  },
  "nafl": {
    "ro": "nafl",
    "ur": "نفل",
    "en": "Voluntary Good Deed",
    "ar": "نفل",
    "alt": [
      "nawafil",
      "mustahab"
    ],
    "cat": "islamic"
  },
  "fajr": {
    "ro": "fajr",
    "ur": "فجر",
    "en": "Dawn Prayer",
    "ar": "فجر",
    "alt": [
      "fajar",
      "subah ki namaz"
    ],
    "cat": "islamic"
  },
  "zuhr": {
    "ro": "zuhr",
    "ur": "ظہر",
    "en": "Noon Prayer",
    "ar": "ظهر",
    "alt": [
      "zohar",
      "dopahar ki namaz"
    ],
    "cat": "islamic"
  },
  "asr": {
    "ro": "asr",
    "ur": "عصر",
    "en": "Late Afternoon Prayer",
    "ar": "عصر",
    "alt": [
      "asar",
      "teesri namaz"
    ],
    "cat": "islamic"
  },
  "maghrib": {
    "ro": "maghrib",
    "ur": "مغرب",
    "en": "Sunset Prayer",
    "ar": "مغرب",
    "alt": [
      "maghreb",
      "shaam ki namaz"
    ],
    "cat": "islamic"
  },
  "isha": {
    "ro": "isha",
    "ur": "عشاء",
    "en": "Night Prayer",
    "ar": "عشاء",
    "alt": [
      "eshan",
      "raat ki namaz"
    ],
    "cat": "islamic"
  },
  "tahajjud": {
    "ro": "tahajjud",
    "ur": "تہجد",
    "en": "Night Vigil Prayer",
    "ar": "تهجد",
    "alt": [
      "qiyam-ul-layl"
    ],
    "cat": "islamic"
  },
  "juma": {
    "ro": "juma",
    "ur": "جمعہ",
    "en": "Friday Congregational Prayer",
    "ar": "جمعة",
    "alt": [
      "jummah",
      "juma mubarak"
    ],
    "cat": "islamic"
  },
  "tarawih": {
    "ro": "tarawih",
    "ur": "تراویح",
    "en": "Ramadan Night Prayers",
    "ar": "تراويح",
    "alt": [
      "taraveeh"
    ],
    "cat": "islamic"
  },
  "witr": {
    "ro": "witr",
    "ur": "وتر",
    "en": "Odd-Numbered Closing Prayer",
    "ar": "وتر",
    "alt": [
      "witar"
    ],
    "cat": "islamic"
  },
  "eid": {
    "ro": "eid",
    "ur": "عید",
    "en": "Islamic Festival / Celebration",
    "ar": "عيد",
    "alt": [
      "eed",
      "eidgah"
    ],
    "cat": "islamic"
  },
  "ramadan": {
    "ro": "ramadan",
    "ur": "رمضان",
    "en": "Holy Month of Fasting",
    "ar": "رمضان",
    "alt": [
      "ramzan",
      "ramadhan"
    ],
    "cat": "islamic"
  },
  "suhoor": {
    "ro": "suhoor",
    "ur": "سحری",
    "en": "Pre-Dawn Ramadan Meal",
    "ar": "سحور",
    "alt": [
      "sehri",
      "sahoor"
    ],
    "cat": "islamic"
  },
  "iftar": {
    "ro": "iftar",
    "ur": "افطار",
    "en": "Fast-Breaking Evening Meal",
    "ar": "إفطار",
    "alt": [
      "aftari",
      "roza kholna"
    ],
    "cat": "islamic"
  },
  "itikaf": {
    "ro": "itikaf",
    "ur": "اعتکاف",
    "en": "Spiritual Seclusion in Mosque",
    "ar": "اعتكاف",
    "alt": [
      "aitikaf"
    ],
    "cat": "islamic"
  },
  "qurbani": {
    "ro": "qurbani",
    "ur": "قربانی",
    "en": "Sacrifice of Livestock for Allah",
    "ar": "أضحية",
    "alt": [
      "udhiah",
      "zabeeha"
    ],
    "cat": "islamic"
  },
  "aqeeqah": {
    "ro": "aqeeqah",
    "ur": "عقیقہ",
    "en": "Sacrifice on Child's Birth",
    "ar": "عقيقة",
    "alt": [
      "aqiqa"
    ],
    "cat": "islamic"
  },
  "janaza": {
    "ro": "janaza",
    "ur": "جنازہ",
    "en": "Islamic Funeral Prayer",
    "ar": "جنازة",
    "alt": [
      "namaz-e-janaza"
    ],
    "cat": "islamic"
  },
  "kafan": {
    "ro": "kafan",
    "ur": "کفن",
    "en": "Burial Shroud",
    "ar": "كفن",
    "alt": [
      "tajheez"
    ],
    "cat": "islamic"
  },
  "dafan": {
    "ro": "dafan",
    "ur": "دفن",
    "en": "Burial in Grave",
    "ar": "دفن",
    "alt": [
      "tadfeen"
    ],
    "cat": "islamic"
  },
  "khatam": {
    "ro": "khatam",
    "ur": "ختم",
    "en": "Completion of Quran Recitation",
    "ar": "ختم",
    "alt": [
      "khatm"
    ],
    "cat": "islamic"
  },
  "durood": {
    "ro": "durood",
    "ur": "درود",
    "en": "Salutations upon Prophet Muhammad ﷺ",
    "ar": "صلاة على النبي",
    "alt": [
      "salawat",
      "darood"
    ],
    "cat": "islamic"
  },
  "takbeer": {
    "ro": "takbeer",
    "ur": "تکبیر",
    "en": "Proclaiming Allah's Greatness",
    "ar": "تكبير",
    "alt": [
      "allahu akbar"
    ],
    "cat": "islamic"
  },
  "ruku": {
    "ro": "ruku",
    "ur": "رکوع",
    "en": "Bowing in Prayer",
    "ar": "ركوع",
    "alt": [
      "rukoo"
    ],
    "cat": "islamic"
  },
  "sajdah": {
    "ro": "sajdah",
    "ur": "سجدہ",
    "en": "Prostration before Allah",
    "ar": "سجود",
    "alt": [
      "sujood",
      "sijdah"
    ],
    "cat": "islamic"
  },
  "tashahhud": {
    "ro": "tashahhud",
    "ur": "تشہد",
    "en": "Testimony in Prayer sitting",
    "ar": "تشهد",
    "alt": [
      "attahiyyat"
    ],
    "cat": "islamic"
  },
  "tilawat": {
    "ro": "tilawat",
    "ur": "تلاوت",
    "en": "Recitation of Quran",
    "ar": "تلاوة",
    "alt": [
      "qirat",
      "parhna"
    ],
    "cat": "islamic"
  },
  "tajweed": {
    "ro": "tajweed",
    "ur": "تجوید",
    "en": "Art of Correct Quranic Phonetics",
    "ar": "تجويد",
    "alt": [
      "tarteel"
    ],
    "cat": "islamic"
  },
  "hafiz": {
    "ro": "hafiz",
    "ur": "حافظ",
    "en": "Memorizer of the Holy Quran",
    "ar": "حافظ",
    "alt": [
      "huffaz"
    ],
    "cat": "islamic"
  },
  "qari": {
    "ro": "qari",
    "ur": "قاری",
    "en": "Master Reciter of the Holy Quran",
    "ar": "قارئ",
    "alt": [
      "qura"
    ],
    "cat": "islamic"
  },
  "alim": {
    "ro": "alim",
    "ur": "عالم",
    "en": "Islamic Scholar",
    "ar": "عالم",
    "alt": [
      "ulama",
      "scholar"
    ],
    "cat": "islamic"
  },
  "mufti": {
    "ro": "mufti",
    "ur": "مفتی",
    "en": "Jurisconsult / Legal Authority",
    "ar": "مفتي",
    "alt": [
      "fatwa dene wala"
    ],
    "cat": "islamic"
  },
  "masjid": {
    "ro": "masjid",
    "ur": "مسجد",
    "en": "Mosque / House of Worship",
    "ar": "مسجد",
    "alt": [
      "mosque",
      "masajid"
    ],
    "cat": "islamic"
  },
  "minbar": {
    "ro": "minbar",
    "ur": "منبر",
    "en": "Pulpit in Mosque",
    "ar": "منبر",
    "alt": [
      "mimbar"
    ],
    "cat": "islamic"
  },
  "mihrab": {
    "ro": "mihrab",
    "ur": "محراب",
    "en": "Prayer Niche pointing to Qibla",
    "ar": "محراب",
    "alt": [
      "mehrab"
    ],
    "cat": "islamic"
  },
  "qibla": {
    "ro": "qibla",
    "ur": "قبلہ",
    "en": "Direction of Kaaba in Makkah",
    "ar": "قبلة",
    "alt": [
      "qiblah",
      "kaba"
    ],
    "cat": "islamic"
  },
  "kaba": {
    "ro": "kaba",
    "ur": "کعبہ",
    "en": "The Sacred House of Allah in Makkah",
    "ar": "كعبة",
    "alt": [
      "kaaba",
      "baitullah"
    ],
    "cat": "islamic"
  },
  "makkah": {
    "ro": "makkah",
    "ur": "مکہ",
    "en": "The Holy City of Makkah",
    "ar": "مكة",
    "alt": [
      "mecca",
      "bakkah"
    ],
    "cat": "islamic"
  },
  "madinah": {
    "ro": "madinah",
    "ur": "مدینہ",
    "en": "The Radiant City of Madinah",
    "ar": "مدينة",
    "alt": [
      "medina",
      "tayyaba"
    ],
    "cat": "islamic"
  },
  "quds": {
    "ro": "quds",
    "ur": "قدس",
    "en": "Jerusalem / Al-Aqsa",
    "ar": "قدس",
    "alt": [
      "bait-ul-maqdis",
      "aqsa"
    ],
    "cat": "islamic"
  },
  "zamzam": {
    "ro": "zamzam",
    "ur": "زمزم",
    "en": "Blessed Water of Zamzam",
    "ar": "زمزم",
    "alt": [
      "ab-e-zamzam"
    ],
    "cat": "islamic"
  },
  "tawaf": {
    "ro": "tawaf",
    "ur": "طواف",
    "en": "Circumambulation around Kaaba",
    "ar": "طواف",
    "alt": [
      "chakar"
    ],
    "cat": "islamic"
  },
  "saee": {
    "ro": "saee",
    "ur": "سعی",
    "en": "Walking between Safa and Marwah",
    "ar": "سعي",
    "alt": [
      "safa marwa"
    ],
    "cat": "islamic"
  },
  "ihram": {
    "ro": "ihram",
    "ur": "احرام",
    "en": "Sacred Pilgrim Garment & State",
    "ar": "إحرام",
    "alt": [
      "ehram"
    ],
    "cat": "islamic"
  },
  "arafat": {
    "ro": "arafat",
    "ur": "عرفات",
    "en": "Sacred Place Arafat",
    "ar": "عرفات",
    "alt": [
      "wuqoof"
    ],
    "cat": "islamic"
  },
  "mina": {
    "ro": "mina",
    "ur": "منیٰ",
    "en": "Valley of Mina during Hajj",
    "ar": "منى",
    "alt": [
      "tent city"
    ],
    "cat": "islamic"
  },
  "muzdalifah": {
    "ro": "muzdalifah",
    "ur": "مزدلفہ",
    "en": "Muzdalifah Plain",
    "ar": "مزدلفة",
    "alt": [
      "mashar al-haram"
    ],
    "cat": "islamic"
  },
  "ramy": {
    "ro": "ramy",
    "ur": "رمی",
    "en": "Stoning of the Jamarat",
    "ar": "رمي",
    "alt": [
      "kankari marna"
    ],
    "cat": "islamic"
  },
  "quraysh": {
    "ro": "quraysh",
    "ur": "قریش",
    "en": "Tribe of Prophet Muhammad ﷺ",
    "ar": "قريش",
    "alt": [
      "quraish"
    ],
    "cat": "islamic"
  },
  "ansar": {
    "ro": "ansar",
    "ur": "انصار",
    "en": "The Helpers of Madinah",
    "ar": "أنصار",
    "alt": [
      "madani sahaba"
    ],
    "cat": "islamic"
  },
  "muhajireen": {
    "ro": "muhajireen",
    "ur": "مہاجرین",
    "en": "The Emigrants from Makkah",
    "ar": "مهاجرين",
    "alt": [
      "hijrat karne wale"
    ],
    "cat": "islamic"
  },
  "badar": {
    "ro": "badar",
    "ur": "بدر",
    "en": "Battle of Badr",
    "ar": "بدر",
    "alt": [
      "ghazwa-e-badr"
    ],
    "cat": "islamic"
  },
  "uhud": {
    "ro": "uhud",
    "ur": "احد",
    "en": "Mount Uhud / Battle of Uhud",
    "ar": "أحد",
    "alt": [
      "jabal uhud"
    ],
    "cat": "islamic"
  },
  "khandaq": {
    "ro": "khandaq",
    "ur": "خندق",
    "en": "Trench / Battle of the Trench",
    "ar": "خندق",
    "alt": [
      "ahzab"
    ],
    "cat": "islamic"
  },
  "tabuk": {
    "ro": "tabuk",
    "ur": "تبوک",
    "en": "Expedition of Tabuk",
    "ar": "تبوك",
    "alt": [
      "ghazwa tabuk"
    ],
    "cat": "islamic"
  },
  "hudaibiyah": {
    "ro": "hudaibiyah",
    "ur": "حدیبیہ",
    "en": "Treaty of Hudaibiyah",
    "ar": "حديبية",
    "alt": [
      "sulh"
    ],
    "cat": "islamic"
  },
  "fath-e-makkah": {
    "ro": "fath-e-makkah",
    "ur": "فتح مکہ",
    "en": "Conquest of Makkah",
    "ar": "فتح مكة",
    "alt": [
      "fatah"
    ],
    "cat": "islamic"
  },
  "hijrat": {
    "ro": "hijrat",
    "ur": "ہجرت",
    "en": "Migration for Sake of Allah",
    "ar": "هجرة",
    "alt": [
      "hijrah",
      "migration"
    ],
    "cat": "islamic"
  },
  "fatwa": {
    "ro": "fatwa",
    "ur": "فتویٰ",
    "en": "Islamic Legal Ruling / Decree",
    "ar": "فتوى",
    "alt": [
      "fatawa"
    ],
    "cat": "islamic"
  },
  "ijma": {
    "ro": "ijma",
    "ur": "اجماع",
    "en": "Consensus of Islamic Scholars",
    "ar": "إجماع",
    "alt": [
      "ittefaq"
    ],
    "cat": "islamic"
  },
  "qiyas": {
    "ro": "qiyas",
    "ur": "قیاس",
    "en": "Analogical Legal Deduction",
    "ar": "قياس",
    "alt": [
      "ijtihad"
    ],
    "cat": "islamic"
  },
  "ijtihad": {
    "ro": "ijtihad",
    "ur": "اجتہاد",
    "en": "Legal Exertion by a Mujtahid",
    "ar": "اجتهاد",
    "alt": [
      "mujaddid"
    ],
    "cat": "islamic"
  },
  "taqleed": {
    "ro": "taqleed",
    "ur": "تقلید",
    "en": "Following a Recognized Madhhab",
    "ar": "تقليد",
    "alt": [
      "muqallid"
    ],
    "cat": "islamic"
  },
  "madhhab": {
    "ro": "madhhab",
    "ur": "مذہب",
    "en": "School of Islamic Jurisprudence",
    "ar": "مذهب",
    "alt": [
      "hanafi",
      "shafi",
      "maliki",
      "hanbali"
    ],
    "cat": "islamic"
  },
  "aqeedah": {
    "ro": "aqeedah",
    "ur": "عقیدہ",
    "en": "Islamic Creed / Theology",
    "ar": "عقيدة",
    "alt": [
      "aqaid"
    ],
    "cat": "islamic"
  },
  "tawheed": {
    "ro": "tawheed",
    "ur": "توحید",
    "en": "Islamic Monotheism / Oneness of God",
    "ar": "توحيد",
    "alt": [
      "wahdaniyat",
      "yakta"
    ],
    "cat": "islamic"
  },
  "shariyah": {
    "ro": "shariyah",
    "ur": "شریعت",
    "en": "Islamic Sacred Law",
    "ar": "شريعة",
    "alt": [
      "shariat",
      "sharai"
    ],
    "cat": "islamic"
  },
  "tariqat": {
    "ro": "tariqat",
    "ur": "طریقت",
    "en": "Spiritual Path of Tasawwuf",
    "ar": "طريقة",
    "alt": [
      "sufism",
      "marifat"
    ],
    "cat": "islamic"
  },
  "marifat": {
    "ro": "marifat",
    "ur": "معرفت",
    "en": "Spiritual Knowing of Allah",
    "ar": "معرفة",
    "alt": [
      "irfan"
    ],
    "cat": "islamic"
  },
  "haqeeqat": {
    "ro": "haqeeqat",
    "ur": "حقیقت",
    "en": "Ultimate Divine Reality",
    "ar": "حقيقة",
    "alt": [
      "haqiqat"
    ],
    "cat": "islamic"
  },
  "tasawwuf": {
    "ro": "tasawwuf",
    "ur": "تصوف",
    "en": "Islamic Spirituality / Sufism",
    "ar": "تصوف",
    "alt": [
      "ihsan"
    ],
    "cat": "islamic"
  },
  "wali": {
    "ro": "wali",
    "ur": "ولی",
    "en": "Protecting friend / Guardian",
    "ar": "ولي",
    "alt": [
      "auliya",
      "buzurg"
    ],
    "cat": "islamic"
  },
  "karamat": {
    "ro": "karamat",
    "ur": "کرامت",
    "en": "Miracle of a Saint",
    "ar": "كرامة",
    "alt": [
      "karamatein"
    ],
    "cat": "islamic"
  },
  "mojiza": {
    "ro": "mojiza",
    "ur": "معجزہ",
    "en": "Prophetic Miracle",
    "ar": "معجزة",
    "alt": [
      "mojizat"
    ],
    "cat": "islamic"
  },
  "wahi": {
    "ro": "wahi",
    "ur": "وحی",
    "en": "Divine Revelation",
    "ar": "وحي",
    "alt": [
      "wahi-e-ilahi",
      "jibraeel"
    ],
    "cat": "islamic"
  },
  "lawh-e-mahfooz": {
    "ro": "lawh-e-mahfooz",
    "ur": "لوح محفوظ",
    "en": "The Preserved Celestial Tablet",
    "ar": "لوح محفوظ",
    "alt": [
      "kitab-e-mubeen"
    ],
    "cat": "islamic"
  },
  "arsh": {
    "ro": "arsh",
    "ur": "عرش",
    "en": "The Supreme Throne of Allah",
    "ar": "عرش",
    "alt": [
      "arsh-e-ilaahi"
    ],
    "cat": "islamic"
  },
  "kursi": {
    "ro": "kursi",
    "ur": "کرسی",
    "en": "The Divine Footstool",
    "ar": "كرسي",
    "alt": [
      "ayatul kursi"
    ],
    "cat": "islamic"
  },
  "sidrat-ul-muntaha": {
    "ro": "sidrat-ul-muntaha",
    "ur": "سدرۃ المنتہیٰ",
    "en": "The Lote Tree of the Furthest Boundary",
    "ar": "سدرة المنتهى",
    "alt": [
      "meraj"
    ],
    "cat": "islamic"
  },
  "meraj": {
    "ro": "meraj",
    "ur": "معراج",
    "en": "The Heavenly Ascension of the Prophet ﷺ",
    "ar": "معراج",
    "alt": [
      "isra",
      "shab-e-meraj"
    ],
    "cat": "islamic"
  },
  "isra": {
    "ro": "isra",
    "ur": "اسراء",
    "en": "The Night Journey from Makkah to Jerusalem",
    "ar": "إسراء",
    "alt": [
      "shab-e-isra"
    ],
    "cat": "islamic"
  },
  "bait-ul-mamoor": {
    "ro": "bait-ul-mamoor",
    "ur": "بیت المعمور",
    "en": "The Frequented House in Heaven",
    "ar": "بيت المعمور",
    "alt": [
      "angels"
    ],
    "cat": "islamic"
  },
  "bismillah": {
    "ro": "bismillah",
    "ur": "بسم اللہ",
    "en": "In the Name of Allah",
    "ar": "بسم الله",
    "alt": [
      "tasmiya"
    ],
    "cat": "islamic"
  },
  "alhamdulillah": {
    "ro": "alhamdulillah",
    "ur": "الحمد للہ",
    "en": "All Praise Belongs to Allah",
    "ar": "الحمد لله",
    "alt": [
      "tahmeed"
    ],
    "cat": "islamic"
  },
  "subhanallah": {
    "ro": "subhanallah",
    "ur": "سبحان اللہ",
    "en": "Glory be to Allah",
    "ar": "سبحان الله",
    "alt": [
      "tasbeeh"
    ],
    "cat": "islamic"
  },
  "allahuakbar": {
    "ro": "allahuakbar",
    "ur": "اللہ اکبر",
    "en": "Allah is the Greatest",
    "ar": "الله أكبر",
    "alt": [
      "takbeer"
    ],
    "cat": "islamic"
  },
  "astaghfirullah": {
    "ro": "astaghfirullah",
    "ur": "استغفر اللہ",
    "en": "I seek forgiveness from Allah",
    "ar": "أستغفر الله",
    "alt": [
      "tauba"
    ],
    "cat": "islamic"
  },
  "inshallah": {
    "ro": "inshallah",
    "ur": "انشاء اللہ",
    "en": "If Allah Wills",
    "ar": "إن شاء الله",
    "alt": [
      "insha allah"
    ],
    "cat": "islamic"
  },
  "mashallah": {
    "ro": "mashallah",
    "ur": "ماشاء اللہ",
    "en": "What Allah has Willed",
    "ar": "ما شاء الله",
    "alt": [
      "masha allah"
    ],
    "cat": "islamic"
  },
  "jazakallah": {
    "ro": "jazakallah",
    "ur": "جزاک اللہ",
    "en": "May Allah Reward You",
    "ar": "جزاك الله",
    "alt": [
      "jazakallahu khair"
    ],
    "cat": "islamic"
  },
  "yarhamukallah": {
    "ro": "yarhamukallah",
    "ur": "یرحمک اللہ",
    "en": "May Allah have mercy on you",
    "ar": "يرحمك الله",
    "alt": [
      "chheenk"
    ],
    "cat": "islamic"
  },
  "la ilaha illallah": {
    "ro": "la ilaha illallah",
    "ur": "لا الہ الا اللہ",
    "en": "There is no deity except Allah",
    "ar": "لا إله إلا الله",
    "alt": [
      "kalima"
    ],
    "cat": "islamic"
  },
  "muhammadur rasoolullah": {
    "ro": "muhammadur rasoolullah",
    "ur": "محمد رسول اللہ",
    "en": "Muhammad is the Messenger of Allah",
    "ar": "محمد رسول الله",
    "alt": [
      "risalat"
    ],
    "cat": "islamic"
  },
  "kalima": {
    "ro": "kalima",
    "ur": "کلمہ",
    "en": "Creed / Confession of Faith",
    "ar": "كلمة",
    "alt": [
      "tayyaba",
      "shahadat"
    ],
    "cat": "islamic"
  },
  "shahadat": {
    "ro": "shahadat",
    "ur": "شہادت",
    "en": "Martyrdom / Bearing Witness",
    "ar": "شهادة",
    "alt": [
      "shaheed",
      "shuhada"
    ],
    "cat": "islamic"
  },
  "shaheed": {
    "ro": "shaheed",
    "ur": "شہید",
    "en": "Martyr in the Cause of Allah",
    "ar": "شهيد",
    "alt": [
      "shahadat"
    ],
    "cat": "islamic"
  },
  "jihad": {
    "ro": "jihad",
    "ur": "جہاد",
    "en": "Striving in the Way of Allah",
    "ar": "جهاد",
    "alt": [
      "mujahid",
      "koshish"
    ],
    "cat": "islamic"
  },
  "fitnah": {
    "ro": "fitnah",
    "ur": "فتنہ",
    "en": "Trial / Tribulation / Discord",
    "ar": "فتنة",
    "alt": [
      "fitna",
      "fasad"
    ],
    "cat": "islamic"
  },
  "fasad": {
    "ro": "fasad",
    "ur": "فساد",
    "en": "Corruption / Mischief in the Earth",
    "ar": "فساد",
    "alt": [
      "mufsid",
      "kharabi"
    ],
    "cat": "islamic"
  },
  "gheebat": {
    "ro": "gheebat",
    "ur": "غیبت",
    "en": "Backbiting / Slander",
    "ar": "غيبة",
    "alt": [
      "chughli",
      "burai"
    ],
    "cat": "islamic"
  },
  "chughli": {
    "ro": "chughli",
    "ur": "چغلی",
    "en": "Tale-Bearing / Slander",
    "ar": "نميمة",
    "alt": [
      "nameemah"
    ],
    "cat": "islamic"
  },
  "bohtan": {
    "ro": "bohtan",
    "ur": "بہتان",
    "en": "False Accusation / Calumny",
    "ar": "بهتان",
    "alt": [
      "ilzam"
    ],
    "cat": "islamic"
  },
  "kibr": {
    "ro": "kibr",
    "ur": "کبر",
    "en": "Pride / Arrogance",
    "ar": "كبر",
    "alt": [
      "takabbur",
      "ghuroor"
    ],
    "cat": "islamic"
  },
  "riya": {
    "ro": "riya",
    "ur": "ریا",
    "en": "Showing Off in Worship / Hypocrisy",
    "ar": "رياء",
    "alt": [
      "riya-kari"
    ],
    "cat": "islamic"
  },
  "tama": {
    "ro": "tama",
    "ur": "طمع",
    "en": "Greed / Covetousness",
    "ar": "طمع",
    "alt": [
      "lalach",
      "hirs"
    ],
    "cat": "islamic"
  },
  "bukhul": {
    "ro": "bukhul",
    "ur": "بخل",
    "en": "Miserliness / Stinginess",
    "ar": "بخل",
    "alt": [
      "kanjoosi"
    ],
    "cat": "islamic"
  },
  "sakhavat": {
    "ro": "sakhavat",
    "ur": "سخاوت",
    "en": "Generosity / Magnanimity",
    "ar": "سخاوة",
    "alt": [
      "fayyazi",
      "dariya-dili"
    ],
    "cat": "islamic"
  },
  "hilm": {
    "ro": "hilm",
    "ur": "حلم",
    "en": "Forbearance / Clemency",
    "ar": "حلم",
    "alt": [
      "burdbari"
    ],
    "cat": "islamic"
  },
  "sidq": {
    "ro": "sidq",
    "ur": "صدق",
    "en": "Truthfulness / Integrity",
    "ar": "صدق",
    "alt": [
      "sachai"
    ],
    "cat": "islamic"
  },
  "shujaat": {
    "ro": "shujaat",
    "ur": "شجاعت",
    "en": "Courage / Bravery in Faith",
    "ar": "شجاعة",
    "alt": [
      "bahaduri"
    ],
    "cat": "islamic"
  },
  "iffat": {
    "ro": "iffat",
    "ur": "عفت",
    "en": "Chastity / Purity",
    "ar": "عفة",
    "alt": [
      "pakeezgi",
      "ismat"
    ],
    "cat": "islamic"
  },
  "qanaat": {
    "ro": "qanaat",
    "ur": "قناعت",
    "en": "Contentment with Divine Decree",
    "ar": "قناعة",
    "alt": [
      "raza",
      "shukr"
    ],
    "cat": "islamic"
  },
  "rida": {
    "ro": "rida",
    "ur": "رضا",
    "en": "Acceptance of Allah's Will",
    "ar": "رضا",
    "alt": [
      "raza",
      "khushnoodi"
    ],
    "cat": "islamic"
  },
  "tawakkul": {
    "ro": "tawakkul",
    "ur": "توکل",
    "en": "Trust and Reliance upon Allah",
    "ar": "توكل",
    "alt": [
      "bharosa"
    ],
    "cat": "islamic"
  },
  "khushu": {
    "ro": "khushu",
    "ur": "خشوع",
    "en": "Humility and Focus in Prayer",
    "ar": "خشوع",
    "alt": [
      "khuzoo"
    ],
    "cat": "islamic"
  },
  "shafqat": {
    "ro": "shafqat",
    "ur": "شفقت",
    "en": "Compassion / Kindness to Younger",
    "ar": "شفقة",
    "alt": [
      "meherbani"
    ],
    "cat": "islamic"
  },
  "sil-e-rahmi": {
    "ro": "sil-e-rahmi",
    "ur": "صلہ رحمی",
    "en": "Maintaining Family Ties",
    "ar": "صلة الرحم",
    "alt": [
      "rishtedari"
    ],
    "cat": "islamic"
  },
  "husn-e-suluk": {
    "ro": "husn-e-suluk",
    "ur": "حسن سلوک",
    "en": "Excellent Conduct towards Others",
    "ar": "حسن السلوك",
    "alt": [
      "accha suluk"
    ],
    "cat": "islamic"
  },
  "khidmat-e-khalq": {
    "ro": "khidmat-e-khalq",
    "ur": "خدمت خلق",
    "en": "Service to Humanity",
    "ar": "خدمة الخلق",
    "alt": [
      "insaniyat"
    ],
    "cat": "islamic"
  },
  "dawat": {
    "ro": "dawat",
    "ur": "دعوت",
    "en": "Invitation to Islam",
    "ar": "دعوة",
    "alt": [
      "tableegh"
    ],
    "cat": "islamic"
  },
  "amr bil maroof": {
    "ro": "amr bil maroof",
    "ur": "امر بالمعروف",
    "en": "Enjoining the Good",
    "ar": "الأمر بالمعروف",
    "alt": [
      "neki ka hukm"
    ],
    "cat": "islamic"
  },
  "nahi anil munkar": {
    "ro": "nahi anil munkar",
    "ur": "نہی عن المنکر",
    "en": "Forbidding the Evil",
    "ar": "النهي عن المنكر",
    "alt": [
      "burai se rokna"
    ],
    "cat": "islamic"
  },
  "istiqamat": {
    "ro": "istiqamat",
    "ur": "استقامت",
    "en": "Steadfastness on the Straight Path",
    "ar": "استقامة",
    "alt": [
      "jamay rehna"
    ],
    "cat": "islamic"
  },
  "dua-e-qunoot": {
    "ro": "dua-e-qunoot",
    "ur": "دعائے قنوت",
    "en": "Supplication in Witr Prayer",
    "ar": "دعاء القنوت",
    "alt": [
      "qunoot"
    ],
    "cat": "islamic"
  },
  "ayat-ul-kursi": {
    "ro": "ayat-ul-kursi",
    "ur": "آیت الکرسی",
    "en": "The Throne Verse (2:255)",
    "ar": "آية الكرسي",
    "alt": [
      "kursi"
    ],
    "cat": "islamic"
  },
  "surah fatihah": {
    "ro": "surah fatihah",
    "ur": "سورۃ الفاتحہ",
    "en": "The Opening Chapter of Quran",
    "ar": "سورة الفاتحة",
    "alt": [
      "al-hamd",
      "umm-ul-kitab"
    ],
    "cat": "islamic"
  },
  "surah baqarah": {
    "ro": "surah baqarah",
    "ur": "سورۃ البقرہ",
    "en": "The Cow (Longest Surah)",
    "ar": "سورة البقرة",
    "alt": [
      "baqarah"
    ],
    "cat": "islamic"
  },
  "surah yaseen": {
    "ro": "surah yaseen",
    "ur": "سورۃ یٰسٓ",
    "en": "The Heart of the Holy Quran",
    "ar": "سورة يس",
    "alt": [
      "yasin"
    ],
    "cat": "islamic"
  },
  "surah rahman": {
    "ro": "surah rahman",
    "ur": "سورۃ الرحمن",
    "en": "The Beauty of the Holy Quran",
    "ar": "سورة الرحمن",
    "alt": [
      "rehman"
    ],
    "cat": "islamic"
  },
  "surah mulk": {
    "ro": "surah mulk",
    "ur": "سورۃ الملک",
    "en": "The Dominion / Protector from Grave",
    "ar": "سورة الملك",
    "alt": [
      "tabarak"
    ],
    "cat": "islamic"
  },
  "surah kahf": {
    "ro": "surah kahf",
    "ur": "سورۃ الکہف",
    "en": "The Cave / Light on Fridays",
    "ar": "سورة الكهف",
    "alt": [
      "kahaf"
    ],
    "cat": "islamic"
  },
  "surah ikhlas": {
    "ro": "surah ikhlas",
    "ur": "سورۃ الاخلاص",
    "en": "The Sincerity / One Third of Quran",
    "ar": "سورة الإخلاص",
    "alt": [
      "qul huwallah"
    ],
    "cat": "islamic"
  },
  "surah falaq": {
    "ro": "surah falaq",
    "ur": "سورۃ الفلق",
    "en": "The Daybreak / Protection from Evil",
    "ar": "سورة الفلق",
    "alt": [
      "qul aoozu bi rabbil falaq"
    ],
    "cat": "islamic"
  },
  "surah nas": {
    "ro": "surah nas",
    "ur": "سورۃ الناس",
    "en": "Mankind / Protection from Whispers",
    "ar": "سورة الناس",
    "alt": [
      "qul aoozu bi rabbin nas"
    ],
    "cat": "islamic"
  },
  "surah waqiah": {
    "ro": "surah waqiah",
    "ur": "سورۃ الواقعہ",
    "en": "The Inevitable Event",
    "ar": "سورة الواقعة",
    "alt": [
      "waqia"
    ],
    "cat": "islamic"
  },
  "surah sajdah": {
    "ro": "surah sajdah",
    "ur": "سورۃ السجدہ",
    "en": "The Prostration",
    "ar": "سورة السجدة",
    "alt": [
      "alif lam meem sajdah"
    ],
    "cat": "islamic"
  },
  "surah juma": {
    "ro": "surah juma",
    "ur": "سورۃ الجمعہ",
    "en": "The Friday Assembly",
    "ar": "سورة الجمعة",
    "alt": [
      "jumma"
    ],
    "cat": "islamic"
  },
  "surah muzammil": {
    "ro": "surah muzammil",
    "ur": "سورۃ المزمل",
    "en": "The Enfolded One",
    "ar": "سورة المزمل",
    "alt": [
      "muzammil"
    ],
    "cat": "islamic"
  },
  "surah muddathir": {
    "ro": "surah muddathir",
    "ur": "سورۃ المدثر",
    "en": "The Cloaked One",
    "ar": "سورة المدثر",
    "alt": [
      "mudassir"
    ],
    "cat": "islamic"
  },
  "surah dhuha": {
    "ro": "surah dhuha",
    "ur": "سورۃ الضحیٰ",
    "en": "The Morning Brightness",
    "ar": "سورة الضحى",
    "alt": [
      "wad-duha"
    ],
    "cat": "islamic"
  },
  "surah inshirah": {
    "ro": "surah inshirah",
    "ur": "سورۃ الانشراح",
    "en": "The Expansion of the Breast",
    "ar": "سورة الشرح",
    "alt": [
      "alam nashrah"
    ],
    "cat": "islamic"
  },
  "surah qadr": {
    "ro": "surah qadr",
    "ur": "سورۃ القدر",
    "en": "The Night of Decree",
    "ar": "سورة القدر",
    "alt": [
      "shab-e-qadr"
    ],
    "cat": "islamic"
  },
  "surah kausar": {
    "ro": "surah kausar",
    "ur": "سورۃ الکوثر",
    "en": "The Abundance",
    "ar": "سورة الكوثر",
    "alt": [
      "inna aataina kal kausar"
    ],
    "cat": "islamic"
  },
  "surah kafiroon": {
    "ro": "surah kafiroon",
    "ur": "سورۃ الکافرون",
    "en": "The Disbelievers",
    "ar": "سورة الكافرون",
    "alt": [
      "qul ya ayyuhal kafiroon"
    ],
    "cat": "islamic"
  },
  "surah fil": {
    "ro": "surah fil",
    "ur": "سورۃ الفیل",
    "en": "The Elephant",
    "ar": "سورة الفيل",
    "alt": [
      "alam tara kaifa"
    ],
    "cat": "islamic"
  },
  "surah quraish": {
    "ro": "surah quraish",
    "ur": "سورۃ قریش",
    "en": "The Quraish Tribe",
    "ar": "سورة قريش",
    "alt": [
      "lee-eelaafi"
    ],
    "cat": "islamic"
  },
  "surah maun": {
    "ro": "surah maun",
    "ur": "سورۃ الماعون",
    "en": "The Small Kindnesses",
    "ar": "سورة الماعون",
    "alt": [
      "ara-aital-lazi"
    ],
    "cat": "islamic"
  },
  "surah asr": {
    "ro": "surah asr",
    "ur": "سورۃ العصر",
    "en": "The Declining Day / Time",
    "ar": "سورة العصر",
    "alt": [
      "wal-asr"
    ],
    "cat": "islamic"
  },
  "surah humazah": {
    "ro": "surah humazah",
    "ur": "سورۃ الہمزہ",
    "en": "The Slanderer",
    "ar": "سورة الهمزة",
    "alt": [
      "wailul-likulli"
    ],
    "cat": "islamic"
  },
  "surah takathur": {
    "ro": "surah takathur",
    "ur": "سورۃ التکاثر",
    "en": "Competition in Worldly Increase",
    "ar": "سورة التكاثر",
    "alt": [
      "alhakum"
    ],
    "cat": "islamic"
  },
  "surah qariah": {
    "ro": "surah qariah",
    "ur": "سورۃ القارعہ",
    "en": "The Striking Hour",
    "ar": "سورة القارعة",
    "alt": [
      "al-qariah"
    ],
    "cat": "islamic"
  },
  "surah zalzalah": {
    "ro": "surah zalzalah",
    "ur": "سورۃ الزلزلہ",
    "en": "The Violent Earthquake",
    "ar": "سورة الزلزلة",
    "alt": [
      "iza zulzilat"
    ],
    "cat": "islamic"
  },
  "surah bayyinah": {
    "ro": "surah bayyinah",
    "ur": "سورۃ البینہ",
    "en": "The Clear Evidence",
    "ar": "سورة البينة",
    "alt": [
      "lam yakunil-lazeena"
    ],
    "cat": "islamic"
  },
  "surah teen": {
    "ro": "surah teen",
    "ur": "سورۃ التین",
    "en": "The Fig and the Olive",
    "ar": "سورة التين",
    "alt": [
      "wat-teeni waz-zaitoon"
    ],
    "cat": "islamic"
  },
  "surah alaq": {
    "ro": "surah alaq",
    "ur": "سورۃ العلق",
    "en": "The Clinging Clot / First Revelation",
    "ar": "سورة العلق",
    "alt": [
      "iqra"
    ],
    "cat": "islamic"
  },
  "surah shams": {
    "ro": "surah shams",
    "ur": "سورۃ الشمس",
    "en": "The Sun",
    "ar": "سورة الشمس",
    "alt": [
      "wash-shamsi"
    ],
    "cat": "islamic"
  },
  "surah balad": {
    "ro": "surah balad",
    "ur": "سورۃ البلد",
    "en": "The Sacred City",
    "ar": "سورة البلد",
    "alt": [
      "la uqsimu"
    ],
    "cat": "islamic"
  },
  "surah fajr": {
    "ro": "surah fajr",
    "ur": "سورۃ الفجر",
    "en": "The Dawn",
    "ar": "سورة الفجر",
    "alt": [
      "wal-fajr"
    ],
    "cat": "islamic"
  },
  "surah ghashiyah": {
    "ro": "surah ghashiyah",
    "ur": "سورۃ الغاشیہ",
    "en": "The Overwhelming Event",
    "ar": "سورة الغاشية",
    "alt": [
      "hal ataka"
    ],
    "cat": "islamic"
  },
  "surah ala": {
    "ro": "surah ala",
    "ur": "سورۃ الاعلیٰ",
    "en": "The Most High",
    "ar": "سورة الأعلى",
    "alt": [
      "sabbihisma"
    ],
    "cat": "islamic"
  },
  "surah tariq": {
    "ro": "surah tariq",
    "ur": "سورۃ الطارق",
    "en": "The Nightly Star",
    "ar": "سورة الطارق",
    "alt": [
      "was-samai wat-tariq"
    ],
    "cat": "islamic"
  },
  "surah burooj": {
    "ro": "surah burooj",
    "ur": "سورۃ البروج",
    "en": "The Great Constellations",
    "ar": "سورة البروج",
    "alt": [
      "was-samai zatil burooj"
    ],
    "cat": "islamic"
  },
  "surah inshiqaq": {
    "ro": "surah inshiqaq",
    "ur": "سورۃ الانشقاق",
    "en": "The Splitting Asunder",
    "ar": "سورة الانشقاق",
    "alt": [
      "izas-samaa un-shaqqat"
    ],
    "cat": "islamic"
  },
  "surah mutaffifeen": {
    "ro": "surah mutaffifeen",
    "ur": "سورۃ المطففین",
    "en": "Those Who Deal in Fraud",
    "ar": "سورة المطففين",
    "alt": [
      "wailul-lil-mutaffifeen"
    ],
    "cat": "islamic"
  },
  "surah infitar": {
    "ro": "surah infitar",
    "ur": "سورۃ الانفطار",
    "en": "The Cleaving Asunder",
    "ar": "سورة الانفطار",
    "alt": [
      "izas-samaa un-fatarat"
    ],
    "cat": "islamic"
  },
  "surah takweer": {
    "ro": "surah takweer",
    "ur": "سورۃ التکویر",
    "en": "The Folding Up / Darkening",
    "ar": "سورة التكوير",
    "alt": [
      "izash-shamsu kuwwirat"
    ],
    "cat": "islamic"
  },
  "surah abasa": {
    "ro": "surah abasa",
    "ur": "سورۃ عبس",
    "en": "He Frowned",
    "ar": "سورة عبس",
    "alt": [
      "abasa wa tawalla"
    ],
    "cat": "islamic"
  },
  "surah naziat": {
    "ro": "surah naziat",
    "ur": "سورۃ النازعات",
    "en": "Those Who Drag Forth",
    "ar": "سورة النازعات",
    "alt": [
      "wan-naziaati"
    ],
    "cat": "islamic"
  },
  "surah naba": {
    "ro": "surah naba",
    "ur": "سورۃ النباء",
    "en": "The Great News",
    "ar": "سورة النبأ",
    "alt": [
      "amma yatasa-aloon"
    ],
    "cat": "islamic"
  },
  "ar-rahman": {
    "ro": "ar-rahman",
    "ur": "الرحمن",
    "en": "The Entirely Merciful",
    "ar": "الرحمن",
    "alt": [
      "rehman",
      "rahman"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-rahim": {
    "ro": "ar-rahim",
    "ur": "الرحيم",
    "en": "The Especially Merciful",
    "ar": "الرحيم",
    "alt": [
      "raheem",
      "rahim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-malik": {
    "ro": "al-malik",
    "ur": "الملک",
    "en": "The Absolute Ruler / Sovereign",
    "ar": "الملك",
    "alt": [
      "maalik",
      "malik"
    ],
    "cat": "asma_ul_husna"
  },
  "al-quddus": {
    "ro": "al-quddus",
    "ur": "القدوس",
    "en": "The Pure / The Holy",
    "ar": "القدوس",
    "alt": [
      "qudoos",
      "quddoos"
    ],
    "cat": "asma_ul_husna"
  },
  "as-salam": {
    "ro": "as-salam",
    "ur": "السلام",
    "en": "The Source of Peace",
    "ar": "السلام",
    "alt": [
      "salaam",
      "salam"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mumin": {
    "ro": "al-mumin",
    "ur": "المؤمن",
    "en": "The Giver of Faith and Security",
    "ar": "المؤمن",
    "alt": [
      "momin",
      "mumin"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muhaymin": {
    "ro": "al-muhaymin",
    "ur": "المهيمن",
    "en": "The Guardian / The Overseer",
    "ar": "المهيمن",
    "alt": [
      "muhaimin"
    ],
    "cat": "asma_ul_husna"
  },
  "al-aziz": {
    "ro": "al-aziz",
    "ur": "العزیز",
    "en": "The Almighty / The Invulnerable",
    "ar": "العزيز",
    "alt": [
      "azeez",
      "aziz"
    ],
    "cat": "asma_ul_husna"
  },
  "al-jabbar": {
    "ro": "al-jabbar",
    "ur": "الجبار",
    "en": "The Compeller / The Restorer",
    "ar": "الجبار",
    "alt": [
      "jabbar"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mutakabbir": {
    "ro": "al-mutakabbir",
    "ur": "المتکبر",
    "en": "The Supremely Great",
    "ar": "المتكبر",
    "alt": [
      "mutakabbir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-khaliq": {
    "ro": "al-khaliq",
    "ur": "الخالق",
    "en": "The Creator",
    "ar": "الخالق",
    "alt": [
      "khaaliq",
      "khaliq"
    ],
    "cat": "asma_ul_husna"
  },
  "al-bari": {
    "ro": "al-bari",
    "ur": "البارئ",
    "en": "The Maker / Evolver",
    "ar": "البارئ",
    "alt": [
      "bari"
    ],
    "cat": "asma_ul_husna"
  },
  "al-musawwir": {
    "ro": "al-musawwir",
    "ur": "المصور",
    "en": "The Bestower of Forms",
    "ar": "المصور",
    "alt": [
      "musawwir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-ghaffar": {
    "ro": "al-ghaffar",
    "ur": "الغفار",
    "en": "The Great Forgiver",
    "ar": "الغفار",
    "alt": [
      "ghaffar"
    ],
    "cat": "asma_ul_husna"
  },
  "al-qahhar": {
    "ro": "al-qahhar",
    "ur": "القهار",
    "en": "The Subduer / The Dominant",
    "ar": "القهار",
    "alt": [
      "qahhar"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wahhab": {
    "ro": "al-wahhab",
    "ur": "الوہاب",
    "en": "The Bestower of All Gifts",
    "ar": "الوهاب",
    "alt": [
      "wahhab"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-razzaq": {
    "ro": "ar-razzaq",
    "ur": "الرزاق",
    "en": "The Provider / The Sustainer",
    "ar": "الرزاق",
    "alt": [
      "razzaq",
      "razaq"
    ],
    "cat": "asma_ul_husna"
  },
  "al-fattah": {
    "ro": "al-fattah",
    "ur": "الفتاح",
    "en": "The Opener of All Doors",
    "ar": "الفتاح",
    "alt": [
      "fattah"
    ],
    "cat": "asma_ul_husna"
  },
  "al-alim": {
    "ro": "al-alim",
    "ur": "العلیم",
    "en": "The All-Knowing",
    "ar": "العليم",
    "alt": [
      "aleem",
      "alim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-qabid": {
    "ro": "al-qabid",
    "ur": "القابض",
    "en": "The Withholder",
    "ar": "القابض",
    "alt": [
      "qaabid",
      "qabiz"
    ],
    "cat": "asma_ul_husna"
  },
  "al-basit": {
    "ro": "al-basit",
    "ur": "الباسط",
    "en": "The Extender / The Expander",
    "ar": "الباسط",
    "alt": [
      "baasit",
      "basit"
    ],
    "cat": "asma_ul_husna"
  },
  "al-khafid": {
    "ro": "al-khafid",
    "ur": "الخافض",
    "en": "The Abaser",
    "ar": "الخافض",
    "alt": [
      "khafiz",
      "khafid"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-rafi": {
    "ro": "ar-rafi",
    "ur": "الرافع",
    "en": "The Exalter",
    "ar": "الرافع",
    "alt": [
      "raafi",
      "rafi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muizz": {
    "ro": "al-muizz",
    "ur": "المعز",
    "en": "The Bestower of Honor",
    "ar": "المعز",
    "alt": [
      "muizz"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mudhill": {
    "ro": "al-mudhill",
    "ur": "المذل",
    "en": "The Humiliator",
    "ar": "المذل",
    "alt": [
      "muzill",
      "mudhill"
    ],
    "cat": "asma_ul_husna"
  },
  "as-sami": {
    "ro": "as-sami",
    "ur": "السمیع",
    "en": "The All-Hearing",
    "ar": "السميع",
    "alt": [
      "samee",
      "sami"
    ],
    "cat": "asma_ul_husna"
  },
  "al-basir": {
    "ro": "al-basir",
    "ur": "البصیر",
    "en": "The All-Seeing",
    "ar": "البصير",
    "alt": [
      "baseer",
      "basir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hakam": {
    "ro": "al-hakam",
    "ur": "الحکم",
    "en": "The Absolute Judge",
    "ar": "الحكم",
    "alt": [
      "hakam"
    ],
    "cat": "asma_ul_husna"
  },
  "al-adl": {
    "ro": "al-adl",
    "ur": "العدل",
    "en": "The Utterly Just",
    "ar": "العدل",
    "alt": [
      "adl"
    ],
    "cat": "asma_ul_husna"
  },
  "al-latif": {
    "ro": "al-latif",
    "ur": "اللطیف",
    "en": "The Subtle / The Most Kind",
    "ar": "اللطيف",
    "alt": [
      "lateef",
      "latif"
    ],
    "cat": "asma_ul_husna"
  },
  "al-khabir": {
    "ro": "al-khabir",
    "ur": "الخبیر",
    "en": "The All-Aware",
    "ar": "الخبير",
    "alt": [
      "khabeer",
      "khabir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-halim": {
    "ro": "al-halim",
    "ur": "الحلیم",
    "en": "The Most Forbearing",
    "ar": "الحليم",
    "alt": [
      "haleem",
      "halim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-azim": {
    "ro": "al-azim",
    "ur": "العظیم",
    "en": "The Magnificent / The Supreme",
    "ar": "العظيم",
    "alt": [
      "azeem",
      "azim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-ghafur": {
    "ro": "al-ghafur",
    "ur": "الغفور",
    "en": "The All-Forgiving",
    "ar": "الغفور",
    "alt": [
      "ghafoor",
      "ghafur"
    ],
    "cat": "asma_ul_husna"
  },
  "ash-shakur": {
    "ro": "ash-shakur",
    "ur": "الشکور",
    "en": "The Most Grateful",
    "ar": "الشكور",
    "alt": [
      "shakoor",
      "shakur"
    ],
    "cat": "asma_ul_husna"
  },
  "al-ali": {
    "ro": "al-ali",
    "ur": "العلی",
    "en": "The Most High",
    "ar": "العلي",
    "alt": [
      "alee",
      "ali"
    ],
    "cat": "asma_ul_husna"
  },
  "al-kabir": {
    "ro": "al-kabir",
    "ur": "الکبیر",
    "en": "The Most Great",
    "ar": "الكبير",
    "alt": [
      "kabeer",
      "kabir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hafiz": {
    "ro": "al-hafiz",
    "ur": "الحفیظ",
    "en": "The Preserver",
    "ar": "الحفيظ",
    "alt": [
      "hafeez",
      "hafiz"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muqit": {
    "ro": "al-muqit",
    "ur": "المقیت",
    "en": "The Sustainer",
    "ar": "المقيت",
    "alt": [
      "muqeet",
      "muqit"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hasib": {
    "ro": "al-hasib",
    "ur": "الحسیب",
    "en": "The Reckoner",
    "ar": "الحسيب",
    "alt": [
      "haseeb",
      "hasib"
    ],
    "cat": "asma_ul_husna"
  },
  "al-jalil": {
    "ro": "al-jalil",
    "ur": "الجلیل",
    "en": "The Majestic",
    "ar": "الجليل",
    "alt": [
      "jaleel",
      "jalil"
    ],
    "cat": "asma_ul_husna"
  },
  "al-karim": {
    "ro": "al-karim",
    "ur": "الکریم",
    "en": "The Most Bountiful / Generous",
    "ar": "الكريم",
    "alt": [
      "kareem",
      "karim"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-raqib": {
    "ro": "ar-raqib",
    "ur": "الرقیب",
    "en": "The Watchful Observer",
    "ar": "الرقيب",
    "alt": [
      "raqeeb",
      "raqib"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mujib": {
    "ro": "al-mujib",
    "ur": "المجیب",
    "en": "The Responsive / Answerer of Prayers",
    "ar": "المجيب",
    "alt": [
      "mujeeb",
      "mujib"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wasi": {
    "ro": "al-wasi",
    "ur": "الواسع",
    "en": "The All-Encompassing",
    "ar": "الواسع",
    "alt": [
      "waasi",
      "wasi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hakim": {
    "ro": "al-hakim",
    "ur": "الحکیم",
    "en": "The All-Wise",
    "ar": "الحكيم",
    "alt": [
      "hakeem",
      "hakim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wadud": {
    "ro": "al-wadud",
    "ur": "الودود",
    "en": "The Most Loving",
    "ar": "الودود",
    "alt": [
      "wadood",
      "wadud"
    ],
    "cat": "asma_ul_husna"
  },
  "al-majid": {
    "ro": "al-majid",
    "ur": "المجید",
    "en": "The Glorious",
    "ar": "المجيد",
    "alt": [
      "majeed",
      "majid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-baith": {
    "ro": "al-baith",
    "ur": "الباعث",
    "en": "The Resurrector of the Dead",
    "ar": "الباعث",
    "alt": [
      "baais",
      "baith"
    ],
    "cat": "asma_ul_husna"
  },
  "ash-shahid": {
    "ro": "ash-shahid",
    "ur": "الشهید",
    "en": "The Universal Witness",
    "ar": "الشهيد",
    "alt": [
      "shaheed",
      "shahid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-haqq": {
    "ro": "al-haqq",
    "ur": "الحق",
    "en": "The Embodiment of Truth",
    "ar": "الحق",
    "alt": [
      "haq",
      "haqq"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wakil": {
    "ro": "al-wakil",
    "ur": "الوکیل",
    "en": "The Ultimate Trustee",
    "ar": "الوكيل",
    "alt": [
      "wakeel",
      "wakil"
    ],
    "cat": "asma_ul_husna"
  },
  "al-qawi": {
    "ro": "al-qawi",
    "ur": "القوی",
    "en": "The All-Powerful",
    "ar": "القوي",
    "alt": [
      "qawee",
      "qawi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-matin": {
    "ro": "al-matin",
    "ur": "المتین",
    "en": "The Steadfast / Firm",
    "ar": "المتين",
    "alt": [
      "mateen",
      "matin"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wali": {
    "ro": "al-wali",
    "ur": "الولی",
    "en": "The Protecting Friend",
    "ar": "الولي",
    "alt": [
      "walee",
      "wali"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hamid": {
    "ro": "al-hamid",
    "ur": "الحمید",
    "en": "The Praiseworthy",
    "ar": "الحميد",
    "alt": [
      "hameed",
      "hamid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muhsi": {
    "ro": "al-muhsi",
    "ur": "المحصی",
    "en": "The Accounter of All Things",
    "ar": "المحصي",
    "alt": [
      "muhsee",
      "muhsi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mubdi": {
    "ro": "al-mubdi",
    "ur": "المبدئ",
    "en": "The Originator",
    "ar": "المبدئ",
    "alt": [
      "mubdi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muid": {
    "ro": "al-muid",
    "ur": "المعید",
    "en": "The Restorer",
    "ar": "المعيد",
    "alt": [
      "mueed",
      "muid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muhyi": {
    "ro": "al-muhyi",
    "ur": "المحیی",
    "en": "The Giver of Life",
    "ar": "المحيي",
    "alt": [
      "muhyee",
      "muhyi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mumit": {
    "ro": "al-mumit",
    "ur": "الممیت",
    "en": "The Creator of Death",
    "ar": "المميت",
    "alt": [
      "mumeet",
      "mumit"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hayy": {
    "ro": "al-hayy",
    "ur": "الحی",
    "en": "The Ever-Living",
    "ar": "الحي",
    "alt": [
      "hayy",
      "hai"
    ],
    "cat": "asma_ul_husna"
  },
  "al-qayyum": {
    "ro": "al-qayyum",
    "ur": "القیوم",
    "en": "The Self-Subsisting Sustainer",
    "ar": "القيوم",
    "alt": [
      "qayyoor",
      "qayyum"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wajid": {
    "ro": "al-wajid",
    "ur": "الواجد",
    "en": "The Perceiver / Unfailing",
    "ar": "الواجد",
    "alt": [
      "waajid",
      "wajid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-wahid": {
    "ro": "al-wahid",
    "ur": "الواحد",
    "en": "The Unique / The One",
    "ar": "الواحد",
    "alt": [
      "waahid",
      "wahid"
    ],
    "cat": "asma_ul_husna"
  },
  "al-ahad": {
    "ro": "al-ahad",
    "ur": "الاحد",
    "en": "The Indivisible One",
    "ar": "الأحد",
    "alt": [
      "ahad"
    ],
    "cat": "asma_ul_husna"
  },
  "as-samad": {
    "ro": "as-samad",
    "ur": "الصمد",
    "en": "The Eternal / Self-Sufficient",
    "ar": "الصمد",
    "alt": [
      "samad"
    ],
    "cat": "asma_ul_husna"
  },
  "al-qadir": {
    "ro": "al-qadir",
    "ur": "القادر",
    "en": "The Omnipotent",
    "ar": "القادر",
    "alt": [
      "qaadir",
      "qadir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muqtadir": {
    "ro": "al-muqtadir",
    "ur": "المقتدر",
    "en": "The Determiner / Dominant",
    "ar": "المقتدر",
    "alt": [
      "muqtadir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muqaddim": {
    "ro": "al-muqaddim",
    "ur": "المقدم",
    "en": "The Expediter",
    "ar": "المقدم",
    "alt": [
      "muqaddim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muakhkhir": {
    "ro": "al-muakhkhir",
    "ur": "المؤخر",
    "en": "The Delayer",
    "ar": "المؤخر",
    "alt": [
      "muakhkhir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-awwal": {
    "ro": "al-awwal",
    "ur": "الاول",
    "en": "The Very First",
    "ar": "الأول",
    "alt": [
      "awwal",
      "pehla"
    ],
    "cat": "asma_ul_husna"
  },
  "al-akhir": {
    "ro": "al-akhir",
    "ur": "الآخر",
    "en": "The Infinite Last",
    "ar": "الآخر",
    "alt": [
      "aakhir",
      "aakhri"
    ],
    "cat": "asma_ul_husna"
  },
  "az-zahir": {
    "ro": "az-zahir",
    "ur": "الظاہر",
    "en": "The Manifest / Evident",
    "ar": "الظاهر",
    "alt": [
      "zaahir",
      "zahir"
    ],
    "cat": "asma_ul_husna"
  },
  "al-batin": {
    "ro": "al-batin",
    "ur": "الباطن",
    "en": "The Hidden / Unseen",
    "ar": "الباطن",
    "alt": [
      "baatin",
      "batin"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mutaali": {
    "ro": "al-mutaali",
    "ur": "المتعالی",
    "en": "The Supreme Exalted",
    "ar": "المتعالي",
    "alt": [
      "mutaali"
    ],
    "cat": "asma_ul_husna"
  },
  "al-barr": {
    "ro": "al-barr",
    "ur": "البر",
    "en": "The Source of All Goodness",
    "ar": "البر",
    "alt": [
      "barr"
    ],
    "cat": "asma_ul_husna"
  },
  "at-tawwab": {
    "ro": "at-tawwab",
    "ur": "التواب",
    "en": "The Ever-Accepter of Repentance",
    "ar": "التواب",
    "alt": [
      "tawwab"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muntaqim": {
    "ro": "al-muntaqim",
    "ur": "المنتقم",
    "en": "The Retributor",
    "ar": "المنتقم",
    "alt": [
      "muntaqim"
    ],
    "cat": "asma_ul_husna"
  },
  "al-afuw": {
    "ro": "al-afuw",
    "ur": "العفو",
    "en": "The Supreme Pardoner",
    "ar": "العفو",
    "alt": [
      "afuw",
      "afoo"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-rauf": {
    "ro": "ar-rauf",
    "ur": "الرؤوف",
    "en": "The Most Clement / Compassionate",
    "ar": "الرؤوف",
    "alt": [
      "raoof",
      "rauf"
    ],
    "cat": "asma_ul_husna"
  },
  "malik-ul-mulk": {
    "ro": "malik-ul-mulk",
    "ur": "مالک الملک",
    "en": "Owner of All Sovereignty",
    "ar": "مالك الملك",
    "alt": [
      "malikul mulk"
    ],
    "cat": "asma_ul_husna"
  },
  "dhul-jalali-wal-ikram": {
    "ro": "dhul-jalali-wal-ikram",
    "ur": "ذو الجلال والاکرام",
    "en": "Lord of Majesty and Generosity",
    "ar": "ذو الجلال والإكرام",
    "alt": [
      "zul jalal"
    ],
    "cat": "asma_ul_husna"
  },
  "al-muqsit": {
    "ro": "al-muqsit",
    "ur": "المقسط",
    "en": "The Equitable",
    "ar": "المقسط",
    "alt": [
      "muqsit"
    ],
    "cat": "asma_ul_husna"
  },
  "al-jami": {
    "ro": "al-jami",
    "ur": "الجامع",
    "en": "The Gatherer of All Mankind",
    "ar": "الجامع",
    "alt": [
      "jaami",
      "jami"
    ],
    "cat": "asma_ul_husna"
  },
  "al-ghani": {
    "ro": "al-ghani",
    "ur": "الغنی",
    "en": "The Self-Sufficient / Rich",
    "ar": "الغني",
    "alt": [
      "ghanee",
      "ghani"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mughni": {
    "ro": "al-mughni",
    "ur": "المغنی",
    "en": "The Enricher",
    "ar": "المغني",
    "alt": [
      "mughnee",
      "mughni"
    ],
    "cat": "asma_ul_husna"
  },
  "al-mani": {
    "ro": "al-mani",
    "ur": "المانع",
    "en": "The Preventer",
    "ar": "المانع",
    "alt": [
      "maani",
      "mani"
    ],
    "cat": "asma_ul_husna"
  },
  "ad-darr": {
    "ro": "ad-darr",
    "ur": "الضار",
    "en": "The Creator of Harm and Trial",
    "ar": "الضار",
    "alt": [
      "darr"
    ],
    "cat": "asma_ul_husna"
  },
  "an-nafi": {
    "ro": "an-nafi",
    "ur": "النافع",
    "en": "The Creator of Good and Benefit",
    "ar": "النافع",
    "alt": [
      "naafi",
      "nafi"
    ],
    "cat": "asma_ul_husna"
  },
  "an-nur": {
    "ro": "an-nur",
    "ur": "النور",
    "en": "The Primordial Light",
    "ar": "النور",
    "alt": [
      "noor",
      "nur"
    ],
    "cat": "asma_ul_husna"
  },
  "al-hadi": {
    "ro": "al-hadi",
    "ur": "الہادی",
    "en": "The Supreme Guide",
    "ar": "الهادي",
    "alt": [
      "haadi",
      "hadi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-badi": {
    "ro": "al-badi",
    "ur": "البدیع",
    "en": "The Incomparable Originator",
    "ar": "البديع",
    "alt": [
      "badee",
      "badi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-baqi": {
    "ro": "al-baqi",
    "ur": "الباقی",
    "en": "The Everlasting / Immortal",
    "ar": "الباقي",
    "alt": [
      "baaqi",
      "baqi"
    ],
    "cat": "asma_ul_husna"
  },
  "al-warith": {
    "ro": "al-warith",
    "ur": "الوارث",
    "en": "The Supreme Inheritor of All",
    "ar": "الوارث",
    "alt": [
      "waaris",
      "warith"
    ],
    "cat": "asma_ul_husna"
  },
  "ar-rashid": {
    "ro": "ar-rashid",
    "ur": "الرشید",
    "en": "The Guide to the Right Path",
    "ar": "الرشيد",
    "alt": [
      "rasheed",
      "rashid"
    ],
    "cat": "asma_ul_husna"
  },
  "as-sabur": {
    "ro": "as-sabur",
    "ur": "الصبور",
    "en": "The Most Patient",
    "ar": "الصبور",
    "alt": [
      "saboor",
      "sabur"
    ],
    "cat": "asma_ul_husna"
  },
  "main": {
    "ro": "main",
    "ur": "میں",
    "en": "I / Me",
    "ar": "میں",
    "alt": [
      "mai",
      "mein"
    ],
    "cat": "conversational"
  },
  "mujhe": {
    "ro": "mujhe",
    "ur": "مجھے",
    "en": "Me / To me",
    "ar": "مجھے",
    "alt": [
      "mujh ko"
    ],
    "cat": "conversational"
  },
  "mera": {
    "ro": "mera",
    "ur": "میرا",
    "en": "My / Mine (masculine)",
    "ar": "میرا",
    "alt": [],
    "cat": "conversational"
  },
  "meri": {
    "ro": "meri",
    "ur": "میری",
    "en": "My / Mine (feminine)",
    "ar": "میری",
    "alt": [],
    "cat": "conversational"
  },
  "mere": {
    "ro": "mere",
    "ur": "میرے",
    "en": "My / Mine (plural)",
    "ar": "میرے",
    "alt": [],
    "cat": "conversational"
  },
  "mujhse": {
    "ro": "mujhse",
    "ur": "مجھ سے",
    "en": "From me / With me",
    "ar": "مجھ سے",
    "alt": [
      "mujh se"
    ],
    "cat": "conversational"
  },
  "mujhpar": {
    "ro": "mujhpar",
    "ur": "مجھ پر",
    "en": "Upon me / On me",
    "ar": "مجھ پر",
    "alt": [
      "mujh pe"
    ],
    "cat": "conversational"
  },
  "tu": {
    "ro": "tu",
    "ur": "تو",
    "en": "You (informal)",
    "ar": "تو",
    "alt": [
      "too"
    ],
    "cat": "conversational"
  },
  "tujhe": {
    "ro": "tujhe",
    "ur": "تجھے",
    "en": "To you (informal)",
    "ar": "تجھے",
    "alt": [],
    "cat": "conversational"
  },
  "tera": {
    "ro": "tera",
    "ur": "تیرا",
    "en": "Your / Yours (masculine)",
    "ar": "تیرا",
    "alt": [],
    "cat": "conversational"
  },
  "teri": {
    "ro": "teri",
    "ur": "تیری",
    "en": "Your / Yours (feminine)",
    "ar": "تیری",
    "alt": [],
    "cat": "conversational"
  },
  "tere": {
    "ro": "tere",
    "ur": "تیرے",
    "en": "Your / Yours (plural)",
    "ar": "تیرے",
    "alt": [],
    "cat": "conversational"
  },
  "tujhse": {
    "ro": "tujhse",
    "ur": "تجھ سے",
    "en": "From you",
    "ar": "تجھ سے",
    "alt": [],
    "cat": "conversational"
  },
  "tum": {
    "ro": "tum",
    "ur": "تم",
    "en": "You (familiar)",
    "ar": "تم",
    "alt": [],
    "cat": "conversational"
  },
  "tumhein": {
    "ro": "tumhein",
    "ur": "تمہیں",
    "en": "To you",
    "ar": "تمہیں",
    "alt": [
      "tumhe",
      "tum ko"
    ],
    "cat": "conversational"
  },
  "tumhara": {
    "ro": "tumhara",
    "ur": "تمہارا",
    "en": "Your / Yours (masculine)",
    "ar": "تمہارا",
    "alt": [],
    "cat": "conversational"
  },
  "tumhari": {
    "ro": "tumhari",
    "ur": "تمہاری",
    "en": "Your / Yours (feminine)",
    "ar": "تمہاری",
    "alt": [],
    "cat": "conversational"
  },
  "tumhare": {
    "ro": "tumhare",
    "ur": "تمہارے",
    "en": "Your / Yours (plural)",
    "ar": "تمہارے",
    "alt": [],
    "cat": "conversational"
  },
  "tumse": {
    "ro": "tumse",
    "ur": "تم سے",
    "en": "From you / With you",
    "ar": "تم سے",
    "alt": [],
    "cat": "conversational"
  },
  "aap": {
    "ro": "aap",
    "ur": "آپ",
    "en": "You (respectful / formal)",
    "ar": "آپ",
    "alt": [],
    "cat": "conversational"
  },
  "aapka": {
    "ro": "aapka",
    "ur": "آپ کا",
    "en": "Your / Yours (respectful)",
    "ar": "آپ کا",
    "alt": [],
    "cat": "conversational"
  },
  "aapki": {
    "ro": "aapki",
    "ur": "آپ کی",
    "en": "Your / Yours (respectful feminine)",
    "ar": "آپ کی",
    "alt": [],
    "cat": "conversational"
  },
  "aapke": {
    "ro": "aapke",
    "ur": "آپ کے",
    "en": "Your / Yours (respectful plural)",
    "ar": "آپ کے",
    "alt": [],
    "cat": "conversational"
  },
  "aapse": {
    "ro": "aapse",
    "ur": "آپ سے",
    "en": "From you (respectful)",
    "ar": "آپ سے",
    "alt": [],
    "cat": "conversational"
  },
  "hum": {
    "ro": "hum",
    "ur": "ہم",
    "en": "We / Us",
    "ar": "ہم",
    "alt": [
      "ham"
    ],
    "cat": "conversational"
  },
  "humein": {
    "ro": "humein",
    "ur": "ہمیں",
    "en": "To us",
    "ar": "ہمیں",
    "alt": [
      "hume",
      "hum ko"
    ],
    "cat": "conversational"
  },
  "hamara": {
    "ro": "hamara",
    "ur": "ہمارا",
    "en": "Our / Ours (masculine)",
    "ar": "ہمارا",
    "alt": [],
    "cat": "conversational"
  },
  "hamari": {
    "ro": "hamari",
    "ur": "ہماری",
    "en": "Our / Ours (feminine)",
    "ar": "ہماری",
    "alt": [],
    "cat": "conversational"
  },
  "hamare": {
    "ro": "hamare",
    "ur": "ہمارے",
    "en": "Our / Ours (plural)",
    "ar": "ہمارے",
    "alt": [],
    "cat": "conversational"
  },
  "humse": {
    "ro": "humse",
    "ur": "ہم سے",
    "en": "From us / With us",
    "ar": "ہم سے",
    "alt": [],
    "cat": "conversational"
  },
  "woh": {
    "ro": "woh",
    "ur": "وہ",
    "en": "He / She / It / They / That",
    "ar": "وہ",
    "alt": [
      "wo"
    ],
    "cat": "conversational"
  },
  "unka": {
    "ro": "unka",
    "ur": "ان کا",
    "en": "Their / His / Her (respectful)",
    "ar": "ان کا",
    "alt": [],
    "cat": "conversational"
  },
  "unki": {
    "ro": "unki",
    "ur": "ان کی",
    "en": "Their / Her (respectful feminine)",
    "ar": "ان کی",
    "alt": [],
    "cat": "conversational"
  },
  "unke": {
    "ro": "unke",
    "ur": "ان کے",
    "en": "Their / His (plural)",
    "ar": "ان کے",
    "alt": [],
    "cat": "conversational"
  },
  "unse": {
    "ro": "unse",
    "ur": "ان سے",
    "en": "From them / With them",
    "ar": "ان سے",
    "alt": [],
    "cat": "conversational"
  },
  "unhein": {
    "ro": "unhein",
    "ur": "انہیں",
    "en": "To them",
    "ar": "انہیں",
    "alt": [
      "unhe"
    ],
    "cat": "conversational"
  },
  "ye": {
    "ro": "ye",
    "ur": "یہ",
    "en": "This / These / He / She",
    "ar": "یہ",
    "alt": [
      "yeh"
    ],
    "cat": "conversational"
  },
  "iska": {
    "ro": "iska",
    "ur": "اس کا",
    "en": "His / Her / Its (proximate)",
    "ar": "اس کا",
    "alt": [],
    "cat": "conversational"
  },
  "iski": {
    "ro": "iski",
    "ur": "اس کی",
    "en": "His / Her / Its (feminine)",
    "ar": "اس کی",
    "alt": [],
    "cat": "conversational"
  },
  "iske": {
    "ro": "iske",
    "ur": "اس کے",
    "en": "Its / His (plural)",
    "ar": "اس کے",
    "alt": [],
    "cat": "conversational"
  },
  "isse": {
    "ro": "isse",
    "ur": "اس سے",
    "en": "From this / With this",
    "ar": "اس سے",
    "alt": [],
    "cat": "conversational"
  },
  "ise": {
    "ro": "ise",
    "ur": "اسے",
    "en": "To this / To him",
    "ar": "اسے",
    "alt": [
      "is ko"
    ],
    "cat": "conversational"
  },
  "inhone": {
    "ro": "inhone",
    "ur": "انہوں نے",
    "en": "They (proximate agents)",
    "ar": "انہوں نے",
    "alt": [],
    "cat": "conversational"
  },
  "unhone": {
    "ro": "unhone",
    "ur": "انہوں نے",
    "en": "They (distal agents)",
    "ar": "انہوں نے",
    "alt": [],
    "cat": "conversational"
  },
  "apna": {
    "ro": "apna",
    "ur": "اپنا",
    "en": "One's own (masculine)",
    "ar": "اپنا",
    "alt": [],
    "cat": "conversational"
  },
  "apni": {
    "ro": "apni",
    "ur": "اپنی",
    "en": "One's own (feminine)",
    "ar": "اپنی",
    "alt": [],
    "cat": "conversational"
  },
  "apne": {
    "ro": "apne",
    "ur": "اپنے",
    "en": "One's own (plural)",
    "ar": "اپنے",
    "alt": [],
    "cat": "conversational"
  },
  "khud": {
    "ro": "khud",
    "ur": "خود",
    "en": "Self / Personally",
    "ar": "خود",
    "alt": [
      "apne aap"
    ],
    "cat": "conversational"
  },
  "kya": {
    "ro": "kya",
    "ur": "کیا",
    "en": "In/With what / that which / not",
    "ar": "کیا",
    "alt": [],
    "cat": "conversational"
  },
  "kyun": {
    "ro": "kyun",
    "ur": "کیوں",
    "en": "Why",
    "ar": "کیوں",
    "alt": [
      "kyu",
      "kyon"
    ],
    "cat": "conversational"
  },
  "kaise": {
    "ro": "kaise",
    "ur": "کیسے",
    "en": "How",
    "ar": "کیسے",
    "alt": [
      "kese",
      "kaisa",
      "kaisi"
    ],
    "cat": "conversational"
  },
  "kahan": {
    "ro": "kahan",
    "ur": "کہاں",
    "en": "Where",
    "ar": "کہاں",
    "alt": [
      "kaha",
      "kidhar"
    ],
    "cat": "conversational"
  },
  "kab": {
    "ro": "kab",
    "ur": "کب",
    "en": "When",
    "ar": "کب",
    "alt": [],
    "cat": "conversational"
  },
  "kon": {
    "ro": "kon",
    "ur": "کون",
    "en": "Who",
    "ar": "کون",
    "alt": [
      "kaun",
      "kone"
    ],
    "cat": "conversational"
  },
  "kitna": {
    "ro": "kitna",
    "ur": "کتنا",
    "en": "How much (masculine)",
    "ar": "کتنا",
    "alt": [],
    "cat": "conversational"
  },
  "kitni": {
    "ro": "kitni",
    "ur": "کتنی",
    "en": "How much (feminine)",
    "ar": "کتنی",
    "alt": [],
    "cat": "conversational"
  },
  "kitne": {
    "ro": "kitne",
    "ur": "کتنے",
    "en": "How many (plural)",
    "ar": "کتنے",
    "alt": [],
    "cat": "conversational"
  },
  "kiska": {
    "ro": "kiska",
    "ur": "کس کا",
    "en": "Whose (masculine)",
    "ar": "کس کا",
    "alt": [],
    "cat": "conversational"
  },
  "kiski": {
    "ro": "kiski",
    "ur": "کس کی",
    "en": "Whose (feminine)",
    "ar": "کس کی",
    "alt": [],
    "cat": "conversational"
  },
  "kiske": {
    "ro": "kiske",
    "ur": "کس کے",
    "en": "Whose (plural)",
    "ar": "کس کے",
    "alt": [],
    "cat": "conversational"
  },
  "kisse": {
    "ro": "kisse",
    "ur": "کس سے",
    "en": "From whom / With whom",
    "ar": "کس سے",
    "alt": [],
    "cat": "conversational"
  },
  "kisne": {
    "ro": "kisne",
    "ur": "کس نے",
    "en": "Who (agentive past)",
    "ar": "کس نے",
    "alt": [],
    "cat": "conversational"
  },
  "ka": {
    "ro": "ka",
    "ur": "کا",
    "en": "Of (masculine singular)",
    "ar": "کا",
    "alt": [],
    "cat": "conversational"
  },
  "ki": {
    "ro": "ki",
    "ur": "کی",
    "en": "Of (feminine singular)",
    "ar": "کی",
    "alt": [],
    "cat": "conversational"
  },
  "ke": {
    "ro": "ke",
    "ur": "کے",
    "en": "Of (plural / oblique)",
    "ar": "کے",
    "alt": [],
    "cat": "conversational"
  },
  "ko": {
    "ro": "ko",
    "ur": "کو",
    "en": "To / For (dative/accusative)",
    "ar": "کو",
    "alt": [],
    "cat": "conversational"
  },
  "se": {
    "ro": "se",
    "ur": "سے",
    "en": "From / With / By / Since",
    "ar": "سے",
    "alt": [],
    "cat": "conversational"
  },
  "mein": {
    "ro": "mein",
    "ur": "میں",
    "en": "In / Inside",
    "ar": "میں",
    "alt": [
      "me",
      "andar"
    ],
    "cat": "conversational"
  },
  "par": {
    "ro": "par",
    "ur": "پر",
    "en": "On / Upon / At",
    "ar": "پر",
    "alt": [
      "pe",
      "oopar"
    ],
    "cat": "conversational"
  },
  "tak": {
    "ro": "tak",
    "ur": "تک",
    "en": "Until / Up to / Till",
    "ar": "تک",
    "alt": [],
    "cat": "conversational"
  },
  "ne": {
    "ro": "ne",
    "ur": "نے",
    "en": "Ergative past particle",
    "ar": "نے",
    "alt": [],
    "cat": "conversational"
  },
  "saath": {
    "ro": "saath",
    "ur": "ساتھ",
    "en": "Together / With",
    "ar": "ساتھ",
    "alt": [
      "hamrah",
      "sitteen"
    ],
    "cat": "conversational"
  },
  "bina": {
    "ro": "bina",
    "ur": "بنا",
    "en": "Without",
    "ar": "بنا",
    "alt": [
      "baghair"
    ],
    "cat": "conversational"
  },
  "baghair": {
    "ro": "baghair",
    "ur": "بغیر",
    "en": "Without / Deprived of",
    "ar": "بغیر",
    "alt": [],
    "cat": "conversational"
  },
  "andar": {
    "ro": "andar",
    "ur": "اندر",
    "en": "Inside / Within",
    "ar": "اندر",
    "alt": [],
    "cat": "conversational"
  },
  "bahar": {
    "ro": "bahar",
    "ur": "باہر",
    "en": "Outside",
    "ar": "باہر",
    "alt": [],
    "cat": "conversational"
  },
  "oopar": {
    "ro": "oopar",
    "ur": "اوپر",
    "en": "Above / On top",
    "ar": "اوپر",
    "alt": [
      "upar"
    ],
    "cat": "conversational"
  },
  "neeche": {
    "ro": "neeche",
    "ur": "نیچے",
    "en": "Below / Underneath",
    "ar": "نیچے",
    "alt": [],
    "cat": "conversational"
  },
  "aage": {
    "ro": "aage",
    "ur": "آگے",
    "en": "Ahead / In front",
    "ar": "آگے",
    "alt": [],
    "cat": "conversational"
  },
  "peeche": {
    "ro": "peeche",
    "ur": "پیچھے",
    "en": "Behind",
    "ar": "پیچھے",
    "alt": [],
    "cat": "conversational"
  },
  "darmiyan": {
    "ro": "darmiyan",
    "ur": "درمیان",
    "en": "Between / Amidst",
    "ar": "درمیان",
    "alt": [
      "beech"
    ],
    "cat": "conversational"
  },
  "samne": {
    "ro": "samne",
    "ur": "سامنے",
    "en": "In front of / Facing",
    "ar": "سامنے",
    "alt": [],
    "cat": "conversational"
  },
  "taraf": {
    "ro": "taraf",
    "ur": "طرف",
    "en": "Face / Countenance / Direction",
    "ar": "طرف",
    "alt": [
      "janib"
    ],
    "cat": "conversational"
  },
  "liye": {
    "ro": "liye",
    "ur": "لیے",
    "en": "For / For the sake of",
    "ar": "لیے",
    "alt": [
      "waste"
    ],
    "cat": "conversational"
  },
  "waste": {
    "ro": "waste",
    "ur": "واسطے",
    "en": "For the sake of",
    "ar": "واسطے",
    "alt": [],
    "cat": "conversational"
  },
  "aur": {
    "ro": "aur",
    "ur": "اور",
    "en": "And",
    "ar": "اور",
    "alt": [
      "o"
    ],
    "cat": "conversational"
  },
  "ya": {
    "ro": "ya",
    "ur": "یا",
    "en": "Or (in questions)",
    "ar": "یا",
    "alt": [],
    "cat": "conversational"
  },
  "lekin": {
    "ro": "lekin",
    "ur": "لیکن",
    "en": "But / However",
    "ar": "لیکن",
    "alt": [
      "magar"
    ],
    "cat": "conversational"
  },
  "magar": {
    "ro": "magar",
    "ur": "مگر",
    "en": "However / But",
    "ar": "مگر",
    "alt": [],
    "cat": "conversational"
  },
  "agar": {
    "ro": "agar",
    "ur": "اگر",
    "en": "If / Would that",
    "ar": "اگر",
    "alt": [
      "kash"
    ],
    "cat": "conversational"
  },
  "warna": {
    "ro": "warna",
    "ur": "ورنہ",
    "en": "Otherwise / Or else",
    "ar": "ورنہ",
    "alt": [],
    "cat": "conversational"
  },
  "kyunki": {
    "ro": "kyunki",
    "ur": "کیونکہ",
    "en": "Because / Since",
    "ar": "کیونکہ",
    "alt": [
      "kyun ke"
    ],
    "cat": "conversational"
  },
  "chunki": {
    "ro": "chunki",
    "ur": "چونکہ",
    "en": "Since / Because",
    "ar": "چونکہ",
    "alt": [],
    "cat": "conversational"
  },
  "isliye": {
    "ro": "isliye",
    "ur": "اس لیے",
    "en": "Therefore / Hence",
    "ar": "اس لیے",
    "alt": [
      "is waste"
    ],
    "cat": "conversational"
  },
  "to": {
    "ro": "to",
    "ur": "تو",
    "en": "Then / So / Indeed",
    "ar": "تو",
    "alt": [
      "toh"
    ],
    "cat": "conversational"
  },
  "bhi": {
    "ro": "bhi",
    "ur": "بھی",
    "en": "Also / Even / As well",
    "ar": "بھی",
    "alt": [],
    "cat": "conversational"
  },
  "hamesha": {
    "ro": "hamesha",
    "ur": "ہمیشہ",
    "en": "Always / Forever",
    "ar": "ہمیشہ",
    "alt": [
      "daiman"
    ],
    "cat": "conversational"
  },
  "kabhi": {
    "ro": "kabhi",
    "ur": "کبھی",
    "en": "Ever / Sometimes",
    "ar": "کبھی",
    "alt": [
      "kabhi kabhi"
    ],
    "cat": "conversational"
  },
  "ab": {
    "ro": "ab",
    "ur": "اب",
    "en": "Now / Currently",
    "ar": "اب",
    "alt": [
      "abhi"
    ],
    "cat": "conversational"
  },
  "tab": {
    "ro": "tab",
    "ur": "تب",
    "en": "Then / At that time",
    "ar": "تب",
    "alt": [],
    "cat": "conversational"
  },
  "jab": {
    "ro": "jab",
    "ur": "جب",
    "en": "When / Whenever",
    "ar": "جب",
    "alt": [],
    "cat": "conversational"
  },
  "phir": {
    "ro": "phir",
    "ur": "پھر",
    "en": "Then / Again / Afterward",
    "ar": "پھر",
    "alt": [
      "dobara"
    ],
    "cat": "conversational"
  },
  "fauran": {
    "ro": "fauran",
    "ur": "فوراً",
    "en": "Immediately / At once",
    "ar": "فوراً",
    "alt": [
      "turant"
    ],
    "cat": "conversational"
  },
  "aahista": {
    "ro": "aahista",
    "ur": "آہستہ",
    "en": "Slowly / Gently",
    "ar": "آہستہ",
    "alt": [
      "dhire"
    ],
    "cat": "conversational"
  },
  "jaldi": {
    "ro": "jaldi",
    "ur": "جلدی",
    "en": "Quickly / Soon",
    "ar": "جلدی",
    "alt": [
      "tez"
    ],
    "cat": "conversational"
  },
  "zyada": {
    "ro": "zyada",
    "ur": "زیادہ",
    "en": "More / Excess",
    "ar": "زیادہ",
    "alt": [
      "ziada",
      "bahut"
    ],
    "cat": "conversational"
  },
  "kam": {
    "ro": "kam",
    "ur": "کم",
    "en": "Less / Few / Little",
    "ar": "کم",
    "alt": [
      "thora"
    ],
    "cat": "conversational"
  },
  "bahut": {
    "ro": "bahut",
    "ur": "بہت",
    "en": "Very / Much / Many",
    "ar": "بہت",
    "alt": [
      "bohot",
      "zyada"
    ],
    "cat": "conversational"
  },
  "thora": {
    "ro": "thora",
    "ur": "تھوڑا",
    "en": "A little / Slightly",
    "ar": "تھوڑا",
    "alt": [
      "thoda"
    ],
    "cat": "conversational"
  },
  "bilkul": {
    "ro": "bilkul",
    "ur": "بالکل",
    "en": "Completely / Absolutely",
    "ar": "بالکل",
    "alt": [],
    "cat": "conversational"
  },
  "shayad": {
    "ro": "shayad",
    "ur": "شاید",
    "en": "Perhaps / Maybe",
    "ar": "شاید",
    "alt": [
      "ho sakta hai"
    ],
    "cat": "conversational"
  },
  "yaqeenan": {
    "ro": "yaqeenan",
    "ur": "یقیناً",
    "en": "In/With indeed / truly",
    "ar": "یقیناً",
    "alt": [
      "beshak"
    ],
    "cat": "conversational"
  },
  "zaroor": {
    "ro": "zaroor",
    "ur": "ضرور",
    "en": "Definitely / By all means",
    "ar": "ضرور",
    "alt": [
      "lazmi"
    ],
    "cat": "conversational"
  },
  "hai": {
    "ro": "hai",
    "ur": "ہے",
    "en": "Is / Exists (singular)",
    "ar": "ہے",
    "alt": [],
    "cat": "conversational"
  },
  "hain": {
    "ro": "hain",
    "ur": "ہیں",
    "en": "Are (plural / honorific)",
    "ar": "ہیں",
    "alt": [],
    "cat": "conversational"
  },
  "tha": {
    "ro": "tha",
    "ur": "تھا",
    "en": "To be / exist / happen",
    "ar": "تھا",
    "alt": [],
    "cat": "conversational"
  },
  "thi": {
    "ro": "thi",
    "ur": "تھی",
    "en": "Was (feminine)",
    "ar": "تھی",
    "alt": [],
    "cat": "conversational"
  },
  "the": {
    "ro": "the",
    "ur": "تھے",
    "en": "Were (plural)",
    "ar": "تھے",
    "alt": [],
    "cat": "conversational"
  },
  "hoga": {
    "ro": "hoga",
    "ur": "ہوگا",
    "en": "Will be (masculine)",
    "ar": "ہوگا",
    "alt": [],
    "cat": "conversational"
  },
  "hogi": {
    "ro": "hogi",
    "ur": "ہوگی",
    "en": "Will be (feminine)",
    "ar": "ہوگی",
    "alt": [],
    "cat": "conversational"
  },
  "honge": {
    "ro": "honge",
    "ur": "ہوں گے",
    "en": "Will be (plural)",
    "ar": "ہوں گے",
    "alt": [],
    "cat": "conversational"
  },
  "hona": {
    "ro": "hona",
    "ur": "ہونا",
    "en": "To be / exist / happen",
    "ar": "ہونا",
    "alt": [],
    "cat": "conversational"
  },
  "hota": {
    "ro": "hota",
    "ur": "ہوتا",
    "en": "Happens / Becomes (masculine)",
    "ar": "ہوتا",
    "alt": [],
    "cat": "conversational"
  },
  "hoti": {
    "ro": "hoti",
    "ur": "ہوتی",
    "en": "Happens / Becomes (feminine)",
    "ar": "ہوتی",
    "alt": [],
    "cat": "conversational"
  },
  "hote": {
    "ro": "hote",
    "ur": "ہوتے",
    "en": "Happen / Become (plural)",
    "ar": "ہوتے",
    "alt": [],
    "cat": "conversational"
  },
  "raha": {
    "ro": "raha",
    "ur": "رہا",
    "en": "Progressive aspect (masculine)",
    "ar": "رہا",
    "alt": [],
    "cat": "conversational"
  },
  "rahi": {
    "ro": "rahi",
    "ur": "رہی",
    "en": "Progressive aspect (feminine)",
    "ar": "رہی",
    "alt": [],
    "cat": "conversational"
  },
  "rahe": {
    "ro": "rahe",
    "ur": "رہے",
    "en": "Progressive aspect (plural)",
    "ar": "رہے",
    "alt": [],
    "cat": "conversational"
  },
  "chahiye": {
    "ro": "chahiye",
    "ur": "چاہیے",
    "en": "Should / Ought to / Needed",
    "ar": "چاہیے",
    "alt": [],
    "cat": "conversational"
  },
  "sakta": {
    "ro": "sakta",
    "ur": "سکتا",
    "en": "Can / Able to (masculine)",
    "ar": "سکتا",
    "alt": [],
    "cat": "conversational"
  },
  "sakti": {
    "ro": "sakti",
    "ur": "سکتی",
    "en": "Can / Able to (feminine)",
    "ar": "سکتی",
    "alt": [],
    "cat": "conversational"
  },
  "sakte": {
    "ro": "sakte",
    "ur": "سکتے",
    "en": "Can / Able to (plural)",
    "ar": "سکتے",
    "alt": [],
    "cat": "conversational"
  },
  "karna": {
    "ro": "karna",
    "ur": "کرنا",
    "en": "To do / To perform",
    "ar": "کرنا",
    "alt": [
      "karo",
      "karein",
      "kiya",
      "karta",
      "karti",
      "karte"
    ],
    "cat": "conversational"
  },
  "karo": {
    "ro": "karo",
    "ur": "کرو",
    "en": "Do! (imperative)",
    "ar": "کرو",
    "alt": [],
    "cat": "conversational"
  },
  "karein": {
    "ro": "karein",
    "ur": "کریں",
    "en": "Please do (honorific imperative)",
    "ar": "کریں",
    "alt": [],
    "cat": "conversational"
  },
  "kiya": {
    "ro": "kiya",
    "ur": "کیا",
    "en": "Did / Done",
    "ar": "کیا",
    "alt": [],
    "cat": "conversational"
  },
  "karta": {
    "ro": "karta",
    "ur": "کرتا",
    "en": "Does (masculine)",
    "ar": "کرتا",
    "alt": [],
    "cat": "conversational"
  },
  "karti": {
    "ro": "karti",
    "ur": "کرتی",
    "en": "Does (feminine)",
    "ar": "کرتی",
    "alt": [],
    "cat": "conversational"
  },
  "karte": {
    "ro": "karte",
    "ur": "کرتے",
    "en": "Do (plural)",
    "ar": "کرتے",
    "alt": [],
    "cat": "conversational"
  },
  "kehna": {
    "ro": "kehna",
    "ur": "کہنا",
    "en": "To say / speak / utter",
    "ar": "کہنا",
    "alt": [
      "kaho",
      "kaha",
      "kehta",
      "kehte"
    ],
    "cat": "conversational"
  },
  "kaho": {
    "ro": "kaho",
    "ur": "کہو",
    "en": "Say! (imperative)",
    "ar": "کہو",
    "alt": [
      "bolo"
    ],
    "cat": "conversational"
  },
  "kaha": {
    "ro": "kaha",
    "ur": "کہا",
    "en": "So he said",
    "ar": "کہا",
    "alt": [],
    "cat": "conversational"
  },
  "bolna": {
    "ro": "bolna",
    "ur": "بولنا",
    "en": "To speak / To talk",
    "ar": "بولنا",
    "alt": [
      "bolo",
      "bola",
      "bolte"
    ],
    "cat": "conversational"
  },
  "bolo": {
    "ro": "bolo",
    "ur": "بولو",
    "en": "Speak! (imperative)",
    "ar": "بولو",
    "alt": [],
    "cat": "conversational"
  },
  "bola": {
    "ro": "bola",
    "ur": "بولا",
    "en": "Spoke",
    "ar": "بولا",
    "alt": [],
    "cat": "conversational"
  },
  "sunna": {
    "ro": "sunna",
    "ur": "سننا",
    "en": "To listen / To hear",
    "ar": "سننا",
    "alt": [
      "suno",
      "suna",
      "sunte"
    ],
    "cat": "conversational"
  },
  "suno": {
    "ro": "suno",
    "ur": "سنو",
    "en": "Listen! (imperative)",
    "ar": "سنو",
    "alt": [],
    "cat": "conversational"
  },
  "suna": {
    "ro": "suna",
    "ur": "سنا",
    "en": "Heard",
    "ar": "سنا",
    "alt": [],
    "cat": "conversational"
  },
  "dekhna": {
    "ro": "dekhna",
    "ur": "دیکھنا",
    "en": "To see / To watch / To look",
    "ar": "دیکھنا",
    "alt": [
      "dekho",
      "dekha",
      "dekhte"
    ],
    "cat": "conversational"
  },
  "dekho": {
    "ro": "dekho",
    "ur": "دیکھو",
    "en": "Look! (imperative)",
    "ar": "دیکھو",
    "alt": [],
    "cat": "conversational"
  },
  "dekha": {
    "ro": "dekha",
    "ur": "دیکھا",
    "en": "Saw",
    "ar": "دیکھا",
    "alt": [],
    "cat": "conversational"
  },
  "parhna": {
    "ro": "parhna",
    "ur": "پڑھنا",
    "en": "To read / To recite",
    "ar": "پڑھنا",
    "alt": [
      "padhna",
      "parho",
      "padho",
      "parha",
      "padha"
    ],
    "cat": "conversational"
  },
  "parho": {
    "ro": "parho",
    "ur": "پڑھو",
    "en": "Read! / Recite!",
    "ar": "پڑھو",
    "alt": [
      "padho",
      "iqra"
    ],
    "cat": "conversational"
  },
  "parha": {
    "ro": "parha",
    "ur": "پڑھا",
    "en": "Read (past)",
    "ar": "پڑھا",
    "alt": [
      "padha"
    ],
    "cat": "conversational"
  },
  "likhna": {
    "ro": "likhna",
    "ur": "لکھنا",
    "en": "Writing / Book / To decree",
    "ar": "لکھنا",
    "alt": [
      "likho",
      "likha",
      "likhte"
    ],
    "cat": "conversational"
  },
  "likho": {
    "ro": "likho",
    "ur": "لکھو",
    "en": "Write! (imperative)",
    "ar": "لکھو",
    "alt": [],
    "cat": "conversational"
  },
  "likha": {
    "ro": "likha",
    "ur": "لکھا",
    "en": "Wrote / Written",
    "ar": "لکھا",
    "alt": [],
    "cat": "conversational"
  },
  "samajhna": {
    "ro": "samajhna",
    "ur": "سمجھنا",
    "en": "To understand / To comprehend",
    "ar": "سمجھنا",
    "alt": [
      "samjho",
      "samjha",
      "samajhte"
    ],
    "cat": "conversational"
  },
  "samjho": {
    "ro": "samjho",
    "ur": "سمجھو",
    "en": "Understand! (imperative)",
    "ar": "سمجھو",
    "alt": [],
    "cat": "conversational"
  },
  "samjha": {
    "ro": "samjha",
    "ur": "سمجھا",
    "en": "Understood",
    "ar": "سمجھا",
    "alt": [],
    "cat": "conversational"
  },
  "jaana": {
    "ro": "jaana",
    "ur": "جانا",
    "en": "To go",
    "ar": "جانا",
    "alt": [
      "jao",
      "gaya",
      "gayi",
      "gaye"
    ],
    "cat": "conversational"
  },
  "jao": {
    "ro": "jao",
    "ur": "جاؤ",
    "en": "Go! (imperative)",
    "ar": "جاؤ",
    "alt": [],
    "cat": "conversational"
  },
  "gaya": {
    "ro": "gaya",
    "ur": "گیا",
    "en": "Went (masculine)",
    "ar": "گیا",
    "alt": [],
    "cat": "conversational"
  },
  "gayi": {
    "ro": "gayi",
    "ur": "گئی",
    "en": "Went (feminine)",
    "ar": "گئی",
    "alt": [],
    "cat": "conversational"
  },
  "gaye": {
    "ro": "gaye",
    "ur": "گئے",
    "en": "Went (plural)",
    "ar": "گئے",
    "alt": [],
    "cat": "conversational"
  },
  "aana": {
    "ro": "aana",
    "ur": "آنا",
    "en": "To come / bring / grant",
    "ar": "آنا",
    "alt": [
      "aao",
      "aaya",
      "aayi",
      "aaye"
    ],
    "cat": "conversational"
  },
  "aao": {
    "ro": "aao",
    "ur": "آؤ",
    "en": "Come! (imperative)",
    "ar": "آؤ",
    "alt": [],
    "cat": "conversational"
  },
  "aaya": {
    "ro": "aaya",
    "ur": "آیا",
    "en": "Came (masculine)",
    "ar": "آیا",
    "alt": [],
    "cat": "conversational"
  },
  "aayi": {
    "ro": "aayi",
    "ur": "آئی",
    "en": "Came (feminine)",
    "ar": "آئی",
    "alt": [],
    "cat": "conversational"
  },
  "aaye": {
    "ro": "aaye",
    "ur": "آئے",
    "en": "Came (plural)",
    "ar": "آئے",
    "alt": [],
    "cat": "conversational"
  },
  "dena": {
    "ro": "dena",
    "ur": "دینا",
    "en": "To give / To bestow",
    "ar": "دینا",
    "alt": [
      "do",
      "diya",
      "dein"
    ],
    "cat": "conversational"
  },
  "do": {
    "ro": "do",
    "ur": "دو",
    "en": "Give! (imperative)",
    "ar": "دو",
    "alt": [
      "two",
      "isnan"
    ],
    "cat": "conversational"
  },
  "diya": {
    "ro": "diya",
    "ur": "دیا",
    "en": "Gave",
    "ar": "دیا",
    "alt": [],
    "cat": "conversational"
  },
  "lena": {
    "ro": "lena",
    "ur": "لینا",
    "en": "To take / To receive",
    "ar": "لینا",
    "alt": [
      "lo",
      "liya",
      "lein"
    ],
    "cat": "conversational"
  },
  "lo": {
    "ro": "lo",
    "ur": "لو",
    "en": "Take! (imperative)",
    "ar": "لو",
    "alt": [],
    "cat": "conversational"
  },
  "liya": {
    "ro": "liya",
    "ur": "لیا",
    "en": "Took",
    "ar": "لیا",
    "alt": [],
    "cat": "conversational"
  },
  "khana": {
    "ro": "khana",
    "ur": "کھانا",
    "en": "To eat / Food",
    "ar": "کھانا",
    "alt": [
      "khao",
      "khaya"
    ],
    "cat": "conversational"
  },
  "peena": {
    "ro": "peena",
    "ur": "پینا",
    "en": "To drink",
    "ar": "پینا",
    "alt": [
      "piyo",
      "piya"
    ],
    "cat": "conversational"
  },
  "sona": {
    "ro": "sona",
    "ur": "سونا",
    "en": "To sleep / Gold",
    "ar": "سونا",
    "alt": [
      "so",
      "soya"
    ],
    "cat": "conversational"
  },
  "uthna": {
    "ro": "uthna",
    "ur": "اٹھنا",
    "en": "To rise / To get up",
    "ar": "اٹھنا",
    "alt": [
      "utho",
      "utha"
    ],
    "cat": "conversational"
  },
  "baithna": {
    "ro": "baithna",
    "ur": "بیٹھنا",
    "en": "To sit",
    "ar": "بیٹھنا",
    "alt": [
      "baitho",
      "baitha"
    ],
    "cat": "conversational"
  },
  "chalna": {
    "ro": "chalna",
    "ur": "چلنا",
    "en": "To walk / To move",
    "ar": "چلنا",
    "alt": [
      "chalo",
      "chala"
    ],
    "cat": "conversational"
  },
  "rukna": {
    "ro": "rukna",
    "ur": "رکنا",
    "en": "To stop / To pause",
    "ar": "رکنا",
    "alt": [
      "ruko",
      "ruka"
    ],
    "cat": "conversational"
  },
  "sochna": {
    "ro": "sochna",
    "ur": "سوچنا",
    "en": "To contemplate / To think",
    "ar": "سوچنا",
    "alt": [
      "socho",
      "socha"
    ],
    "cat": "conversational"
  },
  "chahna": {
    "ro": "chahna",
    "ur": "چاہنا",
    "en": "To want / To desire",
    "ar": "چاہنا",
    "alt": [
      "chaho",
      "chaha"
    ],
    "cat": "conversational"
  },
  "puchna": {
    "ro": "puchna",
    "ur": "پوچھنا",
    "en": "To inquire / To ask",
    "ar": "پوچھنا",
    "alt": [
      "pucho",
      "pucha"
    ],
    "cat": "conversational"
  },
  "batana": {
    "ro": "batana",
    "ur": "بتانا",
    "en": "To explain / To tell",
    "ar": "بتانا",
    "alt": [
      "batao",
      "bataya"
    ],
    "cat": "conversational"
  },
  "seekhna": {
    "ro": "seekhna",
    "ur": "سیکھنا",
    "en": "To learn",
    "ar": "سیکھنا",
    "alt": [
      "seekho",
      "seekha"
    ],
    "cat": "conversational"
  },
  "sikhana": {
    "ro": "sikhana",
    "ur": "سکھانا",
    "en": "To teach",
    "ar": "سکھانا",
    "alt": [
      "sikhao",
      "sikhaya"
    ],
    "cat": "conversational"
  },
  "mangna": {
    "ro": "mangna",
    "ur": "مانگنا",
    "en": "To beg / To request / To supplicate",
    "ar": "مانگنا",
    "alt": [
      "mango",
      "manga"
    ],
    "cat": "conversational"
  },
  "bhejna": {
    "ro": "bhejna",
    "ur": "بھیجنا",
    "en": "To send / Messenger / Message",
    "ar": "بھیجنا",
    "alt": [
      "bhejo",
      "bheja"
    ],
    "cat": "conversational"
  },
  "milna": {
    "ro": "milna",
    "ur": "ملنا",
    "en": "To meet / To be found",
    "ar": "ملنا",
    "alt": [
      "milo",
      "mila"
    ],
    "cat": "conversational"
  },
  "chorna": {
    "ro": "chorna",
    "ur": "چھوڑنا",
    "en": "To leave / To abandon",
    "ar": "چھوڑنا",
    "alt": [
      "choro",
      "chora"
    ],
    "cat": "conversational"
  },
  "pakarna": {
    "ro": "pakarna",
    "ur": "پکڑنا",
    "en": "To hold / To grasp / To catch",
    "ar": "پکڑنا",
    "alt": [
      "pakro",
      "pakra"
    ],
    "cat": "conversational"
  },
  "bachana": {
    "ro": "bachana",
    "ur": "بچانا",
    "en": "To save / To protect / To rescue",
    "ar": "بچانا",
    "alt": [
      "bachao",
      "bachaya"
    ],
    "cat": "conversational"
  },
  "ek": {
    "ro": "ek",
    "ur": "ایک",
    "en": "One",
    "ar": "ایک",
    "alt": [
      "one",
      "wahid"
    ],
    "cat": "conversational"
  },
  "teen": {
    "ro": "teen",
    "ur": "تین",
    "en": "Three",
    "ar": "تین",
    "alt": [
      "three",
      "salas"
    ],
    "cat": "conversational"
  },
  "chaar": {
    "ro": "chaar",
    "ur": "چار",
    "en": "Four",
    "ar": "چار",
    "alt": [
      "four",
      "arba"
    ],
    "cat": "conversational"
  },
  "paanch": {
    "ro": "paanch",
    "ur": "پانچ",
    "en": "Five",
    "ar": "پانچ",
    "alt": [
      "five",
      "khams"
    ],
    "cat": "conversational"
  },
  "che": {
    "ro": "che",
    "ur": "چھ",
    "en": "Six",
    "ar": "چھ",
    "alt": [
      "six",
      "sitt"
    ],
    "cat": "conversational"
  },
  "saat": {
    "ro": "saat",
    "ur": "سات",
    "en": "Seven",
    "ar": "سات",
    "alt": [
      "seven",
      "sab"
    ],
    "cat": "conversational"
  },
  "aath": {
    "ro": "aath",
    "ur": "آٹھ",
    "en": "Eight",
    "ar": "آٹھ",
    "alt": [
      "eight",
      "samani"
    ],
    "cat": "conversational"
  },
  "nau": {
    "ro": "nau",
    "ur": "نو",
    "en": "Nine",
    "ar": "نو",
    "alt": [
      "nine",
      "tis"
    ],
    "cat": "conversational"
  },
  "das": {
    "ro": "das",
    "ur": "دس",
    "en": "Ten",
    "ar": "دس",
    "alt": [
      "ten",
      "ashar"
    ],
    "cat": "conversational"
  },
  "gyarah": {
    "ro": "gyarah",
    "ur": "گیارہ",
    "en": "Eleven",
    "ar": "گیارہ",
    "alt": [],
    "cat": "conversational"
  },
  "barah": {
    "ro": "barah",
    "ur": "بارہ",
    "en": "Twelve",
    "ar": "بارہ",
    "alt": [],
    "cat": "conversational"
  },
  "terah": {
    "ro": "terah",
    "ur": "تیرہ",
    "en": "Thirteen",
    "ar": "تیرہ",
    "alt": [],
    "cat": "conversational"
  },
  "chaudah": {
    "ro": "chaudah",
    "ur": "چودہ",
    "en": "Fourteen",
    "ar": "چودہ",
    "alt": [],
    "cat": "conversational"
  },
  "pandrah": {
    "ro": "pandrah",
    "ur": "پندرہ",
    "en": "Fifteen",
    "ar": "پندرہ",
    "alt": [],
    "cat": "conversational"
  },
  "solah": {
    "ro": "solah",
    "ur": "سولہ",
    "en": "Sixteen",
    "ar": "سولہ",
    "alt": [],
    "cat": "conversational"
  },
  "satrah": {
    "ro": "satrah",
    "ur": "سترہ",
    "en": "Seventeen",
    "ar": "سترہ",
    "alt": [],
    "cat": "conversational"
  },
  "atharah": {
    "ro": "atharah",
    "ur": "اٹھارہ",
    "en": "Eighteen",
    "ar": "اٹھارہ",
    "alt": [],
    "cat": "conversational"
  },
  "unnees": {
    "ro": "unnees",
    "ur": "انیس",
    "en": "Nineteen",
    "ar": "انیس",
    "alt": [],
    "cat": "conversational"
  },
  "bees": {
    "ro": "bees",
    "ur": "بیس",
    "en": "Twenty",
    "ar": "بیس",
    "alt": [
      "ishreen"
    ],
    "cat": "conversational"
  },
  "tees": {
    "ro": "tees",
    "ur": "تیس",
    "en": "Thirty",
    "ar": "تیس",
    "alt": [
      "salaseen"
    ],
    "cat": "conversational"
  },
  "chalees": {
    "ro": "chalees",
    "ur": "چالیس",
    "en": "Forty",
    "ar": "چالیس",
    "alt": [
      "arbaeen"
    ],
    "cat": "conversational"
  },
  "pachas": {
    "ro": "pachas",
    "ur": "پچاس",
    "en": "Fifty",
    "ar": "پچاس",
    "alt": [
      "khamseen"
    ],
    "cat": "conversational"
  },
  "sattar": {
    "ro": "sattar",
    "ur": "ستر",
    "en": "Seventy",
    "ar": "ستر",
    "alt": [
      "sabeen"
    ],
    "cat": "conversational"
  },
  "assi": {
    "ro": "assi",
    "ur": "اسی",
    "en": "Eighty",
    "ar": "اسی",
    "alt": [
      "samaneen"
    ],
    "cat": "conversational"
  },
  "nabbay": {
    "ro": "nabbay",
    "ur": "نوے",
    "en": "Ninety",
    "ar": "نوے",
    "alt": [
      "tiseen"
    ],
    "cat": "conversational"
  },
  "sau": {
    "ro": "sau",
    "ur": "سو",
    "en": "Hundred",
    "ar": "سو",
    "alt": [
      "miya"
    ],
    "cat": "conversational"
  },
  "hazar": {
    "ro": "hazar",
    "ur": "ہزار",
    "en": "Thousand",
    "ar": "ہزار",
    "alt": [
      "alf"
    ],
    "cat": "conversational"
  },
  "laakh": {
    "ro": "laakh",
    "ur": "لاکھ",
    "en": "Hundred Thousand",
    "ar": "لاکھ",
    "alt": [],
    "cat": "conversational"
  },
  "karor": {
    "ro": "karor",
    "ur": "کروڑ",
    "en": "Ten Million",
    "ar": "کروڑ",
    "alt": [],
    "cat": "conversational"
  },
  "ammi": {
    "ro": "ammi",
    "ur": "امی",
    "en": "Mother / Mom",
    "ar": "امی",
    "alt": [
      "maa",
      "walida"
    ],
    "cat": "conversational"
  },
  "abbu": {
    "ro": "abbu",
    "ur": "ابو",
    "en": "Father / Dad",
    "ar": "ابو",
    "alt": [
      "baap",
      "walid"
    ],
    "cat": "conversational"
  },
  "maa": {
    "ro": "maa",
    "ur": "ماں",
    "en": "Mother",
    "ar": "ماں",
    "alt": [
      "ammi",
      "walida"
    ],
    "cat": "conversational"
  },
  "baap": {
    "ro": "baap",
    "ur": "باپ",
    "en": "Father",
    "ar": "باپ",
    "alt": [
      "abbu",
      "walid"
    ],
    "cat": "conversational"
  },
  "bhai": {
    "ro": "bhai",
    "ur": "بھائی",
    "en": "Brother",
    "ar": "بھائی",
    "alt": [
      "biradar"
    ],
    "cat": "conversational"
  },
  "behan": {
    "ro": "behan",
    "ur": "بہن",
    "en": "Sister",
    "ar": "بہن",
    "alt": [
      "baji",
      "aapi"
    ],
    "cat": "conversational"
  },
  "beta": {
    "ro": "beta",
    "ur": "بیٹا",
    "en": "Son",
    "ar": "بیٹا",
    "alt": [
      "farzand",
      "ibn"
    ],
    "cat": "conversational"
  },
  "beti": {
    "ro": "beti",
    "ur": "بیٹی",
    "en": "Daughter",
    "ar": "بیٹی",
    "alt": [
      "bint",
      "dukhtar"
    ],
    "cat": "conversational"
  },
  "dada": {
    "ro": "dada",
    "ur": "دادا",
    "en": "Paternal Grandfather",
    "ar": "دادا",
    "alt": [],
    "cat": "conversational"
  },
  "dadi": {
    "ro": "dadi",
    "ur": "دادی",
    "en": "Paternal Grandmother",
    "ar": "دادی",
    "alt": [],
    "cat": "conversational"
  },
  "nana": {
    "ro": "nana",
    "ur": "نانا",
    "en": "Maternal Grandfather",
    "ar": "نانا",
    "alt": [],
    "cat": "conversational"
  },
  "nani": {
    "ro": "nani",
    "ur": "نانی",
    "en": "Maternal Grandmother",
    "ar": "نانی",
    "alt": [],
    "cat": "conversational"
  },
  "chacha": {
    "ro": "chacha",
    "ur": "چچا",
    "en": "Paternal Uncle",
    "ar": "چچا",
    "alt": [],
    "cat": "conversational"
  },
  "khala": {
    "ro": "khala",
    "ur": "خالہ",
    "en": "Maternal Aunt",
    "ar": "خالہ",
    "alt": [],
    "cat": "conversational"
  },
  "muma": {
    "ro": "muma",
    "ur": "ماموں",
    "en": "Maternal Uncle",
    "ar": "ماموں",
    "alt": [
      "mamoon"
    ],
    "cat": "conversational"
  },
  "phuppi": {
    "ro": "phuppi",
    "ur": "پھوپھی",
    "en": "Paternal Aunt",
    "ar": "پھوپھی",
    "alt": [],
    "cat": "conversational"
  },
  "shohar": {
    "ro": "shohar",
    "ur": "شوہر",
    "en": "Husband / Spouse",
    "ar": "شوہر",
    "alt": [
      "miyan"
    ],
    "cat": "conversational"
  },
  "biwi": {
    "ro": "biwi",
    "ur": "بیوی",
    "en": "Wife / Spouse",
    "ar": "بیوی",
    "alt": [
      "zauja",
      "begum"
    ],
    "cat": "conversational"
  },
  "bacha": {
    "ro": "bacha",
    "ur": "بچہ",
    "en": "Child / Baby",
    "ar": "بچہ",
    "alt": [
      "tifl",
      "kudak"
    ],
    "cat": "conversational"
  },
  "bachay": {
    "ro": "bachay",
    "ur": "بچے",
    "en": "Children",
    "ar": "بچے",
    "alt": [
      "atfal"
    ],
    "cat": "conversational"
  },
  "bachi": {
    "ro": "bachi",
    "ur": "بچی",
    "en": "Baby girl / Young daughter",
    "ar": "بچی",
    "alt": [],
    "cat": "conversational"
  },
  "khandan": {
    "ro": "khandan",
    "ur": "خاندان",
    "en": "Family / Household",
    "ar": "خاندان",
    "alt": [
      "ahl-e-khana",
      "tabar"
    ],
    "cat": "conversational"
  },
  "rishtedar": {
    "ro": "rishtedar",
    "ur": "رشتہ دار",
    "en": "Relatives / Kin",
    "ar": "رشتہ دار",
    "alt": [
      "aqriba"
    ],
    "cat": "conversational"
  },
  "aasman": {
    "ro": "aasman",
    "ur": "آسمان",
    "en": "Sky / Heaven / Elevation",
    "ar": "سماء",
    "alt": [
      "sky",
      "falak"
    ],
    "cat": "conversational"
  },
  "zameen": {
    "ro": "zameen",
    "ur": "زمین",
    "en": "Earth / Land / Ground",
    "ar": "أرض",
    "alt": [
      "dharti",
      "ard"
    ],
    "cat": "conversational"
  },
  "suraj": {
    "ro": "suraj",
    "ur": "سورج",
    "en": "Sun",
    "ar": "شمس",
    "alt": [
      "aftab",
      "shams"
    ],
    "cat": "conversational"
  },
  "chand": {
    "ro": "chand",
    "ur": "چاند",
    "en": "Moon",
    "ar": "قمر",
    "alt": [
      "qamar",
      "mahtab"
    ],
    "cat": "conversational"
  },
  "sitare": {
    "ro": "sitare",
    "ur": "ستارے",
    "en": "Stars",
    "ar": "نجوم",
    "alt": [
      "najam",
      "sitara"
    ],
    "cat": "conversational"
  },
  "hawa": {
    "ro": "hawa",
    "ur": "ہوا",
    "en": "Air / Wind",
    "ar": "ريح",
    "alt": [
      "wind",
      "breeze"
    ],
    "cat": "conversational"
  },
  "paani": {
    "ro": "paani",
    "ur": "پانی",
    "en": "Water",
    "ar": "ماء",
    "alt": [
      "aab",
      "jal"
    ],
    "cat": "conversational"
  },
  "aag": {
    "ro": "aag",
    "ur": "آگ",
    "en": "The Fire / Hell",
    "ar": "نار",
    "alt": [
      "aatish",
      "nar"
    ],
    "cat": "conversational"
  },
  "mitti": {
    "ro": "mitti",
    "ur": "مٹی",
    "en": "Clay / Soil / Earth",
    "ar": "طين",
    "alt": [
      "teen",
      "khak"
    ],
    "cat": "conversational"
  },
  "pahad": {
    "ro": "pahad",
    "ur": "پہاڑ",
    "en": "Mountain / Peak",
    "ar": "جبل",
    "alt": [
      "jabal",
      "koh"
    ],
    "cat": "conversational"
  },
  "darya": {
    "ro": "darya",
    "ur": "دریا",
    "en": "River",
    "ar": "نهر",
    "alt": [
      "nahr"
    ],
    "cat": "conversational"
  },
  "samandar": {
    "ro": "samandar",
    "ur": "سمندر",
    "en": "Ocean / Sea",
    "ar": "بحر",
    "alt": [
      "bahr"
    ],
    "cat": "conversational"
  },
  "barish": {
    "ro": "barish",
    "ur": "بارش",
    "en": "Rain / Rainfall",
    "ar": "مطر",
    "alt": [
      "barsaat",
      "matar"
    ],
    "cat": "conversational"
  },
  "badal": {
    "ro": "badal",
    "ur": "بادل",
    "en": "Clouds",
    "ar": "سحاب",
    "alt": [
      "abr",
      "sahab"
    ],
    "cat": "conversational"
  },
  "bijli": {
    "ro": "bijli",
    "ur": "بجلی",
    "en": "Lightning / Thunder",
    "ar": "برق",
    "alt": [
      "barq",
      "thunder"
    ],
    "cat": "conversational"
  },
  "raat": {
    "ro": "raat",
    "ur": "رات",
    "en": "Night",
    "ar": "ليل",
    "alt": [
      "layl",
      "shab"
    ],
    "cat": "conversational"
  },
  "din": {
    "ro": "din",
    "ur": "دن",
    "en": "Day / Era / Time",
    "ar": "نهار",
    "alt": [
      "nahar",
      "roz"
    ],
    "cat": "conversational"
  },
  "subah": {
    "ro": "subah",
    "ur": "صبح",
    "en": "Morning",
    "ar": "صباح",
    "alt": [
      "fajr"
    ],
    "cat": "conversational"
  },
  "shaam": {
    "ro": "shaam",
    "ur": "شام",
    "en": "Evening",
    "ar": "مساء",
    "alt": [
      "maghrib"
    ],
    "cat": "conversational"
  },
  "dopahar": {
    "ro": "dopahar",
    "ur": "دوپہر",
    "en": "Noon / Midday",
    "ar": "ظهر",
    "alt": [
      "zuhr"
    ],
    "cat": "conversational"
  },
  "parinda": {
    "ro": "parinda",
    "ur": "پرندہ",
    "en": "Bird",
    "ar": "طير",
    "alt": [
      "tair",
      "panchhi"
    ],
    "cat": "conversational"
  },
  "janwar": {
    "ro": "janwar",
    "ur": "جانور",
    "en": "Animal / Beast",
    "ar": "دابة",
    "alt": [
      "haiwan"
    ],
    "cat": "conversational"
  },
  "darakht": {
    "ro": "darakht",
    "ur": "درخت",
    "en": "Tree",
    "ar": "شجرة",
    "alt": [
      "shajar"
    ],
    "cat": "conversational"
  },
  "phool": {
    "ro": "phool",
    "ur": "پھول",
    "en": "Flower",
    "ar": "زهرة",
    "alt": [
      "gul",
      "zahra"
    ],
    "cat": "conversational"
  },
  "phal": {
    "ro": "phal",
    "ur": "پھل",
    "en": "Fruit",
    "ar": "ثمرة",
    "alt": [
      "samar"
    ],
    "cat": "conversational"
  },
  "patta": {
    "ro": "patta",
    "ur": "پتہ",
    "en": "Leaf",
    "ar": "ورقة",
    "alt": [
      "barg"
    ],
    "cat": "conversational"
  },
  "jungle": {
    "ro": "jungle",
    "ur": "جنگل",
    "en": "Forest / Wilderness",
    "ar": "غابة",
    "alt": [
      "ban"
    ],
    "cat": "conversational"
  },
  "bagh": {
    "ro": "bagh",
    "ur": "باغ",
    "en": "Garden / Orchard",
    "ar": "حديقة",
    "alt": [
      "chaman"
    ],
    "cat": "conversational"
  },
  "sar": {
    "ro": "sar",
    "ur": "سر",
    "en": "Head",
    "ar": "رأس",
    "alt": [
      "sir"
    ],
    "cat": "conversational"
  },
  "aankh": {
    "ro": "aankh",
    "ur": "آنکھ",
    "en": "Eye / Spring of water",
    "ar": "عين",
    "alt": [
      "ayn",
      "nayan"
    ],
    "cat": "conversational"
  },
  "aankhein": {
    "ro": "aankhein",
    "ur": "آنکھیں",
    "en": "Eyes",
    "ar": "أعين",
    "alt": [
      "chashm"
    ],
    "cat": "conversational"
  },
  "kaan": {
    "ro": "kaan",
    "ur": "کان",
    "en": "Ear / Permission / Announcement",
    "ar": "أذن",
    "alt": [
      "uzun"
    ],
    "cat": "conversational"
  },
  "naak": {
    "ro": "naak",
    "ur": "ناک",
    "en": "Nose",
    "ar": "أنف",
    "alt": [
      "anf"
    ],
    "cat": "conversational"
  },
  "munh": {
    "ro": "munh",
    "ur": "منہ",
    "en": "Mouth / Face",
    "ar": "فم",
    "alt": [
      "chehra"
    ],
    "cat": "conversational"
  },
  "hath": {
    "ro": "hath",
    "ur": "ہاتھ",
    "en": "Hand",
    "ar": "يد",
    "alt": [
      "yad",
      "dast"
    ],
    "cat": "conversational"
  },
  "paon": {
    "ro": "paon",
    "ur": "پاؤں",
    "en": "Foot / Leg",
    "ar": "قدم",
    "alt": [
      "qadam",
      "pair"
    ],
    "cat": "conversational"
  },
  "ungli": {
    "ro": "ungli",
    "ur": "انگلی",
    "en": "Finger",
    "ar": "إصبع",
    "alt": [
      "asabi"
    ],
    "cat": "conversational"
  },
  "ungliyan": {
    "ro": "ungliyan",
    "ur": "انگلیاں",
    "en": "Fingers",
    "ar": "أصابع",
    "alt": [],
    "cat": "conversational"
  },
  "zuban": {
    "ro": "zuban",
    "ur": "زبان",
    "en": "Tongue / Language",
    "ar": "لسان",
    "alt": [
      "lisan"
    ],
    "cat": "conversational"
  },
  "gala": {
    "ro": "gala",
    "ur": "گلا",
    "en": "Throat / Neck",
    "ar": "حلق",
    "alt": [
      "halq"
    ],
    "cat": "conversational"
  },
  "seena": {
    "ro": "seena",
    "ur": "سینہ",
    "en": "Chest / Breast / Source",
    "ar": "صدر",
    "alt": [
      "sadr"
    ],
    "cat": "conversational"
  },
  "khoon": {
    "ro": "khoon",
    "ur": "خون",
    "en": "Blood",
    "ar": "دم",
    "alt": [
      "dam",
      "lahu"
    ],
    "cat": "conversational"
  },
  "haddi": {
    "ro": "haddi",
    "ur": "ہڈی",
    "en": "Bone",
    "ar": "عظم",
    "alt": [
      "izm"
    ],
    "cat": "conversational"
  },
  "baal": {
    "ro": "baal",
    "ur": "بال",
    "en": "Hair",
    "ar": "شعر",
    "alt": [
      "gesu"
    ],
    "cat": "conversational"
  },
  "chehra": {
    "ro": "chehra",
    "ur": "چہرہ",
    "en": "Face / Countenance / Direction",
    "ar": "وجه",
    "alt": [
      "wajh",
      "mukh"
    ],
    "cat": "conversational"
  },
  "kandha": {
    "ro": "kandha",
    "ur": "کندھا",
    "en": "Shoulder",
    "ar": "كتف",
    "alt": [
      "kataf"
    ],
    "cat": "conversational"
  },
  "kamar": {
    "ro": "kamar",
    "ur": "کمر",
    "en": "Waist / Lower back",
    "ar": "ظهر",
    "alt": [
      "sulb"
    ],
    "cat": "conversational"
  },
  "pait": {
    "ro": "pait",
    "ur": "پیٹ",
    "en": "Stomach / Belly",
    "ar": "بطن",
    "alt": [
      "batn",
      "shikam"
    ],
    "cat": "conversational"
  },
  "accha": {
    "ro": "accha",
    "ur": "اچھا",
    "en": "Good / Virtuous / Fine",
    "ar": "اچھا",
    "alt": [
      "achha",
      "khub"
    ],
    "cat": "conversational"
  },
  "bura": {
    "ro": "bura",
    "ur": "برا",
    "en": "Evil / Badness / Harm",
    "ar": "برا",
    "alt": [
      "kharab"
    ],
    "cat": "conversational"
  },
  "sahi": {
    "ro": "sahi",
    "ur": "صحیح",
    "en": "Correct / Accurate",
    "ar": "صحیح",
    "alt": [
      "theek"
    ],
    "cat": "conversational"
  },
  "galat": {
    "ro": "galat",
    "ur": "غلط",
    "en": "Wrong / Incorrect",
    "ar": "غلط",
    "alt": [
      "na-durust"
    ],
    "cat": "conversational"
  },
  "chota": {
    "ro": "chota",
    "ur": "چھوٹا",
    "en": "Small / Little",
    "ar": "چھوٹا",
    "alt": [
      "saghir"
    ],
    "cat": "conversational"
  },
  "bada": {
    "ro": "bada",
    "ur": "بڑا",
    "en": "Big / Great / Elder",
    "ar": "بڑا",
    "alt": [
      "bara",
      "kabeer"
    ],
    "cat": "conversational"
  },
  "lamba": {
    "ro": "lamba",
    "ur": "لمبا",
    "en": "Long / Tall",
    "ar": "لمبا",
    "alt": [
      "taweel"
    ],
    "cat": "conversational"
  },
  "naya": {
    "ro": "naya",
    "ur": "نیا",
    "en": "New",
    "ar": "نیا",
    "alt": [
      "jadeed"
    ],
    "cat": "conversational"
  },
  "purana": {
    "ro": "purana",
    "ur": "پرانا",
    "en": "Old / Ancient",
    "ar": "پرانا",
    "alt": [
      "qadeem"
    ],
    "cat": "conversational"
  },
  "saaf": {
    "ro": "saaf",
    "ur": "صاف",
    "en": "Clean / Pure",
    "ar": "صاف",
    "alt": [
      "pak"
    ],
    "cat": "conversational"
  },
  "ganda": {
    "ro": "ganda",
    "ur": "گندا",
    "en": "Dirty / Impure",
    "ar": "گندا",
    "alt": [
      "napaak"
    ],
    "cat": "conversational"
  },
  "aasan": {
    "ro": "aasan",
    "ur": "آسان",
    "en": "Easy / Simple",
    "ar": "آسان",
    "alt": [
      "sahil"
    ],
    "cat": "conversational"
  },
  "mushkil": {
    "ro": "mushkil",
    "ur": "مشکل",
    "en": "Difficult / Hard",
    "ar": "مشکل",
    "alt": [
      "sakht"
    ],
    "cat": "conversational"
  },
  "meetha": {
    "ro": "meetha",
    "ur": "میٹھا",
    "en": "Sweet",
    "ar": "میٹھا",
    "alt": [
      "sheereen"
    ],
    "cat": "conversational"
  },
  "karwa": {
    "ro": "karwa",
    "ur": "کڑوا",
    "en": "Bitter",
    "ar": "کڑوا",
    "alt": [
      "talkh"
    ],
    "cat": "conversational"
  },
  "khatta": {
    "ro": "khatta",
    "ur": "کھٹا",
    "en": "Sour",
    "ar": "کھٹا",
    "alt": [
      "tursh"
    ],
    "cat": "conversational"
  },
  "thanda": {
    "ro": "thanda",
    "ur": "ٹھنڈا",
    "en": "Cold / Cool",
    "ar": "ٹھنڈا",
    "alt": [
      "sard"
    ],
    "cat": "conversational"
  },
  "garm": {
    "ro": "garm",
    "ur": "گرم",
    "en": "Hot / Warm",
    "ar": "گرم",
    "alt": [
      "tapti"
    ],
    "cat": "conversational"
  },
  "khubsurat": {
    "ro": "khubsurat",
    "ur": "خوبصورت",
    "en": "Beautiful / Handsome",
    "ar": "خوبصورت",
    "alt": [
      "haseen"
    ],
    "cat": "conversational"
  },
  "badsoorat": {
    "ro": "badsoorat",
    "ur": "بدصورت",
    "en": "Ugly / Unpleasant",
    "ar": "بدصورت",
    "alt": [
      "qabeeh"
    ],
    "cat": "conversational"
  },
  "hoshiyar": {
    "ro": "hoshiyar",
    "ur": "ہوشیار",
    "en": "Clever / Alert",
    "ar": "ہوشیار",
    "alt": [
      "chalaak"
    ],
    "cat": "conversational"
  },
  "aqalmand": {
    "ro": "aqalmand",
    "ur": "عقلمند",
    "en": "Wise / Intelligent",
    "ar": "عقلمند",
    "alt": [
      "danishmand"
    ],
    "cat": "conversational"
  },
  "be-waqoof": {
    "ro": "be-waqoof",
    "ur": "بے وقوف",
    "en": "Foolish / Ignorant",
    "ar": "بے وقوف",
    "alt": [
      "nadaan"
    ],
    "cat": "conversational"
  },
  "kamzor": {
    "ro": "kamzor",
    "ur": "کمزور",
    "en": "Weak / Feeble",
    "ar": "کمزور",
    "alt": [
      "zaeef"
    ],
    "cat": "conversational"
  },
  "taqatwar": {
    "ro": "taqatwar",
    "ur": "طاقتور",
    "en": "Strong / Powerful",
    "ar": "طاقتور",
    "alt": [
      "qawi"
    ],
    "cat": "conversational"
  },
  "ameer": {
    "ro": "ameer",
    "ur": "امیر",
    "en": "Rich / Wealthy",
    "ar": "امیر",
    "alt": [
      "daulatmand"
    ],
    "cat": "conversational"
  },
  "ghareeb": {
    "ro": "ghareeb",
    "ur": "غریب",
    "en": "Poor / Needy",
    "ar": "غریب",
    "alt": [
      "miskin"
    ],
    "cat": "conversational"
  },
  "pyaara": {
    "ro": "pyaara",
    "ur": "پیارا",
    "en": "Lovely / Dear",
    "ar": "پیارا",
    "alt": [
      "azeez"
    ],
    "cat": "conversational"
  },
  "khushi": {
    "ro": "khushi",
    "ur": "خوشی",
    "en": "Joy / Delight / Exultation",
    "ar": "خوشی",
    "alt": [
      "musarrat",
      "shadi"
    ],
    "cat": "conversational"
  },
  "gham": {
    "ro": "gham",
    "ur": "غم",
    "en": "Grief / Sorrow / Sadness",
    "ar": "غم",
    "alt": [
      "ranj",
      "dukh"
    ],
    "cat": "conversational"
  },
  "dard": {
    "ro": "dard",
    "ur": "درد",
    "en": "Pain / Ache",
    "ar": "درد",
    "alt": [
      "alam",
      "karb"
    ],
    "cat": "conversational"
  },
  "takleef": {
    "ro": "takleef",
    "ur": "تکلیف",
    "en": "Punishment / Torment / Pain",
    "ar": "تکلیف",
    "alt": [
      "musibat"
    ],
    "cat": "conversational"
  },
  "aaram": {
    "ro": "aaram",
    "ur": "آرام",
    "en": "Comfort / Rest",
    "ar": "آرام",
    "alt": [
      "rahat"
    ],
    "cat": "conversational"
  },
  "sukoon": {
    "ro": "sukoon",
    "ur": "سکون",
    "en": "Tranquility / Peace of Mind",
    "ar": "سکون",
    "alt": [
      "itminan",
      "chain"
    ],
    "cat": "conversational"
  },
  "umeed": {
    "ro": "umeed",
    "ur": "امید",
    "en": "Hope / Expectation",
    "ar": "امید",
    "alt": [
      "aas",
      "raja"
    ],
    "cat": "conversational"
  },
  "khauf": {
    "ro": "khauf",
    "ur": "خوف",
    "en": "Fear / Dread / Awe",
    "ar": "خوف",
    "alt": [
      "dar",
      "dahshat"
    ],
    "cat": "conversational"
  },
  "dar": {
    "ro": "dar",
    "ur": "ڈر",
    "en": "Fear / Fright",
    "ar": "ڈر",
    "alt": [
      "khauf"
    ],
    "cat": "conversational"
  },
  "ghussa": {
    "ro": "ghussa",
    "ur": "غصہ",
    "en": "Anger / Wrath",
    "ar": "غصہ",
    "alt": [
      "ghez",
      "krodh"
    ],
    "cat": "conversational"
  },
  "rona": {
    "ro": "rona",
    "ur": "رونا",
    "en": "Crying / Weeping",
    "ar": "رونا",
    "alt": [
      "buka",
      "aanso"
    ],
    "cat": "conversational"
  },
  "hansna": {
    "ro": "hansna",
    "ur": "ہنسنا",
    "en": "Laughing / Smiling",
    "ar": "ہنسنا",
    "alt": [
      "muskurana",
      "tabassum"
    ],
    "cat": "conversational"
  },
  "sharmindagi": {
    "ro": "sharmindagi",
    "ur": "شرمندگی",
    "en": "Embarrassment / Remorse",
    "ar": "شرمندگی",
    "alt": [
      "nadamat"
    ],
    "cat": "conversational"
  },
  "pachtawa": {
    "ro": "pachtawa",
    "ur": "پچھتاوا",
    "en": "Regret / Repentance",
    "ar": "پچھتاوا",
    "alt": [
      "afsos"
    ],
    "cat": "conversational"
  },
  "musa": {
    "ro": "musa",
    "ur": "موسى",
    "en": "Prophet Musa",
    "ar": "موسى",
    "alt": [],
    "cat": "prophet"
  },
  "ibrahim": {
    "ro": "ibrahim",
    "ur": "إبراهيم",
    "en": "Surah Ibrahim ()",
    "ar": "إبراهيم",
    "alt": [],
    "cat": "prophet"
  },
  "nuh": {
    "ro": "nuh",
    "ur": "نوح",
    "en": "Surah Nuh ()",
    "ar": "نوح",
    "alt": [],
    "cat": "prophet"
  },
  "yusuf": {
    "ro": "yusuf",
    "ur": "يوسف",
    "en": "Surah Yusuf ()",
    "ar": "يوسف",
    "alt": [],
    "cat": "prophet"
  },
  "lut": {
    "ro": "lut",
    "ur": "لوط",
    "en": "Prophet Lut",
    "ar": "لوط",
    "alt": [],
    "cat": "prophet"
  },
  "adam": {
    "ro": "adam",
    "ur": "آدم",
    "en": "Prophet Adam",
    "ar": "آدم",
    "alt": [],
    "cat": "prophet"
  },
  "'isa": {
    "ro": "'isa",
    "ur": "عيسى",
    "en": "Prophet 'Isa",
    "ar": "عيسى",
    "alt": [],
    "cat": "prophet"
  },
  "harun": {
    "ro": "harun",
    "ur": "هارون",
    "en": "Prophet Harun",
    "ar": "هارون",
    "alt": [],
    "cat": "prophet"
  },
  "ishaq": {
    "ro": "ishaq",
    "ur": "إسحاق",
    "en": "Prophet Ishaq",
    "ar": "إسحاق",
    "alt": [],
    "cat": "prophet"
  },
  "sulayman": {
    "ro": "sulayman",
    "ur": "سليمان",
    "en": "Prophet Sulayman",
    "ar": "سليمان",
    "alt": [],
    "cat": "prophet"
  },
  "ya'qub": {
    "ro": "ya'qub",
    "ur": "يعقوب",
    "en": "Prophet Ya'qub",
    "ar": "يعقوب",
    "alt": [],
    "cat": "prophet"
  },
  "dawud": {
    "ro": "dawud",
    "ur": "داوود",
    "en": "Prophet Dawud",
    "ar": "داوود",
    "alt": [],
    "cat": "prophet"
  },
  "isma'il": {
    "ro": "isma'il",
    "ur": "إسماعيل",
    "en": "Prophet Isma'il",
    "ar": "إسماعيل",
    "alt": [],
    "cat": "prophet"
  },
  "shu'ayb": {
    "ro": "shu'ayb",
    "ur": "شعيب",
    "en": "Prophet Shu'ayb",
    "ar": "شعيب",
    "alt": [],
    "cat": "prophet"
  },
  "salih": {
    "ro": "salih",
    "ur": "صالح",
    "en": "Prophet Salih",
    "ar": "صالح",
    "alt": [],
    "cat": "prophet"
  },
  "zakariyya": {
    "ro": "zakariyya",
    "ur": "زكريا",
    "en": "Prophet Zakariyya",
    "ar": "زكريا",
    "alt": [],
    "cat": "prophet"
  },
  "hud": {
    "ro": "hud",
    "ur": "هود",
    "en": "Surah Hud ()",
    "ar": "هود",
    "alt": [],
    "cat": "prophet"
  },
  "yahya": {
    "ro": "yahya",
    "ur": "يحيى",
    "en": "Prophet Yahya",
    "ar": "يحيى",
    "alt": [],
    "cat": "prophet"
  },
  "muhammad": {
    "ro": "muhammad",
    "ur": "محمد",
    "en": "Surah Muhammad ()",
    "ar": "محمد",
    "alt": [],
    "cat": "prophet"
  },
  "ayyub": {
    "ro": "ayyub",
    "ur": "أيوب",
    "en": "Prophet Ayyub",
    "ar": "أيوب",
    "alt": [],
    "cat": "prophet"
  },
  "yunus": {
    "ro": "yunus",
    "ur": "يونس",
    "en": "Surah Yunus ()",
    "ar": "يونس",
    "alt": [],
    "cat": "prophet"
  },
  "ilyas": {
    "ro": "ilyas",
    "ur": "إلياس",
    "en": "Prophet Ilyas",
    "ar": "إلياس",
    "alt": [],
    "cat": "prophet"
  },
  "idris": {
    "ro": "idris",
    "ur": "إدريس",
    "en": "Prophet Idris",
    "ar": "إدريس",
    "alt": [],
    "cat": "prophet"
  },
  "al-yasa'": {
    "ro": "al-yasa'",
    "ur": "اليسع",
    "en": "Prophet Al-Yasa'",
    "ar": "اليسع",
    "alt": [],
    "cat": "prophet"
  },
  "dhul-kifl": {
    "ro": "dhul-kifl",
    "ur": "ذو الكفل",
    "en": "Prophet Dhul-Kifl",
    "ar": "ذو الكفل",
    "alt": [],
    "cat": "prophet"
  },
  "ahmad": {
    "ro": "ahmad",
    "ur": "أحمد",
    "en": "Prophet Ahmad",
    "ar": "أحمد",
    "alt": [],
    "cat": "prophet"
  },
  "al-masjid al-haram": {
    "ro": "al-masjid al-haram",
    "ur": "المسجد الحرام",
    "en": "Sacred Place Al-Masjid al-Haram",
    "ar": "المسجد الحرام",
    "alt": [],
    "cat": "place"
  },
  "al-madinah": {
    "ro": "al-madinah",
    "ur": "المدينة",
    "en": "Sacred Place Al-Madinah",
    "ar": "المدينة",
    "alt": [],
    "cat": "place"
  },
  "misr (egypt)": {
    "ro": "misr (egypt)",
    "ur": "مصر",
    "en": "Sacred Place Misr (Egypt)",
    "ar": "مصر",
    "alt": [],
    "cat": "place"
  },
  "tur sina / mount sinai": {
    "ro": "tur sina / mount sinai",
    "ur": "طور سيناء",
    "en": "Sacred Place Tur Sina / Mount Sinai",
    "ar": "طور سيناء",
    "alt": [],
    "cat": "place"
  },
  "saba' (sheba)": {
    "ro": "saba' (sheba)",
    "ur": "سبأ",
    "en": "Sacred Place Saba' (Sheba)",
    "ar": "سبأ",
    "alt": [],
    "cat": "place"
  },
  "sacred valley tuwa": {
    "ro": "sacred valley tuwa",
    "ur": "طوى",
    "en": "Sacred Place Sacred Valley Tuwa",
    "ar": "طوى",
    "alt": [],
    "cat": "place"
  },
  "al-safa & al-marwah": {
    "ro": "al-safa & al-marwah",
    "ur": "الصفا والمروة",
    "en": "Sacred Place Al-Safa & Al-Marwah",
    "ar": "الصفا والمروة",
    "alt": [],
    "cat": "place"
  },
  "bakkah": {
    "ro": "bakkah",
    "ur": "بكة",
    "en": "Sacred Place Bakkah",
    "ar": "بكة",
    "alt": [],
    "cat": "place"
  },
  "yathrib": {
    "ro": "yathrib",
    "ur": "يثرب",
    "en": "Sacred Place Yathrib",
    "ar": "يثرب",
    "alt": [],
    "cat": "place"
  },
  "babil (babylon)": {
    "ro": "babil (babylon)",
    "ur": "بابل",
    "en": "Sacred Place Babil (Babylon)",
    "ar": "بابل",
    "alt": [],
    "cat": "place"
  },
  "iram (pillars)": {
    "ro": "iram (pillars)",
    "ur": "إرم",
    "en": "Sacred Place Iram (Pillars)",
    "ar": "إرم",
    "alt": [],
    "cat": "place"
  },
  "al-ahqaf (sand dunes)": {
    "ro": "al-ahqaf (sand dunes)",
    "ur": "الأحقاف",
    "en": "Sacred Place Al-Ahqaf (Sand Dunes)",
    "ar": "الأحقاف",
    "alt": [],
    "cat": "place"
  },
  "mount judi": {
    "ro": "mount judi",
    "ur": "الجودي",
    "en": "Sacred Place Mount Judi",
    "ar": "الجودي",
    "alt": [],
    "cat": "place"
  },
  "badr": {
    "ro": "badr",
    "ur": "بدر",
    "en": "Sacred Place Badr",
    "ar": "بدر",
    "alt": [],
    "cat": "place"
  },
  "hunayn": {
    "ro": "hunayn",
    "ur": "حنين",
    "en": "Sacred Place Hunayn",
    "ar": "حنين",
    "alt": [],
    "cat": "place"
  },
  "al-masjid al-aqsa": {
    "ro": "al-masjid al-aqsa",
    "ur": "المسجد الأقصى",
    "en": "Sacred Place Al-Masjid al-Aqsa",
    "ar": "المسجد الأقصى",
    "alt": [],
    "cat": "place"
  },
  "bani isra'il (children of israel)": {
    "ro": "bani isra'il (children of israel)",
    "ur": "بنو إسرائيل",
    "en": "Nation Bani Isra'il (Children of Israel)",
    "ar": "بنو إسرائيل",
    "alt": [],
    "cat": "nation"
  },
  "thamud (people of salih)": {
    "ro": "thamud (people of salih)",
    "ur": "ثمود",
    "en": "Nation Thamud (People of Salih)",
    "ar": "ثمود",
    "alt": [],
    "cat": "nation"
  },
  "'ad (people of hud)": {
    "ro": "'ad (people of hud)",
    "ur": "عاد",
    "en": "Nation 'Ad (People of Hud)",
    "ar": "عاد",
    "alt": [],
    "cat": "nation"
  },
  "madyan (people of shu'ayb)": {
    "ro": "madyan (people of shu'ayb)",
    "ur": "مدين",
    "en": "Nation Madyan (People of Shu'ayb)",
    "ar": "مدين",
    "alt": [],
    "cat": "nation"
  },
  "ashab al-ayka (dwellers of the wood)": {
    "ro": "ashab al-ayka (dwellers of the wood)",
    "ur": "أصحاب الأيكة",
    "en": "Nation Ashab al-Ayka (Dwellers of the Wood)",
    "ar": "أصحاب الأيكة",
    "alt": [],
    "cat": "nation"
  },
  "yajuj & majuj (gog & magog)": {
    "ro": "yajuj & majuj (gog & magog)",
    "ur": "يأجوج ومأجوج",
    "en": "Nation Yajuj & Majuj (Gog & Magog)",
    "ar": "يأجوج ومأجوج",
    "alt": [],
    "cat": "nation"
  },
  "ashab al-rass": {
    "ro": "ashab al-rass",
    "ur": "أصحاب الرس",
    "en": "Nation Ashab al-Rass",
    "ar": "أصحاب الرس",
    "alt": [],
    "cat": "nation"
  },
  "qawm tubba'": {
    "ro": "qawm tubba'",
    "ur": "قوم تبع",
    "en": "Nation Qawm Tubba'",
    "ar": "قوم تبع",
    "alt": [],
    "cat": "nation"
  },
  "al-rum (byzantines)": {
    "ro": "al-rum (byzantines)",
    "ur": "الروم",
    "en": "Nation Al-Rum (Byzantines)",
    "ar": "الروم",
    "alt": [],
    "cat": "nation"
  },
  "ashab al-kahf (people of the cave)": {
    "ro": "ashab al-kahf (people of the cave)",
    "ur": "أصحاب الكهف",
    "en": "Nation Ashab al-Kahf (People of the Cave)",
    "ar": "أصحاب الكهف",
    "alt": [],
    "cat": "nation"
  },
  "ashab al-ukhdud (people of the ditch)": {
    "ro": "ashab al-ukhdud (people of the ditch)",
    "ur": "أصحاب الأخدود",
    "en": "Nation Ashab al-Ukhdud (People of the Ditch)",
    "ar": "أصحاب الأخدود",
    "alt": [],
    "cat": "nation"
  },
  "fir'awn (pharaoh)": {
    "ro": "fir'awn (pharaoh)",
    "ur": "فرعون",
    "en": "Quranic Figure Fir'awn (Pharaoh)",
    "ar": "فرعون",
    "alt": [],
    "cat": "figure"
  },
  "maryam (mary)": {
    "ro": "maryam (mary)",
    "ur": "مريم",
    "en": "Quranic Figure Maryam (Mary)",
    "ar": "مريم",
    "alt": [],
    "cat": "figure"
  },
  "iblis (satan)": {
    "ro": "iblis (satan)",
    "ur": "إبليس",
    "en": "Quranic Figure Iblis (Satan)",
    "ar": "إبليس",
    "alt": [],
    "cat": "figure"
  },
  "haman (pharaoh's vizier)": {
    "ro": "haman (pharaoh's vizier)",
    "ur": "هامان",
    "en": "Quranic Figure Haman (Pharaoh's Vizier)",
    "ar": "هامان",
    "alt": [],
    "cat": "figure"
  },
  "qarun (korah)": {
    "ro": "qarun (korah)",
    "ur": "قارون",
    "en": "Quranic Figure Qarun (Korah)",
    "ar": "قارون",
    "alt": [],
    "cat": "figure"
  },
  "al-samiri (the golden calf maker)": {
    "ro": "al-samiri (the golden calf maker)",
    "ur": "السامري",
    "en": "Quranic Figure Al-Samiri (The Golden Calf Maker)",
    "ar": "السامري",
    "alt": [],
    "cat": "figure"
  },
  "jibril (gabriel)": {
    "ro": "jibril (gabriel)",
    "ur": "جبريل",
    "en": "Quranic Figure Jibril (Gabriel)",
    "ar": "جبريل",
    "alt": [],
    "cat": "figure"
  },
  "dhul-qarnayn": {
    "ro": "dhul-qarnayn",
    "ur": "ذو القرنين",
    "en": "Quranic Figure Dhul-Qarnayn",
    "ar": "ذو القرنين",
    "alt": [],
    "cat": "figure"
  },
  "jalut (goliath)": {
    "ro": "jalut (goliath)",
    "ur": "جالوت",
    "en": "Quranic Figure Jalut (Goliath)",
    "ar": "جالوت",
    "alt": [],
    "cat": "figure"
  },
  "harut & marut": {
    "ro": "harut & marut",
    "ur": "هاروت وماروت",
    "en": "Quranic Figure Harut & Marut",
    "ar": "هاروت وماروت",
    "alt": [],
    "cat": "figure"
  },
  "luqman al-hakim": {
    "ro": "luqman al-hakim",
    "ur": "لقمان",
    "en": "Quranic Figure Luqman al-Hakim",
    "ar": "لقمان",
    "alt": [],
    "cat": "figure"
  },
  "talut (king saul)": {
    "ro": "talut (king saul)",
    "ur": "طالوت",
    "en": "Quranic Figure Talut (King Saul)",
    "ar": "طالوت",
    "alt": [],
    "cat": "figure"
  },
  "mika'il (michael)": {
    "ro": "mika'il (michael)",
    "ur": "ميكائيل",
    "en": "Quranic Figure Mika'il (Michael)",
    "ar": "ميكائيل",
    "alt": [],
    "cat": "figure"
  },
  "malik (guardian of hell)": {
    "ro": "malik (guardian of hell)",
    "ur": "مالك",
    "en": "Quranic Figure Malik (Guardian of Hell)",
    "ar": "مالك",
    "alt": [],
    "cat": "figure"
  },
  "zayd ibn harithah": {
    "ro": "zayd ibn harithah",
    "ur": "زيد",
    "en": "Quranic Figure Zayd ibn Harithah",
    "ar": "زيد",
    "alt": [],
    "cat": "figure"
  },
  "abu lahab": {
    "ro": "abu lahab",
    "ur": "أبو لهب",
    "en": "Quranic Figure Abu Lahab",
    "ar": "أبو لهب",
    "alt": [],
    "cat": "figure"
  },
  "'uzayr (ezra)": {
    "ro": "'uzayr (ezra)",
    "ur": "عزير",
    "en": "Quranic Figure 'Uzayr (Ezra)",
    "ar": "عزير",
    "alt": [],
    "cat": "figure"
  },
  "al fatihah": {
    "ro": "al fatihah",
    "ur": "اَلْفَاتِحَة",
    "en": "Surah Al Fatihah ()",
    "ar": "اَلْفَاتِحَة",
    "alt": [],
    "cat": "surah"
  },
  "al baqarah": {
    "ro": "al baqarah",
    "ur": "اَلْبَقَرَة",
    "en": "Surah Al Baqarah ()",
    "ar": "اَلْبَقَرَة",
    "alt": [],
    "cat": "surah"
  },
  "al imran": {
    "ro": "al imran",
    "ur": "اٰلِ عِمْرَان",
    "en": "Surah Al Imran ()",
    "ar": "اٰلِ عِمْرَان",
    "alt": [],
    "cat": "surah"
  },
  "an nisa": {
    "ro": "an nisa",
    "ur": "اَلنِّسَآء",
    "en": "Surah An Nisa ()",
    "ar": "اَلنِّسَآء",
    "alt": [],
    "cat": "surah"
  },
  "al maidah": {
    "ro": "al maidah",
    "ur": "اَلْمَـآئِدَة",
    "en": "Surah Al Maidah ()",
    "ar": "اَلْمَـآئِدَة",
    "alt": [],
    "cat": "surah"
  },
  "al anam": {
    "ro": "al anam",
    "ur": "اَلْاَ نْعَام",
    "en": "Surah Al Anam ()",
    "ar": "اَلْاَ نْعَام",
    "alt": [],
    "cat": "surah"
  },
  "al araf": {
    "ro": "al araf",
    "ur": "اَلْاَعْرَاف",
    "en": "Surah Al Araf ()",
    "ar": "اَلْاَعْرَاف",
    "alt": [],
    "cat": "surah"
  },
  "al anfal": {
    "ro": "al anfal",
    "ur": "اَلْاَ نْفَال",
    "en": "Surah Al Anfal ()",
    "ar": "اَلْاَ نْفَال",
    "alt": [],
    "cat": "surah"
  },
  "at taubah": {
    "ro": "at taubah",
    "ur": "اَلتَّوْبَة",
    "en": "Surah At Taubah ()",
    "ar": "اَلتَّوْبَة",
    "alt": [],
    "cat": "surah"
  },
  "ar rad": {
    "ro": "ar rad",
    "ur": "اَلرَّعْد",
    "en": "Surah Ar Rad ()",
    "ar": "اَلرَّعْد",
    "alt": [],
    "cat": "surah"
  },
  "al hijr": {
    "ro": "al hijr",
    "ur": "اَلْحِجْر",
    "en": "Surah Al Hijr ()",
    "ar": "اَلْحِجْر",
    "alt": [],
    "cat": "surah"
  },
  "an nahl": {
    "ro": "an nahl",
    "ur": "اَلنَّحْل",
    "en": "Surah An Nahl ()",
    "ar": "اَلنَّحْل",
    "alt": [],
    "cat": "surah"
  },
  "al isra": {
    "ro": "al isra",
    "ur": "بَنِیْٓ اِسْرَآءِیْل (اَلْاَسْرَاء)",
    "en": "Surah Al Isra ()",
    "ar": "بَنِیْٓ اِسْرَآءِیْل (اَلْاَسْرَاء)",
    "alt": [],
    "cat": "surah"
  },
  "al kahf": {
    "ro": "al kahf",
    "ur": "اَلْـكَهْف",
    "en": "Surah Al Kahf ()",
    "ar": "اَلْـكَهْف",
    "alt": [],
    "cat": "surah"
  },
  "maryam": {
    "ro": "maryam",
    "ur": "مَرْيَم",
    "en": "Surah Maryam ()",
    "ar": "مَرْيَم",
    "alt": [],
    "cat": "surah"
  },
  "taha": {
    "ro": "taha",
    "ur": "طٰهٰ",
    "en": "Surah Taha ()",
    "ar": "طٰهٰ",
    "alt": [],
    "cat": "surah"
  },
  "al anbya": {
    "ro": "al anbya",
    "ur": "اَلْاَ نْبِيَآء",
    "en": "Surah Al anbya ()",
    "ar": "اَلْاَ نْبِيَآء",
    "alt": [],
    "cat": "surah"
  },
  "al hajj": {
    "ro": "al hajj",
    "ur": "اَلْحَجّ",
    "en": "Surah Al Hajj ()",
    "ar": "اَلْحَجّ",
    "alt": [],
    "cat": "surah"
  },
  "al muminun": {
    "ro": "al muminun",
    "ur": "اَلْمُؤْمِنُوْن",
    "en": "Surah Al Muminun ()",
    "ar": "اَلْمُؤْمِنُوْن",
    "alt": [],
    "cat": "surah"
  },
  "an noor": {
    "ro": "an noor",
    "ur": "اَلنُّوْر",
    "en": "Surah An Noor ()",
    "ar": "اَلنُّوْر",
    "alt": [],
    "cat": "surah"
  },
  "al furqan": {
    "ro": "al furqan",
    "ur": "اَلْفُرْقَان",
    "en": "Surah Al Furqan ()",
    "ar": "اَلْفُرْقَان",
    "alt": [],
    "cat": "surah"
  },
  "ash shuara": {
    "ro": "ash shuara",
    "ur": "اَلشُّـعَرَاء",
    "en": "Surah ash shuara ()",
    "ar": "اَلشُّـعَرَاء",
    "alt": [],
    "cat": "surah"
  },
  "an naml": {
    "ro": "an naml",
    "ur": "اَلنَّمْل",
    "en": "Surah An Naml ()",
    "ar": "اَلنَّمْل",
    "alt": [],
    "cat": "surah"
  },
  "al qasas": {
    "ro": "al qasas",
    "ur": "اَلْقَصَص",
    "en": "Surah Al Qasas ()",
    "ar": "اَلْقَصَص",
    "alt": [],
    "cat": "surah"
  },
  "al ankabut": {
    "ro": "al ankabut",
    "ur": "اَلْعَنْـكَبُوْت",
    "en": "Surah Al Ankabut ()",
    "ar": "اَلْعَنْـكَبُوْت",
    "alt": [],
    "cat": "surah"
  },
  "ar rum": {
    "ro": "ar rum",
    "ur": "اَلرُّوْم",
    "en": "Surah Ar Rum ()",
    "ar": "اَلرُّوْم",
    "alt": [],
    "cat": "surah"
  },
  "luqman": {
    "ro": "luqman",
    "ur": "لُقْمٰن",
    "en": "Surah Luqman ()",
    "ar": "لُقْمٰن",
    "alt": [],
    "cat": "surah"
  },
  "as sajda": {
    "ro": "as sajda",
    "ur": "اَلسَّجْدَة",
    "en": "Surah As Sajda ()",
    "ar": "اَلسَّجْدَة",
    "alt": [],
    "cat": "surah"
  },
  "al ahzab": {
    "ro": "al ahzab",
    "ur": "اَلْاَحْزَاب",
    "en": "Surah Al Ahzab ()",
    "ar": "اَلْاَحْزَاب",
    "alt": [],
    "cat": "surah"
  },
  "sabah": {
    "ro": "sabah",
    "ur": "سَبَا",
    "en": "Surah Sabah ()",
    "ar": "سَبَا",
    "alt": [],
    "cat": "surah"
  },
  "fatir": {
    "ro": "fatir",
    "ur": "اَلْفَاطِر",
    "en": "Surah Fatir ()",
    "ar": "اَلْفَاطِر",
    "alt": [],
    "cat": "surah"
  },
  "yasin": {
    "ro": "yasin",
    "ur": "يـٰسٓ",
    "en": "Surah Yasin ()",
    "ar": "يـٰسٓ",
    "alt": [],
    "cat": "surah"
  },
  "as saffat": {
    "ro": "as saffat",
    "ur": "اَلصّٰٓفّٰت",
    "en": "Surah As Saffat ()",
    "ar": "اَلصّٰٓفّٰت",
    "alt": [],
    "cat": "surah"
  },
  "sad": {
    "ro": "sad",
    "ur": "صٓ",
    "en": "Surah Sad ()",
    "ar": "صٓ",
    "alt": [],
    "cat": "surah"
  },
  "az zumar": {
    "ro": "az zumar",
    "ur": "اَلزُّمَر",
    "en": "Surah Az Zumar ()",
    "ar": "اَلزُّمَر",
    "alt": [],
    "cat": "surah"
  },
  "al momin": {
    "ro": "al momin",
    "ur": "اَلْمُؤْمِن (اَلْغَافِر)",
    "en": "Surah Al Momin ()",
    "ar": "اَلْمُؤْمِن (اَلْغَافِر)",
    "alt": [],
    "cat": "surah"
  },
  "fussilat": {
    "ro": "fussilat",
    "ur": "حٰمٓ اَلسَّجْدَۃ (فُصِّلَت)",
    "en": "Surah Fussilat ()",
    "ar": "حٰمٓ اَلسَّجْدَۃ (فُصِّلَت)",
    "alt": [],
    "cat": "surah"
  },
  "ash shura": {
    "ro": "ash shura",
    "ur": "اَلشُّوْرٰی",
    "en": "Surah Ash Shura ()",
    "ar": "اَلشُّوْرٰی",
    "alt": [],
    "cat": "surah"
  },
  "az zukhruf": {
    "ro": "az zukhruf",
    "ur": "اَلزُّخْرُف",
    "en": "Surah Az Zukhruf ()",
    "ar": "اَلزُّخْرُف",
    "alt": [],
    "cat": "surah"
  },
  "ad dukhan": {
    "ro": "ad dukhan",
    "ur": "اَلدُّخَان",
    "en": "Surah Ad Dukhan ()",
    "ar": "اَلدُّخَان",
    "alt": [],
    "cat": "surah"
  },
  "al jathiyah": {
    "ro": "al jathiyah",
    "ur": "اَلْجَاثِيَة",
    "en": "Surah Al Jathiyah ()",
    "ar": "اَلْجَاثِيَة",
    "alt": [],
    "cat": "surah"
  },
  "al ahqaf": {
    "ro": "al ahqaf",
    "ur": "اَلْاَحْقَاف",
    "en": "Surah Al Ahqaf ()",
    "ar": "اَلْاَحْقَاف",
    "alt": [],
    "cat": "surah"
  },
  "al fath": {
    "ro": "al fath",
    "ur": "اَلْفَتْح",
    "en": "Surah Al Fath ()",
    "ar": "اَلْفَتْح",
    "alt": [],
    "cat": "surah"
  },
  "al hujurat": {
    "ro": "al hujurat",
    "ur": "اَلْحُجُرٰت",
    "en": "Surah Al Hujurat ()",
    "ar": "اَلْحُجُرٰت",
    "alt": [],
    "cat": "surah"
  },
  "qaf": {
    "ro": "qaf",
    "ur": "قٓ",
    "en": "Surah Qaf ()",
    "ar": "قٓ",
    "alt": [],
    "cat": "surah"
  },
  "az zariyat": {
    "ro": "az zariyat",
    "ur": "اَلذّٰرِيـٰت",
    "en": "Surah Az Zariyat ()",
    "ar": "اَلذّٰرِيـٰت",
    "alt": [],
    "cat": "surah"
  },
  "at tur": {
    "ro": "at tur",
    "ur": "اَلطُّوْر",
    "en": "Surah At Tur ()",
    "ar": "اَلطُّوْر",
    "alt": [],
    "cat": "surah"
  },
  "an najm": {
    "ro": "an najm",
    "ur": "اَلنَّجْم",
    "en": "Surah An Najm ()",
    "ar": "اَلنَّجْم",
    "alt": [],
    "cat": "surah"
  },
  "al qamar": {
    "ro": "al qamar",
    "ur": "اَلْقَمَر",
    "en": "Surah Al Qamar ()",
    "ar": "اَلْقَمَر",
    "alt": [],
    "cat": "surah"
  },
  "ar rahman": {
    "ro": "ar rahman",
    "ur": "اَلرَّحْمٰن",
    "en": "Surah Ar Rahman ()",
    "ar": "اَلرَّحْمٰن",
    "alt": [],
    "cat": "surah"
  },
  "al waqiah": {
    "ro": "al waqiah",
    "ur": "اَلْوَاقِعَة",
    "en": "Surah Al Waqiah ()",
    "ar": "اَلْوَاقِعَة",
    "alt": [],
    "cat": "surah"
  },
  "hadid": {
    "ro": "hadid",
    "ur": "اَلْحَدِيْد",
    "en": "Surah Hadid ()",
    "ar": "اَلْحَدِيْد",
    "alt": [],
    "cat": "surah"
  },
  "al mujadilah": {
    "ro": "al mujadilah",
    "ur": "اَلْمُجَادَلَة",
    "en": "Surah Al Mujadilah ()",
    "ar": "اَلْمُجَادَلَة",
    "alt": [],
    "cat": "surah"
  },
  "al hashr": {
    "ro": "al hashr",
    "ur": "اَلْحَشْر",
    "en": "Surah Al Hashr ()",
    "ar": "اَلْحَشْر",
    "alt": [],
    "cat": "surah"
  },
  "al mumtahanah": {
    "ro": "al mumtahanah",
    "ur": "اَلْمُمْتَحِنَة",
    "en": "Surah Al Mumtahanah ()",
    "ar": "اَلْمُمْتَحِنَة",
    "alt": [],
    "cat": "surah"
  },
  "as saf": {
    "ro": "as saf",
    "ur": "اَلصَّفّ",
    "en": "Surah As Saf ()",
    "ar": "اَلصَّفّ",
    "alt": [],
    "cat": "surah"
  },
  "al jumuah": {
    "ro": "al jumuah",
    "ur": "اَلْجُمُعَة",
    "en": "Surah Al Jumuah ()",
    "ar": "اَلْجُمُعَة",
    "alt": [],
    "cat": "surah"
  },
  "al munafiqun": {
    "ro": "al munafiqun",
    "ur": "اَلْمُنٰفِقُوْن",
    "en": "Surah Al Munafiqun ()",
    "ar": "اَلْمُنٰفِقُوْن",
    "alt": [],
    "cat": "surah"
  },
  "at taghabun": {
    "ro": "at taghabun",
    "ur": "اَلتَّغَابُن",
    "en": "Surah At Taghabun ()",
    "ar": "اَلتَّغَابُن",
    "alt": [],
    "cat": "surah"
  },
  "at talaq": {
    "ro": "at talaq",
    "ur": "اَلطَّلَاق",
    "en": "Surah At Talaq ()",
    "ar": "اَلطَّلَاق",
    "alt": [],
    "cat": "surah"
  },
  "at tahrim": {
    "ro": "at tahrim",
    "ur": "اَلتَّحْرِيْم",
    "en": "Surah At Tahrim ()",
    "ar": "اَلتَّحْرِيْم",
    "alt": [],
    "cat": "surah"
  },
  "al mulk": {
    "ro": "al mulk",
    "ur": "اَلْمُلْك",
    "en": "Surah Al Mulk ()",
    "ar": "اَلْمُلْك",
    "alt": [],
    "cat": "surah"
  },
  "al qalam": {
    "ro": "al qalam",
    "ur": "اَلْقَلَم",
    "en": "Surah Al Qalam ()",
    "ar": "اَلْقَلَم",
    "alt": [],
    "cat": "surah"
  },
  "al haqqah": {
    "ro": "al haqqah",
    "ur": "اَلْحَآ قَّة",
    "en": "Surah Al Haqqah ()",
    "ar": "اَلْحَآ قَّة",
    "alt": [],
    "cat": "surah"
  },
  "al maarij": {
    "ro": "al maarij",
    "ur": "اَلْمَعَارِ ج",
    "en": "Surah Al Maarij ()",
    "ar": "اَلْمَعَارِ ج",
    "alt": [],
    "cat": "surah"
  },
  "al jin": {
    "ro": "al jin",
    "ur": "اَلْجِنّ",
    "en": "Surah Al Jin ()",
    "ar": "اَلْجِنّ",
    "alt": [],
    "cat": "surah"
  },
  "al muzzammil": {
    "ro": "al muzzammil",
    "ur": "اَلْمُزَّمِّل",
    "en": "Surah Al Muzzammil ()",
    "ar": "اَلْمُزَّمِّل",
    "alt": [],
    "cat": "surah"
  },
  "al mudassir": {
    "ro": "al mudassir",
    "ur": "اَلْمُدَّثِّر",
    "en": "Surah Al Mudassir ()",
    "ar": "اَلْمُدَّثِّر",
    "alt": [],
    "cat": "surah"
  },
  "al qiyamah": {
    "ro": "al qiyamah",
    "ur": "اَلْقِيَامَة",
    "en": "Surah Al Qiyamah ()",
    "ar": "اَلْقِيَامَة",
    "alt": [],
    "cat": "surah"
  },
  "al insan": {
    "ro": "al insan",
    "ur": "اَلدَّهْر (اَلْاِنْسَان)",
    "en": "Surah Al Insan ()",
    "ar": "اَلدَّهْر (اَلْاِنْسَان)",
    "alt": [],
    "cat": "surah"
  },
  "al mursalat": {
    "ro": "al mursalat",
    "ur": "اَلْمُرْسَلٰت",
    "en": "Surah Al Mursalat ()",
    "ar": "اَلْمُرْسَلٰت",
    "alt": [],
    "cat": "surah"
  },
  "an naba": {
    "ro": "an naba",
    "ur": "اَلنَّبَا",
    "en": "Surah An Naba ()",
    "ar": "اَلنَّبَا",
    "alt": [],
    "cat": "surah"
  },
  "an naziat": {
    "ro": "an naziat",
    "ur": "اَلنَّازِعَات",
    "en": "Surah An Naziat ()",
    "ar": "اَلنَّازِعَات",
    "alt": [],
    "cat": "surah"
  },
  "abasa": {
    "ro": "abasa",
    "ur": "عَبَس",
    "en": "Surah Abasa ()",
    "ar": "عَبَس",
    "alt": [],
    "cat": "surah"
  },
  "at takwir": {
    "ro": "at takwir",
    "ur": "اَلتَّكْوِيْر",
    "en": "Surah At Takwir ()",
    "ar": "اَلتَّكْوِيْر",
    "alt": [],
    "cat": "surah"
  },
  "al infitar": {
    "ro": "al infitar",
    "ur": "اَلْاِنْفِطَار",
    "en": "Surah Al Infitar ()",
    "ar": "اَلْاِنْفِطَار",
    "alt": [],
    "cat": "surah"
  },
  "al mutaffifin": {
    "ro": "al mutaffifin",
    "ur": "اَلْمُطَفِّفِيْن",
    "en": "Surah Al Mutaffifin ()",
    "ar": "اَلْمُطَفِّفِيْن",
    "alt": [],
    "cat": "surah"
  },
  "al inshiqaq": {
    "ro": "al inshiqaq",
    "ur": "اَلْاِنْشِقَاق",
    "en": "Surah Al Inshiqaq ()",
    "ar": "اَلْاِنْشِقَاق",
    "alt": [],
    "cat": "surah"
  },
  "al buruj": {
    "ro": "al buruj",
    "ur": "اَلْبُرُوْج",
    "en": "Surah Al Buruj ()",
    "ar": "اَلْبُرُوْج",
    "alt": [],
    "cat": "surah"
  },
  "at tariq": {
    "ro": "at tariq",
    "ur": "اَلطَّارِق",
    "en": "Surah At Tariq ()",
    "ar": "اَلطَّارِق",
    "alt": [],
    "cat": "surah"
  },
  "al ala": {
    "ro": "al ala",
    "ur": "اَلْاَعْلٰی",
    "en": "Surah Al Ala ()",
    "ar": "اَلْاَعْلٰی",
    "alt": [],
    "cat": "surah"
  },
  "al ghashiyah": {
    "ro": "al ghashiyah",
    "ur": "اَلْغَاشِيَة",
    "en": "Surah Al Ghashiyah ()",
    "ar": "اَلْغَاشِيَة",
    "alt": [],
    "cat": "surah"
  },
  "al fajr": {
    "ro": "al fajr",
    "ur": "اَلْفَجْر",
    "en": "Surah Al Fajr ()",
    "ar": "اَلْفَجْر",
    "alt": [],
    "cat": "surah"
  },
  "al balad": {
    "ro": "al balad",
    "ur": "اَلْبَـلَد",
    "en": "Surah Al Balad ()",
    "ar": "اَلْبَـلَد",
    "alt": [],
    "cat": "surah"
  },
  "ash shams": {
    "ro": "ash shams",
    "ur": "اَلشَّمْس",
    "en": "Surah Ash Shams ()",
    "ar": "اَلشَّمْس",
    "alt": [],
    "cat": "surah"
  },
  "al lail": {
    "ro": "al lail",
    "ur": "اَلَّيْل",
    "en": "Surah Al Lail ()",
    "ar": "اَلَّيْل",
    "alt": [],
    "cat": "surah"
  },
  "ad duha": {
    "ro": "ad duha",
    "ur": "اَلْضُّحٰی",
    "en": "Surah Ad Duha ()",
    "ar": "اَلْضُّحٰی",
    "alt": [],
    "cat": "surah"
  },
  "alam nashrah": {
    "ro": "alam nashrah",
    "ur": "اَلَمْ نَشْرَ ح",
    "en": "Surah Alam Nashrah ()",
    "ar": "اَلَمْ نَشْرَ ح",
    "alt": [],
    "cat": "surah"
  },
  "at tin": {
    "ro": "at tin",
    "ur": "اَلتِّیْن",
    "en": "Surah At Tin ()",
    "ar": "اَلتِّیْن",
    "alt": [],
    "cat": "surah"
  },
  "al alaq": {
    "ro": "al alaq",
    "ur": "اَلْعَلَق",
    "en": "Surah Al Alaq ()",
    "ar": "اَلْعَلَق",
    "alt": [],
    "cat": "surah"
  },
  "al qadr": {
    "ro": "al qadr",
    "ur": "اَلْقَدَر",
    "en": "Surah Al Qadr ()",
    "ar": "اَلْقَدَر",
    "alt": [],
    "cat": "surah"
  },
  "al baiyinah": {
    "ro": "al baiyinah",
    "ur": "اَلْبَيِّنَة",
    "en": "Surah Al Baiyinah ()",
    "ar": "اَلْبَيِّنَة",
    "alt": [],
    "cat": "surah"
  },
  "az zilzal": {
    "ro": "az zilzal",
    "ur": "اَلزِّلْزَال",
    "en": "Surah Az Zilzal ()",
    "ar": "اَلزِّلْزَال",
    "alt": [],
    "cat": "surah"
  },
  "al adiyat": {
    "ro": "al adiyat",
    "ur": "اَلْعٰدِيٰت",
    "en": "Surah Al Adiyat ()",
    "ar": "اَلْعٰدِيٰت",
    "alt": [],
    "cat": "surah"
  },
  "al qariah": {
    "ro": "al qariah",
    "ur": "اَلْقَارِعَة",
    "en": "Surah Al Qariah ()",
    "ar": "اَلْقَارِعَة",
    "alt": [],
    "cat": "surah"
  },
  "at takasur": {
    "ro": "at takasur",
    "ur": "اَلتَّكَاثُر",
    "en": "Surah At Takasur ()",
    "ar": "اَلتَّكَاثُر",
    "alt": [],
    "cat": "surah"
  },
  "al asr": {
    "ro": "al asr",
    "ur": "اَلْعَصْر",
    "en": "Surah Al Asr ()",
    "ar": "اَلْعَصْر",
    "alt": [],
    "cat": "surah"
  },
  "al humazah": {
    "ro": "al humazah",
    "ur": "اَلْهُمَزَة",
    "en": "Surah Al Humazah ()",
    "ar": "اَلْهُمَزَة",
    "alt": [],
    "cat": "surah"
  },
  "al fil": {
    "ro": "al fil",
    "ur": "اَلْفِيْل",
    "en": "Surah Al Fil ()",
    "ar": "اَلْفِيْل",
    "alt": [],
    "cat": "surah"
  },
  "quraish": {
    "ro": "quraish",
    "ur": "قُـرَيْش",
    "en": "Surah Quraish ()",
    "ar": "قُـرَيْش",
    "alt": [],
    "cat": "surah"
  },
  "al maun": {
    "ro": "al maun",
    "ur": "اَلْمَاعُوْن",
    "en": "Surah Al Maun ()",
    "ar": "اَلْمَاعُوْن",
    "alt": [],
    "cat": "surah"
  },
  "al kausar": {
    "ro": "al kausar",
    "ur": "اَلْـكَوْثَر",
    "en": "Surah Al Kausar ()",
    "ar": "اَلْـكَوْثَر",
    "alt": [],
    "cat": "surah"
  },
  "al kafirun": {
    "ro": "al kafirun",
    "ur": "اَلْكَافِرُوْن",
    "en": "Surah Al Kafirun ()",
    "ar": "اَلْكَافِرُوْن",
    "alt": [],
    "cat": "surah"
  },
  "an nasr": {
    "ro": "an nasr",
    "ur": "اَلنَّصْر",
    "en": "Surah An Nasr ()",
    "ar": "اَلنَّصْر",
    "alt": [],
    "cat": "surah"
  },
  "al lahab": {
    "ro": "al lahab",
    "ur": "اَللَّھَب",
    "en": "Surah Al Lahab ()",
    "ar": "اَللَّھَب",
    "alt": [],
    "cat": "surah"
  },
  "al ikhlas": {
    "ro": "al ikhlas",
    "ur": "اَلْاِخْلَاص",
    "en": "Surah Al Ikhlas ()",
    "ar": "اَلْاِخْلَاص",
    "alt": [],
    "cat": "surah"
  },
  "al falaq": {
    "ro": "al falaq",
    "ur": "اَلْفَلَق",
    "en": "Surah Al Falaq ()",
    "ar": "اَلْفَلَق",
    "alt": [],
    "cat": "surah"
  },
  "an nas": {
    "ro": "an nas",
    "ur": "اَلنَّاس",
    "en": "Surah An Nas ()",
    "ar": "اَلنَّاس",
    "alt": [],
    "cat": "surah"
  },
  "alh": {
    "ro": "alh",
    "ur": "اله",
    "en": "Deity / To worship / God",
    "ar": "اله",
    "alt": [],
    "cat": "root"
  },
  "mabood": {
    "ro": "mabood",
    "ur": "اله",
    "en": "Deity / To worship / God",
    "ar": "اله",
    "alt": [],
    "cat": "root"
  },
  "ibadat karna": {
    "ro": "ibadat karna",
    "ur": "اله",
    "en": "Worship / Slave / Servant",
    "ar": "اله",
    "alt": [],
    "cat": "root"
  },
  "allah ta'ala": {
    "ro": "allah ta'ala",
    "ur": "اله",
    "en": "Deity / To worship / God",
    "ar": "اله",
    "alt": [],
    "cat": "root"
  },
  "qwl": {
    "ro": "qwl",
    "ur": "قول",
    "en": "To say / speak / utter",
    "ar": "قول",
    "alt": [],
    "cat": "root"
  },
  "farmana": {
    "ro": "farmana",
    "ur": "قول",
    "en": "To say / speak / utter",
    "ar": "قول",
    "alt": [],
    "cat": "root"
  },
  "baat karna": {
    "ro": "baat karna",
    "ur": "قول",
    "en": "To say / speak / utter",
    "ar": "قول",
    "alt": [],
    "cat": "root"
  },
  "kwn": {
    "ro": "kwn",
    "ur": "كون",
    "en": "To be / exist / happen",
    "ar": "كون",
    "alt": [],
    "cat": "root"
  },
  "wujood mein aana": {
    "ro": "wujood mein aana",
    "ur": "كون",
    "en": "To be / exist / happen",
    "ar": "كون",
    "alt": [],
    "cat": "root"
  },
  "rbb": {
    "ro": "rbb",
    "ur": "ربب",
    "en": "Lord / Nurturer / Sustainer",
    "ar": "ربب",
    "alt": [],
    "cat": "root"
  },
  "palne wala": {
    "ro": "palne wala",
    "ur": "ربب",
    "en": "Lord / Nurturer / Sustainer",
    "ar": "ربب",
    "alt": [],
    "cat": "root"
  },
  "maalik": {
    "ro": "maalik",
    "ur": "ربب",
    "en": "King / Dominion / Possession",
    "ar": "ربب",
    "alt": [],
    "cat": "root"
  },
  "amn": {
    "ro": "amn",
    "ur": "امن",
    "en": "Faith / Safety / Belief",
    "ar": "امن",
    "alt": [],
    "cat": "root"
  },
  "imaan lana": {
    "ro": "imaan lana",
    "ur": "امن",
    "en": "Faith / Safety / Belief",
    "ar": "امن",
    "alt": [],
    "cat": "root"
  },
  "aman pana": {
    "ro": "aman pana",
    "ur": "امن",
    "en": "Faith / Safety / Belief",
    "ar": "امن",
    "alt": [],
    "cat": "root"
  },
  "yaqeen": {
    "ro": "yaqeen",
    "ur": "امن",
    "en": "Faith / Safety / Belief",
    "ar": "امن",
    "alt": [],
    "cat": "root"
  },
  "elm": {
    "ro": "elm",
    "ur": "علم",
    "en": "Knowledge / To know / learn",
    "ar": "علم",
    "alt": [],
    "cat": "root"
  },
  "janna": {
    "ro": "janna",
    "ur": "علم",
    "en": "Knowledge / To know / learn",
    "ar": "علم",
    "alt": [],
    "cat": "root"
  },
  "maloom karna": {
    "ro": "maloom karna",
    "ur": "علم",
    "en": "Knowledge / To know / learn",
    "ar": "علم",
    "alt": [],
    "cat": "root"
  },
  "qwm": {
    "ro": "qwm",
    "ur": "قوم",
    "en": "To stand / People / Community",
    "ar": "قوم",
    "alt": [],
    "cat": "root"
  },
  "khada hona": {
    "ro": "khada hona",
    "ur": "قوم",
    "en": "To stand / People / Community",
    "ar": "قوم",
    "alt": [],
    "cat": "root"
  },
  "giroh": {
    "ro": "giroh",
    "ur": "قوم",
    "en": "To stand / People / Community",
    "ar": "قوم",
    "alt": [],
    "cat": "root"
  },
  "aty": {
    "ro": "aty",
    "ur": "اتي",
    "en": "To come / bring / grant",
    "ar": "اتي",
    "alt": [],
    "cat": "root"
  },
  "lana": {
    "ro": "lana",
    "ur": "اتي",
    "en": "To come / bring / grant",
    "ar": "اتي",
    "alt": [],
    "cat": "root"
  },
  "ata farmana": {
    "ro": "ata farmana",
    "ur": "اتي",
    "en": "To come / bring / grant",
    "ar": "اتي",
    "alt": [],
    "cat": "root"
  },
  "kfr": {
    "ro": "kfr",
    "ur": "كفر",
    "en": "Disbelief / To conceal / deny",
    "ar": "كفر",
    "alt": [],
    "cat": "root"
  },
  "kufr karna": {
    "ro": "kufr karna",
    "ur": "كفر",
    "en": "Disbelief / To conceal / deny",
    "ar": "كفر",
    "alt": [],
    "cat": "root"
  },
  "inkar karna": {
    "ro": "inkar karna",
    "ur": "كفر",
    "en": "Disbelief / To conceal / deny",
    "ar": "كفر",
    "alt": [],
    "cat": "root"
  },
  "chhupana": {
    "ro": "chhupana",
    "ur": "كفر",
    "en": "Concealment / Paradise / Garden",
    "ar": "كفر",
    "alt": [],
    "cat": "root"
  },
  "byn": {
    "ro": "byn",
    "ur": "بين",
    "en": "Root: ب - ي - ن",
    "ar": "بين",
    "alt": [],
    "cat": "root"
  },
  "maddah": {
    "ro": "maddah",
    "ur": "بين",
    "en": "Root: ب - ر - ه - ن",
    "ar": "بين",
    "alt": [],
    "cat": "root"
  },
  "$ya": {
    "ro": "$ya",
    "ur": "شيا",
    "en": "Root: ش - ي - ا",
    "ar": "شيا",
    "alt": [],
    "cat": "root"
  },
  "rsl": {
    "ro": "rsl",
    "ur": "رسل",
    "en": "To send / Messenger / Message",
    "ar": "رسل",
    "alt": [],
    "cat": "root"
  },
  "paighambar": {
    "ro": "paighambar",
    "ur": "رسل",
    "en": "To send / Messenger / Message",
    "ar": "رسل",
    "alt": [],
    "cat": "root"
  },
  "risalat": {
    "ro": "risalat",
    "ur": "رسل",
    "en": "To send / Messenger / Message",
    "ar": "رسل",
    "alt": [],
    "cat": "root"
  },
  "ard": {
    "ro": "ard",
    "ur": "ارض",
    "en": "Earth / Land / Ground",
    "ar": "ارض",
    "alt": [],
    "cat": "root"
  },
  "dharti": {
    "ro": "dharti",
    "ur": "ارض",
    "en": "Earth / Land / Ground",
    "ar": "ارض",
    "alt": [],
    "cat": "root"
  },
  "ywm": {
    "ro": "ywm",
    "ur": "يوم",
    "en": "Day / Era / Time",
    "ar": "يوم",
    "alt": [],
    "cat": "root"
  },
  "roz": {
    "ro": "roz",
    "ur": "يوم",
    "en": "Day / Era / Time",
    "ar": "يوم",
    "alt": [],
    "cat": "root"
  },
  "qayamat ka roz": {
    "ro": "qayamat ka roz",
    "ur": "يوم",
    "en": "Day / Era / Time",
    "ar": "يوم",
    "alt": [],
    "cat": "root"
  },
  "ayy": {
    "ro": "ayy",
    "ur": "ايي",
    "en": "Root: ا - ي - ي",
    "ar": "ايي",
    "alt": [],
    "cat": "root"
  },
  "smw": {
    "ro": "smw",
    "ur": "سمو",
    "en": "Sky / Heaven / Elevation",
    "ar": "سمو",
    "alt": [],
    "cat": "root"
  },
  "bulandi": {
    "ro": "bulandi",
    "ur": "سمو",
    "en": "Sky / Heaven / Elevation",
    "ar": "سمو",
    "alt": [],
    "cat": "root"
  },
  "kll": {
    "ro": "kll",
    "ur": "كلل",
    "en": "Root: ك - ل - ل",
    "ar": "كلل",
    "alt": [],
    "cat": "root"
  },
  "e*b": {
    "ro": "e*b",
    "ur": "عذب",
    "en": "Punishment / Torment / Pain",
    "ar": "عذب",
    "alt": [],
    "cat": "root"
  },
  "azaab dena": {
    "ro": "azaab dena",
    "ur": "عذب",
    "en": "Punishment / Torment / Pain",
    "ar": "عذب",
    "alt": [],
    "cat": "root"
  },
  "eml": {
    "ro": "eml",
    "ur": "عمل",
    "en": "Deed / Action / To work",
    "ar": "عمل",
    "alt": [],
    "cat": "root"
  },
  "amal karna": {
    "ro": "amal karna",
    "ur": "عمل",
    "en": "Deed / Action / To work",
    "ar": "عمل",
    "alt": [],
    "cat": "root"
  },
  "kaam": {
    "ro": "kaam",
    "ur": "عمل",
    "en": "Deed / Action / To work",
    "ar": "عمل",
    "alt": [],
    "cat": "root"
  },
  "neki ya badi": {
    "ro": "neki ya badi",
    "ur": "عمل",
    "en": "Deed / Action / To work",
    "ar": "عمل",
    "alt": [],
    "cat": "root"
  },
  "jel": {
    "ro": "jel",
    "ur": "جعل",
    "en": "To make / appoint / place",
    "ar": "جعل",
    "alt": [],
    "cat": "root"
  },
  "banana": {
    "ro": "banana",
    "ur": "جعل",
    "en": "To make / appoint / place",
    "ar": "جعل",
    "alt": [],
    "cat": "root"
  },
  "muqarrar karna": {
    "ro": "muqarrar karna",
    "ur": "جعل",
    "en": "To make / appoint / place",
    "ar": "جعل",
    "alt": [],
    "cat": "root"
  },
  "rakhna": {
    "ro": "rakhna",
    "ur": "جعل",
    "en": "To make / appoint / place",
    "ar": "جعل",
    "alt": [],
    "cat": "root"
  },
  "rhm": {
    "ro": "rhm",
    "ur": "رحم",
    "en": "Mercy / Compassion / Grace",
    "ar": "رحم",
    "alt": [],
    "cat": "root"
  },
  "raham karna": {
    "ro": "raham karna",
    "ur": "رحم",
    "en": "Mercy / Compassion / Grace",
    "ar": "رحم",
    "alt": [],
    "cat": "root"
  },
  "meharbani": {
    "ro": "meharbani",
    "ur": "رحم",
    "en": "Grace / Bounty / Superiority",
    "ar": "رحم",
    "alt": [],
    "cat": "root"
  },
  "reham": {
    "ro": "reham",
    "ur": "رحم",
    "en": "Mercy / Compassion / Grace",
    "ar": "رحم",
    "alt": [],
    "cat": "root"
  },
  "ray": {
    "ro": "ray",
    "ur": "راي",
    "en": "To see / perceive / look",
    "ar": "راي",
    "alt": [],
    "cat": "root"
  },
  "nazr aana": {
    "ro": "nazr aana",
    "ur": "راي",
    "en": "To see / perceive / look",
    "ar": "راي",
    "alt": [],
    "cat": "root"
  },
  "ktb": {
    "ro": "ktb",
    "ur": "كتب",
    "en": "Writing / Book / To decree",
    "ar": "كتب",
    "alt": [],
    "cat": "root"
  },
  "kitab": {
    "ro": "kitab",
    "ur": "كتب",
    "en": "Writing / Book / To decree",
    "ar": "كتب",
    "alt": [],
    "cat": "root"
  },
  "farz karna": {
    "ro": "farz karna",
    "ur": "كتب",
    "en": "Writing / Book / To decree",
    "ar": "كتب",
    "alt": [],
    "cat": "root"
  },
  "hdy": {
    "ro": "hdy",
    "ur": "هدي",
    "en": "Guidance / To guide",
    "ar": "هدي",
    "alt": [],
    "cat": "root"
  },
  "hidayat dena": {
    "ro": "hidayat dena",
    "ur": "هدي",
    "en": "Guidance / To guide",
    "ar": "هدي",
    "alt": [],
    "cat": "root"
  },
  "rahnumai": {
    "ro": "rahnumai",
    "ur": "هدي",
    "en": "Guidance / To guide",
    "ar": "هدي",
    "alt": [],
    "cat": "root"
  },
  "zlm": {
    "ro": "zlm",
    "ur": "ظلم",
    "en": "Darkness / Injustice / Wrongdoing",
    "ar": "ظلم",
    "alt": [],
    "cat": "root"
  },
  "andhera": {
    "ro": "andhera",
    "ur": "ظلم",
    "en": "Darkness / Injustice / Wrongdoing",
    "ar": "ظلم",
    "alt": [],
    "cat": "root"
  },
  "nainsafi": {
    "ro": "nainsafi",
    "ur": "ظلم",
    "en": "Darkness / Injustice / Wrongdoing",
    "ar": "ظلم",
    "alt": [],
    "cat": "root"
  },
  "nfs": {
    "ro": "nfs",
    "ur": "نفس",
    "en": "Soul / Self / Breath",
    "ar": "نفس",
    "alt": [],
    "cat": "root"
  },
  "nafs": {
    "ro": "nafs",
    "ur": "نفس",
    "en": "Soul / Self / Breath",
    "ar": "نفس",
    "alt": [],
    "cat": "root"
  },
  "jaan": {
    "ro": "jaan",
    "ur": "نفس",
    "en": "Soul / Self / Breath",
    "ar": "نفس",
    "alt": [],
    "cat": "root"
  },
  "zaat": {
    "ro": "zaat",
    "ur": "نفس",
    "en": "Soul / Self / Breath",
    "ar": "نفس",
    "alt": [],
    "cat": "root"
  },
  "qbl": {
    "ro": "qbl",
    "ur": "قبل",
    "en": "Root: ق - ب - ل",
    "ar": "قبل",
    "alt": [],
    "cat": "root"
  },
  "nzl": {
    "ro": "nzl",
    "ur": "نزل",
    "en": "Root: ن - ز - ل",
    "ar": "نزل",
    "alt": [],
    "cat": "root"
  },
  "*kr": {
    "ro": "*kr",
    "ur": "ذكر",
    "en": "Root: ذ - ك - ر",
    "ar": "ذكر",
    "alt": [],
    "cat": "root"
  },
  "hqq": {
    "ro": "hqq",
    "ur": "حقق",
    "en": "Truth / Right / Reality",
    "ar": "حقق",
    "alt": [],
    "cat": "root"
  },
  "sacha faisla": {
    "ro": "sacha faisla",
    "ur": "حقق",
    "en": "Truth / Right / Reality",
    "ar": "حقق",
    "alt": [],
    "cat": "root"
  },
  "k*b": {
    "ro": "k*b",
    "ur": "كذب",
    "en": "Lying / Falsehood / Denial",
    "ar": "كذب",
    "alt": [],
    "cat": "root"
  },
  "jhoot bolna": {
    "ro": "jhoot bolna",
    "ur": "كذب",
    "en": "Lying / Falsehood / Denial",
    "ar": "كذب",
    "alt": [],
    "cat": "root"
  },
  "jhutlana": {
    "ro": "jhutlana",
    "ur": "كذب",
    "en": "Lying / Falsehood / Denial",
    "ar": "كذب",
    "alt": [],
    "cat": "root"
  },
  "jya": {
    "ro": "jya",
    "ur": "جيا",
    "en": "Root: ج - ي - ا",
    "ar": "جيا",
    "alt": [],
    "cat": "root"
  },
  "ebd": {
    "ro": "ebd",
    "ur": "عبد",
    "en": "Worship / Slave / Servant",
    "ar": "عبد",
    "alt": [],
    "cat": "root"
  },
  "banda": {
    "ro": "banda",
    "ur": "عبد",
    "en": "Worship / Slave / Servant",
    "ar": "عبد",
    "alt": [],
    "cat": "root"
  },
  "ghulam": {
    "ro": "ghulam",
    "ur": "عبد",
    "en": "Worship / Slave / Servant",
    "ar": "عبد",
    "alt": [],
    "cat": "root"
  },
  "ax*": {
    "ro": "ax*",
    "ur": "اخذ",
    "en": "Root: ا - خ - ذ",
    "ar": "اخذ",
    "alt": [],
    "cat": "root"
  },
  "xlq": {
    "ro": "xlq",
    "ur": "خلق",
    "en": "Creation / To create / shape",
    "ar": "خلق",
    "alt": [],
    "cat": "root"
  },
  "paida karna": {
    "ro": "paida karna",
    "ur": "خلق",
    "en": "Creation / To create / shape",
    "ar": "خلق",
    "alt": [],
    "cat": "root"
  },
  "takhleeq": {
    "ro": "takhleeq",
    "ur": "خلق",
    "en": "Creation / To create / shape",
    "ar": "خلق",
    "alt": [],
    "cat": "root"
  },
  "khalq": {
    "ro": "khalq",
    "ur": "خلق",
    "en": "Creation / To create / shape",
    "ar": "خلق",
    "alt": [],
    "cat": "root"
  },
  "wqy": {
    "ro": "wqy",
    "ur": "وقي",
    "en": "Root: و - ق - ي",
    "ar": "وقي",
    "alt": [],
    "cat": "root"
  },
  "axr": {
    "ro": "axr",
    "ur": "اخر",
    "en": "Root: ا - خ - ر",
    "ar": "اخر",
    "alt": [],
    "cat": "root"
  },
  "amr": {
    "ro": "amr",
    "ur": "امر",
    "en": "Root: ا - م - ر",
    "ar": "امر",
    "alt": [],
    "cat": "root"
  },
  "nws": {
    "ro": "nws",
    "ur": "نوس",
    "en": "Root: ن - و - س",
    "ar": "نوس",
    "alt": [],
    "cat": "root"
  },
  "bed": {
    "ro": "bed",
    "ur": "بعد",
    "en": "Root: ب - ع - د",
    "ar": "بعد",
    "alt": [],
    "cat": "root"
  },
  "gfr": {
    "ro": "gfr",
    "ur": "غفر",
    "en": "Forgiveness / Covering sins",
    "ar": "غفر",
    "alt": [],
    "cat": "root"
  },
  "bakhshna": {
    "ro": "bakhshna",
    "ur": "غفر",
    "en": "Forgiveness / Covering sins",
    "ar": "غفر",
    "alt": [],
    "cat": "root"
  },
  "gunah maaf karna": {
    "ro": "gunah maaf karna",
    "ur": "غفر",
    "en": "Forgiveness / Covering sins",
    "ar": "غفر",
    "alt": [],
    "cat": "root"
  },
  "wly": {
    "ro": "wly",
    "ur": "ولي",
    "en": "Protecting friend / Guardian",
    "ar": "ولي",
    "alt": [],
    "cat": "root"
  },
  "madadgar": {
    "ro": "madadgar",
    "ur": "ولي",
    "en": "Protecting friend / Guardian",
    "ar": "ولي",
    "alt": [],
    "cat": "root"
  },
  "sarparast": {
    "ro": "sarparast",
    "ur": "ولي",
    "en": "Protecting friend / Guardian",
    "ar": "ولي",
    "alt": [],
    "cat": "root"
  },
  "dew": {
    "ro": "dew",
    "ur": "دعو",
    "en": "Root: د - ع - و",
    "ar": "دعو",
    "alt": [],
    "cat": "root"
  },
  "hkm": {
    "ro": "hkm",
    "ur": "حكم",
    "en": "Wisdom / Judgment / Governance",
    "ar": "حكم",
    "alt": [],
    "cat": "root"
  },
  "faisla karna": {
    "ro": "faisla karna",
    "ur": "حكم",
    "en": "Wisdom / Judgment / Governance",
    "ar": "حكم",
    "alt": [],
    "cat": "root"
  },
  "hukum": {
    "ro": "hukum",
    "ur": "حكم",
    "en": "Wisdom / Judgment / Governance",
    "ar": "حكم",
    "alt": [],
    "cat": "root"
  },
  "mlk": {
    "ro": "mlk",
    "ur": "ملك",
    "en": "King / Dominion / Possession",
    "ar": "ملك",
    "alt": [],
    "cat": "root"
  },
  "badshah": {
    "ro": "badshah",
    "ur": "ملك",
    "en": "King / Dominion / Possession",
    "ar": "ملك",
    "alt": [],
    "cat": "root"
  },
  "hukumat": {
    "ro": "hukumat",
    "ur": "ملك",
    "en": "King / Dominion / Possession",
    "ar": "ملك",
    "alt": [],
    "cat": "root"
  },
  "jnn": {
    "ro": "jnn",
    "ur": "جنن",
    "en": "Concealment / Paradise / Garden",
    "ar": "جنن",
    "alt": [],
    "cat": "root"
  },
  "baagh": {
    "ro": "baagh",
    "ur": "جنن",
    "en": "Concealment / Paradise / Garden",
    "ar": "جنن",
    "alt": [],
    "cat": "root"
  },
  "end": {
    "ro": "end",
    "ur": "عند",
    "en": "Root: ع - ن - د",
    "ar": "عند",
    "alt": [],
    "cat": "root"
  },
  "xyr": {
    "ro": "xyr",
    "ur": "خير",
    "en": "Root: خ - ي - ر",
    "ar": "خير",
    "alt": [],
    "cat": "root"
  },
  "nwr": {
    "ro": "nwr",
    "ur": "نور",
    "en": "Light / Illumination / Radiance",
    "ar": "نور",
    "alt": [],
    "cat": "root"
  },
  "noor": {
    "ro": "noor",
    "ur": "نور",
    "en": "Light / Illumination / Radiance",
    "ar": "نور",
    "alt": [],
    "cat": "root"
  },
  "roshni": {
    "ro": "roshni",
    "ur": "نور",
    "en": "Light / Illumination / Radiance",
    "ar": "نور",
    "alt": [],
    "cat": "root"
  },
  "ujala": {
    "ro": "ujala",
    "ur": "نور",
    "en": "Light / Illumination / Radiance",
    "ar": "نور",
    "alt": [],
    "cat": "root"
  },
  "hsn": {
    "ro": "hsn",
    "ur": "حسن",
    "en": "Beauty / Goodness / Excellence",
    "ar": "حسن",
    "alt": [],
    "cat": "root"
  },
  "husn": {
    "ro": "husn",
    "ur": "حسن",
    "en": "Beauty / Goodness / Excellence",
    "ar": "حسن",
    "alt": [],
    "cat": "root"
  },
  "neki": {
    "ro": "neki",
    "ur": "حسن",
    "en": "Beauty / Goodness / Excellence",
    "ar": "حسن",
    "alt": [],
    "cat": "root"
  },
  "bhalai": {
    "ro": "bhalai",
    "ur": "حسن",
    "en": "Beauty / Goodness / Excellence",
    "ar": "حسن",
    "alt": [],
    "cat": "root"
  },
  "dll": {
    "ro": "dll",
    "ur": "ضلل",
    "en": "Root: ض - ل - ل",
    "ar": "ضلل",
    "alt": [],
    "cat": "root"
  },
  "sme": {
    "ro": "sme",
    "ur": "سمع",
    "en": "Hearing / To listen",
    "ar": "سمع",
    "alt": [],
    "cat": "root"
  },
  "tawajjoh dena": {
    "ro": "tawajjoh dena",
    "ur": "سمع",
    "en": "Hearing / To listen",
    "ar": "سمع",
    "alt": [],
    "cat": "root"
  },
  "bny": {
    "ro": "bny",
    "ur": "بني",
    "en": "Root: ب - ن - ي",
    "ar": "بني",
    "alt": [],
    "cat": "root"
  },
  "hyy": {
    "ro": "hyy",
    "ur": "حيي",
    "en": "Life / Living / Reviving",
    "ar": "حيي",
    "alt": [],
    "cat": "root"
  },
  "zindagi": {
    "ro": "zindagi",
    "ur": "حيي",
    "en": "Life / Living / Reviving",
    "ar": "حيي",
    "alt": [],
    "cat": "root"
  },
  "zinda karna": {
    "ro": "zinda karna",
    "ur": "حيي",
    "en": "Life / Living / Reviving",
    "ar": "حيي",
    "alt": [],
    "cat": "root"
  },
  "hayaat": {
    "ro": "hayaat",
    "ur": "حيي",
    "en": "Life / Living / Reviving",
    "ar": "حيي",
    "alt": [],
    "cat": "root"
  },
  "xrj": {
    "ro": "xrj",
    "ur": "خرج",
    "en": "Root: خ - ر - ج",
    "ar": "خرج",
    "alt": [],
    "cat": "root"
  },
  "slh": {
    "ro": "slh",
    "ur": "صلح",
    "en": "Root: ص - ل - ح",
    "ar": "صلح",
    "alt": [],
    "cat": "root"
  },
  "sbl": {
    "ro": "sbl",
    "ur": "سبل",
    "en": "Root: س - ب - ل",
    "ar": "سبل",
    "alt": [],
    "cat": "root"
  },
  "tbe": {
    "ro": "tbe",
    "ur": "تبع",
    "en": "Root: ت - ب - ع",
    "ar": "تبع",
    "alt": [],
    "cat": "root"
  },
  "awl": {
    "ro": "awl",
    "ur": "اول",
    "en": "Root: ا - و - ل",
    "ar": "اول",
    "alt": [],
    "cat": "root"
  },
  "qtl": {
    "ro": "qtl",
    "ur": "قتل",
    "en": "Root: ق - ت - ل",
    "ar": "قتل",
    "alt": [],
    "cat": "root"
  },
  "mvl": {
    "ro": "mvl",
    "ur": "مثل",
    "en": "Likeness / Parable / Example",
    "ar": "مثل",
    "alt": [],
    "cat": "root"
  },
  "misal": {
    "ro": "misal",
    "ur": "مثل",
    "en": "Likeness / Parable / Example",
    "ar": "مثل",
    "alt": [],
    "cat": "root"
  },
  "misl": {
    "ro": "misl",
    "ur": "مثل",
    "en": "Likeness / Parable / Example",
    "ar": "مثل",
    "alt": [],
    "cat": "root"
  },
  "namoona": {
    "ro": "namoona",
    "ur": "مثل",
    "en": "Likeness / Parable / Example",
    "ar": "مثل",
    "alt": [],
    "cat": "root"
  },
  "qlb": {
    "ro": "qlb",
    "ur": "قلب",
    "en": "Heart / Turning / Conversion",
    "ar": "قلب",
    "alt": [],
    "cat": "root"
  },
  "palatna": {
    "ro": "palatna",
    "ur": "قلب",
    "en": "Heart / Turning / Conversion",
    "ar": "قلب",
    "alt": [],
    "cat": "root"
  },
  "qalb": {
    "ro": "qalb",
    "ur": "قلب",
    "en": "Heart / Turning / Conversion",
    "ar": "قلب",
    "alt": [],
    "cat": "root"
  },
  "$rk": {
    "ro": "$rk",
    "ur": "شرك",
    "en": "Root: ش - ر - ك",
    "ar": "شرك",
    "alt": [],
    "cat": "root"
  },
  "kvr": {
    "ro": "kvr",
    "ur": "كثر",
    "en": "Root: ك - ث - ر",
    "ar": "كثر",
    "alt": [],
    "cat": "root"
  },
  "swa": {
    "ro": "swa",
    "ur": "سوا",
    "en": "Evil / Badness / Harm",
    "ar": "سوا",
    "alt": [],
    "cat": "root"
  },
  "buraai": {
    "ro": "buraai",
    "ur": "سوا",
    "en": "Evil / Badness / Harm",
    "ar": "سوا",
    "alt": [],
    "cat": "root"
  },
  "mwt": {
    "ro": "mwt",
    "ur": "موت",
    "en": "Death / Dying / Lifeless",
    "ar": "موت",
    "alt": [],
    "cat": "root"
  },
  "maut": {
    "ro": "maut",
    "ur": "موت",
    "en": "Death / Dying / Lifeless",
    "ar": "موت",
    "alt": [],
    "cat": "root"
  },
  "marna": {
    "ro": "marna",
    "ur": "موت",
    "en": "Death / Dying / Lifeless",
    "ar": "موت",
    "alt": [],
    "cat": "root"
  },
  "murda": {
    "ro": "murda",
    "ur": "موت",
    "en": "Death / Dying / Lifeless",
    "ar": "موت",
    "alt": [],
    "cat": "root"
  },
  "kbr": {
    "ro": "kbr",
    "ur": "كبر",
    "en": "Root: ك - ب - ر",
    "ar": "كبر",
    "alt": [],
    "cat": "root"
  },
  "$hd": {
    "ro": "$hd",
    "ur": "شهد",
    "en": "Witness / Presence / Testimony",
    "ar": "شهد",
    "alt": [],
    "cat": "root"
  },
  "gawahi dena": {
    "ro": "gawahi dena",
    "ur": "شهد",
    "en": "Witness / Presence / Testimony",
    "ar": "شهد",
    "alt": [],
    "cat": "root"
  },
  "hazir hona": {
    "ro": "hazir hona",
    "ur": "شهد",
    "en": "Witness / Presence / Testimony",
    "ar": "شهد",
    "alt": [],
    "cat": "root"
  },
  "shahid": {
    "ro": "shahid",
    "ur": "شهد",
    "en": "Witness / Presence / Testimony",
    "ar": "شهد",
    "alt": [],
    "cat": "root"
  },
  "nba": {
    "ro": "nba",
    "ur": "نبا",
    "en": "Root: ن - ب - ا",
    "ar": "نبا",
    "alt": [],
    "cat": "root"
  },
  "nsr": {
    "ro": "nsr",
    "ur": "نصر",
    "en": "Help / Victory / Assistance",
    "ar": "نصر",
    "alt": [],
    "cat": "root"
  },
  "madad karna": {
    "ro": "madad karna",
    "ur": "نصر",
    "en": "Help / Victory / Assistance",
    "ar": "نصر",
    "alt": [],
    "cat": "root"
  },
  "nusrat": {
    "ro": "nusrat",
    "ur": "نصر",
    "en": "Help / Victory / Assistance",
    "ar": "نصر",
    "alt": [],
    "cat": "root"
  },
  "jeet": {
    "ro": "jeet",
    "ur": "نصر",
    "en": "Help / Victory / Assistance",
    "ar": "نصر",
    "alt": [],
    "cat": "root"
  },
  "sdq": {
    "ro": "sdq",
    "ur": "صدق",
    "en": "Truthfulness / Sincerity / Charity",
    "ar": "صدق",
    "alt": [],
    "cat": "root"
  },
  "sadaqat": {
    "ro": "sadaqat",
    "ur": "صدق",
    "en": "Truthfulness / Sincerity / Charity",
    "ar": "صدق",
    "alt": [],
    "cat": "root"
  },
  "sach bolna": {
    "ro": "sach bolna",
    "ur": "صدق",
    "en": "Truthfulness / Sincerity / Charity",
    "ar": "صدق",
    "alt": [],
    "cat": "root"
  },
  "sadqah": {
    "ro": "sadqah",
    "ur": "صدق",
    "en": "Truthfulness / Sincerity / Charity",
    "ar": "صدق",
    "alt": [],
    "cat": "root"
  },
  "gyr": {
    "ro": "gyr",
    "ur": "غير",
    "en": "Root: غ - ي - ر",
    "ar": "غير",
    "alt": [],
    "cat": "root"
  },
  "wed": {
    "ro": "wed",
    "ur": "وعد",
    "en": "Promise / Warning / Threat",
    "ar": "وعد",
    "alt": [],
    "cat": "root"
  },
  "waada karna": {
    "ro": "waada karna",
    "ur": "وعد",
    "en": "Promise / Warning / Threat",
    "ar": "وعد",
    "alt": [],
    "cat": "root"
  },
  "wa'eed": {
    "ro": "wa'eed",
    "ur": "وعد",
    "en": "Promise / Warning / Threat",
    "ar": "وعد",
    "alt": [],
    "cat": "root"
  },
  "bsr": {
    "ro": "bsr",
    "ur": "بصر",
    "en": "Seeing / Insight / Vision",
    "ar": "بصر",
    "alt": [],
    "cat": "root"
  },
  "baseerat": {
    "ro": "baseerat",
    "ur": "بصر",
    "en": "Seeing / Insight / Vision",
    "ar": "بصر",
    "alt": [],
    "cat": "root"
  },
  "nigah": {
    "ro": "nigah",
    "ur": "بصر",
    "en": "Seeing / Insight / Vision",
    "ar": "بصر",
    "alt": [],
    "cat": "root"
  },
  "rwd": {
    "ro": "rwd",
    "ur": "رود",
    "en": "Root: ر - و - د",
    "ar": "رود",
    "alt": [],
    "cat": "root"
  },
  "lqy": {
    "ro": "lqy",
    "ur": "لقي",
    "en": "Root: ل - ق - ي",
    "ar": "لقي",
    "alt": [],
    "cat": "root"
  },
  "dwn": {
    "ro": "dwn",
    "ur": "دون",
    "en": "Root: د - و - ن",
    "ar": "دون",
    "alt": [],
    "cat": "root"
  },
  "nem": {
    "ro": "nem",
    "ur": "نعم",
    "en": "Root: ن - ع - م",
    "ar": "نعم",
    "alt": [],
    "cat": "root"
  },
  "slm": {
    "ro": "slm",
    "ur": "سلم",
    "en": "Peace / Submission / Safety",
    "ar": "سلم",
    "alt": [],
    "cat": "root"
  },
  "salamati": {
    "ro": "salamati",
    "ur": "سلم",
    "en": "Peace / Submission / Safety",
    "ar": "سلم",
    "alt": [],
    "cat": "root"
  },
  "farmabardari": {
    "ro": "farmabardari",
    "ur": "سلم",
    "en": "Peace / Submission / Safety",
    "ar": "سلم",
    "alt": [],
    "cat": "root"
  },
  "dnw": {
    "ro": "dnw",
    "ur": "دنو",
    "en": "Root: د - ن - و",
    "ar": "دنو",
    "alt": [],
    "cat": "root"
  },
  "qdr": {
    "ro": "qdr",
    "ur": "قدر",
    "en": "Power / Decree / Measuring",
    "ar": "قدر",
    "alt": [],
    "cat": "root"
  },
  "qudrat": {
    "ro": "qudrat",
    "ur": "قدر",
    "en": "Power / Decree / Measuring",
    "ar": "قدر",
    "alt": [],
    "cat": "root"
  },
  "qadar": {
    "ro": "qadar",
    "ur": "قدر",
    "en": "Power / Decree / Measuring",
    "ar": "قدر",
    "alt": [],
    "cat": "root"
  },
  "andaza karna": {
    "ro": "andaza karna",
    "ur": "قدر",
    "en": "Power / Decree / Measuring",
    "ar": "قدر",
    "alt": [],
    "cat": "root"
  },
  "n*r": {
    "ro": "n*r",
    "ur": "نذر",
    "en": "Root: ن - ذ - ر",
    "ar": "نذر",
    "alt": [],
    "cat": "root"
  },
  "jme": {
    "ro": "jme",
    "ur": "جمع",
    "en": "Root: ج - م - ع",
    "ar": "جمع",
    "alt": [],
    "cat": "root"
  },
  "nzr": {
    "ro": "nzr",
    "ur": "نظر",
    "en": "Root: ن - ظ - ر",
    "ar": "نظر",
    "alt": [],
    "cat": "root"
  },
  "sal": {
    "ro": "sal",
    "ur": "سال",
    "en": "Root: س - ا - ل",
    "ar": "سال",
    "alt": [],
    "cat": "root"
  },
  "twe": {
    "ro": "twe",
    "ur": "طوع",
    "en": "Root: ط - و - ع",
    "ar": "طوع",
    "alt": [],
    "cat": "root"
  },
  "ezm": {
    "ro": "ezm",
    "ur": "عظم",
    "en": "Root: ع - ظ - م",
    "ar": "عظم",
    "alt": [],
    "cat": "root"
  },
  "xlf": {
    "ro": "xlf",
    "ur": "خلف",
    "en": "Root: خ - ل - ف",
    "ar": "خلف",
    "alt": [],
    "cat": "root"
  },
  "ahl": {
    "ro": "ahl",
    "ur": "اهل",
    "en": "Root: ا - ه - ل",
    "ar": "اهل",
    "alt": [],
    "cat": "root"
  },
  "dxl": {
    "ro": "dxl",
    "ur": "دخل",
    "en": "Root: د - خ - ل",
    "ar": "دخل",
    "alt": [],
    "cat": "root"
  },
  "xwf": {
    "ro": "xwf",
    "ur": "خوف",
    "en": "Fear / Dread / Awe",
    "ar": "خوف",
    "alt": [],
    "cat": "root"
  },
  "darna": {
    "ro": "darna",
    "ur": "خوف",
    "en": "Fear / Dread / Awe",
    "ar": "خوف",
    "alt": [],
    "cat": "root"
  },
  "dehshat": {
    "ro": "dehshat",
    "ur": "خوف",
    "en": "Fear / Dread / Awe",
    "ar": "خوف",
    "alt": [],
    "cat": "root"
  },
  "rzq": {
    "ro": "rzq",
    "ur": "رزق",
    "en": "Root: ر - ز - ق",
    "ar": "رزق",
    "alt": [],
    "cat": "root"
  },
  "b$r": {
    "ro": "b$r",
    "ur": "بشر",
    "en": "Root: ب - ش - ر",
    "ar": "بشر",
    "alt": [],
    "cat": "root"
  },
  "ydy": {
    "ro": "ydy",
    "ur": "يدي",
    "en": "Root: ي - د - ي",
    "ar": "يدي",
    "alt": [],
    "cat": "root"
  },
  "amm": {
    "ro": "amm",
    "ur": "امم",
    "en": "Root: ا - م - م",
    "ar": "امم",
    "alt": [],
    "cat": "root"
  },
  "ezz": {
    "ro": "ezz",
    "ur": "عزز",
    "en": "Might / Honor / Inviolability",
    "ar": "عزز",
    "alt": [],
    "cat": "root"
  },
  "izzat": {
    "ro": "izzat",
    "ur": "عزز",
    "en": "Might / Honor / Inviolability",
    "ar": "عزز",
    "alt": [],
    "cat": "root"
  },
  "ghalba": {
    "ro": "ghalba",
    "ur": "عزز",
    "en": "Might / Honor / Inviolability",
    "ar": "عزز",
    "alt": [],
    "cat": "root"
  },
  "zabardast": {
    "ro": "zabardast",
    "ur": "عزز",
    "en": "Might / Honor / Inviolability",
    "ar": "عزز",
    "alt": [],
    "cat": "root"
  },
  "jzy": {
    "ro": "jzy",
    "ur": "جزي",
    "en": "Recompense / Reward / Retribution",
    "ar": "جزي",
    "alt": [],
    "cat": "root"
  },
  "jaza dena": {
    "ro": "jaza dena",
    "ur": "جزي",
    "en": "Recompense / Reward / Retribution",
    "ar": "جزي",
    "alt": [],
    "cat": "root"
  },
  "badla dena": {
    "ro": "badla dena",
    "ur": "جزي",
    "en": "Recompense / Reward / Retribution",
    "ar": "جزي",
    "alt": [],
    "cat": "root"
  },
  "abw": {
    "ro": "abw",
    "ur": "ابو",
    "en": "Root: ا - ب - و",
    "ar": "ابو",
    "alt": [],
    "cat": "root"
  },
  "nhr": {
    "ro": "nhr",
    "ur": "نهر",
    "en": "Root: ن - ه - ر",
    "ar": "نهر",
    "alt": [],
    "cat": "root"
  },
  "nfq": {
    "ro": "nfq",
    "ur": "نفق",
    "en": "Root: ن - ف - ق",
    "ar": "نفق",
    "alt": [],
    "cat": "root"
  },
  "akl": {
    "ro": "akl",
    "ur": "اكل",
    "en": "Root: ا - ك - ل",
    "ar": "اكل",
    "alt": [],
    "cat": "root"
  },
  "hsb": {
    "ro": "hsb",
    "ur": "حسب",
    "en": "Reckoning / Account / Sufficiency",
    "ar": "حسب",
    "alt": [],
    "cat": "root"
  },
  "hisaab karna": {
    "ro": "hisaab karna",
    "ur": "حسب",
    "en": "Reckoning / Account / Sufficiency",
    "ar": "حسب",
    "alt": [],
    "cat": "root"
  },
  "kaafi hona": {
    "ro": "kaafi hona",
    "ur": "حسب",
    "en": "Reckoning / Account / Sufficiency",
    "ar": "حسب",
    "alt": [],
    "cat": "root"
  },
  "fel": {
    "ro": "fel",
    "ur": "فعل",
    "en": "Root: ف - ع - ل",
    "ar": "فعل",
    "alt": [],
    "cat": "root"
  },
  "ajr": {
    "ro": "ajr",
    "ur": "اجر",
    "en": "Root: ا - ج - ر",
    "ar": "اجر",
    "alt": [],
    "cat": "root"
  },
  "wjd": {
    "ro": "wjd",
    "ur": "وجد",
    "en": "Root: و - ج - د",
    "ar": "وجد",
    "alt": [],
    "cat": "root"
  },
  "edw": {
    "ro": "edw",
    "ur": "عدو",
    "en": "Root: ع - د - و",
    "ar": "عدو",
    "alt": [],
    "cat": "root"
  },
  "rje": {
    "ro": "rje",
    "ur": "رجع",
    "en": "To return / Come back",
    "ar": "رجع",
    "alt": [],
    "cat": "root"
  },
  "lautna": {
    "ro": "lautna",
    "ur": "رجع",
    "en": "To return / Come back",
    "ar": "رجع",
    "alt": [],
    "cat": "root"
  },
  "wapas aana": {
    "ro": "wapas aana",
    "ur": "رجع",
    "en": "To return / Come back",
    "ar": "رجع",
    "alt": [],
    "cat": "root"
  },
  "rujoo": {
    "ro": "rujoo",
    "ur": "رجع",
    "en": "To return / Come back",
    "ar": "رجع",
    "alt": [],
    "cat": "root"
  },
  "fdl": {
    "ro": "fdl",
    "ur": "فضل",
    "en": "Grace / Bounty / Superiority",
    "ar": "فضل",
    "alt": [],
    "cat": "root"
  },
  "fazl": {
    "ro": "fazl",
    "ur": "فضل",
    "en": "Grace / Bounty / Superiority",
    "ar": "فضل",
    "alt": [],
    "cat": "root"
  },
  "bartari": {
    "ro": "bartari",
    "ur": "فضل",
    "en": "Grace / Bounty / Superiority",
    "ar": "فضل",
    "alt": [],
    "cat": "root"
  },
  "sbr": {
    "ro": "sbr",
    "ur": "صبر",
    "en": "Patience / Endurance / Restraint",
    "ar": "صبر",
    "alt": [],
    "cat": "root"
  },
  "sabr karna": {
    "ro": "sabr karna",
    "ur": "صبر",
    "en": "Patience / Endurance / Restraint",
    "ar": "صبر",
    "alt": [],
    "cat": "root"
  },
  "bardasht": {
    "ro": "bardasht",
    "ur": "صبر",
    "en": "Patience / Endurance / Restraint",
    "ar": "صبر",
    "alt": [],
    "cat": "root"
  },
  "a*n": {
    "ro": "a*n",
    "ur": "اذن",
    "en": "Ear / Permission / Announcement",
    "ar": "اذن",
    "alt": [],
    "cat": "root"
  },
  "ijazat dena": {
    "ro": "ijazat dena",
    "ur": "اذن",
    "en": "Ear / Permission / Announcement",
    "ar": "اذن",
    "alt": [],
    "cat": "root"
  },
  "$dd": {
    "ro": "$dd",
    "ur": "شدد",
    "en": "Root: ش - د - د",
    "ar": "شدد",
    "alt": [],
    "cat": "root"
  },
  "wld": {
    "ro": "wld",
    "ur": "ولد",
    "en": "Root: و - ل - د",
    "ar": "ولد",
    "alt": [],
    "cat": "root"
  },
  "dyn": {
    "ro": "dyn",
    "ur": "دين",
    "en": "Root: د - ي - ن",
    "ar": "دين",
    "alt": [],
    "cat": "root"
  },
  "slw": {
    "ro": "slw",
    "ur": "صلو",
    "en": "Prayer / Blessings / Supplication",
    "ar": "صلو",
    "alt": [],
    "cat": "root"
  },
  "shb": {
    "ro": "shb",
    "ur": "صحب",
    "en": "Root: ص - ح - ب",
    "ar": "صحب",
    "alt": [],
    "cat": "root"
  },
  "ans": {
    "ro": "ans",
    "ur": "انس",
    "en": "Root: ا - ن - س",
    "ar": "انس",
    "alt": [],
    "cat": "root"
  },
  "qrb": {
    "ro": "qrb",
    "ur": "قرب",
    "en": "Root: ق - ر - ب",
    "ar": "قرب",
    "alt": [],
    "cat": "root"
  },
  "bgy": {
    "ro": "bgy",
    "ur": "بغي",
    "en": "Root: ب - غ - ي",
    "ar": "بغي",
    "alt": [],
    "cat": "root"
  },
  "axw": {
    "ro": "axw",
    "ur": "اخو",
    "en": "Root: ا - خ - و",
    "ar": "اخو",
    "alt": [],
    "cat": "root"
  },
  "hbb": {
    "ro": "hbb",
    "ur": "حبب",
    "en": "Love / Affection / Beloved",
    "ar": "حبب",
    "alt": [],
    "cat": "root"
  },
  "muhabbat karna": {
    "ro": "muhabbat karna",
    "ur": "حبب",
    "en": "Love / Affection / Beloved",
    "ar": "حبب",
    "alt": [],
    "cat": "root"
  },
  "pyar": {
    "ro": "pyar",
    "ur": "حبب",
    "en": "Love / Affection / Beloved",
    "ar": "حبب",
    "alt": [],
    "cat": "root"
  },
  "sbh": {
    "ro": "sbh",
    "ur": "سبح",
    "en": "Root: س - ب - ح",
    "ar": "سبح",
    "alt": [],
    "cat": "root"
  },
  "sjd": {
    "ro": "sjd",
    "ur": "سجد",
    "en": "Root: س - ج - د",
    "ar": "سجد",
    "alt": [],
    "cat": "root"
  },
  "lyl": {
    "ro": "lyl",
    "ur": "ليل",
    "en": "Root: ل - ي - ل",
    "ar": "ليل",
    "alt": [],
    "cat": "root"
  },
  "lys": {
    "ro": "lys",
    "ur": "ليس",
    "en": "Root: ل - ي - س",
    "ar": "ليس",
    "alt": [],
    "cat": "root"
  },
  "$tn": {
    "ro": "$tn",
    "ur": "شطن",
    "en": "Root: ش - ط - ن",
    "ar": "شطن",
    "alt": [],
    "cat": "root"
  },
  "qra": {
    "ro": "qra",
    "ur": "قرا",
    "en": "Root: ق - ر - ا",
    "ar": "قرا",
    "alt": [],
    "cat": "root"
  },
  "xld": {
    "ro": "xld",
    "ur": "خلد",
    "en": "Eternity / Abiding forever",
    "ar": "خلد",
    "alt": [],
    "cat": "root"
  },
  "hameshgi": {
    "ro": "hameshgi",
    "ur": "خلد",
    "en": "Eternity / Abiding forever",
    "ar": "خلد",
    "alt": [],
    "cat": "root"
  },
  "hamesha rehna": {
    "ro": "hamesha rehna",
    "ur": "خلد",
    "en": "Eternity / Abiding forever",
    "ar": "خلد",
    "alt": [],
    "cat": "root"
  },
  "twb": {
    "ro": "twb",
    "ur": "توب",
    "en": "Repentance / Turning back",
    "ar": "توب",
    "alt": [],
    "cat": "root"
  },
  "tawbah karna": {
    "ro": "tawbah karna",
    "ur": "توب",
    "en": "Repentance / Turning back",
    "ar": "توب",
    "alt": [],
    "cat": "root"
  },
  "rujoo karna": {
    "ro": "rujoo karna",
    "ur": "توب",
    "en": "Repentance / Turning back",
    "ar": "توب",
    "alt": [],
    "cat": "root"
  },
  "mwl": {
    "ro": "mwl",
    "ur": "مول",
    "en": "Root: م - و - ل",
    "ar": "مول",
    "alt": [],
    "cat": "root"
  },
  "njw": {
    "ro": "njw",
    "ur": "نجو",
    "en": "Root: ن - ج - و",
    "ar": "نجو",
    "alt": [],
    "cat": "root"
  },
  "swy": {
    "ro": "swy",
    "ur": "سوي",
    "en": "Root: س - و - ي",
    "ar": "سوي",
    "alt": [],
    "cat": "root"
  },
  "kyf": {
    "ro": "kyf",
    "ur": "كيف",
    "en": "Root: ك - ي - ف",
    "ar": "كيف",
    "alt": [],
    "cat": "root"
  },
  "hrm": {
    "ro": "hrm",
    "ur": "حرم",
    "en": "Root: ح - ر - م",
    "ar": "حرم",
    "alt": [],
    "cat": "root"
  },
  "zwj": {
    "ro": "zwj",
    "ur": "زوج",
    "en": "Root: ز - و - ج",
    "ar": "زوج",
    "alt": [],
    "cat": "root"
  },
  "eqb": {
    "ro": "eqb",
    "ur": "عقب",
    "en": "Root: ع - ق - ب",
    "ar": "عقب",
    "alt": [],
    "cat": "root"
  },
  "erd": {
    "ro": "erd",
    "ur": "عرض",
    "en": "Root: ع - ر - ض",
    "ar": "عرض",
    "alt": [],
    "cat": "root"
  },
  "wjh": {
    "ro": "wjh",
    "ur": "وجه",
    "en": "Face / Countenance / Direction",
    "ar": "وجه",
    "alt": [],
    "cat": "root"
  },
  "mutawajjah hona": {
    "ro": "mutawajjah hona",
    "ur": "وجه",
    "en": "Face / Countenance / Direction",
    "ar": "وجه",
    "alt": [],
    "cat": "root"
  },
  "why": {
    "ro": "why",
    "ur": "وحي",
    "en": "Root: و - ح - ي",
    "ar": "وحي",
    "alt": [],
    "cat": "root"
  },
  "swb": {
    "ro": "swb",
    "ur": "صوب",
    "en": "Root: ص - و - ب",
    "ar": "صوب",
    "alt": [],
    "cat": "root"
  },
  "blg": {
    "ro": "blg",
    "ur": "بلغ",
    "en": "Root: ب - ل - غ",
    "ar": "بلغ",
    "alt": [],
    "cat": "root"
  },
  "qll": {
    "ro": "qll",
    "ur": "قلل",
    "en": "Root: ق - ل - ل",
    "ar": "قلل",
    "alt": [],
    "cat": "root"
  },
  "alm": {
    "ro": "alm",
    "ur": "الم",
    "en": "Root: ا - ل - م",
    "ar": "الم",
    "alt": [],
    "cat": "root"
  },
  "klm": {
    "ro": "klm",
    "ur": "كلم",
    "en": "Root: ك - ل - م",
    "ar": "كلم",
    "alt": [],
    "cat": "root"
  },
  "$kr": {
    "ro": "$kr",
    "ur": "شكر",
    "en": "Gratitude / Thankfulness",
    "ar": "شكر",
    "alt": [],
    "cat": "root"
  },
  "shukr karna": {
    "ro": "shukr karna",
    "ur": "شكر",
    "en": "Gratitude / Thankfulness",
    "ar": "شكر",
    "alt": [],
    "cat": "root"
  },
  "ahsan manna": {
    "ro": "ahsan manna",
    "ur": "شكر",
    "en": "Gratitude / Thankfulness",
    "ar": "شكر",
    "alt": [],
    "cat": "root"
  },
  "drr": {
    "ro": "drr",
    "ur": "ضرر",
    "en": "Harm / Adversity / Damage",
    "ar": "ضرر",
    "alt": [],
    "cat": "root"
  },
  "nuqsaan": {
    "ro": "nuqsaan",
    "ur": "ضرر",
    "en": "Harm / Adversity / Damage",
    "ar": "ضرر",
    "alt": [],
    "cat": "root"
  },
  "nuqsan pohanchana": {
    "ro": "nuqsan pohanchana",
    "ur": "ضرر",
    "en": "Harm / Adversity / Damage",
    "ar": "ضرر",
    "alt": [],
    "cat": "root"
  },
  "bas": {
    "ro": "bas",
    "ur": "باس",
    "en": "Root: ب - ا - س",
    "ar": "باس",
    "alt": [],
    "cat": "root"
  },
  "rdw": {
    "ro": "rdw",
    "ur": "رضو",
    "en": "Root: ر - ض - و",
    "ar": "رضو",
    "alt": [],
    "cat": "root"
  },
  "byt": {
    "ro": "byt",
    "ur": "بيت",
    "en": "House / Shelter / Night",
    "ar": "بيت",
    "alt": [],
    "cat": "root"
  },
  "ghar": {
    "ro": "ghar",
    "ur": "بيت",
    "en": "House / Shelter / Night",
    "ar": "بيت",
    "alt": [],
    "cat": "root"
  },
  "bayt": {
    "ro": "bayt",
    "ur": "بيت",
    "en": "House / Shelter / Night",
    "ar": "بيت",
    "alt": [],
    "cat": "root"
  },
  "raat guzarna": {
    "ro": "raat guzarna",
    "ur": "بيت",
    "en": "House / Shelter / Night",
    "ar": "بيت",
    "alt": [],
    "cat": "root"
  },
  "rjl": {
    "ro": "rjl",
    "ur": "رجل",
    "en": "Root: ر - ج - ل",
    "ar": "رجل",
    "alt": [],
    "cat": "root"
  },
  "gny": {
    "ro": "gny",
    "ur": "غني",
    "en": "Self-Sufficiency / Wealth",
    "ar": "غني",
    "alt": [],
    "cat": "root"
  },
  "be-niyazi": {
    "ro": "be-niyazi",
    "ur": "غني",
    "en": "Self-Sufficiency / Wealth",
    "ar": "غني",
    "alt": [],
    "cat": "root"
  },
  "maaldari": {
    "ro": "maaldari",
    "ur": "غني",
    "en": "Self-Sufficiency / Wealth",
    "ar": "غني",
    "alt": [],
    "cat": "root"
  },
  "ghani": {
    "ro": "ghani",
    "ur": "غني",
    "en": "Self-Sufficiency / Wealth",
    "ar": "غني",
    "alt": [],
    "cat": "root"
  },
  "frq": {
    "ro": "frq",
    "ur": "فرق",
    "en": "Division / Separation / Criterion",
    "ar": "فرق",
    "alt": [],
    "cat": "root"
  },
  "juda karna": {
    "ro": "juda karna",
    "ur": "فرق",
    "en": "Division / Separation / Criterion",
    "ar": "فرق",
    "alt": [],
    "cat": "root"
  },
  "farq karna": {
    "ro": "farq karna",
    "ur": "فرق",
    "en": "Division / Separation / Criterion",
    "ar": "فرق",
    "alt": [],
    "cat": "root"
  },
  "furqan": {
    "ro": "furqan",
    "ur": "فرق",
    "en": "Division / Separation / Criterion",
    "ar": "فرق",
    "alt": [],
    "cat": "root"
  },
  "ymn": {
    "ro": "ymn",
    "ur": "يمن",
    "en": "Root: ي - م - ن",
    "ar": "يمن",
    "alt": [],
    "cat": "root"
  },
  "mte": {
    "ro": "mte",
    "ur": "متع",
    "en": "Root: م - ت - ع",
    "ar": "متع",
    "alt": [],
    "cat": "root"
  },
  "erf": {
    "ro": "erf",
    "ur": "عرف",
    "en": "Root: ع - ر - ف",
    "ar": "عرف",
    "alt": [],
    "cat": "root"
  },
  "elw": {
    "ro": "elw",
    "ur": "علو",
    "en": "Root: ع - ل - و",
    "ar": "علو",
    "alt": [],
    "cat": "root"
  },
  "wkl": {
    "ro": "wkl",
    "ur": "وكل",
    "en": "Root: و - ك - ل",
    "ar": "وكل",
    "alt": [],
    "cat": "root"
  },
  "skn": {
    "ro": "skn",
    "ur": "سكن",
    "en": "Root: س - ك - ن",
    "ar": "سكن",
    "alt": [],
    "cat": "root"
  },
  "znn": {
    "ro": "znn",
    "ur": "ظنن",
    "en": "Assumption / Thought / Conjecture",
    "ar": "ظنن",
    "alt": [],
    "cat": "root"
  },
  "gumaan karna": {
    "ro": "gumaan karna",
    "ur": "ظنن",
    "en": "Assumption / Thought / Conjecture",
    "ar": "ظنن",
    "alt": [],
    "cat": "root"
  },
  "khayal": {
    "ro": "khayal",
    "ur": "ظنن",
    "en": "Assumption / Thought / Conjecture",
    "ar": "ظنن",
    "alt": [],
    "cat": "root"
  },
  "whd": {
    "ro": "whd",
    "ur": "وحد",
    "en": "Root: و - ح - د",
    "ar": "وحد",
    "alt": [],
    "cat": "root"
  },
  "hlk": {
    "ro": "hlk",
    "ur": "هلك",
    "en": "Root: ه - ل - ك",
    "ar": "هلك",
    "alt": [],
    "cat": "root"
  },
  "bev": {
    "ro": "bev",
    "ur": "بعث",
    "en": "Root: ب - ع - ث",
    "ar": "بعث",
    "alt": [],
    "cat": "root"
  },
  "ksb": {
    "ro": "ksb",
    "ur": "كسب",
    "en": "Root: ك - س - ب",
    "ar": "كسب",
    "alt": [],
    "cat": "root"
  },
  "wfy": {
    "ro": "wfy",
    "ur": "وفي",
    "en": "Root: و - ف - ي",
    "ar": "وفي",
    "alt": [],
    "cat": "root"
  },
  "jrm": {
    "ro": "jrm",
    "ur": "جرم",
    "en": "Root: ج - ر - م",
    "ar": "جرم",
    "alt": [],
    "cat": "root"
  },
  "xsr": {
    "ro": "xsr",
    "ur": "خسر",
    "en": "Loss / Destruction / Ruin",
    "ar": "خسر",
    "alt": [],
    "cat": "root"
  },
  "khusara": {
    "ro": "khusara",
    "ur": "خسر",
    "en": "Loss / Destruction / Ruin",
    "ar": "خسر",
    "alt": [],
    "cat": "root"
  },
  "barbaadi": {
    "ro": "barbaadi",
    "ur": "خسر",
    "en": "Loss / Destruction / Ruin",
    "ar": "خسر",
    "alt": [],
    "cat": "root"
  },
  "eyn": {
    "ro": "eyn",
    "ur": "عين",
    "en": "Eye / Spring of water",
    "ar": "عين",
    "alt": [],
    "cat": "root"
  },
  "chashma": {
    "ro": "chashma",
    "ur": "عين",
    "en": "Eye / Spring of water",
    "ar": "عين",
    "alt": [],
    "cat": "root"
  },
  "jry": {
    "ro": "jry",
    "ur": "جري",
    "en": "Root: ج - ر - ي",
    "ar": "جري",
    "alt": [],
    "cat": "root"
  },
  "hml": {
    "ro": "hml",
    "ur": "حمل",
    "en": "Root: ح - م - ل",
    "ar": "حمل",
    "alt": [],
    "cat": "root"
  },
  "hmd": {
    "ro": "hmd",
    "ur": "حمد",
    "en": "Root: ح - م - د",
    "ar": "حمد",
    "alt": [],
    "cat": "root"
  },
  "mwh": {
    "ro": "mwh",
    "ur": "موه",
    "en": "Root: م - و - ه",
    "ar": "موه",
    "alt": [],
    "cat": "root"
  },
  "tlw": {
    "ro": "tlw",
    "ur": "تلو",
    "en": "Root: ت - ل - و",
    "ar": "تلو",
    "alt": [],
    "cat": "root"
  },
  "shr": {
    "ro": "shr",
    "ur": "سحر",
    "en": "Root: س - ح - ر",
    "ar": "سحر",
    "alt": [],
    "cat": "root"
  },
  "qdy": {
    "ro": "qdy",
    "ur": "قضي",
    "en": "Root: ق - ض - ي",
    "ar": "قضي",
    "alt": [],
    "cat": "root"
  },
  "ewd": {
    "ro": "ewd",
    "ur": "عود",
    "en": "Returning / Repeating",
    "ar": "عود",
    "alt": [],
    "cat": "root"
  },
  "dohrana": {
    "ro": "dohrana",
    "ur": "عود",
    "en": "Returning / Repeating",
    "ar": "عود",
    "alt": [],
    "cat": "root"
  },
  "*wq": {
    "ro": "*wq",
    "ur": "ذوق",
    "en": "Root: ذ - و - ق",
    "ar": "ذوق",
    "alt": [],
    "cat": "root"
  },
  "zyd": {
    "ro": "zyd",
    "ur": "زيد",
    "en": "Root: ز - ي - د",
    "ar": "زيد",
    "alt": [],
    "cat": "root"
  },
  "mss": {
    "ro": "mss",
    "ur": "مسس",
    "en": "Root: م - س - س",
    "ar": "مسس",
    "alt": [],
    "cat": "root"
  },
  "gyb": {
    "ro": "gyb",
    "ur": "غيب",
    "en": "Root: غ - ي - ب",
    "ar": "غيب",
    "alt": [],
    "cat": "root"
  },
  "ftn": {
    "ro": "ftn",
    "ur": "فتن",
    "en": "Root: ف - ت - ن",
    "ar": "فتن",
    "alt": [],
    "cat": "root"
  },
  "fry": {
    "ro": "fry",
    "ur": "فري",
    "en": "Root: ف - ر - ي",
    "ar": "فري",
    "alt": [],
    "cat": "root"
  },
  "zkw": {
    "ro": "zkw",
    "ur": "زكو",
    "en": "Purification / Charity / Growth",
    "ar": "زكو",
    "alt": [],
    "cat": "root"
  },
  "paaki": {
    "ro": "paaki",
    "ur": "زكو",
    "en": "Purification / Charity / Growth",
    "ar": "زكو",
    "alt": [],
    "cat": "root"
  },
  "zakat dena": {
    "ro": "zakat dena",
    "ur": "زكو",
    "en": "Purification / Charity / Growth",
    "ar": "زكو",
    "alt": [],
    "cat": "root"
  },
  "barhna": {
    "ro": "barhna",
    "ur": "زكو",
    "en": "Purification / Charity / Growth",
    "ar": "زكو",
    "alt": [],
    "cat": "root"
  },
  "nsw": {
    "ro": "nsw",
    "ur": "نسو",
    "en": "Root: ن - س - و",
    "ar": "نسو",
    "alt": [],
    "cat": "root"
  },
  "zhr": {
    "ro": "zhr",
    "ur": "ظهر",
    "en": "Root: ظ - ه - ر",
    "ar": "ظهر",
    "alt": [],
    "cat": "root"
  },
  "rdd": {
    "ro": "rdd",
    "ur": "ردد",
    "en": "Root: ر - د - د",
    "ar": "ردد",
    "alt": [],
    "cat": "root"
  },
  "drb": {
    "ro": "drb",
    "ur": "ضرب",
    "en": "Root: ض - ر - ب",
    "ar": "ضرب",
    "alt": [],
    "cat": "root"
  },
  "edd": {
    "ro": "edd",
    "ur": "عدد",
    "en": "Root: ع - د - د",
    "ar": "عدد",
    "alt": [],
    "cat": "root"
  },
  "qry": {
    "ro": "qry",
    "ur": "قري",
    "en": "Root: ق - ر - ي",
    "ar": "قري",
    "alt": [],
    "cat": "root"
  },
  "rwh": {
    "ro": "rwh",
    "ur": "روح",
    "en": "Root: ر - و - ح",
    "ar": "روح",
    "alt": [],
    "cat": "root"
  },
  "*hb": {
    "ro": "*hb",
    "ur": "ذهب",
    "en": "Root: ذ - ه - ب",
    "ar": "ذهب",
    "alt": [],
    "cat": "root"
  },
  "nhy": {
    "ro": "nhy",
    "ur": "نهي",
    "en": "Root: ن - ه - ي",
    "ar": "نهي",
    "alt": [],
    "cat": "root"
  },
  "ajl": {
    "ro": "ajl",
    "ur": "اجل",
    "en": "Root: ا - ج - ل",
    "ar": "اجل",
    "alt": [],
    "cat": "root"
  },
  "dwr": {
    "ro": "dwr",
    "ur": "دور",
    "en": "Root: د - و - ر",
    "ar": "دور",
    "alt": [],
    "cat": "root"
  },
  "fsq": {
    "ro": "fsq",
    "ur": "فسق",
    "en": "Root: ف - س - ق",
    "ar": "فسق",
    "alt": [],
    "cat": "root"
  },
  "ndw": {
    "ro": "ndw",
    "ur": "ندو",
    "en": "Root: ن - د - و",
    "ar": "ندو",
    "alt": [],
    "cat": "root"
  },
  "xbr": {
    "ro": "xbr",
    "ur": "خبر",
    "en": "Root: خ - ب - ر",
    "ar": "خبر",
    "alt": [],
    "cat": "root"
  },
  "def": {
    "ro": "def",
    "ur": "ضعف",
    "en": "Root: ض - ع - ف",
    "ar": "ضعف",
    "alt": [],
    "cat": "root"
  },
  "tht": {
    "ro": "tht",
    "ur": "تحت",
    "en": "Root: ت - ح - ت",
    "ar": "تحت",
    "alt": [],
    "cat": "root"
  },
  "hll": {
    "ro": "hll",
    "ur": "حلل",
    "en": "Root: ح - ل - ل",
    "ar": "حلل",
    "alt": [],
    "cat": "root"
  },
  "fsd": {
    "ro": "fsd",
    "ur": "فسد",
    "en": "Root: ف - س - د",
    "ar": "فسد",
    "alt": [],
    "cat": "root"
  },
  "tyb": {
    "ro": "tyb",
    "ur": "طيب",
    "en": "Root: ط - ي - ب",
    "ar": "طيب",
    "alt": [],
    "cat": "root"
  },
  "nfe": {
    "ro": "nfe",
    "ur": "نفع",
    "en": "Benefit / Profit / Advantage",
    "ar": "نفع",
    "alt": [],
    "cat": "root"
  },
  "nafa": {
    "ro": "nafa",
    "ur": "نفع",
    "en": "Benefit / Profit / Advantage",
    "ar": "نفع",
    "alt": [],
    "cat": "root"
  },
  "faida": {
    "ro": "faida",
    "ur": "نفع",
    "en": "Benefit / Profit / Advantage",
    "ar": "نفع",
    "alt": [],
    "cat": "root"
  },
  "eql": {
    "ro": "eql",
    "ur": "عقل",
    "en": "Root: ع - ق - ل",
    "ar": "عقل",
    "alt": [],
    "cat": "root"
  },
  "swe": {
    "ro": "swe",
    "ur": "سوع",
    "en": "Root: س - و - ع",
    "ar": "سوع",
    "alt": [],
    "cat": "root"
  },
  "tem": {
    "ro": "tem",
    "ur": "طعم",
    "en": "Root: ط - ع - م",
    "ar": "طعم",
    "alt": [],
    "cat": "root"
  },
  "x$y": {
    "ro": "x$y",
    "ur": "خشي",
    "en": "Root: خ - ش - ي",
    "ar": "خشي",
    "alt": [],
    "cat": "root"
  },
  "avm": {
    "ro": "avm",
    "ur": "اثم",
    "en": "Root: ا - ث - م",
    "ar": "اثم",
    "alt": [],
    "cat": "root"
  },
  "qdm": {
    "ro": "qdm",
    "ur": "قدم",
    "en": "Root: ق - د - م",
    "ar": "قدم",
    "alt": [],
    "cat": "root"
  },
  "ejl": {
    "ro": "ejl",
    "ur": "عجل",
    "en": "Root: ع - ج - ل",
    "ar": "عجل",
    "alt": [],
    "cat": "root"
  },
  "krm": {
    "ro": "krm",
    "ur": "كرم",
    "en": "Root: ك - ر - م",
    "ar": "كرم",
    "alt": [],
    "cat": "root"
  },
  "ehd": {
    "ro": "ehd",
    "ur": "عهد",
    "en": "Root: ع - ه - د",
    "ar": "عهد",
    "alt": [],
    "cat": "root"
  },
  "zyn": {
    "ro": "zyn",
    "ur": "زين",
    "en": "Root: ز - ي - ن",
    "ar": "زين",
    "alt": [],
    "cat": "root"
  },
  "sdr": {
    "ro": "sdr",
    "ur": "صدر",
    "en": "Chest / Breast / Source",
    "ar": "صدر",
    "alt": [],
    "cat": "root"
  },
  "aaghaz": {
    "ro": "aaghaz",
    "ur": "صدر",
    "en": "Chest / Breast / Source",
    "ar": "صدر",
    "alt": [],
    "cat": "root"
  },
  "srt": {
    "ro": "srt",
    "ur": "صرط",
    "en": "Root: ص - ر - ط",
    "ar": "صرط",
    "alt": [],
    "cat": "root"
  },
  "nsy": {
    "ro": "nsy",
    "ur": "نسي",
    "en": "Root: ن - س - ي",
    "ar": "نسي",
    "alt": [],
    "cat": "root"
  },
  "w*r": {
    "ro": "w*r",
    "ur": "وذر",
    "en": "Root: و - ذ - ر",
    "ar": "وذر",
    "alt": [],
    "cat": "root"
  },
  "bdl": {
    "ro": "bdl",
    "ur": "بدل",
    "en": "Root: ب - د - ل",
    "ar": "بدل",
    "alt": [],
    "cat": "root"
  },
  "srr": {
    "ro": "srr",
    "ur": "سرر",
    "en": "Root: س - ر - ر",
    "ar": "سرر",
    "alt": [],
    "cat": "root"
  },
  "ysr": {
    "ro": "ysr",
    "ur": "يسر",
    "en": "Root: ي - س - ر",
    "ar": "يسر",
    "alt": [],
    "cat": "root"
  },
  "hfz": {
    "ro": "hfz",
    "ur": "حفظ",
    "en": "Root: ح - ف - ظ",
    "ar": "حفظ",
    "alt": [],
    "cat": "root"
  },
  "dbr": {
    "ro": "dbr",
    "ur": "دبر",
    "en": "Root: د - ب - ر",
    "ar": "دبر",
    "alt": [],
    "cat": "root"
  },
  "trk": {
    "ro": "trk",
    "ur": "ترك",
    "en": "Root: ت - ر - ك",
    "ar": "ترك",
    "alt": [],
    "cat": "root"
  },
  "fwq": {
    "ro": "fwq",
    "ur": "فوق",
    "en": "Root: ف - و - ق",
    "ar": "فوق",
    "alt": [],
    "cat": "root"
  },
  "jwb": {
    "ro": "jwb",
    "ur": "جوب",
    "en": "To answer / Respond",
    "ar": "جوب",
    "alt": [],
    "cat": "root"
  },
  "jawab dena": {
    "ro": "jawab dena",
    "ur": "جوب",
    "en": "To answer / Respond",
    "ar": "جوب",
    "alt": [],
    "cat": "root"
  },
  "qubool karna": {
    "ro": "qubool karna",
    "ur": "جوب",
    "en": "To answer / Respond",
    "ar": "جوب",
    "alt": [],
    "cat": "root"
  },
  "h$r": {
    "ro": "h$r",
    "ur": "حشر",
    "en": "Root: ح - ش - ر",
    "ar": "حشر",
    "alt": [],
    "cat": "root"
  },
  "fsl": {
    "ro": "fsl",
    "ur": "فصل",
    "en": "Root: ف - ص - ل",
    "ar": "فصل",
    "alt": [],
    "cat": "root"
  },
  "mkr": {
    "ro": "mkr",
    "ur": "مكر",
    "en": "Root: م - ك - ر",
    "ar": "مكر",
    "alt": [],
    "cat": "root"
  },
  "hzn": {
    "ro": "hzn",
    "ur": "حزن",
    "en": "Grief / Sorrow / Sadness",
    "ar": "حزن",
    "alt": [],
    "cat": "root"
  },
  "udaasi": {
    "ro": "udaasi",
    "ur": "حزن",
    "en": "Grief / Sorrow / Sadness",
    "ar": "حزن",
    "alt": [],
    "cat": "root"
  },
  "ranjoor hona": {
    "ro": "ranjoor hona",
    "ur": "حزن",
    "en": "Grief / Sorrow / Sadness",
    "ar": "حزن",
    "alt": [],
    "cat": "root"
  },
  "bhr": {
    "ro": "bhr",
    "ur": "بحر",
    "en": "Root: ب - ح - ر",
    "ar": "بحر",
    "alt": [],
    "cat": "root"
  },
  "qwy": {
    "ro": "qwy",
    "ur": "قوي",
    "en": "Strength / Might / Firmness",
    "ar": "قوي",
    "alt": [],
    "cat": "root"
  },
  "taqat": {
    "ro": "taqat",
    "ur": "قوي",
    "en": "Strength / Might / Firmness",
    "ar": "قوي",
    "alt": [],
    "cat": "root"
  },
  "qawi hona": {
    "ro": "qawi hona",
    "ur": "قوي",
    "en": "Strength / Might / Firmness",
    "ar": "قوي",
    "alt": [],
    "cat": "root"
  },
  "zor": {
    "ro": "zor",
    "ur": "قوي",
    "en": "Strength / Might / Firmness",
    "ar": "قوي",
    "alt": [],
    "cat": "root"
  },
  "sxr": {
    "ro": "sxr",
    "ur": "سخر",
    "en": "Root: س - خ - ر",
    "ar": "سخر",
    "alt": [],
    "cat": "root"
  },
  "sdd": {
    "ro": "sdd",
    "ur": "صدد",
    "en": "Root: ص - د - د",
    "ar": "صدد",
    "alt": [],
    "cat": "root"
  },
  "len": {
    "ro": "len",
    "ur": "لعن",
    "en": "Root: ل - ع - ن",
    "ar": "لعن",
    "alt": [],
    "cat": "root"
  },
  "twf": {
    "ro": "twf",
    "ur": "طوف",
    "en": "Root: ط - و - ف",
    "ar": "طوف",
    "alt": [],
    "cat": "root"
  },
  "krh": {
    "ro": "krh",
    "ur": "كره",
    "en": "Root: ك - ر - ه",
    "ar": "كره",
    "alt": [],
    "cat": "root"
  },
  "jhd": {
    "ro": "jhd",
    "ur": "جهد",
    "en": "Root: ج - ه - د",
    "ar": "جهد",
    "alt": [],
    "cat": "root"
  },
  "jbl": {
    "ro": "jbl",
    "ur": "جبل",
    "en": "Root: ج - ب - ل",
    "ar": "جبل",
    "alt": [],
    "cat": "root"
  },
  "flh": {
    "ro": "flh",
    "ur": "فلح",
    "en": "Root: ف - ل - ح",
    "ar": "فلح",
    "alt": [],
    "cat": "root"
  },
  "$er": {
    "ro": "$er",
    "ur": "شعر",
    "en": "Root: ش - ع - ر",
    "ar": "شعر",
    "alt": [],
    "cat": "root"
  },
  "mla": {
    "ro": "mla",
    "ur": "ملا",
    "en": "Root: م - ل - ا",
    "ar": "ملا",
    "alt": [],
    "cat": "root"
  },
  "tgy": {
    "ro": "tgy",
    "ur": "طغي",
    "en": "Root: ط - غ - ي",
    "ar": "طغي",
    "alt": [],
    "cat": "root"
  },
  "$rb": {
    "ro": "$rb",
    "ur": "شرب",
    "en": "Root: ش - ر - ب",
    "ar": "شرب",
    "alt": [],
    "cat": "root"
  },
  "*nb": {
    "ro": "*nb",
    "ur": "ذنب",
    "en": "Root: ذ - ن - ب",
    "ar": "ذنب",
    "alt": [],
    "cat": "root"
  },
  "slt": {
    "ro": "slt",
    "ur": "سلط",
    "en": "Root: س - ل - ط",
    "ar": "سلط",
    "alt": [],
    "cat": "root"
  },
  "qrr": {
    "ro": "qrr",
    "ur": "قرر",
    "en": "Steadiness / Settlement / Coolness",
    "ar": "قرر",
    "alt": [],
    "cat": "root"
  },
  "qarar": {
    "ro": "qarar",
    "ur": "قرر",
    "en": "Steadiness / Settlement / Coolness",
    "ar": "قرر",
    "alt": [],
    "cat": "root"
  },
  "thhehrna": {
    "ro": "thhehrna",
    "ur": "قرر",
    "en": "Steadiness / Settlement / Coolness",
    "ar": "قرر",
    "alt": [],
    "cat": "root"
  },
  "thandak": {
    "ro": "thandak",
    "ur": "قرر",
    "en": "Steadiness / Settlement / Coolness",
    "ar": "قرر",
    "alt": [],
    "cat": "root"
  },
  "blw": {
    "ro": "blw",
    "ur": "بلو",
    "en": "Root: ب - ل - و",
    "ar": "بلو",
    "alt": [],
    "cat": "root"
  },
  "fth": {
    "ro": "fth",
    "ur": "فتح",
    "en": "Root: ف - ت - ح",
    "ar": "فتح",
    "alt": [],
    "cat": "root"
  },
  "hwy": {
    "ro": "hwy",
    "ur": "هوي",
    "en": "Root: ه - و - ي",
    "ar": "هوي",
    "alt": [],
    "cat": "root"
  },
  "mra": {
    "ro": "mra",
    "ur": "مرا",
    "en": "Root: م - ر - ا",
    "ar": "مرا",
    "alt": [],
    "cat": "root"
  },
  "*rr": {
    "ro": "*rr",
    "ur": "ذرر",
    "en": "Root: ذ - ر - ر",
    "ar": "ذرر",
    "alt": [],
    "cat": "root"
  },
  "sbq": {
    "ro": "sbq",
    "ur": "سبق",
    "en": "Root: س - ب - ق",
    "ar": "سبق",
    "alt": [],
    "cat": "root"
  },
  "alw": {
    "ro": "alw",
    "ur": "الو",
    "en": "Root: ا - ل - و",
    "ar": "الو",
    "alt": [],
    "cat": "root"
  },
  "nkr": {
    "ro": "nkr",
    "ur": "نكر",
    "en": "Root: ن - ك - ر",
    "ar": "نكر",
    "alt": [],
    "cat": "root"
  },
  "ryb": {
    "ro": "ryb",
    "ur": "ريب",
    "en": "Root: ر - ي - ب",
    "ar": "ريب",
    "alt": [],
    "cat": "root"
  },
  "qte": {
    "ro": "qte",
    "ur": "قطع",
    "en": "Root: ق - ط - ع",
    "ar": "قطع",
    "alt": [],
    "cat": "root"
  },
  "btl": {
    "ro": "btl",
    "ur": "بطل",
    "en": "Root: ب - ط - ل",
    "ar": "بطل",
    "alt": [],
    "cat": "root"
  },
  "hdv": {
    "ro": "hdv",
    "ur": "حدث",
    "en": "Root: ح - د - ث",
    "ar": "حدث",
    "alt": [],
    "cat": "root"
  },
  "any": {
    "ro": "any",
    "ur": "اني",
    "en": "Root: ا - ن - ي",
    "ar": "اني",
    "alt": [],
    "cat": "root"
  },
  "awy": {
    "ro": "awy",
    "ur": "اوي",
    "en": "Root: ا - و - ي",
    "ar": "اوي",
    "alt": [],
    "cat": "root"
  },
  "qrn": {
    "ro": "qrn",
    "ur": "قرن",
    "en": "Root: ق - ر - ن",
    "ar": "قرن",
    "alt": [],
    "cat": "root"
  },
  "hyn": {
    "ro": "hyn",
    "ur": "حين",
    "en": "Root: ح - ي - ن",
    "ar": "حين",
    "alt": [],
    "cat": "root"
  },
  "efw": {
    "ro": "efw",
    "ur": "عفو",
    "en": "Root: ع - ف - و",
    "ar": "عفو",
    "alt": [],
    "cat": "root"
  },
  "gfl": {
    "ro": "gfl",
    "ur": "غفل",
    "en": "Root: غ - ف - ل",
    "ar": "غفل",
    "alt": [],
    "cat": "root"
  },
  "mrr": {
    "ro": "mrr",
    "ur": "مرر",
    "en": "Root: م - ر - ر",
    "ar": "مرر",
    "alt": [],
    "cat": "root"
  },
  "wrv": {
    "ro": "wrv",
    "ur": "ورث",
    "en": "Root: و - ر - ث",
    "ar": "ورث",
    "alt": [],
    "cat": "root"
  },
  "kyd": {
    "ro": "kyd",
    "ur": "كيد",
    "en": "Root: ك - ي - د",
    "ar": "كيد",
    "alt": [],
    "cat": "root"
  },
  "hza": {
    "ro": "hza",
    "ur": "هزا",
    "en": "Root: ه - ز - ا",
    "ar": "هزا",
    "alt": [],
    "cat": "root"
  },
  "wvq": {
    "ro": "wvq",
    "ur": "وثق",
    "en": "Root: و - ث - ق",
    "ar": "وثق",
    "alt": [],
    "cat": "root"
  },
  "jnh": {
    "ro": "jnh",
    "ur": "جنح",
    "en": "Root: ج - ن - ح",
    "ar": "جنح",
    "alt": [],
    "cat": "root"
  },
  "xfy": {
    "ro": "xfy",
    "ur": "خفي",
    "en": "Root: خ - ف - ي",
    "ar": "خفي",
    "alt": [],
    "cat": "root"
  },
  "emy": {
    "ro": "emy",
    "ur": "عمي",
    "en": "Root: ع - م - ي",
    "ar": "عمي",
    "alt": [],
    "cat": "root"
  },
  "zll": {
    "ro": "zll",
    "ur": "ظلل",
    "en": "Root: ظ - ل - ل",
    "ar": "ظلل",
    "alt": [],
    "cat": "root"
  },
  "hjj": {
    "ro": "hjj",
    "ur": "حجج",
    "en": "Pilgrimage / Contention",
    "ar": "حجج",
    "alt": [],
    "cat": "root"
  },
  "hajj karna": {
    "ro": "hajj karna",
    "ur": "حجج",
    "en": "Pilgrimage / Contention",
    "ar": "حجج",
    "alt": [],
    "cat": "root"
  },
  "dalael dena": {
    "ro": "dalael dena",
    "ur": "حجج",
    "en": "Pilgrimage / Contention",
    "ar": "حجج",
    "alt": [],
    "cat": "root"
  },
  "kfy": {
    "ro": "kfy",
    "ur": "كفي",
    "en": "Root: ك - ف - ي",
    "ar": "كفي",
    "alt": [],
    "cat": "root"
  },
  "$ms": {
    "ro": "$ms",
    "ur": "شمس",
    "en": "Root: ش - م - س",
    "ar": "شمس",
    "alt": [],
    "cat": "root"
  },
  "er$": {
    "ro": "er$",
    "ur": "عرش",
    "en": "Root: ع - ر - ش",
    "ar": "عرش",
    "alt": [],
    "cat": "root"
  },
  "jnb": {
    "ro": "jnb",
    "ur": "جنب",
    "en": "Root: ج - ن - ب",
    "ar": "جنب",
    "alt": [],
    "cat": "root"
  },
  "qsm": {
    "ro": "qsm",
    "ur": "قسم",
    "en": "Root: ق - س - م",
    "ar": "قسم",
    "alt": [],
    "cat": "root"
  },
  "mdd": {
    "ro": "mdd",
    "ur": "مدد",
    "en": "Root: م - د - د",
    "ar": "مدد",
    "alt": [],
    "cat": "root"
  },
  "brr": {
    "ro": "brr",
    "ur": "برر",
    "en": "Root: ب - ر - ر",
    "ar": "برر",
    "alt": [],
    "cat": "root"
  },
  "esy": {
    "ro": "esy",
    "ur": "عصي",
    "en": "Root: ع - ص - ي",
    "ar": "عصي",
    "alt": [],
    "cat": "root"
  },
  "wry": {
    "ro": "wry",
    "ur": "وري",
    "en": "Root: و - ر - ي",
    "ar": "وري",
    "alt": [],
    "cat": "root"
  },
  "wse": {
    "ro": "wse",
    "ur": "وسع",
    "en": "Root: و - س - ع",
    "ar": "وسع",
    "alt": [],
    "cat": "root"
  },
  "wsy": {
    "ro": "wsy",
    "ur": "وصي",
    "en": "Root: و - ص - ي",
    "ar": "وصي",
    "alt": [],
    "cat": "root"
  },
  "vlv": {
    "ro": "vlv",
    "ur": "ثلث",
    "en": "Root: ث - ل - ث",
    "ar": "ثلث",
    "alt": [],
    "cat": "root"
  },
  "nsb": {
    "ro": "nsb",
    "ur": "نصب",
    "en": "Root: ن - ص - ب",
    "ar": "نصب",
    "alt": [],
    "cat": "root"
  },
  "brk": {
    "ro": "brk",
    "ur": "برك",
    "en": "Root: ب - ر - ك",
    "ar": "برك",
    "alt": [],
    "cat": "root"
  },
  "thr": {
    "ro": "thr",
    "ur": "طهر",
    "en": "Root: ط - ه - ر",
    "ar": "طهر",
    "alt": [],
    "cat": "root"
  },
  "bdw": {
    "ro": "bdw",
    "ur": "بدو",
    "en": "Root: ب - د - و",
    "ar": "بدو",
    "alt": [],
    "cat": "root"
  },
  "hyv": {
    "ro": "hyv",
    "ur": "حيث",
    "en": "Root: ح - ي - ث",
    "ar": "حيث",
    "alt": [],
    "cat": "root"
  },
  "$fe": {
    "ro": "$fe",
    "ur": "شفع",
    "en": "Root: ش - ف - ع",
    "ar": "شفع",
    "alt": [],
    "cat": "root"
  },
  "bra": {
    "ro": "bra",
    "ur": "برا",
    "en": "Root: ب - ر - ا",
    "ar": "برا",
    "alt": [],
    "cat": "root"
  },
  "xls": {
    "ro": "xls",
    "ur": "خلص",
    "en": "Root: خ - ل - ص",
    "ar": "خلص",
    "alt": [],
    "cat": "root"
  },
  "qed": {
    "ro": "qed",
    "ur": "قعد",
    "en": "Root: ق - ع - د",
    "ar": "قعد",
    "alt": [],
    "cat": "root"
  },
  "$rr": {
    "ro": "$rr",
    "ur": "شرر",
    "en": "Root: ش - ر - ر",
    "ar": "شرر",
    "alt": [],
    "cat": "root"
  },
  "hjr": {
    "ro": "hjr",
    "ur": "هجر",
    "en": "Root: ه - ج - ر",
    "ar": "هجر",
    "alt": [],
    "cat": "root"
  },
  "glb": {
    "ro": "glb",
    "ur": "غلب",
    "en": "Root: غ - ل - ب",
    "ar": "غلب",
    "alt": [],
    "cat": "root"
  },
  "lbv": {
    "ro": "lbv",
    "ur": "لبث",
    "en": "Root: ل - ب - ث",
    "ar": "لبث",
    "alt": [],
    "cat": "root"
  },
  "sey": {
    "ro": "sey",
    "ur": "سعي",
    "en": "Root: س - ع - ي",
    "ar": "سعي",
    "alt": [],
    "cat": "root"
  },
  "srf": {
    "ro": "srf",
    "ur": "صرف",
    "en": "Root: ص - ر - ف",
    "ar": "صرف",
    "alt": [],
    "cat": "root"
  },
  "qss": {
    "ro": "qss",
    "ur": "قصص",
    "en": "Root: ق - ص - ص",
    "ar": "قصص",
    "alt": [],
    "cat": "root"
  },
  "anv": {
    "ro": "anv",
    "ur": "انث",
    "en": "Root: ا - ن - ث",
    "ar": "انث",
    "alt": [],
    "cat": "root"
  },
  "afk": {
    "ro": "afk",
    "ur": "افك",
    "en": "Root: ا - ف - ك",
    "ar": "افك",
    "alt": [],
    "cat": "root"
  },
  "g$w": {
    "ro": "g$w",
    "ur": "غشو",
    "en": "Root: غ - ش - و",
    "ar": "غشو",
    "alt": [],
    "cat": "root"
  },
  "vny": {
    "ro": "vny",
    "ur": "ثني",
    "en": "Root: ث - ن - ي",
    "ar": "ثني",
    "alt": [],
    "cat": "root"
  },
  "rfe": {
    "ro": "rfe",
    "ur": "رفع",
    "en": "Root: ر - ف - ع",
    "ar": "رفع",
    "alt": [],
    "cat": "root"
  },
  "wdd": {
    "ro": "wdd",
    "ur": "ودد",
    "en": "Root: و - د - د",
    "ar": "ودد",
    "alt": [],
    "cat": "root"
  },
  "syr": {
    "ro": "syr",
    "ur": "صير",
    "en": "Root: ص - ي - ر",
    "ar": "صير",
    "alt": [],
    "cat": "root"
  },
  "jdl": {
    "ro": "jdl",
    "ur": "جدل",
    "en": "Root: ج - د - ل",
    "ar": "جدل",
    "alt": [],
    "cat": "root"
  },
  "jnd": {
    "ro": "jnd",
    "ur": "جند",
    "en": "Root: ج - ن - د",
    "ar": "جند",
    "alt": [],
    "cat": "root"
  },
  "tyr": {
    "ro": "tyr",
    "ur": "طير",
    "en": "Root: ط - ي - ر",
    "ar": "طير",
    "alt": [],
    "cat": "root"
  },
  "fwz": {
    "ro": "fwz",
    "ur": "فوز",
    "en": "Root: ف - و - ز",
    "ar": "فوز",
    "alt": [],
    "cat": "root"
  },
  "dry": {
    "ro": "dry",
    "ur": "دري",
    "en": "Root: د - ر - ي",
    "ar": "دري",
    "alt": [],
    "cat": "root"
  },
  "yqn": {
    "ro": "yqn",
    "ur": "يقن",
    "en": "Certainty / Conviction",
    "ar": "يقن",
    "alt": [],
    "cat": "root"
  },
  "pukhta aitbaar": {
    "ro": "pukhta aitbaar",
    "ur": "يقن",
    "en": "Certainty / Conviction",
    "ar": "يقن",
    "alt": [],
    "cat": "root"
  },
  "xlw": {
    "ro": "xlw",
    "ur": "خلو",
    "en": "Root: خ - ل - و",
    "ar": "خلو",
    "alt": [],
    "cat": "root"
  },
  "hwt": {
    "ro": "hwt",
    "ur": "حوط",
    "en": "Root: ح - و - ط",
    "ar": "حوط",
    "alt": [],
    "cat": "root"
  },
  "sbe": {
    "ro": "sbe",
    "ur": "سبع",
    "en": "Root: س - ب - ع",
    "ar": "سبع",
    "alt": [],
    "cat": "root"
  },
  "edl": {
    "ro": "edl",
    "ur": "عدل",
    "en": "Justice / Fairness / Balance",
    "ar": "عدل",
    "alt": [],
    "cat": "root"
  },
  "insaaf": {
    "ro": "insaaf",
    "ur": "عدل",
    "en": "Justice / Fairness / Balance",
    "ar": "عدل",
    "alt": [],
    "cat": "root"
  },
  "barabari": {
    "ro": "barabari",
    "ur": "عدل",
    "en": "Justice / Fairness / Balance",
    "ar": "عدل",
    "alt": [],
    "cat": "root"
  },
  "$qq": {
    "ro": "$qq",
    "ur": "شقق",
    "en": "Root: ش - ق - ق",
    "ar": "شقق",
    "alt": [],
    "cat": "root"
  },
  "abd": {
    "ro": "abd",
    "ur": "ابد",
    "en": "Root: ا - ب - د",
    "ar": "ابد",
    "alt": [],
    "cat": "root"
  },
  "vwb": {
    "ro": "vwb",
    "ur": "ثوب",
    "en": "Root: ث - و - ب",
    "ar": "ثوب",
    "alt": [],
    "cat": "root"
  },
  "rjw": {
    "ro": "rjw",
    "ur": "رجو",
    "en": "Root: ر - ج - و",
    "ar": "رجو",
    "alt": [],
    "cat": "root"
  },
  "vql": {
    "ro": "vql",
    "ur": "ثقل",
    "en": "Root: ث - ق - ل",
    "ar": "ثقل",
    "alt": [],
    "cat": "root"
  },
  "n$a": {
    "ro": "n$a",
    "ur": "نشا",
    "en": "Root: ن - ش - ا",
    "ar": "نشا",
    "alt": [],
    "cat": "root"
  },
  "$jr": {
    "ro": "$jr",
    "ur": "شجر",
    "en": "Root: ش - ج - ر",
    "ar": "شجر",
    "alt": [],
    "cat": "root"
  },
  "mnn": {
    "ro": "mnn",
    "ur": "منن",
    "en": "Root: م - ن - ن",
    "ar": "منن",
    "alt": [],
    "cat": "root"
  },
  "bwb": {
    "ro": "bwb",
    "ur": "بوب",
    "en": "Root: ب - و - ب",
    "ar": "بوب",
    "alt": [],
    "cat": "root"
  },
  "e$r": {
    "ro": "e$r",
    "ur": "عشر",
    "en": "Root: ع - ش - ر",
    "ar": "عشر",
    "alt": [],
    "cat": "root"
  },
  "ejb": {
    "ro": "ejb",
    "ur": "عجب",
    "en": "Root: ع - ج - ب",
    "ar": "عجب",
    "alt": [],
    "cat": "root"
  },
  "msk": {
    "ro": "msk",
    "ur": "مسك",
    "en": "Root: م - س - ك",
    "ar": "مسك",
    "alt": [],
    "cat": "root"
  },
  "grr": {
    "ro": "grr",
    "ur": "غرر",
    "en": "Root: غ - ر - ر",
    "ar": "غرر",
    "alt": [],
    "cat": "root"
  },
  "wzr": {
    "ro": "wzr",
    "ur": "وزر",
    "en": "Root: و - ز - ر",
    "ar": "وزر",
    "alt": [],
    "cat": "root"
  },
  "qmr": {
    "ro": "qmr",
    "ur": "قمر",
    "en": "Root: ق - م - ر",
    "ar": "قمر",
    "alt": [],
    "cat": "root"
  },
  "nbt": {
    "ro": "nbt",
    "ur": "نبت",
    "en": "Root: ن - ب - ت",
    "ar": "نبت",
    "alt": [],
    "cat": "root"
  },
  "xzy": {
    "ro": "xzy",
    "ur": "خزي",
    "en": "Root: خ - ز - ي",
    "ar": "خزي",
    "alt": [],
    "cat": "root"
  },
  "hwn": {
    "ro": "hwn",
    "ur": "هون",
    "en": "Root: ه - و - ن",
    "ar": "هون",
    "alt": [],
    "cat": "root"
  },
  "jhm": {
    "ro": "jhm",
    "ur": "جحم",
    "en": "Root: ج - ح - م",
    "ar": "جحم",
    "alt": [],
    "cat": "root"
  },
  "wde": {
    "ro": "wde",
    "ur": "وضع",
    "en": "Root: و - ض - ع",
    "ar": "وضع",
    "alt": [],
    "cat": "root"
  },
  "ejz": {
    "ro": "ejz",
    "ur": "عجز",
    "en": "Root: ع - ج - ز",
    "ar": "عجز",
    "alt": [],
    "cat": "root"
  },
  "$ry": {
    "ro": "$ry",
    "ur": "شري",
    "en": "Root: ش - ر - ي",
    "ar": "شري",
    "alt": [],
    "cat": "root"
  },
  "hwl": {
    "ro": "hwl",
    "ur": "حول",
    "en": "Root: ح - و - ل",
    "ar": "حول",
    "alt": [],
    "cat": "root"
  },
  "sqy": {
    "ro": "sqy",
    "ur": "سقي",
    "en": "Root: س - ق - ي",
    "ar": "سقي",
    "alt": [],
    "cat": "root"
  },
  "wez": {
    "ro": "wez",
    "ur": "وعظ",
    "en": "Root: و - ع - ظ",
    "ar": "وعظ",
    "alt": [],
    "cat": "root"
  },
  "hdr": {
    "ro": "hdr",
    "ur": "حضر",
    "en": "Root: ح - ض - ر",
    "ar": "حضر",
    "alt": [],
    "cat": "root"
  },
  "flk": {
    "ro": "flk",
    "ur": "فلك",
    "en": "Root: ف - ل - ك",
    "ar": "فلك",
    "alt": [],
    "cat": "root"
  },
  "btn": {
    "ro": "btn",
    "ur": "بطن",
    "en": "Root: ب - ط - ن",
    "ar": "بطن",
    "alt": [],
    "cat": "root"
  },
  "hdd": {
    "ro": "hdd",
    "ur": "حدد",
    "en": "Root: ح - د - د",
    "ar": "حدد",
    "alt": [],
    "cat": "root"
  },
  "bst": {
    "ro": "bst",
    "ur": "بسط",
    "en": "Root: ب - س - ط",
    "ar": "بسط",
    "alt": [],
    "cat": "root"
  },
  "qst": {
    "ro": "qst",
    "ur": "قسط",
    "en": "Root: ق - س - ط",
    "ar": "قسط",
    "alt": [],
    "cat": "root"
  },
  "whb": {
    "ro": "whb",
    "ur": "وهب",
    "en": "Root: و - ه - ب",
    "ar": "وهب",
    "alt": [],
    "cat": "root"
  },
  "lsn": {
    "ro": "lsn",
    "ur": "لسن",
    "en": "Root: ل - س - ن",
    "ar": "لسن",
    "alt": [],
    "cat": "root"
  },
  "sly": {
    "ro": "sly",
    "ur": "صلي",
    "en": "Root: ص - ل - ي",
    "ar": "صلي",
    "alt": [],
    "cat": "root"
  },
  "gdb": {
    "ro": "gdb",
    "ur": "غضب",
    "en": "Root: غ - ض - ب",
    "ar": "غضب",
    "alt": [],
    "cat": "root"
  },
  "mrd": {
    "ro": "mrd",
    "ur": "مرض",
    "en": "Sickness / Disease / Malice",
    "ar": "مرض",
    "alt": [],
    "cat": "root"
  },
  "kwd": {
    "ro": "kwd",
    "ur": "كود",
    "en": "Root: ك - و - د",
    "ar": "كود",
    "alt": [],
    "cat": "root"
  },
  "vmr": {
    "ro": "vmr",
    "ur": "ثمر",
    "en": "Root: ث - م - ر",
    "ar": "ثمر",
    "alt": [],
    "cat": "root"
  },
  "fjr": {
    "ro": "fjr",
    "ur": "فجر",
    "en": "Root: ف - ج - ر",
    "ar": "فجر",
    "alt": [],
    "cat": "root"
  },
  "*ll": {
    "ro": "*ll",
    "ur": "ذلل",
    "en": "Root: ذ - ل - ل",
    "ar": "ذلل",
    "alt": [],
    "cat": "root"
  },
  "jhl": {
    "ro": "jhl",
    "ur": "جهل",
    "en": "Root: ج - ه - ل",
    "ar": "جهل",
    "alt": [],
    "cat": "root"
  },
  "emr": {
    "ro": "emr",
    "ur": "عمر",
    "en": "Root: ع - م - ر",
    "ar": "عمر",
    "alt": [],
    "cat": "root"
  },
  "fh$": {
    "ro": "fh$",
    "ur": "فحش",
    "en": "Root: ف - ح - ش",
    "ar": "فحش",
    "alt": [],
    "cat": "root"
  },
  "rqb": {
    "ro": "rqb",
    "ur": "رقب",
    "en": "Root: ر - ق - ب",
    "ar": "رقب",
    "alt": [],
    "cat": "root"
  },
  "a*y": {
    "ro": "a*y",
    "ur": "اذي",
    "en": "Root: ا - ذ - ي",
    "ar": "اذي",
    "alt": [],
    "cat": "root"
  },
  "wqe": {
    "ro": "wqe",
    "ur": "وقع",
    "en": "Root: و - ق - ع",
    "ar": "وقع",
    "alt": [],
    "cat": "root"
  },
  "m$y": {
    "ro": "m$y",
    "ur": "مشي",
    "en": "Root: م - ش - ي",
    "ar": "مشي",
    "alt": [],
    "cat": "root"
  },
  "lbs": {
    "ro": "lbs",
    "ur": "لبس",
    "en": "Root: ل - ب - س",
    "ar": "لبس",
    "alt": [],
    "cat": "root"
  },
  "grq": {
    "ro": "grq",
    "ur": "غرق",
    "en": "Root: غ - ر - ق",
    "ar": "غرق",
    "alt": [],
    "cat": "root"
  },
  "ytm": {
    "ro": "ytm",
    "ur": "يتم",
    "en": "Root: ي - ت - م",
    "ar": "يتم",
    "alt": [],
    "cat": "root"
  },
  "sre": {
    "ro": "sre",
    "ur": "سرع",
    "en": "Root: س - ر - ع",
    "ar": "سرع",
    "alt": [],
    "cat": "root"
  },
  "nkh": {
    "ro": "nkh",
    "ur": "نكح",
    "en": "Root: ن - ك - ح",
    "ar": "نكح",
    "alt": [],
    "cat": "root"
  },
  "tlq": {
    "ro": "tlq",
    "ur": "طلق",
    "en": "Root: ط - ل - ق",
    "ar": "طلق",
    "alt": [],
    "cat": "root"
  },
  "wzn": {
    "ro": "wzn",
    "ur": "وزن",
    "en": "Root: و - ز - ن",
    "ar": "وزن",
    "alt": [],
    "cat": "root"
  },
  "rbe": {
    "ro": "rbe",
    "ur": "ربع",
    "en": "Root: ر - ب - ع",
    "ar": "ربع",
    "alt": [],
    "cat": "root"
  },
  "xta": {
    "ro": "xta",
    "ur": "خطا",
    "en": "Root: خ - ط - ا",
    "ar": "خطا",
    "alt": [],
    "cat": "root"
  },
  "alf": {
    "ro": "alf",
    "ur": "الف",
    "en": "Root: ا - ل - ف",
    "ar": "الف",
    "alt": [],
    "cat": "root"
  },
  "tmm": {
    "ro": "tmm",
    "ur": "تمم",
    "en": "Root: ت - م - م",
    "ar": "تمم",
    "alt": [],
    "cat": "root"
  },
  "gwy": {
    "ro": "gwy",
    "ur": "غوي",
    "en": "Root: غ - و - ي",
    "ar": "غوي",
    "alt": [],
    "cat": "root"
  },
  "trb": {
    "ro": "trb",
    "ur": "ترب",
    "en": "Root: ت - ر - ب",
    "ar": "ترب",
    "alt": [],
    "cat": "root"
  },
  "frh": {
    "ro": "frh",
    "ur": "فرح",
    "en": "Joy / Delight / Exultation",
    "ar": "فرح",
    "alt": [],
    "cat": "root"
  },
  "shadmani": {
    "ro": "shadmani",
    "ur": "فرح",
    "en": "Joy / Delight / Exultation",
    "ar": "فرح",
    "alt": [],
    "cat": "root"
  },
  "itrana": {
    "ro": "itrana",
    "ur": "فرح",
    "en": "Joy / Delight / Exultation",
    "ar": "فرح",
    "alt": [],
    "cat": "root"
  },
  "erb": {
    "ro": "erb",
    "ur": "عرب",
    "en": "Root: ع - ر - ب",
    "ar": "عرب",
    "alt": [],
    "cat": "root"
  },
  "h*r": {
    "ro": "h*r",
    "ur": "حذر",
    "en": "Root: ح - ذ - ر",
    "ar": "حذر",
    "alt": [],
    "cat": "root"
  },
  "ktm": {
    "ro": "ktm",
    "ur": "كتم",
    "en": "Root: ك - ت - م",
    "ar": "كتم",
    "alt": [],
    "cat": "root"
  },
  "hwd": {
    "ro": "hwd",
    "ur": "هود",
    "en": "Root: ه - و - د",
    "ar": "هود",
    "alt": [],
    "cat": "root"
  },
  "mny": {
    "ro": "mny",
    "ur": "مني",
    "en": "Root: م - ن - ي",
    "ar": "مني",
    "alt": [],
    "cat": "root"
  },
  "$hr": {
    "ro": "$hr",
    "ur": "شهر",
    "en": "Root: ش - ه - ر",
    "ar": "شهر",
    "alt": [],
    "cat": "root"
  },
  "hlm": {
    "ro": "hlm",
    "ur": "حلم",
    "en": "Root: ح - ل - م",
    "ar": "حلم",
    "alt": [],
    "cat": "root"
  },
  "bqy": {
    "ro": "bqy",
    "ur": "بقي",
    "en": "Root: ب - ق - ي",
    "ar": "بقي",
    "alt": [],
    "cat": "root"
  },
  "snn": {
    "ro": "snn",
    "ur": "سنن",
    "en": "Root: س - ن - ن",
    "ar": "سنن",
    "alt": [],
    "cat": "root"
  },
  "fty": {
    "ro": "fty",
    "ur": "فتي",
    "en": "Root: ف - ت - ي",
    "ar": "فتي",
    "alt": [],
    "cat": "root"
  },
  "avr": {
    "ro": "avr",
    "ur": "اثر",
    "en": "Root: ا - ث - ر",
    "ar": "اثر",
    "alt": [],
    "cat": "root"
  },
  "hmm": {
    "ro": "hmm",
    "ur": "حمم",
    "en": "Root: ح - م - م",
    "ar": "حمم",
    "alt": [],
    "cat": "root"
  },
  "n$r": {
    "ro": "n$r",
    "ur": "نشر",
    "en": "Root: ن - ش - ر",
    "ar": "نشر",
    "alt": [],
    "cat": "root"
  },
  "snw": {
    "ro": "snw",
    "ur": "سنو",
    "en": "Root: س - ن - و",
    "ar": "سنو",
    "alt": [],
    "cat": "root"
  },
  "mry": {
    "ro": "mry",
    "ur": "مري",
    "en": "Root: م - ر - ي",
    "ar": "مري",
    "alt": [],
    "cat": "root"
  },
  "drj": {
    "ro": "drj",
    "ur": "درج",
    "en": "Root: د - ر - ج",
    "ar": "درج",
    "alt": [],
    "cat": "root"
  },
  "rbw": {
    "ro": "rbw",
    "ur": "ربو",
    "en": "Root: ر - ب - و",
    "ar": "ربو",
    "alt": [],
    "cat": "root"
  },
  "nxl": {
    "ro": "nxl",
    "ur": "نخل",
    "en": "Root: ن - خ - ل",
    "ar": "نخل",
    "alt": [],
    "cat": "root"
  },
  "nze": {
    "ro": "nze",
    "ur": "نزع",
    "en": "Root: ن - ز - ع",
    "ar": "نزع",
    "alt": [],
    "cat": "root"
  },
  "nfx": {
    "ro": "nfx",
    "ur": "نفخ",
    "en": "Root: ن - ف - خ",
    "ar": "نفخ",
    "alt": [],
    "cat": "root"
  },
  "fqh": {
    "ro": "fqh",
    "ur": "فقه",
    "en": "Root: ف - ق - ه",
    "ar": "فقه",
    "alt": [],
    "cat": "root"
  },
  "sne": {
    "ro": "sne",
    "ur": "صنع",
    "en": "Root: ص - ن - ع",
    "ar": "صنع",
    "alt": [],
    "cat": "root"
  },
  "hzb": {
    "ro": "hzb",
    "ur": "حزب",
    "en": "Root: ح - ز - ب",
    "ar": "حزب",
    "alt": [],
    "cat": "root"
  },
  "leb": {
    "ro": "leb",
    "ur": "لعب",
    "en": "Root: ل - ع - ب",
    "ar": "لعب",
    "alt": [],
    "cat": "root"
  },
  "ftr": {
    "ro": "ftr",
    "ur": "فطر",
    "en": "Root: ف - ط - ر",
    "ar": "فطر",
    "alt": [],
    "cat": "root"
  },
  "k$f": {
    "ro": "k$f",
    "ur": "كشف",
    "en": "Root: ك - ش - ف",
    "ar": "كشف",
    "alt": [],
    "cat": "root"
  },
  "vmn": {
    "ro": "vmn",
    "ur": "ثمن",
    "en": "Root: ث - م - ن",
    "ar": "ثمن",
    "alt": [],
    "cat": "root"
  },
  "grb": {
    "ro": "grb",
    "ur": "غرب",
    "en": "Root: غ - ر - ب",
    "ar": "غرب",
    "alt": [],
    "cat": "root"
  },
  "bld": {
    "ro": "bld",
    "ur": "بلد",
    "en": "Root: ب - ل - د",
    "ar": "بلد",
    "alt": [],
    "cat": "root"
  },
  "r$d": {
    "ro": "r$d",
    "ur": "رشد",
    "en": "Root: ر - ش - د",
    "ar": "رشد",
    "alt": [],
    "cat": "root"
  },
  "swr": {
    "ro": "swr",
    "ur": "صور",
    "en": "Root: ص - و - ر",
    "ar": "صور",
    "alt": [],
    "cat": "root"
  },
  "tle": {
    "ro": "tle",
    "ur": "طلع",
    "en": "Root: ط - ل - ع",
    "ar": "طلع",
    "alt": [],
    "cat": "root"
  },
  "ser": {
    "ro": "ser",
    "ur": "سعر",
    "en": "Root: س - ع - ر",
    "ar": "سعر",
    "alt": [],
    "cat": "root"
  },
  "fkh": {
    "ro": "fkh",
    "ur": "فكه",
    "en": "Root: ف - ك - ه",
    "ar": "فكه",
    "alt": [],
    "cat": "root"
  },
  "frd": {
    "ro": "frd",
    "ur": "فرض",
    "en": "Root: ف - ر - ض",
    "ar": "فرض",
    "alt": [],
    "cat": "root"
  },
  "mll": {
    "ro": "mll",
    "ur": "ملل",
    "en": "Root: م - ل - ل",
    "ar": "ملل",
    "alt": [],
    "cat": "root"
  },
  "dbb": {
    "ro": "dbb",
    "ur": "دبب",
    "en": "Root: د - ب - ب",
    "ar": "دبب",
    "alt": [],
    "cat": "root"
  },
  "ras": {
    "ro": "ras",
    "ur": "راس",
    "en": "Root: ر - ا - س",
    "ar": "راس",
    "alt": [],
    "cat": "root"
  },
  "xsm": {
    "ro": "xsm",
    "ur": "خصم",
    "en": "Root: خ - ص - م",
    "ar": "خصم",
    "alt": [],
    "cat": "root"
  },
  "fkr": {
    "ro": "fkr",
    "ur": "فكر",
    "en": "Root: ف - ك - ر",
    "ar": "فكر",
    "alt": [],
    "cat": "root"
  },
  "vbt": {
    "ro": "vbt",
    "ur": "ثبت",
    "en": "Root: ث - ب - ت",
    "ar": "ثبت",
    "alt": [],
    "cat": "root"
  },
  "ldn": {
    "ro": "ldn",
    "ur": "لدن",
    "en": "Root: ل - د - ن",
    "ar": "لدن",
    "alt": [],
    "cat": "root"
  },
  "nfr": {
    "ro": "nfr",
    "ur": "نفر",
    "en": "Root: ن - ف - ر",
    "ar": "نفر",
    "alt": [],
    "cat": "root"
  },
  "mkn": {
    "ro": "mkn",
    "ur": "مكن",
    "en": "Root: م - ك - ن",
    "ar": "مكن",
    "alt": [],
    "cat": "root"
  },
  "nwb": {
    "ro": "nwb",
    "ur": "نوب",
    "en": "Root: ن - و - ب",
    "ar": "نوب",
    "alt": [],
    "cat": "root"
  },
  "x$e": {
    "ro": "x$e",
    "ur": "خشع",
    "en": "Root: خ - ش - ع",
    "ar": "خشع",
    "alt": [],
    "cat": "root"
  },
  "bwa": {
    "ro": "bwa",
    "ur": "بوا",
    "en": "Root: ب - و - ا",
    "ar": "بوا",
    "alt": [],
    "cat": "root"
  },
  "ew*": {
    "ro": "ew*",
    "ur": "عوذ",
    "en": "Root: ع - و - ذ",
    "ar": "عوذ",
    "alt": [],
    "cat": "root"
  },
  "xff": {
    "ro": "xff",
    "ur": "خفف",
    "en": "Root: خ - ف - ف",
    "ar": "خفف",
    "alt": [],
    "cat": "root"
  },
  "mne": {
    "ro": "mne",
    "ur": "منع",
    "en": "Root: م - ن - ع",
    "ar": "منع",
    "alt": [],
    "cat": "root"
  },
  "$rq": {
    "ro": "$rq",
    "ur": "شرق",
    "en": "Root: ش - ر - ق",
    "ar": "شرق",
    "alt": [],
    "cat": "root"
  },
  "sfw": {
    "ro": "sfw",
    "ur": "صفو",
    "en": "Root: ص - ف - و",
    "ar": "صفو",
    "alt": [],
    "cat": "root"
  },
  "rbs": {
    "ro": "rbs",
    "ur": "ربص",
    "en": "Root: ر - ب - ص",
    "ar": "ربص",
    "alt": [],
    "cat": "root"
  },
  "nqm": {
    "ro": "nqm",
    "ur": "نقم",
    "en": "Root: ن - ق - م",
    "ar": "نقم",
    "alt": [],
    "cat": "root"
  },
  "awb": {
    "ro": "awb",
    "ur": "اوب",
    "en": "Root: ا - و - ب",
    "ar": "اوب",
    "alt": [],
    "cat": "root"
  },
  "zem": {
    "ro": "zem",
    "ur": "زعم",
    "en": "Root: ز - ع - م",
    "ar": "زعم",
    "alt": [],
    "cat": "root"
  },
  "swq": {
    "ro": "swq",
    "ur": "سوق",
    "en": "Root: س - و - ق",
    "ar": "سوق",
    "alt": [],
    "cat": "root"
  },
  "mdn": {
    "ro": "mdn",
    "ur": "مدن",
    "en": "Root: م - د - ن",
    "ar": "مدن",
    "alt": [],
    "cat": "root"
  },
  "jhr": {
    "ro": "jhr",
    "ur": "جهر",
    "en": "Root: ج - ه - ر",
    "ar": "جهر",
    "alt": [],
    "cat": "root"
  },
  "eln": {
    "ro": "eln",
    "ur": "علن",
    "en": "Root: ع - ل - ن",
    "ar": "علن",
    "alt": [],
    "cat": "root"
  },
  "lbb": {
    "ro": "lbb",
    "ur": "لبب",
    "en": "Root: ل - ب - ب",
    "ar": "لبب",
    "alt": [],
    "cat": "root"
  },
  "xwn": {
    "ro": "xwn",
    "ur": "خون",
    "en": "Root: خ - و - ن",
    "ar": "خون",
    "alt": [],
    "cat": "root"
  },
  "mhd": {
    "ro": "mhd",
    "ur": "مهد",
    "en": "Root: م - ه - د",
    "ar": "مهد",
    "alt": [],
    "cat": "root"
  },
  "hbt": {
    "ro": "hbt",
    "ur": "حبط",
    "en": "Root: ح - ب - ط",
    "ar": "حبط",
    "alt": [],
    "cat": "root"
  },
  "xbv": {
    "ro": "xbv",
    "ur": "خبث",
    "en": "Root: خ - ب - ث",
    "ar": "خبث",
    "alt": [],
    "cat": "root"
  },
  "gdw": {
    "ro": "gdw",
    "ur": "غدو",
    "en": "Root: غ - د - و",
    "ar": "غدو",
    "alt": [],
    "cat": "root"
  },
  "gll": {
    "ro": "gll",
    "ur": "غلل",
    "en": "Root: غ - ل - ل",
    "ar": "غلل",
    "alt": [],
    "cat": "root"
  },
  "etd": {
    "ro": "etd",
    "ur": "عتد",
    "en": "Root: ع - ت - د",
    "ar": "عتد",
    "alt": [],
    "cat": "root"
  },
  "str": {
    "ro": "str",
    "ur": "سطر",
    "en": "Root: س - ط - ر",
    "ar": "سطر",
    "alt": [],
    "cat": "root"
  },
  "lhw": {
    "ro": "lhw",
    "ur": "لهو",
    "en": "Root: ل - ه - و",
    "ar": "لهو",
    "alt": [],
    "cat": "root"
  },
  "fad": {
    "ro": "fad",
    "ur": "فاد",
    "en": "Root: ف - ا - د",
    "ar": "فاد",
    "alt": [],
    "cat": "root"
  },
  "kyl": {
    "ro": "kyl",
    "ur": "كيل",
    "en": "Root: ك - ي - ل",
    "ar": "كيل",
    "alt": [],
    "cat": "root"
  },
  "smm": {
    "ro": "smm",
    "ur": "صمم",
    "en": "Root: ص - م - م",
    "ar": "صمم",
    "alt": [],
    "cat": "root"
  },
  "swm": {
    "ro": "swm",
    "ur": "سوم",
    "en": "Fasting / Abstaining",
    "ar": "سوم",
    "alt": [],
    "cat": "root"
  },
  "hrr": {
    "ro": "hrr",
    "ur": "حرر",
    "en": "Root: ح - ر - ر",
    "ar": "حرر",
    "alt": [],
    "cat": "root"
  },
  "kff": {
    "ro": "kff",
    "ur": "كفف",
    "en": "Root: ك - ف - ف",
    "ar": "كفف",
    "alt": [],
    "cat": "root"
  },
  "rkb": {
    "ro": "rkb",
    "ur": "ركب",
    "en": "Root: ر - ك - ب",
    "ar": "ركب",
    "alt": [],
    "cat": "root"
  },
  "bye": {
    "ro": "bye",
    "ur": "بيع",
    "en": "Root: ب - ي - ع",
    "ar": "بيع",
    "alt": [],
    "cat": "root"
  },
  "hrj": {
    "ro": "hrj",
    "ur": "حرج",
    "en": "Root: ح - ر - ج",
    "ar": "حرج",
    "alt": [],
    "cat": "root"
  },
  "mtr": {
    "ro": "mtr",
    "ur": "مطر",
    "en": "Root: م - ط - ر",
    "ar": "مطر",
    "alt": [],
    "cat": "root"
  },
  "$kk": {
    "ro": "$kk",
    "ur": "شكك",
    "en": "Root: ش - ك - ك",
    "ar": "شكك",
    "alt": [],
    "cat": "root"
  },
  "bda": {
    "ro": "bda",
    "ur": "بدا",
    "en": "Beginning / Origin / Creating",
    "ar": "بدا",
    "alt": [],
    "cat": "root"
  },
  "shuru karna": {
    "ro": "shuru karna",
    "ur": "بدا",
    "en": "Beginning / Origin / Creating",
    "ar": "بدا",
    "alt": [],
    "cat": "root"
  },
  "ibtida karna": {
    "ro": "ibtida karna",
    "ur": "بدا",
    "en": "Beginning / Origin / Creating",
    "ar": "بدا",
    "alt": [],
    "cat": "root"
  },
  "hrv": {
    "ro": "hrv",
    "ur": "حرث",
    "en": "Root: ح - ر - ث",
    "ar": "حرث",
    "alt": [],
    "cat": "root"
  },
  "roza rakhna": {
    "ro": "roza rakhna",
    "ur": "صوم",
    "en": "Fasting / Abstaining",
    "ar": "صوم",
    "alt": [],
    "cat": "root"
  },
  "baaz rehna": {
    "ro": "baaz rehna",
    "ur": "صوم",
    "en": "Fasting / Abstaining",
    "ar": "صوم",
    "alt": [],
    "cat": "root"
  },
  "fqr": {
    "ro": "fqr",
    "ur": "فقر",
    "en": "Poverty / Neediness",
    "ar": "فقر",
    "alt": [],
    "cat": "root"
  },
  "faqr": {
    "ro": "faqr",
    "ur": "فقر",
    "en": "Poverty / Neediness",
    "ar": "فقر",
    "alt": [],
    "cat": "root"
  },
  "mohtaji": {
    "ro": "mohtaji",
    "ur": "فقر",
    "en": "Poverty / Neediness",
    "ar": "فقر",
    "alt": [],
    "cat": "root"
  },
  "ghurbat": {
    "ro": "ghurbat",
    "ur": "فقر",
    "en": "Poverty / Neediness",
    "ar": "فقر",
    "alt": [],
    "cat": "root"
  },
  "wlj": {
    "ro": "wlj",
    "ur": "ولج",
    "en": "Root: و - ل - ج",
    "ar": "ولج",
    "alt": [],
    "cat": "root"
  },
  "rjm": {
    "ro": "rjm",
    "ur": "رجم",
    "en": "Root: ر - ج - م",
    "ar": "رجم",
    "alt": [],
    "cat": "root"
  },
  "e$w": {
    "ro": "e$w",
    "ur": "عشو",
    "en": "Root: ع - ش - و",
    "ar": "عشو",
    "alt": [],
    "cat": "root"
  },
  "vwy": {
    "ro": "vwy",
    "ur": "ثوي",
    "en": "Root: ث - و - ي",
    "ar": "ثوي",
    "alt": [],
    "cat": "root"
  },
  "lwm": {
    "ro": "lwm",
    "ur": "لوم",
    "en": "Root: ل - و - م",
    "ar": "لوم",
    "alt": [],
    "cat": "root"
  },
  "wsf": {
    "ro": "wsf",
    "ur": "وصف",
    "en": "Root: و - ص - ف",
    "ar": "وصف",
    "alt": [],
    "cat": "root"
  },
  "zre": {
    "ro": "zre",
    "ur": "زرع",
    "en": "Root: ز - ر - ع",
    "ar": "زرع",
    "alt": [],
    "cat": "root"
  },
  "rsw": {
    "ro": "rsw",
    "ur": "رسو",
    "en": "Root: ر - س - و",
    "ar": "رسو",
    "alt": [],
    "cat": "root"
  },
  "etw": {
    "ro": "etw",
    "ur": "عطو",
    "en": "Root: ع - ط - و",
    "ar": "عطو",
    "alt": [],
    "cat": "root"
  },
  "sff": {
    "ro": "sff",
    "ur": "صفف",
    "en": "Root: ص - ف - ف",
    "ar": "صفف",
    "alt": [],
    "cat": "root"
  },
  "aby": {
    "ro": "aby",
    "ur": "ابي",
    "en": "Root: ا - ب - ي",
    "ar": "ابي",
    "alt": [],
    "cat": "root"
  },
  "rke": {
    "ro": "rke",
    "ur": "ركع",
    "en": "Root: ر - ك - ع",
    "ar": "ركع",
    "alt": [],
    "cat": "root"
  },
  "fdy": {
    "ro": "fdy",
    "ur": "فدي",
    "en": "Root: ف - د - ي",
    "ar": "فدي",
    "alt": [],
    "cat": "root"
  },
  "qnt": {
    "ro": "qnt",
    "ur": "قنت",
    "en": "Root: ق - ن - ت",
    "ar": "قنت",
    "alt": [],
    "cat": "root"
  },
  "raf": {
    "ro": "raf",
    "ur": "راف",
    "en": "Root: ر - ا - ف",
    "ar": "راف",
    "alt": [],
    "cat": "root"
  },
  "wqt": {
    "ro": "wqt",
    "ur": "وقت",
    "en": "Root: و - ق - ت",
    "ar": "وقت",
    "alt": [],
    "cat": "root"
  },
  "qrd": {
    "ro": "qrd",
    "ur": "قرض",
    "en": "Root: ق - ر - ض",
    "ar": "قرض",
    "alt": [],
    "cat": "root"
  },
  "xll": {
    "ro": "xll",
    "ur": "خلل",
    "en": "Root: خ - ل - ل",
    "ar": "خلل",
    "alt": [],
    "cat": "root"
  },
  "tmn": {
    "ro": "tmn",
    "ur": "طمن",
    "en": "Root: ط - م - ن",
    "ar": "طمن",
    "alt": [],
    "cat": "root"
  },
  "sgr": {
    "ro": "sgr",
    "ur": "صغر",
    "en": "Root: ص - غ - ر",
    "ar": "صغر",
    "alt": [],
    "cat": "root"
  },
  "$hw": {
    "ro": "$hw",
    "ur": "شهو",
    "en": "Root: ش - ه - و",
    "ar": "شهو",
    "alt": [],
    "cat": "root"
  },
  "glm": {
    "ro": "glm",
    "ur": "غلم",
    "en": "Root: غ - ل - م",
    "ar": "غلم",
    "alt": [],
    "cat": "root"
  },
  "hwr": {
    "ro": "hwr",
    "ur": "حور",
    "en": "Root: ح - و - ر",
    "ar": "حور",
    "alt": [],
    "cat": "root"
  },
  "esm": {
    "ro": "esm",
    "ur": "عصم",
    "en": "Root: ع - ص - م",
    "ar": "عصم",
    "alt": [],
    "cat": "root"
  },
  "fwh": {
    "ro": "fwh",
    "ur": "فوه",
    "en": "Root: ف - و - ه",
    "ar": "فوه",
    "alt": [],
    "cat": "root"
  },
  "glz": {
    "ro": "glz",
    "ur": "غلظ",
    "en": "Root: غ - ل - ظ",
    "ar": "غلظ",
    "alt": [],
    "cat": "root"
  },
  "jwr": {
    "ro": "jwr",
    "ur": "جور",
    "en": "Root: ج - و - ر",
    "ar": "جور",
    "alt": [],
    "cat": "root"
  },
  "jld": {
    "ro": "jld",
    "ur": "جلد",
    "en": "Root: ج - ل - د",
    "ar": "جلد",
    "alt": [],
    "cat": "root"
  },
  "hlf": {
    "ro": "hlf",
    "ur": "حلف",
    "en": "Root: ح - ل - ف",
    "ar": "حلف",
    "alt": [],
    "cat": "root"
  },
  "yas": {
    "ro": "yas",
    "ur": "ياس",
    "en": "Root: ي - ا - س",
    "ar": "ياس",
    "alt": [],
    "cat": "root"
  },
  "bgt": {
    "ro": "bgt",
    "ur": "بغت",
    "en": "Root: ب - غ - ت",
    "ar": "بغت",
    "alt": [],
    "cat": "root"
  },
  "xzn": {
    "ro": "xzn",
    "ur": "خزن",
    "en": "Root: خ - ز - ن",
    "ar": "خزن",
    "alt": [],
    "cat": "root"
  },
  "njm": {
    "ro": "njm",
    "ur": "نجم",
    "en": "Root: ن - ج - م",
    "ar": "نجم",
    "alt": [],
    "cat": "root"
  },
  "dyq": {
    "ro": "dyq",
    "ur": "ضيق",
    "en": "Root: ض - ي - ق",
    "ar": "ضيق",
    "alt": [],
    "cat": "root"
  },
  "nsh": {
    "ro": "nsh",
    "ur": "نصح",
    "en": "Root: ن - ص - ح",
    "ar": "نصح",
    "alt": [],
    "cat": "root"
  },
  "syh": {
    "ro": "syh",
    "ur": "صيح",
    "en": "Root: ص - ي - ح",
    "ar": "صيح",
    "alt": [],
    "cat": "root"
  },
  "$bh": {
    "ro": "$bh",
    "ur": "شبه",
    "en": "Root: ش - ب - ه",
    "ar": "شبه",
    "alt": [],
    "cat": "root"
  },
  "wsl": {
    "ro": "wsl",
    "ur": "وصل",
    "en": "Root: و - ص - ل",
    "ar": "وصل",
    "alt": [],
    "cat": "root"
  },
  "rhb": {
    "ro": "rhb",
    "ur": "رهب",
    "en": "Root: ر - ه - ب",
    "ar": "رهب",
    "alt": [],
    "cat": "root"
  },
  "esw": {
    "ro": "esw",
    "ur": "عصو",
    "en": "Root: ع - ص - و",
    "ar": "عصو",
    "alt": [],
    "cat": "root"
  },
  "bkr": {
    "ro": "bkr",
    "ur": "بكر",
    "en": "Root: ب - ك - ر",
    "ar": "بكر",
    "alt": [],
    "cat": "root"
  },
  "tme": {
    "ro": "tme",
    "ur": "طمع",
    "en": "Root: ط - م - ع",
    "ar": "طمع",
    "alt": [],
    "cat": "root"
  },
  "nb*": {
    "ro": "nb*",
    "ur": "نبذ",
    "en": "Root: ن - ب - ذ",
    "ar": "نبذ",
    "alt": [],
    "cat": "root"
  },
  "nyl": {
    "ro": "nyl",
    "ur": "نيل",
    "en": "Root: ن - ي - ل",
    "ar": "نيل",
    "alt": [],
    "cat": "root"
  },
  "hnf": {
    "ro": "hnf",
    "ur": "حنف",
    "en": "Root: ح - ن - ف",
    "ar": "حنف",
    "alt": [],
    "cat": "root"
  },
  "hsr": {
    "ro": "hsr",
    "ur": "حسر",
    "en": "Root: ح - س - ر",
    "ar": "حسر",
    "alt": [],
    "cat": "root"
  },
  "lhm": {
    "ro": "lhm",
    "ur": "لحم",
    "en": "Root: ل - ح - م",
    "ar": "لحم",
    "alt": [],
    "cat": "root"
  },
  "sfr": {
    "ro": "sfr",
    "ur": "سفر",
    "en": "Root: س - ف - ر",
    "ar": "سفر",
    "alt": [],
    "cat": "root"
  },
  "esr": {
    "ro": "esr",
    "ur": "عسر",
    "en": "Root: ع - س - ر",
    "ar": "عسر",
    "alt": [],
    "cat": "root"
  },
  "byd": {
    "ro": "byd",
    "ur": "بيض",
    "en": "Root: ب - ي - ض",
    "ar": "بيض",
    "alt": [],
    "cat": "root"
  },
  "xtb": {
    "ro": "xtb",
    "ur": "خطب",
    "en": "Root: خ - ط - ب",
    "ar": "خطب",
    "alt": [],
    "cat": "root"
  },
  "knn": {
    "ro": "knn",
    "ur": "كنن",
    "en": "Root: ك - ن - ن",
    "ar": "كنن",
    "alt": [],
    "cat": "root"
  },
  "tyn": {
    "ro": "tyn",
    "ur": "طين",
    "en": "Root: ط - ي - ن",
    "ar": "طين",
    "alt": [],
    "cat": "root"
  },
  "jby": {
    "ro": "jby",
    "ur": "جبي",
    "en": "Root: ج - ب - ي",
    "ar": "جبي",
    "alt": [],
    "cat": "root"
  },
  "bxl": {
    "ro": "bxl",
    "ur": "بخل",
    "en": "Root: ب - خ - ل",
    "ar": "بخل",
    "alt": [],
    "cat": "root"
  },
  "drk": {
    "ro": "drk",
    "ur": "درك",
    "en": "Root: د - ر - ك",
    "ar": "درك",
    "alt": [],
    "cat": "root"
  },
  "wdy": {
    "ro": "wdy",
    "ur": "ودي",
    "en": "Root: و - د - ي",
    "ar": "ودي",
    "alt": [],
    "cat": "root"
  },
  "xwd": {
    "ro": "xwd",
    "ur": "خوض",
    "en": "Root: خ - و - ض",
    "ar": "خوض",
    "alt": [],
    "cat": "root"
  },
  "$ye": {
    "ro": "$ye",
    "ur": "شيع",
    "en": "Root: ش - ي - ع",
    "ar": "شيع",
    "alt": [],
    "cat": "root"
  },
  "$ml": {
    "ro": "$ml",
    "ur": "شمل",
    "en": "Root: ش - م - ل",
    "ar": "شمل",
    "alt": [],
    "cat": "root"
  },
  "xrr": {
    "ro": "xrr",
    "ur": "خرر",
    "en": "Root: خ - ر - ر",
    "ar": "خرر",
    "alt": [],
    "cat": "root"
  },
  "e*r": {
    "ro": "e*r",
    "ur": "عذر",
    "en": "Root: ع - ذ - ر",
    "ar": "عذر",
    "alt": [],
    "cat": "root"
  },
  "$qw": {
    "ro": "$qw",
    "ur": "شقو",
    "en": "Root: ش - ق - و",
    "ar": "شقو",
    "alt": [],
    "cat": "root"
  },
  "sjn": {
    "ro": "sjn",
    "ur": "سجن",
    "en": "Root: س - ج - ن",
    "ar": "سجن",
    "alt": [],
    "cat": "root"
  },
  "slk": {
    "ro": "slk",
    "ur": "سلك",
    "en": "Root: س - ل - ك",
    "ar": "سلك",
    "alt": [],
    "cat": "root"
  },
  "ntf": {
    "ro": "ntf",
    "ur": "نطف",
    "en": "Root: ن - ط - ف",
    "ar": "نطف",
    "alt": [],
    "cat": "root"
  },
  "ntq": {
    "ro": "ntq",
    "ur": "نطق",
    "en": "Root: ن - ط - ق",
    "ar": "نطق",
    "alt": [],
    "cat": "root"
  },
  "ewn": {
    "ro": "ewn",
    "ur": "عون",
    "en": "Root: ع - و - ن",
    "ar": "عون",
    "alt": [],
    "cat": "root"
  },
  "sfh": {
    "ro": "sfh",
    "ur": "سفه",
    "en": "Root: س - ف - ه",
    "ar": "سفه",
    "alt": [],
    "cat": "root"
  },
  "wqd": {
    "ro": "wqd",
    "ur": "وقد",
    "en": "Root: و - ق - د",
    "ar": "وقد",
    "alt": [],
    "cat": "root"
  },
  "seq": {
    "ro": "seq",
    "ur": "صعق",
    "en": "Root: ص - ع - ق",
    "ar": "صعق",
    "alt": [],
    "cat": "root"
  },
  "gmm": {
    "ro": "gmm",
    "ur": "غمم",
    "en": "Root: غ - م - م",
    "ar": "غمم",
    "alt": [],
    "cat": "root"
  },
  "twr": {
    "ro": "twr",
    "ur": "طور",
    "en": "Root: ط - و - ر",
    "ar": "طور",
    "alt": [],
    "cat": "root"
  },
  "ayd": {
    "ro": "ayd",
    "ur": "ايد",
    "en": "Root: ا - ي - د",
    "ar": "ايد",
    "alt": [],
    "cat": "root"
  },
  "sbb": {
    "ro": "sbb",
    "ur": "سبب",
    "en": "Root: س - ب - ب",
    "ar": "سبب",
    "alt": [],
    "cat": "root"
  },
  "lgw": {
    "ro": "lgw",
    "ur": "لغو",
    "en": "Root: ل - غ - و",
    "ar": "لغو",
    "alt": [],
    "cat": "root"
  },
  "rde": {
    "ro": "rde",
    "ur": "رضع",
    "en": "Root: ر - ض - ع",
    "ar": "رضع",
    "alt": [],
    "cat": "root"
  },
  "fay": {
    "ro": "fay",
    "ur": "فاي",
    "en": "Root: ف - ا - ي",
    "ar": "فاي",
    "alt": [],
    "cat": "root"
  },
  "enb": {
    "ro": "enb",
    "ur": "عنب",
    "en": "Root: ع - ن - ب",
    "ar": "عنب",
    "alt": [],
    "cat": "root"
  },
  "ymm": {
    "ro": "ymm",
    "ur": "يمم",
    "en": "Root: ي - م - م",
    "ar": "يمم",
    "alt": [],
    "cat": "root"
  },
  "hrb": {
    "ro": "hrb",
    "ur": "حرب",
    "en": "Root: ح - ر - ب",
    "ar": "حرب",
    "alt": [],
    "cat": "root"
  },
  "gyz": {
    "ro": "gyz",
    "ur": "غيظ",
    "en": "Root: غ - ي - ظ",
    "ar": "غيظ",
    "alt": [],
    "cat": "root"
  },
  "trf": {
    "ro": "trf",
    "ur": "طرف",
    "en": "Root: ط - ر - ف",
    "ar": "طرف",
    "alt": [],
    "cat": "root"
  },
  "zbr": {
    "ro": "zbr",
    "ur": "زبر",
    "en": "Root: ز - ب - ر",
    "ar": "زبر",
    "alt": [],
    "cat": "root"
  },
  "qsr": {
    "ro": "qsr",
    "ur": "قصر",
    "en": "Root: ق - ص - ر",
    "ar": "قصر",
    "alt": [],
    "cat": "root"
  },
  "trq": {
    "ro": "trq",
    "ur": "طرق",
    "en": "Root: ط - ر - ق",
    "ar": "طرق",
    "alt": [],
    "cat": "root"
  },
  "jml": {
    "ro": "jml",
    "ur": "جمل",
    "en": "Root: ج - م - ل",
    "ar": "جمل",
    "alt": [],
    "cat": "root"
  },
  "wrd": {
    "ro": "wrd",
    "ur": "ورد",
    "en": "Root: و - ر - د",
    "ar": "ورد",
    "alt": [],
    "cat": "root"
  },
  "wka": {
    "ro": "wka",
    "ur": "وكا",
    "en": "Root: و - ك - ا",
    "ar": "وكا",
    "alt": [],
    "cat": "root"
  },
  "hsy": {
    "ro": "hsy",
    "ur": "حصي",
    "en": "Root: ح - ص - ي",
    "ar": "حصي",
    "alt": [],
    "cat": "root"
  },
  "frr": {
    "ro": "frr",
    "ur": "فرر",
    "en": "Root: ف - ر - ر",
    "ar": "فرر",
    "alt": [],
    "cat": "root"
  },
  "$fq": {
    "ro": "$fq",
    "ur": "شفق",
    "en": "Root: ش - ف - ق",
    "ar": "شفق",
    "alt": [],
    "cat": "root"
  },
  "dmw": {
    "ro": "dmw",
    "ur": "دمو",
    "en": "Root: د - م - و",
    "ar": "دمو",
    "alt": [],
    "cat": "root"
  },
  "qds": {
    "ro": "qds",
    "ur": "قدس",
    "en": "Root: ق - د - س",
    "ar": "قدس",
    "alt": [],
    "cat": "root"
  },
  "rjz": {
    "ro": "rjz",
    "ur": "رجز",
    "en": "Root: ر - ج - ز",
    "ar": "رجز",
    "alt": [],
    "cat": "root"
  },
  "rey": {
    "ro": "rey",
    "ur": "رعي",
    "en": "Root: ر - ع - ي",
    "ar": "رعي",
    "alt": [],
    "cat": "root"
  },
  "dye": {
    "ro": "dye",
    "ur": "ضيع",
    "en": "Root: ض - ي - ع",
    "ar": "ضيع",
    "alt": [],
    "cat": "root"
  },
  "nqs": {
    "ro": "nqs",
    "ur": "نقص",
    "en": "Root: ن - ق - ص",
    "ar": "نقص",
    "alt": [],
    "cat": "root"
  },
  "swd": {
    "ro": "swd",
    "ur": "سود",
    "en": "Root: س - و - د",
    "ar": "سود",
    "alt": [],
    "cat": "root"
  },
  "zyl": {
    "ro": "zyl",
    "ur": "زيل",
    "en": "Root: ز - ي - ل",
    "ar": "زيل",
    "alt": [],
    "cat": "root"
  },
  "ezl": {
    "ro": "ezl",
    "ur": "عزل",
    "en": "Root: ع - ز - ل",
    "ar": "عزل",
    "alt": [],
    "cat": "root"
  },
  "dfe": {
    "ro": "dfe",
    "ur": "دفع",
    "en": "Root: د - ف - ع",
    "ar": "دفع",
    "alt": [],
    "cat": "root"
  },
  "may": {
    "ro": "may",
    "ur": "ماي",
    "en": "Root: م - ا - ي",
    "ar": "ماي",
    "alt": [],
    "cat": "root"
  },
  "kfl": {
    "ro": "kfl",
    "ur": "كفل",
    "en": "Root: ك - ف - ل",
    "ar": "كفل",
    "alt": [],
    "cat": "root"
  },
  "mlw": {
    "ro": "mlw",
    "ur": "ملو",
    "en": "Root: م - ل - و",
    "ar": "ملو",
    "alt": [],
    "cat": "root"
  },
  "twl": {
    "ro": "twl",
    "ur": "طول",
    "en": "Root: ط - و - ل",
    "ar": "طول",
    "alt": [],
    "cat": "root"
  },
  "sfl": {
    "ro": "sfl",
    "ur": "سفل",
    "en": "Root: س - ف - ل",
    "ar": "سفل",
    "alt": [],
    "cat": "root"
  },
  "jbr": {
    "ro": "jbr",
    "ur": "جبر",
    "en": "Root: ج - ب - ر",
    "ar": "جبر",
    "alt": [],
    "cat": "root"
  },
  "rjs": {
    "ro": "rjs",
    "ur": "رجس",
    "en": "Root: ر - ج - س",
    "ar": "رجس",
    "alt": [],
    "cat": "root"
  },
  "hyq": {
    "ro": "hyq",
    "ur": "حيق",
    "en": "Root: ح - ي - ق",
    "ar": "حيق",
    "alt": [],
    "cat": "root"
  },
  "qhr": {
    "ro": "qhr",
    "ur": "قهر",
    "en": "Root: ق - ه - ر",
    "ar": "قهر",
    "alt": [],
    "cat": "root"
  },
  "dmr": {
    "ro": "dmr",
    "ur": "دمر",
    "en": "Root: د - م - ر",
    "ar": "دمر",
    "alt": [],
    "cat": "root"
  },
  "bt$": {
    "ro": "bt$",
    "ur": "بطش",
    "en": "Root: ب - ط - ش",
    "ar": "بطش",
    "alt": [],
    "cat": "root"
  },
  "asl": {
    "ro": "asl",
    "ur": "اصل",
    "en": "Root: ا - ص - ل",
    "ar": "اصل",
    "alt": [],
    "cat": "root"
  },
  "dhk": {
    "ro": "dhk",
    "ur": "ضحك",
    "en": "Root: ض - ح - ك",
    "ar": "ضحك",
    "alt": [],
    "cat": "root"
  },
  "rhq": {
    "ro": "rhq",
    "ur": "رهق",
    "en": "Root: ر - ه - ق",
    "ar": "رهق",
    "alt": [],
    "cat": "root"
  },
  "zlf": {
    "ro": "zlf",
    "ur": "زلف",
    "en": "Root: ز - ل - ف",
    "ar": "زلف",
    "alt": [],
    "cat": "root"
  },
  "jdd": {
    "ro": "jdd",
    "ur": "جدد",
    "en": "Root: ج - د - د",
    "ar": "جدد",
    "alt": [],
    "cat": "root"
  },
  "tjr": {
    "ro": "tjr",
    "ur": "تجر",
    "en": "Root: ت - ج - ر",
    "ar": "تجر",
    "alt": [],
    "cat": "root"
  },
  "nqd": {
    "ro": "nqd",
    "ur": "نقض",
    "en": "Root: ن - ق - ض",
    "ar": "نقض",
    "alt": [],
    "cat": "root"
  },
  "*bh": {
    "ro": "*bh",
    "ur": "ذبح",
    "en": "Root: ذ - ب - ح",
    "ar": "ذبح",
    "alt": [],
    "cat": "root"
  },
  "sbt": {
    "ro": "sbt",
    "ur": "سبت",
    "en": "Root: س - ب - ت",
    "ar": "سبت",
    "alt": [],
    "cat": "root"
  },
  "bqr": {
    "ro": "bqr",
    "ur": "بقر",
    "en": "Root: ب - ق - ر",
    "ar": "بقر",
    "alt": [],
    "cat": "root"
  },
  "lwn": {
    "ro": "lwn",
    "ur": "لون",
    "en": "Root: ل - و - ن",
    "ar": "لون",
    "alt": [],
    "cat": "root"
  },
  "ekf": {
    "ro": "ekf",
    "ur": "عكف",
    "en": "Root: ع - ك - ف",
    "ar": "عكف",
    "alt": [],
    "cat": "root"
  },
  "bvv": {
    "ro": "bvv",
    "ur": "بثث",
    "en": "Root: ب - ث - ث",
    "ar": "بثث",
    "alt": [],
    "cat": "root"
  },
  "fyd": {
    "ro": "fyd",
    "ur": "فيض",
    "en": "Root: ف - ي - ض",
    "ar": "فيض",
    "alt": [],
    "cat": "root"
  },
  "qbd": {
    "ro": "qbd",
    "ur": "قبض",
    "en": "Root: ق - ب - ض",
    "ar": "قبض",
    "alt": [],
    "cat": "root"
  },
  "brz": {
    "ro": "brz",
    "ur": "برز",
    "en": "Root: ب - ر - ز",
    "ar": "برز",
    "alt": [],
    "cat": "root"
  },
  "nwm": {
    "ro": "nwm",
    "ur": "نوم",
    "en": "Root: ن - و - م",
    "ar": "نوم",
    "alt": [],
    "cat": "root"
  },
  "ewm": {
    "ro": "ewm",
    "ur": "عوم",
    "en": "Root: ع - و - م",
    "ar": "عوم",
    "alt": [],
    "cat": "root"
  },
  "hrq": {
    "ro": "hrq",
    "ur": "حرق",
    "en": "Root: ح - ر - ق",
    "ar": "حرق",
    "alt": [],
    "cat": "root"
  },
  "zyg": {
    "ro": "zyg",
    "ur": "زيغ",
    "en": "Root: ز - ي - غ",
    "ar": "زيغ",
    "alt": [],
    "cat": "root"
  },
  "ebr": {
    "ro": "ebr",
    "ur": "عبر",
    "en": "Root: ع - ب - ر",
    "ar": "عبر",
    "alt": [],
    "cat": "root"
  },
  "fdd": {
    "ro": "fdd",
    "ur": "فضض",
    "en": "Root: ف - ض - ض",
    "ar": "فضض",
    "alt": [],
    "cat": "root"
  },
  "xyl": {
    "ro": "xyl",
    "ur": "خيل",
    "en": "Root: خ - ي - ل",
    "ar": "خيل",
    "alt": [],
    "cat": "root"
  },
  "dwm": {
    "ro": "dwm",
    "ur": "دوم",
    "en": "Root: د - و - م",
    "ar": "دوم",
    "alt": [],
    "cat": "root"
  },
  "ewj": {
    "ro": "ewj",
    "ur": "عوج",
    "en": "Root: ع - و - ج",
    "ar": "عوج",
    "alt": [],
    "cat": "root"
  },
  "whn": {
    "ro": "whn",
    "ur": "وهن",
    "en": "Root: و - ه - ن",
    "ar": "وهن",
    "alt": [],
    "cat": "root"
  },
  "sed": {
    "ro": "sed",
    "ur": "صعد",
    "en": "Root: ص - ع - د",
    "ar": "صعد",
    "alt": [],
    "cat": "root"
  },
  "gnm": {
    "ro": "gnm",
    "ur": "غنم",
    "en": "Root: غ - ن - م",
    "ar": "غنم",
    "alt": [],
    "cat": "root"
  },
  "rmy": {
    "ro": "rmy",
    "ur": "رمي",
    "en": "Root: ر - م - ي",
    "ar": "رمي",
    "alt": [],
    "cat": "root"
  },
  "srq": {
    "ro": "srq",
    "ur": "سرق",
    "en": "Root: س - ر - ق",
    "ar": "سرق",
    "alt": [],
    "cat": "root"
  },
  "wqr": {
    "ro": "wqr",
    "ur": "وقر",
    "en": "Root: و - ق - ر",
    "ar": "وقر",
    "alt": [],
    "cat": "root"
  },
  "hly": {
    "ro": "hly",
    "ur": "حلي",
    "en": "Root: ح - ل - ي",
    "ar": "حلي",
    "alt": [],
    "cat": "root"
  },
  "enq": {
    "ro": "enq",
    "ur": "عنق",
    "en": "Root: ع - ن - ق",
    "ar": "عنق",
    "alt": [],
    "cat": "root"
  },
  "knz": {
    "ro": "knz",
    "ur": "كنز",
    "en": "Root: ك - ن - ز",
    "ar": "كنز",
    "alt": [],
    "cat": "root"
  },
  "erj": {
    "ro": "erj",
    "ur": "عرج",
    "en": "Root: ع - ر - ج",
    "ar": "عرج",
    "alt": [],
    "cat": "root"
  },
  "zny": {
    "ro": "zny",
    "ur": "زني",
    "en": "Root: ز - ن - ي",
    "ar": "زني",
    "alt": [],
    "cat": "root"
  },
  "q*f": {
    "ro": "q*f",
    "ur": "قذف",
    "en": "Root: ق - ذ - ف",
    "ar": "قذف",
    "alt": [],
    "cat": "root"
  },
  "shf": {
    "ro": "shf",
    "ur": "صحف",
    "en": "Root: ص - ح - ف",
    "ar": "صحف",
    "alt": [],
    "cat": "root"
  },
  "frj": {
    "ro": "frj",
    "ur": "فرج",
    "en": "Root: ف - ر - ج",
    "ar": "فرج",
    "alt": [],
    "cat": "root"
  },
  "xtm": {
    "ro": "xtm",
    "ur": "ختم",
    "en": "Root: خ - ت - م",
    "ar": "ختم",
    "alt": [],
    "cat": "root"
  },
  "brhn": {
    "ro": "brhn",
    "ur": "برهن",
    "en": "Root: ب - ر - ه - ن",
    "ar": "برهن",
    "alt": [],
    "cat": "root"
  },
  "rgb": {
    "ro": "rgb",
    "ur": "رغب",
    "en": "Root: ر - غ - ب",
    "ar": "رغب",
    "alt": [],
    "cat": "root"
  },
  "klf": {
    "ro": "klf",
    "ur": "كلف",
    "en": "Root: ك - ل - ف",
    "ar": "كلف",
    "alt": [],
    "cat": "root"
  },
  "bht": {
    "ro": "bht",
    "ur": "بهت",
    "en": "Root: ب - ه - ت",
    "ar": "بهت",
    "alt": [],
    "cat": "root"
  },
  "wbl": {
    "ro": "wbl",
    "ur": "وبل",
    "en": "Root: و - ب - ل",
    "ar": "وبل",
    "alt": [],
    "cat": "root"
  },
  "slf": {
    "ro": "slf",
    "ur": "سلف",
    "en": "Root: س - ل - ف",
    "ar": "سلف",
    "alt": [],
    "cat": "root"
  },
  "eqr": {
    "ro": "eqr",
    "ur": "عقر",
    "en": "Root: ع - ق - ر",
    "ar": "عقر",
    "alt": [],
    "cat": "root"
  },
  "xms": {
    "ro": "xms",
    "ur": "خمس",
    "en": "Root: خ - م - س",
    "ar": "خمس",
    "alt": [],
    "cat": "root"
  },
  "xwl": {
    "ro": "xwl",
    "ur": "خول",
    "en": "Root: خ - و - ل",
    "ar": "خول",
    "alt": [],
    "cat": "root"
  },
  "slb": {
    "ro": "slb",
    "ur": "صلب",
    "en": "Root: ص - ل - ب",
    "ar": "صلب",
    "alt": [],
    "cat": "root"
  },
  "frt": {
    "ro": "frt",
    "ur": "فرط",
    "en": "Root: ف - ر - ط",
    "ar": "فرط",
    "alt": [],
    "cat": "root"
  },
  "dre": {
    "ro": "dre",
    "ur": "ضرع",
    "en": "Root: ض - ر - ع",
    "ar": "ضرع",
    "alt": [],
    "cat": "root"
  },
  "sqt": {
    "ro": "sqt",
    "ur": "سقط",
    "en": "Root: س - ق - ط",
    "ar": "سقط",
    "alt": [],
    "cat": "root"
  },
  "xdr": {
    "ro": "xdr",
    "ur": "خضر",
    "en": "Root: خ - ض - ر",
    "ar": "خضر",
    "alt": [],
    "cat": "root"
  },
  "ltf": {
    "ro": "ltf",
    "ur": "لطف",
    "en": "Root: ل - ط - ف",
    "ar": "لطف",
    "alt": [],
    "cat": "root"
  },
  "ey$": {
    "ro": "ey$",
    "ur": "عيش",
    "en": "Root: ع - ي - ش",
    "ar": "عيش",
    "alt": [],
    "cat": "root"
  },
  "hjb": {
    "ro": "hjb",
    "ur": "حجب",
    "en": "Root: ح - ج - ب",
    "ar": "حجب",
    "alt": [],
    "cat": "root"
  },
  "stt": {
    "ro": "stt",
    "ur": "ستت",
    "en": "Root: س - ت - ت",
    "ar": "ستت",
    "alt": [],
    "cat": "root"
  },
  "rjf": {
    "ro": "rjf",
    "ur": "رجف",
    "en": "Root: ر - ج - ف",
    "ar": "رجف",
    "alt": [],
    "cat": "root"
  },
  "gbr": {
    "ro": "gbr",
    "ur": "غبر",
    "en": "Root: غ - ب - ر",
    "ar": "غبر",
    "alt": [],
    "cat": "root"
  },
  "qbr": {
    "ro": "qbr",
    "ur": "قبر",
    "en": "Root: ق - ب - ر",
    "ar": "قبر",
    "alt": [],
    "cat": "root"
  },
  "sry": {
    "ro": "sry",
    "ur": "سري",
    "en": "Root: س - ر - ي",
    "ar": "سري",
    "alt": [],
    "cat": "root"
  },
  "xsf": {
    "ro": "xsf",
    "ur": "خسف",
    "en": "Root: خ - س - ف",
    "ar": "خسف",
    "alt": [],
    "cat": "root"
  },
  "swt": {
    "ro": "swt",
    "ur": "صوت",
    "en": "Root: ص - و - ت",
    "ar": "صوت",
    "alt": [],
    "cat": "root"
  },
  "emh": {
    "ro": "emh",
    "ur": "عمه",
    "en": "Root: ع - م - ه",
    "ar": "عمه",
    "alt": [],
    "cat": "root"
  },
  "xtf": {
    "ro": "xtf",
    "ur": "خطف",
    "en": "Root: خ - ط - ف",
    "ar": "خطف",
    "alt": [],
    "cat": "root"
  },
  "qsw": {
    "ro": "qsw",
    "ur": "قسو",
    "en": "Root: ق - س - و",
    "ar": "قسو",
    "alt": [],
    "cat": "root"
  },
  "nsk": {
    "ro": "nsk",
    "ur": "نسك",
    "en": "Root: ن - س - ك",
    "ar": "نسك",
    "alt": [],
    "cat": "root"
  },
  "xmr": {
    "ro": "xmr",
    "ur": "خمر",
    "en": "Root: خ - م - ر",
    "ar": "خمر",
    "alt": [],
    "cat": "root"
  },
  "fya": {
    "ro": "fya",
    "ur": "فيا",
    "en": "Root: ف - ي - ا",
    "ar": "فيا",
    "alt": [],
    "cat": "root"
  },
  "bel": {
    "ro": "bel",
    "ur": "بعل",
    "en": "Root: ب - ع - ل",
    "ar": "بعل",
    "alt": [],
    "cat": "root"
  },
  "srh": {
    "ro": "srh",
    "ur": "سرح",
    "en": "Root: س - ر - ح",
    "ar": "سرح",
    "alt": [],
    "cat": "root"
  },
  "eqd": {
    "ro": "eqd",
    "ur": "عقد",
    "en": "Root: ع - ق - د",
    "ar": "عقد",
    "alt": [],
    "cat": "root"
  },
  "nsf": {
    "ro": "nsf",
    "ur": "نصف",
    "en": "Root: ن - ص - ف",
    "ar": "نصف",
    "alt": [],
    "cat": "root"
  },
  "grf": {
    "ro": "grf",
    "ur": "غرف",
    "en": "Root: غ - ر - ف",
    "ar": "غرف",
    "alt": [],
    "cat": "root"
  },
  "bxs": {
    "ro": "bxs",
    "ur": "بخس",
    "en": "Root: ب - خ - س",
    "ar": "بخس",
    "alt": [],
    "cat": "root"
  },
  "hbl": {
    "ro": "hbl",
    "ur": "حبل",
    "en": "Root: ح - ب - ل",
    "ar": "حبل",
    "alt": [],
    "cat": "root"
  },
  "hzz": {
    "ro": "hzz",
    "ur": "حظظ",
    "en": "Root: ح - ظ - ظ",
    "ar": "حظظ",
    "alt": [],
    "cat": "root"
  },
  "skr": {
    "ro": "skr",
    "ur": "سكر",
    "en": "Root: س - ك - ر",
    "ar": "سكر",
    "alt": [],
    "cat": "root"
  },
  "brj": {
    "ro": "brj",
    "ur": "برج",
    "en": "Root: ب - ر - ج",
    "ar": "برج",
    "alt": [],
    "cat": "root"
  },
  "emd": {
    "ro": "emd",
    "ur": "عمد",
    "en": "Root: ع - م - د",
    "ar": "عمد",
    "alt": [],
    "cat": "root"
  },
  "elq": {
    "ro": "elq",
    "ur": "علق",
    "en": "Root: ع - ل - ق",
    "ar": "علق",
    "alt": [],
    "cat": "root"
  },
  "asw": {
    "ro": "asw",
    "ur": "اسو",
    "en": "Root: ا - س - و",
    "ar": "اسو",
    "alt": [],
    "cat": "root"
  },
  "ndm": {
    "ro": "ndm",
    "ur": "ندم",
    "en": "Root: ن - د - م",
    "ar": "ندم",
    "alt": [],
    "cat": "root"
  },
  "zyt": {
    "ro": "zyt",
    "ur": "زيت",
    "en": "Root: ز - ي - ت",
    "ar": "زيت",
    "alt": [],
    "cat": "root"
  },
  "nwq": {
    "ro": "nwq",
    "ur": "نوق",
    "en": "Root: ن - و - ق",
    "ar": "نوق",
    "alt": [],
    "cat": "root"
  },
  "dhw": {
    "ro": "dhw",
    "ur": "ضحو",
    "en": "Root: ض - ح - و",
    "ar": "ضحو",
    "alt": [],
    "cat": "root"
  },
  "nkv": {
    "ro": "nkv",
    "ur": "نكث",
    "en": "Root: ن - ك - ث",
    "ar": "نكث",
    "alt": [],
    "cat": "root"
  },
  "dkk": {
    "ro": "dkk",
    "ur": "دكك",
    "en": "Root: د - ك - ك",
    "ar": "دكك",
    "alt": [],
    "cat": "root"
  },
  "bky": {
    "ro": "bky",
    "ur": "بكي",
    "en": "Crying / Weeping",
    "ar": "بكي",
    "alt": [],
    "cat": "root"
  },
  "aansu bahana": {
    "ro": "aansu bahana",
    "ur": "بكي",
    "en": "Crying / Weeping",
    "ar": "بكي",
    "alt": [],
    "cat": "root"
  },
  "esf": {
    "ro": "esf",
    "ur": "عصف",
    "en": "Root: ع - ص - ف",
    "ar": "عصف",
    "alt": [],
    "cat": "root"
  },
  "mwj": {
    "ro": "mwj",
    "ur": "موج",
    "en": "Root: م - و - ج",
    "ar": "موج",
    "alt": [],
    "cat": "root"
  },
  "bde": {
    "ro": "bde",
    "ur": "بضع",
    "en": "Root: ب - ض - ع",
    "ar": "بضع",
    "alt": [],
    "cat": "root"
  },
  "wey": {
    "ro": "wey",
    "ur": "وعي",
    "en": "Root: و - ع - ي",
    "ar": "وعي",
    "alt": [],
    "cat": "root"
  },
  "mkv": {
    "ro": "mkv",
    "ur": "مكث",
    "en": "Root: م - ك - ث",
    "ar": "مكث",
    "alt": [],
    "cat": "root"
  },
  "tse": {
    "ro": "tse",
    "ur": "تسع",
    "en": "Root: ت - س - ع",
    "ar": "تسع",
    "alt": [],
    "cat": "root"
  },
  "dwa": {
    "ro": "dwa",
    "ur": "ضوا",
    "en": "Root: ض - و - ا",
    "ar": "ضوا",
    "alt": [],
    "cat": "root"
  },
  "bkm": {
    "ro": "bkm",
    "ur": "بكم",
    "en": "Root: ب - ك - م",
    "ar": "بكم",
    "alt": [],
    "cat": "root"
  },
  "brq": {
    "ro": "brq",
    "ur": "برق",
    "en": "Root: ب - ر - ق",
    "ar": "برق",
    "alt": [],
    "cat": "root"
  },
  "fr$": {
    "ro": "fr$",
    "ur": "فرش",
    "en": "Root: ف - ر - ش",
    "ar": "فرش",
    "alt": [],
    "cat": "root"
  },
  "ndd": {
    "ro": "ndd",
    "ur": "ندد",
    "en": "Root: ن - د - د",
    "ar": "ندد",
    "alt": [],
    "cat": "root"
  },
  "hrf": {
    "ro": "hrf",
    "ur": "حرف",
    "en": "Root: ح - ر - ف",
    "ar": "حرف",
    "alt": [],
    "cat": "root"
  },
  "krr": {
    "ro": "krr",
    "ur": "كرر",
    "en": "Root: ك - ر - ر",
    "ar": "كرر",
    "alt": [],
    "cat": "root"
  },
  "ady": {
    "ro": "ady",
    "ur": "ادي",
    "en": "Root: ا - د - ي",
    "ar": "ادي",
    "alt": [],
    "cat": "root"
  },
  "vqf": {
    "ro": "vqf",
    "ur": "ثقف",
    "en": "Root: ث - ق - ف",
    "ar": "ثقف",
    "alt": [],
    "cat": "root"
  },
  "zlzl": {
    "ro": "zlzl",
    "ur": "زلزل",
    "en": "Root: ز - ل - ز - ل",
    "ar": "زلزل",
    "alt": [],
    "cat": "root"
  },
  "xlt": {
    "ro": "xlt",
    "ur": "خلط",
    "en": "Root: خ - ل - ط",
    "ar": "خلط",
    "alt": [],
    "cat": "root"
  },
  "frg": {
    "ro": "frg",
    "ur": "فرغ",
    "en": "Root: ف - ر - غ",
    "ar": "فرغ",
    "alt": [],
    "cat": "root"
  },
  "hmr": {
    "ro": "hmr",
    "ur": "حمر",
    "en": "Root: ح - م - ر",
    "ar": "حمر",
    "alt": [],
    "cat": "root"
  },
  "dab": {
    "ro": "dab",
    "ur": "داب",
    "en": "Root: د - ا - ب",
    "ar": "داب",
    "alt": [],
    "cat": "root"
  },
  "hss": {
    "ro": "hss",
    "ur": "حسس",
    "en": "Root: ح - س - س",
    "ar": "حسس",
    "alt": [],
    "cat": "root"
  },
  "drs": {
    "ro": "drs",
    "ur": "درس",
    "en": "Root: د - ر - س",
    "ar": "درس",
    "alt": [],
    "cat": "root"
  },
  "kzm": {
    "ro": "kzm",
    "ur": "كظم",
    "en": "Root: ك - ظ - م",
    "ar": "كظم",
    "alt": [],
    "cat": "root"
  },
  "lhq": {
    "ro": "lhq",
    "ur": "لحق",
    "en": "Root: ل - ح - ق",
    "ar": "لحق",
    "alt": [],
    "cat": "root"
  },
  "mqt": {
    "ro": "mqt",
    "ur": "مقت",
    "en": "Root: م - ق - ت",
    "ar": "مقت",
    "alt": [],
    "cat": "root"
  },
  "myl": {
    "ro": "myl",
    "ur": "ميل",
    "en": "Root: م - ي - ل",
    "ar": "ميل",
    "alt": [],
    "cat": "root"
  },
  "fxr": {
    "ro": "fxr",
    "ur": "فخر",
    "en": "Root: ف - خ - ر",
    "ar": "فخر",
    "alt": [],
    "cat": "root"
  },
  "syd": {
    "ro": "syd",
    "ur": "صيد",
    "en": "Root: ص - ي - د",
    "ar": "صيد",
    "alt": [],
    "cat": "root"
  },
  "rdy": {
    "ro": "rdy",
    "ur": "ردي",
    "en": "Root: ر - د - ي",
    "ar": "ردي",
    "alt": [],
    "cat": "root"
  },
  "klb": {
    "ro": "klb",
    "ur": "كلب",
    "en": "Root: ك - ل - ب",
    "ar": "كلب",
    "alt": [],
    "cat": "root"
  },
  "hbr": {
    "ro": "hbr",
    "ur": "حبر",
    "en": "Root: ح - ب - ر",
    "ar": "حبر",
    "alt": [],
    "cat": "root"
  },
  "qsd": {
    "ro": "qsd",
    "ur": "قصد",
    "en": "Root: ق - ص - د",
    "ar": "قصد",
    "alt": [],
    "cat": "root"
  },
  "hmy": {
    "ro": "hmy",
    "ur": "حمي",
    "en": "Root: ح - م - ي",
    "ar": "حمي",
    "alt": [],
    "cat": "root"
  },
  "*ra": {
    "ro": "*ra",
    "ur": "ذرا",
    "en": "Root: ذ - ر - ا",
    "ar": "ذرا",
    "alt": [],
    "cat": "root"
  },
  "hsd": {
    "ro": "hsd",
    "ur": "حصد",
    "en": "Root: ح - ص - د",
    "ar": "حصد",
    "alt": [],
    "cat": "root"
  },
  "tbr": {
    "ro": "tbr",
    "ur": "تبر",
    "en": "Root: ت - ب - ر",
    "ar": "تبر",
    "alt": [],
    "cat": "root"
  },
  "lwh": {
    "ro": "lwh",
    "ur": "لوح",
    "en": "Root: ل - و - ح",
    "ar": "لوح",
    "alt": [],
    "cat": "root"
  },
  "lhd": {
    "ro": "lhd",
    "ur": "لحد",
    "en": "Root: ل - ح - د",
    "ar": "لحد",
    "alt": [],
    "cat": "root"
  },
  "nzg": {
    "ro": "nzg",
    "ur": "نزغ",
    "en": "Root: ن - ز - غ",
    "ar": "نزغ",
    "alt": [],
    "cat": "root"
  },
  "rsd": {
    "ro": "rsd",
    "ur": "رصد",
    "en": "Root: ر - ص - د",
    "ar": "رصد",
    "alt": [],
    "cat": "root"
  },
  "$fy": {
    "ro": "$fy",
    "ur": "شفي",
    "en": "Healing / Cure / Recovery",
    "ar": "شفي",
    "alt": [],
    "cat": "root"
  },
  "shifa dena": {
    "ro": "shifa dena",
    "ur": "شفي",
    "en": "Healing / Cure / Recovery",
    "ar": "شفي",
    "alt": [],
    "cat": "root"
  },
  "tandurusti": {
    "ro": "tandurusti",
    "ur": "شفي",
    "en": "Healing / Cure / Recovery",
    "ar": "شفي",
    "alt": [],
    "cat": "root"
  },
  "wta": {
    "ro": "wta",
    "ur": "وطا",
    "en": "Root: و - ط - ا",
    "ar": "وطا",
    "alt": [],
    "cat": "root"
  },
  "grm": {
    "ro": "grm",
    "ur": "غرم",
    "en": "Root: غ - ر - م",
    "ar": "غرم",
    "alt": [],
    "cat": "root"
  },
  "dyf": {
    "ro": "dyf",
    "ur": "ضيف",
    "en": "Root: ض - ي - ف",
    "ar": "ضيف",
    "alt": [],
    "cat": "root"
  },
  "qms": {
    "ro": "qms",
    "ur": "قمص",
    "en": "Root: ق - م - ص",
    "ar": "قمص",
    "alt": [],
    "cat": "root"
  },
  "khf": {
    "ro": "khf",
    "ur": "كهف",
    "en": "Cave / Shelter",
    "ar": "كهف",
    "alt": [],
    "cat": "root"
  },
  "ghaar": {
    "ro": "ghaar",
    "ur": "كهف",
    "en": "Cave / Shelter",
    "ar": "كهف",
    "alt": [],
    "cat": "root"
  },
  "kahf": {
    "ro": "kahf",
    "ur": "كهف",
    "en": "Cave / Shelter",
    "ar": "كهف",
    "alt": [],
    "cat": "root"
  },
  "zwr": {
    "ro": "zwr",
    "ur": "زور",
    "en": "Root: ز - و - ر",
    "ar": "زور",
    "alt": [],
    "cat": "root"
  },
  "mhl": {
    "ro": "mhl",
    "ur": "مهل",
    "en": "Root: م - ه - ل",
    "ar": "مهل",
    "alt": [],
    "cat": "root"
  },
  "fze": {
    "ro": "fze",
    "ur": "فزع",
    "en": "Root: ف - ز - ع",
    "ar": "فزع",
    "alt": [],
    "cat": "root"
  },
  "lala": {
    "ro": "lala",
    "ur": "لالا",
    "en": "Root: ل - ا - ل - ا",
    "ar": "لالا",
    "alt": [],
    "cat": "root"
  },
  "mrj": {
    "ro": "mrj",
    "ur": "مرج",
    "en": "Root: م - ر - ج",
    "ar": "مرج",
    "alt": [],
    "cat": "root"
  },
  "htm": {
    "ro": "htm",
    "ur": "حطم",
    "en": "Root: ح - ط - م",
    "ar": "حطم",
    "alt": [],
    "cat": "root"
  },
  "zjr": {
    "ro": "zjr",
    "ur": "زجر",
    "en": "Root: ز - ج - ر",
    "ar": "زجر",
    "alt": [],
    "cat": "root"
  },
  "kas": {
    "ro": "kas",
    "ur": "كاس",
    "en": "Root: ك - ا - س",
    "ar": "كاس",
    "alt": [],
    "cat": "root"
  },
  "xde": {
    "ro": "xde",
    "ur": "خدع",
    "en": "Root: خ - د - ع",
    "ar": "خدع",
    "alt": [],
    "cat": "root"
  },
  "evw": {
    "ro": "evw",
    "ur": "عثو",
    "en": "Root: ع - ث - و",
    "ar": "عثو",
    "alt": [],
    "cat": "root"
  },
  "msr": {
    "ro": "msr",
    "ur": "مصر",
    "en": "Root: م - ص - ر",
    "ar": "مصر",
    "alt": [],
    "cat": "root"
  },
  "nkl": {
    "ro": "nkl",
    "ur": "نكل",
    "en": "Root: ن - ك - ل",
    "ar": "نكل",
    "alt": [],
    "cat": "root"
  },
  "vwr": {
    "ro": "vwr",
    "ur": "ثور",
    "en": "Root: ث - و - ر",
    "ar": "ثور",
    "alt": [],
    "cat": "root"
  },
  "dra": {
    "ro": "dra",
    "ur": "درا",
    "en": "Root: د - ر - ا",
    "ar": "درا",
    "alt": [],
    "cat": "root"
  },
  "qfw": {
    "ro": "qfw",
    "ur": "قفو",
    "en": "Root: ق - ف - و",
    "ar": "قفو",
    "alt": [],
    "cat": "root"
  },
  "hrs": {
    "ro": "hrs",
    "ur": "حرص",
    "en": "Root: ح - ر - ص",
    "ar": "حرص",
    "alt": [],
    "cat": "root"
  },
  "wst": {
    "ro": "wst",
    "ur": "وسط",
    "en": "Root: و - س - ط",
    "ar": "وسط",
    "alt": [],
    "cat": "root"
  },
  "$tr": {
    "ro": "$tr",
    "ur": "شطر",
    "en": "Root: ش - ط - ر",
    "ar": "شطر",
    "alt": [],
    "cat": "root"
  },
  "jwe": {
    "ro": "jwe",
    "ur": "جوع",
    "en": "Root: ج - و - ع",
    "ar": "جوع",
    "alt": [],
    "cat": "root"
  },
  "xtw": {
    "ro": "xtw",
    "ur": "خطو",
    "en": "Root: خ - ط - و",
    "ar": "خطو",
    "alt": [],
    "cat": "root"
  },
  "xnzr": {
    "ro": "xnzr",
    "ur": "خنزر",
    "en": "Root: خ - ن - ز - ر",
    "ar": "خنزر",
    "alt": [],
    "cat": "root"
  },
  "kml": {
    "ro": "kml",
    "ur": "كمل",
    "en": "Root: ك - م - ل",
    "ar": "كمل",
    "alt": [],
    "cat": "root"
  },
  "ent": {
    "ro": "ent",
    "ur": "عنت",
    "en": "Root: ع - ن - ت",
    "ar": "عنت",
    "alt": [],
    "cat": "root"
  },
  "ksw": {
    "ro": "ksw",
    "ur": "كسو",
    "en": "Root: ك - س - و",
    "ar": "كسو",
    "alt": [],
    "cat": "root"
  },
  "qtr": {
    "ro": "qtr",
    "ur": "قتر",
    "en": "Root: ق - ت - ر",
    "ar": "قتر",
    "alt": [],
    "cat": "root"
  },
  "jwz": {
    "ro": "jwz",
    "ur": "جوز",
    "en": "Root: ج - و - ز",
    "ar": "جوز",
    "alt": [],
    "cat": "root"
  },
  "xwy": {
    "ro": "xwy",
    "ur": "خوي",
    "en": "Root: خ - و - ي",
    "ar": "خوي",
    "alt": [],
    "cat": "root"
  },
  "n$z": {
    "ro": "n$z",
    "ur": "نشز",
    "en": "Root: ن - ش - ز",
    "ar": "نشز",
    "alt": [],
    "cat": "root"
  },
  "snbl": {
    "ro": "snbl",
    "ur": "سنبل",
    "en": "Root: س - ن - ب - ل",
    "ar": "سنبل",
    "alt": [],
    "cat": "root"
  },
  "lwy": {
    "ro": "lwy",
    "ur": "لوي",
    "en": "Root: ل - و - ي",
    "ar": "لوي",
    "alt": [],
    "cat": "root"
  },
  "nq*": {
    "ro": "nq*",
    "ur": "نقذ",
    "en": "Root: ن - ق - ذ",
    "ar": "نقذ",
    "alt": [],
    "cat": "root"
  },
  "bgd": {
    "ro": "bgd",
    "ur": "بغض",
    "en": "Root: ب - غ - ض",
    "ar": "بغض",
    "alt": [],
    "cat": "root"
  },
  "xyb": {
    "ro": "xyb",
    "ur": "خيب",
    "en": "Root: خ - ي - ب",
    "ar": "خيب",
    "alt": [],
    "cat": "root"
  },
  "reb": {
    "ro": "reb",
    "ur": "رعب",
    "en": "Root: ر - ع - ب",
    "ar": "رعب",
    "alt": [],
    "cat": "root"
  },
  "fwt": {
    "ro": "fwt",
    "ur": "فوت",
    "en": "Root: ف - و - ت",
    "ar": "فوت",
    "alt": [],
    "cat": "root"
  },
  "lyn": {
    "ro": "lyn",
    "ur": "لين",
    "en": "Root: ل - ي - ن",
    "ar": "لين",
    "alt": [],
    "cat": "root"
  },
  "rbt": {
    "ro": "rbt",
    "ur": "ربط",
    "en": "Root: ر - ب - ط",
    "ar": "ربط",
    "alt": [],
    "cat": "root"
  },
  "sds": {
    "ro": "sds",
    "ur": "سدس",
    "en": "Root: س - د - س",
    "ar": "سدس",
    "alt": [],
    "cat": "root"
  },
  "emm": {
    "ro": "emm",
    "ur": "عمم",
    "en": "Root: ع - م - م",
    "ar": "عمم",
    "alt": [],
    "cat": "root"
  },
  "lms": {
    "ro": "lms",
    "ur": "لمس",
    "en": "Root: ل - م - س",
    "ar": "لمس",
    "alt": [],
    "cat": "root"
  },
  "tms": {
    "ro": "tms",
    "ur": "طمس",
    "en": "Root: ط - م - س",
    "ar": "طمس",
    "alt": [],
    "cat": "root"
  },
  "rfq": {
    "ro": "rfq",
    "ur": "رفق",
    "en": "Root: ر - ف - ق",
    "ar": "رفق",
    "alt": [],
    "cat": "root"
  },
  "bimari": {
    "ro": "bimari",
    "ur": "مرد",
    "en": "Sickness / Disease / Malice",
    "ar": "مرد",
    "alt": [],
    "cat": "root"
  },
  "maraz": {
    "ro": "maraz",
    "ur": "مرد",
    "en": "Sickness / Disease / Malice",
    "ar": "مرد",
    "alt": [],
    "cat": "root"
  },
  "kharabi": {
    "ro": "kharabi",
    "ur": "مرد",
    "en": "Sickness / Disease / Malice",
    "ar": "مرد",
    "alt": [],
    "cat": "root"
  },
  "hys": {
    "ro": "hys",
    "ur": "حيص",
    "en": "Root: ح - ي - ص",
    "ar": "حيص",
    "alt": [],
    "cat": "root"
  },
  "$hh": {
    "ro": "$hh",
    "ur": "شحح",
    "en": "Root: ش - ح - ح",
    "ar": "شحح",
    "alt": [],
    "cat": "root"
  },
  "$re": {
    "ro": "$re",
    "ur": "شرع",
    "en": "Root: ش - ر - ع",
    "ar": "شرع",
    "alt": [],
    "cat": "root"
  },
  "myd": {
    "ro": "myd",
    "ur": "ميد",
    "en": "Root: م - ي - د",
    "ar": "ميد",
    "alt": [],
    "cat": "root"
  },
  "bls": {
    "ro": "bls",
    "ur": "بلس",
    "en": "Root: ب - ل - س",
    "ar": "بلس",
    "alt": [],
    "cat": "root"
  },
  "sdf": {
    "ro": "sdf",
    "ur": "صدف",
    "en": "Root: ص - د - ف",
    "ar": "صدف",
    "alt": [],
    "cat": "root"
  },
  "trd": {
    "ro": "trd",
    "ur": "طرد",
    "en": "Root: ط - ر - د",
    "ar": "طرد",
    "alt": [],
    "cat": "root"
  },
  "snm": {
    "ro": "snm",
    "ur": "صنم",
    "en": "Root: ص - ن - م",
    "ar": "صنم",
    "alt": [],
    "cat": "root"
  },
  "kwkb": {
    "ro": "kwkb",
    "ur": "كوكب",
    "en": "Root: ك - و - ك - ب",
    "ar": "كوكب",
    "alt": [],
    "cat": "root"
  },
  "qrf": {
    "ro": "qrf",
    "ur": "قرف",
    "en": "Root: ق - ر - ف",
    "ar": "قرف",
    "alt": [],
    "cat": "root"
  },
  "xrs": {
    "ro": "xrs",
    "ur": "خرص",
    "en": "Root: خ - ر - ص",
    "ar": "خرص",
    "alt": [],
    "cat": "root"
  },
  "$rh": {
    "ro": "$rh",
    "ur": "شرح",
    "en": "Root: ش - ر - ح",
    "ar": "شرح",
    "alt": [],
    "cat": "root"
  },
  "wsws": {
    "ro": "wsws",
    "ur": "وسوس",
    "en": "Root: و - س - و - س",
    "ar": "وسوس",
    "alt": [],
    "cat": "root"
  },
  "jvm": {
    "ro": "jvm",
    "ur": "جثم",
    "en": "Root: ج - ث - م",
    "ar": "جثم",
    "alt": [],
    "cat": "root"
  },
  "jlw": {
    "ro": "jlw",
    "ur": "جلو",
    "en": "Root: ج - ل - و",
    "ar": "جلو",
    "alt": [],
    "cat": "root"
  },
  "asf": {
    "ro": "asf",
    "ur": "اسف",
    "en": "Root: ا - س - ف",
    "ar": "اسف",
    "alt": [],
    "cat": "root"
  },
  "wjl": {
    "ro": "wjl",
    "ur": "وجل",
    "en": "Root: و - ج - ل",
    "ar": "وجل",
    "alt": [],
    "cat": "root"
  },
  "gwv": {
    "ro": "gwv",
    "ur": "غوث",
    "en": "Root: غ - و - ث",
    "ar": "غوث",
    "alt": [],
    "cat": "root"
  },
  "mdy": {
    "ro": "mdy",
    "ur": "مضي",
    "en": "Root: م - ض - ي",
    "ar": "مضي",
    "alt": [],
    "cat": "root"
  },
  "*mm": {
    "ro": "*mm",
    "ur": "ذمم",
    "en": "Root: ذ - م - م",
    "ar": "ذمم",
    "alt": [],
    "cat": "root"
  },
  "zhq": {
    "ro": "zhq",
    "ur": "زهق",
    "en": "Root: ز - ه - ق",
    "ar": "زهق",
    "alt": [],
    "cat": "root"
  },
  "lzm": {
    "ro": "lzm",
    "ur": "لزم",
    "en": "Root: ل - ز - م",
    "ar": "لزم",
    "alt": [],
    "cat": "root"
  },
  "*re": {
    "ro": "*re",
    "ur": "ذرع",
    "en": "Root: ذ - ر - ع",
    "ar": "ذرع",
    "alt": [],
    "cat": "root"
  },
  "esb": {
    "ro": "esb",
    "ur": "عصب",
    "en": "Root: ع - ص - ب",
    "ar": "عصب",
    "alt": [],
    "cat": "root"
  },
  "qdd": {
    "ro": "qdd",
    "ur": "قدد",
    "en": "Root: ق - د - د",
    "ar": "قدد",
    "alt": [],
    "cat": "root"
  },
  "qre": {
    "ro": "qre",
    "ur": "قرع",
    "en": "Root: ق - ر - ع",
    "ar": "قرع",
    "alt": [],
    "cat": "root"
  },
  "srx": {
    "ro": "srx",
    "ur": "صرخ",
    "en": "Root: ص - ر - خ",
    "ar": "صرخ",
    "alt": [],
    "cat": "root"
  },
  "bwr": {
    "ro": "bwr",
    "ur": "بور",
    "en": "Root: ب - و - ر",
    "ar": "بور",
    "alt": [],
    "cat": "root"
  },
  "$hb": {
    "ro": "$hb",
    "ur": "شهب",
    "en": "Root: ش - ه - ب",
    "ar": "شهب",
    "alt": [],
    "cat": "root"
  },
  "sde": {
    "ro": "sde",
    "ur": "صدع",
    "en": "Root: ص - د - ع",
    "ar": "صدع",
    "alt": [],
    "cat": "root"
  },
  "etb": {
    "ro": "etb",
    "ur": "عتب",
    "en": "Root: ع - ت - ب",
    "ar": "عتب",
    "alt": [],
    "cat": "root"
  },
  "nfd": {
    "ro": "nfd",
    "ur": "نفد",
    "en": "Root: ن - ف - د",
    "ar": "نفد",
    "alt": [],
    "cat": "root"
  },
  "ksf": {
    "ro": "ksf",
    "ur": "كسف",
    "en": "Root: ك - س - ف",
    "ar": "كسف",
    "alt": [],
    "cat": "root"
  },
  "vbr": {
    "ro": "vbr",
    "ur": "ثبر",
    "en": "Root: ث - ب - ر",
    "ar": "ثبر",
    "alt": [],
    "cat": "root"
  },
  "ark": {
    "ro": "ark",
    "ur": "ارك",
    "en": "Root: ا - ر - ك",
    "ar": "ارك",
    "alt": [],
    "cat": "root"
  },
  "twy": {
    "ro": "twy",
    "ur": "طوي",
    "en": "Root: ط - و - ي",
    "ar": "طوي",
    "alt": [],
    "cat": "root"
  },
  "$tt": {
    "ro": "$tt",
    "ur": "شتت",
    "en": "Root: ش - ت - ت",
    "ar": "شتت",
    "alt": [],
    "cat": "root"
  },
  "brd": {
    "ro": "brd",
    "ur": "برد",
    "en": "Root: ب - ر - د",
    "ar": "برد",
    "alt": [],
    "cat": "root"
  },
  "dhn": {
    "ro": "dhn",
    "ur": "دهن",
    "en": "Root: د - ه - ن",
    "ar": "دهن",
    "alt": [],
    "cat": "root"
  },
  "wze": {
    "ro": "wze",
    "ur": "وزع",
    "en": "Root: و - ز - ع",
    "ar": "وزع",
    "alt": [],
    "cat": "root"
  },
  "fwj": {
    "ro": "fwj",
    "ur": "فوج",
    "en": "Root: ف - و - ج",
    "ar": "فوج",
    "alt": [],
    "cat": "root"
  },
  "xsa": {
    "ro": "xsa",
    "ur": "خسا",
    "en": "Root: خ - س - ا",
    "ar": "خسا",
    "alt": [],
    "cat": "root"
  },
  "xss": {
    "ro": "xss",
    "ur": "خصص",
    "en": "Root: خ - ص - ص",
    "ar": "خصص",
    "alt": [],
    "cat": "root"
  },
  "nsx": {
    "ro": "nsx",
    "ur": "نسخ",
    "en": "Root: ن - س - خ",
    "ar": "نسخ",
    "alt": [],
    "cat": "root"
  },
  "hat": {
    "ro": "hat",
    "ur": "هات",
    "en": "Root: ه - ا - ت",
    "ar": "هات",
    "alt": [],
    "cat": "root"
  },
  "twq": {
    "ro": "twq",
    "ur": "طوق",
    "en": "Root: ط - و - ق",
    "ar": "طوق",
    "alt": [],
    "cat": "root"
  },
  "dlw": {
    "ro": "dlw",
    "ur": "دلو",
    "en": "Root: د - ل - و",
    "ar": "دلو",
    "alt": [],
    "cat": "root"
  },
  "nsl": {
    "ro": "nsl",
    "ur": "نسل",
    "en": "Root: ن - س - ل",
    "ar": "نسل",
    "alt": [],
    "cat": "root"
  },
  "hyd": {
    "ro": "hyd",
    "ur": "حيض",
    "en": "Root: ح - ي - ض",
    "ar": "حيض",
    "alt": [],
    "cat": "root"
  },
  "$wr": {
    "ro": "$wr",
    "ur": "شور",
    "en": "Root: ش - و - ر",
    "ar": "شور",
    "alt": [],
    "cat": "root"
  },
  "eff": {
    "ro": "eff",
    "ur": "عفف",
    "en": "Root: ع - ف - ف",
    "ar": "عفف",
    "alt": [],
    "cat": "root"
  },
  "qntr": {
    "ro": "qntr",
    "ur": "قنطر",
    "en": "Root: ق - ن - ط - ر",
    "ar": "قنطر",
    "alt": [],
    "cat": "root"
  },
  "amd": {
    "ro": "amd",
    "ur": "امد",
    "en": "Root: ا - م - د",
    "ar": "امد",
    "alt": [],
    "cat": "root"
  },
  "qlm": {
    "ro": "qlm",
    "ur": "قلم",
    "en": "Root: ق - ل - م",
    "ar": "قلم",
    "alt": [],
    "cat": "root"
  },
  "hya": {
    "ro": "hya",
    "ur": "هيا",
    "en": "Root: ه - ي - ا",
    "ar": "هيا",
    "alt": [],
    "cat": "root"
  },
  "nml": {
    "ro": "nml",
    "ur": "نمل",
    "en": "Root: ن - م - ل",
    "ar": "نمل",
    "alt": [],
    "cat": "root"
  },
  "f$l": {
    "ro": "f$l",
    "ur": "فشل",
    "en": "Root: ف - ش - ل",
    "ar": "فشل",
    "alt": [],
    "cat": "root"
  },
  "fwr": {
    "ro": "fwr",
    "ur": "فور",
    "en": "Root: ف - و - ر",
    "ar": "فور",
    "alt": [],
    "cat": "root"
  },
  "sxt": {
    "ro": "sxt",
    "ur": "سخط",
    "en": "Root: س - خ - ط",
    "ar": "سخط",
    "alt": [],
    "cat": "root"
  },
  "myz": {
    "ro": "myz",
    "ur": "ميز",
    "en": "Root: م - ي - ز",
    "ar": "ميز",
    "alt": [],
    "cat": "root"
  },
  "hna": {
    "ro": "hna",
    "ur": "هنا",
    "en": "Root: ه - ن - ا",
    "ar": "هنا",
    "alt": [],
    "cat": "root"
  },
  "wfq": {
    "ro": "wfq",
    "ur": "وفق",
    "en": "Root: و - ف - ق",
    "ar": "وفق",
    "alt": [],
    "cat": "root"
  },
  "gsl": {
    "ro": "gsl",
    "ur": "غسل",
    "en": "Root: غ - س - ل",
    "ar": "غسل",
    "alt": [],
    "cat": "root"
  },
  "msh": {
    "ro": "msh",
    "ur": "مسح",
    "en": "Root: م - س - ح",
    "ar": "مسح",
    "alt": [],
    "cat": "root"
  },
  "nqr": {
    "ro": "nqr",
    "ur": "نقر",
    "en": "Root: ن - ق - ر",
    "ar": "نقر",
    "alt": [],
    "cat": "root"
  },
  "qld": {
    "ro": "qld",
    "ur": "قلد",
    "en": "Root: ق - ل - د",
    "ar": "قلد",
    "alt": [],
    "cat": "root"
  },
  "jrh": {
    "ro": "jrh",
    "ur": "جرح",
    "en": "Root: ج - ر - ح",
    "ar": "جرح",
    "alt": [],
    "cat": "root"
  },
  "keb": {
    "ro": "keb",
    "ur": "كعب",
    "en": "Root: ك - ع - ب",
    "ar": "كعب",
    "alt": [],
    "cat": "root"
  },
  "sht": {
    "ro": "sht",
    "ur": "سحت",
    "en": "Root: س - ح - ت",
    "ar": "سحت",
    "alt": [],
    "cat": "root"
  },
  "wqf": {
    "ro": "wqf",
    "ur": "وقف",
    "en": "Root: و - ق - ف",
    "ar": "وقف",
    "alt": [],
    "cat": "root"
  },
  "wrq": {
    "ro": "wrq",
    "ur": "ورق",
    "en": "Root: و - ر - ق",
    "ar": "ورق",
    "alt": [],
    "cat": "root"
  },
  "ybs": {
    "ro": "ybs",
    "ur": "يبس",
    "en": "Root: ي - ب - س",
    "ar": "يبس",
    "alt": [],
    "cat": "root"
  },
  "krb": {
    "ro": "krb",
    "ur": "كرب",
    "en": "Root: ك - ر - ب",
    "ar": "كرب",
    "alt": [],
    "cat": "root"
  },
  "afl": {
    "ro": "afl",
    "ur": "افل",
    "en": "Root: ا - ف - ل",
    "ar": "افل",
    "alt": [],
    "cat": "root"
  },
  "gmr": {
    "ro": "gmr",
    "ur": "غمر",
    "en": "Root: غ - م - ر",
    "ar": "غمر",
    "alt": [],
    "cat": "root"
  },
  "flq": {
    "ro": "flq",
    "ur": "فلق",
    "en": "Daybreak / Cleaving",
    "ar": "فلق",
    "alt": [],
    "cat": "root"
  },
  "subah ka nikalna": {
    "ro": "subah ka nikalna",
    "ur": "فلق",
    "en": "Daybreak / Cleaving",
    "ar": "فلق",
    "alt": [],
    "cat": "root"
  },
  "phadna": {
    "ro": "phadna",
    "ur": "فلق",
    "en": "Daybreak / Cleaving",
    "ar": "فلق",
    "alt": [],
    "cat": "root"
  },
  "xrq": {
    "ro": "xrq",
    "ur": "خرق",
    "en": "Root: خ - ر - ق",
    "ar": "خرق",
    "alt": [],
    "cat": "root"
  },
  "zxrf": {
    "ro": "zxrf",
    "ur": "زخرف",
    "en": "Root: ز - خ - ر - ف",
    "ar": "زخرف",
    "alt": [],
    "cat": "root"
  },
  "lmm": {
    "ro": "lmm",
    "ur": "لمم",
    "en": "Root: ل - م - م",
    "ar": "لمم",
    "alt": [],
    "cat": "root"
  },
  "dhr": {
    "ro": "dhr",
    "ur": "دحر",
    "en": "Root: د - ح - ر",
    "ar": "دحر",
    "alt": [],
    "cat": "root"
  },
  "tlb": {
    "ro": "tlb",
    "ur": "طلب",
    "en": "Root: ط - ل - ب",
    "ar": "طلب",
    "alt": [],
    "cat": "root"
  },
  "nht": {
    "ro": "nht",
    "ur": "نحت",
    "en": "Root: ن - ح - ت",
    "ar": "نحت",
    "alt": [],
    "cat": "root"
  },
  "jsd": {
    "ro": "jsd",
    "ur": "جسد",
    "en": "Root: ج - س - د",
    "ar": "جسد",
    "alt": [],
    "cat": "root"
  },
  "nfl": {
    "ro": "nfl",
    "ur": "نفل",
    "en": "Root: ن - ف - ل",
    "ar": "نفل",
    "alt": [],
    "cat": "root"
  },
  "gwr": {
    "ro": "gwr",
    "ur": "غور",
    "en": "Root: غ - و - ر",
    "ar": "غور",
    "alt": [],
    "cat": "root"
  },
  "lmz": {
    "ro": "lmz",
    "ur": "لمز",
    "en": "Root: ل - م - ز",
    "ar": "لمز",
    "alt": [],
    "cat": "root"
  },
  "jdr": {
    "ro": "jdr",
    "ur": "جدر",
    "en": "Root: ج - د - ر",
    "ar": "جدر",
    "alt": [],
    "cat": "root"
  },
  "$an": {
    "ro": "$an",
    "ur": "شان",
    "en": "Root: ش - ا - ن",
    "ar": "شان",
    "alt": [],
    "cat": "root"
  },
  "r*l": {
    "ro": "r*l",
    "ur": "رذل",
    "en": "Root: ر - ذ - ل",
    "ar": "رذل",
    "alt": [],
    "cat": "root"
  },
  "$yx": {
    "ro": "$yx",
    "ur": "شيخ",
    "en": "Root: ش - ي - خ",
    "ar": "شيخ",
    "alt": [],
    "cat": "root"
  },
  "mjd": {
    "ro": "mjd",
    "ur": "مجد",
    "en": "Root: م - ج - د",
    "ar": "مجد",
    "alt": [],
    "cat": "root"
  },
  "rkn": {
    "ro": "rkn",
    "ur": "ركن",
    "en": "Root: ر - ك - ن",
    "ar": "ركن",
    "alt": [],
    "cat": "root"
  },
  "sjl": {
    "ro": "sjl",
    "ur": "سجل",
    "en": "Root: س - ج - ل",
    "ar": "سجل",
    "alt": [],
    "cat": "root"
  },
  "tbb": {
    "ro": "tbb",
    "ur": "تبب",
    "en": "Root: ت - ب - ب",
    "ar": "تبب",
    "alt": [],
    "cat": "root"
  },
  "swl": {
    "ro": "swl",
    "ur": "سول",
    "en": "Root: س - و - ل",
    "ar": "سول",
    "alt": [],
    "cat": "root"
  },
  "smn": {
    "ro": "smn",
    "ur": "سمن",
    "en": "Root: س - م - ن",
    "ar": "سمن",
    "alt": [],
    "cat": "root"
  },
  "gyv": {
    "ro": "gyv",
    "ur": "غيث",
    "en": "Root: غ - ي - ث",
    "ar": "غيث",
    "alt": [],
    "cat": "root"
  },
  "bwl": {
    "ro": "bwl",
    "ur": "بول",
    "en": "Root: ب - و - ل",
    "ar": "بول",
    "alt": [],
    "cat": "root"
  },
  "jhz": {
    "ro": "jhz",
    "ur": "جهز",
    "en": "Root: ج - ه - ز",
    "ar": "جهز",
    "alt": [],
    "cat": "root"
  },
  "rhl": {
    "ro": "rhl",
    "ur": "رحل",
    "en": "Root: ر - ح - ل",
    "ar": "رحل",
    "alt": [],
    "cat": "root"
  },
  "srb": {
    "ro": "srb",
    "ur": "سرب",
    "en": "Root: س - ر - ب",
    "ar": "سرب",
    "alt": [],
    "cat": "root"
  },
  "syl": {
    "ro": "syl",
    "ur": "سيل",
    "en": "Root: س - ي - ل",
    "ar": "سيل",
    "alt": [],
    "cat": "root"
  },
  "zwl": {
    "ro": "zwl",
    "ur": "زول",
    "en": "Root: ز - و - ل",
    "ar": "زول",
    "alt": [],
    "cat": "root"
  },
  "slsl": {
    "ro": "slsl",
    "ur": "صلصل",
    "en": "Root: ص - ل - ص - ل",
    "ar": "صلصل",
    "alt": [],
    "cat": "root"
  },
  "hma": {
    "ro": "hma",
    "ur": "حما",
    "en": "Root: ح - م - ا",
    "ar": "حما",
    "alt": [],
    "cat": "root"
  },
  "xfd": {
    "ro": "xfd",
    "ur": "خفض",
    "en": "Root: خ - ف - ض",
    "ar": "خفض",
    "alt": [],
    "cat": "root"
  },
  "sqf": {
    "ro": "sqf",
    "ur": "سقف",
    "en": "Root: س - ق - ف",
    "ar": "سقف",
    "alt": [],
    "cat": "root"
  },
  "dxr": {
    "ro": "dxr",
    "ur": "دخر",
    "en": "Root: د - خ - ر",
    "ar": "دخر",
    "alt": [],
    "cat": "root"
  },
  "ejm": {
    "ro": "ejm",
    "ur": "عجم",
    "en": "Root: ع - ج - م",
    "ar": "عجم",
    "alt": [],
    "cat": "root"
  },
  "gsq": {
    "ro": "gsq",
    "ur": "غسق",
    "en": "Root: غ - س - ق",
    "ar": "غسق",
    "alt": [],
    "cat": "root"
  },
  "rqy": {
    "ro": "rqy",
    "ur": "رقي",
    "en": "Root: ر - ق - ي",
    "ar": "رقي",
    "alt": [],
    "cat": "root"
  },
  "dhd": {
    "ro": "dhd",
    "ur": "دحض",
    "en": "Root: د - ح - ض",
    "ar": "دحض",
    "alt": [],
    "cat": "root"
  },
  "sfn": {
    "ro": "sfn",
    "ur": "سفن",
    "en": "Root: س - ف - ن",
    "ar": "سفن",
    "alt": [],
    "cat": "root"
  },
  "smr": {
    "ro": "smr",
    "ur": "سمر",
    "en": "Root: س - م - ر",
    "ar": "سمر",
    "alt": [],
    "cat": "root"
  },
  "tfl": {
    "ro": "tfl",
    "ur": "طفل",
    "en": "Root: ط - ف - ل",
    "ar": "طفل",
    "alt": [],
    "cat": "root"
  },
  "eqm": {
    "ro": "eqm",
    "ur": "عقم",
    "en": "Root: ع - ق - م",
    "ar": "عقم",
    "alt": [],
    "cat": "root"
  },
  "ljj": {
    "ro": "ljj",
    "ur": "لجج",
    "en": "Root: ل - ج - ج",
    "ar": "لجج",
    "alt": [],
    "cat": "root"
  },
  "gdd": {
    "ro": "gdd",
    "ur": "غضض",
    "en": "Root: غ - ض - ض",
    "ar": "غضض",
    "alt": [],
    "cat": "root"
  },
  "ewr": {
    "ro": "ewr",
    "ur": "عور",
    "en": "Root: ع - و - ر",
    "ar": "عور",
    "alt": [],
    "cat": "root"
  },
  "rtl": {
    "ro": "rtl",
    "ur": "رتل",
    "en": "Root: ر - ت - ل",
    "ar": "رتل",
    "alt": [],
    "cat": "root"
  },
  "srj": {
    "ro": "srj",
    "ur": "سرج",
    "en": "Root: س - ر - ج",
    "ar": "سرج",
    "alt": [],
    "cat": "root"
  },
  "mhn": {
    "ro": "mhn",
    "ur": "مهن",
    "en": "Root: م - ه - ن",
    "ar": "مهن",
    "alt": [],
    "cat": "root"
  },
  "mzq": {
    "ro": "mzq",
    "ur": "مزق",
    "en": "Root: م - ز - ق",
    "ar": "مزق",
    "alt": [],
    "cat": "root"
  },
  "nej": {
    "ro": "nej",
    "ur": "نعج",
    "en": "Root: ن - ع - ج",
    "ar": "نعج",
    "alt": [],
    "cat": "root"
  },
  "kwb": {
    "ro": "kwb",
    "ur": "كوب",
    "en": "Root: ك - و - ب",
    "ar": "كوب",
    "alt": [],
    "cat": "root"
  },
  "tbq": {
    "ro": "tbq",
    "ur": "طبق",
    "en": "Root: ط - ب - ق",
    "ar": "طبق",
    "alt": [],
    "cat": "root"
  },
  "rgd": {
    "ro": "rgd",
    "ur": "رغد",
    "en": "Root: ر - غ - د",
    "ar": "رغد",
    "alt": [],
    "cat": "root"
  },
  "sba": {
    "ro": "sba",
    "ur": "صبا",
    "en": "Root: ص - ب - ا",
    "ar": "صبا",
    "alt": [],
    "cat": "root"
  },
  "sbg": {
    "ro": "sbg",
    "ur": "صبغ",
    "en": "Root: ص - ب - غ",
    "ar": "صبغ",
    "alt": [],
    "cat": "root"
  },
  "lfw": {
    "ro": "lfw",
    "ur": "لفو",
    "en": "Root: ل - ف - و",
    "ar": "لفو",
    "alt": [],
    "cat": "root"
  },
  "xyt": {
    "ro": "xyt",
    "ur": "خيط",
    "en": "Root: خ - ي - ط",
    "ar": "خيط",
    "alt": [],
    "cat": "root"
  },
  "hlq": {
    "ro": "hlq",
    "ur": "حلق",
    "en": "Root: ح - ل - ق",
    "ar": "حلق",
    "alt": [],
    "cat": "root"
  },
  "hzm": {
    "ro": "hzm",
    "ur": "هزم",
    "en": "Root: ه - ز - م",
    "ar": "هزم",
    "alt": [],
    "cat": "root"
  },
  "erw": {
    "ro": "erw",
    "ur": "عرو",
    "en": "Root: ع - ر - و",
    "ar": "عرو",
    "alt": [],
    "cat": "root"
  },
  "jza": {
    "ro": "jza",
    "ur": "جزا",
    "en": "Root: ج - ز - ا",
    "ar": "جزا",
    "alt": [],
    "cat": "root"
  },
  "sam": {
    "ro": "sam",
    "ur": "سام",
    "en": "Root: س - ا - م",
    "ar": "سام",
    "alt": [],
    "cat": "root"
  },
  "rhn": {
    "ro": "rhn",
    "ur": "رهن",
    "en": "Root: ر - ه - ن",
    "ar": "رهن",
    "alt": [],
    "cat": "root"
  },
  "kbt": {
    "ro": "kbt",
    "ur": "كبت",
    "en": "Root: ك - ب - ت",
    "ar": "كبت",
    "alt": [],
    "cat": "root"
  },
  "qrh": {
    "ro": "qrh",
    "ur": "قرح",
    "en": "Root: ق - ر - ح",
    "ar": "قرح",
    "alt": [],
    "cat": "root"
  },
  "dje": {
    "ro": "dje",
    "ur": "ضجع",
    "en": "Root: ض - ج - ع",
    "ar": "ضجع",
    "alt": [],
    "cat": "root"
  },
  "x*l": {
    "ro": "x*l",
    "ur": "خذل",
    "en": "Root: خ - ذ - ل",
    "ar": "خذل",
    "alt": [],
    "cat": "root"
  },
  "ftl": {
    "ro": "ftl",
    "ur": "فتل",
    "en": "Root: ف - ت - ل",
    "ar": "فتل",
    "alt": [],
    "cat": "root"
  },
  "hrd": {
    "ro": "hrd",
    "ur": "حرض",
    "en": "Root: ح - ر - ض",
    "ar": "حرض",
    "alt": [],
    "cat": "root"
  },
  "nkf": {
    "ro": "nkf",
    "ur": "نكف",
    "en": "Root: ن - ك - ف",
    "ar": "نكف",
    "alt": [],
    "cat": "root"
  },
  "bhm": {
    "ro": "bhm",
    "ur": "بهم",
    "en": "Root: ب - ه - م",
    "ar": "بهم",
    "alt": [],
    "cat": "root"
  },
  "$na": {
    "ro": "$na",
    "ur": "شنا",
    "en": "Root: ش - ن - ا",
    "ar": "شنا",
    "alt": [],
    "cat": "root"
  },
  "nqb": {
    "ro": "nqb",
    "ur": "نقب",
    "en": "Root: ن - ق - ب",
    "ar": "نقب",
    "alt": [],
    "cat": "root"
  },
  "ezr": {
    "ro": "ezr",
    "ur": "عزر",
    "en": "Root: ع - ز - ر",
    "ar": "عزر",
    "alt": [],
    "cat": "root"
  },
  "anf": {
    "ro": "anf",
    "ur": "انف",
    "en": "Root: ا - ن - ف",
    "ar": "انف",
    "alt": [],
    "cat": "root"
  },
  "tfa": {
    "ro": "tfa",
    "ur": "طفا",
    "en": "Root: ط - ف - ا",
    "ar": "طفا",
    "alt": [],
    "cat": "root"
  },
  "nay": {
    "ro": "nay",
    "ur": "ناي",
    "en": "Root: ن - ا - ي",
    "ar": "ناي",
    "alt": [],
    "cat": "root"
  },
  "rmn": {
    "ro": "rmn",
    "ur": "رمن",
    "en": "Root: ر - م - ن",
    "ar": "رمن",
    "alt": [],
    "cat": "root"
  },
  "abl": {
    "ro": "abl",
    "ur": "ابل",
    "en": "Root: ا - ب - ل",
    "ar": "ابل",
    "alt": [],
    "cat": "root"
  },
  "tfq": {
    "ro": "tfq",
    "ur": "طفق",
    "en": "Root: ط - ف - ق",
    "ar": "طفق",
    "alt": [],
    "cat": "root"
  },
  "lqf": {
    "ro": "lqf",
    "ur": "لقف",
    "en": "Root: ل - ق - ف",
    "ar": "لقف",
    "alt": [],
    "cat": "root"
  },
  "slx": {
    "ro": "slx",
    "ur": "سلخ",
    "en": "Root: س - ل - خ",
    "ar": "سلخ",
    "alt": [],
    "cat": "root"
  },
  "mtn": {
    "ro": "mtn",
    "ur": "متن",
    "en": "Root: م - ت - ن",
    "ar": "متن",
    "alt": [],
    "cat": "root"
  },
  "hfw": {
    "ro": "hfw",
    "ur": "حفو",
    "en": "Root: ح - ف - و",
    "ar": "حفو",
    "alt": [],
    "cat": "root"
  },
  "rdf": {
    "ro": "rdf",
    "ur": "ردف",
    "en": "Root: ر - د - ف",
    "ar": "ردف",
    "alt": [],
    "cat": "root"
  },
  "rkm": {
    "ro": "rkm",
    "ur": "ركم",
    "en": "Root: ر - ك - م",
    "ar": "ركم",
    "alt": [],
    "cat": "root"
  },
  "lja": {
    "ro": "lja",
    "ur": "لجا",
    "en": "Root: ل - ج - ا",
    "ar": "لجا",
    "alt": [],
    "cat": "root"
  },
  "ass": {
    "ro": "ass",
    "ur": "اسس",
    "en": "Root: ا - س - س",
    "ar": "اسس",
    "alt": [],
    "cat": "root"
  },
  "zma": {
    "ro": "zma",
    "ur": "ظما",
    "en": "Root: ظ - م - ا",
    "ar": "ظما",
    "alt": [],
    "cat": "root"
  },
  "lft": {
    "ro": "lft",
    "ur": "لفت",
    "en": "Root: ل - ف - ت",
    "ar": "لفت",
    "alt": [],
    "cat": "root"
  },
  "xbt": {
    "ro": "xbt",
    "ur": "خبت",
    "en": "Root: خ - ب - ت",
    "ar": "خبت",
    "alt": [],
    "cat": "root"
  },
  "wjs": {
    "ro": "wjs",
    "ur": "وجس",
    "en": "Root: و - ج - س",
    "ar": "وجس",
    "alt": [],
    "cat": "root"
  },
  "rht": {
    "ro": "rht",
    "ur": "رهط",
    "en": "Root: ر - ه - ط",
    "ar": "رهط",
    "alt": [],
    "cat": "root"
  },
  "zfr": {
    "ro": "zfr",
    "ur": "زفر",
    "en": "Root: ز - ف - ر",
    "ar": "زفر",
    "alt": [],
    "cat": "root"
  },
  "*ab": {
    "ro": "*ab",
    "ur": "ذاب",
    "en": "Root: ذ - ا - ب",
    "ar": "ذاب",
    "alt": [],
    "cat": "root"
  },
  "sbw": {
    "ro": "sbw",
    "ur": "صبو",
    "en": "Root: ص - ب - و",
    "ar": "صبو",
    "alt": [],
    "cat": "root"
  },
  "dgv": {
    "ro": "dgv",
    "ur": "ضغث",
    "en": "Root: ض - غ - ث",
    "ar": "ضغث",
    "alt": [],
    "cat": "root"
  },
  "hwj": {
    "ro": "hwj",
    "ur": "حوج",
    "en": "Root: ح - و - ج",
    "ar": "حوج",
    "alt": [],
    "cat": "root"
  },
  "eyr": {
    "ro": "eyr",
    "ur": "عير",
    "en": "Root: ع - ي - ر",
    "ar": "عير",
    "alt": [],
    "cat": "root"
  },
  "fqd": {
    "ro": "fqd",
    "ur": "فقد",
    "en": "Root: ف - ق - د",
    "ar": "فقد",
    "alt": [],
    "cat": "root"
  },
  "brh": {
    "ro": "brh",
    "ur": "برح",
    "en": "Root: ب - ر - ح",
    "ar": "برح",
    "alt": [],
    "cat": "root"
  },
  "$kw": {
    "ro": "$kw",
    "ur": "شكو",
    "en": "Root: ش - ك - و",
    "ar": "شكو",
    "alt": [],
    "cat": "root"
  },
  "zjw": {
    "ro": "zjw",
    "ur": "زجو",
    "en": "Root: ز - ج - و",
    "ar": "زجو",
    "alt": [],
    "cat": "root"
  },
  "zbd": {
    "ro": "zbd",
    "ur": "زبد",
    "en": "Root: ز - ب - د",
    "ar": "زبد",
    "alt": [],
    "cat": "root"
  },
  "mhw": {
    "ro": "mhw",
    "ur": "محو",
    "en": "Root: م - ح - و",
    "ar": "محو",
    "alt": [],
    "cat": "root"
  },
  "swg": {
    "ro": "swg",
    "ur": "سوغ",
    "en": "Root: س - و - غ",
    "ar": "سوغ",
    "alt": [],
    "cat": "root"
  },
  "hte": {
    "ro": "hte",
    "ur": "هطع",
    "en": "Root: ه - ط - ع",
    "ar": "هطع",
    "alt": [],
    "cat": "root"
  },
  "srbl": {
    "ro": "srbl",
    "ur": "سربل",
    "en": "Root: س - ر - ب - ل",
    "ar": "سربل",
    "alt": [],
    "cat": "root"
  },
  "jar": {
    "ro": "jar",
    "ur": "جار",
    "en": "Root: ج - ا - ر",
    "ar": "جار",
    "alt": [],
    "cat": "root"
  },
  "aff": {
    "ro": "aff",
    "ur": "افف",
    "en": "Root: ا - ف - ف",
    "ar": "افف",
    "alt": [],
    "cat": "root"
  },
  "b*r": {
    "ro": "b*r",
    "ur": "بذر",
    "en": "Root: ب - ذ - ر",
    "ar": "بذر",
    "alt": [],
    "cat": "root"
  },
  "mrh": {
    "ro": "mrh",
    "ur": "مرح",
    "en": "Root: م - ر - ح",
    "ar": "مرح",
    "alt": [],
    "cat": "root"
  },
  "fzz": {
    "ro": "fzz",
    "ur": "فزز",
    "en": "Root: ف - ز - ز",
    "ar": "فزز",
    "alt": [],
    "cat": "root"
  },
  "lff": {
    "ro": "lff",
    "ur": "لفف",
    "en": "Root: ل - ف - ف",
    "ar": "لفف",
    "alt": [],
    "cat": "root"
  },
  "*qn": {
    "ro": "*qn",
    "ur": "ذقن",
    "en": "Root: ذ - ق - ن",
    "ar": "ذقن",
    "alt": [],
    "cat": "root"
  },
  "xft": {
    "ro": "xft",
    "ur": "خفت",
    "en": "Root: خ - ف - ت",
    "ar": "خفت",
    "alt": [],
    "cat": "root"
  },
  "rqm": {
    "ro": "rqm",
    "ur": "رقم",
    "en": "Root: ر - ق - م",
    "ar": "رقم",
    "alt": [],
    "cat": "root"
  },
  "wsd": {
    "ro": "wsd",
    "ur": "وصد",
    "en": "Root: و - ص - د",
    "ar": "وصد",
    "alt": [],
    "cat": "root"
  },
  "*rw": {
    "ro": "*rw",
    "ur": "ذرو",
    "en": "Root: ذ - ر - و",
    "ar": "ذرو",
    "alt": [],
    "cat": "root"
  },
  "$yb": {
    "ro": "$yb",
    "ur": "شيب",
    "en": "Root: ش - ي - ب",
    "ar": "شيب",
    "alt": [],
    "cat": "root"
  },
  "j*e": {
    "ro": "j*e",
    "ur": "جذع",
    "en": "Root: ج - ذ - ع",
    "ar": "جذع",
    "alt": [],
    "cat": "root"
  },
  "jvw": {
    "ro": "jvw",
    "ur": "جثو",
    "en": "Root: ج - ث - و",
    "ar": "جثو",
    "alt": [],
    "cat": "root"
  },
  "qbs": {
    "ro": "qbs",
    "ur": "قبس",
    "en": "Root: ق - ب - س",
    "ar": "قبس",
    "alt": [],
    "cat": "root"
  },
  "ery": {
    "ro": "ery",
    "ur": "عري",
    "en": "Root: ع - ر - ي",
    "ar": "عري",
    "alt": [],
    "cat": "root"
  },
  "rkd": {
    "ro": "rkd",
    "ur": "ركض",
    "en": "Root: ر - ك - ض",
    "ar": "ركض",
    "alt": [],
    "cat": "root"
  },
  "fjj": {
    "ro": "fjj",
    "ur": "فجج",
    "en": "Root: ف - ج - ج",
    "ar": "فجج",
    "alt": [],
    "cat": "root"
  },
  "nks": {
    "ro": "nks",
    "ur": "نكس",
    "en": "Root: ن - ك - س",
    "ar": "نكس",
    "alt": [],
    "cat": "root"
  },
  "mdg": {
    "ro": "mdg",
    "ur": "مضغ",
    "en": "Root: م - ض - غ",
    "ar": "مضغ",
    "alt": [],
    "cat": "root"
  },
  "bhj": {
    "ro": "bhj",
    "ur": "بهج",
    "en": "Root: ب - ه - ج",
    "ar": "بهج",
    "alt": [],
    "cat": "root"
  },
  "wvn": {
    "ro": "wvn",
    "ur": "وثن",
    "en": "Root: و - ث - ن",
    "ar": "وثن",
    "alt": [],
    "cat": "root"
  },
  "sll": {
    "ro": "sll",
    "ur": "سلل",
    "en": "Root: س - ل - ل",
    "ar": "سلل",
    "alt": [],
    "cat": "root"
  },
  "wtr": {
    "ro": "wtr",
    "ur": "وتر",
    "en": "Root: و - ت - ر",
    "ar": "وتر",
    "alt": [],
    "cat": "root"
  },
  "hmz": {
    "ro": "hmz",
    "ur": "همز",
    "en": "Root: ه - م - ز",
    "ar": "همز",
    "alt": [],
    "cat": "root"
  },
  "jyb": {
    "ro": "jyb",
    "ur": "جيب",
    "en": "Root: ج - ي - ب",
    "ar": "جيب",
    "alt": [],
    "cat": "root"
  },
  "nvr": {
    "ro": "nvr",
    "ur": "نثر",
    "en": "Root: ن - ث - ر",
    "ar": "نثر",
    "alt": [],
    "cat": "root"
  },
  "ajj": {
    "ro": "ajj",
    "ur": "اجج",
    "en": "Root: ا - ج - ج",
    "ar": "اجج",
    "alt": [],
    "cat": "root"
  },
  "$hn": {
    "ro": "$hn",
    "ur": "شحن",
    "en": "Root: ش - ح - ن",
    "ar": "شحن",
    "alt": [],
    "cat": "root"
  },
  "hdq": {
    "ro": "hdq",
    "ur": "حدق",
    "en": "Root: ح - د - ق",
    "ar": "حدق",
    "alt": [],
    "cat": "root"
  },
  "jdv": {
    "ro": "jdv",
    "ur": "جدث",
    "en": "Root: ج - د - ث",
    "ar": "جدث",
    "alt": [],
    "cat": "root"
  },
  "l**": {
    "ro": "l**",
    "ur": "لذذ",
    "en": "Root: ل - ذ - ذ",
    "ar": "لذذ",
    "alt": [],
    "cat": "root"
  },
  "zqm": {
    "ro": "zqm",
    "ur": "زقم",
    "en": "Root: ز - ق - م",
    "ar": "زقم",
    "alt": [],
    "cat": "root"
  },
  "rwg": {
    "ro": "rwg",
    "ur": "روغ",
    "en": "Root: ر - و - غ",
    "ar": "روغ",
    "alt": [],
    "cat": "root"
  },
  "wtd": {
    "ro": "wtd",
    "ur": "وتد",
    "en": "Root: و - ت - د",
    "ar": "وتد",
    "alt": [],
    "cat": "root"
  },
  "kwr": {
    "ro": "kwr",
    "ur": "كور",
    "en": "Root: ك - و - ر",
    "ar": "كور",
    "alt": [],
    "cat": "root"
  },
  "azf": {
    "ro": "azf",
    "ur": "ازف",
    "en": "Root: ا - ز - ف",
    "ar": "ازف",
    "alt": [],
    "cat": "root"
  },
  "sjr": {
    "ro": "sjr",
    "ur": "سجر",
    "en": "Root: س - ج - ر",
    "ar": "سجر",
    "alt": [],
    "cat": "root"
  },
  "srsr": {
    "ro": "srsr",
    "ur": "صرصر",
    "en": "Root: ص - ر - ص - ر",
    "ar": "صرصر",
    "alt": [],
    "cat": "root"
  },
  "nhs": {
    "ro": "nhs",
    "ur": "نحس",
    "en": "Root: ن - ح - س",
    "ar": "نحس",
    "alt": [],
    "cat": "root"
  },
  "afq": {
    "ro": "afq",
    "ur": "افق",
    "en": "Root: ا - ف - ق",
    "ar": "افق",
    "alt": [],
    "cat": "root"
  },
  "mwr": {
    "ro": "mwr",
    "ur": "مور",
    "en": "Root: م - و - ر",
    "ar": "مور",
    "alt": [],
    "cat": "root"
  },
  "dee": {
    "ro": "dee",
    "ur": "دعع",
    "en": "Root: د - ع - ع",
    "ar": "دعع",
    "alt": [],
    "cat": "root"
  },
  "nf*": {
    "ro": "nf*",
    "ur": "نفذ",
    "en": "Root: ن - ف - ذ",
    "ar": "نفذ",
    "alt": [],
    "cat": "root"
  },
  "$am": {
    "ro": "$am",
    "ur": "شام",
    "en": "Root: ش - ا - م",
    "ar": "شام",
    "alt": [],
    "cat": "root"
  },
  "vll": {
    "ro": "vll",
    "ur": "ثلل",
    "en": "Root: ث - ل - ل",
    "ar": "ثلل",
    "alt": [],
    "cat": "root"
  },
  "fsh": {
    "ro": "fsh",
    "ur": "فسح",
    "en": "Root: ف - س - ح",
    "ar": "فسح",
    "alt": [],
    "cat": "root"
  },
  "srm": {
    "ro": "srm",
    "ur": "صرم",
    "en": "Root: ص - ر - م",
    "ar": "صرم",
    "alt": [],
    "cat": "root"
  },
  "ebs": {
    "ro": "ebs",
    "ur": "عبس",
    "en": "Root: ع - ب - س",
    "ar": "عبس",
    "alt": [],
    "cat": "root"
  },
  "ndr": {
    "ro": "ndr",
    "ur": "نضر",
    "en": "Root: ن - ض - ر",
    "ar": "نضر",
    "alt": [],
    "cat": "root"
  },
  "mzj": {
    "ro": "mzj",
    "ur": "مزج",
    "en": "Root: م - ز - ج",
    "ar": "مزج",
    "alt": [],
    "cat": "root"
  },
  "lhb": {
    "ro": "lhb",
    "ur": "لهب",
    "en": "Root: ل - ه - ب",
    "ar": "لهب",
    "alt": [],
    "cat": "root"
  },
  "red": {
    "ro": "red",
    "ur": "رعد",
    "en": "Root: ر - ع - د",
    "ar": "رعد",
    "alt": [],
    "cat": "root"
  },
  "sfk": {
    "ro": "sfk",
    "ur": "سفك",
    "en": "Root: س - ف - ك",
    "ar": "سفك",
    "alt": [],
    "cat": "root"
  },
  "htt": {
    "ro": "htt",
    "ur": "حطط",
    "en": "Root: ح - ط - ط",
    "ar": "حطط",
    "alt": [],
    "cat": "root"
  },
  "glf": {
    "ro": "glf",
    "ur": "غلف",
    "en": "Root: غ - ل - ف",
    "ar": "غلف",
    "alt": [],
    "cat": "root"
  },
  "zhzh": {
    "ro": "zhzh",
    "ur": "زحزح",
    "en": "Root: ز - ح - ز - ح",
    "ar": "زحزح",
    "alt": [],
    "cat": "root"
  },
  "xrb": {
    "ro": "xrb",
    "ur": "خرب",
    "en": "Root: خ - ر - ب",
    "ar": "خرب",
    "alt": [],
    "cat": "root"
  },
  "jnf": {
    "ro": "jnf",
    "ur": "جنف",
    "en": "Root: ج - ن - ف",
    "ar": "جنف",
    "alt": [],
    "cat": "root"
  },
  "rfv": {
    "ro": "rfv",
    "ur": "رفث",
    "en": "Root: ر - ف - ث",
    "ar": "رفث",
    "alt": [],
    "cat": "root"
  },
  "zwd": {
    "ro": "zwd",
    "ur": "زود",
    "en": "Root: ز - و - د",
    "ar": "زود",
    "alt": [],
    "cat": "root"
  },
  "ldd": {
    "ro": "ldd",
    "ur": "لدد",
    "en": "Root: ل - د - د",
    "ar": "لدد",
    "alt": [],
    "cat": "root"
  },
  "amw": {
    "ro": "amw",
    "ur": "امو",
    "en": "Root: ا - م - و",
    "ar": "امو",
    "alt": [],
    "cat": "root"
  },
  "jsm": {
    "ro": "jsm",
    "ur": "جسم",
    "en": "Root: ج - س - م",
    "ar": "جسم",
    "alt": [],
    "cat": "root"
  },
  "krs": {
    "ro": "krs",
    "ur": "كرس",
    "en": "Root: ك - ر - س",
    "ar": "كرس",
    "alt": [],
    "cat": "root"
  },
  "mhq": {
    "ro": "mhq",
    "ur": "محق",
    "en": "Root: م - ح - ق",
    "ar": "محق",
    "alt": [],
    "cat": "root"
  },
  "rsx": {
    "ro": "rsx",
    "ur": "رسخ",
    "en": "Root: ر - س - خ",
    "ar": "رسخ",
    "alt": [],
    "cat": "root"
  },
  "khl": {
    "ro": "khl",
    "ur": "كهل",
    "en": "Root: ك - ه - ل",
    "ar": "كهل",
    "alt": [],
    "cat": "root"
  },
  "kmh": {
    "ro": "kmh",
    "ur": "كمه",
    "en": "Root: ك - م - ه",
    "ar": "كمه",
    "alt": [],
    "cat": "root"
  },
  "brs": {
    "ro": "brs",
    "ur": "برص",
    "en": "Root: ب - ر - ص",
    "ar": "برص",
    "alt": [],
    "cat": "root"
  },
  "$fw": {
    "ro": "$fw",
    "ur": "شفو",
    "en": "Root: ش - ف - و",
    "ar": "شفو",
    "alt": [],
    "cat": "root"
  },
  "hfr": {
    "ro": "hfr",
    "ur": "حفر",
    "en": "Root: ح - ف - ر",
    "ar": "حفر",
    "alt": [],
    "cat": "root"
  },
  "xbl": {
    "ro": "xbl",
    "ur": "خبل",
    "en": "Root: خ - ب - ل",
    "ar": "خبل",
    "alt": [],
    "cat": "root"
  },
  "dwl": {
    "ro": "dwl",
    "ur": "دول",
    "en": "Root: د - و - ل",
    "ar": "دول",
    "alt": [],
    "cat": "root"
  },
  "mhs": {
    "ro": "mhs",
    "ur": "محص",
    "en": "Root: م - ح - ص",
    "ar": "محص",
    "alt": [],
    "cat": "root"
  },
  "kyn": {
    "ro": "kyn",
    "ur": "كين",
    "en": "Root: ك - ي - ن",
    "ar": "كين",
    "alt": [],
    "cat": "root"
  },
  "nes": {
    "ro": "nes",
    "ur": "نعس",
    "en": "Root: ن - ع - س",
    "ar": "نعس",
    "alt": [],
    "cat": "root"
  },
  "nhl": {
    "ro": "nhl",
    "ur": "نحل",
    "en": "Root: ن - ح - ل",
    "ar": "نحل",
    "alt": [],
    "cat": "root"
  },
  "xdn": {
    "ro": "xdn",
    "ur": "خدن",
    "en": "Root: خ - د - ن",
    "ar": "خدن",
    "alt": [],
    "cat": "root"
  },
  "gwt": {
    "ro": "gwt",
    "ur": "غوط",
    "en": "Root: غ - و - ط",
    "ar": "غوط",
    "alt": [],
    "cat": "root"
  },
  "ten": {
    "ro": "ten",
    "ur": "طعن",
    "en": "Root: ط - ع - ن",
    "ar": "طعن",
    "alt": [],
    "cat": "root"
  },
  "$yd": {
    "ro": "$yd",
    "ur": "شيد",
    "en": "Root: ش - ي - د",
    "ar": "شيد",
    "alt": [],
    "cat": "root"
  },
  "qwt": {
    "ro": "qwt",
    "ur": "قوت",
    "en": "Root: ق - و - ت",
    "ar": "قوت",
    "alt": [],
    "cat": "root"
  },
  "rks": {
    "ro": "rks",
    "ur": "ركس",
    "en": "Root: ر - ك - س",
    "ar": "ركس",
    "alt": [],
    "cat": "root"
  },
  "hw*": {
    "ro": "hw*",
    "ur": "حوذ",
    "en": "Root: ح - و - ذ",
    "ar": "حوذ",
    "alt": [],
    "cat": "root"
  },
  "ksl": {
    "ro": "ksl",
    "ur": "كسل",
    "en": "Root: ك - س - ل",
    "ar": "كسل",
    "alt": [],
    "cat": "root"
  },
  "glw": {
    "ro": "glw",
    "ur": "غلو",
    "en": "Root: غ - ل - و",
    "ar": "غلو",
    "alt": [],
    "cat": "root"
  },
  "grw": {
    "ro": "grw",
    "ur": "غرو",
    "en": "Root: غ - ر - و",
    "ar": "غرو",
    "alt": [],
    "cat": "root"
  },
  "hmn": {
    "ro": "hmn",
    "ur": "همن",
    "en": "Root: ه - م - ن",
    "ar": "همن",
    "alt": [],
    "cat": "root"
  },
  "dme": {
    "ro": "dme",
    "ur": "دمع",
    "en": "Root: د - م - ع",
    "ar": "دمع",
    "alt": [],
    "cat": "root"
  },
  "hbs": {
    "ro": "hbs",
    "ur": "حبس",
    "en": "Root: ح - ب - س",
    "ar": "حبس",
    "alt": [],
    "cat": "root"
  },
  "evr": {
    "ro": "evr",
    "ur": "عثر",
    "en": "Root: ع - ث - ر",
    "ar": "عثر",
    "alt": [],
    "cat": "root"
  },
  "qrts": {
    "ro": "qrts",
    "ur": "قرطس",
    "en": "Root: ق - ر - ط - س",
    "ar": "قرطس",
    "alt": [],
    "cat": "root"
  },
  "rtb": {
    "ro": "rtb",
    "ur": "رطب",
    "en": "Root: ر - ط - ب",
    "ar": "رطب",
    "alt": [],
    "cat": "root"
  },
  "bsl": {
    "ro": "bsl",
    "ur": "بسل",
    "en": "Root: ب - س - ل",
    "ar": "بسل",
    "alt": [],
    "cat": "root"
  },
  "bzg": {
    "ro": "bzg",
    "ur": "بزغ",
    "en": "Root: ب - ز - غ",
    "ar": "بزغ",
    "alt": [],
    "cat": "root"
  },
  "qdw": {
    "ro": "qdw",
    "ur": "قدو",
    "en": "Root: ق - د - و",
    "ar": "قدو",
    "alt": [],
    "cat": "root"
  },
  "sgw": {
    "ro": "sgw",
    "ur": "صغو",
    "en": "Root: ص - غ - و",
    "ar": "صغو",
    "alt": [],
    "cat": "root"
  },
  "mlq": {
    "ro": "mlq",
    "ur": "ملق",
    "en": "Root: م - ل - ق",
    "ar": "ملق",
    "alt": [],
    "cat": "root"
  },
  "qyl": {
    "ro": "qyl",
    "ur": "قيل",
    "en": "Root: ق - ي - ل",
    "ar": "قيل",
    "alt": [],
    "cat": "root"
  },
  "veb": {
    "ro": "veb",
    "ur": "ثعب",
    "en": "Root: ث - ع - ب",
    "ar": "ثعب",
    "alt": [],
    "cat": "root"
  },
  "jrd": {
    "ro": "jrd",
    "ur": "جرد",
    "en": "Root: ج - ر - د",
    "ar": "جرد",
    "alt": [],
    "cat": "root"
  },
  "xwr": {
    "ro": "xwr",
    "ur": "خور",
    "en": "Root: خ - و - ر",
    "ar": "خور",
    "alt": [],
    "cat": "root"
  },
  "lhv": {
    "ro": "lhv",
    "ur": "لهث",
    "en": "Root: ل - ه - ث",
    "ar": "لهث",
    "alt": [],
    "cat": "root"
  },
  "nst": {
    "ro": "nst",
    "ur": "نصت",
    "en": "Root: ن - ص - ت",
    "ar": "نصت",
    "alt": [],
    "cat": "root"
  },
  "bnn": {
    "ro": "bnn",
    "ur": "بنن",
    "en": "Root: ب - ن - ن",
    "ar": "بنن",
    "alt": [],
    "cat": "root"
  },
  "sdy": {
    "ro": "sdy",
    "ur": "صدي",
    "en": "Root: ص - د - ي",
    "ar": "صدي",
    "alt": [],
    "cat": "root"
  },
  "btr": {
    "ro": "btr",
    "ur": "بطر",
    "en": "Root: ب - ط - ر",
    "ar": "بطر",
    "alt": [],
    "cat": "root"
  },
  "vxn": {
    "ro": "vxn",
    "ur": "ثخن",
    "en": "Root: ث - خ - ن",
    "ar": "ثخن",
    "alt": [],
    "cat": "root"
  },
  "all": {
    "ro": "all",
    "ur": "الل",
    "en": "Root: ا - ل - ل",
    "ar": "الل",
    "alt": [],
    "cat": "root"
  },
  "eyl": {
    "ro": "eyl",
    "ur": "عيل",
    "en": "Root: ع - ي - ل",
    "ar": "عيل",
    "alt": [],
    "cat": "root"
  },
  "nsa": {
    "ro": "nsa",
    "ur": "نسا",
    "en": "Root: ن - س - ا",
    "ar": "نسا",
    "alt": [],
    "cat": "root"
  },
  "awh": {
    "ro": "awh",
    "ur": "اوه",
    "en": "Root: ا - و - ه",
    "ar": "اوه",
    "alt": [],
    "cat": "root"
  },
  "ezb": {
    "ro": "ezb",
    "ur": "عزب",
    "en": "Root: ع - ز - ب",
    "ar": "عزب",
    "alt": [],
    "cat": "root"
  },
  "bdn": {
    "ro": "bdn",
    "ur": "بدن",
    "en": "Root: ب - د - ن",
    "ar": "بدن",
    "alt": [],
    "cat": "root"
  },
  "gyd": {
    "ro": "gyd",
    "ur": "غيض",
    "en": "Root: غ - ي - ض",
    "ar": "غيض",
    "alt": [],
    "cat": "root"
  },
  "hre": {
    "ro": "hre",
    "ur": "هرع",
    "en": "Root: ه - ر - ع",
    "ar": "هرع",
    "alt": [],
    "cat": "root"
  },
  "rfd": {
    "ro": "rfd",
    "ur": "رفد",
    "en": "Root: ر - ف - د",
    "ar": "رفد",
    "alt": [],
    "cat": "root"
  },
  "$hq": {
    "ro": "$hq",
    "ur": "شهق",
    "en": "Root: ش - ه - ق",
    "ar": "شهق",
    "alt": [],
    "cat": "root"
  },
  "j**": {
    "ro": "j**",
    "ur": "جذذ",
    "en": "Root: ج - ذ - ذ",
    "ar": "جذذ",
    "alt": [],
    "cat": "root"
  },
  "jbb": {
    "ro": "jbb",
    "ur": "جبب",
    "en": "Root: ج - ب - ب",
    "ar": "جبب",
    "alt": [],
    "cat": "root"
  },
  "lqt": {
    "ro": "lqt",
    "ur": "لقط",
    "en": "Root: ل - ق - ط",
    "ar": "لقط",
    "alt": [],
    "cat": "root"
  },
  "hw$": {
    "ro": "hw$",
    "ur": "حوش",
    "en": "Root: ح - و - ش",
    "ar": "حوش",
    "alt": [],
    "cat": "root"
  },
  "ejf": {
    "ro": "ejf",
    "ur": "عجف",
    "en": "Root: ع - ج - ف",
    "ar": "عجف",
    "alt": [],
    "cat": "root"
  },
  "ber": {
    "ro": "ber",
    "ur": "بعر",
    "en": "Resurrection / Dispatching",
    "ar": "بعر",
    "alt": [],
    "cat": "root"
  },
  "maboos karna": {
    "ro": "maboos karna",
    "ur": "بعر",
    "en": "Resurrection / Dispatching",
    "ar": "بعر",
    "alt": [],
    "cat": "root"
  },
  "uthana": {
    "ro": "uthana",
    "ur": "بعر",
    "en": "Resurrection / Dispatching",
    "ar": "بعر",
    "alt": [],
    "cat": "root"
  },
  "jze": {
    "ro": "jze",
    "ur": "جزع",
    "en": "Root: ج - ز - ع",
    "ar": "جزع",
    "alt": [],
    "cat": "root"
  },
  "$xs": {
    "ro": "$xs",
    "ur": "شخص",
    "en": "Root: ش - خ - ص",
    "ar": "شخص",
    "alt": [],
    "cat": "root"
  },
  "qne": {
    "ro": "qne",
    "ur": "قنع",
    "en": "Root: ق - ن - ع",
    "ar": "قنع",
    "alt": [],
    "cat": "root"
  },
  "sfd": {
    "ro": "sfd",
    "ur": "صفد",
    "en": "Root: ص - ف - د",
    "ar": "صفد",
    "alt": [],
    "cat": "root"
  },
  "aml": {
    "ro": "aml",
    "ur": "امل",
    "en": "Root: ا - م - ل",
    "ar": "امل",
    "alt": [],
    "cat": "root"
  },
  "wsm": {
    "ro": "wsm",
    "ur": "وسم",
    "en": "Root: و - س - م",
    "ar": "وسم",
    "alt": [],
    "cat": "root"
  },
  "trw": {
    "ro": "trw",
    "ur": "طرو",
    "en": "Root: ط - ر - و",
    "ar": "طرو",
    "alt": [],
    "cat": "root"
  },
  "mxr": {
    "ro": "mxr",
    "ur": "مخر",
    "en": "Root: م - خ - ر",
    "ar": "مخر",
    "alt": [],
    "cat": "root"
  },
  "wsb": {
    "ro": "wsb",
    "ur": "وصب",
    "en": "Root: و - ص - ب",
    "ar": "وصب",
    "alt": [],
    "cat": "root"
  },
  "lbn": {
    "ro": "lbn",
    "ur": "لبن",
    "en": "Root: ل - ب - ن",
    "ar": "لبن",
    "alt": [],
    "cat": "root"
  },
  "lmh": {
    "ro": "lmh",
    "ur": "لمح",
    "en": "Root: ل - م - ح",
    "ar": "لمح",
    "alt": [],
    "cat": "root"
  },
  "avv": {
    "ro": "avv",
    "ur": "اثث",
    "en": "Root: ا - ث - ث",
    "ar": "اثث",
    "alt": [],
    "cat": "root"
  },
  "hzr": {
    "ro": "hzr",
    "ur": "حظر",
    "en": "Root: ح - ظ - ر",
    "ar": "حظر",
    "alt": [],
    "cat": "root"
  },
  "klw": {
    "ro": "klw",
    "ur": "كلو",
    "en": "Root: ك - ل - و",
    "ar": "كلو",
    "alt": [],
    "cat": "root"
  },
  "qsts": {
    "ro": "qsts",
    "ur": "قسطس",
    "en": "Root: ق - س - ط - س",
    "ar": "قسطس",
    "alt": [],
    "cat": "root"
  },
  "rft": {
    "ro": "rft",
    "ur": "رفت",
    "en": "Root: ر - ف - ت",
    "ar": "رفت",
    "alt": [],
    "cat": "root"
  },
  "jlb": {
    "ro": "jlb",
    "ur": "جلب",
    "en": "Root: ج - ل - ب",
    "ar": "جلب",
    "alt": [],
    "cat": "root"
  },
  "$kl": {
    "ro": "$kl",
    "ur": "شكل",
    "en": "Root: ش - ك - ل",
    "ar": "شكل",
    "alt": [],
    "cat": "root"
  },
  "nbe": {
    "ro": "nbe",
    "ur": "نبع",
    "en": "Root: ن - ب - ع",
    "ar": "نبع",
    "alt": [],
    "cat": "root"
  },
  "bxe": {
    "ro": "bxe",
    "ur": "بخع",
    "en": "Root: ب - خ - ع",
    "ar": "بخع",
    "alt": [],
    "cat": "root"
  },
  "jrz": {
    "ro": "jrz",
    "ur": "جرز",
    "en": "Root: ج - ر - ز",
    "ar": "جرز",
    "alt": [],
    "cat": "root"
  },
  "rqd": {
    "ro": "rqd",
    "ur": "رقد",
    "en": "Root: ر - ق - د",
    "ar": "رقد",
    "alt": [],
    "cat": "root"
  },
  "$wy": {
    "ro": "$wy",
    "ur": "شوي",
    "en": "Root: ش - و - ي",
    "ar": "شوي",
    "alt": [],
    "cat": "root"
  },
  "hff": {
    "ro": "hff",
    "ur": "حفف",
    "en": "Root: ح - ف - ف",
    "ar": "حفف",
    "alt": [],
    "cat": "root"
  },
  "zlq": {
    "ro": "zlq",
    "ur": "زلق",
    "en": "Root: ز - ل - ق",
    "ar": "زلق",
    "alt": [],
    "cat": "root"
  },
  "h$m": {
    "ro": "h$m",
    "ur": "هشم",
    "en": "Root: ه - ش - م",
    "ar": "هشم",
    "alt": [],
    "cat": "root"
  },
  "gdr": {
    "ro": "gdr",
    "ur": "غدر",
    "en": "Root: غ - د - ر",
    "ar": "غدر",
    "alt": [],
    "cat": "root"
  },
  "wbq": {
    "ro": "wbq",
    "ur": "وبق",
    "en": "Root: و - ب - ق",
    "ar": "وبق",
    "alt": [],
    "cat": "root"
  },
  "hqb": {
    "ro": "hqb",
    "ur": "حقب",
    "en": "Root: ح - ق - ب",
    "ar": "حقب",
    "alt": [],
    "cat": "root"
  },
  "gtw": {
    "ro": "gtw",
    "ur": "غطو",
    "en": "Root: غ - ط - و",
    "ar": "غطو",
    "alt": [],
    "cat": "root"
  },
  "jny": {
    "ro": "jny",
    "ur": "جني",
    "en": "Root: ج - ن - ي",
    "ar": "جني",
    "alt": [],
    "cat": "root"
  },
  "azz": {
    "ro": "azz",
    "ur": "ازز",
    "en": "Root: ا - ز - ز",
    "ar": "ازز",
    "alt": [],
    "cat": "root"
  },
  "arb": {
    "ro": "arb",
    "ur": "ارب",
    "en": "Root: ا - ر - ب",
    "ar": "ارب",
    "alt": [],
    "cat": "root"
  },
  "dmm": {
    "ro": "dmm",
    "ur": "ضمم",
    "en": "Root: ض - م - م",
    "ar": "ضمم",
    "alt": [],
    "cat": "root"
  },
  "azr": {
    "ro": "azr",
    "ur": "ازر",
    "en": "Root: ا - ز - ر",
    "ar": "ازر",
    "alt": [],
    "cat": "root"
  },
  "qwe": {
    "ro": "qwe",
    "ur": "قوع",
    "en": "Root: ق - و - ع",
    "ar": "قوع",
    "alt": [],
    "cat": "root"
  },
  "hdm": {
    "ro": "hdm",
    "ur": "هضم",
    "en": "Root: ه - ض - م",
    "ar": "هضم",
    "alt": [],
    "cat": "root"
  },
  "xmd": {
    "ro": "xmd",
    "ur": "خمد",
    "en": "Root: خ - م - د",
    "ar": "خمد",
    "alt": [],
    "cat": "root"
  },
  "xrdl": {
    "ro": "xrdl",
    "ur": "خردل",
    "en": "Root: خ - ر - د - ل",
    "ar": "خردل",
    "alt": [],
    "cat": "root"
  },
  "nf$": {
    "ro": "nf$",
    "ur": "نفش",
    "en": "Root: ن - ف - ش",
    "ar": "نفش",
    "alt": [],
    "cat": "root"
  },
  "gws": {
    "ro": "gws",
    "ur": "غوص",
    "en": "Root: غ - و - ص",
    "ar": "غوص",
    "alt": [],
    "cat": "root"
  },
  "etq": {
    "ro": "etq",
    "ur": "عتق",
    "en": "Root: ع - ت - ق",
    "ar": "عتق",
    "alt": [],
    "cat": "root"
  },
  "shq": {
    "ro": "shq",
    "ur": "سحق",
    "en": "Root: س - ح - ق",
    "ar": "سحق",
    "alt": [],
    "cat": "root"
  },
  "err": {
    "ro": "err",
    "ur": "عرر",
    "en": "Root: ع - ر - ر",
    "ar": "عرر",
    "alt": [],
    "cat": "root"
  },
  "etl": {
    "ro": "etl",
    "ur": "عطل",
    "en": "Root: ع - ط - ل",
    "ar": "عطل",
    "alt": [],
    "cat": "root"
  },
  "*bb": {
    "ro": "*bb",
    "ur": "ذبب",
    "en": "Root: ذ - ب - ب",
    "ar": "ذبب",
    "alt": [],
    "cat": "root"
  },
  "gvw": {
    "ro": "gvw",
    "ur": "غثو",
    "en": "Root: غ - ث - و",
    "ar": "غثو",
    "alt": [],
    "cat": "root"
  },
  "nkb": {
    "ro": "nkb",
    "ur": "نكب",
    "en": "Root: ن - ك - ب",
    "ar": "نكب",
    "alt": [],
    "cat": "root"
  },
  "ebv": {
    "ro": "ebv",
    "ur": "عبث",
    "en": "Root: ع - ب - ث",
    "ar": "عبث",
    "alt": [],
    "cat": "root"
  },
  "zjj": {
    "ro": "zjj",
    "ur": "زجج",
    "en": "Root: ز - ج - ج",
    "ar": "زجج",
    "alt": [],
    "cat": "root"
  },
  "wdq": {
    "ro": "wdq",
    "ur": "ودق",
    "en": "Root: و - د - ق",
    "ar": "ودق",
    "alt": [],
    "cat": "root"
  },
  "hbw": {
    "ro": "hbw",
    "ur": "هبو",
    "en": "Root: ه - ب - و",
    "ar": "هبو",
    "alt": [],
    "cat": "root"
  },
  "rss": {
    "ro": "rss",
    "ur": "رسس",
    "en": "Root: ر - س - س",
    "ar": "رسس",
    "alt": [],
    "cat": "root"
  },
  "mlh": {
    "ro": "mlh",
    "ur": "ملح",
    "en": "Root: م - ل - ح",
    "ar": "ملح",
    "alt": [],
    "cat": "root"
  },
  "qly": {
    "ro": "qly",
    "ur": "قلي",
    "en": "Root: ق - ل - ي",
    "ar": "قلي",
    "alt": [],
    "cat": "root"
  },
  "hym": {
    "ro": "hym",
    "ur": "هيم",
    "en": "Root: ه - ي - م",
    "ar": "هيم",
    "alt": [],
    "cat": "root"
  },
  "hjz": {
    "ro": "hjz",
    "ur": "حجز",
    "en": "Root: ح - ج - ز",
    "ar": "حجز",
    "alt": [],
    "cat": "root"
  },
  "kbb": {
    "ro": "kbb",
    "ur": "كبب",
    "en": "Root: ك - ب - ب",
    "ar": "كبب",
    "alt": [],
    "cat": "root"
  },
  "$ta": {
    "ro": "$ta",
    "ur": "شطا",
    "en": "Root: ش - ط - ا",
    "ar": "شطا",
    "alt": [],
    "cat": "root"
  },
  "srmd": {
    "ro": "srmd",
    "ur": "سرمد",
    "en": "Root: س - ر - م - د",
    "ar": "سرمد",
    "alt": [],
    "cat": "root"
  },
  "enkb": {
    "ro": "enkb",
    "ur": "عنكب",
    "en": "Root: ع - ن - ك - ب",
    "ar": "عنكب",
    "alt": [],
    "cat": "root"
  },
  "xdd": {
    "ro": "xdd",
    "ur": "خدد",
    "en": "Root: خ - د - د",
    "ar": "خدد",
    "alt": [],
    "cat": "root"
  },
  "hnjr": {
    "ro": "hnjr",
    "ur": "حنجر",
    "en": "Root: ح - ن - ج - ر",
    "ar": "حنجر",
    "alt": [],
    "cat": "root"
  },
  "lgb": {
    "ro": "lgb",
    "ur": "لغب",
    "en": "Root: ل - غ - ب",
    "ar": "لغب",
    "alt": [],
    "cat": "root"
  },
  "$gl": {
    "ro": "$gl",
    "ur": "شغل",
    "en": "Root: ش - غ - ل",
    "ar": "شغل",
    "alt": [],
    "cat": "root"
  },
  "rmm": {
    "ro": "rmm",
    "ur": "رمم",
    "en": "Root: ر - م - م",
    "ar": "رمم",
    "alt": [],
    "cat": "root"
  },
  "vqb": {
    "ro": "vqb",
    "ur": "ثقب",
    "en": "Root: ث - ق - ب",
    "ar": "ثقب",
    "alt": [],
    "cat": "root"
  },
  "nzf": {
    "ro": "nzf",
    "ur": "نزف",
    "en": "Root: ن - ز - ف",
    "ar": "نزف",
    "alt": [],
    "cat": "root"
  },
  "sqm": {
    "ro": "sqm",
    "ur": "سقم",
    "en": "Root: س - ق - م",
    "ar": "سقم",
    "alt": [],
    "cat": "root"
  },
  "hnv": {
    "ro": "hnv",
    "ur": "حنث",
    "en": "Root: ح - ن - ث",
    "ar": "حنث",
    "alt": [],
    "cat": "root"
  },
  "qhm": {
    "ro": "qhm",
    "ur": "قحم",
    "en": "Root: ق - ح - م",
    "ar": "قحم",
    "alt": [],
    "cat": "root"
  },
  "hyj": {
    "ro": "hyj",
    "ur": "هيج",
    "en": "Root: ه - ي - ج",
    "ar": "هيج",
    "alt": [],
    "cat": "root"
  },
  "zmr": {
    "ro": "zmr",
    "ur": "زمر",
    "en": "Root: ز - م - ر",
    "ar": "زمر",
    "alt": [],
    "cat": "root"
  },
  "dxn": {
    "ro": "dxn",
    "ur": "دخن",
    "en": "Root: د - خ - ن",
    "ar": "دخن",
    "alt": [],
    "cat": "root"
  },
  "qyd": {
    "ro": "qyd",
    "ur": "قيض",
    "en": "Root: ق - ي - ض",
    "ar": "قيض",
    "alt": [],
    "cat": "root"
  },
  "kmm": {
    "ro": "kmm",
    "ur": "كمم",
    "en": "Root: ك - م - م",
    "ar": "كمم",
    "alt": [],
    "cat": "root"
  },
  "brm": {
    "ro": "brm",
    "ur": "برم",
    "en": "Root: ب - ر - م",
    "ar": "برم",
    "alt": [],
    "cat": "root"
  },
  "gly": {
    "ro": "gly",
    "ur": "غلي",
    "en": "Root: غ - ل - ي",
    "ar": "غلي",
    "alt": [],
    "cat": "root"
  },
  "eyy": {
    "ro": "eyy",
    "ur": "عيي",
    "en": "Root: ع - ي - ي",
    "ar": "عيي",
    "alt": [],
    "cat": "root"
  },
  "dgn": {
    "ro": "dgn",
    "ur": "ضغن",
    "en": "Root: ض - غ - ن",
    "ar": "ضغن",
    "alt": [],
    "cat": "root"
  },
  "$eb": {
    "ro": "$eb",
    "ur": "شعب",
    "en": "Root: ش - ع - ب",
    "ar": "شعب",
    "alt": [],
    "cat": "root"
  },
  "shw": {
    "ro": "shw",
    "ur": "سهو",
    "en": "Root: س - ه - و",
    "ar": "سهو",
    "alt": [],
    "cat": "root"
  },
  "khn": {
    "ro": "khn",
    "ur": "كهن",
    "en": "Root: ك - ه - ن",
    "ar": "كهن",
    "alt": [],
    "cat": "root"
  },
  "a$r": {
    "ro": "a$r",
    "ur": "اشر",
    "en": "Root: ا - ش - ر",
    "ar": "اشر",
    "alt": [],
    "cat": "root"
  },
  "jll": {
    "ro": "jll",
    "ur": "جلل",
    "en": "Root: ج - ل - ل",
    "ar": "جلل",
    "alt": [],
    "cat": "root"
  },
  "tmv": {
    "ro": "tmv",
    "ur": "طمث",
    "en": "Root: ط - م - ث",
    "ar": "طمث",
    "alt": [],
    "cat": "root"
  },
  "rjj": {
    "ro": "rjj",
    "ur": "رجج",
    "en": "Root: ر - ج - ج",
    "ar": "رجج",
    "alt": [],
    "cat": "root"
  },
  "bss": {
    "ro": "bss",
    "ur": "بسس",
    "en": "Root: ب - س - س",
    "ar": "بسس",
    "alt": [],
    "cat": "root"
  },
  "wjf": {
    "ro": "wjf",
    "ur": "وجف",
    "en": "Root: و - ج - ف",
    "ar": "وجف",
    "alt": [],
    "cat": "root"
  },
  "qtf": {
    "ro": "qtf",
    "ur": "قطف",
    "en": "Root: ق - ط - ف",
    "ar": "قطف",
    "alt": [],
    "cat": "root"
  },
  "ehn": {
    "ro": "ehn",
    "ur": "عهن",
    "en": "Root: ع - ه - ن",
    "ar": "عهن",
    "alt": [],
    "cat": "root"
  },
  "htb": {
    "ro": "htb",
    "ur": "حطب",
    "en": "Root: ح - ط - ب",
    "ar": "حطب",
    "alt": [],
    "cat": "root"
  },
  "lbd": {
    "ro": "lbd",
    "ur": "لبد",
    "en": "Root: ل - ب - د",
    "ar": "لبد",
    "alt": [],
    "cat": "root"
  },
  "n$t": {
    "ro": "n$t",
    "ur": "نشط",
    "en": "Root: ن - ش - ط",
    "ar": "نشط",
    "alt": [],
    "cat": "root"
  },
  "xns": {
    "ro": "xns",
    "ur": "خنس",
    "en": "Root: خ - ن - س",
    "ar": "خنس",
    "alt": [],
    "cat": "root"
  },
  "bevr": {
    "ro": "bevr",
    "ur": "بعثر",
    "en": "Root: ب - ع - ث - ر",
    "ar": "بعثر",
    "alt": [],
    "cat": "root"
  },
  "kdh": {
    "ro": "kdh",
    "ur": "كدح",
    "en": "Root: ك - د - ح",
    "ar": "كدح",
    "alt": [],
    "cat": "root"
  },
  "wsq": {
    "ro": "wsq",
    "ur": "وسق",
    "en": "Root: و - س - ق",
    "ar": "وسق",
    "alt": [],
    "cat": "root"
  },
  "fkk": {
    "ro": "fkk",
    "ur": "فكك",
    "en": "Root: ف - ك - ك",
    "ar": "فكك",
    "alt": [],
    "cat": "root"
  },
  "rbh": {
    "ro": "rbh",
    "ur": "ربح",
    "en": "Root: ر - ب - ح",
    "ar": "ربح",
    "alt": [],
    "cat": "root"
  },
  "bql": {
    "ro": "bql",
    "ur": "بقل",
    "en": "Root: ب - ق - ل",
    "ar": "بقل",
    "alt": [],
    "cat": "root"
  },
  "qva": {
    "ro": "qva",
    "ur": "قثا",
    "en": "Root: ق - ث - ا",
    "ar": "قثا",
    "alt": [],
    "cat": "root"
  },
  "fwm": {
    "ro": "fwm",
    "ur": "فوم",
    "en": "Root: ف - و - م",
    "ar": "فوم",
    "alt": [],
    "cat": "root"
  },
  "eds": {
    "ro": "eds",
    "ur": "عدس",
    "en": "Root: ع - د - س",
    "ar": "عدس",
    "alt": [],
    "cat": "root"
  },
  "fqe": {
    "ro": "fqe",
    "ur": "فقع",
    "en": "Root: ف - ق - ع",
    "ar": "فقع",
    "alt": [],
    "cat": "root"
  },
  "w$y": {
    "ro": "w$y",
    "ur": "وشي",
    "en": "Root: و - ش - ي",
    "ar": "وشي",
    "alt": [],
    "cat": "root"
  },
  "neq": {
    "ro": "neq",
    "ur": "نعق",
    "en": "Root: ن - ع - ق",
    "ar": "نعق",
    "alt": [],
    "cat": "root"
  },
  "wsn": {
    "ro": "wsn",
    "ur": "وسن",
    "en": "Root: و - س - ن",
    "ar": "وسن",
    "alt": [],
    "cat": "root"
  },
  "awd": {
    "ro": "awd",
    "ur": "اود",
    "en": "Root: ا - و - د",
    "ar": "اود",
    "alt": [],
    "cat": "root"
  },
  "fsm": {
    "ro": "fsm",
    "ur": "فصم",
    "en": "Root: ف - ص - م",
    "ar": "فصم",
    "alt": [],
    "cat": "root"
  },
  "snh": {
    "ro": "snh",
    "ur": "سنه",
    "en": "Root: س - ن - ه",
    "ar": "سنه",
    "alt": [],
    "cat": "root"
  },
  "sld": {
    "ro": "sld",
    "ur": "صلد",
    "en": "Root: ص - ل - د",
    "ar": "صلد",
    "alt": [],
    "cat": "root"
  },
  "tll": {
    "ro": "tll",
    "ur": "طلل",
    "en": "Root: ط - ل - ل",
    "ar": "طلل",
    "alt": [],
    "cat": "root"
  },
  "gmd": {
    "ro": "gmd",
    "ur": "غمض",
    "en": "Root: غ - م - ض",
    "ar": "غمض",
    "alt": [],
    "cat": "root"
  },
  "lhf": {
    "ro": "lhf",
    "ur": "لحف",
    "en": "Root: ل - ح - ف",
    "ar": "لحف",
    "alt": [],
    "cat": "root"
  },
  "rmz": {
    "ro": "rmz",
    "ur": "رمز",
    "en": "Root: ر - م - ز",
    "ar": "رمز",
    "alt": [],
    "cat": "root"
  },
  "*xr": {
    "ro": "*xr",
    "ur": "ذخر",
    "en": "Root: ذ - خ - ر",
    "ar": "ذخر",
    "alt": [],
    "cat": "root"
  },
  "bhl": {
    "ro": "bhl",
    "ur": "بهل",
    "en": "Root: ب - ه - ل",
    "ar": "بهل",
    "alt": [],
    "cat": "root"
  },
  "dnr": {
    "ro": "dnr",
    "ur": "دنر",
    "en": "Root: د - ن - ر",
    "ar": "دنر",
    "alt": [],
    "cat": "root"
  },
  "gzw": {
    "ro": "gzw",
    "ur": "غزو",
    "en": "Root: غ - ز - و",
    "ar": "غزو",
    "alt": [],
    "cat": "root"
  },
  "hwb": {
    "ro": "hwb",
    "ur": "حوب",
    "en": "Root: ح - و - ب",
    "ar": "حوب",
    "alt": [],
    "cat": "root"
  },
  "ewl": {
    "ro": "ewl",
    "ur": "عول",
    "en": "Root: ع - و - ل",
    "ar": "عول",
    "alt": [],
    "cat": "root"
  },
  "bdr": {
    "ro": "bdr",
    "ur": "بدر",
    "en": "Root: ب - د - ر",
    "ar": "بدر",
    "alt": [],
    "cat": "root"
  },
  "fdw": {
    "ro": "fdw",
    "ur": "فضو",
    "en": "Root: ف - ض - و",
    "ar": "فضو",
    "alt": [],
    "cat": "root"
  },
  "jbt": {
    "ro": "jbt",
    "ur": "جبت",
    "en": "Root: ج - ب - ت",
    "ar": "جبت",
    "alt": [],
    "cat": "root"
  },
  "ndj": {
    "ro": "ndj",
    "ur": "نضج",
    "en": "Root: ن - ض - ج",
    "ar": "نضج",
    "alt": [],
    "cat": "root"
  },
  "vby": {
    "ro": "vby",
    "ur": "ثبي",
    "en": "Root: ث - ب - ي",
    "ar": "ثبي",
    "alt": [],
    "cat": "root"
  },
  "bta": {
    "ro": "bta",
    "ur": "بطا",
    "en": "Root: ب - ط - ا",
    "ar": "بطا",
    "alt": [],
    "cat": "root"
  },
  "*ye": {
    "ro": "*ye",
    "ur": "ذيع",
    "en": "Root: ذ - ي - ع",
    "ar": "ذيع",
    "alt": [],
    "cat": "root"
  },
  "rgm": {
    "ro": "rgm",
    "ur": "رغم",
    "en": "Root: ر - غ - م",
    "ar": "رغم",
    "alt": [],
    "cat": "root"
  },
  "btk": {
    "ro": "btk",
    "ur": "بتك",
    "en": "Root: ب - ت - ك",
    "ar": "بتك",
    "alt": [],
    "cat": "root"
  },
  "*b*b": {
    "ro": "*b*b",
    "ur": "ذبذب",
    "en": "Root: ذ - ب - ذ - ب",
    "ar": "ذبذب",
    "alt": [],
    "cat": "root"
  },
  "xnq": {
    "ro": "xnq",
    "ur": "خنق",
    "en": "Root: خ - ن - ق",
    "ar": "خنق",
    "alt": [],
    "cat": "root"
  },
  "wq*": {
    "ro": "wq*",
    "ur": "وقذ",
    "en": "Root: و - ق - ذ",
    "ar": "وقذ",
    "alt": [],
    "cat": "root"
  },
  "nth": {
    "ro": "nth",
    "ur": "نطح",
    "en": "Root: ن - ط - ح",
    "ar": "نطح",
    "alt": [],
    "cat": "root"
  },
  "*kw": {
    "ro": "*kw",
    "ur": "ذكو",
    "en": "Root: ذ - ك - و",
    "ar": "ذكو",
    "alt": [],
    "cat": "root"
  },
  "tyh": {
    "ro": "tyh",
    "ur": "تيه",
    "en": "Root: ت - ي - ه",
    "ar": "تيه",
    "alt": [],
    "cat": "root"
  },
  "bhv": {
    "ro": "bhv",
    "ur": "بحث",
    "en": "Root: ب - ح - ث",
    "ar": "بحث",
    "alt": [],
    "cat": "root"
  },
  "nfy": {
    "ro": "nfy",
    "ur": "نفي",
    "en": "Root: ن - ف - ي",
    "ar": "نفي",
    "alt": [],
    "cat": "root"
  },
  "nhj": {
    "ro": "nhj",
    "ur": "نهج",
    "en": "Root: ن - ه - ج",
    "ar": "نهج",
    "alt": [],
    "cat": "root"
  },
  "rmh": {
    "ro": "rmh",
    "ur": "رمح",
    "en": "Root: ر - م - ح",
    "ar": "رمح",
    "alt": [],
    "cat": "root"
  },
  "syb": {
    "ro": "syb",
    "ur": "سيب",
    "en": "Root: س - ي - ب",
    "ar": "سيب",
    "alt": [],
    "cat": "root"
  },
  "hyr": {
    "ro": "hyr",
    "ur": "حير",
    "en": "Root: ح - ي - ر",
    "ar": "حير",
    "alt": [],
    "cat": "root"
  },
  "nwy": {
    "ro": "nwy",
    "ur": "نوي",
    "en": "Root: ن - و - ي",
    "ar": "نوي",
    "alt": [],
    "cat": "root"
  },
  "qnw": {
    "ro": "qnw",
    "ur": "قنو",
    "en": "Root: ق - ن - و",
    "ar": "قنو",
    "alt": [],
    "cat": "root"
  },
  "yne": {
    "ro": "yne",
    "ur": "ينع",
    "en": "Root: ي - ن - ع",
    "ar": "ينع",
    "alt": [],
    "cat": "root"
  },
  "dan": {
    "ro": "dan",
    "ur": "ضان",
    "en": "Root: ض - ا - ن",
    "ar": "ضان",
    "alt": [],
    "cat": "root"
  },
  "mez": {
    "ro": "mez",
    "ur": "معز",
    "en": "Root: م - ع - ز",
    "ar": "معز",
    "alt": [],
    "cat": "root"
  },
  "$hm": {
    "ro": "$hm",
    "ur": "شحم",
    "en": "Root: ش - ح - م",
    "ar": "شحم",
    "alt": [],
    "cat": "root"
  },
  "*am": {
    "ro": "*am",
    "ur": "ذام",
    "en": "Root: ذ - ا - م",
    "ar": "ذام",
    "alt": [],
    "cat": "root"
  },
  "ry$": {
    "ro": "ry$",
    "ur": "ريش",
    "en": "Root: ر - ي - ش",
    "ar": "ريش",
    "alt": [],
    "cat": "root"
  },
  "hvv": {
    "ro": "hvv",
    "ur": "حثث",
    "en": "Root: ح - ث - ث",
    "ar": "حثث",
    "alt": [],
    "cat": "root"
  },
  "nkd": {
    "ro": "nkd",
    "ur": "نكد",
    "en": "Root: ن - ك - د",
    "ar": "نكد",
    "alt": [],
    "cat": "root"
  },
  "shl": {
    "ro": "shl",
    "ur": "سهل",
    "en": "Root: س - ه - ل",
    "ar": "سهل",
    "alt": [],
    "cat": "root"
  },
  "qml": {
    "ro": "qml",
    "ur": "قمل",
    "en": "Root: ق - م - ل",
    "ar": "قمل",
    "alt": [],
    "cat": "root"
  },
  "dfde": {
    "ro": "dfde",
    "ur": "ضفدع",
    "en": "Root: ض - ف - د - ع",
    "ar": "ضفدع",
    "alt": [],
    "cat": "root"
  },
  "jrr": {
    "ro": "jrr",
    "ur": "جرر",
    "en": "Root: ج - ر - ر",
    "ar": "جرر",
    "alt": [],
    "cat": "root"
  },
  "$mt": {
    "ro": "$mt",
    "ur": "شمت",
    "en": "Root: ش - م - ت",
    "ar": "شمت",
    "alt": [],
    "cat": "root"
  },
  "skt": {
    "ro": "skt",
    "ur": "سكت",
    "en": "Root: س - ك - ت",
    "ar": "سكت",
    "alt": [],
    "cat": "root"
  },
  "bjs": {
    "ro": "bjs",
    "ur": "بجس",
    "en": "Root: ب - ج - س",
    "ar": "بجس",
    "alt": [],
    "cat": "root"
  },
  "smt": {
    "ro": "smt",
    "ur": "صمت",
    "en": "Root: ص - م - ت",
    "ar": "صمت",
    "alt": [],
    "cat": "root"
  },
  "$wk": {
    "ro": "$wk",
    "ur": "شوك",
    "en": "Root: ش - و - ك",
    "ar": "شوك",
    "alt": [],
    "cat": "root"
  },
  "zhf": {
    "ro": "zhf",
    "ur": "زحف",
    "en": "Root: ز - ح - ف",
    "ar": "زحف",
    "alt": [],
    "cat": "root"
  },
  "hwz": {
    "ro": "hwz",
    "ur": "حوز",
    "en": "Root: ح - و - ز",
    "ar": "حوز",
    "alt": [],
    "cat": "root"
  },
  "mkw": {
    "ro": "mkw",
    "ur": "مكو",
    "en": "Root: م - ك - و",
    "ar": "مكو",
    "alt": [],
    "cat": "root"
  },
  "$rd": {
    "ro": "$rd",
    "ur": "شرد",
    "en": "Root: ش - ر - د",
    "ar": "شرد",
    "alt": [],
    "cat": "root"
  },
  "ksd": {
    "ro": "ksd",
    "ur": "كسد",
    "en": "Root: ك - س - د",
    "ar": "كسد",
    "alt": [],
    "cat": "root"
  },
  "wtn": {
    "ro": "wtn",
    "ur": "وطن",
    "en": "Root: و - ط - ن",
    "ar": "وطن",
    "alt": [],
    "cat": "root"
  },
  "njs": {
    "ro": "njs",
    "ur": "نجس",
    "en": "Root: ن - ج - س",
    "ar": "نجس",
    "alt": [],
    "cat": "root"
  },
  "dha": {
    "ro": "dha",
    "ur": "ضها",
    "en": "Root: ض - ه - ا",
    "ar": "ضها",
    "alt": [],
    "cat": "root"
  },
  "kwy": {
    "ro": "kwy",
    "ur": "كوي",
    "en": "Root: ك - و - ي",
    "ar": "كوي",
    "alt": [],
    "cat": "root"
  },
  "jbh": {
    "ro": "jbh",
    "ur": "جبه",
    "en": "Root: ج - ب - ه",
    "ar": "جبه",
    "alt": [],
    "cat": "root"
  },
  "jmh": {
    "ro": "jmh",
    "ur": "جمح",
    "en": "Root: ج - م - ح",
    "ar": "جمح",
    "alt": [],
    "cat": "root"
  },
  "jrf": {
    "ro": "jrf",
    "ur": "جرف",
    "en": "Root: ج - ر - ف",
    "ar": "جرف",
    "alt": [],
    "cat": "root"
  },
  "zry": {
    "ro": "zry",
    "ur": "زري",
    "en": "Root: ز - ر - ي",
    "ar": "زري",
    "alt": [],
    "cat": "root"
  },
  "ble": {
    "ro": "ble",
    "ur": "بلع",
    "en": "Root: ب - ل - ع",
    "ar": "بلع",
    "alt": [],
    "cat": "root"
  },
  "qle": {
    "ro": "qle",
    "ur": "قلع",
    "en": "Root: ق - ل - ع",
    "ar": "قلع",
    "alt": [],
    "cat": "root"
  },
  "hn*": {
    "ro": "hn*",
    "ur": "حنذ",
    "en": "Root: ح - ن - ذ",
    "ar": "حنذ",
    "alt": [],
    "cat": "root"
  },
  "rwe": {
    "ro": "rwe",
    "ur": "روع",
    "en": "Root: ر - و - ع",
    "ar": "روع",
    "alt": [],
    "cat": "root"
  },
  "trh": {
    "ro": "trh",
    "ur": "طرح",
    "en": "Root: ط - ر - ح",
    "ar": "طرح",
    "alt": [],
    "cat": "root"
  },
  "rte": {
    "ro": "rte",
    "ur": "رتع",
    "en": "Root: ر - ت - ع",
    "ar": "رتع",
    "alt": [],
    "cat": "root"
  },
  "drhm": {
    "ro": "drhm",
    "ur": "درهم",
    "en": "Root: د - ر - ه - م",
    "ar": "درهم",
    "alt": [],
    "cat": "root"
  },
  "zhd": {
    "ro": "zhd",
    "ur": "زهد",
    "en": "Root: ز - ه - د",
    "ar": "زهد",
    "alt": [],
    "cat": "root"
  },
  "glq": {
    "ro": "glq",
    "ur": "غلق",
    "en": "Root: غ - ل - ق",
    "ar": "غلق",
    "alt": [],
    "cat": "root"
  },
  "hyt": {
    "ro": "hyt",
    "ur": "هيت",
    "en": "Root: ه - ي - ت",
    "ar": "هيت",
    "alt": [],
    "cat": "root"
  },
  "$gf": {
    "ro": "$gf",
    "ur": "شغف",
    "en": "Root: ش - غ - ف",
    "ar": "شغف",
    "alt": [],
    "cat": "root"
  },
  "xbz": {
    "ro": "xbz",
    "ur": "خبز",
    "en": "Root: خ - ب - ز",
    "ar": "خبز",
    "alt": [],
    "cat": "root"
  },
  "hshs": {
    "ro": "hshs",
    "ur": "حصحص",
    "en": "Root: ح - ص - ح - ص",
    "ar": "حصحص",
    "alt": [],
    "cat": "root"
  },
  "myr": {
    "ro": "myr",
    "ur": "مير",
    "en": "Root: م - ي - ر",
    "ar": "مير",
    "alt": [],
    "cat": "root"
  },
  "fta": {
    "ro": "fta",
    "ur": "فتا",
    "en": "Root: ف - ت - ا",
    "ar": "فتا",
    "alt": [],
    "cat": "root"
  },
  "vrb": {
    "ro": "vrb",
    "ur": "ثرب",
    "en": "Root: ث - ر - ب",
    "ar": "ثرب",
    "alt": [],
    "cat": "root"
  },
  "fnd": {
    "ro": "fnd",
    "ur": "فند",
    "en": "Root: ف - ن - د",
    "ar": "فند",
    "alt": [],
    "cat": "root"
  },
  "jfa": {
    "ro": "jfa",
    "ur": "جفا",
    "en": "Root: ج - ف - ا",
    "ar": "جفا",
    "alt": [],
    "cat": "root"
  },
  "jre": {
    "ro": "jre",
    "ur": "جرع",
    "en": "Root: ج - ر - ع",
    "ar": "جرع",
    "alt": [],
    "cat": "root"
  },
  "rmd": {
    "ro": "rmd",
    "ur": "رمد",
    "en": "Root: ر - م - د",
    "ar": "رمد",
    "alt": [],
    "cat": "root"
  },
  "fre": {
    "ro": "fre",
    "ur": "فرع",
    "en": "Root: ف - ر - ع",
    "ar": "فرع",
    "alt": [],
    "cat": "root"
  },
  "jvv": {
    "ro": "jvv",
    "ur": "جثث",
    "en": "Root: ج - ث - ث",
    "ar": "جثث",
    "alt": [],
    "cat": "root"
  },
  "lqh": {
    "ro": "lqh",
    "ur": "لقح",
    "en": "Root: ل - ق - ح",
    "ar": "لقح",
    "alt": [],
    "cat": "root"
  },
  "fdh": {
    "ro": "fdh",
    "ur": "فضح",
    "en": "Root: ف - ض - ح",
    "ar": "فضح",
    "alt": [],
    "cat": "root"
  },
  "dfa": {
    "ro": "dfa",
    "ur": "دفا",
    "en": "Root: د - ف - ا",
    "ar": "دفا",
    "alt": [],
    "cat": "root"
  },
  "bgl": {
    "ro": "bgl",
    "ur": "بغل",
    "en": "Root: ب - غ - ل",
    "ar": "بغل",
    "alt": [],
    "cat": "root"
  },
  "dss": {
    "ro": "dss",
    "ur": "دسس",
    "en": "Root: د - س - س",
    "ar": "دسس",
    "alt": [],
    "cat": "root"
  },
  "frv": {
    "ro": "frv",
    "ur": "فرث",
    "en": "Root: ف - ر - ث",
    "ar": "فرث",
    "alt": [],
    "cat": "root"
  },
  "hfd": {
    "ro": "hfd",
    "ur": "حفد",
    "en": "Root: ح - ف - د",
    "ar": "حفد",
    "alt": [],
    "cat": "root"
  },
  "jww": {
    "ro": "jww",
    "ur": "جوو",
    "en": "Root: ج - و - و",
    "ar": "جوو",
    "alt": [],
    "cat": "root"
  },
  "zen": {
    "ro": "zen",
    "ur": "ظعن",
    "en": "Root: ظ - ع - ن",
    "ar": "ظعن",
    "alt": [],
    "cat": "root"
  },
  "swf": {
    "ro": "swf",
    "ur": "صوف",
    "en": "Root: ص - و - ف",
    "ar": "صوف",
    "alt": [],
    "cat": "root"
  },
  "wbr": {
    "ro": "wbr",
    "ur": "وبر",
    "en": "Root: و - ب - ر",
    "ar": "وبر",
    "alt": [],
    "cat": "root"
  },
  "wkd": {
    "ro": "wkd",
    "ur": "وكد",
    "en": "Root: و - ك - د",
    "ar": "وكد",
    "alt": [],
    "cat": "root"
  },
  "gzl": {
    "ro": "gzl",
    "ur": "غزل",
    "en": "Root: غ - ز - ل",
    "ar": "غزل",
    "alt": [],
    "cat": "root"
  },
  "jws": {
    "ro": "jws",
    "ur": "جوس",
    "en": "Root: ج - و - س",
    "ar": "جوس",
    "alt": [],
    "cat": "root"
  },
  "ngd": {
    "ro": "ngd",
    "ur": "نغض",
    "en": "Root: ن - غ - ض",
    "ar": "نغض",
    "alt": [],
    "cat": "root"
  },
  "hnk": {
    "ro": "hnk",
    "ur": "حنك",
    "en": "Root: ح - ن - ك",
    "ar": "حنك",
    "alt": [],
    "cat": "root"
  },
  "wfr": {
    "ro": "wfr",
    "ur": "وفر",
    "en": "Root: و - ف - ر",
    "ar": "وفر",
    "alt": [],
    "cat": "root"
  },
  "qsf": {
    "ro": "qsf",
    "ur": "قصف",
    "en": "Root: ق - ص - ف",
    "ar": "قصف",
    "alt": [],
    "cat": "root"
  },
  "dlk": {
    "ro": "dlk",
    "ur": "دلك",
    "en": "Root: د - ل - ك",
    "ar": "دلك",
    "alt": [],
    "cat": "root"
  },
  "hjd": {
    "ro": "hjd",
    "ur": "هجد",
    "en": "Root: ه - ج - د",
    "ar": "هجد",
    "alt": [],
    "cat": "root"
  },
  "xbw": {
    "ro": "xbw",
    "ur": "خبو",
    "en": "Root: خ - ب - و",
    "ar": "خبو",
    "alt": [],
    "cat": "root"
  },
  "fjw": {
    "ro": "fjw",
    "ur": "فجو",
    "en": "Root: ف - ج - و",
    "ar": "فجو",
    "alt": [],
    "cat": "root"
  },
  "yqz": {
    "ro": "yqz",
    "ur": "يقظ",
    "en": "Root: ي - ق - ظ",
    "ar": "يقظ",
    "alt": [],
    "cat": "root"
  },
  "srdq": {
    "ro": "srdq",
    "ur": "سردق",
    "en": "Root: س - ر - د - ق",
    "ar": "سردق",
    "alt": [],
    "cat": "root"
  },
  "wal": {
    "ro": "wal",
    "ur": "وال",
    "en": "Root: و - ا - ل",
    "ar": "وال",
    "alt": [],
    "cat": "root"
  },
  "eyb": {
    "ro": "eyb",
    "ur": "عيب",
    "en": "Root: ع - ي - ب",
    "ar": "عيب",
    "alt": [],
    "cat": "root"
  },
  "gsb": {
    "ro": "gsb",
    "ur": "غصب",
    "en": "Root: غ - ص - ب",
    "ar": "غصب",
    "alt": [],
    "cat": "root"
  },
  "rdm": {
    "ro": "rdm",
    "ur": "ردم",
    "en": "Root: ر - د - م",
    "ar": "ردم",
    "alt": [],
    "cat": "root"
  },
  "$el": {
    "ro": "$el",
    "ur": "شعل",
    "en": "Root: ش - ع - ل",
    "ar": "شعل",
    "alt": [],
    "cat": "root"
  },
  "hnn": {
    "ro": "hnn",
    "ur": "حنن",
    "en": "Root: ح - ن - ن",
    "ar": "حنن",
    "alt": [],
    "cat": "root"
  },
  "mxd": {
    "ro": "mxd",
    "ur": "مخض",
    "en": "Root: م - خ - ض",
    "ar": "مخض",
    "alt": [],
    "cat": "root"
  },
  "ddd": {
    "ro": "ddd",
    "ur": "ضدد",
    "en": "Root: ض - د - د",
    "ar": "ضدد",
    "alt": [],
    "cat": "root"
  },
  "wfd": {
    "ro": "wfd",
    "ur": "وفد",
    "en": "Root: و - ف - د",
    "ar": "وفد",
    "alt": [],
    "cat": "root"
  },
  "add": {
    "ro": "add",
    "ur": "ادد",
    "en": "Root: ا - د - د",
    "ar": "ادد",
    "alt": [],
    "cat": "root"
  },
  "rkz": {
    "ro": "rkz",
    "ur": "ركز",
    "en": "Root: ر - ك - ز",
    "ar": "ركز",
    "alt": [],
    "cat": "root"
  },
  "vry": {
    "ro": "vry",
    "ur": "ثري",
    "en": "Root: ث - ر - ي",
    "ar": "ثري",
    "alt": [],
    "cat": "root"
  },
  "xle": {
    "ro": "xle",
    "ur": "خلع",
    "en": "Root: خ - ل - ع",
    "ar": "خلع",
    "alt": [],
    "cat": "root"
  },
  "nel": {
    "ro": "nel",
    "ur": "نعل",
    "en": "Root: ن - ع - ل",
    "ar": "نعل",
    "alt": [],
    "cat": "root"
  },
  "h$$": {
    "ro": "h$$",
    "ur": "هشش",
    "en": "Root: ه - ش - ش",
    "ar": "هشش",
    "alt": [],
    "cat": "root"
  },
  "wny": {
    "ro": "wny",
    "ur": "وني",
    "en": "Root: و - ن - ي",
    "ar": "وني",
    "alt": [],
    "cat": "root"
  },
  "lhy": {
    "ro": "lhy",
    "ur": "لحي",
    "en": "Root: ل - ح - ي",
    "ar": "لحي",
    "alt": [],
    "cat": "root"
  },
  "zrq": {
    "ro": "zrq",
    "ur": "زرق",
    "en": "Root: ز - ر - ق",
    "ar": "زرق",
    "alt": [],
    "cat": "root"
  },
  "sfsf": {
    "ro": "sfsf",
    "ur": "صفصف",
    "en": "Root: ص - ف - ص - ف",
    "ar": "صفصف",
    "alt": [],
    "cat": "root"
  },
  "amt": {
    "ro": "amt",
    "ur": "امت",
    "en": "Root: ا - م - ت",
    "ar": "امت",
    "alt": [],
    "cat": "root"
  },
  "hms": {
    "ro": "hms",
    "ur": "همس",
    "en": "Root: ه - م - س",
    "ar": "همس",
    "alt": [],
    "cat": "root"
  },
  "enw": {
    "ro": "enw",
    "ur": "عنو",
    "en": "Root: ع - ن - و",
    "ar": "عنو",
    "alt": [],
    "cat": "root"
  },
  "dnk": {
    "ro": "dnk",
    "ur": "ضنك",
    "en": "Root: ض - ن - ك",
    "ar": "ضنك",
    "alt": [],
    "cat": "root"
  },
  "dmg": {
    "ro": "dmg",
    "ur": "دمغ",
    "en": "Root: د - م - غ",
    "ar": "دمغ",
    "alt": [],
    "cat": "root"
  },
  "rtq": {
    "ro": "rtq",
    "ur": "رتق",
    "en": "Root: ر - ت - ق",
    "ar": "رتق",
    "alt": [],
    "cat": "root"
  },
  "ftq": {
    "ro": "ftq",
    "ur": "فتق",
    "en": "Root: ف - ت - ق",
    "ar": "فتق",
    "alt": [],
    "cat": "root"
  },
  "kla": {
    "ro": "kla",
    "ur": "كلا",
    "en": "Root: ك - ل - ا",
    "ar": "كلا",
    "alt": [],
    "cat": "root"
  },
  "nfh": {
    "ro": "nfh",
    "ur": "نفح",
    "en": "Root: ن - ف - ح",
    "ar": "نفح",
    "alt": [],
    "cat": "root"
  },
  "fhm": {
    "ro": "fhm",
    "ur": "فهم",
    "en": "Root: ف - ه - م",
    "ar": "فهم",
    "alt": [],
    "cat": "root"
  },
  "nwn": {
    "ro": "nwn",
    "ur": "نون",
    "en": "Root: ن - و - ن",
    "ar": "نون",
    "alt": [],
    "cat": "root"
  },
  "hdb": {
    "ro": "hdb",
    "ur": "حدب",
    "en": "Root: ح - د - ب",
    "ar": "حدب",
    "alt": [],
    "cat": "root"
  },
  "*hl": {
    "ro": "*hl",
    "ur": "ذهل",
    "en": "Root: ذ - ه - ل",
    "ar": "ذهل",
    "alt": [],
    "cat": "root"
  },
  "etf": {
    "ro": "etf",
    "ur": "عطف",
    "en": "Root: ع - ط - ف",
    "ar": "عطف",
    "alt": [],
    "cat": "root"
  },
  "mjs": {
    "ro": "mjs",
    "ur": "مجس",
    "en": "Root: م - ج - س",
    "ar": "مجس",
    "alt": [],
    "cat": "root"
  },
  "qme": {
    "ro": "qme",
    "ur": "قمع",
    "en": "Root: ق - م - ع",
    "ar": "قمع",
    "alt": [],
    "cat": "root"
  },
  "emq": {
    "ro": "emq",
    "ur": "عمق",
    "en": "Root: ع - م - ق",
    "ar": "عمق",
    "alt": [],
    "cat": "root"
  },
  "tfv": {
    "ro": "tfv",
    "ur": "تفث",
    "en": "Root: ت - ف - ث",
    "ar": "تفث",
    "alt": [],
    "cat": "root"
  },
  "wjb": {
    "ro": "wjb",
    "ur": "وجب",
    "en": "Root: و - ج - ب",
    "ar": "وجب",
    "alt": [],
    "cat": "root"
  },
  "bar": {
    "ro": "bar",
    "ur": "بار",
    "en": "Root: ب - ا - ر",
    "ar": "بار",
    "alt": [],
    "cat": "root"
  },
  "stw": {
    "ro": "stw",
    "ur": "سطو",
    "en": "Root: س - ط - و",
    "ar": "سطو",
    "alt": [],
    "cat": "root"
  },
  "lfh": {
    "ro": "lfh",
    "ur": "لفح",
    "en": "Root: ل - ف - ح",
    "ar": "لفح",
    "alt": [],
    "cat": "root"
  },
  "klh": {
    "ro": "klh",
    "ur": "كلح",
    "en": "Root: ك - ل - ح",
    "ar": "كلح",
    "alt": [],
    "cat": "root"
  },
  "aym": {
    "ro": "aym",
    "ur": "ايم",
    "en": "Root: ا - ي - م",
    "ar": "ايم",
    "alt": [],
    "cat": "root"
  },
  "*en": {
    "ro": "*en",
    "ur": "ذعن",
    "en": "Root: ذ - ع - ن",
    "ar": "ذعن",
    "alt": [],
    "cat": "root"
  },
  "hyf": {
    "ro": "hyf",
    "ur": "حيف",
    "en": "Root: ح - ي - ف",
    "ar": "حيف",
    "alt": [],
    "cat": "root"
  },
  "lw*": {
    "ro": "lw*",
    "ur": "لوذ",
    "en": "Root: ل - و - ذ",
    "ar": "لوذ",
    "alt": [],
    "cat": "root"
  },
  "fln": {
    "ro": "fln",
    "ur": "فلن",
    "en": "Root: ف - ل - ن",
    "ar": "فلن",
    "alt": [],
    "cat": "root"
  },
  "fsr": {
    "ro": "fsr",
    "ur": "فسر",
    "en": "Root: ف - س - ر",
    "ar": "فسر",
    "alt": [],
    "cat": "root"
  },
  "eba": {
    "ro": "eba",
    "ur": "عبا",
    "en": "Root: ع - ب - ا",
    "ar": "عبا",
    "alt": [],
    "cat": "root"
  },
  "dyr": {
    "ro": "dyr",
    "ur": "ضير",
    "en": "Root: ض - ي - ر",
    "ar": "ضير",
    "alt": [],
    "cat": "root"
  },
  "$r*m": {
    "ro": "$r*m",
    "ur": "شرذم",
    "en": "Root: ش - ر - ذ - م",
    "ar": "شرذم",
    "alt": [],
    "cat": "root"
  },
  "twd": {
    "ro": "twd",
    "ur": "طود",
    "en": "Root: ط - و - د",
    "ar": "طود",
    "alt": [],
    "cat": "root"
  },
  "kbkb": {
    "ro": "kbkb",
    "ur": "كبكب",
    "en": "Root: ك - ب - ك - ب",
    "ar": "كبكب",
    "alt": [],
    "cat": "root"
  },
  "rye": {
    "ro": "rye",
    "ur": "ريع",
    "en": "Root: ر - ي - ع",
    "ar": "ريع",
    "alt": [],
    "cat": "root"
  },
  "bsm": {
    "ro": "bsm",
    "ur": "بسم",
    "en": "Root: ب - س - م",
    "ar": "بسم",
    "alt": [],
    "cat": "root"
  },
  "hdhd": {
    "ro": "hdhd",
    "ur": "هدهد",
    "en": "Root: ه - د - ه - د",
    "ar": "هدهد",
    "alt": [],
    "cat": "root"
  },
  "xba": {
    "ro": "xba",
    "ur": "خبا",
    "en": "Root: خ - ب - ا",
    "ar": "خبا",
    "alt": [],
    "cat": "root"
  },
  "efr": {
    "ro": "efr",
    "ur": "عفر",
    "en": "Root: ع - ف - ر",
    "ar": "عفر",
    "alt": [],
    "cat": "root"
  },
  "jmd": {
    "ro": "jmd",
    "ur": "جمد",
    "en": "Root: ج - م - د",
    "ar": "جمد",
    "alt": [],
    "cat": "root"
  },
  "tqn": {
    "ro": "tqn",
    "ur": "تقن",
    "en": "Root: ت - ق - ن",
    "ar": "تقن",
    "alt": [],
    "cat": "root"
  },
  "wkz": {
    "ro": "wkz",
    "ur": "وكز",
    "en": "Root: و - ك - ز",
    "ar": "وكز",
    "alt": [],
    "cat": "root"
  },
  "*wd": {
    "ro": "*wd",
    "ur": "ذود",
    "en": "Root: ذ - و - د",
    "ar": "ذود",
    "alt": [],
    "cat": "root"
  },
  "j*w": {
    "ro": "j*w",
    "ur": "جذو",
    "en": "Root: ج - ذ - و",
    "ar": "جذو",
    "alt": [],
    "cat": "root"
  },
  "bqe": {
    "ro": "bqe",
    "ur": "بقع",
    "en": "Root: ب - ق - ع",
    "ar": "بقع",
    "alt": [],
    "cat": "root"
  },
  "rda": {
    "ro": "rda",
    "ur": "ردا",
    "en": "Root: ر - د - ا",
    "ar": "ردا",
    "alt": [],
    "cat": "root"
  },
  "qbh": {
    "ro": "qbh",
    "ur": "قبح",
    "en": "Root: ق - ب - ح",
    "ar": "قبح",
    "alt": [],
    "cat": "root"
  },
  "nwa": {
    "ro": "nwa",
    "ur": "نوا",
    "en": "Root: ن - و - ا",
    "ar": "نوا",
    "alt": [],
    "cat": "root"
  },
  "xtt": {
    "ro": "xtt",
    "ur": "خطط",
    "en": "Root: خ - ط - ط",
    "ar": "خطط",
    "alt": [],
    "cat": "root"
  },
  "msw": {
    "ro": "msw",
    "ur": "مسو",
    "en": "Root: م - س - و",
    "ar": "مسو",
    "alt": [],
    "cat": "root"
  },
  "xtr": {
    "ro": "xtr",
    "ur": "ختر",
    "en": "Root: خ - ت - ر",
    "ar": "ختر",
    "alt": [],
    "cat": "root"
  },
  "jfw": {
    "ro": "jfw",
    "ur": "جفو",
    "en": "Root: ج - ف - و",
    "ar": "جفو",
    "alt": [],
    "cat": "root"
  },
  "jwf": {
    "ro": "jwf",
    "ur": "جوف",
    "en": "Root: ج - و - ف",
    "ar": "جوف",
    "alt": [],
    "cat": "root"
  },
  "ewq": {
    "ro": "ewq",
    "ur": "عوق",
    "en": "Root: ع - و - ق",
    "ar": "عوق",
    "alt": [],
    "cat": "root"
  },
  "slq": {
    "ro": "slq",
    "ur": "سلق",
    "en": "Root: س - ل - ق",
    "ar": "سلق",
    "alt": [],
    "cat": "root"
  },
  "nhb": {
    "ro": "nhb",
    "ur": "نحب",
    "en": "Root: ن - ح - ب",
    "ar": "نحب",
    "alt": [],
    "cat": "root"
  },
  "sys": {
    "ro": "sys",
    "ur": "صيص",
    "en": "Root: ص - ي - ص",
    "ar": "صيص",
    "alt": [],
    "cat": "root"
  },
  "srd": {
    "ro": "srd",
    "ur": "سرد",
    "en": "Root: س - ر - د",
    "ar": "سرد",
    "alt": [],
    "cat": "root"
  },
  "jfn": {
    "ro": "jfn",
    "ur": "جفن",
    "en": "Root: ج - ف - ن",
    "ar": "جفن",
    "alt": [],
    "cat": "root"
  },
  "erm": {
    "ro": "erm",
    "ur": "عرم",
    "en": "Root: ع - ر - م",
    "ar": "عرم",
    "alt": [],
    "cat": "root"
  },
  "xmt": {
    "ro": "xmt",
    "ur": "خمط",
    "en": "Root: خ - م - ط",
    "ar": "خمط",
    "alt": [],
    "cat": "root"
  },
  "avl": {
    "ro": "avl",
    "ur": "اثل",
    "en": "Root: ا - ث - ل",
    "ar": "اثل",
    "alt": [],
    "cat": "root"
  },
  "nw$": {
    "ro": "nw$",
    "ur": "نوش",
    "en": "Root: ن - و - ش",
    "ar": "نوش",
    "alt": [],
    "cat": "root"
  },
  "qtmr": {
    "ro": "qtmr",
    "ur": "قطمر",
    "en": "Root: ق - ط - م - ر",
    "ar": "قطمر",
    "alt": [],
    "cat": "root"
  },
  "qmh": {
    "ro": "qmh",
    "ur": "قمح",
    "en": "Root: ق - م - ح",
    "ar": "قمح",
    "alt": [],
    "cat": "root"
  },
  "erjn": {
    "ro": "erjn",
    "ur": "عرجن",
    "en": "Root: ع - ر - ج - ن",
    "ar": "عرجن",
    "alt": [],
    "cat": "root"
  },
  "msx": {
    "ro": "msx",
    "ur": "مسخ",
    "en": "Root: م - س - خ",
    "ar": "مسخ",
    "alt": [],
    "cat": "root"
  },
  "lzb": {
    "ro": "lzb",
    "ur": "لزب",
    "en": "Root: ل - ز - ب",
    "ar": "لزب",
    "alt": [],
    "cat": "root"
  },
  "gwl": {
    "ro": "gwl",
    "ur": "غول",
    "en": "Root: غ - و - ل",
    "ar": "غول",
    "alt": [],
    "cat": "root"
  },
  "$wb": {
    "ro": "$wb",
    "ur": "شوب",
    "en": "Root: ش - و - ب",
    "ar": "شوب",
    "alt": [],
    "cat": "root"
  },
  "zff": {
    "ro": "zff",
    "ur": "زفف",
    "en": "Root: ز - ف - ف",
    "ar": "زفف",
    "alt": [],
    "cat": "root"
  },
  "jbn": {
    "ro": "jbn",
    "ur": "جبن",
    "en": "Root: ج - ب - ن",
    "ar": "جبن",
    "alt": [],
    "cat": "root"
  },
  "abq": {
    "ro": "abq",
    "ur": "ابق",
    "en": "Root: ا - ب - ق",
    "ar": "ابق",
    "alt": [],
    "cat": "root"
  },
  "shm": {
    "ro": "shm",
    "ur": "سهم",
    "en": "Root: س - ه - م",
    "ar": "سهم",
    "alt": [],
    "cat": "root"
  },
  "lqm": {
    "ro": "lqm",
    "ur": "لقم",
    "en": "Root: ل - ق - م",
    "ar": "لقم",
    "alt": [],
    "cat": "root"
  },
  "swh": {
    "ro": "swh",
    "ur": "سوح",
    "en": "Root: س - و - ح",
    "ar": "سوح",
    "alt": [],
    "cat": "root"
  },
  "lwt": {
    "ro": "lwt",
    "ur": "لوت",
    "en": "Root: ل - و - ت",
    "ar": "لوت",
    "alt": [],
    "cat": "root"
  },
  "qtt": {
    "ro": "qtt",
    "ur": "قطط",
    "en": "Root: ق - ط - ط",
    "ar": "قطط",
    "alt": [],
    "cat": "root"
  },
  "jwd": {
    "ro": "jwd",
    "ur": "جود",
    "en": "Root: ج - و - د",
    "ar": "جود",
    "alt": [],
    "cat": "root"
  },
  "rxw": {
    "ro": "rxw",
    "ur": "رخو",
    "en": "Root: ر - خ - و",
    "ar": "رخو",
    "alt": [],
    "cat": "root"
  },
  "q$er": {
    "ro": "q$er",
    "ur": "قشعر",
    "en": "Root: ق - ش - ع - ر",
    "ar": "قشعر",
    "alt": [],
    "cat": "root"
  },
  "$ks": {
    "ro": "$ks",
    "ur": "شكس",
    "en": "Root: ش - ك - س",
    "ar": "شكس",
    "alt": [],
    "cat": "root"
  },
  "$mz": {
    "ro": "$mz",
    "ur": "شمز",
    "en": "Root: ش - م - ز",
    "ar": "شمز",
    "alt": [],
    "cat": "root"
  },
  "fwd": {
    "ro": "fwd",
    "ur": "فوض",
    "en": "Root: ف - و - ض",
    "ar": "فوض",
    "alt": [],
    "cat": "root"
  },
  "rhw": {
    "ro": "rhw",
    "ur": "رهو",
    "en": "Root: ر - ه - و",
    "ar": "رهو",
    "alt": [],
    "cat": "root"
  },
  "hqf": {
    "ro": "hqf",
    "ur": "حقف",
    "en": "Root: ح - ق - ف",
    "ar": "حقف",
    "alt": [],
    "cat": "root"
  },
  "tes": {
    "ro": "tes",
    "ur": "تعس",
    "en": "Root: ت - ع - س",
    "ar": "تعس",
    "alt": [],
    "cat": "root"
  },
  "asn": {
    "ro": "asn",
    "ur": "اسن",
    "en": "Root: ا - س - ن",
    "ar": "اسن",
    "alt": [],
    "cat": "root"
  },
  "esl": {
    "ro": "esl",
    "ur": "عسل",
    "en": "Root: ع - س - ل",
    "ar": "عسل",
    "alt": [],
    "cat": "root"
  },
  "mey": {
    "ro": "mey",
    "ur": "معي",
    "en": "Root: م - ع - ي",
    "ar": "معي",
    "alt": [],
    "cat": "root"
  },
  "$rt": {
    "ro": "$rt",
    "ur": "شرط",
    "en": "Root: ش - ر - ط",
    "ar": "شرط",
    "alt": [],
    "cat": "root"
  },
  "qfl": {
    "ro": "qfl",
    "ur": "قفل",
    "en": "Root: ق - ف - ل",
    "ar": "قفل",
    "alt": [],
    "cat": "root"
  },
  "lhn": {
    "ro": "lhn",
    "ur": "لحن",
    "en": "Root: ل - ح - ن",
    "ar": "لحن",
    "alt": [],
    "cat": "root"
  },
  "nbz": {
    "ro": "nbz",
    "ur": "نبز",
    "en": "Root: ن - ب - ز",
    "ar": "نبز",
    "alt": [],
    "cat": "root"
  },
  "lqb": {
    "ro": "lqb",
    "ur": "لقب",
    "en": "Root: ل - ق - ب",
    "ar": "لقب",
    "alt": [],
    "cat": "root"
  },
  "jss": {
    "ro": "jss",
    "ur": "جسس",
    "en": "Root: ج - س - س",
    "ar": "جسس",
    "alt": [],
    "cat": "root"
  },
  "lyt": {
    "ro": "lyt",
    "ur": "ليت",
    "en": "Root: ل - ي - ت",
    "ar": "ليت",
    "alt": [],
    "cat": "root"
  },
  "bsq": {
    "ro": "bsq",
    "ur": "بسق",
    "en": "Root: ب - س - ق",
    "ar": "بسق",
    "alt": [],
    "cat": "root"
  },
  "lfz": {
    "ro": "lfz",
    "ur": "لفظ",
    "en": "Root: ل - ف - ظ",
    "ar": "لفظ",
    "alt": [],
    "cat": "root"
  },
  "hbk": {
    "ro": "hbk",
    "ur": "حبك",
    "en": "Root: ح - ب - ك",
    "ar": "حبك",
    "alt": [],
    "cat": "root"
  },
  "hje": {
    "ro": "hje",
    "ur": "هجع",
    "en": "Root: ه - ج - ع",
    "ar": "هجع",
    "alt": [],
    "cat": "root"
  },
  "skk": {
    "ro": "skk",
    "ur": "صكك",
    "en": "Root: ص - ك - ك",
    "ar": "صكك",
    "alt": [],
    "cat": "root"
  },
  "rqq": {
    "ro": "rqq",
    "ur": "رقق",
    "en": "Root: ر - ق - ق",
    "ar": "رقق",
    "alt": [],
    "cat": "root"
  },
  "alt": {
    "ro": "alt",
    "ur": "الت",
    "en": "Root: ا - ل - ت",
    "ar": "الت",
    "alt": [],
    "cat": "root"
  },
  "qwb": {
    "ro": "qwb",
    "ur": "قوب",
    "en": "Root: ق - و - ب",
    "ar": "قوب",
    "alt": [],
    "cat": "root"
  },
  "qws": {
    "ro": "qws",
    "ur": "قوس",
    "en": "Root: ق - و - س",
    "ar": "قوس",
    "alt": [],
    "cat": "root"
  },
  "dyz": {
    "ro": "dyz",
    "ur": "ضيز",
    "en": "Root: ض - ي - ز",
    "ar": "ضيز",
    "alt": [],
    "cat": "root"
  },
  "kdy": {
    "ro": "kdy",
    "ur": "كدي",
    "en": "Root: ك - د - ي",
    "ar": "كدي",
    "alt": [],
    "cat": "root"
  },
  "qny": {
    "ro": "qny",
    "ur": "قني",
    "en": "Root: ق - ن - ي",
    "ar": "قني",
    "alt": [],
    "cat": "root"
  },
  "smd": {
    "ro": "smd",
    "ur": "سمد",
    "en": "Root: س - م - د",
    "ar": "سمد",
    "alt": [],
    "cat": "root"
  },
  "dsr": {
    "ro": "dsr",
    "ur": "دسر",
    "en": "Root: د - س - ر",
    "ar": "دسر",
    "alt": [],
    "cat": "root"
  },
  "qer": {
    "ro": "qer",
    "ur": "قعر",
    "en": "Root: ق - ع - ر",
    "ar": "قعر",
    "alt": [],
    "cat": "root"
  },
  "dhy": {
    "ro": "dhy",
    "ur": "دهي",
    "en": "Root: د - ه - ي",
    "ar": "دهي",
    "alt": [],
    "cat": "root"
  },
  "anm": {
    "ro": "anm",
    "ur": "انم",
    "en": "Root: ا - ن - م",
    "ar": "انم",
    "alt": [],
    "cat": "root"
  },
  "fny": {
    "ro": "fny",
    "ur": "فني",
    "en": "Root: ف - ن - ي",
    "ar": "فني",
    "alt": [],
    "cat": "root"
  },
  "$wz": {
    "ro": "$wz",
    "ur": "شوظ",
    "en": "Root: ش - و - ظ",
    "ar": "شوظ",
    "alt": [],
    "cat": "root"
  },
  "fnn": {
    "ro": "fnn",
    "ur": "فنن",
    "en": "Root: ف - ن - ن",
    "ar": "فنن",
    "alt": [],
    "cat": "root"
  },
  "dhm": {
    "ro": "dhm",
    "ur": "دهم",
    "en": "Root: د - ه - م",
    "ar": "دهم",
    "alt": [],
    "cat": "root"
  },
  "ndx": {
    "ro": "ndx",
    "ur": "نضخ",
    "en": "Root: ن - ض - خ",
    "ar": "نضخ",
    "alt": [],
    "cat": "root"
  },
  "xym": {
    "ro": "xym",
    "ur": "خيم",
    "en": "Root: خ - ي - م",
    "ar": "خيم",
    "alt": [],
    "cat": "root"
  },
  "rfrf": {
    "ro": "rfrf",
    "ur": "رفرف",
    "en": "Root: ر - ف - ر - ف",
    "ar": "رفرف",
    "alt": [],
    "cat": "root"
  },
  "ebqr": {
    "ro": "ebqr",
    "ur": "عبقر",
    "en": "Root: ع - ب - ق - ر",
    "ar": "عبقر",
    "alt": [],
    "cat": "root"
  },
  "wdn": {
    "ro": "wdn",
    "ur": "وضن",
    "en": "Root: و - ض - ن",
    "ar": "وضن",
    "alt": [],
    "cat": "root"
  },
  "tlh": {
    "ro": "tlh",
    "ur": "طلح",
    "en": "Root: ط - ل - ح",
    "ar": "طلح",
    "alt": [],
    "cat": "root"
  },
  "skb": {
    "ro": "skb",
    "ur": "سكب",
    "en": "Root: س - ك - ب",
    "ar": "سكب",
    "alt": [],
    "cat": "root"
  },
  "mzn": {
    "ro": "mzn",
    "ur": "مزن",
    "en": "Root: م - ز - ن",
    "ar": "مزن",
    "alt": [],
    "cat": "root"
  },
  "jls": {
    "ro": "jls",
    "ur": "جلس",
    "en": "Root: ج - ل - س",
    "ar": "جلس",
    "alt": [],
    "cat": "root"
  },
  "x$b": {
    "ro": "x$b",
    "ur": "خشب",
    "en": "Root: خ - ش - ب",
    "ar": "خشب",
    "alt": [],
    "cat": "root"
  },
  "snd": {
    "ro": "snd",
    "ur": "سند",
    "en": "Root: س - ن - د",
    "ar": "سند",
    "alt": [],
    "cat": "root"
  },
  "gbn": {
    "ro": "gbn",
    "ur": "غبن",
    "en": "Root: غ - ب - ن",
    "ar": "غبن",
    "alt": [],
    "cat": "root"
  },
  "vyb": {
    "ro": "vyb",
    "ur": "ثيب",
    "en": "Root: ث - ي - ب",
    "ar": "ثيب",
    "alt": [],
    "cat": "root"
  },
  "nmm": {
    "ro": "nmm",
    "ur": "نمم",
    "en": "Root: ن - م - م",
    "ar": "نمم",
    "alt": [],
    "cat": "root"
  },
  "znm": {
    "ro": "znm",
    "ur": "زنم",
    "en": "Root: ز - ن - م",
    "ar": "زنم",
    "alt": [],
    "cat": "root"
  },
  "xrtm": {
    "ro": "xrtm",
    "ur": "خرطم",
    "en": "Root: خ - ر - ط - م",
    "ar": "خرطم",
    "alt": [],
    "cat": "root"
  },
  "hsm": {
    "ro": "hsm",
    "ur": "حسم",
    "en": "Root: ح - س - م",
    "ar": "حسم",
    "alt": [],
    "cat": "root"
  },
  "hle": {
    "ro": "hle",
    "ur": "هلع",
    "en": "Root: ه - ل - ع",
    "ar": "هلع",
    "alt": [],
    "cat": "root"
  },
  "ezw": {
    "ro": "ezw",
    "ur": "عزو",
    "en": "Root: ع - ز - و",
    "ar": "عزو",
    "alt": [],
    "cat": "root"
  },
  "hry": {
    "ro": "hry",
    "ur": "حري",
    "en": "Root: ح - ر - ي",
    "ar": "حري",
    "alt": [],
    "cat": "root"
  },
  "gdq": {
    "ro": "gdq",
    "ur": "غدق",
    "en": "Root: غ - د - ق",
    "ar": "غدق",
    "alt": [],
    "cat": "root"
  },
  "zml": {
    "ro": "zml",
    "ur": "زمل",
    "en": "Root: ز - م - ل",
    "ar": "زمل",
    "alt": [],
    "cat": "root"
  },
  "gss": {
    "ro": "gss",
    "ur": "غصص",
    "en": "Root: غ - ص - ص",
    "ar": "غصص",
    "alt": [],
    "cat": "root"
  },
  "kvb": {
    "ro": "kvb",
    "ur": "كثب",
    "en": "Root: ك - ث - ب",
    "ar": "كثب",
    "alt": [],
    "cat": "root"
  },
  "hyl": {
    "ro": "hyl",
    "ur": "هيل",
    "en": "Root: ه - ي - ل",
    "ar": "هيل",
    "alt": [],
    "cat": "root"
  },
  "dvr": {
    "ro": "dvr",
    "ur": "دثر",
    "en": "Root: د - ث - ر",
    "ar": "دثر",
    "alt": [],
    "cat": "root"
  },
  "hrk": {
    "ro": "hrk",
    "ur": "حرك",
    "en": "Root: ح - ر - ك",
    "ar": "حرك",
    "alt": [],
    "cat": "root"
  },
  "mtw": {
    "ro": "mtw",
    "ur": "مطو",
    "en": "Root: م - ط - و",
    "ar": "مطو",
    "alt": [],
    "cat": "root"
  },
  "m$j": {
    "ro": "m$j",
    "ur": "مشج",
    "en": "Root: م - ش - ج",
    "ar": "مشج",
    "alt": [],
    "cat": "root"
  },
  "qmtr": {
    "ro": "qmtr",
    "ur": "قمطر",
    "en": "Root: ق - م - ط - ر",
    "ar": "قمطر",
    "alt": [],
    "cat": "root"
  },
  "zmhr": {
    "ro": "zmhr",
    "ur": "زمهر",
    "en": "Root: ز - م - ه - ر",
    "ar": "زمهر",
    "alt": [],
    "cat": "root"
  },
  "kft": {
    "ro": "kft",
    "ur": "كفت",
    "en": "Root: ك - ف - ت",
    "ar": "كفت",
    "alt": [],
    "cat": "root"
  },
  "$mx": {
    "ro": "$mx",
    "ur": "شمخ",
    "en": "Root: ش - م - خ",
    "ar": "شمخ",
    "alt": [],
    "cat": "root"
  },
  "whj": {
    "ro": "whj",
    "ur": "وهج",
    "en": "Root: و - ه - ج",
    "ar": "وهج",
    "alt": [],
    "cat": "root"
  },
  "vjj": {
    "ro": "vjj",
    "ur": "ثجج",
    "en": "Root: ث - ج - ج",
    "ar": "ثجج",
    "alt": [],
    "cat": "root"
  },
  "dhq": {
    "ro": "dhq",
    "ur": "دهق",
    "en": "Root: د - ه - ق",
    "ar": "دهق",
    "alt": [],
    "cat": "root"
  },
  "nxr": {
    "ro": "nxr",
    "ur": "نخر",
    "en": "Root: ن - خ - ر",
    "ar": "نخر",
    "alt": [],
    "cat": "root"
  },
  "smk": {
    "ro": "smk",
    "ur": "سمك",
    "en": "Root: س - م - ك",
    "ar": "سمك",
    "alt": [],
    "cat": "root"
  },
  "gt$": {
    "ro": "gt$",
    "ur": "غطش",
    "en": "Root: غ - ط - ش",
    "ar": "غطش",
    "alt": [],
    "cat": "root"
  },
  "qdb": {
    "ro": "qdb",
    "ur": "قضب",
    "en": "Root: ق - ض - ب",
    "ar": "قضب",
    "alt": [],
    "cat": "root"
  },
  "abb": {
    "ro": "abb",
    "ur": "ابب",
    "en": "Root: ا - ب - ب",
    "ar": "ابب",
    "alt": [],
    "cat": "root"
  },
  "sxx": {
    "ro": "sxx",
    "ur": "صخخ",
    "en": "Root: ص - خ - خ",
    "ar": "صخخ",
    "alt": [],
    "cat": "root"
  },
  "kdr": {
    "ro": "kdr",
    "ur": "كدر",
    "en": "Root: ك - د - ر",
    "ar": "كدر",
    "alt": [],
    "cat": "root"
  },
  "wh$": {
    "ro": "wh$",
    "ur": "وحش",
    "en": "Root: و - ح - ش",
    "ar": "وحش",
    "alt": [],
    "cat": "root"
  },
  "wad": {
    "ro": "wad",
    "ur": "واد",
    "en": "Root: و - ا - د",
    "ar": "واد",
    "alt": [],
    "cat": "root"
  },
  "k$t": {
    "ro": "k$t",
    "ur": "كشط",
    "en": "Root: ك - ش - ط",
    "ar": "كشط",
    "alt": [],
    "cat": "root"
  },
  "kns": {
    "ro": "kns",
    "ur": "كنس",
    "en": "Root: ك - ن - س",
    "ar": "كنس",
    "alt": [],
    "cat": "root"
  },
  "eses": {
    "ro": "eses",
    "ur": "عسعس",
    "en": "Root: ع - س - ع - س",
    "ar": "عسعس",
    "alt": [],
    "cat": "root"
  },
  "dnn": {
    "ro": "dnn",
    "ur": "ضنن",
    "en": "Root: ض - ن - ن",
    "ar": "ضنن",
    "alt": [],
    "cat": "root"
  },
  "tff": {
    "ro": "tff",
    "ur": "طفف",
    "en": "Root: ط - ف - ف",
    "ar": "طفف",
    "alt": [],
    "cat": "root"
  },
  "ryn": {
    "ro": "ryn",
    "ur": "رين",
    "en": "Root: ر - ي - ن",
    "ar": "رين",
    "alt": [],
    "cat": "root"
  },
  "gmz": {
    "ro": "gmz",
    "ur": "غمز",
    "en": "Root: غ - م - ز",
    "ar": "غمز",
    "alt": [],
    "cat": "root"
  },
  "dfq": {
    "ro": "dfq",
    "ur": "دفق",
    "en": "Root: د - ف - ق",
    "ar": "دفق",
    "alt": [],
    "cat": "root"
  },
  "hzl": {
    "ro": "hzl",
    "ur": "هزل",
    "en": "Root: ه - ز - ل",
    "ar": "هزل",
    "alt": [],
    "cat": "root"
  },
  "sth": {
    "ro": "sth",
    "ur": "سطح",
    "en": "Root: س - ط - ح",
    "ar": "سطح",
    "alt": [],
    "cat": "root"
  },
  "jmm": {
    "ro": "jmm",
    "ur": "جمم",
    "en": "Root: ج - م - م",
    "ar": "جمم",
    "alt": [],
    "cat": "root"
  },
  "kbd": {
    "ro": "kbd",
    "ur": "كبد",
    "en": "Root: ك - ب - د",
    "ar": "كبد",
    "alt": [],
    "cat": "root"
  },
  "$fh": {
    "ro": "$fh",
    "ur": "شفه",
    "en": "Root: ش - ف - ه",
    "ar": "شفه",
    "alt": [],
    "cat": "root"
  },
  "njd": {
    "ro": "njd",
    "ur": "نجد",
    "en": "Root: ن - ج - د",
    "ar": "نجد",
    "alt": [],
    "cat": "root"
  },
  "sgb": {
    "ro": "sgb",
    "ur": "سغب",
    "en": "Root: س - غ - ب",
    "ar": "سغب",
    "alt": [],
    "cat": "root"
  },
  "thw": {
    "ro": "thw",
    "ur": "طحو",
    "en": "Root: ط - ح - و",
    "ar": "طحو",
    "alt": [],
    "cat": "root"
  },
  "dsw": {
    "ro": "dsw",
    "ur": "دسو",
    "en": "Root: د - س - و",
    "ar": "دسو",
    "alt": [],
    "cat": "root"
  },
  "dmdm": {
    "ro": "dmdm",
    "ur": "دمدم",
    "en": "Root: د - م - د - م",
    "ar": "دمدم",
    "alt": [],
    "cat": "root"
  },
  "lzy": {
    "ro": "lzy",
    "ur": "لظي",
    "en": "Root: ل - ظ - ي",
    "ar": "لظي",
    "alt": [],
    "cat": "root"
  },
  "sjw": {
    "ro": "sjw",
    "ur": "سجو",
    "en": "Root: س - ج - و",
    "ar": "سجو",
    "alt": [],
    "cat": "root"
  },
  "sfe": {
    "ro": "sfe",
    "ur": "سفع",
    "en": "Root: س - ف - ع",
    "ar": "سفع",
    "alt": [],
    "cat": "root"
  },
  "zbn": {
    "ro": "zbn",
    "ur": "زبن",
    "en": "Root: ز - ب - ن",
    "ar": "زبن",
    "alt": [],
    "cat": "root"
  },
  "dbh": {
    "ro": "dbh",
    "ur": "ضبح",
    "en": "Root: ض - ب - ح",
    "ar": "ضبح",
    "alt": [],
    "cat": "root"
  },
  "qdh": {
    "ro": "qdh",
    "ur": "قدح",
    "en": "Root: ق - د - ح",
    "ar": "قدح",
    "alt": [],
    "cat": "root"
  },
  "nqe": {
    "ro": "nqe",
    "ur": "نقع",
    "en": "Root: ن - ق - ع",
    "ar": "نقع",
    "alt": [],
    "cat": "root"
  },
  "knd": {
    "ro": "knd",
    "ur": "كند",
    "en": "Root: ك - ن - د",
    "ar": "كند",
    "alt": [],
    "cat": "root"
  },
  "hsl": {
    "ro": "hsl",
    "ur": "حصل",
    "en": "Root: ح - ص - ل",
    "ar": "حصل",
    "alt": [],
    "cat": "root"
  },
  "fyl": {
    "ro": "fyl",
    "ur": "فيل",
    "en": "Root: ف - ي - ل",
    "ar": "فيل",
    "alt": [],
    "cat": "root"
  },
  "$tw": {
    "ro": "$tw",
    "ur": "شتو",
    "en": "Root: ش - ت - و",
    "ar": "شتو",
    "alt": [],
    "cat": "root"
  },
  "syf": {
    "ro": "syf",
    "ur": "صيف",
    "en": "Root: ص - ي - ف",
    "ar": "صيف",
    "alt": [],
    "cat": "root"
  },
  "men": {
    "ro": "men",
    "ur": "معن",
    "en": "Root: م - ع - ن",
    "ar": "معن",
    "alt": [],
    "cat": "root"
  },
  "jyd": {
    "ro": "jyd",
    "ur": "جيد",
    "en": "Root: ج - ي - د",
    "ar": "جيد",
    "alt": [],
    "cat": "root"
  },
  "msd": {
    "ro": "msd",
    "ur": "مسد",
    "en": "Root: م - س - د",
    "ar": "مسد",
    "alt": [],
    "cat": "root"
  },
  "kfa": {
    "ro": "kfa",
    "ur": "كفا",
    "en": "Root: ك - ف - ا",
    "ar": "كفا",
    "alt": [],
    "cat": "root"
  },
  "wqb": {
    "ro": "wqb",
    "ur": "وقب",
    "en": "Root: و - ق - ب",
    "ar": "وقب",
    "alt": [],
    "cat": "root"
  },
  "nfv": {
    "ro": "nfv",
    "ur": "نفث",
    "en": "Root: ن - ف - ث",
    "ar": "نفث",
    "alt": [],
    "cat": "root"
  },
  "jo": {
    "ro": "jo",
    "ur": "ما",
    "en": "What / That which / Not",
    "ar": "ما",
    "alt": [],
    "cat": "word"
  },
  "nahi": {
    "ro": "nahi",
    "ur": "ما",
    "en": "In/With what / that which / not",
    "ar": "ما",
    "alt": [],
    "cat": "word"
  },
  "na": {
    "ro": "na",
    "ur": "لا",
    "en": "So no / not",
    "ar": "لا",
    "alt": [],
    "cat": "word"
  },
  "mein se": {
    "ro": "mein se",
    "ur": "من",
    "en": "For from / of",
    "ar": "من",
    "alt": [],
    "cat": "word"
  },
  "lafz-e-quran": {
    "ro": "lafz-e-quran",
    "ur": "الذین",
    "en": "Sacred Quranic term",
    "ar": "الذین",
    "alt": [],
    "cat": "word"
  },
  "siwae": {
    "ro": "siwae",
    "ur": "الا",
    "en": "Except / Only",
    "ar": "الا",
    "alt": [],
    "cat": "word"
  },
  "beshak": {
    "ro": "beshak",
    "ur": "ان",
    "en": "For indeed / already",
    "ar": "ان",
    "alt": [],
    "cat": "word"
  },
  "ooper": {
    "ro": "ooper",
    "ur": "علي",
    "en": "Upon / On",
    "ar": "علي",
    "alt": [],
    "cat": "word"
  },
  "hua": {
    "ro": "hua",
    "ur": "كان",
    "en": "He was / Used to be",
    "ar": "كان",
    "alt": [],
    "cat": "word"
  },
  "usne farmaya": {
    "ro": "usne farmaya",
    "ur": "قال",
    "en": "He said",
    "ar": "قال",
    "alt": [],
    "cat": "word"
  },
  "ke liye wo sab log": {
    "ro": "ke liye wo sab log",
    "ur": "لهم",
    "en": "For they / them",
    "ar": "لهم",
    "alt": [],
    "cat": "word"
  },
  "saath jo": {
    "ro": "saath jo",
    "ur": "بما",
    "en": "In/With what / that which / not",
    "ar": "بما",
    "alt": [],
    "cat": "word"
  },
  "uske baad": {
    "ro": "uske baad",
    "ur": "ثم",
    "en": "Then / Thereafter",
    "ar": "ثم",
    "alt": [],
    "cat": "word"
  },
  "wo sab log": {
    "ro": "wo sab log",
    "ur": "هم",
    "en": "They / Them",
    "ar": "هم",
    "alt": [],
    "cat": "word"
  },
  "wo the": {
    "ro": "wo the",
    "ur": "كانوا",
    "en": "They were",
    "ar": "كانوا",
    "alt": [],
    "cat": "word"
  },
  "ke liye tum sab": {
    "ro": "ke liye tum sab",
    "ur": "لكم",
    "en": "For you (plural)",
    "ar": "لكم",
    "alt": [],
    "cat": "word"
  },
  "wo imaan laye": {
    "ro": "wo imaan laye",
    "ur": "امنوا",
    "en": "They believed",
    "ar": "امنوا",
    "alt": [],
    "cat": "word"
  },
  "kaash": {
    "ro": "kaash",
    "ur": "لو",
    "en": "So if / would that",
    "ar": "لو",
    "alt": [],
    "cat": "word"
  },
  "unhone kaha": {
    "ro": "unhone kaha",
    "ur": "قالوا",
    "en": "They said",
    "ar": "قالوا",
    "alt": [],
    "cat": "word"
  },
  "jabke": {
    "ro": "jabke",
    "ur": "اذ",
    "en": "When / Remember when",
    "ar": "اذ",
    "alt": [],
    "cat": "word"
  },
  "yaad karo jab": {
    "ro": "yaad karo jab",
    "ur": "اذ",
    "en": "When / Remember when",
    "ar": "اذ",
    "alt": [],
    "cat": "word"
  },
  "wo": {
    "ro": "wo",
    "ur": "ذلك",
    "en": "That (feminine)",
    "ar": "ذلك",
    "alt": [],
    "cat": "word"
  },
  "yeh": {
    "ro": "yeh",
    "ur": "هذا",
    "en": "This (masculine)",
    "ar": "هذا",
    "alt": [],
    "cat": "word"
  },
  "unhone kufr kiya": {
    "ro": "unhone kufr kiya",
    "ur": "كفروا",
    "en": "They disbelieved",
    "ar": "كفروا",
    "alt": [],
    "cat": "word"
  },
  "ke liye tehqeeq": {
    "ro": "ke liye tehqeeq",
    "ur": "لقد",
    "en": "For indeed / already",
    "ar": "لقد",
    "alt": [],
    "cat": "word"
  },
  "baabat": {
    "ro": "baabat",
    "ur": "عن",
    "en": "From / Concerning",
    "ar": "عن",
    "alt": [],
    "cat": "word"
  },
  "to nahi": {
    "ro": "to nahi",
    "ur": "فلا",
    "en": "So no / not",
    "ar": "فلا",
    "alt": [],
    "cat": "word"
  },
  "tehqeeq": {
    "ro": "tehqeeq",
    "ur": "قد",
    "en": "Indeed / Already",
    "ar": "قد",
    "alt": [],
    "cat": "word"
  },
  "saath allah ta'ala": {
    "ro": "saath allah ta'ala",
    "ur": "بالله",
    "en": "In/With allah (the one true god)",
    "ar": "بالله",
    "alt": [],
    "cat": "word"
  },
  "har ek": {
    "ro": "har ek",
    "ur": "كل",
    "en": "Every / All",
    "ar": "كل",
    "alt": [],
    "cat": "word"
  },
  "sab": {
    "ro": "sab",
    "ur": "كل",
    "en": "In/With every / all",
    "ar": "كل",
    "alt": [],
    "cat": "word"
  },
  "yahan tak ke": {
    "ro": "yahan tak ke",
    "ur": "حتي",
    "en": "Until",
    "ar": "حتي",
    "alt": [],
    "cat": "word"
  },
  "tum sab": {
    "ro": "tum sab",
    "ur": "انتم",
    "en": "You (plural)",
    "ar": "انتم",
    "alt": [],
    "cat": "word"
  },
  "paas": {
    "ro": "paas",
    "ur": "عند",
    "en": "Near / With / In presence of",
    "ar": "عند",
    "alt": [],
    "cat": "word"
  },
  "nazdeek": {
    "ro": "nazdeek",
    "ur": "عند",
    "en": "Near / With / In presence of",
    "ar": "عند",
    "alt": [],
    "cat": "word"
  },
  "log": {
    "ro": "log",
    "ur": "الناس",
    "en": "Mankind / The People",
    "ar": "الناس",
    "alt": [],
    "cat": "word"
  },
  "insaan": {
    "ro": "insaan",
    "ur": "الناس",
    "en": "Mankind / The People",
    "ar": "الناس",
    "alt": [],
    "cat": "word"
  },
  "siwa": {
    "ro": "siwa",
    "ur": "دون",
    "en": "Besides / Below",
    "ar": "دون",
    "alt": [],
    "cat": "word"
  },
  "chhod kar": {
    "ro": "chhod kar",
    "ur": "دون",
    "en": "Besides / Below",
    "ar": "دون",
    "alt": [],
    "cat": "word"
  },
  "azaab": {
    "ro": "azaab",
    "ur": "عذاب",
    "en": "The a punishment / torment",
    "ar": "عذاب",
    "alt": [],
    "cat": "word"
  },
  "asmani farman": {
    "ro": "asmani farman",
    "ur": "الكتب",
    "en": "The Book / Scripture",
    "ar": "الكتب",
    "alt": [],
    "cat": "word"
  },
  "usne banaya": {
    "ro": "usne banaya",
    "ur": "جعل",
    "en": "He made / appointed",
    "ar": "جعل",
    "alt": [],
    "cat": "word"
  },
  "wo aaya": {
    "ro": "wo aaya",
    "ur": "جاء",
    "en": "He came",
    "ar": "جاء",
    "alt": [],
    "cat": "word"
  },
  "to jo": {
    "ro": "to jo",
    "ur": "فما",
    "en": "So what / that which / not",
    "ar": "فما",
    "alt": [],
    "cat": "word"
  },
  "to beshak": {
    "ro": "to beshak",
    "ur": "فان",
    "en": "So indeed / truly",
    "ar": "فان",
    "alt": [],
    "cat": "word"
  },
  "usne paida farmaya": {
    "ro": "usne paida farmaya",
    "ur": "خلق",
    "en": "He created",
    "ar": "خلق",
    "alt": [],
    "cat": "word"
  },
  "hargiz nahi": {
    "ro": "hargiz nahi",
    "ur": "لن",
    "en": "Never / Will not",
    "ar": "لن",
    "alt": [],
    "cat": "word"
  },
  "usne naazil kiya": {
    "ro": "usne naazil kiya",
    "ur": "انزل",
    "en": "He sent down",
    "ar": "انزل",
    "alt": [],
    "cat": "word"
  },
  "ke liye jo": {
    "ro": "ke liye jo",
    "ur": "لما",
    "en": "For what / that which / not",
    "ar": "لما",
    "alt": [],
    "cat": "word"
  },
  "balke": {
    "ro": "balke",
    "ur": "بل",
    "en": "Rather / Nay",
    "ar": "بل",
    "alt": [],
    "cat": "word"
  },
  "unhone amal kiye": {
    "ro": "unhone amal kiye",
    "ur": "عملوا",
    "en": "They did deeds",
    "ar": "عملوا",
    "alt": [],
    "cat": "word"
  },
  "to jab": {
    "ro": "to jab",
    "ur": "فاذا",
    "en": "So when",
    "ar": "فاذا",
    "alt": [],
    "cat": "word"
  },
  "bakhshne wala": {
    "ro": "bakhshne wala",
    "ur": "غفور",
    "en": "The oft-forgiving",
    "ar": "غفور",
    "alt": [],
    "cat": "word"
  },
  "tum jaante ho": {
    "ro": "tum jaante ho",
    "ur": "تعلمون",
    "en": "You know",
    "ar": "تعلمون",
    "alt": [],
    "cat": "word"
  },
  "qayamat ka din": {
    "ro": "qayamat ka din",
    "ur": "القیمه",
    "en": "The Resurrection",
    "ar": "القیمه",
    "alt": [],
    "cat": "word"
  },
  "dozakh": {
    "ro": "dozakh",
    "ur": "النار",
    "en": "The Fire / Hell",
    "ar": "النار",
    "alt": [],
    "cat": "word"
  },
  "ke liye se": {
    "ro": "ke liye se",
    "ur": "لمن",
    "en": "For from / of",
    "ar": "لمن",
    "alt": [],
    "cat": "word"
  },
  "to tehqeeq": {
    "ro": "to tehqeeq",
    "ur": "فقد",
    "en": "So indeed / already",
    "ar": "فقد",
    "alt": [],
    "cat": "word"
  },
  "allah se daro": {
    "ro": "allah se daro",
    "ur": "اتقوا",
    "en": "Fear Allah / Be mindful",
    "ar": "اتقوا",
    "alt": [],
    "cat": "word"
  },
  "taqwa ikhtiyar karo": {
    "ro": "taqwa ikhtiyar karo",
    "ur": "اتقوا",
    "en": "So fear allah / be mindful",
    "ar": "اتقوا",
    "alt": [],
    "cat": "word"
  },
  "to wo sab log": {
    "ro": "to wo sab log",
    "ur": "فهم",
    "en": "So they / them",
    "ar": "فهم",
    "alt": [],
    "cat": "word"
  },
  "yeh log": {
    "ro": "yeh log",
    "ur": "هؤلاء",
    "en": "These",
    "ar": "هؤلاء",
    "alt": [],
    "cat": "word"
  },
  "ke liye qawm": {
    "ro": "ke liye qawm",
    "ur": "لقوم",
    "en": "For people / tribe",
    "ar": "لقوم",
    "alt": [],
    "cat": "word"
  },
  "saath har ek": {
    "ro": "saath har ek",
    "ur": "بكل",
    "en": "In/With every / all",
    "ar": "بكل",
    "alt": [],
    "cat": "word"
  },
  "saath aayaat": {
    "ro": "saath aayaat",
    "ur": "بایت",
    "en": "In/With verses / signs",
    "ar": "بایت",
    "alt": [],
    "cat": "word"
  },
  "nishaniyan": {
    "ro": "nishaniyan",
    "ur": "بایت",
    "en": "In/With verses / signs",
    "ar": "بایت",
    "alt": [],
    "cat": "word"
  },
  "apni jaano par": {
    "ro": "apni jaano par",
    "ur": "انفسهم",
    "en": "Themselves",
    "ar": "انفسهم",
    "alt": [],
    "cat": "word"
  },
  "unhone zulm kiya": {
    "ro": "unhone zulm kiya",
    "ur": "ظلموا",
    "en": "They wronged / transgressed",
    "ar": "ظلموا",
    "alt": [],
    "cat": "word"
  },
  "unke dil": {
    "ro": "unke dil",
    "ur": "قلوبهم",
    "en": "Their hearts",
    "ar": "قلوبهم",
    "alt": [],
    "cat": "word"
  },
  "saath wo sab log": {
    "ro": "saath wo sab log",
    "ur": "بهم",
    "en": "In/With they / them",
    "ar": "بهم",
    "alt": [],
    "cat": "word"
  },
  "wo imaan laya": {
    "ro": "wo imaan laya",
    "ur": "امن",
    "en": "He believed",
    "ar": "امن",
    "alt": [],
    "cat": "word"
  },
  "bohot raham wala": {
    "ro": "bohot raham wala",
    "ur": "الرحیم",
    "en": "The Especially Merciful",
    "ar": "الرحیم",
    "alt": [],
    "cat": "word"
  },
  "ke liye aayaat": {
    "ro": "ke liye aayaat",
    "ur": "لایت",
    "en": "For verses / signs",
    "ar": "لایت",
    "alt": [],
    "cat": "word"
  },
  "unke paas aaya": {
    "ro": "unke paas aaya",
    "ur": "جاءهم",
    "en": "There came to them",
    "ar": "جاءهم",
    "alt": [],
    "cat": "word"
  },
  "to se": {
    "ro": "to se",
    "ur": "فمن",
    "en": "So from / of",
    "ar": "فمن",
    "alt": [],
    "cat": "word"
  },
  "aayaat": {
    "ro": "aayaat",
    "ur": "الایت",
    "en": "The verses / signs",
    "ar": "الایت",
    "alt": [],
    "cat": "word"
  },
  "to usne farmaya": {
    "ro": "to usne farmaya",
    "ur": "فقال",
    "en": "So he said",
    "ar": "فقال",
    "alt": [],
    "cat": "word"
  },
  "ghar wale": {
    "ro": "ghar wale",
    "ur": "اهل",
    "en": "People of / Family",
    "ar": "اهل",
    "alt": [],
    "cat": "word"
  },
  "ahle": {
    "ro": "ahle",
    "ur": "اهل",
    "en": "People of / Family",
    "ar": "اهل",
    "alt": [],
    "cat": "word"
  },
  "saath tum sab": {
    "ro": "saath tum sab",
    "ur": "بكم",
    "en": "In/With you (plural)",
    "ar": "بكم",
    "alt": [],
    "cat": "word"
  },
  "to hargiz nahi": {
    "ro": "to hargiz nahi",
    "ur": "فلن",
    "en": "So never / will not",
    "ar": "فلن",
    "alt": [],
    "cat": "word"
  },
  "saath aakhirat": {
    "ro": "saath aakhirat",
    "ur": "بالاخره",
    "en": "In/With the hereafter",
    "ar": "بالاخره",
    "alt": [],
    "cat": "word"
  },
  "nihayat meharban": {
    "ro": "nihayat meharban",
    "ur": "الرحمن",
    "en": "The Most Gracious",
    "ar": "الرحمن",
    "alt": [],
    "cat": "word"
  },
  "unhone taqwa apnaya": {
    "ro": "unhone taqwa apnaya",
    "ur": "اتقوا",
    "en": "They feared Allah / Were pious",
    "ar": "اتقوا",
    "alt": [],
    "cat": "word"
  },
  "baaz": {
    "ro": "baaz",
    "ur": "بعض",
    "en": "Some / Part",
    "ar": "بعض",
    "alt": [],
    "cat": "word"
  },
  "kuch": {
    "ro": "kuch",
    "ur": "بعض",
    "en": "Some / Part",
    "ar": "بعض",
    "alt": [],
    "cat": "word"
  },
  "to unhone kaha": {
    "ro": "to unhone kaha",
    "ur": "فقالوا",
    "en": "So they said",
    "ar": "فقالوا",
    "alt": [],
    "cat": "word"
  },
  "usne jaana": {
    "ro": "usne jaana",
    "ur": "علم",
    "en": "He knew",
    "ar": "علم",
    "alt": [],
    "cat": "word"
  },
  "jaise": {
    "ro": "jaise",
    "ur": "مثل",
    "en": "Like / Equal to",
    "ar": "مثل",
    "alt": [],
    "cat": "word"
  },
  "sawaab": {
    "ro": "sawaab",
    "ur": "اجر",
    "en": "A reward",
    "ar": "اجر",
    "alt": [],
    "cat": "word"
  },
  "ke liye har ek": {
    "ro": "ke liye har ek",
    "ur": "لكل",
    "en": "For every / all",
    "ar": "لكل",
    "alt": [],
    "cat": "word"
  },
  "saath beshak": {
    "ro": "saath beshak",
    "ur": "بان",
    "en": "In/With indeed / truly",
    "ar": "بان",
    "alt": [],
    "cat": "word"
  },
  "saath bura": {
    "ro": "saath bura",
    "ur": "بشر",
    "en": "In/With worse / evil",
    "ar": "بشر",
    "alt": [],
    "cat": "word"
  },
  "to agar": {
    "ro": "to agar",
    "ur": "فلو",
    "en": "So if / would that",
    "ar": "فلو",
    "alt": [],
    "cat": "word"
  },
  "saath yeh": {
    "ro": "saath yeh",
    "ur": "بهذا",
    "en": "In/With this (masculine)",
    "ar": "بهذا",
    "alt": [],
    "cat": "word"
  },
  "to allah se daro": {
    "ro": "to allah se daro",
    "ur": "فاتقوا",
    "en": "So fear allah / be mindful",
    "ar": "فاتقوا",
    "alt": [],
    "cat": "word"
  },
  "saath azaab": {
    "ro": "saath azaab",
    "ur": "بعذاب",
    "en": "In/With a punishment / torment",
    "ar": "بعذاب",
    "alt": [],
    "cat": "word"
  },
  "to main": {
    "ro": "to main",
    "ur": "فانا",
    "en": "So i",
    "ar": "فانا",
    "alt": [],
    "cat": "word"
  }
};

  // Build fast O(1) multi-way lookup indexes
  const ROMAN_INDEX = new Map();
  const ENGLISH_INDEX = new Map();
  const URDU_INDEX = new Map();
  const ARABIC_INDEX = new Map();

  for (const [key, entry] of Object.entries(LEXICON)) {
    // Index primary Roman Urdu key
    ROMAN_INDEX.set(key, entry);
    ROMAN_INDEX.set(key.replace(/[-_]/g, ''), entry);
    ROMAN_INDEX.set(key.replace(/[-_]/g, ' '), entry);

    // Index alternate Roman Urdu spellings
    if (Array.isArray(entry.alt)) {
      for (const alt of entry.alt) {
        const aClean = alt.toLowerCase().trim();
        if (aClean) {
          ROMAN_INDEX.set(aClean, entry);
          ROMAN_INDEX.set(aClean.replace(/[-_]/g, ''), entry);
          ROMAN_INDEX.set(aClean.replace(/[-_]/g, ' '), entry);
        }
      }
    }

    // Index English keywords
    if (entry.en) {
      const enTokens = entry.en.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
      for (const t of enTokens) {
        if (!ENGLISH_INDEX.has(t)) {
          ENGLISH_INDEX.set(t, []);
        }
        ENGLISH_INDEX.get(t).push(entry);
      }
    }

    // Index Urdu Nastaleeq script
    if (entry.ur) {
      const urClean = entry.ur.trim();
      URDU_INDEX.set(urClean, entry);
    }

    // Index Arabic script
    if (entry.ar) {
      const arClean = entry.ar.trim();
      ARABIC_INDEX.set(arClean, entry);
    }
  }

  // --- 2. ORTHOGRAPHY NORMALIZER ---
  function normalizeArabicUrdu(str) {
    if (!str) return '';
    return String(str)
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Diacritics
      .replace(/\u0640/g, '') // Tatweel
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // Alif variants -> ا
      .replace(/[\u06CC\u0649\u0626]/g, '\u064A') // Yeh variants -> ي
      .replace(/\u06A9/g, '\u0643') // Urdu Keheh -> Arabic Kaf
      .replace(/[\u06C1\u06C2\u0629]/g, '\u0647') // Urdu Goal Heh / Teh Marbuta -> ه
      .replace(/\u0624/g, '\u0648') // Waw with Hamza -> و
      .trim()
      .toLowerCase();
  }

  // Distinct language markers
  const ROMAN_URDU_MARKERS = new Set([
    'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'me', 'par', 'pe', 'ne', 'tak',
    'hai', 'hain', 'tha', 'thi', 'the', 'hoga', 'hogi', 'honge', 'raha', 'rahi', 'rahe',
    'kya', 'kyun', 'kyu', 'kaise', 'kese', 'kahan', 'kaha', 'kab', 'kon', 'kaun', 'kitna', 'kitni', 'kitne',
    'aur', 'bhi', 'toh', 'to', 'ya', 'magar', 'lekin', 'agar', 'jab', 'tab', 'phir', 'ab',
    'hum', 'tum', 'aap', 'woh', 'wo', 'yeh', 'ye', 'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'apna', 'apni', 'apne',
    'karo', 'karna', 'karein', 'kiya', 'karta', 'karti', 'karte', 'kaho', 'kehna', 'kaha', 'bolo', 'bolna', 'suno', 'sunna', 'dekho', 'dekhna',
    'sabr', 'namaz', 'roza', 'tauba', 'walidain', 'maa', 'baap', 'khuda', 'gunah', 'sawab',
    'jannat', 'jahannam', 'dozakh', 'rehmat', 'shaitan', 'farishta', 'aakhirat', 'qayamat',
    'duniya', 'rizq', 'dua', 'zikr', 'shukr', 'adab', 'akhlaq', 'zalim', 'zulm', 'shirk', 'kufr',
    'munafiq', 'taqwa', 'barzakh', 'qabar', 'mout', 'maut', 'deen', 'iman', 'islam', 'allah', 'rasool', 'nabi'
  ]);

  const ENGLISH_MARKERS = new Set([
    'the', 'is', 'are', 'am', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did',
    'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with', 'about', 'against', 'between', 'into', 'through',
    'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while', 'of',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'where', 'when', 'why', 'how',
    'patience', 'prayer', 'fasting', 'parents', 'mercy', 'forgiveness', 'paradise', 'hell',
    'prophet', 'angels', 'guidance', 'righteous', 'believers', 'disbelievers', 'command', 'manners',
    'verse', 'verses', 'chapter', 'god', 'lord', 'faith', 'religion', 'charity', 'pilgrimage', 'death'
  ]);

  // --- 3. CONTEXTUAL PHONETIC DIGRAPH TRANSLITERATOR ---
  function phoneticTransliterateWord(rawWord) {
    if (!rawWord) return '';
    let w = rawWord.toLowerCase().trim();

    // Multi-character digraph and vowel mappings
    const DIGRAPHS = [
      ['kh', 'خ'],
      ['gh', 'غ'],
      ['sh', 'ش'],
      ['ch', 'چ'],
      ['ph', 'پھ'],
      ['th', 'تھ'],
      ['dh', 'دھ'],
      ['jh', 'جھ'],
      ['bh', 'بھ'],
      ['rh', 'ڑھ'],
      ['zh', 'ژ'],
      ['aa', 'ا'],
      ['ee', 'ی'],
      ['oo', 'و'],
      ['ai', 'ے'],
      ['au', 'او']
    ];

    // Single consonant fallback
    const SINGLE_CONSONANTS = {
      'b': 'ب',
      'p': 'پ',
      't': 'ت',
      'j': 'ج',
      'c': 'ک',
      'd': 'د',
      'r': 'ر',
      'z': 'ز',
      's': 'س',
      'f': 'ف',
      'q': 'ق',
      'k': 'ک',
      'g': 'گ',
      'l': 'ل',
      'm': 'م',
      'n': 'ن',
      'w': 'و',
      'v': 'و',
      'h': 'ہ',
      'y': 'ی',
      'x': 'کس'
    };

    let out = '';
    let i = 0;

    // Check initial vowel
    if (w.startsWith('aa')) {
      out += 'آ';
      i = 2;
    } else if (w.startsWith('a')) {
      out += 'ا';
      i = 1;
    } else if (w.startsWith('i')) {
      out += 'اِ';
      i = 1;
    } else if (w.startsWith('u')) {
      out += 'اُ';
      i = 1;
    } else if (w.startsWith('o')) {
      out += 'او';
      i = 1;
    } else if (w.startsWith('e')) {
      out += 'اے';
      i = 1;
    }

    while (i < w.length) {
      let matched = false;

      // Check digraphs first
      for (const [digraph, urChar] of DIGRAPHS) {
        if (w.startsWith(digraph, i)) {
          out += urChar;
          i += digraph.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      const ch = w[i];
      const isTerminal = (i === w.length - 1);

      // Terminal heuristics
      if (isTerminal) {
        if (ch === 'a') {
          out += 'ہ';
          i++;
          continue;
        } else if (ch === 'i') {
          out += 'ی';
          i++;
          continue;
        } else if (ch === 'e') {
          out += 'ے';
          i++;
          continue;
        } else if (ch === 'o') {
          out += 'و';
          i++;
          continue;
        } else if (ch === 'n' && out.length > 0) {
          // Terminal noon after vowel -> noon ghunna
          const prev = out[out.length - 1];
          if (prev === 'ا' || prev === 'ی' || prev === 'ے' || prev === 'و') {
            out += 'ں';
            i++;
            continue;
          }
        }
      }

      // Medial vowels
      if (ch === 'a') {
        out += 'ا';
      } else if (ch === 'i') {
        out += 'ی';
      } else if (ch === 'u') {
        out += 'و';
      } else if (ch === 'e') {
        out += 'ے';
      } else if (ch === 'o') {
        out += 'و';
      } else if (SINGLE_CONSONANTS[ch]) {
        out += SINGLE_CONSONANTS[ch];
      } else {
        out += ch;
      }
      i++;
    }

    return out;
  }

  // --- 4. MASTER ROMAN URDU TRANSLATOR API ---
  const RomanUrduTranslator = {
    lexiconCount: 2660,

    /**
     * Detects input script/language: 'roman_urdu' | 'english' | 'urdu' | 'arabic'
     */
    detectLanguage(text) {
      if (!text || !text.trim()) return 'roman_urdu';
      const clean = text.trim();

      // Check for Arabic/Urdu unicode characters
      if (/[\u0600-\u06FF]/.test(clean)) {
        // Distinct Urdu characters: ٹ ڈ ڑ ں ے ھ چ پ گ ژ
        if (/[ٹڈڑںےھچپگژ]/.test(clean)) {
          return 'urdu';
        }
        // Common Urdu function words in native script
        const urduWords = ['کا', 'کی', 'کے', 'کو', 'سے', 'میں', 'پر', 'ہے', 'ہیں', 'تھا', 'تھی', 'تھے', 'اور', 'نہ', 'ہو', 'کیا', 'کون'];
        const tokens = clean.split(/\s+/);
        if (tokens.some(t => urduWords.includes(t))) {
          return 'urdu';
        }
        // Quranic vowel marks or Arabic specific features
        if (/[\u064B-\u065F\u0670]/.test(clean) || /^(ال|في|من|على|إلى|هذا|الذي)/.test(clean)) {
          return 'arabic';
        }
        return 'urdu';
      }

      // Latin / English keyboard text
      const words = clean.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 0);
      if (words.length === 0) return 'roman_urdu';

      let romanScore = 0;
      let englishScore = 0;

      for (const w of words) {
        if (ROMAN_URDU_MARKERS.has(w)) romanScore += 2.0;
        if (ENGLISH_MARKERS.has(w)) englishScore += 2.0;
        if (ROMAN_INDEX.has(w)) romanScore += 1.0;
        if (ENGLISH_INDEX.has(w)) englishScore += 0.8;
      }

      if (romanScore > englishScore) return 'roman_urdu';
      if (englishScore > romanScore) return 'english';

      // Disambiguation for single word or tie
      if (words.length === 1) {
        const single = words[0];
        if (ROMAN_URDU_MARKERS.has(single)) return 'roman_urdu';
        if (ENGLISH_MARKERS.has(single)) return 'english';
        if (ROMAN_INDEX.has(single) && !ENGLISH_INDEX.has(single)) return 'roman_urdu';
        if (ENGLISH_INDEX.has(single) && !ROMAN_INDEX.has(single)) return 'english';
        // Check characteristic Roman Urdu digraphs
        if (/(kh|gh|sh|ch|dh|jh|bh|aa|ee|oo)/.test(single)) return 'roman_urdu';
      }

      return 'roman_urdu';
    },

    /**
     * Looks up single word in curated lexicon
     */
    lookup(word) {
      if (!word) return null;
      const clean = word.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      return ROMAN_INDEX.get(clean) || null;
    },

    /**
     * Transliterates a single Roman Urdu word to authentic Urdu Nastaleeq
     */
    transliterateWord(word) {
      if (!word) return { urdu: '', english: '', arabic: '', confidence: 0, source: 'none' };
      const clean = word.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      const entry = ROMAN_INDEX.get(clean);
      if (entry) {
        return {
          urdu: entry.ur,
          english: entry.en,
          arabic: entry.ar || entry.ur,
          confidence: 1.0,
          source: 'lexicon'
        };
      }
      return {
        urdu: phoneticTransliterateWord(clean),
        english: '',
        arabic: '',
        confidence: 0.75,
        source: 'phonetic'
      };
    },

    /**
     * Transliterates a full Roman Urdu phrase/sentence into Urdu script
     */
    transliteratePhrase(phrase) {
      if (!phrase) return '';
      const tokens = phrase.trim().split(/(\s+|[^a-zA-Z0-9_-]+)/);
      return tokens.map(tok => {
        if (!tok || /^\s+$/.test(tok) || /^[^a-zA-Z0-9_-]+$/.test(tok)) {
          return tok;
        }
        return this.transliterateWord(tok).urdu;
      }).join('');
    },

    /**
     * Generates live smart transliteration chips & badges for the search bar UI
     */
    getSmartPills(query) {
      if (!query || !query.trim()) return null;
      const raw = query.trim();
      const lang = this.detectLanguage(raw);

      const pills = [];
      let detectedLangLabel = 'Roman Urdu';
      let urduScript = '';
      let englishConcept = '';
      let arabicTerm = '';
      const variants = new Set();

      if (lang === 'roman_urdu') {
        detectedLangLabel = 'Roman Urdu';
        pills.push({ type: 'lang', label: '🌐 Roman Urdu', text: 'roman_urdu' });

        // Transliterate full phrase
        urduScript = this.transliteratePhrase(raw);
        if (urduScript) {
          pills.push({ type: 'urdu', label: `✍️ اردو: ${urduScript}`, text: urduScript, value: urduScript });
          variants.add(urduScript);
        }

        // Extract concepts from matching words
        const words = raw.toLowerCase().split(/\s+/);
        for (const w of words) {
          const entry = this.lookup(w);
          if (entry) {
            if (!englishConcept && entry.en) englishConcept = entry.en.split('/')[0].trim();
            if (!arabicTerm && entry.ar) arabicTerm = entry.ar;
            variants.add(entry.ur);
            if (entry.ar) variants.add(entry.ar);
          }
        }

        if (englishConcept) {
          pills.push({ type: 'english', label: `🇬🇧 English: ${englishConcept}`, text: englishConcept, value: englishConcept });
        }
        if (arabicTerm && arabicTerm !== urduScript) {
          pills.push({ type: 'arabic', label: `📖 ${arabicTerm}`, text: arabicTerm, value: arabicTerm });
        }
      } else if (lang === 'english') {
        detectedLangLabel = 'English';
        pills.push({ type: 'lang', label: '🔤 English', text: 'english' });

        // Search reverse index for English concept
        const cleanTokens = raw.toLowerCase().split(/\s+/);
        let matchedEntry = null;
        for (const t of cleanTokens) {
          if (ENGLISH_INDEX.has(t)) {
            matchedEntry = ENGLISH_INDEX.get(t)[0];
            break;
          }
        }

        if (matchedEntry) {
          urduScript = matchedEntry.ur;
          arabicTerm = matchedEntry.ar;
          pills.push({ type: 'urdu', label: `✍️ اردو: ${matchedEntry.ur}`, text: matchedEntry.ur, value: matchedEntry.ur });
          pills.push({ type: 'roman', label: `🌐 Roman: ${matchedEntry.ro}`, text: matchedEntry.ro, value: matchedEntry.ro });
          if (matchedEntry.ar) {
            pills.push({ type: 'arabic', label: `📖 ${matchedEntry.ar}`, text: matchedEntry.ar, value: matchedEntry.ar });
          }
          variants.add(matchedEntry.ur);
          variants.add(matchedEntry.ro);
        }
      } else if (lang === 'urdu' || lang === 'arabic') {
        const isUr = (lang === 'urdu');
        detectedLangLabel = isUr ? 'Urdu Nastaleeq' : 'Sacred Arabic';
        pills.push({ type: 'lang', label: isUr ? '✍️ اردو' : '📖 العربية', text: lang });

        const entry = isUr ? URDU_INDEX.get(raw) : ARABIC_INDEX.get(raw);
        if (entry) {
          pills.push({ type: 'roman', label: `🌐 Roman: ${entry.ro}`, text: entry.ro, value: entry.ro });
          pills.push({ type: 'english', label: `🇬🇧 English: ${entry.en.split('/')[0].trim()}`, text: entry.en.split('/')[0].trim(), value: entry.en.split('/')[0].trim() });
          variants.add(entry.ro);
          variants.add(entry.ur);
        }
      }

      return {
        detectedLang: detectedLangLabel,
        langCode: lang,
        urduScript: urduScript || raw,
        englishConcept: englishConcept || '',
        arabicTerm: arabicTerm || '',
        pills,
        variants: Array.from(variants)
      };
    },

    /**
     * Cross-Lingual Search Query Expansion for BM25 Engine
     * Expands queries across Roman Urdu, authentic Urdu Nastaleeq, English concepts, and Arabic
     */
    expandSearchQuery(query) {
      if (!query || !query.trim()) return [];
      const raw = query.trim();
      const lang = this.detectLanguage(raw);
      const expanded = new Map(); // token -> weight

      const addToken = (tok, weight, srcLang) => {
        if (!tok) return;
        const clean = tok.toLowerCase().trim();
        if (clean.length > 1) {
          const curr = expanded.get(clean) || 0;
          if (weight > curr) {
            expanded.set(clean, weight);
          }
        }
      };

      // 1. Always retain original tokens at weight 1.0
      const rawTokens = raw.split(/\s+/);
      for (const t of rawTokens) {
        addToken(t, 1.0, lang);
      }

      // 2. Transliterate Roman Urdu to native Urdu script
      if (lang === 'roman_urdu') {
        const fullUrdu = this.transliteratePhrase(raw);
        if (fullUrdu) {
          addToken(fullUrdu, 1.0, 'urdu');
          for (const ut of fullUrdu.split(/\s+/)) {
            addToken(ut, 1.0, 'urdu');
          }
        }

        for (const w of rawTokens) {
          const entry = this.lookup(w);
          if (entry) {
            addToken(entry.ur, 1.0, 'urdu');
            if (entry.ar) addToken(entry.ar, 0.85, 'arabic');
            // English semantic keywords
            if (entry.en) {
              const enTokens = entry.en.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
              for (const et of enTokens) {
                addToken(et, 0.85, 'english');
              }
            }
          }
        }
      } else if (lang === 'english') {
        for (const w of rawTokens) {
          const entries = ENGLISH_INDEX.get(w);
          if (entries && entries.length) {
            for (const entry of entries.slice(0, 3)) {
              addToken(entry.ur, 1.0, 'urdu');
              addToken(entry.ro, 0.9, 'roman_urdu');
              if (entry.ar) addToken(entry.ar, 0.85, 'arabic');
            }
          }
        }
      } else if (lang === 'urdu' || lang === 'arabic') {
        const entry = (lang === 'urdu') ? URDU_INDEX.get(raw) : ARABIC_INDEX.get(raw);
        if (entry) {
          addToken(entry.ro, 1.0, 'roman_urdu');
          if (entry.en) {
            const enTokens = entry.en.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
            for (const et of enTokens) {
              addToken(et, 0.85, 'english');
            }
          }
        }
      }

      return Array.from(expanded.entries()).map(([term, weight]) => ({ term, weight }));
    }
  };

  // Expose global RomanUrduTranslator namespace
  global.RomanUrduTranslator = RomanUrduTranslator;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomanUrduTranslator;
  }

})(typeof window !== 'undefined' ? window : global);
