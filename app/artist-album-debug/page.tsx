"use client"

import { useState } from "react"
import { tracks } from "@/lib/data"
import Link from "next/link"

export default function ArtistAlbumDebugPage() {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)

  // Get all unique artist names from tracks
  const allTrackArtists = new Set<string>()
  tracks.forEach((track) => {
    track.artist.split(",").forEach((artist) => {
      allTrackArtists.add(artist.trim())
    })
  })

  // Convert to array and sort
  const trackArtistsList = Array.from(allTrackArtists).sort()

  // Get tracks for selected artist
  const artistTracks = selectedArtist
    ? tracks.filter((track) => {
        const trackArtists = track.artist.split(",").map((a) => a.trim())
        return trackArtists.includes(selectedArtist)
      })
    : []

  // Group tracks by album
  const albumsMap = new Map<string, typeof tracks>()
  if (artistTracks.length > 0) {
    artistTracks.forEach((track) => {
      if (!albumsMap.has(track.album)) {
        albumsMap.set(track.album, [])
      }
      albumsMap.get(track.album)?.push(track)
    })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Artist-Album Relationship Debug</h1>

      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Select an Artist</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {trackArtistsList.map((artist) => (
            <button
              key={artist}
              onClick={() => setSelectedArtist(artist)}
              className={`p-2 rounded-md text-left ${
                selectedArtist === artist ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent/50"
              }`}
            >
              {artist}
            </button>
          ))}
        </div>
      </div>

      {selectedArtist && (
        <>
          <div className="bg-card p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Artist: {selectedArtist}</h2>
              <Link
                href={`/artist/${encodeURIComponent(selectedArtist)}`}
                className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                View Artist Page
              </Link>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-medium">Appears on tracks:</span> {artistTracks.length}
              </p>
              <p>
                <span className="font-medium">Appears on albums:</span> {albumsMap.size}
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Albums & Tracks</h2>

            {Array.from(albumsMap.entries()).map(([album, tracks]) => (
              <div key={album} className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-card rounded-md overflow-hidden">
                    <img
                      src={tracks[0]?.coverUrl || "/placeholder.svg"}
                      alt={album}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{album}</h3>
                    <div className="flex gap-2">
                      <Link
                        href={`/album/${encodeURIComponent(album)}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Album
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        ({tracks.length} {tracks.length === 1 ? "track" : "tracks"})
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {tracks.map((track) => (
                    <li key={track.id} className="p-2 bg-card rounded-md">
                      <div className="font-medium">{track.title}</div>
                      <div className="text-sm text-muted-foreground">Artists: {track.artist}</div>
                      <div className="text-xs text-muted-foreground mt-1">Track ID: {track.id}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

