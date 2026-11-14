/**
 * Antigravity App Portal Service Worker
 * Version: app-portal-v2.3.0
 * Strategy: Network-First for HTML/Navigations (Instant Cloud Updates) + Stale-While-Revalidate for Static Assets
 */

const CACHE_NAME = "app-portal-v2.3.0";

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

// Fetch: Network-First for HTML navigation requests (solves stale cloud cache trap)
// Stale-While-Revalidate for local assets, network-first for external APIs
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Handle local origin requests
  if (url.origin === self.location.origin) {
    const isNavigationOrHtml = 
      event.request.mode === "navigate" ||
      url.pathname.endsWith(".html") ||
      url.pathname.endsWith("/") ||
      url.pathname.endsWith(".json") ||
      url.pathname.includes("portal_catalog") ||
      url.pathname.includes("links_catalog");

    if (isNavigationOrHtml) {
      // Network-First Strategy for HTML/Navigations/Dynamic Catalogs
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback
            return caches.match(event.request).then((cached) => {
              if (cached) return cached;
              return caches.match("index.html");
            });
          })
      );
      return;
    }

    // Stale-While-Revalidate Strategy for Static Assets (JS, CSS, Images, Icons)
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
