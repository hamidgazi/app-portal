/**
 * ============================================================================
 * Courier Pincode & ODA Search Engine — High-Performance Mobile PWA
 * ============================================================================
 * Architecture:
 * - Mathematical Integer Range Binary Search (< 0.1 ms) for 6-digit Pincodes
 * - Dictionary-Interned Multi-Token Text Filter Search (< 2 ms) for City / Hub
 * - Top-50 DOM Virtualization Window + Dynamic Total Match Counter
 * - High-Visibility Logistics ODA Badging System
 * - Zero-Dependency Web Audio Micro-Haptic Feedback (Pop sound) & 1-Tap Copy
 * - Defensive Bootloader Isolation (try/catch per module) per LESSONS §20.1
 * - Strict DOM Hygiene & Element Verification per LESSONS §20.2 & GEMINI.md
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PincodeApp = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Application Global State
  const State = {
    db: null,             // { d: string[], r: Array<[pin, disp, orig, ret, city, state, oda]> }
    pins: null,           // Uint32Array of pre-sorted pincodes
    dLower: null,         // Array of lowercased dictionary strings
    metroMask: null,      // Uint8Array marking metro cities & hubs
    currentQuery: '',
    activeFilter: 'all',  // 'all' | 'oda' | 'standard' | 'metro'
    currentMatches: [],   // Array of matched row references
    totalMatchesCount: 0,
    renderedCount: 0,
    pageSize: 50,
    searchDebounceTimer: null,
    audioContext: null,
    audioAvailable: false,
    keyboardMode: 'numeric',
    recentSearches: []
  };

  // Metro centers catalog for quick filter
  const METRO_KEYWORDS = [
    'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'ahmedabad', 'pune'
  ];

  /* ==========================================================================
     1. Search Engine Core Algorithms (Mathematical Integer Range & Substring)
     ========================================================================== */

  /**
   * Fast lower bound binary search on sorted Uint32Array
   */
  function lowerBound(arr, val) {
    let low = 0, high = arr.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (arr[mid] < val) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  /**
   * Fast upper bound binary search on sorted Uint32Array
   */
  function upperBound(arr, val) {
    let low = 0, high = arr.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (arr[mid] <= val) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  /**
   * Evaluates if a record passes the active filter chip
   */
  function passesFilter(row, filterType) {
    if (filterType === 'all') return true;
    if (filterType === 'oda') return row[6] === 1;
    if (filterType === 'standard') return row[6] === 0 || row[6] === -1;
    if (filterType === 'metro') {
      if (!State.metroMask) return true;
      return State.metroMask[row[4]] === 1 || State.metroMask[row[1]] === 1;
    }
    return true;
  }

  /**
   * Mathematical Integer Range Binary Search for Pincode prefix / exact queries
   */
  function searchPincodePrefix(prefixStr, filterType) {
    const pStr = prefixStr.trim();
    if (!pStr || !/^\d{1,6}$/.test(pStr)) {
      return { matches: [], total: 0 };
    }

    const len = pStr.length;
    const val = parseInt(pStr, 10);
    const multiplier = Math.pow(10, 6 - len);
    const minVal = val * multiplier;
    const maxVal = minVal + multiplier - 1;

    const start = lowerBound(State.pins, minVal);
    const end = upperBound(State.pins, maxVal);

    if (start >= end) {
      return { matches: [], total: 0 };
    }

    const rows = State.db.r;

    // Fast path: if filter is 'all', all rows in range are matches
    if (filterType === 'all') {
      const total = end - start;
      const matches = [];
      for (let i = start; i < end; i++) {
        matches.push(rows[i]);
      }
      return { matches, total };
    }

    // Filtered range traversal
    const matches = [];
    for (let i = start; i < end; i++) {
      const row = rows[i];
      if (passesFilter(row, filterType)) {
        matches.push(row);
      }
    }

    return { matches, total: matches.length };
  }

  /**
   * High-Speed Multi-Token Substring Text Search across City, State, and Hubs
   */
  function searchTextQuery(queryStr, filterType) {
    const tokens = queryStr.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const rows = State.db.r;

    if (tokens.length === 0) {
      // Return all records filtered
      return getAllFiltered(filterType);
    }

    // Pre-calculate token match masks on dictionary strings
    const numDict = State.dLower.length;
    const tokenMasks = [];

    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];
      const mask = new Uint8Array(numDict);
      let anyMatch = false;

      for (let i = 0; i < numDict; i++) {
        if (State.dLower[i].indexOf(token) !== -1) {
          mask[i] = 1;
          anyMatch = true;
        }
      }

      if (!anyMatch) {
        // Token matched zero dictionary strings -> impossible to match any record
        return { matches: [], total: 0 };
      }

      tokenMasks.push(mask);
    }

    const matches = [];
    const numTokens = tokenMasks.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Check active filter first for fast discard
      if (!passesFilter(row, filterType)) {
        continue;
      }

      // Check all tokens against [disp, orig, ret, city, state]
      let allTokensMatch = true;
      for (let t = 0; t < numTokens; t++) {
        const mask = tokenMasks[t];
        if (
          mask[row[4]] !== 1 && // city
          mask[row[5]] !== 1 && // state
          mask[row[1]] !== 1 && // dispatch
          mask[row[2]] !== 1 && // origin
          mask[row[3]] !== 1    // return
        ) {
          allTokensMatch = false;
          break;
        }
      }

      if (allTokensMatch) {
        matches.push(row);
      }
    }

    return { matches, total: matches.length };
  }

  /**
   * Returns all records filtered by the active chip
   */
  function getAllFiltered(filterType) {
    const rows = State.db.r;
    if (filterType === 'all') {
      return { matches: rows.slice(), total: rows.length };
    }

    const matches = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (passesFilter(row, filterType)) {
        matches.push(row);
      }
    }
    return { matches, total: matches.length };
  }

  /**
   * Smart Address Extractor: Extracts 6-digit Indian postal code from messy address or text string.
   * Handles formats:
   * - Pure: "395003" -> "395003"
   * - Embedded: "Plot 12, GIDC, Surat - 395002, Gujarat" -> "395002"
   * - Spaced/Hyphenated: "Surat 395 003" or "Surat 395-003" -> "395003"
   * - Word boundary guard: does not match inside 10-digit phone numbers (e.g. 9876543210)
   */
  function extractPincodeFromText(text) {
    if (!text || typeof text !== 'string') return null;
    // 1. Check for spaced or hyphenated 6-digit pincode: 395 003 or 395-003
    const spacedMatch = text.match(/\b([1-9][0-9]{2})\s*[- ]\s*([0-9]{3})\b/);
    if (spacedMatch) {
      return spacedMatch[1] + spacedMatch[2];
    }
    // 2. Check for standard 6-digit pincode with word boundaries
    const pinMatch = text.match(/\b([1-9][0-9]{5})\b/);
    if (pinMatch) {
      return pinMatch[1];
    }
    return null;
  }

  /**
   * Master query routing function
   */
  function executeSearch(queryStr, filterType) {
    const q = queryStr.trim();
    if (!q) {
      return getAllFiltered(filterType);
    }

    if (/^\d+$/.test(q)) {
      return searchPincodePrefix(q, filterType);
    } else {
      // Check if text query contains a 6-digit pincode embedded in it
      const embeddedPin = extractPincodeFromText(q);
      if (embeddedPin) {
        return searchPincodePrefix(embeddedPin, filterType);
      }
      return searchTextQuery(q, filterType);
    }
  }

  /* ==========================================================================
     2. Record Resolver & Clipboard Formatter
     ========================================================================== */

  /**
   * Resolves dictionary indices into full text object
   */
  function resolveRecord(row) {
    if (!row || !State.db) return null;
    const d = State.db.d;
    return {
      pincode: row[0],
      dispatch_center: d[row[1]] || '',
      origin_center: d[row[2]] || '',
      return_center: d[row[3]] || '',
      city: d[row[4]] || '',
      state: d[row[5]] || '',
      oda: row[6],
      oda_status: row[6] === 1 ? 'ODA' : (row[6] === 0 ? 'Standard Delivery' : 'Unspecified')
    };
  }

  /**
   * Formats courier dispatch text for 1-tap clipboard copy
   */
  function formatCopyPayload(rec) {
    const statusLabel = rec.oda === 1
      ? 'ODA (Extended SLA / Surcharge)'
      : (rec.oda === 0 ? 'Standard Delivery' : 'Standard (Unspecified)');

    return (
      'PIN: ' + rec.pincode + ' | ' +
      'City: ' + rec.city + ' | ' +
      'State: ' + rec.state + ' | ' +
      'Dispatch Hub: ' + rec.dispatch_center + ' | ' +
      'Status: ' + statusLabel
    );
  }

  /* ==========================================================================
     3. Web Audio Micro-Haptics Module (LESSONS §3.1)
     ========================================================================== */

  function getAudioContext() {
    if (!State.audioContext && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        State.audioContext = new AudioCtor();
        State.audioAvailable = true;
      } catch (err) {
        console.warn('[Audio] Web Audio initialization warning:', err);
      }
    }
    if (State.audioContext && State.audioContext.state === 'suspended') {
      State.audioContext.resume().catch(function () {});
    }
    return State.audioContext;
  }

  /**
   * Synthesizes 520Hz -> 300Hz Sine Wave Pop (70ms duration) on 1-tap copy
   */
  function playPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // Micro-haptics is non-critical; never throw
    }
  }

  /* ==========================================================================
     4. UI Rendering Engine & Virtual Windowing (Top-50 + Load More)
     ========================================================================== */

  /**
   * Generates HTML card markup for a single courier record
   */
  function renderCardHTML(row, index) {
    const rec = resolveRecord(row);
    if (!rec) return '';

    // Plain-English Delivery & ODA Status Badges
    let badgeHTML = '';
    if (rec.oda === 1) {
      badgeHTML = (
        '<span class="oda-badge oda-badge-warning" aria-label="ODA: Remote Area (Extra Charges / 1-2 Days Extra)">' +
          '<span class="badge-headline">⚠️ ODA: Remote Area</span>' +
          '<span class="badge-subtext">Extra Charges &bull; +1&ndash;2 Days</span>' +
        '</span>'
      );
    } else if (rec.oda === 0) {
      badgeHTML = (
        '<span class="oda-badge oda-badge-standard" aria-label="Standard Delivery (Normal Rate & Regular Speed)">' +
          '<span class="badge-headline">🟢 Standard Delivery</span>' +
          '<span class="badge-subtext">Normal Rate &bull; Regular Speed</span>' +
        '</span>'
      );
    } else {
      badgeHTML = (
        '<span class="oda-badge oda-badge-unspecified" aria-label="Standard Delivery (Regular Speed)">' +
          '<span class="badge-headline">ℹ️ Standard Delivery</span>' +
          '<span class="badge-subtext">Regular Speed</span>' +
        '</span>'
      );
    }

    // Hub Smart Deduplication (F06)
    const isUnified = (rec.dispatch_center === rec.origin_center && rec.dispatch_center === rec.return_center);
    let hubLinesHTML = '';

    if (isUnified) {
      hubLinesHTML = (
        '<div class="hub-line"><strong>🏢 Hub:</strong> <span>' + escapeHTML(rec.dispatch_center) + '</span></div>' +
        '<div class="hub-line hub-line-unified"><span>📦 Unified: Dispatch • Origin • Return</span></div>'
      );
    } else {
      hubLinesHTML = '<div class="hub-line"><strong>🏢 Dispatch:</strong> <span>' + escapeHTML(rec.dispatch_center) + '</span></div>';
      if (rec.origin_center !== rec.dispatch_center) {
        hubLinesHTML += '<div class="hub-line"><strong>📦 Origin:</strong> <span>' + escapeHTML(rec.origin_center) + '</span></div>';
      }
      if (rec.return_center !== rec.dispatch_center) {
        hubLinesHTML += '<div class="hub-line"><strong>🔄 Return:</strong> <span>' + escapeHTML(rec.return_center) + '</span></div>';
      }
    }

    return (
      '<article class="pincode-card" data-index="' + index + '" data-pin="' + rec.pincode + '" role="article" tabindex="0">' +
        '<div class="card-header-row">' +
          '<span class="card-pincode">' + rec.pincode + '</span>' +
          badgeHTML +
        '</div>' +
        '<div class="card-location-row">' +
          '<span class="location-icon" aria-hidden="true">📍</span>' +
          '<span class="location-text">' + escapeHTML(rec.city) + ', ' + escapeHTML(rec.state) + '</span>' +
        '</div>' +
        '<div class="card-hub-box">' +
          hubLinesHTML +
        '</div>' +
        '<div class="card-footer-row">' +
          '<button class="btn-card-copy" type="button" aria-label="Copy ' + rec.pincode + ' details">' +
            '<span aria-hidden="true">📋</span> Copy Details' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Renders the current slice of matches to the DOM
   */
  function renderResults(append) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');
    const loadMoreContainer = document.getElementById('load-more-container');
    const btnLoadMore = document.getElementById('btn-load-more');
    const statsMatchBadge = document.getElementById('stats-match-badge');

    if (!container) return;

    const matches = State.currentMatches;
    const total = State.totalMatchesCount;

    if (total === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      if (statsMatchBadge) statsMatchBadge.textContent = '0 pincodes found';
      State.renderedCount = 0;
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const startIndex = append ? State.renderedCount : 0;
    const endIndex = Math.min(startIndex + State.pageSize, total);

    let htmlChunk = '';
    for (let i = startIndex; i < endIndex; i++) {
      htmlChunk += renderCardHTML(matches[i], i);
    }

    if (append) {
      container.insertAdjacentHTML('beforeend', htmlChunk);
    } else {
      container.innerHTML = htmlChunk;
    }

    State.renderedCount = endIndex;

    // Update Stats Badge
    if (statsMatchBadge) {
      if (!State.currentQuery && State.activeFilter === 'all') {
        statsMatchBadge.textContent = 'Showing ' + State.renderedCount + ' of ' + total.toLocaleString() + ' pincodes';
      } else if (total <= State.pageSize) {
        statsMatchBadge.textContent = 'Showing all ' + total.toLocaleString() + ' matching pincodes';
      } else {
        statsMatchBadge.textContent = 'Found ' + total.toLocaleString() + ' pincodes • Showing ' + State.renderedCount;
      }
    }

    // Update Load More Button
    if (loadMoreContainer && btnLoadMore) {
      if (State.renderedCount < total) {
        loadMoreContainer.style.display = 'flex';
        const remaining = total - State.renderedCount;
        const nextBatch = Math.min(remaining, State.pageSize);
        btnLoadMore.textContent = 'Load More (+' + nextBatch + ') • ' + State.renderedCount + ' of ' + total.toLocaleString();
      } else {
        loadMoreContainer.style.display = 'none';
      }
    }
  }

  /**
   * Performs an immediate reactive search update
   */
  function performSearch() {
    const startTime = performance.now();

    const result = executeSearch(State.currentQuery, State.activeFilter);
    State.currentMatches = result.matches;
    State.totalMatchesCount = result.total;

    renderResults(false);

    const elapsedMs = performance.now() - startTime;
    const statsSpeedBadge = typeof document !== 'undefined' ? document.getElementById('stats-speed-badge') : null;
    if (statsSpeedBadge) {
      if (elapsedMs < 0.1) {
        statsSpeedBadge.textContent = '⚡ < 0.1 ms';
      } else {
        statsSpeedBadge.textContent = '⚡ ' + elapsedMs.toFixed(2) + ' ms';
      }
    }
  }

  /* ==========================================================================
     5. Toast & Clipboard Copy Operations
     ========================================================================== */

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('copy-toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast) return;

    if (toastMsg) {
      toastMsg.textContent = message;
    }

    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 2000);
  }

  function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        playPopSound();
        showToast(successMessage || '✓ Copied to clipboard!');
      }).catch(function () {
        fallbackCopyText(text, successMessage);
      });
    } else {
      fallbackCopyText(text, successMessage);
    }
  }

  function fallbackCopyText(text, successMessage) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        playPopSound();
        showToast(successMessage || '✓ Copied to clipboard!');
      } else {
        showToast('⚠️ Copy failed, please copy manually');
      }
    } catch (err) {
      showToast('⚠️ Copy failed: ' + err);
    }
  }

  /* ==========================================================================
     6. Defensive Component Bootloader Modules
     ========================================================================== */

  /**
   * Module 1: Data Hydration & Store Loader
   */
  function initDataStore() {
    try {
      const customRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('pincode_custom_db') : null;
      if (customRaw) {
        const customDb = JSON.parse(customRaw);
        if (customDb && Array.isArray(customDb.r) && Array.isArray(customDb.d)) {
          console.log('[DataStore] Loaded custom dataset from localStorage (' + customDb.r.length + ' records).');
          hydrateDatabase(customDb);
          return;
        }
      }
    } catch (e) {
      console.warn('[DataStore] localStorage read error:', e);
    }

    if (window.PINCODE_DB && Array.isArray(window.PINCODE_DB.r) && Array.isArray(window.PINCODE_DB.d)) {
      hydrateDatabase(window.PINCODE_DB);
      return;
    }

    // Fallback: check if we should fetch data/pincodes.json
    console.log('[DataStore] window.PINCODE_DB not found, fetching data/pincodes.json...');
    fetch('data/pincodes.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        window.PINCODE_DB = data;
        hydrateDatabase(data);
        performSearch();
      })
      .catch(function (err) {
        console.error('[DataStore] Failed to fetch data/pincodes.json:', err);
        const statsMatchBadge = document.getElementById('stats-match-badge');
        if (statsMatchBadge) {
          statsMatchBadge.textContent = 'Database loading error';
        }
      });
  }

  function hydrateDatabase(data) {
    State.db = data;
    const r = data.r;
    const total = r.length;

    // Pre-extract Uint32Array for fast binary search
    const pins = new Uint32Array(total);
    for (let i = 0; i < total; i++) {
      pins[i] = r[i][0];
    }
    State.pins = pins;

    // Pre-compute lowercased dictionary strings
    const d = data.d;
    const dLower = new Array(d.length);
    for (let i = 0; i < d.length; i++) {
      dLower[i] = (d[i] || '').toLowerCase();
    }
    State.dLower = dLower;

    // Pre-compute Metro mask
    const metroMask = new Uint8Array(d.length);
    for (let i = 0; i < d.length; i++) {
      const str = dLower[i];
      for (let k = 0; k < METRO_KEYWORDS.length; k++) {
        if (str.indexOf(METRO_KEYWORDS[k]) !== -1) {
          metroMask[i] = 1;
          break;
        }
      }
    }
    State.metroMask = metroMask;

    console.log('[DataStore] Hydrated ' + total.toLocaleString() + ' pincodes successfully.');
  }

  /**
   * Module 2: Search Engine Core Initialization
   */
  function initSearchEngine() {
    if (!State.db) {
      console.warn('[SearchEngine] Database not yet loaded; waiting for hydration.');
      return;
    }
    // Prime initial search (all records)
    const result = getAllFiltered(State.activeFilter);
    State.currentMatches = result.matches;
    State.totalMatchesCount = result.total;
  }

  /**
   * Module 3: Search UI, Input & Debounce Handlers
   */
  function initSearchUI() {
    if (typeof document === 'undefined') return;
    const searchInput = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const btnPasteSearch = document.getElementById('btn-paste-search');
    const btnResetEmpty = document.getElementById('btn-empty-reset');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const val = e.target.value;
        State.currentQuery = val;
        const trimmed = val.trim();

        // Toggle clear button
        if (btnClearSearch) {
          btnClearSearch.style.display = val.length > 0 ? 'inline-flex' : 'none';
        }

        // 6th Digit Auto-Dismiss: If exactly 6 digits are typed, auto-hide keyboard immediately
        if (/^\d{6}$/.test(trimmed)) {
          if (State.searchDebounceTimer) {
            clearTimeout(State.searchDebounceTimer);
          }
          searchInput.blur();

          // Also close on-screen numpad if open
          const numpad = document.getElementById('quick-numpad');
          if (numpad && numpad.style.display !== 'none') {
            numpad.style.display = 'none';
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.classList.remove('has-numpad-open');
          }

          playPopSound();
          performSearch();
          saveRecentSearch(trimmed);
          return;
        }

        // Adaptive zero-lag debounce:
        // Pure digits: 0-10ms (instant binary search)
        // Text: 25ms
        const debounceMs = /^\d+$/.test(trimmed) ? 5 : 25;

        if (State.searchDebounceTimer) {
          clearTimeout(State.searchDebounceTimer);
        }

        State.searchDebounceTimer = setTimeout(function () {
          performSearch();
        }, debounceMs);
      });

      // Direct paste listener: automatically extracts 6-digit pincode if present in pasted text
      searchInput.addEventListener('paste', function (e) {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        if (pasted) {
          const extracted = extractPincodeFromText(pasted);
          if (extracted && extracted !== pasted.trim()) {
            e.preventDefault();
            searchInput.value = extracted;
            State.currentQuery = extracted;
            if (btnClearSearch) btnClearSearch.style.display = 'inline-flex';
            searchInput.blur();
            playPopSound();
            showToast('📋 Extracted Pincode: ' + extracted);
            performSearch();
            saveRecentSearch(extracted);
          }
        }
      });

      // Enter / Search key on native mobile keyboard: auto-hide keyboard and show results
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchInput.blur(); // Dismisses mobile OS keyboard immediately
          playPopSound();
          if (State.currentQuery && State.currentQuery.trim()) {
            saveRecentSearch(State.currentQuery.trim());
          }
          performSearch();
        }
      });

      // 1-Tap Smart Paste Button
      if (btnPasteSearch) {
        btnPasteSearch.addEventListener('click', function () {
          handleSmartPaste();
        });
      }

      // Clear search button
      if (btnClearSearch) {
        btnClearSearch.addEventListener('click', function () {
          searchInput.value = '';
          State.currentQuery = '';
          btnClearSearch.style.display = 'none';
          searchInput.focus();
          performSearch();
        });
      }

      // Empty state reset button
      if (btnResetEmpty) {
        btnResetEmpty.addEventListener('click', function () {
          searchInput.value = '';
          State.currentQuery = '';
          if (btnClearSearch) btnClearSearch.style.display = 'none';
          setActiveFilter('all');
          searchInput.focus();
        });
      }
    } else {
      console.error('[DOM Error] Required element #search-input not found.');
    }
  }

  /**
   * Module 4: Filter Chips Controller
   */
  function initFilterChips() {
    if (typeof document === 'undefined') return;
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const filterType = chip.getAttribute('data-filter') || 'all';
        setActiveFilter(filterType);
        playPopSound();
      });
    });
  }

  function setActiveFilter(filterType) {
    State.activeFilter = filterType;
    if (typeof document !== 'undefined') {
      const chips = document.querySelectorAll('.filter-chip');
      chips.forEach(function (chip) {
        if (chip.getAttribute('data-filter') === filterType) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }
    performSearch();
  }

  /**
   * Module 5: Web Audio Micro-Haptics Pre-Warm
   */
  function initAudioHaptics() {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    // Unlock AudioContext on first user interaction per browser autoplay policy
    const unlockAudio = function () {
      getAudioContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
  }

  /**
   * Module 6: Clipboard & 1-Tap Whole-Card Delegation (LESSONS §20.3)
   */
  function initClipboard() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('results-container');
    if (!container) return;

    // Whole-card & button click delegation
    container.addEventListener('click', function (e) {
      const card = e.target.closest('.pincode-card');
      if (!card) return;

      const index = parseInt(card.getAttribute('data-index'), 10);
      if (isNaN(index) || !State.currentMatches[index]) return;

      const row = State.currentMatches[index];
      const rec = resolveRecord(row);
      if (!rec) return;

      // Handle Copy button or whole-card tap
      const payload = formatCopyPayload(rec);
      copyTextToClipboard(payload, '✓ Copied ' + rec.pincode + ' details!');
    });

    // Keyboard accessibility for cards
    container.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.pincode-card');
        if (card) {
          e.preventDefault();
          card.click();
        }
      }
    });
  }

  /**
   * Module 7: Touch Ergonomics, Load More & Infinite Scroll
   */
  function initTouchAndScroll() {
    if (typeof document === 'undefined') return;
    const btnLoadMore = document.getElementById('btn-load-more');
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', function () {
        playPopSound();
        renderResults(true);
      });
    }

    // Auto load more using IntersectionObserver on sentinel
    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (State.renderedCount < State.totalMatchesCount) {
            renderResults(true);
          }
        }
      }, {
        rootMargin: '250px'
      });
      observer.observe(sentinel);
    }
  }

  /**
   * Module 8: Excel & Data Updater Modal Controller (Milestone 4)
   */
  function initExcelUpdater() {
    if (typeof document === 'undefined') return;
    const btnOpen = document.getElementById('btn-excel-updater');
    const modal = document.getElementById('updater-modal');
    const btnClose = document.getElementById('btn-close-updater');
    const btnDismiss = document.getElementById('btn-dismiss-updater');
    const backdrop = document.getElementById('updater-backdrop');
    const btnRestore = document.getElementById('btn-restore-bundled');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('excel-file-input');
    const statusDiv = document.getElementById('updater-status');

    if (!btnOpen || !modal) return;

    function openModal() {
      modal.style.display = 'flex';
      playPopSound();
      if (statusDiv) statusDiv.style.display = 'none';
    }

    function closeModal() {
      modal.style.display = 'none';
    }

    btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnDismiss) btnDismiss.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    function showStatus(html, isError) {
      if (!statusDiv) return;
      statusDiv.innerHTML = html;
      statusDiv.className = isError ? 'updater-status status-error' : 'updater-status status-success';
      statusDiv.style.display = 'block';
    }

    function processFile(file) {
      if (!file) return;
      const name = file.name.toLowerCase();

      if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
        showStatus(
          '<strong>📊 Courier Spreadsheet Detected:</strong> ' + file.name + '<br>' +
          'To compress and index this 20,000+ row file into instant-search format, ' +
          'drag & drop it onto <code>UPDATE_EXCEL.bat</code> in the app folder on your computer.<br>' +
          '<small style="color:#8b949e;">It will recompile the dataset in &lt; 2s and refresh your offline app automatically.</small>',
          false
        );
        return;
      }

      if (name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const data = JSON.parse(e.target.result);
            if (data && Array.isArray(data.r) && Array.isArray(data.d)) {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('pincode_custom_db', JSON.stringify(data));
              }
              hydrateDatabase(data);
              performSearch();
              showStatus('✓ Successfully imported ' + data.r.length.toLocaleString() + ' pincodes!', false);
              showToast('✓ Updated database with ' + data.r.length + ' records!');
              playPopSound();
            } else {
              showStatus('⚠️ Invalid JSON schema: Expected { d: string[], r: array[] } format.', true);
            }
          } catch (err) {
            showStatus('⚠️ JSON parsing error: ' + err.message, true);
          }
        };
        reader.readAsText(file);
        return;
      }

      showStatus('⚠️ Unsupported file format. Please drop an .xlsx, .xls, .csv, or .json file.', true);
    }

    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
          processFile(fileInput.files[0]);
        }
      });
    }

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(function (eventName) {
        dropZone.addEventListener(eventName, function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-active');
        }, false);
      });

      dropZone.addEventListener('drop', function (e) {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          processFile(dt.files[0]);
        }
      }, false);
    }

    if (btnRestore) {
      btnRestore.addEventListener('click', function () {
        if (window.confirm('Restore bundled factory pincode dataset?')) {
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('pincode_custom_db');
          }
          initDataStore();
          performSearch();
          closeModal();
          showToast('✓ Restored factory pincode database');
        }
      });
    }
  }

  /**
   * Module 9: PWA Service Worker Registration & Offline Caching
   */
  function initServiceWorker() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js')
          .then(function (reg) {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch(function (err) {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }
  }

  /**
   * Module 10: On-Screen Mobile Numeric Keypad Controller (Default Docked)
   */
  function initNumberPad() {
    if (typeof document === 'undefined') return;
    const btnToggle = document.getElementById('btn-toggle-numpad');
    const numpad = document.getElementById('quick-numpad');
    const btnClose = document.getElementById('btn-close-numpad');
    const searchInput = document.getElementById('search-input');
    const mainContent = document.getElementById('main-content');
    if (!numpad || !searchInput) return;

    function toggleNumpad(show) {
      const isVisible = numpad.style.display !== 'none';
      const target = (typeof show === 'boolean') ? show : !isVisible;
      numpad.style.display = target ? 'block' : 'none';
      if (mainContent) {
        if (target) {
          mainContent.classList.add('has-numpad-open');
        } else {
          mainContent.classList.remove('has-numpad-open');
        }
      }
      if (btnToggle) {
        if (target) {
          btnToggle.classList.add('active');
        } else {
          btnToggle.classList.remove('active');
        }
      }
      playPopSound();
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        toggleNumpad();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', function () {
        toggleNumpad(false);
      });
    }

    // Tapping search input in numeric mode opens/re-docks Pin Pad if closed,
    // and prevents the phone's native keyboard from opening
    searchInput.addEventListener('click', function () {
      if (State.keyboardMode === 'numeric') {
        if (numpad.style.display === 'none') {
          toggleNumpad(true);
        }
      }
    });

    searchInput.addEventListener('focus', function () {
      if (State.keyboardMode === 'numeric') {
        searchInput.setAttribute('inputmode', 'none');
        if (numpad.style.display === 'none') {
          toggleNumpad(true);
        }
      }
    });

    // Interactive Keypad Delegation
    numpad.addEventListener('click', function (e) {
      const keyBtn = e.target.closest('.num-key');
      if (!keyBtn) return;
      const keyAction = keyBtn.getAttribute('data-key');
      playPopSound();

      if (keyAction === 'clear') {
        searchInput.value = '';
        State.currentQuery = '';
        const btnClear = document.getElementById('btn-clear-search');
        if (btnClear) btnClear.style.display = 'none';
        performSearch();
        return;
      }

      if (keyAction === 'backspace') {
        searchInput.value = searchInput.value.slice(0, -1);
        State.currentQuery = searchInput.value;
        const btnClear = document.getElementById('btn-clear-search');
        if (btnClear) btnClear.style.display = searchInput.value ? 'inline-flex' : 'none';
        performSearch();
        return;
      }

      if (keyAction === 'enter') {
        // When Enter is tapped on Pin Pad: save recent search and search, but stay docked!
        if (searchInput && searchInput.value.trim()) {
          saveRecentSearch(searchInput.value.trim());
        }
        performSearch();
        return;
      }

      if (/^\d$/.test(keyAction)) {
        if (!/^\d*$/.test(searchInput.value)) {
          // If search was previously text, start fresh numeric entry
          searchInput.value = keyAction;
        } else if (searchInput.value.length < 6) {
          searchInput.value += keyAction;
        } else {
          // If already 6 digits, replace with new starting digit
          searchInput.value = keyAction;
        }
        State.currentQuery = searchInput.value;
        const btnClear = document.getElementById('btn-clear-search');
        if (btnClear) btnClear.style.display = 'inline-flex';
        performSearch();

        // When 6 digits are reached: save recent search, search immediately, and remain docked for rapid checking!
        if (searchInput.value.length === 6) {
          saveRecentSearch(searchInput.value);
        }
      }
    });

    // Ensure numpad is active by default
    toggleNumpad(true);
  }

  /**
   * Module 11: Mobile Keyboard Mode Switcher (123 Pin vs ABC City)
   */
  function initInputModeSwitcher() {
    if (typeof document === 'undefined') return;
    const btnMode = document.getElementById('btn-input-mode');
    const searchInput = document.getElementById('search-input');
    const numpad = document.getElementById('quick-numpad');
    const mainContent = document.getElementById('main-content');
    const btnToggleNumpad = document.getElementById('btn-toggle-numpad');
    if (!btnMode || !searchInput) return;

    function setKeyboardMode(mode) {
      State.keyboardMode = mode;
      const isNum = (mode === 'numeric');

      if (isNum) {
        // Numeric mode: native phone keyboard disabled via inputmode="none", Pin Pad docked
        searchInput.setAttribute('inputmode', 'none');
        searchInput.removeAttribute('pattern');
        searchInput.setAttribute('placeholder', 'Enter 6-digit Pincode (or tap ABC for City)...');
        btnMode.className = 'btn-input-mode mode-numeric';
        btnMode.innerHTML = '<span class="mode-icon" aria-hidden="true">🔢</span><span class="mode-label">123</span>';
        btnMode.setAttribute('title', 'Currently Number Mode: Tap to switch to ABC City Mode');

        // Show docked Pin Pad
        if (numpad) numpad.style.display = 'block';
        if (mainContent) mainContent.classList.add('has-numpad-open');
        if (btnToggleNumpad) btnToggleNumpad.classList.add('active');

        // Dismiss any open native phone keyboard
        searchInput.blur();
      } else {
        // Text mode: Pin Pad hidden, native phone keyboard enabled via inputmode="text"
        if (numpad) numpad.style.display = 'none';
        if (mainContent) mainContent.classList.remove('has-numpad-open');
        if (btnToggleNumpad) btnToggleNumpad.classList.remove('active');

        searchInput.setAttribute('inputmode', 'text');
        searchInput.removeAttribute('pattern');
        searchInput.setAttribute('placeholder', 'Search City or Hub (e.g. Surat, Delhi)...');
        btnMode.className = 'btn-input-mode mode-text';
        btnMode.innerHTML = '<span class="mode-icon" aria-hidden="true">🔤</span><span class="mode-label">ABC</span>';
        btnMode.setAttribute('title', 'Currently City Mode: Tap to switch to 123 Pincode Mode');

        // Automatically focus search input so phone opens the native QWERTY keyboard
        setTimeout(function () {
          searchInput.focus();
        }, 50);
      }

      playPopSound();
    }

    btnMode.addEventListener('click', function (e) {
      e.preventDefault();
      const nextMode = (State.keyboardMode === 'numeric') ? 'text' : 'numeric';
      setKeyboardMode(nextMode);
    });

    // Initialize with numeric mode
    setKeyboardMode('numeric');
  }

  /* ==========================================================================
     Recent Searches & Smart Paste Module
     ========================================================================== */

  const RECENT_STORAGE_KEY = 'pincode_recent_searches_v1';
  const MAX_RECENT_SEARCHES = 8;

  function loadRecentSearches() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[RecentSearches] Failed to load from localStorage:', e);
      return [];
    }
  }

  function saveRecentSearch(query) {
    if (!query || typeof query !== 'string') return;
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    let recent = loadRecentSearches();
    // Filter out if duplicate
    recent = recent.filter(function (item) {
      return item.query.toLowerCase() !== cleanQuery.toLowerCase();
    });

    let cityLabel = '';
    let isOda = false;

    // If query is a 6-digit pincode, lookup details in State.db
    if (/^\d{6}$/.test(cleanQuery) && State.db && State.pins) {
      const pinInt = parseInt(cleanQuery, 10);
      const idx = lowerBound(State.pins, pinInt);
      if (idx < State.pins.length && State.pins[idx] === pinInt) {
        const row = State.db.r[idx];
        cityLabel = State.db.d[row[4]] || '';
        isOda = row[6] === 1;
      }
    }

    recent.unshift({
      query: cleanQuery,
      city: cityLabel,
      oda: isOda,
      isPin: /^\d{6}$/.test(cleanQuery)
    });

    if (recent.length > MAX_RECENT_SEARCHES) {
      recent = recent.slice(0, MAX_RECENT_SEARCHES);
    }

    State.recentSearches = recent;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
      }
    } catch (e) {
      console.warn('[RecentSearches] Failed to save to localStorage:', e);
    }

    renderRecentSearches();
  }

  function clearRecentSearches() {
    State.recentSearches = [];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(RECENT_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('[RecentSearches] Failed to clear localStorage:', e);
    }
    renderRecentSearches();
  }

  function renderRecentSearches() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('recent-searches-container');
    const chipsList = document.getElementById('recent-chips-list');
    if (!container || !chipsList) return;

    const recent = State.recentSearches && State.recentSearches.length > 0
      ? State.recentSearches
      : loadRecentSearches();
    State.recentSearches = recent;

    if (!recent || recent.length === 0) {
      container.style.display = 'none';
      chipsList.innerHTML = '';
      return;
    }

    container.style.display = 'flex';
    chipsList.innerHTML = recent.map(function (item) {
      let badgeHtml = '';
      if (item.oda) {
        badgeHtml = ' <span class="chip-badge-oda" title="ODA: Remote Area">⚠️ ODA</span>';
      }
      const cityHtml = item.city ? (' <span class="chip-city">&bull; ' + escapeHTML(item.city) + '</span>') : '';
      return (
        '<button type="button" class="recent-chip" data-query="' + escapeHTML(item.query) + '" aria-label="Search ' + escapeHTML(item.query) + '">' +
          '<span class="chip-pin">' + escapeHTML(item.query) + '</span>' +
          cityHtml +
          badgeHtml +
        '</button>'
      );
    }).join('');
  }

  function handleSmartPaste() {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
      showToast('⚠️ Clipboard access not available. Please paste directly into search box.');
      return;
    }
    navigator.clipboard.readText().then(function (text) {
      if (!text || !text.trim()) {
        showToast('⚠️ Clipboard is empty.');
        return;
      }
      const cleanText = text.trim();
      const extractedPin = extractPincodeFromText(cleanText);
      const searchInput = document.getElementById('search-input');
      const btnClearSearch = document.getElementById('btn-clear-search');

      if (extractedPin) {
        if (searchInput) {
          searchInput.value = extractedPin;
          State.currentQuery = extractedPin;
          searchInput.blur();
        }
        if (btnClearSearch) btnClearSearch.style.display = 'inline-flex';
        playPopSound();
        showToast('📋 Extracted Pincode: ' + extractedPin);
        performSearch();
        saveRecentSearch(extractedPin);
      } else {
        // Fallback: paste full text (e.g. city or hub)
        if (searchInput) {
          searchInput.value = cleanText;
          State.currentQuery = cleanText;
          searchInput.blur();
        }
        // If mode was numeric, switch to text mode
        if (State.keyboardMode === 'numeric' && /[a-zA-Z]/.test(cleanText)) {
          const btnMode = document.getElementById('btn-input-mode');
          if (btnMode) {
            State.keyboardMode = 'text';
            if (searchInput) {
              searchInput.setAttribute('inputmode', 'text');
              searchInput.removeAttribute('pattern');
              searchInput.setAttribute('placeholder', 'Search City or Hub (e.g. Surat, Delhi)...');
            }
            btnMode.className = 'btn-input-mode mode-text';
            btnMode.innerHTML = '<span class="mode-icon" aria-hidden="true">🔤</span><span class="mode-label">ABC</span>';
          }
        }
        if (btnClearSearch) btnClearSearch.style.display = 'inline-flex';
        playPopSound();
        showToast('📋 Pasted: ' + (cleanText.length > 25 ? cleanText.slice(0, 22) + '...' : cleanText));
        performSearch();
        saveRecentSearch(cleanText);
      }
    }).catch(function (err) {
      console.warn('[Clipboard] Read error:', err);
      showToast('⚠️ Please allow clipboard permission or paste into box.');
    });
  }

  function initRecentSearches() {
    if (typeof document === 'undefined') return;
    const chipsList = document.getElementById('recent-chips-list');
    const btnClear = document.getElementById('btn-clear-recent');
    const searchInput = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');

    if (chipsList && searchInput) {
      chipsList.addEventListener('click', function (e) {
        const chip = e.target.closest('.recent-chip');
        if (!chip) return;
        const q = chip.getAttribute('data-query');
        if (!q) return;

        playPopSound();
        searchInput.value = q;
        State.currentQuery = q;
        if (btnClearSearch) btnClearSearch.style.display = 'inline-flex';

        // Set appropriate keyboard mode
        if (/^\d+$/.test(q)) {
          if (State.keyboardMode !== 'numeric') {
            const btnMode = document.getElementById('btn-input-mode');
            State.keyboardMode = 'numeric';
            searchInput.setAttribute('inputmode', 'numeric');
            searchInput.setAttribute('pattern', '[0-9]*');
            searchInput.setAttribute('placeholder', 'Enter 6-digit Pincode (or tap 123 for City)...');
            if (btnMode) {
              btnMode.className = 'btn-input-mode mode-numeric';
              btnMode.innerHTML = '<span class="mode-icon" aria-hidden="true">🔢</span><span class="mode-label">123</span>';
            }
          }
        } else {
          if (State.keyboardMode !== 'text') {
            const btnMode = document.getElementById('btn-input-mode');
            State.keyboardMode = 'text';
            searchInput.setAttribute('inputmode', 'text');
            searchInput.removeAttribute('pattern');
            searchInput.setAttribute('placeholder', 'Search City or Hub (e.g. Surat, Delhi)...');
            if (btnMode) {
              btnMode.className = 'btn-input-mode mode-text';
              btnMode.innerHTML = '<span class="mode-icon" aria-hidden="true">🔤</span><span class="mode-label">ABC</span>';
            }
          }
        }

        searchInput.blur();
        performSearch();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', function () {
        playPopSound();
        clearRecentSearches();
        showToast('Recent searches cleared');
      });
    }

    renderRecentSearches();
  }

  /* ==========================================================================
     7. Master Defensive Component Bootloader Isolation (LESSONS §20.1)
     ========================================================================== */

  function bootloader() {
    const modules = [
      { name: 'Data Store Loader', fn: initDataStore, critical: true },
      { name: 'Search Engine Core', fn: initSearchEngine, critical: true },
      { name: 'Search UI & Debounce Handlers', fn: initSearchUI, critical: true },
      { name: 'Filter Chips Controller', fn: initFilterChips, critical: true },
      { name: 'Web Audio Micro-Haptics', fn: initAudioHaptics, critical: false },
      { name: 'Clipboard & Whole-Card Delegation', fn: initClipboard, critical: true },
      { name: 'Touch Ergonomics & Infinite Scroll', fn: initTouchAndScroll, critical: false },
      { name: 'On-Screen Numeric Pin Keypad', fn: initNumberPad, critical: false },
      { name: 'Input Mode Switcher (123 / ABC)', fn: initInputModeSwitcher, critical: false },
      { name: 'Recent Searches & Smart Paste', fn: initRecentSearches, critical: false },
      { name: 'Excel Updater Modal Hook', fn: initExcelUpdater, critical: false },
      { name: 'PWA Service Worker Registration', fn: initServiceWorker, critical: false }
    ];

    let hasCriticalFailure = false;

    modules.forEach(function (m) {
      try {
        m.fn();
        console.log('[Bootloader] Module "' + m.name + '" initialized successfully.');
      } catch (err) {
        console.error('[Bootloader Warning] Error initializing module "' + m.name + '":', err);
        if (m.critical) {
          hasCriticalFailure = true;
        }
      }
    });

    if (!hasCriticalFailure) {
      console.log('[Bootloader] All Pincode Search modules online.');
      // Execute initial search display
      performSearch();
    } else {
      console.error('[Bootloader] Critical module failure encountered during boot.');
    }
  }

  // Auto-boot if running in browser DOM
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootloader);
    } else {
      bootloader();
    }
  }

  // Public API exported for testing & debugging
  return {
    State: State,
    executeSearch: executeSearch,
    searchPincodePrefix: searchPincodePrefix,
    searchTextQuery: searchTextQuery,
    resolveRecord: resolveRecord,
    formatCopyPayload: formatCopyPayload,
    performSearch: performSearch,
    extractPincodeFromText: extractPincodeFromText,
    loadRecentSearches: loadRecentSearches,
    saveRecentSearch: saveRecentSearch,
    clearRecentSearches: clearRecentSearches,
    handleSmartPaste: handleSmartPaste,
    bootloader: bootloader
  };
});
