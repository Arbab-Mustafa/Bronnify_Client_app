"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, Library, Music, Video } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileVideoPlayer } from "./mobile-video-player"
import { videoEdits } from "@/lib/data"

export function MobileNav() {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  if (!isMobile) return null

  const handleVideoButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowVideoPlayer(true)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-20 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              pathname === "/" ? "text-white" : "text-white/60",
            )}
          >
            <Home className="h-5 w-5 mb-1" />
            <span>Home</span>
          </Link>

          <Link
            href="/search"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              pathname === "/search" ? "text-white" : "text-white/60",
            )}
          >
            <Search className="h-5 w-5 mb-1" />
            <span>Search</span>
          </Link>

          <Link
            href="/library"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              pathname === "/library" ? "text-white" : "text-white/60",
            )}
          >
            <Library className="h-5 w-5 mb-1" />
            <span>Library</span>
          </Link>

          <Link
            href="/lebronaissance"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              pathname === "/lebronaissance" ? "text-white" : "text-white/60",
            )}
          >
            <Music className="h-5 w-5 mb-1" />
            <span>Music</span>
          </Link>

          <button
            onClick={handleVideoButtonClick}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              pathname === "/lebron-edits" ? "text-white" : "text-white/60",
            )}
          >
            <Video className="h-5 w-5 mb-1" />
            <span>Videos</span>
          </button>
        </div>
      </div>

      {showVideoPlayer && (
        <MobileVideoPlayer initialVideoId={videoEdits[0].id} onClose={() => setShowVideoPlayer(false)} />
      )}
    </>
  )
}

