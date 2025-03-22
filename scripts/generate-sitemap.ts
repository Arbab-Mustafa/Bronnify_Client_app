import fs from "fs"
import path from "path"
import { tracks, playlists, lebronImages, videoEdits } from "../lib/data"
import { artists } from "../lib/artist-data"

async function generateSitemap() {
  const baseUrl = "https://bronify.vercel.app"
  const currentDate = new Date().toISOString().split("T")[0]

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-lebrons`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebron-categories`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebronaissance`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lebron-edits`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
  ]

  // Dynamic album routes
  const albumRoutes = Array.from(new Set(tracks.map((track) => track.album))).map((album) => ({
    url: `${baseUrl}/album/${encodeURIComponent(album)}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: 0.7,
  }))

  // Dynamic artist routes
  const artistRoutes = artists.map((artist) => ({
    url: `${baseUrl}/artist/${encodeURIComponent(artist.name)}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: 0.7,
  }))

  // Dynamic playlist routes
  const playlistRoutes = playlists.map((playlist) => ({
    url: `${baseUrl}/playlist/${encodeURIComponent(playlist.id)}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: 0.7,
  }))

  // Dynamic LeBron image routes
  const lebronRoutes = lebronImages.map((lebron) => ({
    url: `${baseUrl}/lebron/${encodeURIComponent(lebron.id)}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: 0.7,
  }))

  // Dynamic video edit routes
  const videoRoutes = videoEdits.map((video) => ({
    url: `${baseUrl}/lebron-edits/${encodeURIComponent(video.id)}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: 0.7,
  }))

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...albumRoutes,
    ...artistRoutes,
    ...playlistRoutes,
    ...lebronRoutes,
    ...videoRoutes,
  ]

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  // Write to file
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap)
  console.log("Sitemap generated successfully!")
}

generateSitemap().catch(console.error)

