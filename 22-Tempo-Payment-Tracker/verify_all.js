const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

console.log('═══════════════════════════════════════════════════════');
console.log('   TEMPO HISAAB PRO — MASTER QUALITY & REGRESSION SUITE');
console.log('═══════════════════════════════════════════════════════\n');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Check Devanagari characters
const devanagariRegex = /[\u0900-\u097F]/g;
const devanagariMatches = html.match(devanagariRegex);
if (devanagariMatches && devanagariMatches.length > 0) {
  console.error(`❌ FAIL: Found ${devanagariMatches.length} Devanagari characters!`);
  process.exit(1);
} else {
  console.log('✅ PASS: 0 Devanagari characters found (100% Roman Urdu & English).');
}

// 2. Syntax check via AST compilation
const scriptStart = html.indexOf('<script>') + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
const jsCode = html.substring(scriptStart, scriptEnd);
const tempJsPath = path.join(process.env.TEMP, 'tempo_syntax_audit.js');
fs.writeFileSync(tempJsPath, jsCode, 'utf8');

try {
  execSync(`node --check "${tempJsPath}"`);
  console.log('✅ PASS: node --check AST compilation passed with 0 errors.');
} catch (err) {
  console.error('❌ FAIL: node --check failed!', err.message);
  process.exit(1);
} finally {
  if (fs.existsSync(tempJsPath)) fs.unlinkSync(tempJsPath);
}

// 3. Check document.getElementById IDs exist in HTML
const idRegex = /document\.getElementById\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
let match;
const usedIds = new Set();
while ((match = idRegex.exec(jsCode)) !== null) {
  usedIds.add(match[1]);
}

const htmlIds = new Set();
const htmlIdRegex = /\bid\s*=\s*['"`]([^'"`]+)['"`]/g;
while ((match = htmlIdRegex.exec(html)) !== null) {
  htmlIds.add(match[1]);
}

const missingIds = [];
for (const id of usedIds) {
  if (!htmlIds.has(id)) {
    missingIds.push(id);
  }
}

if (missingIds.length > 0) {
  console.error(`❌ FAIL: ${missingIds.length} missing DOM IDs:`, missingIds);
  process.exit(1);
} else {
  console.log(`✅ PASS: All ${usedIds.size} referenced getElementById IDs match defined DOM elements.`);
}

// 4. In-Memory VM Simulation of Financial Accounting & State Mutations
const mockStorage = {};
const localStorage = {
  getItem: (k) => (k in mockStorage ? mockStorage[k] : null),
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};

const mockElements = {};
function getOrCreateElement(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id,
      value: '',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      className: '',
      focus() {},
      click() {},
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k]; }
    };
  }
  return mockElements[id];
}

const document = {
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: () => [],
  querySelector: () => getOrCreateElement('mock-sel'),
  createElement: (tag) => {
    const el = getOrCreateElement('dynamic-' + Math.random().toString(36).substring(2, 7));
    el.tagName = tag.toUpperCase();
    return el;
  },
  body: getOrCreateElement('body'),
  documentElement: getOrCreateElement('html')
};

const window = {
  localStorage,
  document,
  AudioContext: class {
    createOscillator() { return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    get currentTime() { return 0; }
  },
  webkitAudioContext: null,
  addEventListener() {},
  open() {},
  location: { hash: '' }
};

const sandbox = {
  window,
  document,
  localStorage,
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  navigator: { userAgent: 'test' },
  location: window.location,
  Date,
  Math,
  parseFloat,
  parseInt,
  JSON,
  Array,
  Object,
  String,
  RegExp,
  Error
};

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);
function run(code) { return vm.runInContext(code, sandbox); }

// Test Theme persistence
run('initTheme()');
run('toggleTheme()');
const activeTheme = localStorage.getItem('tempo_theme');
if (activeTheme === 'light' || activeTheme === 'dark') {
  console.log(`✅ PASS: Theme toggle persisted (${activeTheme}).`);
} else {
  console.error('❌ FAIL: Theme not persisted properly.');
  process.exit(1);
}

// Test Express dispatch with apostrophe in name
getOrCreateElement('inp-transport').value = "D'Souza & King's Cargo";
getOrCreateElement('inp-city').value = "Goa";
getOrCreateElement('inp-count').value = "2";
getOrCreateElement('inp-advance').value = "600";
run("setParcelType('paid')");
run("saveExpressEntry(false)");
let entries = run("dbGetEntries()");

if (entries.length === 1 && entries[0].commission === 200 && entries[0].advanceGiven === 600) {
  console.log('✅ PASS: Express dispatch entry saved with correct commission and advance.');
} else {
  console.error('❌ FAIL: Express entry mismatch.');
  process.exit(1);
}

// Test Batch dispatch
run('initBatchRows()');
run("updateBatchRowField(0, 'transport', 'National Transport')");
run("updateBatchRowField(0, 'city', 'Delhi')");
run("setBatchRowType(0, 'unpaid')");
run("saveAllBatchRows()");
entries = run("dbGetEntries()");

if (entries.length === 2) {
  console.log('✅ PASS: Batch dispatch row saved successfully.');
} else {
  console.error('❌ FAIL: Batch row save failed.');
  process.exit(1);
}

// Test Settle Calculations:
// Entry 1: Paid, adv 600, actual slip 750, comm 200 => Net = 750 + 200 - 600 = +350.
// Entry 2: Unpaid, comm 100 => Net = +100.
// Net total = 450.
run("openBatchSettleModal()");
const pending = entries.filter(e => e.status === 'pending');
pending.forEach(e => {
  const chk = getOrCreateElement('batch-chk-' + e.id);
  chk.checked = true;
  if (e.type === 'paid') {
    getOrCreateElement('batch-actual-' + e.id).value = "750";
  }
});
run("recalcBatchCalculations()");
const netDue = run("batchSettlementData.netBeforeCash");

if (netDue === 450) {
  console.log('✅ PASS: Morning settlement net calculation verified (₹450).');
} else {
  console.error(`❌ FAIL: Expected ₹450 net due, got: ${netDue}`);
  process.exit(1);
}

// Hand over ₹500 note (₹50 round/diff)
run("setBatchCash(500)");
run("confirmBatchSettlement(false)");
const bal = run("dbGetBalance()");

if (bal.amount === 50 && bal.type === 'jama') {
  console.log('✅ PASS: Settlement change rounding verified (+₹50 JAMA credit).');
} else {
  console.error('❌ FAIL: Balance mismatch after settlement cash rounding.', bal);
  process.exit(1);
}

// Test Passbook Ledger event chronology
run("renderPassbookLedger()");
const passbookHtml = getOrCreateElement('passbook-entries-container').innerHTML;
if (passbookHtml.includes('Dispatch Adv') && passbookHtml.includes('Settle:') && passbookHtml.includes('Settlement Cash Diya')) {
  console.log('✅ PASS: Passbook Ledger rendered distinct chronological events.');
} else {
  console.error('❌ FAIL: Passbook Ledger missing expected event types.');
  process.exit(1);
}

// Test Dashboard metrics isolation: khata entries must not inflate parcel count
run("renderDashboardView()");
const parcelCountEl = getOrCreateElement('metric-parcels').textContent;
if (parcelCountEl === '3' || parcelCountEl === 3) { // 2 parcels (Entry 1) + 1 parcel (Entry 2) = 3 total parcels
  console.log('✅ PASS: Dashboard metrics correctly count only shipments (3 parcels), excluding cash entries.');
} else {
  console.error(`❌ FAIL: Parcel count inflation bug detected! Metric shows: ${parcelCountEl}, expected: 3`);
  process.exit(1);
}

// Test Parcel Log filtering: khata entries excluded from parcel shipment log
run("renderParcelLog()");
const parcelLogHtml = getOrCreateElement('history-entries-container').innerHTML;
if (!parcelLogHtml.includes('Settlement Cash Diya')) {
  console.log('✅ PASS: Parcel Log strictly displays shipment dispatches, isolating cash ledger entries.');
} else {
  console.error('❌ FAIL: Parcel Log incorrectly contains non-shipment khata cash entries.');
  process.exit(1);
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('   ALL QUALITY CHECKS & REGRESSION TESTS PASSED!       ');
console.log('═══════════════════════════════════════════════════════');
