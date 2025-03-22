"use client"

import { X, Music } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface QueueViewProps {
  currentTrack: any
  queue: any[]
  onClose: () => void
  onPlayTrack: (trackId: string) => void
}

export function QueueView({ currentTrack, queue, onClose, onPlayTrack }: QueueViewProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <h2 className="text-xl font-bold">Play Queue</h2>
        <button onClick={onClose} className="text-white p-2">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Now Playing */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm text-gray-400 mb-2">Now Playing</h3>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-800 rounded-md overflow-hidden">
              <img
                src={currentTrack.coverUrl || "/placeholder.svg"}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentTrack.title}</div>
              <div className="text-sm text-gray-400 truncate">{currentTrack.artist}</div>
            </div>
            <div className="text-sm text-gray-400">{formatTime(currentTrack.duration)}</div>
          </div>
        </div>

        {/* Queue */}
        <div className="p-4">
          <h3 className="text-sm text-gray-400 mb-2">Next Up</h3>
          {queue.length > 0 ? (
            <div className="space-y-2">
              {queue.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => onPlayTrack(track.id)}
                >
                  <div className="text-sm text-gray-400 w-6 text-center">{index + 1}</div>
                  <div className="h-10 w-10 bg-gray-800 rounded-md overflow-hidden">
                    <img
                      src={track.coverUrl || "/placeholder.svg"}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{track.title}</div>
                    <div className="text-sm text-gray-400 truncate">{track.artist}</div>
                  </div>
                  <div className="text-sm text-gray-400">{formatTime(track.duration)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Music className="h-12 w-12 mb-2 opacity-50" />
              <p>Your queue is empty</p>
              <p className="text-sm">Add songs to your queue from any album or playlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

