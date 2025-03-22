"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react"
import { formatTime } from "@/lib/utils"
import type { VideoEdit } from "@/lib/data"

interface VideoPlayerProps {
  video: VideoEdit
  autoPlay?: boolean
  onEnded?: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function VideoPlayer({ video, autoPlay = false, onEnded, onNext, onPrevious }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause()
    } else {
      videoRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return

    const progressRect = progressRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - progressRect.left
    const progressWidth = progressRect.width
    const percentage = clickPosition / progressWidth

    videoRef.current.currentTime = percentage * duration
  }

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return

    if (isMuted) {
      videoRef.current.volume = volume
    } else {
      videoRef.current.volume = 0
    }
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)

    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    setShowControls(true)

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  // Update time as video plays
  useEffect(() => {
    const video = videoRef.current

    const updateTime = () => {
      if (video) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onEnded) {
        onEnded()
      }
    }

    const handleLoadedMetadata = () => {
      if (video) {
        setDuration(video.duration)

        // Try to play again when metadata is loaded if autoPlay is true
        if (autoPlay && videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.log("Auto-play failed after metadata loaded:", error)
              setIsPlaying(false)
            })
        }
      }
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    video?.addEventListener("timeupdate", updateTime)
    video?.addEventListener("ended", handleEnded)
    video?.addEventListener("loadedmetadata", handleLoadedMetadata)
    video?.addEventListener("waiting", handleWaiting)
    video?.addEventListener("playing", handlePlaying)

    return () => {
      video?.removeEventListener("timeupdate", updateTime)
      video?.removeEventListener("ended", handleEnded)
      video?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video?.removeEventListener("waiting", handleWaiting)
      video?.removeEventListener("playing", handlePlaying)
    }
  }, [onEnded])

  // Set initial volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }, [])

  // Auto-play if specified
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      // Add a small delay to ensure the video is ready
      const playPromise = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.log("Auto-play failed:", error)
              setIsPlaying(false)
            })
        }
      }, 300)

      return () => clearTimeout(playPromise)
    }
  }, [autoPlay, video.videoUrl])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-contain"
        poster={video.thumbnailUrl}
        onClick={togglePlay}
        playsInline
        crossOrigin="anonymous"
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 bg-gray-600 rounded-full mb-4 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onPrevious && (
              <button onClick={onPrevious} className="text-white hover:text-primary transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2 hover:bg-primary hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            {onNext && (
              <button onClick={onNext} className="text-white hover:text-primary transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-primary"
              />
            </div>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Play button overlay when paused */}
      {!isPlaying && !isBuffering && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-5">
            <Play className="h-10 w-10 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}

