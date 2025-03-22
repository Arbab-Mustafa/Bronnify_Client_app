"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { getLebronOfTheDay } from "@/lib/utils"
import { lebronImages } from "@/lib/data"

export function LebronOfTheDay() {
  const [liked, setLiked] = useState(false)
  const [lebronIndex, setLebronIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get today's LeBron image
    const index = getLebronOfTheDay(lebronImages.length) - 1
    setLebronIndex(index)
    setIsLoading(false)

    // Check if this LeBron was previously liked
    const likedLebrons = JSON.parse(localStorage.getItem("likedLebrons") || "[]")
    setLiked(likedLebrons.includes(lebronImages[index].id))
  }, [])

  const toggleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)

    // Save liked state to localStorage
    const likedLebrons = JSON.parse(localStorage.getItem("likedLebrons") || "[]")

    if (newLiked) {
      localStorage.setItem("likedLebrons", JSON.stringify([...likedLebrons, lebronImages[lebronIndex].id]))
    } else {
      localStorage.setItem(
        "likedLebrons",
        JSON.stringify(likedLebrons.filter((id: number) => id !== lebronImages[lebronIndex].id)),
      )
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        <div className="aspect-[16/9] md:aspect-[21/9] bg-muted rounded-lg"></div>
      </div>
    )
  }

  const lebron = lebronImages[lebronIndex]

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">LeBron of the Day</h2>
        <button onClick={toggleLike} className="flex items-center gap-2 text-sm font-medium">
          <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>
      </div>

      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden bg-black/20">
        <img src={lebron.url || "/placeholder.svg"} alt={lebron.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-bold">{lebron.title}</h3>
          <p className="text-sm text-gray-300">{lebron.description}</p>
        </div>
      </div>
    </div>
  )
}

