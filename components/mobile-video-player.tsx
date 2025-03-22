"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, Heart, Copy, MoreHorizontal, Play } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { videoEdits } from "@/lib/data"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MobileVideoPlayerProps {
  initialVideoId: string
  onClose: () => void
}

export function MobileVideoPlayer({ initialVideoId, onClose }: MobileVideoPlayerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Limit the number of videos to improve performance
  const MAX_VIDEOS = 10

  // Prepare videos - only load a subset for better performance
  const prepareVideos = useCallback(() => {
    // Find the initial video
    const initialIndex = videoEdits.findIndex((v) => v.id === initialVideoId)
    if (initialIndex === -1) return videoEdits.slice(0, MAX_VIDEOS)

    // Get videos around the initial video
    const startIndex = Math.max(0, initialIndex - Math.floor(MAX_VIDEOS / 2))
    return videoEdits.slice(startIndex, startIndex + MAX_VIDEOS)
  }, [initialVideoId])

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState(prepareVideos)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)
  const [controlsVisible, setControlsVisible] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userPausedRef = useRef<Record<string, boolean>>({})
  const isScrollingRef = useRef(false)
  const lastScrollTime = useRef(Date.now())

  // Find the initial video index
  useEffect(() => {
    const index = videos.findIndex((v) => v.id === initialVideoId)
    if (index !== -1) {
      setCurrentVideoIndex(index)
    }

    // Initialize user paused state
    videos.forEach((video) => {
      userPausedRef.current[video.id] = false
    })

    // Set loading to false after a short delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [initialVideoId, videos])

  // Function to show controls temporarily
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false)
    }, 3000)
  }, [])

  // Handle video playback - optimized version
  const playVideo = useCallback((videoId: string) => {
    // Don't play if user explicitly paused this video
    if (userPausedRef.current[videoId]) return

    const videoElement = videoRefs.current[videoId]
    if (!videoElement) return

    // If video is already playing, don't try to play again
    if (!videoElement.paused) return

    // Use a promise to handle play() which returns a promise
    videoElement.play().catch((err) => {
      console.log("Autoplay prevented:", err)
    })
  }, [])

  // Handle video pause
  const pauseVideo = useCallback((videoId: string, userInitiated = false) => {
    const videoElement = videoRefs.current[videoId]
    if (!videoElement || videoElement.paused) return

    // If user initiated, mark this video as paused by user
    if (userInitiated) {
      userPausedRef.current[videoId] = true
    }

    videoElement.pause()
  }, [])

  // Toggle play/pause for current video
  const togglePlay = useCallback(
    (videoId: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation()
      }

      const videoElement = videoRefs.current[videoId]
      if (!videoElement) return

      if (videoElement.paused) {
        // User is resuming playback
        userPausedRef.current[videoId] = false
        playVideo(videoId)
      } else {
        // User is pausing
        pauseVideo(videoId, true)
      }
    },
    [playVideo, pauseVideo],
  )

  // Handle video tap to toggle play/pause
  const handleVideoTap = useCallback(
    (videoId: string) => {
      showControlsTemporarily()
      togglePlay(videoId)
    },
    [showControlsTemporarily, togglePlay],
  )

  // Toggle like for a video
  const toggleLike = useCallback((videoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }, [])

  // Handle scroll to specific video - optimized version
  const scrollToVideo = useCallback(
    (index: number) => {
      if (index < 0 || index >= videos.length) return

      const videoContainer = document.querySelector(`[data-video-container="${videos[index].id}"]`)
      if (videoContainer) {
        isScrollingRef.current = true
        lastScrollTime.current = Date.now()

        videoContainer.scrollIntoView({ behavior: "smooth" })
        setCurrentVideoIndex(index)

        // Reset user paused state when manually navigating
        userPausedRef.current[videos[index].id] = false

        // Small delay to ensure DOM updates before playing
        setTimeout(() => {
          playVideo(videos[index].id)

          // Mark scrolling as complete after animation finishes
          setTimeout(() => {
            isScrollingRef.current = false
          }, 500)
        }, 50)
      }
    },
    [videos, playVideo],
  )

  // Handle touch start for swipe detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  // Handle touch end for swipe detection
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchEndY - touchStartY.current

      // If swipe distance is significant
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentVideoIndex > 0) {
          // Swipe down - go to previous video
          scrollToVideo(currentVideoIndex - 1)
        } else if (deltaY < 0 && currentVideoIndex < videos.length - 1) {
          // Swipe up - go to next video
          scrollToVideo(currentVideoIndex + 1)
        }
      }

      touchStartY.current = null
    },
    [currentVideoIndex, videos.length, scrollToVideo],
  )

  // Preload videos for smoother playback
  const preloadAdjacentVideos = useCallback(
    (currentIndex: number) => {
      // Preload next video
      if (currentIndex + 1 < videos.length) {
        const nextVideo = videoRefs.current[videos[currentIndex + 1].id]
        if (nextVideo && nextVideo.preload !== "auto") {
          nextVideo.preload = "auto"
          // Start loading but don't play
          nextVideo.load()
        }
      }

      // Preload previous video
      if (currentIndex > 0) {
        const prevVideo = videoRefs.current[videos[currentIndex - 1].id]
        if (prevVideo && prevVideo.preload !== "auto") {
          prevVideo.preload = "auto"
          prevVideo.load()
        }
      }
    },
    [videos],
  )

  // Handle video visibility changes - completely rewritten for performance
  useEffect(() => {
    if (!isMobile || isLoading) return

    // Function to determine which video is most visible
    const determineVisibleVideo = () => {
      if (!containerRef.current) return

      // Don't process scroll events too frequently
      const now = Date.now()
      if (now - lastScrollTime.current < 100) return
      lastScrollTime.current = now

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerHeight = containerRect.height
      const containerTop = containerRect.top

      // Find which video is most visible
      let maxVisibleArea = 0
      let maxVisibleIndex = currentVideoIndex

      videos.forEach((video, index) => {
        const videoContainer = document.querySelector(`[data-video-container="${video.id}"]`)
        if (!videoContainer) return

        const videoRect = videoContainer.getBoundingClientRect()
        const visibleTop = Math.max(videoRect.top, containerTop)
        const visibleBottom = Math.min(videoRect.bottom, containerTop + containerHeight)

        if (visibleBottom > visibleTop) {
          const visibleArea = visibleBottom - visibleTop
          if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea
            maxVisibleIndex = index
          }
        }
      })

      // If the most visible video changed
      if (maxVisibleIndex !== currentVideoIndex) {
        setCurrentVideoIndex(maxVisibleIndex)

        // Reset user paused state for the new current video
        userPausedRef.current[videos[maxVisibleIndex].id] = false

        // Play the current video immediately
        playVideo(videos[maxVisibleIndex].id)

        // Preload adjacent videos
        preloadAdjacentVideos(maxVisibleIndex)

        // Pause videos that are far from view (more than 2 positions away)
        videos.forEach((video, index) => {
          if (Math.abs(index - maxVisibleIndex) > 1 && videoRefs.current[video.id]) {
            pauseVideo(video.id)
          }
        })
      }
    }

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (scrollTimeout) return

      scrollTimeout = setTimeout(() => {
        determineVisibleVideo()
        scrollTimeout = null
      }, 50)
    }

    // Add scroll event listener
    containerRef.current?.addEventListener("scroll", handleScroll)

    // Initial play of the current video
    const currentVideo = videos[currentVideoIndex]
    if (currentVideo) {
      // Reset user paused state
      userPausedRef.current[currentVideo.id] = false

      // Play immediately
      setTimeout(() => {
        playVideo(currentVideo.id)
        preloadAdjacentVideos(currentVideoIndex)
      }, 100)
    }

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [isMobile, videos, currentVideoIndex, isLoading, playVideo, pauseVideo, preloadAdjacentVideos])

  // Handle video ended event
  const handleVideoEnded = useCallback(
    (videoId: string) => {
      // When a video ends, automatically go to the next one if available
      const videoIndex = videos.findIndex((v) => v.id === videoId)
      if (videoIndex < videos.length - 1) {
        scrollToVideo(videoIndex + 1)
      } else {
        // If it's the last video, loop back to the beginning
        const videoElement = videoRefs.current[videoId]
        if (videoElement) {
          videoElement.currentTime = 0
          playVideo(videoId)
        }
      }
    },
    [videos, scrollToVideo, playVideo],
  )

  // Handle safe area insets for iOS devices
  useEffect(() => {
    const updateSafeAreas = () => {
      const safeAreaTop = window.innerHeight - document.documentElement.clientHeight
      const safeAreaBottom = Math.max(window.innerHeight - document.documentElement.clientHeight - safeAreaTop, 0)

      document.documentElement.style.setProperty("--safe-area-top", `${safeAreaTop}px`)
      document.documentElement.style.setProperty("--safe-area-bottom", `${safeAreaBottom}px`)
    }

    updateSafeAreas()
    window.addEventListener("resize", updateSafeAreas)

    return () => {
      window.removeEventListener("resize", updateSafeAreas)

      // Clean up timeouts
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Clean up videos when component unmounts
  useEffect(() => {
    return () => {
      // Pause and unload all videos
      Object.keys(videoRefs.current).forEach((id) => {
        if (videoRefs.current[id]) {
          videoRefs.current[id]!.pause()
          videoRefs.current[id]!.src = ""
          videoRefs.current[id]!.load()
        }
      })
    }
  }, [])

  if (!isMobile) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black overflow-y-auto snap-y snap-mandatory"
      style={{
        paddingTop: "var(--safe-area-top, 0px)",
        paddingBottom: "var(--safe-area-bottom, 0px)",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pt-safe">
        <button onClick={onClose} className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="text-white font-medium">LeReel James</div>
        <div className="w-6"></div>
      </div>

      {/* Videos */}
      {videos.map((video, index) => {
        const isCurrentVideo = index === currentVideoIndex
        const isNearby = Math.abs(index - currentVideoIndex) <= 1
        const isUserPaused = userPausedRef.current[video.id]

        return (
          <div
            key={video.id}
            data-video-container={video.id}
            data-video-id={video.id}
            className="w-full h-[100dvh] flex items-center justify-center snap-start relative"
            onClick={() => handleVideoTap(video.id)}
          >
            {/* Only render video elements for current and adjacent videos */}
            {isNearby && (
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                src={video.videoUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                playsInline
                loop
                muted={false}
                preload={isCurrentVideo ? "auto" : "metadata"}
                poster={isCurrentVideo ? undefined : video.thumbnailUrl}
                onEnded={() => handleVideoEnded(video.id)}
                // Remove these attributes that might cause issues
                // webkit-playsinline="true"
                // x5-playsinline="true"
                // x5-video-player-type="h5"
                // x5-video-player-fullscreen="true"
              />
            )}

            {/* Play/Pause overlay - only show when explicitly paused by user */}
            {isUserPaused && isCurrentVideo && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  userPausedRef.current[video.id] = false
                  playVideo(video.id)
                }}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-5">
                  <Play className="h-10 w-10 text-white" />
                </div>
              </div>
            )}

            {/* Video info overlay - bottom section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-16 md:pb-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
              <p className="text-white/70 text-sm">
                {formatTime(video.duration)} • {video.views.toLocaleString()} views
              </p>
              <p className="text-white/70 text-sm mt-1 line-clamp-2">{video.description}</p>
            </div>

            {/* Right side interaction buttons */}
            <div className="absolute right-4 bottom-[20%] flex flex-col items-center gap-6">
              <button onClick={(e) => toggleLike(video.id, e)} className="flex flex-col items-center">
                <Heart className={`h-8 w-8 ${liked[video.id] ? "fill-red-500 text-red-500" : "text-white"}`} />
                <span className="text-white text-xs mt-1">{liked[video.id] ? video.likes + 1 : video.likes}</span>
              </button>
              <button
                className="flex flex-col items-center"
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(`https://bronify.com/lebron-edits/${video.id}`)
                  alert("Link copied to clipboard!")
                }}
              >
                <Copy className="h-8 w-8 text-white" />
                <span className="text-white text-xs mt-1">Copy</span>
              </button>
              <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-8 w-8 text-white" />
                <span className="text-white text-xs mt-1">More</span>
              </button>
            </div>

            {/* Swipe indicator */}
            {index < videos.length - 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-xs">
                Swipe up for next video
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

