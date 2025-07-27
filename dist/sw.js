const CACHE_NAME = "dm-2025-v4";
const urlsToCache = ["/", "/index.html", "/favicon.svg"];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Never cache JavaScript files - always fetch fresh
  if (url.pathname.includes("/assets/") && url.pathname.endsWith(".js")) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Never cache CSS files - always fetch fresh
  if (url.pathname.includes("/assets/") && url.pathname.endsWith(".css")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
