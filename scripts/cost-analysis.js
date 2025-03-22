const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const AUDIO_DIR = "public/audio"
const ORIGINAL_AUDIO_DIR = "audio-files"
const VERCEL_BLOB_COST_PER_GB = 0.2 // $0.20 per GB egress
const CLOUDFLARE_R2_COST_PER_GB = 0.0 // $0.00 per GB egress (free)

// Calculate total size of original audio files
function calculateDirSize(directory) {
  let totalSize = 0

  const files = fs.readdirSync(directory)
  files.forEach((file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      totalSize += stats.size
    } else if (stats.isDirectory()) {
      totalSize += calculateDirSize(filePath)
    }
  })

  return totalSize
}

// Calculate size of optimized audio files
const originalSize = calculateDirSize(ORIGINAL_AUDIO_DIR)
const optimizedSize = calculateDirSize(AUDIO_DIR)

// Calculate savings
const sizeSavingsBytes = originalSize - optimizedSize
const sizeSavingsPercent = (sizeSavingsBytes / originalSize) * 100

// Calculate monthly cost savings based on different traffic levels
function calculateMonthlyCost(sizeInBytes, trafficMultiplier, costPerGB) {
  const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
  return sizeInGB * trafficMultiplier * costPerGB
}

// Traffic scenarios
const scenarios = [
  { name: "Low Traffic", multiplier: 100 }, // 100x total size per month
  { name: "Medium Traffic", multiplier: 1000 }, // 1000x total size per month
  { name: "High Traffic", multiplier: 10000 }, // 10000x total size per month
]

// Print results
console.log("=== BRONIFY COST OPTIMIZATION ANALYSIS ===")
console.log(`Original audio size: ${(originalSize / (1024 * 1024)).toFixed(2)} MB`)
console.log(`Optimized audio size: ${(optimizedSize / (1024 * 1024)).toFixed(2)} MB`)
console.log(`Size reduction: ${sizeSavingsPercent.toFixed(2)}% (${(sizeSavingsBytes / (1024 * 1024)).toFixed(2)} MB)`)
console.log("\n=== MONTHLY COST COMPARISON ===")

scenarios.forEach((scenario) => {
  const vercelOriginalCost = calculateMonthlyCost(originalSize, scenario.multiplier, VERCEL_BLOB_COST_PER_GB)
  const vercelOptimizedCost = calculateMonthlyCost(optimizedSize, scenario.multiplier, VERCEL_BLOB_COST_PER_GB)
  const cloudflareR2Cost = calculateMonthlyCost(optimizedSize, scenario.multiplier, CLOUDFLARE_R2_COST_PER_GB)

  console.log(`\n${scenario.name} Scenario (${scenario.multiplier}x total size per month):`)
  console.log(`- Vercel Blob (original files): $${vercelOriginalCost.toFixed(2)}`)
  console.log(`- Vercel Blob (optimized files): $${vercelOptimizedCost.toFixed(2)}`)
  console.log(`- Cloudflare R2 (optimized files): $${cloudflareR2Cost.toFixed(2)}`)
  console.log(`- Total monthly savings: $${(vercelOriginalCost - cloudflareR2Cost).toFixed(2)}`)
})

