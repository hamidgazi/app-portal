# 📘 Antigravity Universal AI Search Kit: Master Feature Guide & Integration Playbook

> **The definitive operational manual, architectural comparison, and cross-project integration handbook for the Antigravity Universal AI Search Engine and Spotlight Command Palette.**

---

## Table of Contents
1. [Executive Overview & Philosophy](#1-executive-overview--philosophy)
2. [Exhaustive Feature Breakdown & Engine Architecture](#2-exhaustive-feature-breakdown--engine-architecture)
   - [2.1 Sub-Millisecond Probabilistic BM25 Ranking](#21-sub-millisecond-probabilistic-bm25-ranking)
   - [2.2 Morphological Suffix Stemmer](#22-morphological-suffix-stemmer)
   - [2.3 Levenshtein Fuzzy Typo & Spelling Tolerance](#23-levenshtein-fuzzy-typo--spelling-tolerance)
   - [2.4 Semantic Concept & Synonym Expansion Graph](#24-semantic-concept--synonym-expansion-graph)
   - [2.5 Spotlight Command Palette (`Ctrl+K` / `Cmd+K`)](#25-spotlight-command-palette-ctrlk--cmdk)
   - [2.6 Procedural Acoustic UI Feedback (Directive 7 Compliant)](#26-procedural-acoustic-ui-feedback-directive-7-compliant)
   - [2.7 Smooth Centered Auto-Scroll & Glowing Target Pulse](#27-smooth-centered-auto-scroll--glowing-target-pulse)
   - [2.8 Zero-Config Automatic DOM Crawler](#28-zero-config-automatic-dom-crawler)
   - [2.9 Progressive Cloud Gemini AI Synthesizer (RAG)](#29-progressive-cloud-gemini-ai-synthesizer-rag)
3. [Traditional Search vs. AI Search: Deep Comparative Analysis](#3-traditional-search-vs-ai-search-deep-comparative-analysis)
   - [3.1 The 6 Critical Flaws of Normal Search](#31-the-6-critical-flaws-of-normal-search)
   - [3.2 Side-by-Side Comparison Matrix](#32-side-by-side-comparison-matrix)
4. [End-User & Power Searcher Playbook](#4-end-user--power-searcher-playbook)
   - [4.1 Keyboard Navigation Controls](#41-keyboard-navigation-controls)
   - [4.2 Query Tricks & Syntax Operators](#42-query-tricks--syntax-operators)
   - [4.3 In-Modal Help & Interactive Cheatsheet](#43-in-modal-help--interactive-cheatsheet)
5. [Real-World Project Integration Recipes](#5-real-world-project-integration-recipes)
   - [Recipe 1: Master App Portal (`App-Portal`)](#recipe-1-master-app-portal-app-portal)
   - [Recipe 2: India National Pincode Search (`08-Pincode-Search`)](#recipe-2-india-national-pincode-search-08-pincode-search)
   - [Recipe 3: Sustainable Weight Gain & Nutrition Guide (`13-Sustainable-Weight-Gain-Guide`)](#recipe-3-sustainable-weight-gain--nutrition-guide-13-sustainable-weight-gain-guide)
   - [Recipe 4: Islamic Fiqh & Prayer Times (`02-Namaz-Prayer-Times`)](#recipe-4-islamic-fiqh--prayer-times-02-namaz-prayer-times)
   - [Recipe 5: Universal Single-Page HTML Template](#recipe-5-universal-single-page-html-template)
6. [Complete API & Configuration Reference](#6-complete-api--configuration-reference)

---

## 1. Executive Overview & Philosophy

In modern web development, searching within a document or application is traditionally accomplished via browser-native **`Ctrl+F`** or simple JavaScript substring matching (`String.prototype.indexOf()` or `includes()`).

These traditional approaches suffer from a fatal flaw: **they are blind to human intent**.
- If a user misspells a word by a single character (`"delhii"` instead of `"delhi"`), traditional search yields **zero results**.
- If a user searches for a concept using a synonym (`"food"` instead of `"nutrition"`), traditional search finds **nothing**.
- If a term appears 50 times across a webpage, traditional search jumps blindly to the first occurrence at the top of the file, regardless of whether that section is relevant to the user.

The **Antigravity Universal AI Search Kit** was engineered to solve these exact problems with a **zero-dependency, client-side first architecture**:
1. **100% Offline & Private by Default:** Operates entirely inside the user's browser memory. Zero external NPM libraries, zero network telemetry, zero latency, and zero API costs.
2. **Sub-Millisecond Probabilistic Intelligence:** Combines industry-standard search algorithms (**BM25 ranking**, **Levenshtein distance**, **morphological stemming**, and **concept clustering**) running at native JavaScript speeds ($< 2\text{ ms}$).
3. **Progressive Cloud Enhancement:** Allows developers to optionally connect Google's Gemini Flash model to synthesize conversational 2-sentence direct answers when an API key is available, while gracefully degrading to pure offline mode when offline.
4. **Universal Drop-in Ergonomics:** Integrates into any existing or future webpage with a single stylesheet and script tag.

---

## 2. Exhaustive Feature Breakdown & Engine Architecture

### 2.1 Sub-Millisecond Probabilistic BM25 Ranking
At the core of the engine is the **Okapi BM25** probabilistic scoring formula, the same algorithm powering enterprise search platforms like Elasticsearch and Apache Lucene.

Unlike simple frequency counting (which rewards documents that needlessly repeat a word 20 times), BM25 balances **Term Frequency ($TF$)**, **Inverse Document Frequency ($IDF$)**, and **Document Length Normalization**:

$$\text{IDF}(q) = \ln\left(1 + \frac{N - n(q) + 0.5}{n(q) + 0.5}\right)$$

$$\text{Score}(D, Q) = \sum_{q \in Q} \text{IDF}(q) \cdot \frac{f(q, D) \cdot (k_1 + 1)}{f(q, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}$$

- **$k_1 = 1.2$**: Regulates term frequency saturation, preventing repetitive spam from overwhelming the ranking.
- **$b = 0.75$**: Normalizes document length, ensuring concise sections with dense meaning are prioritized over lengthy paragraphs where a word is mentioned in passing.
- **Title Boosting ($3.0\times$)**: When a query term matches an `<h1>`-`<h6>` heading or card title, its frequency is multiplied by $3.0\times$, ensuring section headings always outrank generic body text.

### 2.2 Morphological Suffix Stemmer
English and multilingual texts contain numerous grammatical inflections. When a user searches for `"track"`, they expect to find sections containing `"tracking"`, `"tracked"`, or `"tracker"`.

The engine incorporates a fast regex-based morphological stemmer that strips common suffixes:
- Progressive endings: `-ing`, `-edly`, `-ingly`
- Nominal suffixes: `-tion`, `-ness`, `-able`, `-ible`
- Adverbial & tense endings: `-ly`, `-ed`, `-es`, `-er`, `-est`, `-s`

During document indexing, **both the raw word and its base stem are indexed simultaneously**. A query for `"kuik traking"` matches a section titled `"Quick Tracking"` because both words reduce to their canonical roots (`"quick"` and `"track"`).

### 2.3 Levenshtein Fuzzy Typo & Spelling Tolerance
Human typing on mobile devices or fast keyboards is prone to typos. The engine integrates a dynamic programming **Levenshtein Distance** algorithm that measures the minimum number of single-character edits (insertions, deletions, substitutions) required to transform one word into another.

The engine normalizes this into a similarity coefficient between $0.0$ and $1.0$:

$$\text{Similarity}(a, b) = 1.0 - \frac{\text{Levenshtein}(a, b)}{\max(|a|, |b|)}$$

- **Short words ($\le 4$ chars):** Allows up to 1 edit distance (`"kuik"` $\rightarrow$ `"quick"`).
- **Medium words ($5\text{--}7$ chars):** Allows up to 2 edit distances (`"delhii"` $\rightarrow$ `"delhi"`).
- **Long words ($> 7$ chars):** Allows up to 3 edit distances (`"nutrishun"` $\rightarrow$ `"nutrition"`).
- **Candidate Threshold ($\ge 0.58$):** When an exact word is absent from the index vocabulary, the engine scans candidate terms with similarity $\ge 0.58$, applying a gentle $20\%$ weight discount to prioritize exact matches when available.

### 2.4 Semantic Concept & Synonym Expansion Graph
The engine maintains an in-memory synonym dictionary mapping common root concepts to semantic clusters. When a user queries a concept, the engine automatically expands the query into synonymous terms with a $70\%$ weighting:

| Root Concept | Expanded Synonym Cluster |
| :--- | :--- |
| **`food`** | `nutrition`, `diet`, `meal`, `calories`, `eating`, `shake`, `protein`, `carbs`, `breakfast`, `lunch`, `dinner` |
| **`weight`** | `fat`, `mass`, `bulk`, `muscle`, `gain`, `skinny`, `lean`, `physique`, `body`, `heavy` |
| **`courier`** | `shipment`, `parcel`, `tracking`, `delivery`, `docket`, `consignment`, `awb`, `post`, `logistics`, `dtdc`, `speedpost` |
| **`prayer`** | `namaz`, `salah`, `salat`, `fajr`, `zuhr`, `asr`, `maghrib`, `isha`, `tahajjud`, `wudu`, `ablution`, `jamaat` |
| **`fasting`** | `roza`, `ramadan`, `sehri`, `iftar`, `sawm` |
| **`pincode`** | `postal`, `zip`, `zipcode`, `area`, `postoffice`, `taluk`, `district`, `city`, `location`, `pin` |
| **`code`** | `developer`, `script`, `javascript`, `python`, `programming`, `software`, `git`, `terminal`, `api` |
| **`fast`** | `quick`, `speed`, `express`, `rapid`, `instant`, `prompt` |

Developers can pass custom domain synonym maps via the initialization options (`AISearch.init({ synonyms: { ... } })`).

### 2.5 Spotlight Command Palette (`Ctrl+K` / `Cmd+K`)
Inspired by macOS Spotlight and VS Code's command palette:
- **Global Hotkey:** Pressing **`Ctrl+K`** or **`Cmd+K`** on any page immediately summons the modal.
- **Quick Slash (`/`):** Pressing `/` while not typing in an input field opens the search bar.
- **Capture-Phase Event Handling:** Hotkeys are registered in the browser's **Capture Phase** (`window.addEventListener('keydown', handler, true)`). This prevents Google Chrome or Edge from intercepting `Ctrl+K` for their browser address bars.
- **Keyboard Cycling:** Use `↓` (Arrow Down) and `↑` (Arrow Up) to cycle through ranked cards with smooth scrolling, and press `Enter` to jump directly to the target.
- **Escape to Dismiss:** Pressing `Escape` instantly closes the overlay.

### 2.6 Procedural Acoustic UI Feedback (Directive 7 Compliant)
In strict compliance with **Antigravity Directive 7 (Zero Music Jurisprudence)**, the kit contains **zero external audio files, zero songs, and zero musical melodies**.

Instead, it synthesizes subtle, tactile micro-sound effects directly in the browser using the native Web Audio API (`AudioContext`):
- **Click Tick (25ms):** A gentle triangle-wave frequency ramp ($600\text{ Hz} \rightarrow 150\text{ Hz}$) providing crisp mechanical haptic feedback when opening the modal or navigating results.
- **Selection Chime (60ms):** A soft, neutral sine wave ($587.33\text{ Hz} \rightarrow 880\text{ Hz}$) that sounds when a result is activated.
- **Safe Bootstrapping:** Audio contexts are safely initialized on first user gesture and execute within isolated `try / catch` blocks so audio failures never break core navigation.

### 2.7 Smooth Centered Auto-Scroll & Glowing Target Pulse
When a user selects a search result, the modal closes and the target DOM element is automatically centered in the viewport using smooth scrolling:

```javascript
element.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

Simultaneously, the engine applies the CSS class `.ai-search-target-pulse`, triggering an animated cyan neon glow (`outline: 3px solid #38bdf8; box-shadow: 0 0 25px rgba(56, 189, 248, 0.6)`) that gently pulses for 3.2 seconds. This guides the user's eye to the exact answer block.

### 2.8 Zero-Config Automatic DOM Crawler
By default (`autoCrawl: true`), the engine crawls the page on load:
- Traverses all headings (`<h1>`-`<h6>`), paragraphs (`<p>`), list items (`<li>`), blockquotes, and cards.
- Groups paragraphs under their respective section titles.
- Automatically assigns unique DOM anchor IDs (`#ai-search-anchor-N`) to elements lacking IDs.
- Ignores scripts, stylesheets, navigation bars, footers, and modal overlays using safe array-based CSS selector generation.

### 2.9 Progressive Cloud Gemini AI Synthesizer (RAG)
When initialized with a Google Gemini API key (`geminiApiKey: '...'`):
- The engine extracts the top 3 BM25 ranked text chunks.
- Dispatches a prompt to the Google Gemini 2.5 Flash API asking for a 2-sentence conversational summary of the exact section.
- Renders an **AI Direct Answer Card** at the top of the search palette.
- **Graceful Fallback:** If offline or the API key is omitted, the engine cleanly degrades to instant local BM25 cards without errors.

---

## 3. Traditional Search vs. AI Search: Deep Comparative Analysis

### 3.1 The 6 Critical Flaws of Normal Search

#### Flaw 1: Complete Typo & Spelling Fragility
- **Normal Search:** Uses exact string matching (`String.indexOf` or `Ctrl+F`). A search for `"kuik"` or `"delhii"` returns zero results.
- **AI Search:** Employs Levenshtein dynamic programming to calculate character edit distance, finding `"quick"` and `"Delhi"` effortlessly.

#### Flaw 2: Zero Semantic Awareness (Vocabulary Mismatch)
- **Normal Search:** Searches purely for character sequences. A user looking for `"diet"` or `"food"` completely misses sections discussing `"high-calorie nutrition"` or `"protein shakes"`.
- **AI Search:** Automatically traverses an in-memory synonym graph, expanding queries across concept clusters so related topics rank immediately.

#### Flaw 3: Inability to Handle Word Inflections
- **Normal Search:** Searching for `"track"` fails to match `"tracking"`, `"tracked"`, or `"tracker"`.
- **AI Search:** Utilizes morphological stemming to index both the inflected word and its base root, guaranteeing full recall across grammatical variations.

#### Flaw 4: Chronological DOM Jumping vs. Relevance Scoring
- **Normal Search:** Browser `Ctrl+F` jumps chronologically from the top of the HTML file downwards. If a keyword appears in a minor disclaimer at the top of the page, the user is sent there first, even if the primary section is at the bottom.
- **AI Search:** Uses probabilistic BM25 ranking to score relevance based on term density, document length, and heading weights ($3\times$), placing the most relevant section at the top of the results list.

#### Flaw 5: Information Overload & Lack of Synthesis
- **Normal Search:** Highlights every matching word without synthesizing meaning. Users must manually read through 20 different paragraphs to answer a question.
- **AI Search:** Provides an optional 1-click Gemini AI Answer Card that reads the top matching sections and generates a concise 2-sentence executive summary.

#### Flaw 6: Disorienting Navigation & Poor Mobile Ergonomics
- **Normal Search:** Yellow browser scrollbar marks are tiny and hard to see. On mobile devices, browser search overlays occupy half the screen and lack touch ergonomics.
- **AI Search:** A dedicated AMOLED Spotlight palette with $\ge 48\text{ px}$ touch targets (Directive 5), smooth scrolling to viewport center, and radiant neon pulsing outline.

### 3.2 Side-by-Side Comparison Matrix

| Evaluation Dimension | ❌ Traditional Search (`Ctrl+F` / `.indexOf`) | 🤖 Antigravity AI Search Engine |
| :--- | :--- | :--- |
| **Typo Tolerance** | 0% tolerance (single typo fails completely) | Normalized Levenshtein distance ($\ge 0.58$ threshold) |
| **Vocabulary Matching** | Strict binary keyword equality | Semantic synonym expansion graph with 70% weighting |
| **Grammar Inflections** | Fails on `-ing`, `-ed`, `-ly`, `-s` suffixes | Morphological stemming indexes roots and inflections |
| **Relevance Ranking** | Flat top-to-bottom chronological sequence | Okapi BM25 probabilistic ranking + $3\times$ title boost |
| **Cognitive Synthesis** | None (user must read entire document) | Optional 2-sentence Gemini AI RAG synthesis card |
| **Navigation & Feedback** | Instant jarring jump, tiny yellow highlight | Smooth centered scrolling + pulsing cyan neon aura |
| **Sound Feedback** | Silent or abrasive system bell | Procedural Web Audio micro-haptics (Directive 7) |
| **Mobile UX** | Awkward desktop toolbars, small touch targets | Native AMOLED bottom-sheet with $\ge 48\text{ px}$ hitboxes |
| **Offline Durability** | Works offline but dumb | **100% offline intelligence (0 dependencies, 0 network)** |

---

## 4. End-User & Power Searcher Playbook

### 4.1 Keyboard Navigation Controls

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| **`Ctrl + K`** or **`Cmd + K`** | **Open / Toggle Spotlight** | Summons the search palette from anywhere on the page. |
| **`/`** (Slash) | **Quick Search** | Opens the palette instantly when not typing in an input field. |
| **`↓`** (Arrow Down) | **Next Result** | Moves highlight down through ranked cards. |
| **`↑`** (Arrow Up) | **Previous Result** | Moves highlight up through ranked cards. |
| **`Enter`** (Return) | **Select & Jump** | Jumps to selected section, smoothly centers viewport, and pulses target. |
| **`Escape`** (ESC) | **Dismiss** | Closes the search modal immediately. |

### 4.2 Query Tricks & Syntax Operators
- **Typo-Tolerant Search:** Type phonetic or misspelled words (e.g., `"delhii"`, `"kuik"`, `"shippment"`). The engine automatically matches the closest dictionary root.
- **Concept Searching:** Search for broad themes rather than exact keywords (e.g., typing `"food"` finds nutrition sections; typing `"namaz"` finds prayer schedules).
- **Heading Targeting:** Keywords that appear in section titles automatically rank higher than body text mentions.
- **In-Modal Help Trigger:** Type **`?`** or **`help`** into the search bar to reveal the interactive help cheatsheet!

### 4.3 In-Modal Help & Interactive Cheatsheet
Typing `?` or `help` into the search input replaces the results list with an interactive quick-reference card showing all shortcuts, active features, and tips. Clearing the input returns to search mode.

---

## 5. Real-World Project Integration Recipes

### Recipe 1: Master App Portal (`App-Portal`)
*Use Case: Search across dozens of internal applications and external links with instant fuzzy matching.*

```html
<!-- 1. Include AI Search assets in App-Portal/index.html -->
<link rel="stylesheet" href="../AI-Search-Kit/ai_search.css">
<script src="../AI-Search-Kit/ai_search.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize with custom App Portal catalog data
    AISearch.init({
      autoCrawl: false, // We pass our structured apps array
      data: [
        { id: 'app-events', title: 'Events Countdown', content: 'Countdown timers for major upcoming events.', url: '../01-Events-Countdown/index.html', category: 'Productivity' },
        { id: 'app-namaz', title: 'Namaz Prayer Times', content: 'Accurate prayer times, wudu, and Ramadan schedule.', url: '../02-Namaz-Prayer-Times/index.html', category: 'Islamic' },
        { id: 'app-pincode', title: 'India Pincode Directory', content: 'Fast postal code search for all Indian states and districts.', url: '../08-Pincode-Search/index.html', category: 'Tools' },
        { id: 'app-weight', title: 'Weight Gain Protocol', content: 'Calorie surplus diet plans, shakes, and workout guide.', url: '../13-Sustainable-Weight-Gain-Guide/Weight_Gain_Dashboard.html', category: 'Health' }
      ],
      synonyms: {
        'portal': ['hub', 'home', 'navigator', 'index', 'dashboard'],
        'time': ['clock', 'timer', 'countdown', 'namaz', 'prayer']
      },
      onSelect: function(item) {
        if (item.url) window.location.href = item.url;
      }
    });
  });
</script>
```

---

### Recipe 2: India National Pincode Search (`08-Pincode-Search`)
*Use Case: Tolerates misspellings in city, taluk, and post office names.*

```html
<!-- Include in 08-Pincode-Search/index.html -->
<link rel="stylesheet" href="../Common-Resources/AI-Search-Kit/ai_search.css">
<script src="../Common-Resources/AI-Search-Kit/ai_search.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    AISearch.init({
      autoCrawl: true,
      containerSelector: '#pincode-results-container',
      placeholder: 'Search city, taluk, or PIN code (Ctrl+K)...',
      synonyms: {
        'delhi': ['new delhi', 'delhii', 'nct', 'central delhi'],
        'mumbai': ['bombay', 'mumbay', 'maharashtra'],
        'bengaluru': ['bangalore', 'bengaluru south', 'karnataka'],
        'post': ['postoffice', 'gpo', 'hpo', 'delivery', 'dak']
      }
    });
  });
</script>
```

---

### Recipe 3: Sustainable Weight Gain & Nutrition Guide (`13-Sustainable-Weight-Gain-Guide`)
*Use Case: Maps fitness colloquialisms ("bulk", "skinny", "shake") to scientific nutrition terms.*

```html
<!-- Include in Weight_Gain_Dashboard.html -->
<link rel="stylesheet" href="../Common-Resources/AI-Search-Kit/ai_search.css">
<script src="../Common-Resources/AI-Search-Kit/ai_search.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    AISearch.init({
      autoCrawl: true,
      placeholder: 'Search recipes, calories, or workouts (Ctrl+K)...',
      synonyms: {
        'shake': ['smoothie', 'liquid calories', 'peanut butter oats', 'blend'],
        'bulk': ['mass', 'weight gain', 'calorie surplus', 'hypertrophy'],
        'protein': ['whey', 'chicken', 'eggs', 'paneer', 'soya', 'macros'],
        'exercise': ['workout', 'gym', 'squats', 'bench press', 'compound']
      }
    });
  });
</script>
```

---

### Recipe 4: Islamic Fiqh & Prayer Times (`02-Namaz-Prayer-Times`)
*Use Case: Connects English, Roman Urdu, and Arabic terms to Hanafi jurisprudence.*

```html
<!-- Include in 02-Namaz-Prayer-Times/index.html -->
<link rel="stylesheet" href="../Common-Resources/AI-Search-Kit/ai_search.css">
<script src="../Common-Resources/AI-Search-Kit/ai_search.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    AISearch.init({
      autoCrawl: true,
      placeholder: 'Search prayer timings, wudu, or roza (Ctrl+K)...',
      synonyms: {
        'namaz': ['prayer', 'salah', 'salat', 'fajr', 'zuhr', 'asr', 'maghrib', 'isha'],
        'fajr': ['subh sadiq', 'dawn', 'sehri', 'sehri cutoff'],
        'roza': ['fasting', 'ramadan', 'iftar', 'sawm'],
        'wudu': ['ablution', 'wudhu', 'purification', 'faraiz'],
        'tahajjud': ['night prayer', 'qiyam', 'qiyamullail']
      }
    });
  });
</script>
```

---

### Recipe 5: Universal Single-Page HTML Template
*Use Case: Drop into any static HTML file with 0 setup.*

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Web Page</title>
  
  <!-- 1. AI Search Stylesheet -->
  <link rel="stylesheet" href="Common-Resources/AI-Search-Kit/ai_search.css">
</head>
<body>

  <!-- Optional search trigger button in your header -->
  <header>
    <button class="ai-search-trigger" type="button">🔍 Search Page (Ctrl+K)</button>
  </header>

  <main>
    <h1>Section Heading</h1>
    <p>Your page content goes here...</p>
  </main>

  <!-- 2. AI Search Engine Script -->
  <script src="Common-Resources/AI-Search-Kit/ai_search.js"></script>

  <!-- 3. One-line initialization -->
  <script>
    document.addEventListener('DOMContentLoaded', () => AISearch.init());
  </script>
</body>
</html>
```

---

## 6. Complete API & Configuration Reference

```javascript
const searchInstance = AISearch.init({
  // Automatic DOM crawler options
  autoCrawl: true,                // Set to true to index HTML elements automatically
  containerSelector: '',          // CSS selector for root container (defaults to document.body)
  excludeSelector: '',            // Additional selectors to exclude from search
  
  // Custom structured data feed (optional)
  data: null,                     // Array of objects: [{ id, title, content, url, category }]
  
  // Custom synonym expansion dictionary (optional)
  synonyms: {},                   // Object: { term: ['syn1', 'syn2'] }
  
  // Cloud AI progressive enhancement (optional)
  geminiApiKey: '',               // Google Gemini API key for 2-sentence conversational answers
  
  // UI and acoustic settings
  placeholder: 'Search...',       // Search input placeholder text
  enableSound: true,              // Enable procedural Web Audio tactile feedback (Directive 7)
  
  // Custom click selection handler (optional)
  onSelect: function(item) {      // Callback when a user clicks/selects a card
    // Defaults to smooth auto-scroll with glowing pulse
  }
});
```

### Public Methods

- **`AISearch.open()`**: Programmatically opens the Spotlight search palette.
- **`AISearch.close()`**: Programmatically closes the palette.
- **`AISearch.search(query, limit = 8)`**: Executes a search programmatically and returns ranked result objects.

---

## 7. Antigravity AI Search v2.0 Advanced Feature Suite

### 7.1 Phonetic Hashing (Soundex & Metaphone)
Antigravity AI Search v2.0 includes dual client-side phonetic algorithms operating in 100% offline mode:
- **Soundex Hashing (`soundex(word)`)**: Standard 4-character American Soundex algorithm (`[A-Z][0-9]{3}`) with adjacent deduplication and prefix normalization. Equates phonetic relatives like `Robert` and `Rupert` (`R163`).
- **Metaphone Hashing (`metaphone(word)`)**: Advanced consonant encoder that normalizes complex English and South Asian homophones (e.g. `quick` and `kuik` both encode to `K`; `tracking` and `traaking` both encode to `TRKNK`).

### 7.2 Multilingual Roman Urdu & Hindi Transliteration
Colloquial South Asian terms are seamlessly resolved to canonical English concepts across 120+ domain terms:
- **Food & Nutrition**: Querying `khana` or `ghiza` expands to `food`, `nutrition`, `calories`, and `diet`.
- **Weight & Fitness**: Querying `wazan` expands to `weight`, `mass`, `gain`, and `bulk`.
- **Medicine & Healthcare**: Querying `dawa` expands to `medicine`, `treatment`, `prescription`, and `cure`.
- **Faith & Fiqh**: Querying `namaz` expands to `prayer` and `salah`; `roza` expands to `fasting` and `ramadan`.
- **Logistics & Postal**: Querying `khat` or `dak` expands to `post`, `mail`, and `letter`.

### 7.3 Browser-Native Voice Search
- Uses the native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) without third-party dependencies or API keys.
- Defaults to Indian English (`en-IN`) with robust handling for Hindi and Urdu vocal input.
- Animated pulsing red glow indicator provides visual feedback during active voice capture.

### 7.4 Precision Category Filter Pills & Autocomplete
- Dynamic horizontal filter bar allowing instant 0ms in-memory filtering by domain categories (`All`, `Headings`, `Health`, `Logistics`, `Postal`).
- Interactive autocompletion chips suggest indexed vocabulary prefixes with 1-tap tab or click insertion.

### 7.5 LocalStorage History & Mobile Ergonomics
- Stores the last 6 searches in `localStorage` under `antigravity_recent_searches` with 1-tap re-run chips and a "Clear all" button.
- On viewports $\le 768\text{px}$, an AMOLED floating glassmorphic action pill (`.ai-search-floating-pill`) is docked at the bottom-right with a touch target $\ge 48\text{px}$ adhering to Directive 5.

---

## 8. Antigravity AI Search v3.0 Enterprise Architecture & Power Suite

AI Search v3.0 elevates the search engine from a page-level indexing tool into an operating-system-level command palette and universal productivity cockpit.

### 8.1 Federated Workspace Omnisearch & Dual-Scope Switcher
- **Smart Scope Bar (`.ai-search-scope-bar`)**: Allows users to toggle instantaneously between **`[This Page]`** (in-depth document/DOM sections) and **`[All Apps]`** (all 26+ Antigravity workspace applications and tools).
- **Auto-Blend Cross-App Discovery**: When searching in `[This Page]` mode, if high-relevance matches are detected across workspace apps, an unobtrusive cross-app section is rendered beneath page results with a 1-tap switch button.
- **Zero-CORS Fallback**: Seamlessly ingests `window.PORTAL_CATALOG` or falls back to `DEFAULT_WORKSPACE_CATALOG` with offline durability under `file://`.

### 8.2 Safe Procedural Math Evaluator
- **Zero-`eval()` Security**: Built with a recursive descent parser (`parseExpr` $\rightarrow$ `parseTerm` $\rightarrow$ `parseFactor` $\rightarrow$ `parsePrimary`) that eliminates all code-injection risks.
- **Expression Triggers**: Activated instantly by typing `=` or `calc:` (e.g. `= 25 * 40 + 10`).
- **Rich Operator & Percentage Support**:
  - Arithmetic: `+`, `-`, `*`, `/`, `%` (modulo), `^` (exponentiation), nested parentheses `(...)`.
  - Business Percentages: `18% of 2450` ($= 441$), `100 + 15%` ($= 115$), `200 - 20%` ($= 160$).
  - Mathematical Functions: `sqrt(144)` ($= 12$), `round(10.75)` ($= 11$), `abs(-42)` ($= 42$), constants `pi` and `e`.
- **1-Tap Clipboard Copy**: Features a dedicated copy button and keyboard shortcut (`Enter` to copy result).

### 8.3 Raycast-Style Action Studio
- **Command Mode Trigger (`>`)**: Typing `>` instantly shifts the search palette into action execution mode.
- **Pre-Packaged System Commands**:
  - `> theme`: Cycles interface theme between Dark, Light, and AMOLED modes.
  - `> copy-url`: Copies canonical page URL or anchor link to clipboard.
  - `> export-results`: Exports active search results as a formatted JSON document.
  - `> clear-history`: Wipes all recent search entries from `localStorage`.
  - `> scroll-top` / `> scroll-bottom`: Smoothly scrolls active document viewport.
  - `> help`: Summons interactive cheatsheet and keyboard guide.

### 8.4 Dynamic Centered Keyword Windowing
- **Focused $\pm 12$-Word Context Window**: Replaces naive beginning-of-paragraph snippets with an intelligent centered window around the first occurrence of the search term.
- **Highlight Tagging**: Wraps matched terms in `<mark class="ai-search-highlight">` with boundary ellipsis (`...`).
- **Match Source Badges**: Color-coded pill tags explicitly identifying the matching mechanism:
  - `[Exact]`: Verbatim token match (Emerald).
  - `[Phonetic]`: Soundex/Metaphone sound match (Purple).
  - `[Synonym]`: Semantic concept expansion (Amber).
  - `[Transliterated]`: Roman Urdu/Hindi root resolution (Sky Blue).
  - `[App]`: Federated workspace application (Indigo).
  - `[Math]`: Calculation result (Emerald).
  - `[Command]`: System action command (Pink).

### 8.5 LocalStorage Result Pinning
- **1-Tap Result Pinning (`⭐ Pin`)**: Every search result features a pin button that persists the result in `localStorage` under `antigravity_pinned_searches`.
- **Pinned Shortcuts Empty State**: Pinned items are displayed at the very top of the empty search state, providing an instant 1-tap launcher for favorite pages, apps, or queries.

### 8.6 Complete v3.0 Public API Reference

```javascript
// Evaluate mathematical expressions safely
const calc = AISearch.evaluateMath("18% of 2450");
console.log(calc.formattedResult); // "441"

// Federated cross-app catalog search
const appHits = AISearch.searchCatalog("thela");

// Action Studio commands
const actions = AISearch.getActionCommands();
AISearch.executeAction("cmd-theme");

// Result Pinning
AISearch.addPinnedSearch("namaz timing");
const pinned = AISearch.getPinnedSearches();
AISearch.removePinnedSearch("namaz timing");
AISearch.clearPinnedSearches();
```


