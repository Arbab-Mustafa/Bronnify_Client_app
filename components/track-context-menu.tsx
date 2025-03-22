"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Plus, ListMusic, Share2, Heart } from "lucide-react"

interface TrackContextMenuProps {
  trackId: string
  onAddToQueue: (trackId: string) => void
}

export function TrackContextMenu({ trackId, onAddToQueue }: TrackContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 text-gray-400 hover:text-white rounded-full"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToQueue(trackId)
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700"
            >
              <ListMusic className="h-4 w-4" />
              Add to queue
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Add to playlist
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700"
            >
              <Heart className="h-4 w-4" />
              Like
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

