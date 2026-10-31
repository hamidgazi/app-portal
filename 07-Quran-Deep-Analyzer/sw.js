/**
 * ============================================================================
 * Quran Deep Analyzer - Cache-First Progressive Web App Service Worker
 * (sw.js) - Version 2.1.0
 * ============================================================================
 * Guarantees instant 0ms offline launch, zero network dependency for core
 * scriptural study, and offline full-corpus search across 6,236 Ayat.
 * Audio recitations stream on-demand to preserve device storage.
 * ============================================================================
 */

const CACHE_NAME = 'quran-deep-analyzer-v2.1.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './commands.html',
  './manners.html',
  './manifest.json',
  './css/app.css',
  './css/commands-manners.css',
  './js/app.js',
  './js/search-studio.js',
  './js/ai-search-engine.js',
  './js/roman-urdu-translator.js',
  './js/search-worker.js',
  './js/corpus-engine.js',
  './js/morphology-engine.js',
  './js/audio-player.js',
  './js/audio-sfx.js',
  './js/tajweed-engine.js',
  './js/notebook-engine.js',
  './js/quick-scrubber.js',
  './js/waqf-engine.js',
  './js/commands-engine.js',
  './js/manners-engine.js',
  './data/quran_ayat_search_bundle.js',
  './data/quran_core_data.js',
  './data/quran_commands_data.js',
  './data/quran_manners_data.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// 1. INSTALL: Pre-cache core application shell & data bundles
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline application shell & corpus bundles...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: Purge previous cache versions and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name.startsWith('quran-deep-analyzer-')) {
            console.log('[ServiceWorker] Removing legacy cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Cache-First navigation & local assets, network-first audio streams
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Audio recitations stream directly from network (prevent storage ballooning)
  if (url.hostname.includes('everyayah.com') || req.destination === 'audio') {
    event.respondWith(fetch(req).catch(() => new Response('', { status: 408, statusText: 'Audio Offline' })));
    return;
  }

  // Navigation requests: Serve cached index.html immediately for instant 0ms launch
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        return cached || fetch(req).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // Cache-First strategy with Stale-While-Revalidate for application assets
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Asynchronously update cache in background
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });
        return networkResponse;
      }).catch((err) => {
        // Graceful offline fallback
        return cachedResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
