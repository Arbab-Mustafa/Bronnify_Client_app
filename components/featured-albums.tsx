"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { tracks } from "@/lib/data"

// Modify the getUniqueAlbums function to add Bronfoolery at the top
const getUniqueAlbums = () => {
  const albums = new Map()

  // Add the new Bronfoolery album first to make it appear at the top
  const bronfooleryTrack = tracks.find((track) => track.album === "Bronfoolery")
  if (bronfooleryTrack) {
    albums.set(bronfooleryTrack.album, {
      title: bronfooleryTrack.album,
      coverUrl: bronfooleryTrack.coverUrl,
      artist: bronfooleryTrack.artist.split(",")[0],
    })
  }

  // Add the Bron and Jerry album next
  const bronAndJerryTrack = tracks.find((track) => track.album === "Bron and Jerry")
  if (bronAndJerryTrack) {
    albums.set(bronAndJerryTrack.album, {
      title: bronAndJerryTrack.album,
      coverUrl: bronAndJerryTrack.coverUrl,
      artist: bronAndJerryTrack.artist,
    })
  }

  // Add the new LeRnB song's album next
  const leRnBTrack = tracks.find((track) => track.title === "LeRnB")
  if (leRnBTrack) {
    albums.set(leRnBTrack.album, {
      title: leRnBTrack.album,
      coverUrl: leRnBTrack.coverUrl,
      artist: leRnBTrack.artist,
    })
  }

  // Add the Raymone album
  const raymoneTrack = tracks.find((track) => track.album === "Raymone")
  if (raymoneTrack) {
    albums.set(raymoneTrack.album, {
      title: raymoneTrack.album,
      coverUrl: raymoneTrack.coverUrl,
      artist: raymoneTrack.artist,
    })
  }

  // Add the BRON album
  const bronTrack = tracks.find((track) => track.album === "BRON")
  if (bronTrack) {
    albums.set(bronTrack.album, {
      title: bronTrack.album,
      coverUrl: bronTrack.coverUrl,
      artist: bronTrack.artist,
    })
  }

  // Then add the rest of the albums, excluding the ones we've already added
  tracks.forEach((track) => {
    // Skip albums we've already added and the ones we want to exclude
    if (!albums.has(track.album) && track.album !== "Like That (Remix)" && track.album !== "Please Stay LeBron") {
      albums.set(track.album, {
        title: track.album,
        coverUrl: track.coverUrl,
        artist: track.artist.split(",")[0], // Just take the first artist
      })
    }
  })

  return Array.from(albums.values())
}

export function FeaturedAlbums() {
  const [albums, setAlbums] = useState<any[]>([])

  useEffect(() => {
    setAlbums(getUniqueAlbums().slice(0, 6)) // Show only 6 albums
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {albums.map((album, i) => (
        <Link key={i} href={`/album/${encodeURIComponent(album.title)}`} className="group flex flex-col gap-2">
          <div className="relative aspect-square overflow-hidden rounded-md">
            {album.coverUrl ? (
              <Image
                src={album.coverUrl || "/placeholder.svg"}
                alt={album.title}
                fill
                className="object-cover transition-all group-hover:scale-105"
                unoptimized // Add this to bypass image optimization which might be causing issues
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-sm">
              <h3 className="font-medium leading-none">{album.title}</h3>
              <p className="text-xs text-muted-foreground">{album.artist}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:text-primary" />
          </div>
        </Link>
      ))}
    </div>
  )
}

