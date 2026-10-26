# 📖 Quran Deep Analyzer: Comprehensive User Manual & Feature Guide

An authoritative, comprehensive handbook for navigating and mastering the **Quran Deep Analyzer (Version 2.0)** — a multidimensional computational laboratory, analytical corpus engine, and zero-latency Progressive Web Application (PWA) for the Holy Quran.

---

## 📑 Table of Contents

1. [Executive Overview & Quick Start](#1-executive-overview--quick-start)
2. [Design Architecture & Ayah Stop Medallions](#2-design-architecture--ayah-stop-medallions)
3. [The Definitive Guide to Best Urdu Fonts](#3-the-definitive-guide-to-best-urdu-fonts)
4. [Deep Ayah Analyzer & Scripture Reading Studio](#4-deep-ayah-analyzer--scripture-reading-studio)
5. [AI Search Studio & Gemini Flash RAG Synthesizer](#5-ai-search-studio--gemini-flash-rag-synthesizer)
6. [Analytics Studio (PRO) & Scientific Discoveries](#6-analytics-studio-pro--scientific-discoveries)
7. [Thematic Knowledge Graph & Dual Concordance](#7-thematic-knowledge-graph--dual-concordance)
8. [Morphological Root & Lemma Explorer (علم الصرف)](#8-morphological-root--lemma-explorer-علم-الصرف)
9. [Word Frequency Studio & Bilingual Vocabulary](#9-word-frequency-studio--bilingual-vocabulary)
10. [Mutashabihat (Parallel & Similar Verses) Studio](#10-mutashabihat-parallel--similar-verses-studio)
11. [Waqf & Phonetic Stopping Science](#11-waqf--phonetic-stopping-science)
12. [Executive Studios: Divine Commands & Quranic Manners](#12-executive-studios-divine-commands--quranic-manners)
13. [Personal Research Notebook & Tadabbur Studio](#13-personal-research-notebook--tadabbur-studio)
14. [Keyboard Shortcuts & Pro-Tips](#14-keyboard-shortcuts--pro-tips)
15. [Offline Architecture & Zero-CORS Durability](#15-offline-architecture--zero-cors-durability)

---

## 🚀 1. Executive Overview & Quick Start

**Quran Deep Analyzer** is designed not merely for casual recitation, but as a computational and scholarly laboratory combining classical Islamic sciences (*Ulum al-Qur'an*, *Tafsir*, *Tajweed*, *Ilm al-Sarf*) with modern quantitative corpus linguistics and AI semantic retrieval.

### Launching the Application
- **Direct Local File (Zero Installation)**: Double-click or open [index.html](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-Quran-Deep-Analyzer/index.html) in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).
- **Live 24/7 Web Portal**: Accessible anywhere via the hosted cloud portal at `https://hamidgazi.github.io/app-portal/`.
- **Zero-CORS Offline Durability**: All 114 Surahs, 6,236 Ayat, morphological trees, and topic graphs are bundled into standalone, asynchronous JavaScript data bundles. You can run the entire system directly under the `file:///` protocol with **no local web server, no Node.js daemon, and no internet connection required**.

### Key Statistical Telemetry
Upon launching, the **Executive Single-Row KPI Ribbon** displays live metrics across the entire sacred text:
* **82,480** Total Word Tokens
* **20,105** Unique Surface Words
* **1,642** Triliteral & Quadrilateral Roots
* **4,832** Lexical Lemmas
* **6,236** Canonical Ayat
* **114** Surahs (87 Makki, 27 Madani)
* **30** Paras (Juz) with exact boundary calculations

---

## 🎨 2. Design Architecture & Ayah Stop Medallions

The user interface follows a **Midnight Cyber-Glass & Royal Islamic Luxury** design system, combining deep slate backgrounds (`#0a0f1d`, `#0f172a`), emerald accents (`#10b981`), and warm antique gold strokes (`#d4af37`, `#fbbf24`).

### Redesigned Ayah Stop Medallions (۝ [Number])
In earlier iterations, the Ayah stop marker suffered from a distracting "double circle" visual defect: an outer CSS border with a neon yellow glow combined with an inner `۝` (U+06DD End of Ayah) circle rosette glyph, resulting in an overly large (`2.15em` / ~60px) bullseye that pulled the reader's eye away from the sacred scripture.

The redesigned Ayah Stop Medallion provides:
1. **Single Delicate Ring**: The visual duplicate rosette glyph is cleanly suppressed, leaving a single, mathematically centered circular medallion.
2. **Proportional Harmony (`1.28em`)**: Scaled down by over 40% to match the baseline x-height of classical calligraphy. It rests gracefully alongside the text without expanding line heights.
3. **Muted Antique Gold Aesthetic**: Rendered with a hairline border (`1px solid rgba(212, 175, 55, 0.45)`) and a subtle translucent glow (`rgba(212, 175, 55, 0.08)`), placing the primary visual emphasis where it belongs: on the Holy Quranic words.
4. **Interactive Waqf Guidance**: Clicking any Ayah stop medallion triggers an instant **Trilingual Waqf Popover** explaining the phonetic pause rule (*Waqf Tam / Absolute Stop*) in Urdu, Roman Urdu, and English.

---

## 🖋️ 3. The Definitive Guide to Best Urdu Fonts

Urdu typography requires specialized handling because the language is traditionally rendered in the intricate, flowing **Nastaliq (نستعلیق)** script with sloping baselines and complex vertical ligatures, whereas digital screens often favor the horizontal, linear clarity of **Naskh (نسخ)**.

Quran Deep Analyzer incorporates a **Dual-Font Switcher** in all Display Settings modals (`Nastaleeq` vs `Naskh`), persisting your choice in `localStorage`.

### Top 10 Urdu Fonts: Ranked for Readability & Beauty

| Rank | Font&nbsp;Name | Script&nbsp;Style | Best&nbsp;Use&nbsp;Case | Web/Mobile&nbsp;Score | Readability & Aesthetic Notes |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | **Jameel&nbsp;Noori&nbsp;Nastaleeq** | Classic&nbsp;Nastaliq | Formal literature, Quranic translations, desktop reading | ⭐⭐⭐⭐⭐&nbsp;(9.8/10) | The gold standard of Urdu publishing. Based on the celebrated Noori Nastaleeq ligatures. Unequalled calligraphic beauty, authentic cascading baselines, and emotional resonance for South Asian readers. Pre-bundled locally in the app. |
| **2** | **Noto&nbsp;Nastaliq&nbsp;Urdu** | Modern&nbsp;Nastaliq | Web apps, mobile devices, responsive UI | ⭐⭐⭐⭐⭐&nbsp;(9.7/10) | Engineered by Google Fonts for digital screens. Solves clipping and line-height ballooning common in older Nastaliq fonts. Crisp at smaller sizes (`1.2rem–1.6rem`) with flawless cross-platform rendering across Android, iOS, Windows, and macOS. |
| **3** | **Mehr&nbsp;Nastaliq&nbsp;Web** | Web&nbsp;Nastaliq | Fast website loading, high-speed reading | ⭐⭐⭐⭐⭐&nbsp;(9.5/10) | Developed by the Center for Language Engineering (CLE). Optimized specifically for web typography with reduced OTF file weight and exceptional kerning between adjacent words. Highly recommended for web developers. |
| **4** | **Gulzar** | Modern&nbsp;Nasta'liq | Editorial design, digital publishing | ⭐⭐⭐⭐½&nbsp;(9.3/10) | Created by DecoType and Google Fonts. A groundbreaking variable font engineered specifically for modern OpenType font engines. Extremely sharp rendering on high-DPI Retina screens. |
| **5** | **Faiz&nbsp;Lahori&nbsp;Nastaliq** | Artistic&nbsp;Nastaliq | Classical poetry, formal certificates | ⭐⭐⭐⭐&nbsp;(9.0/10) | Modeled after the classical Lahori calligraphic tradition of Syed Nafees Shah. Highly ornamental with sweeping letter extensions (*kashida*). Best suited for headings and classical prose. |
| **6** | **Noto&nbsp;Sans&nbsp;Arabic** | Modern&nbsp;Naskh&nbsp;/&nbsp;Sans | Rapid mobile scanning, search results, dense lists | ⭐⭐⭐⭐⭐&nbsp;(9.6/10) | Clean, geometric, linear horizontal baseline. Because letters do not stack vertically, it eliminates any risk of line-height overlap. Exceptional legibility on small phone screens and compact UI cards. |
| **7** | **Urdu&nbsp;Typesetting** | Digital&nbsp;Naskh | Windows desktop UI, clear reading | ⭐⭐⭐⭐½&nbsp;(9.2/10) | Pre-installed across modern Microsoft Windows systems. Engineered specifically for ClearType sub-pixel font rendering with balanced counters and clear diacritical markings. |
| **8** | **Amiri** | Classical&nbsp;Naskh | Bilingual Arabic-Urdu scholarly notes | ⭐⭐⭐⭐½&nbsp;(9.1/10) | A revival of the famous Bulaq Press typeface from Cairo. Elegant, dignified, with wide open counters. Ideal when Arabic scripture and Urdu commentary appear in close proximity. |
| **9** | **Dubai** | Humanist&nbsp;Sans | Modern app interfaces, navigation | ⭐⭐⭐⭐&nbsp;(8.9/10) | Commissioned by the Dubai government and designed by Monotype. Crisp, modern sans-serif aesthetic with balanced proportions across Latin and Arabic-script characters. |
| **10** | **Alvi&nbsp;Nastaleeq** | Compact&nbsp;Nastaliq | Books, long-form PDF publishing | ⭐⭐⭐⭐&nbsp;(8.8/10) | Compact ligature set with tighter vertical baselines than Jameel Noori. Great for reducing page count in printed publications. |

### How to Toggle Fonts in Quran Deep Analyzer
1. Open the **Display Settings** cog `⚙️` in the top navigation or on Ayah cards.
2. Under **Urdu Typography**, choose:
   - **🖋️ Nastaleeq (Default)**: Activates *Jameel Noori Nastaleeq* with graceful cascading ligatures.
   - **📖 Modern Naskh**: Activates *Noto Sans Arabic / Urdu Typesetting* with a linear horizontal baseline for ultra-compact reading.

---

## 📖 4. Deep Ayah Analyzer & Scripture Reading Studio

The **Ayah Analyzer (`#tab-reader`)** is the primary scripture study environment.

### 1. Surah & Para Modal Pickers
- Click the **Surah Picker Button** to open the luxury **Midnight Cyber-Glass Surah Selector**.
  - Instant fuzzy search across Surah numbers, Arabic names (`الفاتحة`), English names (`The Opening`), and transliterations.
  - Quick filter tabs for **All (114)**, **Makki (87)**, and **Madani (27)**.
- Click the **Para (Juz) Selector** to jump across any of the 30 canonical Quranic Paras with exact boundary verse ranges.

### 2. Dynamic Phonological Tajweed Calligraphy
Toggle the **🎨 Tajweed** button in the reading header to instantly colorize the sacred Arabic text without reloading the page:
- **Ghunnah (Green `#10b981`)**: Nasalized pronunciation on doubled Noon/Meem (*Noon Mushaddadah*).
- **Qalqalah (Sky Blue `#38bdf8`)**: Resonant echoing on the five letters of bouncing (*Qaf, Ta, Ba, Jeem, Dal* — ق ط ب ج د).
- **Madd (Rose/Coral `#f43f5e`)**: Prolongation rules (*Madd Lazim, Madd Muttasil, Madd Munfasil*).
- **Ikhfa (Teal `#2dd4bf`)**: Concealment of Noon Sakinah or Tanween.
- **Idgham (Purple `#c084fc`)**: Assimilation/merging of letters.
- **Iqlab (Amber `#f59e0b`)**: Conversion of Noon Sakinah/Tanween into Meem before the letter Ba.

An interactive **Tajweed Legend Bar** appears directly above the text; clicking any rule displays an instant tooltip explaining its articulation and duration.

### 3. Sacred Audio Tartil Companion (Multi-Qari Streaming)
Click the **▶ Tartil** button on any Ayah card or in the persistent audio dock:
- **Select Reciters**: Choose from world-renowned Qaris:
  - *Mishary Rashid Alafasy*
  - *Mahmoud Khalil Al-Husary* (Ideal for Tajweed learning and slow recitation)
  - *Abdul Basit Abdul Samad* (Murattal)
- **Hifz Memorization Repeat Loops**: Set verses to repeat `1x`, `3x`, `5x`, or `Continuous` loop.
- **Playback Speed**: Adjust speed multipliers (`0.75x`, `1.0x`, `1.25x`).
- **Live Active Verse Wave Highlighting**: The currently playing Ayah is highlighted with an animated emerald audio border and smoothly auto-scrolls into the center of the viewport.

### 4. Comparative Multi-Translation Split Drawer
Click the **⚖️ موازنہ (Compare)** button on any Ayah to slide open the side-by-side comparative translation panel:
- **Kanzul Iman** (Imam Ahmad Raza Khan — celebrated Urdu translation noted for theological precision and reverence).
- **Kanzul Irfan** (Mufti Muhammad Qasim Attari — accessible, contemporary Urdu translation).
- **Saheeh International** (Modern, clear English translation).
- **Pickthall** (Classic literary English translation).

### 5. Classical Sirat-ul-Jinan Tafsir
Click the **📖 Tafsir** button on any Ayah to open the authoritative **Tafsir Sirat-ul-Jinan**:
- 100% sanitized: all legacy Word/MSO formatting artifacts have been scrubbed for pure, readable typography.
- Provides verse revelation background (*Asbab al-Nuzul*), exegetical cross-references, and spiritual injunctions.

### 6. Edge QuickScrubber (120 FPS Edge Slider)
- Along the right-hand edge of your screen sits the floating **QuickScrubber**.
- Dragging your finger or mouse cursor up and down slides through all Ayat of the Surah at 120 FPS with a live floating preview pill showing the verse number and Arabic excerpt.
- Tap the scrubber pill once to open the **Direct Numeric Ayah Jumper Modal** to type an exact verse number.

### 7. Floating Action Return Pill (`#floating-return-pill`)
When jumping into Ayah Analyzer from another tab (such as Search Studio, Analytics, or Root Explorer), a floating glass button labeled **↩ Return to [Previous Tab]** automatically appears in the bottom right corner (`z-index: 9999`). Clicking it returns you immediately to your exact previous tab and scroll position.

---

## 🔍 5. AI Search Studio & Gemini Flash RAG Synthesizer

Open via keyboard shortcut (`Ctrl+K` or `/`) or click the **🔍 Search** tab.

### Sub-Millisecond Probabilistic BM25 Search
The engine indexes all **6,236 Ayat**, **114 Surahs**, **30 Paras**, **26 Prophets**, **484 Matalib themes**, **3,513 Sirat topics**, and **1,642 Roots** using the **Okapi BM25** ranking algorithm ($k_1=1.2, b=0.75$, title boost $3.0\times$).
- **Multi-Lingual Queries**: Search simultaneously in Arabic, Urdu, English, or Roman Urdu (e.g., `straight path`, `سیدھا راستہ`, `sirat al-mustaqim`).
- **Levenshtein Fuzzy Typo-Tolerance**: Automatically recovers from misspellings (`kaff` $\to$ `Al-Kahf`, `musaa` $\to$ `Musa`, `favour` $\leftrightarrow$ `favor`).
- **Whole-Word Token Boundary Matching**: Prevents false positive substring matches across English, Arabic, and Urdu.
- **Islamic Semantic Synonym Graph**: Resolves cross-lingual Islamic concepts (`namaz` $\leftrightarrow$ `salah` $\leftrightarrow$ `نماز`, `roza` $\leftrightarrow$ `fasting` $\leftrightarrow$ `روزہ`).

### Progressive Gemini Flash RAG AI Synthesizer
- Type any conceptual question (e.g., *"What does the Quran say about honoring parents?"* or *"Describe the qualities of the righteous"*).
- Press **`Ctrl+Enter`** or click **✨ Ask AI**.
- Powered by Google's high-speed **Gemini 1.5 Flash**, the system retrieves relevant verses via BM25, injects them into a reverent prompt context, and synthesizes a concise, reverent answer.
- Every claim includes **interactive scripture citation pills** (e.g., `[Surah 17:23]`). Clicking any citation pill immediately opens that exact Ayah in the Analyzer.
- **Local Key Storage**: Click the settings cog `⚙️` to enter your own free Gemini API key, stored privately in your browser's `localStorage`.

---

## 📊 6. Analytics Studio (PRO) & Scientific Discoveries

The **Analytics Studio (`#tab-analytics`)** provides computational breakdowns of Quranic structural phenomena:

### 1. 26 Prophetic Cards with Disambiguation
- Disambiguates **Muhammad (مُحَمَّد)** (4 mentions: 3:144, 33:40, 47:2, 48:29) from **Ahmad (أَحْمَد)** (1 mention: 61:6).
- Dual analytical metrics for every Prophet: **Word Tokens count vs Unique Verses count** (e.g., Musa: 136 tokens across 131 verses; Ibrahim: 69 tokens across 63 verses).

### 2. Computationally Verified Scientific & Numerical Discoveries
- **Iron (Al-Hadid)**: The Abjad gematria of *Hadid* is 26, matching the atomic number of Iron ($Fe$). The gematria of *Al-Hadid* is 57, corresponding to Surah 57 and its stable isotope $Fe^{57}$. It is mentioned in Ayah 25 (the 26th verse counting Bismillah).
- **Water vs Land Surface Ratio**: Sea (*Al-Bahr*, 32 mentions) vs Dry Land (*Al-Barr* + *Al-Yabas*, 13 mentions). Total = 45 mentions $\to$ **71.11% Water vs 28.89% Land**, closely reflecting modern satellite geodetic measurements.
- **Cosmic Calendar Symmetry**: Singular *Yawm* (Day) appears exactly 365 times (the solar year). Singular *Shahr* (Month) appears exactly 12 times (the lunar year). Plural *Ayyam* appears 30 times (the days of a month).
- **Light vs Darkness**: *Al-Nur* (Light) is always singular (43 occurrences), while *Al-Zulumat* (Darkness) is always plural (23 contrasting verses).

### 3. Sacred Geography & Historical Civilizations
- **18 Sacred Geography Locations**: Makkah, Bakkah, Yathrib, Al-Madinah, Misr, Babil, Iram, Saba', Mount Judi, Al-Ahqaf, Badr, Hunayn, Safa & Marwah, Arafat, Tur Sina, and Tuwa.
- **12 Historical Civilizations**: 'Ad, Thamud, Madyan, Bani Isra'il, Quraysh, Al-Rum, Yajuj & Majuj, Qawm Tubba', Ashab al-Kahf, Ashab al-Rass, Ashab al-Ayka, and Ashab al-Ukhdud.

### 4. 21 Celebrated Semantic Pairs & Rhetorical Tibaq
- Displays verified 1:1 mathematical balances (e.g., *Al-Dunya* vs *Al-Akhirah*, *Al-Mala'ikah* vs *Al-Shayatin*, *Al-Hayat* vs *Al-Mawt*) alongside direct citations to **Tibaq verses** where both antonyms occur within the exact same verse.

### 5. 23-Year Chronological Stylometrics SVG Timeline
- Visualizes average verse length across the 114 revelation order points, color-coded into Early Makki, Middle Makki, Late Makki, and Madani epochs.

---

## 🕸️ 7. Thematic Knowledge Graph & Dual Concordance

Explore the Quran thematically via **`#tab-thematic`**:

### Mode 1: Matalib al-Quran (484 Canonical Themes)
- High-level theological and ontological taxonomy: Divine Oneness (*Tawhid*), Prophethood (*Risalah*), Eschatology (*Akhirah*), Ethics (*Akhlaq*), and Jurisprudence (*Ahkam*).
- Sequential `#1..#N` gold topic numbering with direct scripture cross-references.

### Mode 2: Sirat-ul-Jinan Exegetical Concordance (3,513 Topics)
- Granular, detailed topics extracted directly from classical Quranic commentary.
- Clicking any topic opens the **Bilingual Verse Preview Drawer** showing Uthmanic Arabic, Urdu *Kanzul Iman*, English *Saheeh International*, and a direct jump link to Ayah Analyzer.

---

## 🌿 8. Morphological Root & Lemma Explorer (علم الصرف)

Access via **`#tab-morphology`**:
- Indexes all **1,642 Quranic roots** and **4,832 dictionary lemmas**.
- **28-Letter Arabic Alphabet Filter Ribbon**: Smooth horizontal cyber-glass ribbon (`أ` to `ي`) for instant letter-based browsing.
- **Interactive Sarf Conjugation Matrix**: Derivational breakdown across:
  - **Verb Forms I through X** (e.g., Form I *Fa'ala*, Form II *Fa''ala*, Form III *Fa'ala*, Form IV *Af'ala*, Form V *Tafa''ala*, Form X *Istaf'ala*).
  - **Tenses**: Past (*Madi*), Present/Future (*Mudari'*), Imperative (*Amr*), and Passive (*Majhul*).
  - **Participles & Nouns**: Active Participle (*Ism Fa'il*), Passive Participle (*Ism Maf'ul*), and Verbal Noun (*Masdar*).
- Clicking any derived form opens a complete scripture concordance listing every verse where that specific morphological form occurs.

---

## 📈 9. Word Frequency Studio & Bilingual Vocabulary

Access via **`#tab-frequency`**:
- Ranks the **Top 1,000 Most Frequent Quranic Words**.
- **Grand 2.8rem Arabic Calligraphy**: Crystal-clear rendering of every word token.
- **Bilingual Meaning Column**: Every word features both **English Translation** and **Roman Urdu meaning** (e.g., *He said • Usne farmaya / Kaha*).
- **Corpus Frequency Progress Bars**: Visual indicator of the word's percentage contribution to the 82,480 total tokens in the Quran.

---

## ⚖️ 10. Mutashabihat (Parallel & Similar Verses) Studio

Access via **`#tab-mutashabihat`**:
- Analyzes **95 Authentic Mutashabihat Clusters** (verses with identical or nearly identical phrasing across different Surahs).
- **Segmented Filter Chips**: Filter by `All`, `Refrains ≥ 4`, or `Parallels 2–3`.
- **Zero Singletons Guarantee**: Every cluster has at least 2 verified parallel occurrences.
- **Interactive Citation Matrix Grid**: For frequent refrains (such as Surah Ar-Rahman's *"فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ"* or Surah Al-Mursalat's *"وَيْلٌ يَوْمَئِذٍ لِلْمُكَذِّبِينَ"*), displays an anchor verse followed by a compact grid of clickable citation chips.

---

## ⏸️ 11. Waqf & Phonetic Stopping Science

Access via **`#tab-waqf`**:
- Detailed operational Tajweed guide to **15 Quranic Stopping Symbols**:
  - **۝ (Ayah End / Waqf Tam)**: Complete stop.
  - **مـ (Waqf Lazim)**: Mandatory pause; continuing corrupts the theological meaning.
  - **ط (Waqf Mutlaq)**: Absolute pause; highly recommended.
  - **ج (Waqf Ja'iz)**: Permissible pause; either stopping or continuing is acceptable.
  - **ز (Waqf Mujawwaz)**: Pause permitted, but continuing is preferable.
  - **ص (Waqf Murakhkhas)**: Concession pause for catching breath in long sentences.
  - **لا (Waqf Mamnu')**: Prohibited stop; pause must not be made here unless out of breath (must repeat from preceding word).
  - **قف (Qif)**: Exhortation to pause.
  - **∴ ... ∴ (Waqf Mu'anaqah / Embracing Stop)**: Pair of pause marks; you may pause at either one, but NOT at both.

---

## 📜 12. Executive Studios: Divine Commands & Quranic Manners

### 1. Divine Commands & Injunctions (80 Canonical Directives)
- Available as a standalone executive tool ([commands.html](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-Quran-Deep-Analyzer/commands.html)) and natively embedded inside `index.html`.
- Covers **8 Spheres of Human Living**: Health & Nutrition, Gentle Speech, Compassion & Charity, Social Peace, Financial Integrity, Mental Serenity, Family Harmony, and Judicial Equity.
- Features **Polarity Badges** (Positive Injunction vs Absolute Prohibition), **Health & Psychosocial Wisdom**, Tartil audio streaming, and WhatsApp 1-tap sharing.
- **Tri-Mode View Switcher**:
  - `Cards View`: Rich, luxury cyber-glass cards.
  - `Collapsible View`: Compact accordion view for fast browsing.
  - `Checklist View`: Track your personal daily adherence.

### 2. Quranic Manners (67 Verses from Kanzul Iman)
- Available as a standalone tool ([manners.html](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-Quran-Deep-Analyzer/manners.html)) and natively embedded inside `index.html`.
- Covers **9 Spheres**: Modesty, Greeting Protocol, Conversation Etiquette, Privacy in the Home, Walking with Humility, Honoring Elders, Controlling Anger, Financial Moderation, and Truthfulness.
- Authentic *Kanzul Iman* Urdu translation with one-tap Star Bookmarking and inline Tafsir.

---

## 📝 13. Personal Research Notebook & Tadabbur Studio

Access via the **10th Tab (`#tab-notebook`)**:
- **Folder Organization**: Create dedicated folders for your Quranic research themes (e.g., *"Patience in Trials"*, *"Parables of the Quran"*, *"Ramadan Reflections"*).
- **Verse-Linked Reflection Notes**: Write rich reflections attached directly to any specific Surah and Ayah.
- **Tagging System**: Add custom tags (`#patience`, `#tawakkul`, `#du'a`) for instant filtering.
- **1-Click Dossier Export**: Export your complete research notebook as a beautifully formatted **Markdown (.md)** or **JSON** file at any time.

---

## ⌨️ 14. Keyboard Shortcuts & Pro-Tips

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| **`/`** or **`Ctrl + K`** | **Open Spotlight Search** | Focuses the universal AI search bar from anywhere. |
| **`Ctrl + Enter`** | **Ask Gemini AI** | Synthesizes a RAG answer for the current search query. |
| **`Esc`** | **Close Modals** | Closes any open picker, Tafsir drawer, or settings modal. |
| **`A-` / `A` / `A+`** | **Dynamic Font Scaling** | Resizes Arabic and Urdu scripture typography globally. |
| **`Click Ayah Mark`** | **Waqf Guidance** | Displays the trilingual phonetic pause rule for that verse. |
| **`Drag Scrubber`** | **Edge Navigation** | 120 FPS high-speed scrolling through Surah verses. |
| **`↩ Return Pill`** | **Origin Return** | Jumps back to your previous tab and scroll position. |

---

## 🛡️ 15. Offline Architecture & Zero-CORS Durability

Quran Deep Analyzer is engineered under **Defensive Engineering & Zero-CORS Architecture**:
1. **No External CDN Dependencies for Core Data**: All datasets (`quran_core_data.js`, `quran_morphology_bundle.js`, `quran_ayat_search_bundle.js`, `quran_commands_data.js`, `quran_manners_data.js`) are preloaded as JavaScript variables on the global `window` object. This eliminates browser CORS security blocks when opening files directly from local disk (`file:///`).
2. **Procedural Web Audio API Acoustics**: All UI tactile feedback sounds (clicks, pops, chimes) are synthesized procedurally in real-time using the browser's native `AudioContext`. Zero audio file loading overhead and 100% compliance with non-musical acoustic rules.
3. **Defensive Bootloader Isolation**: Every major UI module initializes inside its own isolated `try { ... } catch (err)` block. A failure in an optional or experimental module will never freeze or disrupt core reading and search functions.
4. **Automated Syntax Guarantees**: Every script block across the repository is validated against `node --check` with 100% syntax compliance.

---

*Authored for Quran Deep Analyzer (Version 2.0) • Royal Islamic Luxury & Linear-Grade Data Studio.*
