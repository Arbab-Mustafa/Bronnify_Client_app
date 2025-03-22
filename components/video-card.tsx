"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Play } from "lucide-react"
import type { VideoEdit } from "@/lib/data"
import { formatTime } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileVideoPlayer } from "./mobile-video-player"

interface VideoCardProps {
  video: VideoEdit
  size?: "small" | "medium" | "large"
}

export function VideoCard({ video, size = "medium" }: VideoCardProps) {
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

  const sizeClasses = {
    small: "w-full",
    medium: "w-full",
    large: "w-full md:w-[calc(100%-2rem)]",
  }

  const aspectClasses = {
    small: "aspect-video",
    medium: "aspect-video",
    large: "aspect-[16/9]",
  }

  const titleClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl",
  }

  // Check if the video is a TikTok video
  const isTikTok = video.id.includes("tiktok")

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setShowMobilePlayer(true)
    }
  }

  return (
    <>
      <Link
        href={`/lebron-edits/${video.id}`}
        className={`group block ${sizeClasses[size]} rounded-lg overflow-hidden hover:bg-card transition-colors`}
        onClick={handleClick}
      >
        <div className="relative">
          <div className={`${aspectClasses[size]} bg-muted rounded-md overflow-hidden`}>
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <div className="bg-primary/80 rounded-full p-3">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* TikTok badge */}
          {isTikTok && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">TikTok</div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {formatTime(video.duration)}
          </div>
        </div>

        <div className="p-3">
          <h3 className={`font-medium ${titleClasses[size]} line-clamp-2`}>{video.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{formatViews(video.views)}</p>
            <p className="text-xs text-muted-foreground">{video.likes} likes</p>
          </div>
        </div>
      </Link>

      {showMobilePlayer && <MobileVideoPlayer initialVideoId={video.id} onClose={() => setShowMobilePlayer(false)} />}
    </>
  )
}

