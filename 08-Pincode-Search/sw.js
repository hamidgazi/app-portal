/**
 * ============================================================================
 * Service Worker: Zero-Latency Offline Cache Engine
 * ============================================================================
 * Strategy:
 * - Immediate Cache-First for Navigation (LESSONS_AND_LEARNINGS §2.1)
 * - Static Assets Cache-First with Network Fallback
 * - Self-claiming & Cache version invalidation
 * ============================================================================
 */

const CACHE_NAME = 'pincode-pwa-v1.1.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './data/pincodes.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// Install: Pre-cache core application shell and zero-CORS dataset
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching application shell...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up previous version caches and claim existing clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Purging deprecated cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Navigation Cache-First (Instant 0ms launch) & asset caching
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 1. Navigation Cache-First: Immediately return cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cachedIndex) => {
        if (cachedIndex) return cachedIndex;
        return caches.match('index.html').then((cachedFallback) => {
          if (cachedFallback) return cachedFallback;
          return fetch(event.request).catch(() => caches.match('./index.html'));
        });
      })
    );
    return;
  }

  // 2. Static Asset Cache-First with network fallback and background refresh
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache valid HTTP 200 responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((fetchErr) => {
        console.warn('[SW] Offline fetch fallback for:', event.request.url, fetchErr);
      });
    })
  );
});
