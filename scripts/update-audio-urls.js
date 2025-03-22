const fs = require("fs")
const path = require("path")

// Configuration
const DATA_FILE_PATH = "lib/data.ts"
const R2_PUBLIC_URL = "https://pub-[your-bucket-id].r2.dev" // Replace with your actual R2 public URL

// Read the data file
let dataFileContent = fs.readFileSync(DATA_FILE_PATH, "utf8")

// Replace all Vercel Blob Storage URLs with R2 URLs
// This regex looks for audioUrl patterns in your data file
const blobUrlRegex = /audioUrl:\s*"(https:\/\/hebbkx1anhila5yf\.public\.blob\.vercel-storage\.com\/[^"]+)"/g

// Count replacements
let replacementCount = 0

// Replace each match with the R2 URL
dataFileContent = dataFileContent.replace(blobUrlRegex, (match, blobUrl) => {
  // Extract the filename from the blob URL
  const fileName = blobUrl.split("/").pop()

  // Get the file extension
  const fileExtension = fileName.split(".").pop()

  // If it's an MP3, replace with Opus version
  const newFileName = fileExtension === "mp3" ? fileName.replace(".mp3", ".opus") : fileName

  // Create the new R2 URL
  const r2Url = `${R2_PUBLIC_URL}/${newFileName}`

  replacementCount++
  return `audioUrl: "${r2Url}"`
})

// Write the updated content back to the file
fs.writeFileSync(DATA_FILE_PATH, dataFileContent)

console.log(`Updated ${replacementCount} audio URLs to use Cloudflare R2.`)

