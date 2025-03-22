const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Configuration
const PROJECT_NAME = "bronify"
const OUTPUT_DIR = "out"

// Build the static site
console.log("Building static site...")
try {
  execSync("npm run export", { stdio: "inherit" })
} catch (error) {
  console.error("Build failed:", error.message)
  process.exit(1)
}

// Ensure _headers and _redirects files exist
const headersPath = path.join(OUTPUT_DIR, "_headers")
const redirectsPath = path.join(OUTPUT_DIR, "_redirects")

if (!fs.existsSync(headersPath)) {
  console.warn("Warning: _headers file not found. Creating default...")
  fs.writeFileSync(
    headersPath,
    `
# Default headers
/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff
`,
  )
}

if (!fs.existsSync(redirectsPath)) {
  console.warn("Warning: _redirects file not found. Creating default...")
  fs.writeFileSync(
    redirectsPath,
    `
# Redirect all routes to index.html for client-side routing
/*    /index.html   200
`,
  )
}

// Deploy to Cloudflare Pages using Wrangler
console.log("Deploying to Cloudflare Pages...")
try {
  execSync(`npx wrangler pages deploy ${OUTPUT_DIR} --project-name=${PROJECT_NAME}`, {
    stdio: "inherit",
  })
  console.log("Deployment successful!")
} catch (error) {
  console.error("Deployment failed:", error.message)
  process.exit(1)
}

