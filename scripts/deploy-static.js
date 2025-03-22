const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const OUTPUT_DIR = "out"
const PUBLIC_DIR = "public"
const STATIC_PAGES = [
  "album",
  "artist",
  "lebron-edits",
  "lebronaissance",
  "library",
  "top-lebrons",
  "lebron-categories",
  "search",
  "lebron",
  "playlist",
]

// Build the static site
console.log("Building static site...")
try {
  execSync("npm run export", { stdio: "inherit" })
} catch (error) {
  console.error("Build failed:", error.message)
  process.exit(1)
}

// Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
console.log("Creating .nojekyll file...")
fs.writeFileSync(path.join(__dirname, `../${OUTPUT_DIR}/.nojekyll`), "")

// Copy special files from public directory
console.log("Copying service worker and other special files...")
const filesToCopy = [
  "sw.js",
  "manifest.json",
  "app.webmanifest", // Alternative webmanifest
  "offline.html",
  "app-icon-192.png",
  "app-icon-512.png",
]

filesToCopy.forEach((file) => {
  const sourcePath = path.join(__dirname, `../${PUBLIC_DIR}/${file}`)
  const destinationPath = path.join(__dirname, `../${OUTPUT_DIR}/${file}`)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destinationPath)
    console.log(`Copied ${file}`)
  } else {
    console.warn(`Warning: File ${file} not found in ${PUBLIC_DIR} directory`)
  }
})

// Create static redirect pages for dynamic routes
console.log("Creating static redirect pages for dynamic routes...")
STATIC_PAGES.forEach((page) => {
  // Create directory if it doesn't exist
  const pageDir = path.join(__dirname, `../${OUTPUT_DIR}/${page}`)
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true })
  }

  // Create a 404.html file in each dynamic route directory
  // This will allow the server to serve the 404 page, which we can use as a catch-all
  const redirectHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.charAt(0).toUpperCase() + page.slice(1)} - Bronify</title>

<!-- Script to handle routes client-side -->
<script>
  // Extract the path and redirect to the client-side route
  (function() {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2) {
      // We're at a specific item, like /album/xyz
      // Let's redirect to the homepage and store the route to be handled by client-side JS
      sessionStorage.setItem('bronifyRedirect', path);
    }
    
    // Redirect to the homepage
    window.location.href = '/';
  })();
</script>
</head>
<body>
<p>Redirecting...</p>
</body>
</html>
  `

  fs.writeFileSync(path.join(pageDir, "index.html"), redirectHtml)
  console.log(`Created redirect for /${page}`)
})

// Create a custom 404 page that can redirect to client-side routes
console.log("Creating custom 404 page...")
const custom404Html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Not Found - Bronify</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
  .container {
    max-width: 90%;
    padding: 20px;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #1DB954;
  }
  p {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
    color: #ccc;
  }
  a {
    background-color: #1DB954;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }
</style>
<script>
  // Check if this URL should be handled client-side
  (function() {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    // If this looks like a client-side route, store it and redirect to homepage
    if (pathSegments.length >= 2 && ['album', 'artist', 'lebron-edits', 'lebron', 'playlist'].includes(pathSegments[0])) {
      sessionStorage.setItem('bronifyRedirect', path);
      window.location.href = '/';
    }
  })();
</script>
</head>
<body>
<div class="container">
  <h1>Page Not Found</h1>
  <p>We couldn't find the page you're looking for. It might be in the studio recording its next hit.</p>
  <a href="/">Go Home</a>
</div>
</body>
</html>
`

fs.writeFileSync(path.join(__dirname, `../${OUTPUT_DIR}/404.html`), custom404Html)

// Add a script to handle redirects in the main index.html file
console.log("Adding redirect handler to index.html...")
const indexPath = path.join(__dirname, `../${OUTPUT_DIR}/index.html`)
let indexHtml = fs.readFileSync(indexPath, "utf8")

// Add redirect handling script before the closing </head> tag
const redirectScript = `
<script>
  // Check if we have a stored redirect path
  (function() {
    const redirectPath = sessionStorage.getItem('bronifyRedirect');
    if (redirectPath) {
      // Clear the stored path right away to prevent redirect loops
      sessionStorage.removeItem('bronifyRedirect');
      
      // Wait for the app to initialize before trying to navigate
      window.addEventListener('load', function() {
        // Use setTimeout to ensure the app has fully initialized
        setTimeout(function() {
          // If Next.js router is available, use it
          if (window.history && window.history.pushState) {
            window.history.pushState({}, '', redirectPath);
            
            // Dispatch a popstate event to make Next.js router handle the new URL
            const popStateEvent = new PopStateEvent('popstate', { state: {} });
            window.dispatchEvent(popStateEvent);
          }
        }, 300);
      });
    }
  })();
</script>
`

indexHtml = indexHtml.replace("</head>", `${redirectScript}</head>`)
fs.writeFileSync(indexPath, indexHtml)

console.log("Static site build complete!")
console.log(`The static site is ready in the "${OUTPUT_DIR}" directory.`)
console.log("You can deploy this directory to any static hosting service:")
console.log("- GitHub Pages")
console.log("- Cloudflare Pages")
console.log("- Netlify")
console.log("- Vercel (as a static site)")
console.log("- Amazon S3 + CloudFront")

