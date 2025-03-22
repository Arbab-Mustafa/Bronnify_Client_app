"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Bluetooth,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"

interface FullPlayerProps {
  currentTrack: any
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isShuffleMode: boolean
  isRepeatMode: boolean
  onToggleShuffle: () => void
  onToggleRepeat: () => void
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  playQueue?: any[]
  onShowQueue?: () => void
}

export function FullPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  onNext,
  onPrevious,
  onClose,
  isShuffleMode,
  isRepeatMode,
  onToggleShuffle,
  onToggleRepeat,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  playQueue,
  onShowQueue,
}: FullPlayerProps) {
  const [progressValue, setProgressValue] = useState(0)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null) // Declare audioRef

  // Get dominant color from album art (simplified version)
  const bgColor =
    currentTrack.album === "LeBronaissance"
      ? "from-green-900 to-black"
      : currentTrack.album === "LBJ"
        ? "from-red-900 to-black"
        : currentTrack.album === "First Day Out"
          ? "from-orange-900 to-black"
          : "from-blue-900 to-black"

  useEffect(() => {
    if (duration > 0) {
      setProgressValue((currentTime / duration) * 100)
    }
  }, [currentTime, duration])

  // Add Media Session API implementation for the full-screen mobile player
  // This should be added inside the FullPlayer component

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

  // Add another useEffect to update playback position
  useEffect(() => {
    if ("mediaSession" in navigator && audioRef.current) {
      // Update position state if supported
      try {
        navigator.mediaSession.setPositionState({
          duration: duration || 0,
          playbackRate: audioRef.current.playbackRate,
          position: currentTime || 0,
        })
      } catch (error) {
        // Position state may not be supported in all browsers
        console.log("Position state not supported")
      }
    }
  }, [currentTime, duration])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setProgressValue(newValue)
    onSeek((newValue / 100) * duration)
  }

  // Get primary artist name (first artist if there are multiple)
  const getPrimaryArtist = () => {
    return currentTrack.artist.split(",")[0].trim()
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

  // Handle swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current) return

    const touchY = e.touches[0].clientY
    const deltaY = touchY - touchStartY.current

    // If swiping down more than 50px, close the player
    if (deltaY > 50) {
      onClose()
      touchStartY.current = null
    }
  }

  const handleTouchEnd = () => {
    touchStartY.current = null
  }

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b ${bgColor} z-50 flex flex-col`}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-medium text-white">Now Playing</h2>
        </div>
        <button className="text-white" onClick={onShowQueue}>
          <ListMusic className="h-6 w-6" />
        </button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full aspect-square max-w-xs rounded-md overflow-hidden shadow-2xl">
          <img
            src={currentTrack.coverUrl || "/placeholder.svg"}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 pb-4">
        <button
          onClick={(e) => handleNavigation(e, `/album/${encodeURIComponent(currentTrack.album)}`)}
          className="text-2xl font-bold text-white hover:text-primary transition-colors block w-full text-left"
        >
          {currentTrack.title}
        </button>
        <button
          onClick={(e) => handleNavigation(e, `/artist/${encodeURIComponent(getPrimaryArtist())}`)}
          className="text-white/70 hover:text-primary transition-colors block w-full text-left"
        >
          {getPrimaryArtist()}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progressValue}
          onChange={handleProgressChange}
          className="w-full accent-white h-1"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/70">{formatTime(currentTime)}</span>
          <span className="text-xs text-white/70">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onToggleShuffle}
            className={cn("text-white/70 hover:text-white transition-colors", isShuffleMode && "text-green-400")}
          >
            <Shuffle className="h-5 w-5" />
          </button>

          <button onClick={onPrevious} className="text-white hover:text-white/80 transition-colors">
            <SkipBack className="h-8 w-8" />
          </button>

          <button
            onClick={onTogglePlay}
            className="bg-white text-black rounded-full p-4 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>

          <button onClick={onNext} className="text-white hover:text-white/80 transition-colors">
            <SkipForward className="h-8 w-8" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={cn("text-white/70 hover:text-white transition-colors", isRepeatMode && "text-green-400")}
          >
            <Repeat className="h-5 w-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onToggleMute} className="text-white/70 hover:text-white transition-colors">
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

        {/* Device */}
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Bluetooth className="h-4 w-4" />
          <span className="text-xs">Bronify Web Player</span>
        </div>
      </div>

      {/* Safe area padding for notched phones */}
      <div className="pb-safe"></div>
    </div>
  )
}

