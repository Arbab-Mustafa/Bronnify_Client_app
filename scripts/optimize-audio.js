const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const INPUT_DIR = "./public/audio"
const OUTPUT_DIR = "./public/audio-optimized"
const TARGET_BITRATE = "128k" // Adjust based on quality needs
const TARGET_FORMAT = "opus" // opus is more efficient than mp3

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Get all audio files
const audioFiles = fs
  .readdirSync(INPUT_DIR)
  .filter((file) => file.endsWith(".mp3") || file.endsWith(".m4a") || file.endsWith(".wav"))

console.log(`Found ${audioFiles.length} audio files to optimize`)

// Process each file
audioFiles.forEach((file) => {
  const inputPath = path.join(INPUT_DIR, file)
  const outputFileName = path.basename(file, path.extname(file)) + "." + TARGET_FORMAT
  const outputPath = path.join(OUTPUT_DIR, outputFileName)

  console.log(`Converting ${file} to ${outputFileName}...`)

  try {
    // Use FFmpeg to convert the file
    // -c:a libopus = use Opus codec for audio
    // -b:a 128k = set bitrate to 128kbps
    // -vbr on = use variable bitrate
    // -compression_level 10 = highest compression
    execSync(
      `ffmpeg -i "${inputPath}" -c:a libopus -b:a ${TARGET_BITRATE} -vbr on -compression_level 10 "${outputPath}"`,
      { stdio: "inherit" },
    )

    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size
    const newSize = fs.statSync(outputPath).size
    const savings = ((1 - newSize / originalSize) * 100).toFixed(2)

    console.log(
      `✅ Converted ${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${savings}% savings)`,
    )
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message)
  }
})

console.log("Audio optimization complete!")
console.log(`Optimized files are in ${OUTPUT_DIR}`)
console.log("Remember to update your audio URLs to point to the new optimized files.")

