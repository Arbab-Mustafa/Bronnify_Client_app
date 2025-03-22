/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://your-lebronify-site.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ["https://your-lebronify-site.com/sitemap.xml"],
  },
  exclude: ["/admin/*"],
  // Change frequency and priority settings
  changefreq: "weekly",
  priority: 0.7,
  // Set specific priorities for important pages
  transform: (config, path) => {
    // Home page gets highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // Main section pages get higher priority
    if (
      ["/search", "/library", "/top-lebrons", "/lebron-categories", "/lebronaissance", "/lebron-edits"].includes(path)
    ) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    // Default transformation for all other pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}

