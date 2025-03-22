"use client"

import { useState } from "react"

interface PlayArtistButtonProps {
  artistName: string
}

export function PlayArtistButton({ artistName }: PlayArtistButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = () => {
    console.log(`Play artist clicked: ${artistName}`)
    setIsPlaying(!isPlaying)
    // Here you would implement the actual play functionality
  }

  return (
    <button
      className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
      onClick={handleClick}
    >
      {isPlaying ? "Pause Artist" : "Play Artist"}
    </button>
  )
}

