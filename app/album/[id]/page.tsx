"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import staticData from "@/lib/static-data"
import { formatTime } from "@/lib/utils"
import { Play, Pause } from "lucide-react"
import { ShuffleMusicButton } from "@/components/shuffle-music-button"
import { TrackContextMenu } from "@/components/track-context-menu"
import { albumRedirects } from "./redirects"

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [albumTracks, setAlbumTracks] = useState([])
  const [isPlayingState, setIsPlayingState] = useState({ trackId: null, isPlaying: false })
  const [actualAlbumName, setActualAlbumName] = useState("")
  const [albumCover, setAlbumCover] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return

    // Decode the album name from the URL
    const albumName = decodeURIComponent(params.id as string)
    console.log(`Looking for album: "${albumName}"`)

    // Find all tracks for this album, using case-insensitive matching
    let tracks = staticData.tracks.filter((track) => track.album.toLowerCase() === albumName.toLowerCase())

    // Check if this is a known redirect
    if (albumRedirects[albumName.toLowerCase()]) {
      console.log(`Found redirect for "${albumName}" -> "${albumRedirects[albumName.toLowerCase()]}"`)
      // Use the redirected album name instead
      const redirectedAlbumName = albumRedirects[albumName.toLowerCase()]
      const redirectedTracks = staticData.tracks.filter(
        (track) => track.album.toLowerCase() === redirectedAlbumName.toLowerCase(),
      )

      if (redirectedTracks.length > 0) {
        console.log(`Found ${redirectedTracks.length} tracks for redirected album`)
        tracks = redirectedTracks
      }
    }

    // If no tracks found with exact match, try partial matching
    if (tracks.length === 0) {
      console.log("No exact match found, trying partial match...")

      // Special case for "tv off" which might be a track title
      if (albumName.toLowerCase() === "tv off") {
        // Find the track with this title
        const tvOffTrack = staticData.tracks.find((track) => track.title.toLowerCase() === "tv off")
        if (tvOffTrack) {
          console.log(`Found track "tv off" in album "${tvOffTrack.album}"`)
          // Redirect to the correct album
          const correctAlbumTracks = staticData.tracks.filter((track) => track.album === tvOffTrack.album)
          tracks = correctAlbumTracks
        }
      }

      // If still no tracks, try more flexible matching
      if (tracks.length === 0) {
        // Try to find a partial match or match with normalized spaces
        const normalizedAlbumName = albumName.toLowerCase().replace(/\s+/g, " ").trim()
        const allAlbumNames = Array.from(new Set(staticData.tracks.map((track) => track.album)))

        const matchingAlbum = allAlbumNames.find((album) => {
          const normalizedAlbum = album.toLowerCase().replace(/\s+/g, " ").trim()
          return (
            normalizedAlbum.includes(normalizedAlbumName) ||
            normalizedAlbumName.includes(normalizedAlbum) ||
            normalizedAlbum === normalizedAlbumName
          )
        })

        if (matchingAlbum) {
          console.log(`Found partial match: "${matchingAlbum}"`)
          const partialMatchTracks = staticData.tracks.filter((track) => track.album === matchingAlbum)
          if (partialMatchTracks.length > 0) {
            console.log(`Found ${partialMatchTracks.length} tracks for partial match`)
            // Use these tracks instead
            tracks = partialMatchTracks
          }
        }
      }
    }

    // If still no tracks found, check if this might be a track title instead of album name
    if (tracks.length === 0) {
      console.log("Checking if this might be a track title...")
      const trackWithThisTitle = staticData.tracks.find(
        (track) => track.title.toLowerCase() === albumName.toLowerCase(),
      )

      if (trackWithThisTitle) {
        console.log(`Found track with title "${albumName}" in album "${trackWithThisTitle.album}"`)
        // Use the album of this track
        tracks = staticData.tracks.filter((track) => track.album === trackWithThisTitle.album)
      }
    }

    // If still no tracks found, redirect to 404
    if (tracks.length === 0) {
      console.error(`Album not found: "${albumName}"`)
      router.push("/404")
      return
    }

    // Get album cover from the first track
    const cover = tracks[0].coverUrl

    // Get the actual album name from the first track (in case we matched partially)
    const name = tracks[0].album

    setAlbumTracks(tracks)
    setAlbumCover(cover)
    setActualAlbumName(name)
    setLoading(false)
  }, [params, router])

  // Check if a track is currently playing from the player component
  useEffect(() => {
    const checkCurrentTrack = () => {
      // @ts-ignore - This is defined in the Player component
      if (window.currentTrackInfo) {
        // @ts-ignore
        const { id, playing } = window.currentTrackInfo
        setIsPlayingState({ trackId: id, isPlaying: playing })
      }
    }

    // Check immediately and then set up an interval
    checkCurrentTrack()

    // Set up event listener for track changes
    const handleTrackChange = (event: CustomEvent) => {
      const { id, playing } = event.detail
      setIsPlayingState({ trackId: id, isPlaying: playing })
    }

    // @ts-ignore - CustomEvent type
    window.addEventListener("trackChanged", handleTrackChange)

    // Clean up
    return () => {
      // @ts-ignore - CustomEvent type
      window.removeEventListener("trackChanged", handleTrackChange)
    }
  }, [])

  // Get primary artist name (first artist if there are multiple)
  const getPrimaryArtist = (artistString: string) => {
    return artistString.split(",")[0].trim()
  }

  const playTrackById = (trackId: string) => {
    // @ts-ignore - This is defined in the Player component
    if (window.playTrackById) {
      // @ts-ignore
      window.playTrackById(trackId)
      setIsPlayingState({ trackId: trackId, isPlaying: true })
    }
  }

  const addToQueue = (trackId: string) => {
    // @ts-ignore - This is defined in the Player component
    if (window.addToQueue) {
      // @ts-ignore
      window.addToQueue(trackId)
    }
  }

  const playAlbumFirstTrack = () => {
    if (albumTracks.length > 0) {
      playTrackById(albumTracks[0].id)
    }
  }

  // Get album description based on album name
  const getAlbumDescription = () => {
    switch (actualAlbumName) {
      case "LBJ":
        return "LBJ is LeBron's parody of Kendrick Lamar's GNX album, showcasing his lyrical skills and basketball prowess. Each track represents LeBron's journey with the Lakers, from championship aspirations to the challenges of leading a legendary franchise in the modern NBA era."
      case "First Day Out":
        return "First Day Out celebrates LeBron's freedom and dominance on the court. This album captures the raw energy and excitement of LeBron's game-changing performances, with tracks that highlight his ability to take over games and silence critics."
      case "We Don't Guard You":
        return "We Don't Guard You is LeBron's direct response to the GOAT debate, a bold diss track aimed at Michael Jordan. Just as Kendrick, Future, and Metro Boomin took aim at Drake with 'Like That', LeBron uses this album to assert his dominance in basketball history and challenge Jordan's legacy."
      case "LeBronaissance":
        return "The LeBronaissance album represents LeBron James' musical journey through parody hits that celebrate his career and legacy. Each track offers a unique perspective on the basketball legend's impact on and off the court, reimagined through familiar melodies. With 11 tracks spanning various musical styles, this album is the definitive collection of LeBron-inspired music."
      case "Like That (Remix)":
        return "Kyrie and Kawhi's response to the original Like That remix without invitation. In this unexpected collaboration, Kyrie uses the platform to defend LeBron in the GOAT debate, taking shots at Michael Jordan while showcasing his own lyrical handles."
      case "Please Stay LeBron":
        return "A heartfelt plea from the city of Cleveland begging LeBron not to leave during his first stint with the Cavaliers. Despite the emotional appeal captured in this track, LeBron ultimately took his talents to South Beach to join the Miami Heat in 2010, leaving Cleveland devastated until his triumphant return years later."
      case "NOKIA":
        return "Shai Gilgeous-Alexander (Free Throw Alexander) teams up with Michael Jordan in this parody of Drake and PartyNextDoor's hit song 'NOKIA.' The unlikely duo joins forces to challenge LeBron's GOAT status, with SGA representing the new generation while MJ defends his legacy against King James' growing list of accomplishments."
      case "We Did It":
        return "Jayson Tatum and his son Deuce celebrate their long-awaited NBA championship victory with this triumphant anthem. The track references Tatum's emotional 'We did it!' celebration after the 2024 NBA Finals, where he finally overcame years of playoff disappointments to bring Banner 18 to Boston and cement his legacy."
      case "Washed Anthem":
        return "Podcast P reflects on his fall from grace in this introspective track. Once considered among the NBA's elite during his Pacers and Thunder days, PG13 addresses his current 'washed' status with the Sixers, his frequent injuries, and how his downfall began with Damian Lillard's iconic buzzer-beater. Now more known for his podcast than his play, this is Playoff P's confession."
      case "Bron and Jerry":
        return "LeBron's latest album featuring his most personal and reflective tracks yet. This collection showcases LeBron's versatility as an artist, blending nostalgic samples with modern beats to create a timeless sound that resonates with fans of all ages."
      case "Bronfoolery":
        return "LeBron's most playful and humorous tracks showcasing his lighter side. This album features LeBron having fun with his music, incorporating comedic elements and playful lyrics that reveal his personality beyond the basketball court."
      default:
        return "An exclusive album featuring basketball's greatest talent showcasing their musical abilities alongside their on-court dominance."
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading album...</div>
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 aspect-square bg-muted rounded-md overflow-hidden">
          <img src={albumCover || "/placeholder.svg"} alt={actualAlbumName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-sm font-medium">Album</p>
          <h1 className="text-5xl font-bold mt-2 mb-6">{actualAlbumName}</h1>
          <p className="text-muted-foreground">
            By{" "}
            <Link
              href={`/artist/${encodeURIComponent(getPrimaryArtist(albumTracks[0].artist))}`}
              className="hover:text-primary transition-colors"
            >
              {getPrimaryArtist(albumTracks[0].artist)}
            </Link>
          </p>
          <div className="text-sm text-muted-foreground mt-2">{albumTracks.length} songs</div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={playAlbumFirstTrack}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Play Album
            </button>
            <ShuffleMusicButton />
          </div>
        </div>
      </div>

      {/* Album Description */}
      <div className="bg-gradient-to-br from-primary/20 to-card p-6 rounded-xl mt-6">
        <h2 className="text-xl font-bold mb-4">About {actualAlbumName}</h2>
        <p className="text-muted-foreground">{getAlbumDescription()}</p>
      </div>

      <div className="bg-card/30 rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="w-12 text-right">⏱️</div>
          <div className="w-8"></div>
        </div>

        <div className="divide-y divide-border">
          {albumTracks.map((track, index) => (
            <div
              key={track.id}
              className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 hover:bg-accent/50 transition-colors ${
                isPlayingState.trackId === track.id ? "bg-accent/30" : ""
              }`}
            >
              <div className="w-8 text-center flex items-center justify-center">
                <button
                  onClick={() => playTrackById(track.id)}
                  className={`text-muted-foreground hover:text-foreground transition-colors ${
                    isPlayingState.trackId === track.id ? "text-primary" : ""
                  }`}
                >
                  {isPlayingState.trackId === track.id && isPlayingState.isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-medium ${isPlayingState.trackId === track.id ? "text-primary" : "text-foreground"}`}
                >
                  {track.title}
                </span>
                <div>
                  {track.artist.split(",").map((artist, i, arr) => (
                    <span key={i}>
                      <Link
                        href={`/artist/${encodeURIComponent(artist.trim())}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {artist.trim()}
                      </Link>
                      {i < arr.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-12 text-right text-muted-foreground flex items-center justify-end">
                {formatTime(track.duration)}
              </div>
              <div className="w-8 flex items-center justify-center">
                <TrackContextMenu trackId={track.id} onAddToQueue={addToQueue} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

