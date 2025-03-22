import type { MetadataRoute } from "next"
import { tracks, playlists, lebronImages, videoEdits } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable with fallback
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://your-lebronify-site.com"
  const currentDate = new Date()

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-lebrons`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebron-categories`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebronaissance`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebron-edits`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Dynamic album routes
  const albumRoutes = Array.from(new Set(tracks.map((track) => track.album))).map((album) => ({
    url: `${baseUrl}/album/${encodeURIComponent(album)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic artist routes - extract unique artists from tracks
  const artistNames = new Set<string>()
  tracks.forEach((track) => {
    track.artist.split(",").forEach((artist) => {
      artistNames.add(artist.trim())
    })
  })

  const artistRoutes = Array.from(artistNames).map((artist) => ({
    url: `${baseUrl}/artist/${encodeURIComponent(artist)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic playlist routes
  const playlistRoutes = playlists.map((playlist) => ({
    url: `${baseUrl}/playlist/${encodeURIComponent(playlist.id)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic LeBron image routes
  const lebronRoutes = lebronImages.map((lebron) => ({
    url: `${baseUrl}/lebron/${encodeURIComponent(lebron.id)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic video edit routes
  const videoRoutes = videoEdits.map((video) => ({
    url: `${baseUrl}/lebron-edits/${encodeURIComponent(video.id)}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Combine all routes
  return [...staticRoutes, ...albumRoutes, ...artistRoutes, ...playlistRoutes, ...lebronRoutes, ...videoRoutes]
}

