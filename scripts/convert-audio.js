const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const SOURCE_DIR = "audio-files" // Directory containing your MP3 files
const OUTPUT_DIR = "public/audio" // Where to save optimized files
const TARGET_BITRATE = "96k" // Target bitrate (96kbps)
const FORMAT = "opus" // Target format (opus is very efficient)

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Get all MP3 files
const audioFiles = fs.readdirSync(SOURCE_DIR).filter((file) => file.endsWith(".mp3"))

console.log(`Found ${audioFiles.length} audio files to convert...`)

// Convert each file
audioFiles.forEach((file, index) => {
  const inputPath = path.join(SOURCE_DIR, file)
  const outputFileName = file.replace(".mp3", `.${FORMAT}`)
  const outputPath = path.join(OUTPUT_DIR, outputFileName)

  console.log(`[${index + 1}/${audioFiles.length}] Converting: ${file}`)

  try {
    // Using FFmpeg for conversion
    execSync(`ffmpeg -i "${inputPath}" -c:a libopus -b:a ${TARGET_BITRATE} "${outputPath}"`, { stdio: "inherit" })

    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size
    const newSize = fs.statSync(outputPath).size
    const savings = ((1 - newSize / originalSize) * 100).toFixed(2)

    console.log(
      `✅ Converted ${file} - Size reduced by ${savings}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB)`,
    )
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message)
  }
})

console.log("Conversion complete!")

