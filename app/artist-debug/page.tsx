"use client"

import { useState } from "react"
import { artists } from "@/lib/artist-data"
import { tracks } from "@/lib/data"
import Link from "next/link"

export default function ArtistDebugPage() {
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

  // Find artists that appear in tracks but don't have profiles
  const missingArtists = trackArtistsList.filter(
    (artist) => !artists.some((a) => a.name.toLowerCase() === artist.toLowerCase()),
  )

  // Get artist data for selected artist
  const artistData = selectedArtist ? artists.find((a) => a.name === selectedArtist) : null

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
      <h1 className="text-2xl font-bold">Artist Debug Page</h1>

      {missingArtists.length > 0 && (
        <div className="bg-destructive/20 p-4 rounded-lg border border-destructive">
          <h2 className="text-xl font-bold mb-2 text-destructive">Missing Artist Profiles</h2>
          <p className="mb-2">The following artists appear in tracks but don't have full profiles:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {missingArtists.map((artist) => (
              <div key={artist} className="p-2 bg-card rounded-md flex justify-between items-center">
                <span>{artist}</span>
                <Link
                  href={`/artist/${encodeURIComponent(artist)}`}
                  className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Select an Artist</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {trackArtistsList.map((artist) => (
            <button
              key={artist}
              onClick={() => setSelectedArtist(artist)}
              className={`p-2 rounded-md text-left ${
                selectedArtist === artist ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent/50"
              } ${!artists.some((a) => a.name.toLowerCase() === artist.toLowerCase()) ? "border border-yellow-500" : ""}`}
            >
              {artist}
              {!artists.some((a) => a.name.toLowerCase() === artist.toLowerCase()) && (
                <span className="ml-2 text-xs text-yellow-500">(missing profile)</span>
              )}
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
                <span className="font-medium">Has artist data:</span> {artistData ? "Yes" : "No"}
              </p>
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
              <div key={album} className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                    <img
                      src={tracks[0]?.coverUrl || "/placeholder.svg"}
                      alt={album}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{album}</h3>
                    <Link href={`/album/${encodeURIComponent(album)}`} className="text-sm text-primary hover:underline">
                      View Album
                    </Link>
                  </div>
                </div>

                <ul className="pl-4 space-y-1">
                  {tracks.map((track) => (
                    <li key={track.id} className="text-sm">
                      <span className="font-medium">{track.title}</span>
                      <span className="text-muted-foreground"> - {track.artist}</span>
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

