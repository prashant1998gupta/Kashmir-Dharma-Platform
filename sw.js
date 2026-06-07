const CACHE_NAME = 'kashmir-dharma-v12';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './css/animations.css',
    './js/app.js',
    './js/router.js',
    './js/components.js',
    './js/utils/storage.js',
    './js/utils/search.js',
    './js/utils/panchang-core.js',
    './js/utils/calendar-calc.js',
    './js/utils/match-calc.js',
    './js/utils/varshphal-calc.js',
    './js/utils/pdf-generator.js',
    './js/utils/profile-manager.js',
    './js/utils/gita-verses.js',
    './js/utils/llm.js',
    './js/utils/i18n.js',
    './js/utils/interpretations.js',
    './js/pages/home.js',
    './js/pages/calendar.js',
    './js/pages/rituals.js',
    './js/pages/wedding.js',
    './js/pages/birthday.js',
    './js/pages/muhurat.js',
    './js/pages/heritage.js',
    './js/pages/archive.js',
    './js/pages/audio.js',
    './js/pages/guide.js',
    './js/pages/sharada.js',
    './js/pages/kundali.js',
    './js/pages/matching.js',
    './js/pages/varshphal.js',
    './js/pages/gita.js',
    './js/utils/cities.js',
    './js/utils/city-api.js',
    './js/utils/astrology-calc.js',
    './js/lib/astronomy.js',
    './data/festivals.json',
    './data/rituals.json',
    './data/wedding.json',
    './data/archive.json',
    './data/muhurat-data.json',
    './data/sharada.json',
    './assets/icons/icon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
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
    self.clients.claim();
});

// Fetch Event (Network First, falling back to Cache)
self.addEventListener('fetch', (event) => {
    // Only handle http/https requests — skip chrome-extension:// etc.
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response and cache it
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // If network fails, try the cache
                return caches.match(event.request);
            })
    );
});
