import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://bronify.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

