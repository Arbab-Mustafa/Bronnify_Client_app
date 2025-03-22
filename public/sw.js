// Service Worker for LeBronify
const CACHE_NAME = "lebronify-cache-v1"
const AUDIO_CACHE_NAME = "lebronify-audio-cache-v1"
const IMAGE_CACHE_NAME = "lebronify-image-cache-v1"

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/app.webmanifest",
  // Add critical CSS, JS, and font files here
]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, AUDIO_CACHE_NAME, IMAGE_CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Helper function to determine if a request is for an audio file
const isAudioRequest = (url) => {
  return (
    url.includes(".mp3") ||
    url.includes(".opus") ||
    url.includes(".ogg") ||
    url.includes(".m4a") ||
    url.includes(".aac")
  )
}

// Helper function to determine if a request is for an image
const isImageRequest = (url) => {
  return (
    url.includes(".jpg") ||
    url.includes(".jpeg") ||
    url.includes(".png") ||
    url.includes(".gif") ||
    url.includes(".webp") ||
    url.includes(".svg")
  )
}

// Helper function to determine if a request is for an HTML page
const isHTMLRequest = (request) => {
  return request.headers.get("accept")?.includes("text/html")
}

// Fetch event - network-first for audio, cache-first for images, stale-while-revalidate for everything else
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests and requests to other domains
  if (event.request.method !== "GET" || !url.origin.includes(self.location.origin)) {
    return
  }

  // Handle audio requests - network first with long-term caching
  if (isAudioRequest(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          // Cache with aggressive headers
          caches.open(AUDIO_CACHE_NAME).then((cache) => {
            // Create a new response with modified headers for longer caching
            const cachedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            })

            cache.put(event.request, cachedResponse)
          })

          return response
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
        }),
    )
    return
  }

  // Handle image requests - cache first with network fallback
  if (isImageRequest(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in the background (stale-while-revalidate)
          fetch(event.request)
            .then((response) => {
              caches.open(IMAGE_CACHE_NAME).then((cache) => {
                cache.put(event.request, response)
              })
            })
            .catch(() => {
              /* Ignore errors */
            })

          return cachedResponse
        }

        // If not in cache, fetch from network and cache
        return fetch(event.request).then((response) => {
          const responseToCache = response.clone()
          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      }),
    )
    return
  }

  // For HTML requests - network first with offline fallback
  if (isHTMLRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            // Return cached response or offline page
            return cachedResponse || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // For all other requests - stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Use cached response if available
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update cache with new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })

          return networkResponse
        })
        .catch((error) => {
          console.error("Fetch failed:", error)
          // If both cache and network fail for non-HTML, return a simple error response
          if (!cachedResponse) {
            return new Response("Network error occurred", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            })
          }
        })

      return cachedResponse || fetchPromise
    }),
  )
})

// Handle messages from clients (like cache updates)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

