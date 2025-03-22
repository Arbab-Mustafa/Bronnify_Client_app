"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface MobilePlayerProps {
  currentTrack: any
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  isShuffleMode: boolean
  isRepeatMode: boolean
  onToggleShuffle: () => void
  onToggleRepeat: () => void
}

export function MobilePlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  onNext,
  onPrevious,
  onClose,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  isShuffleMode,
  isRepeatMode,
  onToggleShuffle,
  onToggleRepeat,
}: MobilePlayerProps) {
  const [progressValue, setProgressValue] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (duration > 0) {
      setProgressValue((currentTime / duration) * 100)
    }
  }, [currentTime, duration])

  // Add Media Session API implementation for the mini mobile player
  // This should be added inside the MobilePlayer component

  // Add this useEffect hook after the existing useEffect hooks
  useEffect(() => {
    // Check if Media Session API is supported
    if ("mediaSession" in navigator && currentTrack) {
      // Create an Image object to preload the artwork
      const artworkImage = new Image()
      artworkImage.crossOrigin = "anonymous" // Add CORS support
      artworkImage.src = currentTrack.coverUrl || "/placeholder.svg"

      // Once the image is loaded, set the metadata with the artwork
      artworkImage.onload = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album,
          artwork: [
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "96x96", type: "image/jpeg" },
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "128x128", type: "image/jpeg" },
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "192x192", type: "image/jpeg" },
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "256x256", type: "image/jpeg" },
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "384x384", type: "image/jpeg" },
            { src: currentTrack.coverUrl || "/placeholder.svg", sizes: "512x512", type: "image/jpeg" },
          ],
        })
      }

      // Handle image loading errors
      artworkImage.onerror = () => {
        // Fallback to metadata without artwork or with placeholder
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album,
          // Use a simple placeholder if the image fails to load
          artwork: [{ src: "/placeholder.svg", sizes: "512x512", type: "image/svg+xml" }],
        })
      }

      // Update playback state
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
    }
  }, [currentTrack, isPlaying])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setProgressValue(newValue)
    onSeek((newValue / 100) * duration)
  }

  // Handle navigation with automatic player closing
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    e.stopPropagation()
    onClose() // Close the player first
    // Small delay to ensure smooth transition
    setTimeout(() => {
      router.push(path)
    }, 50)
  }

  // Get primary artist name (first artist if there are multiple)
  const getPrimaryArtist = () => {
    return currentTrack.artist.split(",")[0].trim()
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-muted-foreground">
          <X className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-medium">Now Playing</h2>
        </div>
        <div className="w-6"></div> {/* Empty div for balance */}
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className={cn(
            "w-full aspect-square max-w-xs rounded-lg overflow-hidden shadow-xl border border-gray-800",
            isPlaying ? "album-spinning" : "album-paused",
          )}
        >
          <img
            src={currentTrack.coverUrl || "/placeholder.svg"}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 py-4 text-center">
        <button
          onClick={(e) => handleNavigation(e, `/album/${encodeURIComponent(currentTrack.album)}`)}
          className="text-xl font-bold truncate block hover:underline w-full text-center"
        >
          {currentTrack.title}
        </button>
        <button
          onClick={(e) => handleNavigation(e, `/artist/${encodeURIComponent(getPrimaryArtist())}`)}
          className="text-muted-foreground hover:text-foreground hover:underline transition-colors w-full text-center"
        >
          {currentTrack.artist}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progressValue}
          onChange={handleProgressChange}
          className="w-full accent-primary h-1"
        />
        <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onToggleShuffle}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              isShuffleMode && "text-primary",
            )}
          >
            <Shuffle className="h-5 w-5" />
          </button>

          <button onClick={onPrevious} className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="h-7 w-7" />
          </button>

          <button
            onClick={onTogglePlay}
            className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>

          <button onClick={onNext} className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="h-7 w-7" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              isRepeatMode && "text-primary",
            )}
          >
            <Repeat className="h-5 w-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button onClick={onToggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full accent-white"
          />
        </div>
      </div>

      {/* Safe area padding for notched phones */}
      <div className="pb-safe"></div>
    </div>
  )
}

