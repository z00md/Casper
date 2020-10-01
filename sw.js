const PRECACHE = 'precache';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/',
  '/offline/'
];

const OFFLINE_URL = [
  '/offline/'
]

// The install handler takes care of pre caching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  // Skip all ghost admin requests to prevent 500 errors
  if (event.request.url.startsWith(self.location.origin) && !(event.request.url.startsWith(`${self.location.origin}/ghost}`))) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          }).catch(error => {
            // Return cached reponse if network fails
            if (cachedResponse) {
                return cachedResponse;
            } else {
                // Return offline page if network and cache both fail
                return caches.match(OFFLINE_URL);
            }
          });;
        });
      })
    );
  }
});