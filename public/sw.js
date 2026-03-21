const CACHE_NAME = "design-alive-v2";
const urlsToCache = ["/", "/index.html", "/favicon.svg"];

// Install event - cache resources and activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (HTML pages) — network-first
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with fresh copy
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match("/index.html");
        })
    );
    return;
  }

  // Never cache JavaScript files - always fetch fresh
  if (url.pathname.includes("/assets/") && url.pathname.endsWith(".js")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If fetch fails, return a basic response to prevent crashes
        return new Response("", { status: 404 });
      })
    );
    return;
  }

  // Never cache CSS files - always fetch fresh
  if (url.pathname.includes("/assets/") && url.pathname.endsWith(".css")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If fetch fails, return a basic response to prevent crashes
        return new Response("", { status: 404 });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(event.request).catch(() => {
          // If both cache and network fail, return a basic response
          return new Response("", { status: 404 });
        })
      );
    })
  );
});

// Activate event - claim clients and clean up old caches
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
    }).then(() => self.clients.claim())
  );
});
