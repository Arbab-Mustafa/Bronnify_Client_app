"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, ListMusic } from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import { tracks } from "@/lib/data"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MiniPlayer } from "./mini-player"
import { FullPlayer } from "./full-player"
import { QueueView } from "./queue-view"

export default function Player() {
  const [currentTrack, setCurrentTrack] = useState(tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isShuffleMode, setIsShuffleMode] = useState(false)
  const [isRepeatMode, setIsRepeatMode] = useState(false)
  const [playQueue, setPlayQueue] = useState<any[]>([])
  const [showFullPlayer, setShowFullPlayer] = useState(false)
  const [showQueueView, setShowQueueView] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [useFallbackPlayer, setUseFallbackPlayer] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // For improved playback support in mobile browsers
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error("Playback failed:", error)
            // Show a play button or message to the user
            setIsPlaying(false)
          })
      }
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Generate a shuffled queue of tracks
  const generateShuffledQueue = useCallback(() => {
    return [...tracks].sort(() => Math.random() - 0.5).map((track) => track.id)
  }, [])

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    const newShuffleMode = !isShuffleMode
    setIsShuffleMode(newShuffleMode)

    if (newShuffleMode) {
      // Generate a new shuffled queue, but start with current track
      const currentTrackId = currentTrack.id
      const filteredTracks = tracks.filter((t) => t.id !== currentTrackId).map((t) => t.id)
      const shuffledTracks = [currentTrackId, ...filteredTracks.sort(() => Math.random() - 0.5)]
      setPlayQueue(shuffledTracks)
    } else {
      // In non-shuffle mode, create a sequential queue starting from current track
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id)
      const orderedQueue = [
        ...tracks.slice(currentIndex).map((t) => t.id),
        ...tracks.slice(0, currentIndex).map((t) => t.id),
      ]
      setPlayQueue(orderedQueue)
    }
  }, [isShuffleMode, currentTrack.id])

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setIsRepeatMode(!isRepeatMode)
  }, [isRepeatMode])

  // Handle track change with improved error handling
  const changeTrack = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "next") {
        if (playQueue.length > 0) {
          // Remove current track from queue and get next
          const updatedQueue = [...playQueue]
          const nextTrackId = updatedQueue.shift()
          setPlayQueue(updatedQueue)

          if (nextTrackId) {
            const nextTrack = tracks.find((t) => t.id === nextTrackId)
            if (nextTrack) {
              setCurrentTrack(nextTrack)
              setCurrentTime(0)
              setAudioLoaded(false)
              setIsBuffering(true)
            }
          }
        } else {
          // Fallback if queue is empty
          const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
          const newIndex = (currentIndex + 1) % tracks.length
          setCurrentTrack(tracks[newIndex])
          setCurrentTime(0)
          setAudioLoaded(false)
          setIsBuffering(true)
        }
      } else {
        // For previous, just go to previous track in the original order
        const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
        const newIndex = (currentIndex - 1 + tracks.length) % tracks.length
        setCurrentTrack(tracks[newIndex])
        setCurrentTime(0)
        setAudioLoaded(false)
        setIsBuffering(true)
      }

      // Auto-play when changing tracks
      if (isPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play()

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  // Playback started successfully
                  setIsPlaying(true)
                })
                .catch((error) => {
                  console.error("Auto-play failed:", error)
                  setIsPlaying(false)
                })
            }
          }
        }, 100)
      }
    },
    [playQueue, isPlaying, currentTrack.id],
  )

  // Shuffle all tracks and play with improved mobile support
  const shuffleAllTracks = useCallback(() => {
    const shuffledQueue = generateShuffledQueue()
    const firstTrackId = shuffledQueue.shift() || tracks[0].id
    const firstTrack = tracks.find((t) => t.id === firstTrackId) || tracks[0]

    setCurrentTrack(firstTrack)
    setPlayQueue(shuffledQueue)
    setIsShuffleMode(true)
    setCurrentTime(0)
    setAudioLoaded(false)
    setIsBuffering(true)

    setTimeout(() => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.error("Shuffle play failed:", error)
              setIsPlaying(false)
            })
        }
      }
    }, 100)
  }, [generateShuffledQueue])

  // Play specific track by ID with improved mobile support
  const playTrackById = useCallback(
    (trackId: string) => {
      // Find the track in our data
      const track = tracks.find((t) => t.id === trackId)
      if (!track) return

      setCurrentTrack(track)
      setCurrentTime(0)
      setAudioLoaded(false)
      setIsBuffering(true)

      // Update queue based on current mode
      if (isShuffleMode) {
        // Create a new shuffled queue excluding the current track
        const filteredTracks = tracks.filter((t) => t.id !== trackId).map((t) => t.id)
        setPlayQueue(filteredTracks.sort(() => Math.random() - 0.5))
      } else {
        // Create sequential queue starting after the selected track, but only include tracks from the same album
        const currentAlbum = track.album
        const albumTracks = tracks.filter((t) => t.album === currentAlbum)
        const trackIndex = albumTracks.findIndex((t) => t.id === trackId)

        const orderedQueue = albumTracks
          .slice(trackIndex + 1)
          .concat(albumTracks.slice(0, trackIndex))
          .map((t) => t.id)

        setPlayQueue(orderedQueue)
      }

      // Try to play the track
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                console.error("Play track failed:", error)
                setIsPlaying(false)

                // For iOS, we need user interaction
                if (isMobile) {
                  alert("Tap again to play the track (required on mobile devices)")
                }
              })
          }
        }
      }, 100)
    },
    [isShuffleMode, isMobile],
  )

  // Add track to queue with improved toast notification for static sites
  const addToQueue = useCallback((trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    if (track) {
      // Add to the end of the current queue
      setPlayQueue((prevQueue) => [...prevQueue, trackId])

      // Show a toast notification
      if (typeof document !== "undefined") {
        const toast = document.createElement("div")
        toast.className =
          "toast-notification fixed left-1/2 bottom-24 bg-primary text-white px-4 py-2 rounded-full text-sm z-50"
        toast.textContent = `Added "${track.title}" to queue`
        document.body.appendChild(toast)

        setTimeout(() => {
          toast.style.opacity = "0"
          toast.style.transition = "opacity 300ms"
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast)
            }
          }, 300)
        }, 2000)
      }
    }
  }, [])

  // Get queue tracks
  const getQueueTracks = useCallback(() => {
    return playQueue.map((trackId) => tracks.find((t) => t.id === trackId)).filter(Boolean)
  }, [playQueue])

  // Expose current track info and playTrackById to window for other components to use
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.playTrackById = playTrackById
      // @ts-ignore
      window.shuffleAllTracks = shuffleAllTracks
      // @ts-ignore
      window.addToQueue = addToQueue

      // @ts-ignore
      window.currentTrackInfo = {
        id: currentTrack.id,
        playing: isPlaying,
      }

      // Dispatch custom event when track changes
      const trackChangedEvent = new CustomEvent("trackChanged", {
        detail: {
          id: currentTrack.id,
          playing: isPlaying,
        },
      })
      window.dispatchEvent(trackChangedEvent)
    }
  }, [currentTrack.id, isPlaying, playQueue, playTrackById, shuffleAllTracks, addToQueue])

  // Handle Media Session API for media controls in browser/OS
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return

    if (currentTrack) {
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

      // Set action handlers for media controls
      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play()
        setIsPlaying(true)
      })

      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause()
        setIsPlaying(false)
      })

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        changeTrack("prev")
      })

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        changeTrack("next")
      })

      // Add seekto handler if supported
      try {
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (details.seekTime && audioRef.current) {
            audioRef.current.currentTime = details.seekTime
            setCurrentTime(details.seekTime)
          }
        })
      } catch (error) {
        console.log("Seekto is not supported.")
      }

      // Update playback state
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
    }
  }, [currentTrack, isPlaying, changeTrack])

  // Update position state for Media Session API
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !audioRef.current) return

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
  }, [currentTime, duration])

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return

    const progressRect = progressRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - progressRect.left
    const progressWidth = progressRect.width
    const percentage = clickPosition / progressWidth

    const newTime = percentage * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement> | number) => {
    const newVolume = typeof e === "number" ? e : Number.parseFloat(e.target.value)
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
    } else {
      audioRef.current.volume = 0
    }
    setIsMuted(!isMuted)
  }

  // Initialize queue on first load
  useEffect(() => {
    // Create initial sequential queue starting from the first track
    const initialQueue = tracks.slice(1).map((t) => t.id)
    setPlayQueue(initialQueue)
  }, [])

  // Simplified audio loading function that uses standard HTML5 audio
  // This avoids the complexity and potential issues with MSE
  const loadAudioTrack = (audioElement, audioUrl) => {
    if (!audioElement) return

    // Reset any previous state
    audioElement.pause()

    // Set the source directly - simpler and more compatible approach
    audioElement.src = audioUrl

    // Preload metadata to get duration info quickly
    audioElement.preload = "metadata"

    // Set up caching hints via crossOrigin attribute
    audioElement.crossOrigin = "anonymous"

    // Add cache-control header hint via a data attribute (some browsers respect this)
    audioElement.dataset.cacheControl = "max-age=31536000, immutable"

    // Load the audio file
    audioElement.load()

    // If we were playing, try to continue playing the new track
    if (isPlaying) {
      const playPromise = audioElement.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Could not autoplay:", error)
          setIsPlaying(false)
        })
      }
    }
  }

  // Handle audio loading states and playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (isRepeatMode) {
        // Repeat the same track
        audio.currentTime = 0
        audio.play().catch((error) => {
          console.error("Replay failed:", error)
          setIsPlaying(false)
        })
      } else {
        // Play next track
        changeTrack("next")
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setAudioLoaded(true)
      setIsBuffering(false)
    }

    const handleCanPlayThrough = () => {
      setIsBuffering(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setIsBuffering(false)

      // Try to recover by loading an alternative source or showing an error message
      if (navigator.onLine) {
        // If online, try to reload the audio with a slight delay
        setTimeout(() => {
          // Try a direct approach without MSE
          setUseFallbackPlayer(true)
          loadAudioTrack(audio, currentTrack.audioUrl)
        }, 1000)
      } else {
        // If offline, show a message
        setIsPlaying(false)
        alert("Cannot play audio while offline. Please check your connection.")
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrack, isRepeatMode, changeTrack])

  // Set initial volume when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Get primary artist name (first artist if there are multiple)
  const getPrimaryArtist = () => {
    return currentTrack.artist.split(",")[0].trim()
  }

  // Update your audio element initialization
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Use the simpler direct approach instead of MSE
      loadAudioTrack(audioRef.current, currentTrack.audioUrl)
    }
  }, [currentTrack])

  return (
    <>
      {/* Queue View */}
      {showQueueView && (
        <QueueView
          currentTrack={currentTrack}
          queue={getQueueTracks()}
          onClose={() => setShowQueueView(false)}
          onPlayTrack={playTrackById}
        />
      )}

      {/* Full-screen player for mobile */}
      {showFullPlayer && isMobile && (
        <FullPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onNext={() => changeTrack("next")}
          onPrevious={() => changeTrack("prev")}
          onClose={() => setShowFullPlayer(false)}
          isShuffleMode={isShuffleMode}
          isRepeatMode={isRepeatMode}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          playQueue={getQueueTracks()}
          onShowQueue={() => setShowQueueView(true)}
        />
      )}

      {/* Mini-player for mobile */}
      <MiniPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onOpenFullPlayer={() => setShowFullPlayer(true)}
        onNext={() => changeTrack("next")}
        onPrevious={() => changeTrack("prev")}
      />

      {/* Desktop player */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border h-20 px-4 flex items-center z-10 ${isMobile ? "hidden" : "block"}`}
      >
        <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

        {/* Loading/Buffering indicator */}
        {isBuffering && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
            <div className="absolute h-full bg-primary animate-pulse" style={{ width: "100%", opacity: 0.7 }}></div>
          </div>
        )}

        <div className="flex items-center w-1/4">
          <div
            className={cn(
              "w-14 h-14 rounded-full overflow-hidden shadow-md border border-gray-800",
              isPlaying ? "album-spinning" : "album-paused",
            )}
          >
            <img
              src={currentTrack.coverUrl || "/placeholder.svg"}
              alt={currentTrack.album}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block ml-3">
            <Link
              href={`/album/${encodeURIComponent(currentTrack.album)}`}
              className="font-medium text-sm hover:text-primary transition-colors"
            >
              {currentTrack.title}
            </Link>
            <Link
              href={`/artist/${encodeURIComponent(getPrimaryArtist())}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors block"
            >
              {getPrimaryArtist()}
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2 px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                isShuffleMode && "text-primary",
              )}
              title="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={() => changeTrack("prev")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={() => changeTrack("next")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                isRepeatMode && "text-primary",
              )}
              title="Repeat"
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-xs">
            <span className="text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
            <div ref={progressRef} className="progress-bar flex-1" onClick={handleProgressClick}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
              <div
                className="progress-bar-handle"
                style={{
                  left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-muted-foreground w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-1/4 flex justify-end items-center gap-3">
          <button
            onClick={() => setShowQueueView(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Queue"
          >
            <ListMusic className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 w-32">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full accent-white"
            />
          </div>
        </div>
      </div>
    </>
  )
}

