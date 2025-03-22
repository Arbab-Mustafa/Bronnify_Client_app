"use client"
import { Play, Pause } from "lucide-react"
import type React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect, useRef } from "react"

interface MiniPlayerProps {
  currentTrack: any
  isPlaying: boolean
  onTogglePlay: () => void
  onOpenFullPlayer: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function MiniPlayer({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onOpenFullPlayer,
  onNext,
  onPrevious,
}: MiniPlayerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [dominantColor, setDominantColor] = useState("#333333")
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartTime = useRef<number | null>(null)

  // Get primary artist name (first artist if there are multiple)
  const getPrimaryArtist = () => {
    return currentTrack.artist.split(",")[0].trim()
  }

  // Extract dominant color from album art (simplified version)
  useEffect(() => {
    // This is a simplified approach - in a real app, you might use a library
    // to extract the dominant color from the image
    const albumColors: Record<string, string> = {
      LeBronaissance: "#1e3a2d", // Dark green
      LBJ: "#3a1e1e", // Dark red
      "First Day Out": "#3a2e1e", // Dark orange
      "We Don't Guard You": "#1e2a3a", // Dark blue
      "We Did It": "#2a1e3a", // Dark purple
      "Washed Anthem": "#3a3a1e", // Dark yellow
      NOKIA: "#1e3a3a", // Dark teal
      "Like That (Remix)": "#2d1e3a", // Dark violet
      Bronfoolery: "#3a2d1e", // Dark brown
      "Bron and Jerry": "#2d3a1e", // Dark olive
    }

    setDominantColor(albumColors[currentTrack.album] || "#333333")
  }, [currentTrack.album])

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartTime.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchEndX - touchStartX.current
    const deltaTime = Date.now() - touchStartTime.current

    // Only trigger if the swipe was fast enough (less than 300ms) and long enough (more than 50px)
    if (deltaTime < 300 && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && onPrevious) {
        // Swipe right - previous track
        onPrevious()
      } else if (deltaX < 0 && onNext) {
        // Swipe left - next track
        onNext()
      }
    }

    touchStartX.current = null
    touchStartTime.current = null
  }

  if (!isMobile) return null

  return (
    <div
      ref={containerRef}
      className="fixed bottom-16 left-0 right-0 h-14 px-2 flex items-center z-20 border-t border-gray-800"
      onClick={onOpenFullPlayer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: `linear-gradient(to right, ${dominantColor}, #222222)`,
      }}
    >
      <div className="flex items-center w-full">
        <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img
            src={currentTrack.coverUrl || "/placeholder.svg"}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 mr-2">
          <div className="font-medium text-sm text-white truncate block">{currentTrack.title}</div>
          <div className="text-xs text-white/70 truncate block">{getPrimaryArtist()}</div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onTogglePlay()
          }}
          className="w-10 h-10 flex items-center justify-center text-white"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

