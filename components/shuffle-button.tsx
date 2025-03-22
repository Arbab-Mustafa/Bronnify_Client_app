"use client"

import { useState } from "react"
import { Shuffle } from "lucide-react"
import { lebronImages } from "@/lib/data"
import Link from "next/link"

export function ShuffleButton() {
  const [randomLebron, setRandomLebron] = useState<number | null>(null)

  const getRandomLebron = () => {
    // Get a random LeBron image that's not a placeholder
    const realLebrons = lebronImages.filter((lebron) => !lebron.url.includes("placeholder.svg"))
    const randomIndex = Math.floor(Math.random() * realLebrons.length)
    setRandomLebron(realLebrons[randomIndex].id)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={getRandomLebron}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
      >
        <Shuffle className="h-4 w-4" />
        Generate My LeBron
      </button>

      {randomLebron !== null && (
        <div className="w-full max-w-xs">
          <Link
            href={`/lebron/${randomLebron}`}
            className="block group relative rounded-md overflow-hidden transition-all hover:bg-card"
          >
            <div className="aspect-square bg-muted rounded-md overflow-hidden">
              {lebronImages.find((l) => l.id === randomLebron) && (
                <img
                  src={lebronImages.find((l) => l.id === randomLebron)?.url || "/placeholder.svg"}
                  alt={lebronImages.find((l) => l.id === randomLebron)?.title || "Random LeBron"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="p-2 bg-card/80 absolute bottom-0 left-0 right-0">
              <h3 className="font-medium text-sm truncate">
                {lebronImages.find((l) => l.id === randomLebron)?.title || "Random LeBron"}
              </h3>
              <p className="text-xs text-muted-foreground">Click to view</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

