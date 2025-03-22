"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { tracks } from "@/lib/data"
import { formatTime } from "@/lib/utils"
import { Play, Pause } from "lucide-react"
import { ShuffleMusicButton } from "@/components/shuffle-music-button"

export default function LeBronaissancePage() {
  const lebronRenaissanceTracks = tracks.filter((track) => track.album === "LeBronaissance")
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const albumCover = lebronRenaissanceTracks[0]?.coverUrl

  const playTrack = (trackId: string) => {
    // @ts-ignore - This is defined in the Player component
    if (window.playTrackById) {
      // @ts-ignore
      window.playTrackById(trackId)
      setCurrentTrackId(trackId)
      setIsPlaying(true)
    }
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title="LeBronaissance"
        description="LeBron's musical renaissance featuring his greatest parody hits"
      />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 aspect-square bg-muted rounded-md overflow-hidden">
          <img src={albumCover || "/placeholder.svg"} alt="LeBronaissance" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-end">
          {/* Remove the duplicate title and just keep the description */}
          <p className="text-sm font-medium">Featured Album</p>
          <div className="text-sm text-muted-foreground mt-2">{lebronRenaissanceTracks.length} songs</div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => playTrack(lebronRenaissanceTracks[0].id)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Play Album
            </button>
            <ShuffleMusicButton />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-card p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">About LeBronaissance</h2>
        <p className="text-muted-foreground">
          The LeBronaissance album represents LeBron James' musical journey through parody hits that celebrate his
          career and legacy. Each track offers a unique perspective on the basketball legend's impact on and off the
          court, reimagined through familiar melodies. With 11 tracks spanning various musical styles, this album is the
          definitive collection of LeBron-inspired music.
        </p>
      </div>

      <div className="bg-card/30 rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="w-12 text-right">⏱️</div>
        </div>

        <div className="divide-y divide-border">
          {lebronRenaissanceTracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 hover:bg-accent/50 transition-colors"
            >
              <div className="w-8 text-center flex items-center justify-center">
                <button
                  onClick={() => playTrack(track.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentTrackId === track.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{track.title}</span>
                <span className="text-sm text-muted-foreground">{track.artist}</span>
              </div>
              <div className="w-12 text-right text-muted-foreground flex items-center justify-end">
                {formatTime(track.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

