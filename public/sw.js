const CACHE_NAME = "kurye-pwa-v2";
const CORE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/brand/34motokuryeistanbul-google-logo.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  // HTML belgelerinde stale ekran riskini azaltmak icin network-first uygula.
  const isDocumentRequest = request.mode === "navigate" || request.destination === "document";
  if (isDocumentRequest) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse)).catch(() => undefined);
          }

          return networkResponse;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse)).catch(() => undefined);
          }

          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => client.url.includes(self.location.origin));

      if (existingClient) {
        existingClient.focus();
        existingClient.navigate(targetUrl);
        return undefined;
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});