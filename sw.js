/* ===========================================================
 * 任務監控 Service Worker
 * - Cache-first for static shell (HTML/CSS/JS/icons/manifest)
 * - Network-first for api.github.com (Gist API 必須拿最新)
 * - 提供離線能力：斷網時仍可開啟 App，使用 localStorage 快取資料
 * =========================================================== */
const VERSION = "v1.0.0";
const SHELL_CACHE = `tyas-shell-${VERSION}`;
const RUNTIME_CACHE = `tyas-runtime-${VERSION}`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_ASSETS).catch((e) => console.warn("SW install cache miss:", e))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // API calls (GitHub Gist API) — always hit network, never cache
  if (url.hostname === "api.github.com" || url.hostname === "gist.githubusercontent.com") {
    return;
  }

  // Same-origin shell — cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Refresh in background
          fetch(request).then((res) => {
            if (res && res.status === 200) {
              caches.open(SHELL_CACHE).then((c) => c.put(request, res.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }).catch(() => caches.match("./index.html"));
      })
    );
    return;
  }

  // Cross-origin assets — runtime cache
  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached)
    )
  );
});

/* --- Push notifications (optional, for future browser push) --- */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((wins) => {
      if (wins.length > 0) return wins[0].focus();
      return clients.openWindow("./index.html");
    })
  );
});

/* --- Message from page (e.g., force refresh) --- */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
