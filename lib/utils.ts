import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Seeded random function to ensure consistent LeBron images per day
export function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Get LeBron of the day based on current date
export function getLebronOfTheDay(totalImages: number) {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  // List of LeBron IDs to exclude (scary or inappropriate ones)
  const excludeIds = [11, 85, 90] // LeTrain, LeMilk, LeChampionsLeague

  // Generate a sequence of potential LeBrons
  const potentialLebrons = Array.from({ length: totalImages }, (_, i) => i + 1).filter((id) => !excludeIds.includes(id))

  // Use the seed to select one
  const index = Math.floor(seededRandom(seed) * potentialLebrons.length)
  return potentialLebrons[index]
}

// Format time in mm:ss format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

