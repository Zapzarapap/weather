const CACHE = 'weather-v1';
const API_CACHE = 'weather-api-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== API_CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.hostname === 'api.open-meteo.com') {
    e.respondWith(networkFirst(e.request, API_CACHE));
    return;
  }

  if (
    url.hostname === 'tile.openweathermap.org' ||
    url.hostname === 'maps.dwd.de' ||
    url.hostname === 'nominatim.openstreetmap.org'
  ) {
    e.respondWith(networkFirst(e.request, API_CACHE));
    return;
  }

  if (url.pathname.startsWith('/icons/') || url.pathname === '/manifest.json') {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  e.respondWith(networkFirst(e.request, CACHE));
});

async function networkFirst(request, cacheName) {
  try {
    const res = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  const cache = await caches.open(CACHE);
  cache.put(request, res.clone());
  return res;
}
