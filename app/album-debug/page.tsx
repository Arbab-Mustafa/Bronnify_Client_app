"use client"

import { tracks } from "@/lib/data"
import Link from "next/link"

export default function AlbumDebugPage() {
  // Get unique albums
  const uniqueAlbums = Array.from(new Set(tracks.map((track) => track.album)))

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Album Debug Page</h1>

      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Available Albums ({uniqueAlbums.length})</h2>
        <ul className="space-y-2">
          {uniqueAlbums.map((album, index) => {
            const albumTracks = tracks.filter((track) => track.album === album)
            const coverUrl = albumTracks[0]?.coverUrl

            return (
              <li key={index} className="p-2 bg-muted rounded-md flex items-center gap-4">
                <div className="w-12 h-12 bg-card rounded-md overflow-hidden flex-shrink-0">
                  <img src={coverUrl || "/placeholder.svg"} alt={album} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{album}</div>
                  <div className="text-sm text-muted-foreground">
                    {albumTracks.length} tracks • Main artist: {albumTracks[0]?.artist.split(",")[0]}
                  </div>
                </div>
                <Link
                  href={`/album/${encodeURIComponent(album)}`}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  View
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Test Album Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {uniqueAlbums.map((album, index) => (
            <Link
              key={index}
              href={`/album/${encodeURIComponent(album)}`}
              className="p-2 bg-muted rounded-md hover:bg-accent/50 transition-colors"
            >
              {album}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

