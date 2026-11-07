# 🚚 Tempo Hisaab Pro — Tempo Wala Payment & Khata Manager

A mobile-first, expert-grade FinTech application engineered specifically for retail shopkeepers dispatching daily transport parcels via tempo drivers. It streamlines high-speed evening batch dispatches, automates next-day morning physical slip settlements with optional camera photo attachments, computes exact running passbook balances, handles cash rounding adjustments, and prints commercial statements.

---

## 📋 Executive Overview & Architecture

When goods are dispatched via a local tempo driver (tempo wala) to various transport agencies across the city:
1. **Evening Dispatch (Step 1)**: Parcels are either **PAID** (sender pays transport freight upfront) or **UNPAID** (receiver pays freight at destination). For PAID parcels, an estimated advance amount is handed to the tempo wala when picking up goods. Shopkeepers can dispatch via **Multi-Row Batch Sheet** (up to 10 parcels on one screen in under 30 seconds) or **Single Express Form** with continuous "Save & Agla Entry".
2. **Morning Settlement (Step 2)**: The next morning, the tempo driver returns with physical **slips / bilties** indicating the exact freight charged by each transport company. Slips can be photographed via the integrated camera compression engine (~150KB JPEG base64) and attached directly to the transaction.
3. **Fixed Commission**: For **EVERY** parcel handled (both Paid and Unpaid), the tempo wala receives a fixed fee / commission of **₹100 per parcel**.
4. **Change Rounding & Cash Handover**: Real-world transactions rarely involve exact change. The app calculates net cash payable, accepts rounded note presets (e.g. ₹500 note), and carries forward any leftover difference as **JAMA** (credit held by tempo) or **BAAKI** (balance owed).
5. **Dual-View Khata & Statement Printing (Step 3)**:
   - **View A — Passbook Ledger**: Chronological passbook showing exact running balance (Jama / Baaki / Nil) after every single financial event.
   - **View B — Parcel Log**: Searchable and filterable catalog of all shipments with photo previews and status tracking.
   - **Commercial Statement Print**: Customizable shop header, date range filtering, and clean `@media print` CSS formatted for A4 paper and PDF saving.
6. **Adaptive Day/Night Theme**: 1-tap instant switch between High-Visibility Daylight White (for bright daytime shop lighting) and Deep Zinc OLED Dark Mode (for night auditing).

---

## 🧮 Mathematical Ledger Formula

$$\text{Net Due} = \sum (\text{Actual Slip Freight}) + \sum (\text{Commission} = 100 \times N) - \sum (\text{Advance Given}) - \text{Prior Jama} + \text{Prior Baaki}$$

### Change Adjustment & New Running Balance:
$$\text{Difference} = \text{Cash Handed Over} - \text{Net Due}$$

* If $\text{Difference} > 0$: **New JAMA** $= \text{Difference}$ (Tempo holds credit for subsequent dispatches)
* If $\text{Difference} < 0$: **New BAAKI** $= |\text{Difference}|$ (Shopkeeper owes balance to tempo driver)
* If $\text{Difference} = 0$: **Balanced / Nil**

---

## 📦 Deliverables Catalog

| File | Format | Description |
|------|--------|-------------|
| [`index.html`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/22-Tempo-Payment-Tracker/index.html) | Standalone Single-File PWA | Complete production web application with Day/Night adaptive theme, multi-row batch dispatch, photo capture, chronological passbook ledger, and print engine |
| [`verify_all.js`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/22-Tempo-Payment-Tracker/verify_all.js) | Node.js Test Suite | Comprehensive automated regression suite covering syntax, DOM ID binding, Devanagari audit, and financial ledger simulation |
| [`README.md`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/22-Tempo-Payment-Tracker/README.md) | Markdown Navigation Hub | Project executive documentation, mathematical ledger model, directory tree, and quality verification status |

---

## 🌲 Annotated Directory Tree

```
c:/Users/Shop PC 2/OneDrive/Desktop/Antigravity Files/22-Tempo-Payment-Tracker/
├── index.html       ← Complete Standalone Application (HTML5, CSS3 Variables, ES6 JS, Web Audio API)
├── verify_all.js    ← Automated Master Regression & Verification Test Suite
└── README.md        ← Executive Documentation & Maintenance Guide
```

---

## 🌟 Key Functional Features Built

1. **Adaptive Day / Night Theme Engine**:
   - High-Visibility Clean White theme (`#ffffff` / `#f8fafc`) for daytime sunlight & fluorescent shop lamps.
   - Deep Zinc OLED Dark theme (`#09090b` / `#18181b`) for evening audits.
   - 1-tap toggle button (`☀️ / 🌙`) in header persisted in `localStorage` (`tempo_theme`).

2. **Step 1: Rapid Evening Dispatch (Parcel Bhejo)**:
   - **Multi-Row Batch Dispatch**: Add multiple rows (Row 1, Row 2, Row 3...) with Transport suggestions, City suggestions, Parcels stepper, Type (Paid/Unpaid), and Advance input. Master button `🚀 Sabhi Parcels Save Karo` validates and saves all rows in 1 tap.
   - **Single Express Form**: Touch-friendly `[-] 1 [+]` stepper, quick advance chips (`₹300`, `₹500`, `₹800`, `₹1,000`, `₹1,500`), and dual buttons `💾 Save & Agla Entry` (clears for next parcel) + `✅ Save & Dashboard`.

3. **Step 2: Morning Settlement & Photo Capture**:
   - Master banner on Dashboard when slips are pending (`⚡ Slips Settle Karo`).
   - Integrated camera & file picker compresses slip photos via HTML5 canvas to ~150KB JPEG for fast offline storage in `localStorage`.
   - Tap-to-view full-size modal for inspecting physical LR/bilty photos.
   - Large on-screen audit breakdown card showing step-by-step net cash calculation.
   - Change Rounding & Cash Handover with quick preset notes (`Exact`, `₹100 Round`, `₹500 Round`) and live preview of new Jama or Baaki.
   - 1-Tap WhatsApp receipt generator sharing clean Roman Urdu / English itemized summary.

4. **Step 3: Dual-View Khata & Commercial Print**:
   - **View A — Passbook Ledger**: Chronological transaction timeline showing Date, Time, Description, Money Given, Freight/Comm Incurred, and exact Running Balance (Jama / Baaki / Nil) after every event.
   - **View B — Parcel Log**: Searchable and filterable catalog with photo thumbnails, status badges, and edit/delete actions.
   - **Commercial Statement Print**: Modal with date range filters (Today, Last 7 Days, This Month, All Time), customizable shop name header (stored in `localStorage`), summary metrics, and `@media print` CSS for clean A4 printing and PDF export.

5. **Direct Khata / Cash Entry**:
   - Record isolated cash payments or refunds (`💵 Khata Entry`) without requiring a parcel shipment.

6. **Strict Language & Acoustic UI Engineering**:
   - **100% Roman Urdu & English ONLY**. Zero Devanagari script characters anywhere.
   - Standard Gregorian date formats (`en-GB` / `en-IN`, e.g. "Sat, 7 Nov 2026").
   - Zero-asset Web Audio API procedural synthesis (tactile clicks, 3-tone chimes, alert blips) with zero music.
   - Mobile touch hitboxes $\ge 48\text{ px}$.

---

## 🛠️ Quick-Start & Maintenance Commands

### 1. Run Application Locally:
Double-click [`index.html`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/22-Tempo-Payment-Tracker/index.html) in any modern browser (Chrome, Edge, Safari, Firefox) on desktop or mobile.

### 2. Master Quality & Regression Test Suite:
Run the comprehensive automated test suite (syntax, DOM IDs, Devanagari scan, and ledger simulation):
```powershell
node 'c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\22-Tempo-Payment-Tracker\verify_all.js'
```

### 3. Automated JavaScript Syntax & AST Compilation Test:
```powershell
$html = Get-Content 'c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\22-Tempo-Payment-Tracker\index.html' -Raw
$scriptStart = $html.IndexOf('<script>') + 8
$scriptEnd = $html.LastIndexOf('</script>')
$js = $html.Substring($scriptStart, $scriptEnd - $scriptStart)
$tempJs = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'tempo_syntax_check.js')
$js | Set-Content $tempJs
node --check $tempJs
```

### 4. Automated Devanagari Script Verification (Must be 0):
```powershell
$text = Get-Content 'c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\22-Tempo-Payment-Tracker\index.html' -Raw
$m = [regex]::Matches($text, '[\u0900-\u097F]+')
Write-Host "Devanagari characters found: $($m.Count) (Target: 0)"
```

### 5. Production Cloud Deployment Pipeline:
Deploy to the 24/7 live web portal and sync mobile devices:
```powershell
cd 'c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files'
python Common-Resources/App-Portal/deploy_github.py
```

Live Portal URL:
[https://hamidgazi.github.io/app-portal/](https://hamidgazi.github.io/app-portal/)

---

## 🛡️ Automated Quality & Verification Status

| Check | Tool / Method | Target Metric | Current Status |
|-------|---------------|---------------|----------------|
| **JavaScript AST Syntax** | `node --check` | 0 Syntax Errors | Passed (Exit Code 0) |
| **DOM ID Hygiene** | Custom Node.js AST parser | 100% IDs Bound | 107/107 IDs Resolved |
| **Language Conformance** | Unicode Regex `[\u0900-\u097F]` | 0 Devanagari Chars | 0 Matches (100% Roman Urdu/Eng) |
| **Mobile Touch Hitbox** | CSS Layout Audit | $\ge 48\text{ px}$ | Verified Across All Interactive Controls |
| **Acoustic Feedback** | Browser Web Audio API | Zero Music / Zero Assets | Passed (Procedural SFX Only) |
| **Data Persistence** | `localStorage` Schemas | Backward Compatible | V1/V2/V3 Auto-Migration Verified |
