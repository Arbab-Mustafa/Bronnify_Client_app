// This is a guide script - you'll need to run these commands manually

/*
1. Sign up for Cloudflare R2 (https://developers.cloudflare.com/r2/)

2. Install Cloudflare Wrangler CLI:
   npm install -g wrangler

3. Authenticate with Cloudflare:
   wrangler login

4. Create an R2 bucket:
   wrangler r2 bucket create bronify-audio

5. Create an R2 public access policy:
   wrangler r2 bucket create-public-access-policy bronify-audio --policy-name public-access --bucket-level

6. Get your R2 credentials from the Cloudflare dashboard:
   - Go to R2 > Overview > Manage R2 API Tokens
   - Create a new API token with "Edit" permissions
   - Save the Access Key ID and Secret Access Key
*/

// The script below is for uploading files to R2 once you have credentials
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const fs = require("fs")
const path = require("path")
const mime = require("mime-types")

// R2 configuration
const R2_ACCOUNT_ID = "your-cloudflare-account-id"
const R2_ACCESS_KEY_ID = "your-access-key-id"
const R2_SECRET_ACCESS_KEY = "your-secret-access-key"
const R2_BUCKET_NAME = "bronify-audio"

// Directory containing optimized audio files
const AUDIO_DIR = "public/audio"

// Create S3 client for R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// Get all audio files
const audioFiles = fs
  .readdirSync(AUDIO_DIR)
  .filter((file) => file.endsWith(".opus") || file.endsWith(".mp3") || file.endsWith(".aac"))

console.log(`Found ${audioFiles.length} audio files to upload...`)

// Upload each file to R2
async function uploadFiles() {
  for (let i = 0; i < audioFiles.length; i++) {
    const file = audioFiles[i]
    const filePath = path.join(AUDIO_DIR, file)
    const fileContent = fs.readFileSync(filePath)
    const contentType = mime.lookup(filePath) || "application/octet-stream"

    console.log(`[${i + 1}/${audioFiles.length}] Uploading: ${file}`)

    try {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: file,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable", // 1 year cache
      })

      await s3Client.send(command)
      console.log(`✅ Uploaded ${file} to R2`)
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error)
    }
  }

  console.log("Upload complete!")
}

uploadFiles()

