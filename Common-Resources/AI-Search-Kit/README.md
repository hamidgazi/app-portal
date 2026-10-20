# Antigravity Universal AI Search Kit (`AI-Search-Kit`)

> **Production-grade, zero-dependency hybrid search engine and universal Spotlight command palette (`Ctrl+K`) designed for any HTML webpage, progressive web app (PWA), or offline software application.**

---

## 1. Executive Overview

Traditional browser searching (`Ctrl+F` and JavaScript `.indexOf()`) is fundamentally broken: it is blind to meaning, intolerant to typos, and visually disorienting.

The **Antigravity Universal AI Search Kit** delivers a dual-engine architecture:
1. **100% Client-Side Offline Engine (Default):** Runs with **0 external dependencies** and **0 API keys** directly inside the browser. It combines **BM25 probabilistic relevance ranking**, **morphological stemming**, **Levenshtein fuzzy typo tolerance**, and an **in-memory semantic synonym expansion graph** to execute sub-millisecond searches across any webpage.
2. **Progressive Cloud AI Synthesizer (Opt-in RAG):** When enabled with a Google Gemini API key, it extracts the top relevance chunks and generates a direct 2-sentence conversational answer at the top of the command palette.
3. **Universal Spotlight Command Palette (`Ctrl+K` / `Cmd+K`):** AMOLED glassmorphic modal overlay featuring keyboard navigation (`↑`/`↓`/`Enter`), mobile bottom-sheet ergonomics, Web Audio procedural feedback (Directive 7 compliant), smooth auto-scroll, and radiant pulsing illumination on the target section.

---

## 2. Architectural Comparison: Normal Search vs. AI Search

Why traditional search fails and how the AI Search Kit solves every limitation:

| Evaluation Dimension | ❌ Traditional Search (`Ctrl+F` / `.indexOf`) | 🤖 Antigravity AI Search Engine |
| :--- | :--- | :--- |
| **Typo Tolerance** | **0% tolerance.** A search for `"delhii"` or `"kuik"` returns 0 results, forcing user frustration. | **Fuzzy Distance Matching:** Uses Levenshtein and n-gram edit distance algorithms to accurately find `"Delhi"` and `"quick"`. |
| **Semantic Understanding** | **Zero semantic awareness.** Searching `"food"` completely misses `"nutrition"`, `"diet"`, `"calories"`, or `"meals"`. | **Synonym & Intent Graph:** Automatically expands queries across concept clusters so related topics rank immediately. |
| **Morphological Stemming** | **Fails on word variations.** Searching `"track"` misses `"tracking"` or `"tracked"`. | **Suffix Stripping:** Extracts word stems (`-ing`, `-ly`, `-ed`, `-s`) during tokenization for comprehensive recall. |
| **Relevance Ranking** | **Flat chronological order.** Jumps blindly to the first occurrence at the top of the HTML page, even if irrelevant. | **BM25 Probabilistic Ranking:** Weights Term Frequency ($TF$), Inverse Document Frequency ($IDF$), and boosts titles ($3\times$). |
| **Answer Synthesis** | **No synthesis.** User must hunt through 30 disjointed paragraphs to find what they need. | **AI Direct Answer Card:** Optional Gemini Flash RAG synthesis provides a 2-sentence executive summary at the top. |
| **User Experience & Navigation** | **Tiny browser highlights.** Jarring instant jump with no spatial context. | **Spotlight Command Palette (`Ctrl+K`):** Keyboard navigable, smoothly scrolls to center, and illuminates target with neon pulse. |
| **Mobile Touch Ergonomics** | **Awkward browser toolbars.** Clutters small screens and lacks tactile touch targets. | **Responsive Bottom-Sheet:** Slides up natively on phones with $\ge 48\text{ px}$ hitboxes (Directive 5). |

---

## 3. Where Else AI Search Can Be Implemented: Comprehensive Domain Blueprint

Beyond individual HTML webpages, AI search engines can be deployed across numerous computing environments:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WHERE AI SEARCH CAN BE IMPLEMENTED                    │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│ 1. Desktop & Files    │ 2. Supply Chain & Logistics │ 3. Legal & Fiqh       │
│ • Local file search   │ • Natural language tracking │ • Multilingual search │
│ • Docs, PDFs, Sheets  │ • "Where is my parcel?"     │ • Cross-lingual Fatawa│
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│ 4. Support & Portals  │ 5. Database Systems         │ 6. Offline PWAs       │
│ • Deflect ticket bloat│ • Semantic text-to-SQL      │ • SQLite / IndexedDB  │
│ • Self-service FAQs   │ • Unstructured queries      │ • Hardware back nav   │
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

### Domain 1: Local Desktop File Systems & Personal Archives
- **The Problem:** Windows Search and file managers require exact filenames. Finding a file titled `Invoice_March_Scan.pdf` when searching for `"electricity bill"` is impossible.
- **AI Search Solution:** A background local worker parses PDF, DOCX, and TXT contents into a local SQLite/BM25 database. Users can search `"how much did I spend on lighting?"` to retrieve the relevant invoice instantly.

### Domain 2: Courier Logistics & Supply Chain Portals
- **The Problem:** Tracking pages demand exact 12-digit consignment numbers. Customers searching `"my parcel from Mumbai sent yesterday"` receive errors.
- **AI Search Solution:** Connects dispatch logs to an intent analyzer. Recognizes consignee phone numbers, origin cities, and transit statuses from natural language queries.

### Domain 3: Islamic Jurisprudence & Multilingual Encyclopedias
- **The Problem:** Scholars and laymen search in diverse languages: English (`"conditions of prayer"`), Roman Urdu (`"namaz ke faraiz"`), Urdu (`نماز کے فرائض`), or Arabic (`اركان الصلاة`). Keyword search misses 75% of related rulings.
- **AI Search Solution:** A cross-lingual embedding engine and concept ontology maps English, Roman Urdu, and Arabic terms to shared fiqh topics.

### Domain 4: Enterprise Customer Support & Knowledge Portals
- **The Problem:** Users submit repetitive support tickets because static search bars fail on colloquial queries (e.g., `"app is stuck on white screen"` vs. `"rendering error"`).
- **AI Search Solution:** Deflects tickets by synthesizing immediate direct resolutions in the search modal before the user submits a ticket.

### Domain 5: Relational Databases & Enterprise Data Warehouses
- **The Problem:** Non-technical operators cannot write SQL queries to filter customer records or inventory balances.
- **AI Search Solution:** Natural Language to SQL (NL2SQL) combined with BM25 vector ranking allows users to type `"show top 10 delayed shipments this week"` and get instant tabular results.

### Domain 6: Offline Progressive Web Apps (PWAs) & Mobile Apps
- **The Problem:** Mobile connections in transit or remote warehouses frequently drop. Cloud-dependent search stops working.
- **AI Search Solution:** The exact client-side engine implemented in this kit runs 100% offline inside IndexedDB or browser cache, delivering instant sub-millisecond lookups with 0 mobile data usage.

---

## 4. Deliverables Catalog

| Deliverable | Path | Format | Description |
| :--- | :--- | :--- | :--- |
| **Core Engine** | [`ai_search.js`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/Common-Resources/AI-Search-Kit/ai_search.js) | Pure ES6 | Zero-dependency hybrid BM25 + Levenshtein + Synonym engine with Web Audio acoustic feedback and DOM crawler. |
| **Stylesheet** | [`ai_search.css`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/Common-Resources/AI-Search-Kit/ai_search.css) | CSS3 | AMOLED glassmorphic theme, desktop `Ctrl+K` palette, mobile bottom sheet, and pulsing target animations. |
| **Showcase Demo** | [`demo.html`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/Common-Resources/AI-Search-Kit/demo.html) | HTML5 | Interactive testbed with multi-domain content, typo test chips, and live spotlight navigation. |
| **Test Suite** | [`tests/test_ai_search.py`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/Common-Resources/AI-Search-Kit/tests/test_ai_search.py) | Python 3 | Automated test suite validating `node --check`, BM25 math, fuzzy matching, and Directive 7 compliance. |

---

## 5. Quick-Start & 1-Line Drop-In Integration Guide

### Method A: Zero-Configuration Auto-Crawl (Single Webpage)
To add AI search to any existing HTML page, drop this snippet into the `<head>` or before `</body>`:

```html
<!-- 1. Stylesheet -->
<link rel="stylesheet" href="Common-Resources/AI-Search-Kit/ai_search.css">

<!-- 2. Core Script -->
<script src="Common-Resources/AI-Search-Kit/ai_search.js"></script>

<!-- 3. One-Line Initialization -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    AISearch.init();
  });
</script>
```

Pressing **`Ctrl+K`**, **`Cmd+K`**, or **`/`** will instantly summon the Spotlight palette, index all headings and text on the page, and allow search navigation with smooth auto-scroll.

### Method B: Custom JSON Feed (Catalog / Multi-Page App)
To search a structured dataset (e.g. app directory, pincode database, or product catalog):

```javascript
AISearch.init({
  autoCrawl: false, // Disable DOM crawling
  data: [
    { id: 'app-1', title: 'DTDC Logistics Portal', content: 'Track express consignments and dockets.', url: 'dtdc.html' },
    { id: 'app-2', title: 'Calorie Counter & Nutrition', content: 'Diet protocol and meal planning.', url: 'diet.html' }
  ],
  onSelect: function(item) {
    window.location.href = item.url;
  }
});
```

### Method C: Progressive Cloud Gemini AI Synthesis (Optional)
To activate conversational 2-sentence answer synthesis:

```javascript
AISearch.init({
  geminiApiKey: 'YOUR_GEMINI_API_KEY' // Progressively enhances results with RAG answers
});
```

---

## 6. Annotated Directory Tree

```
Common-Resources/AI-Search-Kit/
├── ai_search.js          # Core hybrid BM25 + Levenshtein + Synonym engine (Pure ES6)
├── ai_search.css         # AMOLED glassmorphic modal + responsive mobile bottom-sheet
├── demo.html             # Multi-domain interactive testbed & feature showcase
├── README.md             # Master executive documentation & architectural guide
└── tests/
    └── test_ai_search.py # Automated unit test suite (node --check + algorithmic tests)
```

---

---

## 7. Antigravity AI Search v2.0 & v3.0 Feature Suites

### Antigravity AI Search v2.0 Feature Suite
1. **Precision Search & Category Filtering**: Dynamic "Did you mean: [word]?", Prefix Autocompletion chips, 0ms in-memory Category Filter Pills (`All`, `Headings`, `Health`, `Logistics`, `Postal`).
2. **Phonetics & Roman Urdu/Hindi Transliteration**: Soundex & Metaphone consonant encoders; 120+ colloquial South Asian roots mapped to English concepts (`khana` $\rightarrow$ `food`, `wazan` $\rightarrow$ `weight`, `dawa` $\rightarrow$ `medicine`, `namaz` $\rightarrow$ `prayer`).
3. **Voice Search & Mobile Ergonomics**: Browser-native Web Speech API (`en-IN`), AMOLED floating glassmorphic action pill (`.ai-search-floating-pill`) with $\ge 48\text{px}$ touch target (Directive 5).
4. **Search History & In-Modal Help**: LocalStorage search history (`antigravity_recent_searches`) and in-modal cheatsheet overlay (`?` or `help`).

### Antigravity AI Search v3.0 Enterprise Power Suite
1. **Federated Workspace Omnisearch**: Smart Scope Toggle (`[This Page]` | `[All Apps]`) with auto-blend ranking, allowing discovery and deep-linking into all 26+ workspace apps from the search palette.
2. **Raycast-Style Action Studio**: System action commands via `>` (`> theme`, `> copy-url`, `> export-results`, `> clear-history`, `> scroll-top`, `> scroll-bottom`, `> help`).
3. **Safe Procedural Math Evaluator**: Non-`eval()` recursive descent math engine supporting arithmetic, percentages (`X% of Y`, `X + Y%`), scientific functions (`sqrt`, `round`, `abs`), constants (`pi`, `e`), and 1-tap clipboard copy.
4. **Dynamic Centered Keyword Windowing**: Slices a focused $\pm 12$-word contextual window around matched search terms with `<mark class="ai-search-highlight">` and match-source badges (`[Exact]`, `[Phonetic]`, `[Synonym]`, `[Transliterated]`, `[App]`, `[Math]`, `[Command]`).
5. **Result Pinning**: 1-tap `⭐ Pin` button that persists favorites in `localStorage` (`antigravity_pinned_searches`) and displays them as pinned shortcuts in the empty palette state.

---

## 8. Automated Quality & Verification Status

Run the test suite at any time via PowerShell:

```powershell
python "c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\Common-Resources\AI-Search-Kit\tests\test_ai_search.py"
```

### Test Suite Coverage (87 Tests Across 6 Tiers):
- **Baseline Tests (6)**: JS syntax compilation (`node --check`), BM25 scoring, demo HTML scripts, Directive 7 zero-music compliance, CSS structure, documentation integrity.
- **Tier 1 Feature Tests (25)**: R1-R5 core features (Did You Mean, Autocomplete, Categories, Soundex, Metaphone, Transliteration, Voice search, History, Help).
- **Tier 2 Boundary Tests (25)**: Edge cases (unmatchable gibberish, empty prefix, non-alpha Soundex, casing variations, punctuation stripping, storage quota/corruption, iPhone safe-area insets).
- **Tier 3 Pairwise Combinations (8)**: Transliteration + Categories, Voice + History, Did You Mean + History, Soundex vs BM25 weighting.
- **Tier 4 Real-World Workload Tests (5)**: App Portal, India Pincode Search, Weight Gain Guide, Namaz Prayer Times, 375px mobile viewport.
- **Tier 5 v3.0 Feature Tests (10)**: MathEvaluator arithmetic, percentages, math functions, division by zero guard, ActionStudio commands, PinnedSearches CRUD, centered windowing, catalog indexing, spelling suggestions, transliteration badges.
- **Tier 6 Architecture & Integrity Tests (8)**: Strict zero-`eval` security policy, Directive 5 touch hitbox ($\ge 48\text{px}$), Directive 7 zero-music compliance, AMOLED glassmorphic tokens, `demo.html` script compilation, `ai_search.js` compilation, theme toggle execution, portal catalog federation.

**Result: 87/87 Tests Passing (100% Green).**
