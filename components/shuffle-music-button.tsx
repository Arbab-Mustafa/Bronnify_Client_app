"use client"

import { useState } from "react"
import { Shuffle } from "lucide-react"

interface ShuffleMusicButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ShuffleMusicButton({ variant = "default", size = "default" }: ShuffleMusicButtonProps) {
  const [isHovering, setIsHovering] = useState(false)

  const shuffleAllTracks = () => {
    // @ts-ignore - This is defined in the Player component
    if (window.shuffleAllTracks) {
      // @ts-ignore
      window.shuffleAllTracks()
    }
  }

  const getButtonClasses = () => {
    let baseClasses = "flex items-center gap-2 font-medium transition-all duration-200 rounded-full"

    // Size classes
    if (size === "sm") {
      baseClasses += " px-3 py-1 text-sm"
    } else if (size === "lg") {
      baseClasses += " px-6 py-3 text-base"
    } else {
      baseClasses += " px-4 py-2 text-sm"
    }

    // Variant classes
    if (variant === "outline") {
      baseClasses += " border border-primary text-primary hover:bg-primary/10"
    } else if (variant === "ghost") {
      baseClasses += " text-primary hover:bg-primary/10"
    } else {
      baseClasses += " bg-primary text-primary-foreground hover:bg-primary/90"
    }

    return baseClasses
  }

  return (
    <button
      onClick={shuffleAllTracks}
      className={getButtonClasses()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Shuffle className={`h-4 w-4 ${isHovering ? "animate-pulse" : ""}`} />
      Shuffle Play
    </button>
  )
}

