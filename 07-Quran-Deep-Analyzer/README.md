# 📖 Quran Deep Analyzer (Version 2.1)

An authoritative, multidimensional analytical system and zero-latency Progressive Web Application (PWA) for the Holy Quran as a complete text and book. Integrating classical Islamic hermeneutics (*Ulum al-Qur'an*), Arabic linguistics, morphology, syntax, rhetoric (*Balaghah*), thematic ontologies, and modern quantitative corpus linguistics. Designed under a **Royal Islamic Luxury & Linear-Grade Data Studio** visual architecture.

### 🌟 What's New in Version 2.1
* 🖥️ **High-Density Desktop Layout & Multi-Mode Dual Tarjuma Architecture**:
  * **Desktop Single-Row Smooth Navigation Ribbon**: Single-row 40px ribbon (`flex-wrap: nowrap; overflow-x: auto;`) with invisible scrollbar and native mouse-wheel delegation, reclaiming ~100px of vertical space previously eaten by 3 wrapping lines on 1080p monitors.
  * **3-Mode Dual Translation Architecture**:
    * **Mode 1: Desktop Split 2-Column Comparative Grid (`⊞ Split Grid`)**: Parallel comparative columns on desktop screens ($\ge 768\text{px}$), cutting translation vertical height by 55% and utilizing widescreen real estate constructively.
    * **Mode 2: Compact Stacked View (`☰ Stack`)**: Vertically stacked translations stripped of bulky meta-bars, with Nastaleeq line-height tightened to 1.65.
    * **Mode 3: Interactive In-Card Tabbed Switcher (`🗂️ Tabbed`)**: Instant 1-click in-card translation toggle (`[Kanzul Iman] | [Kanzul Irfan]`), maximizing screen capacity to 5+ verses.
  * **Screen Capacity Multiplier**: Slashes single-verse card height from 420px down to ~150px, allowing 3 to 5 full Ayah cards simultaneously on a 1080p desktop monitor without giant horizontal voids.
  * **Bi-Directional `<bdi dir="auto">` Text Isolation**: Eliminates text flipping and inverted word order for mixed Roman/Urdu input chips.
* 🎨 **Sacred Calligraphy & Waqf Symmetrical Centering Architecture**:
  * **Context-Aware Zero-Width Joiner (ZWJ) Ligature Healing**: Intelligent boundary engine in `js/tajweed-engine.js` injecting `\u200D` across inline Tajweed spans, guaranteeing 100% continuous cursive Arabic calligraphy without disjointed glyph fractures (`خَلَوْا`, `قَالُوْۤا`, `آمَنَّا`, `شَیٰطِیْنِهِمْ`, `إِنَّا`, `إِنَّمَا` fully joined).
  * **Symmetrical Waqf Optical Centering**: Counterbalances `Al_Mushaf.ttf` font ink offset physics with balanced optical margins (`margin: 0 0.60em 0 0.40em;`), guaranteeing zero collision with preceding words and zero desert gap before subsequent words.
  * **Optical Vertical Midline Alignment (-0.52em)**: Repositions inline waqf marks from `-0.30em` down to `-0.52em`, placing pause symbols in the exact optical midline of the text stream.
  * **Rasterizer Continuity**: Eliminated disruptive `text-shadow` from inline Tajweed spans, preventing browser layer-splitting during HarfBuzz OpenType font shaping.
* 📖 **100% Quranic-Grounded Tarjuma Search & Sacred Calligraphy Preservation**: Linguistic intelligence strictly grounded in the authentic text of *Kanzul Iman* (6,236 Ayat, 6,405 unique words). Replaces generic dictionary synonyms with authentic Quranic phrases and verified Ayah counts ([ ✍️ تمہاری عورتیں (3 Ayat) ], [ ✍️ اپنی عورتوں (4 Ayat) ], [ ✍️ ماں باپ (24 Ayat) ]). Features consonant skeleton typo tolerance (	umari aurtein $	o$ تمہاری عورتیں), $+300.0$ Exact Tarjuma Multi-Word Phrase Boost elevating Surah Al-Baqarah 2:223 straight to **Rank #1**, two-tier result sections (🎯 Best Match / Exact Tarjuma + 💡 Related & Similar Verses), and 100% preservation of vocalized Arabic calligraphy with full Zabar, Zer, Pesh, and circular Ayah stop rosettes (۝ [num]).
* 🌐 **Roman Urdu & English AI Translator & Cross-Lingual Search Studio**: Zero-latency linguistic intelligence layer (`js/roman-urdu-translator.js`) with 2,718 curated Islamic lexicon entries, English stop-word immunity (`the`, `and`, `for`, `with` never mapped to Satan or polluting expansions), canonical multi-word phrase indexing (`the straight path`, `the believers`, `day of judgment`), cross-lingual Quranic inflection expansion (`roza` $\to$ `روزے`, `روزوں` raising Surah 2:183 into top 3; `namaz` $\to$ `نمازیں`; `muslim` $\to$ `مسلمانوں`), contextual phonetic digraph rules (`kh`, `gh`, `sh`, `ch`, `th`, `ph`, `dh`, `jh`), precise homophone disambiguation (`sabr` $\to$ `صبر`, `sawab` $\to$ `ثواب`, `zalim` $\to$ `ظالم`, `tauba` $\to$ `توبہ`, `walidain` $\to$ `والدین`), auto-language detection, XSS-safe Cyber-Glass Transliteration Bar with 1-tap Smart Pills ($\ge 44\text{px}$ touch targets), and cross-lingual BM25 query expansion simultaneously matching Kanzul Iman Urdu, Saheeh International English, and Sacred Arabic.
* 🎙️ **Sacred Audio & Tartil Companion**: Multi-Qari EveryAyah CDN streaming (Mishary Alafasy, Mahmoud Khalil Al-Husary, Abdul Basit), repeat loop controls (`1x`, `3x`, `5x`, `continuous` for Hifz memorization), speed multipliers (`0.75x`, `1.0x`, `1.25x`), and active Ayah emerald wave highlighting & auto-scroll.
* 📱 **Mobile-First UX Overhaul & 100% English Navigation Mandate**:
  * **Ultra-Slim Touch Ribbon**: 42px single-row horizontal touch-scrolling navigation ribbon replacing the bulky 280px grid, freeing $> 85\%$ vertical screen real estate.
  * **Top-Bar Portal Safe-Area Offset**: Enforces `padding-left: 88px !important;` on `.app-branding`, ensuring complete zero-overlap optical clearance for the floating portal `← Hub` button.
  * **Symmetrical 5-Column English Command Dock**: 100% English labels (`Read`, `Search`, `Commands`, `Manners`, `Analytics`) on a strict LTR 5-column CSS Grid (`grid-template-columns: repeat(5, 1fr)`).
  * **Docked Zero-Obstruction Audio Bar**: Audio companion bar stays hidden during idle states, docking cleanly above the bottom navigation dock during playback with a tactile 1-tap dismiss button.
* 📚 **Dual-Tarjuma Cross-Lingual BM25 Architecture (*Kanzul Iman* + *Kanzul Irfan*)**:
  * **Full 6,236 Ayat Dual-Corpus Indexing**: Precompiled into `data/quran_ayat_search_bundle.js` with 9-element schema indexing both Ala Hazrat's *Kanzul Iman* and Mufti Qasim Qadri's *Kanzul Irfan*.
  * **Interactive Dual-Tarjuma Selector Strip**: Instant 3-way toggle (`Both Translations` | `Kanzul Iman` | `Kanzul Irfan`) with gold/cyan cyber-glass source badges (`[Kanzul Iman]`, `[Kanzul Irfan]`) and scholar attribution subtitles.
  * **Exact Multi-Word Tarjuma BM25 Boost**: $+300.0$ boost elevating exact phrase matches (e.g. `tumhari auratein` $	o$ Surah Al-Baqarah 2:223) straight to Rank #1 with tiered sections.
* ⚡ **Search Lag Elimination & Multi-Threaded Web Worker**:
  * **Ingestion Pre-Normalization**: Document fields (`imanNorm`, `irfanNorm`, `arNorm`, `subLower`, `titLower`, `contLower`) are precomputed at startup, eliminating $> 37,000$ runtime string normalization calls and slashing BM25 execution from ~365ms down to $< 15	ext{ms}$.
  * **Dedicated Search Web Worker (`js/search-worker.js`)**: Background thread search calculation preventing main-thread freezing and guaranteeing silky 60–120 FPS keyboard typing.
  * **50ms Transliteration Micro-Debounce & Memoization**: Instant 0ms cache hits for repeated keystrokes in the Smart Pills bar.
* 📲 **Standalone Mobile Progressive Web App (PWA)**:
  * **0ms Cache-First Launch**: Service Worker (`sw.js`) pre-caching 100% of the UI shell, fonts, and the 6,236 Ayat data bundle (`data/quran_ayat_search_bundle.js`).
  * **Web App Manifest (`manifest.json`)**: Home-screen installability with Royal Islamic emerald & gold icons (`icons/icon-192.png`, `icons/icon-512.png`, `icons/icon.svg`).
  * **Storage-Friendly Recitations**: Audio recitations stream on-demand to protect device storage.
* 🎨 **Dynamic Phonological Tajweed Rule Calligraphy**: Dynamic phonological parser color-coding Ghunnah (`#10b981`), Qalqalah (`#38bdf8`), Madd (`#f43f5e`), Ikhfa (`#2dd4bf`), Idgham (`#c084fc`), and Iqlab (`#f59e0b`) with an interactive educational legend bar and zero-DOM-rebuild instant toggling.
* ⚖️ **Comparative Multi-Translation & Tafsir Studio**: Side-by-side comparative split drawer on Ayah cards (*Kanzul Iman* alongside *Kanzul Irfan* and *Saheeh International* / *Pickthall*).
* 📝 **Personal Research Notebook & Tadabbur Studio**: Dedicated 10th tab for thematic research folders, reflection notes attached to any Ayah, tagging, and 1-click Markdown/JSON dossier export.

---

## 🎯 1. Project Purpose & Executive Overview

Rather than a superficial reading or listening application, **Quran Deep Analyzer** serves as a comprehensive scholarly and computational laboratory. Built upon verified canonical datasets from Tanzil, Kais Dukes' Quranic Arabic Corpus (University of Leeds), and the authentic 234 MB local `QuranDB.db`, this suite provides:

* **Executive Single-Row KPI Ribbon**: Instant overview of **82,480 total word tokens**, **20,105 unique surface words**, **1,642 triliteral/quadrilateral roots**, **4,832 dictionary lemmas**, **6,236 canonical Ayat**, and **114 Surahs**, locked into a single balanced 6-column line on desktop with an instant collapse toggle `[ − / + ]` and auto-collapse on deep reading tabs.
* **Word Frequency with Bilingual Meanings**: Every word rank features prominent **28px calligraphic Arabic** alongside a dedicated **Meaning column** providing both **English translation** and **Roman Urdu meaning** (e.g., `He said • Usne farmaya / Kaha`), with Corpus % mini progress bars.
* **Full-Width Spotlight Search**: Keyboard shortcut (`/`) command search that filters instantaneously across Arabic text, roots, English meanings, and Roman Urdu keywords.
* **Analytics Studio (PRO)**:
  * **26 Prophetic Cards with Precision Disambiguation**: Muhammad (مُحَمَّد) (4 mentions: 3:144, 33:40, 47:2, 48:29) and Ahmad (أَحْمَد) (1 mention: 61:6) cleanly separated with dual analytical metrics (**Word Tokens vs Unique Verses**: Musa: 136w • 131v, Ibrahim: 69w • 63v, Nuh: 43w • 43v...).
  * **Computationally Verified Scientific & Numerical Discoveries**:
    * **Iron (Al-Hadid)**: Abjad gematria of *Hadid* = 26 (Atomic # of Iron), *Al-Hadid* = 57 (Surah 57 & isotope Fe-57), mentioned in Ayah 25 (26th verse counting Bismillah).
    * **Water vs Land Earth Surface Ratio**: Sea (*Al-Bahr*, 32) vs Dry Land (*Al-Barr* + *Al-Yabas*, 13). Total 45 mentions $\to$ 71.11% Water vs 28.89% Land, mirroring planetary satellite measurements.
    * **Cosmic Calendar Symmetry**: Singular *Yawm* (Day) = 365 times (solar year), singular *Shahr* (Month) = 12 times (lunar year), plural *Ayyam* = 30 times (month days).
    * **Light vs Darkness**: *Al-Nur* is always singular (43 occurrences), *Al-Zulumat* is always plural (23 contrasting verses).
  * **Sacred Geography & Holy Cities**: 18 mapped locations including Makkah, Bakkah, Yathrib, Al-Madinah, Misr, Babil, Iram, Saba', Mount Judi, Al-Ahqaf, Badr, Hunayn, Safa & Marwah, Arafat, Tur Sina, and Tuwa.
  * **Historical Nations & Tribes**: 'Ad, Thamud, Madyan, Bani Isra'il, Quraysh, Al-Rum, Yajuj & Majuj, Qawm Tubba', Ashab al-Kahf, Ashab al-Rass, Ashab al-Ayka, and Ashab al-Ukhdud.
  * **Key Figures & Adversaries**: Maryam (31 mentions — only named woman), Fir'awn (74 mentions — most mentioned adversary), Iblis, Haman, Qarun, Al-Samiri, Jibril, Mika'il, Malik, Harut & Marut, Luqman, Talut, Jalut, and Zayd (only named Companion).
  * **21 Celebrated Semantic Pairs & Rhetorical Tibaq**: Authentic mathematical symmetries and verified discoveries with direct mapping of **Tibaq verses** and insight cards.
  * **23-Year Chronological Stylometrics**: Pure procedural SVG timeline charting the Average Verse Length (words/ayah) across the 114 revelation order points, classified into Early Makki, Middle Makki, Late Makki, and Madani epochs.
  * **Divine Names Closing Matrix (*Fawasil*)**: Mapped paired attributes concluding Quranic verses (*Azizun Hakim*, *Ghafurun Rahim*, *Alimun Hakim*...).
* **Deep Ayah Analyzer with Luxury Cyber-Glass Pickers & Density Controls**:
  * **Midnight Cyber-Glass Modal Pickers**: Replaced native browser `<select>` dropdowns with responsive modal sheets featuring fuzzy search, Makki/Madani filter tabs, and metadata cards.
  * **Interactive Dynamic Font Scaler**: Persistent `A-` / `A` / `A+` controls dynamically scaling Arabic (`2.45rem`, line-height `2.4`) and Urdu Nastaleeq (`1.95rem`, line-height `2.4`) text.
  * **Floating Action Return Pill (`#floating-return-pill`)**: Omnipresent floating return button (`position: fixed; bottom: 24px; right: 24px; z-index: 9999`) ensuring instantaneous 1-click return from any Ayah back to the exact origin tab and modal scroll position.
