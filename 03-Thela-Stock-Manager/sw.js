// sw.js — Service Worker for Thela Stock Manager PWA
const CACHE_NAME = 'thela-stock-cache-v1.0.0';

const SHELL_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'version.json',
  'vendor/xlsx.full.min.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Install caching warning:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not intercept non-GET requests or Firebase Firestore backend API calls
  if (event.request.method !== 'GET' || url.hostname.includes('googleapis.com') || url.hostname.includes('firebaseio.com')) {
    return;
  }

  // Navigation requests: Serve index.html shell immediately for 0ms cold start
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('index.html').then((cached) => cached || fetch(event.request).catch(() => caches.match('index.html')))
    );
    return;
  }

  // Cache-first for all other shell and vendor assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback for offline if not found
        return cached || null;
      });
    })
  );
});
