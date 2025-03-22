"use client"

import { useState, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { tracks } from "@/lib/data"

interface NowPlayingCardProps {
  onPlayTrack: (trackId: string) => void
  currentTrackId: string | null
  isPlaying: boolean
}

export function NowPlayingCard({ onPlayTrack, currentTrackId, isPlaying }: NowPlayingCardProps) {
  const [featuredTrack, setFeaturedTrack] = useState(tracks[7]) // Default to first LeBronaissance track

  // Randomly change featured track every 30 seconds
  useEffect(() => {
    const lebronRenaissanceTracks = tracks.filter((track) => track.album === "LeBronaissance")

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * lebronRenaissanceTracks.length)
      setFeaturedTrack(lebronRenaissanceTracks[randomIndex])
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const isCurrentTrack = currentTrackId === featuredTrack.id

  return (
    <div className="bg-gradient-to-br from-primary/30 to-card p-4 rounded-xl">
      <h3 className="text-lg font-bold mb-2">Now Trending</h3>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={featuredTrack.coverUrl || "/placeholder.svg"}
            alt={featuredTrack.album}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-base truncate">{featuredTrack.title}</h4>
          <p className="text-sm text-muted-foreground truncate">{featuredTrack.artist}</p>
          <p className="text-xs text-muted-foreground mt-1">From the album "{featuredTrack.album}"</p>
        </div>

        <button
          onClick={() => onPlayTrack(featuredTrack.id)}
          className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
        >
          {isCurrentTrack && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

