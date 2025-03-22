"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import type { VideoEdit } from "@/lib/data"
import { formatTime } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileVideoPlayer } from "./mobile-video-player"

interface FeaturedVideoProps {
  video: VideoEdit
}

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    } else {
      return `${views} views`
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setShowMobilePlayer(true)
    } else {
      // For desktop, navigate to the video page
      router.push(`/lebron-edits/${video.id}`)
    }
  }

  return (
    <>
      <div
        className="group relative block w-full rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        <div className="aspect-video md:aspect-[21/9] bg-muted rounded-lg overflow-hidden">
          <img
            src={video.thumbnailUrl || "/placeholder.svg"}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovering ? "scale-105" : "scale-100"
            }`}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {/* Play button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`bg-primary/80 rounded-full p-3 md:p-4 transition-transform duration-300 ${
                isHovering ? "scale-110" : "scale-100"
              }`}
            >
              <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>

          {/* Video info - improved for mobile */}
          {isMobile ? (
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h2 className="text-lg font-bold mb-1 line-clamp-1">{video.title}</h2>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">{formatViews(video.views)}</span>
                <span className="text-xs text-white/70">{formatTime(video.duration)}</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
              <p className="text-muted-foreground mb-2">{video.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formatViews(video.views)}</span>
                <span className="text-sm text-muted-foreground">{formatTime(video.duration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatTime(video.duration)}
        </div>
      </div>

      {showMobilePlayer && <MobileVideoPlayer initialVideoId={video.id} onClose={() => setShowMobilePlayer(false)} />}
    </>
  )
}

