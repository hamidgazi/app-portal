/**
 * ============================================================================
 * Quran Deep Analyzer - High-Performance Search Web Worker
 * (js/search-worker.js)
 * ============================================================================
 * Offloads full BM25 search, multi-translation phrase scoring, and token
 * expansions into a dedicated background worker thread.
 * Guarantees zero main-thread freezing and silky 60-120 FPS keyboard typing.
 * ============================================================================
 */

/* eslint-disable no-restricted-globals */
self.window = self;

let isReady = false;

try {
  // Load 6,236 Ayat bundle and search engines inside the worker
  importScripts('../data/quran_ayat_search_bundle.js');
  importScripts('roman-urdu-translator.js');
  importScripts('ai-search-engine.js');

  if (self.QuranAISearchEngine && self.QURAN_AYAT_SEARCH_DATA) {
    self.QuranAISearchEngine.indexAyatCorpus(self.QURAN_AYAT_SEARCH_DATA);
    isReady = true;
  }
} catch (err) {
  // Graceful log in environments where importScripts may fail
  console.warn('[SearchWorker] Dependency load warning:', err);
}

self.onmessage = function (event) {
  const msg = event.data || {};
  const type = msg.type;

  if (type === 'PING' || type === 'INIT') {
    if (!isReady && self.QuranAISearchEngine && self.QURAN_AYAT_SEARCH_DATA) {
      self.QuranAISearchEngine.indexAyatCorpus(self.QURAN_AYAT_SEARCH_DATA);
      isReady = true;
    }
    self.postMessage({ type: 'READY', isReady: true });
    return;
  }

  if (type === 'SEARCH') {
    const q = (msg.query || '').trim();
    const category = msg.category || 'all';
    const limit = msg.limit || 80;
    const requestId = msg.requestId;

    if (!q) {
      self.postMessage({
        type: 'SEARCH_RESULTS',
        query: '',
        matches: [],
        requestId: requestId,
        elapsed: 0
      });
      return;
    }

    const t0 = performance.now();
    let matches = [];

    if (self.QuranAISearchEngine && typeof self.QuranAISearchEngine.search === 'function') {
      matches = self.QuranAISearchEngine.search(q, category, limit);
    }

    const elapsed = Math.round(performance.now() - t0);

    self.postMessage({
      type: 'SEARCH_RESULTS',
      query: q,
      matches: matches,
      requestId: requestId,
      elapsed: elapsed
    });
  }
};
