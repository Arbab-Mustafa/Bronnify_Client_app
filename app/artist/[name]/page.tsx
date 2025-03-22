"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import staticData from "@/lib/static-data"
import { Trophy, Calendar, User } from "lucide-react"
import { PlayArtistButton } from "@/components/play-artist-button"

// Define a mapping of common nicknames/aliases to full artist names
const artistAliases: Record<string, string> = {
  SGA: "Shai Gilgeous-Alexander",
  "King James": "LeBron James",
  "The King": "LeBron James",
  "The Klaw": "Kawhi Leonard",
  "The Claw": "Kawhi Leonard",
  "Uncle Drew": "Kyrie Irving",
  PG13: "Paul George",
  "Podcast P": "Paul George",
  AD: "Anthony Davis",
  Ant: "Anthony Edwards",
  "Ant-Man": "Anthony Edwards",
  "The Beard": "James Harden",
  JT: "Jayson Tatum",
  MJ: "Michael Jordan",
  "Air Jordan": "Michael Jordan",
  "His Airness": "Michael Jordan",
  Bronny: "DJ Bronny",
}

export default function ArtistPage() {
  const params = useParams()
  const router = useRouter()
  const [artist, setArtist] = useState(null)
  const [allArtistTracks, setAllArtistTracks] = useState([])
  const [allAlbums, setAllAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.name) return

    // Decode the URL parameter
    const artistName = decodeURIComponent(params.name as string)
    console.log(`Looking for artist: "${artistName}"`)

    // Try to find the artist by exact name match
    let foundArtist = staticData.artists.find((a) => a.name === artistName)

    // If not found, check if it's a known alias
    if (!foundArtist && artistAliases[artistName]) {
      console.log(`"${artistName}" is an alias for "${artistAliases[artistName]}"`)
      foundArtist = staticData.artists.find((a) => a.name === artistAliases[artistName])
    }

    // If still not found, try case-insensitive match
    if (!foundArtist) {
      console.log("Trying case-insensitive match...")
      foundArtist = staticData.artists.find((a) => a.name.toLowerCase() === artistName.toLowerCase())
    }

    // If still not found, try partial match (e.g., "LeBron" matches "LeBron James")
    if (!foundArtist) {
      console.log("Trying partial match...")
      foundArtist = staticData.artists.find(
        (a) =>
          a.name.toLowerCase().includes(artistName.toLowerCase()) ||
          (a.fullName && a.fullName.toLowerCase().includes(artistName.toLowerCase())),
      )
    }

    // Check if this artist appears in any tracks, even if they don't have a full profile
    const artistTracks = staticData.tracks.filter((track) => {
      // Split the artist string by commas and check if our artist is included
      const trackArtists = track.artist.split(",").map((a) => a.trim().toLowerCase())
      return trackArtists.includes(artistName.toLowerCase())
    })

    // If we have tracks but no artist profile, create a minimal artist object
    if (!foundArtist && artistTracks.length > 0) {
      console.log(`Creating minimal artist profile for "${artistName}" who appears in ${artistTracks.length} tracks`)

      // Get the first track to extract some basic info
      const firstTrack = artistTracks[0]

      // Create a minimal artist object
      foundArtist = {
        name: artistName,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: `${artistName} is a featured artist who has collaborated on tracks in the Bronify platform.`,
        albums: [],
        singles: [],
        featuredOn: Array.from(new Set(artistTracks.map((track) => track.album))),
      }
    }

    // If still not found, redirect to 404
    if (!foundArtist) {
      console.error(`Artist not found: "${artistName}"`)
      router.push("/404")
      return
    }

    console.log(`Found artist: ${foundArtist.name}`)

    // Get all tracks where this artist appears (including as a featured artist)
    const tracks = staticData.tracks.filter((track) => {
      // Split the artist string by commas and check if our artist is included
      const trackArtists = track.artist.split(",").map((a) => a.trim().toLowerCase())
      return trackArtists.includes(foundArtist.name.toLowerCase())
    })

    console.log(`Found ${tracks.length} tracks featuring ${foundArtist.name}`)

    // Get albums where the artist is the main artist (first name in the artist field)
    const mainArtistTracks = tracks.filter(
      (track) => track.artist.split(",")[0].trim().toLowerCase() === foundArtist.name.toLowerCase(),
    )

    // Get albums where the artist is featured (not the first name in the artist field)
    const featuredArtistTracks = tracks.filter(
      (track) => track.artist.split(",")[0].trim().toLowerCase() !== foundArtist.name.toLowerCase(),
    )

    // Get unique albums where the artist is the main artist
    const mainArtistAlbums = Array.from(new Set(mainArtistTracks.map((track) => track.album)))

    // Get unique albums where the artist is featured
    const featuredArtistAlbums = Array.from(new Set(featuredArtistTracks.map((track) => track.album)))

    // Combine all album types for display
    const albums = [
      ...mainArtistAlbums.map((album) => ({
        album,
        type: "Artist Album",
        tracks: tracks.filter((track) => track.album === album),
      })),
      ...featuredArtistAlbums.map((album) => ({
        album,
        type: "Featured On",
        tracks: tracks.filter((track) => track.album === album),
      })),
    ]

    setArtist(foundArtist)
    setAllArtistTracks(tracks)
    setAllAlbums(albums)
    setLoading(false)
  }, [params, router])

  if (loading) {
    return <div className="p-8 text-center">Loading artist...</div>
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Artist Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-end p-6">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10">
            <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-5xl font-bold mt-2 mb-2">{artist.name}</h1>
            {artist.fullName && artist.fullName !== artist.name && (
              <p className="text-muted-foreground mb-2">{artist.fullName}</p>
            )}
            {artist.currentTeam && (
              <p className="text-lg text-muted-foreground mb-4">
                {artist.position} • {artist.currentTeam} {artist.jerseyNumber && `#${artist.jerseyNumber}`}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <PlayArtistButton artistName={artist.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-card p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Biography</h2>
        <p className="text-muted-foreground">{artist.bio}</p>
      </div>

      {/* Personal Info - Only show if we have the data */}
      {(artist.birthDate || artist.birthPlace || artist.height || artist.weight || artist.drafted) && (
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artist.birthDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Born: {artist.birthDate}</span>
              </div>
            )}
            {artist.birthPlace && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">From: {artist.birthPlace}</span>
              </div>
            )}
            {artist.height && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Height: {artist.height}</span>
              </div>
            )}
            {artist.weight && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Weight: {artist.weight}</span>
              </div>
            )}
            {artist.drafted && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Draft: {artist.drafted}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Albums */}
      {allAlbums.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Albums & Appearances</h2>

          {/* Group albums by type */}
          {["Artist Album", "Featured On"].map((type) => {
            const albumsOfType = allAlbums.filter((a) => a.type === type)
            if (albumsOfType.length === 0) return null

            return (
              <div key={type} className="mb-8">
                <h3 className="text-lg font-medium mb-4">{type}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {albumsOfType.map(({ album, tracks: albumTracks }) => {
                    const albumCover = albumTracks[0]?.coverUrl
                    return (
                      <Link
                        key={album}
                        href={`/album/${encodeURIComponent(album)}`}
                        className="group p-4 rounded-md bg-card hover:bg-accent transition-colors"
                      >
                        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
                          <img
                            src={albumCover || "/placeholder.svg"}
                            alt={album}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-medium text-base">{album}</h3>
                        <p className="text-sm text-muted-foreground">
                          {albumTracks.length} {albumTracks.length === 1 ? "song" : "songs"}
                        </p>

                        {/* Show track names where this artist appears */}
                        <div className="mt-2">
                          {albumTracks
                            .map((track, index) => (
                              <p key={index} className="text-xs text-muted-foreground truncate">
                                • {track.title}
                              </p>
                            ))
                            .slice(0, 3)}
                          {albumTracks.length > 3 && (
                            <p className="text-xs text-primary mt-1">+ {albumTracks.length - 3} more</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats - Only show if we have the data */}
      {artist.currentStats && (
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Current Season Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{artist.currentStats.ppg}</span>
              <span className="text-sm text-muted-foreground">PPG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{artist.currentStats.rpg}</span>
              <span className="text-sm text-muted-foreground">RPG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{artist.currentStats.apg}</span>
              <span className="text-sm text-muted-foreground">APG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{artist.currentStats.fg}</span>
              <span className="text-sm text-muted-foreground">FG%</span>
            </div>
          </div>
        </div>
      )}

      {/* Achievements - Only show if we have the data */}
      {artist.achievements && artist.achievements.length > 0 && (
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Career Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artist.achievements.slice(0, 10).map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/20">
                <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notable Milestones */}
      {artist.name === "LeBron James" && (
        <div className="bg-card p-6 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-4">Notable Milestones</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/20">
              <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">First Player to Reach 50,000 Combined Points</h3>
                <p className="text-sm text-muted-foreground">
                  On March 5, 2025, LeBron became the first player in NBA history to surpass 50,000 combined points in
                  regular season and playoffs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/20">
              <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">21st NBA All-Star Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Selected to the 2025 NBA All-Star Game (though missed due to injury), marking his 21st selection and
                  extending his record for most All-Star selections in NBA history.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

