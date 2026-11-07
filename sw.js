/**
 * Antigravity App Portal Service Worker
 * Version: app-portal-v2.2.0
 * Strategy: Stale-While-Revalidate with Instant Cache Purge & Offline Shell
 */

const CACHE_NAME = "app-portal-v2.2.0";

const PRECACHE_ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "portal_catalog.js",
  "portal_catalog.json",
  "links_catalog.js",
  "links_catalog.json",
  "links.html",
  "doc_viewer.html",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// Install: Pre-cache core application shell & immediately take over
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to precache during install:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge stale caches & claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith("app-portal-") && name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Purging outdated cache:", name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for local assets, network-first for external APIs
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Handle local origin requests with Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch((err) => {
          // If offline and no cached response for navigation, return cached index.html
          if (event.request.mode === "navigate") {
            return caches.match("index.html");
          }
          throw err;
        });

        if (cachedResponse) {
          fetchPromise.catch(() => {});
          return cachedResponse;
        }
        return fetchPromise;
      })
    );
  }
});
