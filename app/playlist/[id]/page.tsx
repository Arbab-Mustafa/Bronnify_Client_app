import { notFound } from "next/navigation"
import { playlists } from "@/lib/data"
import { formatTime } from "@/lib/utils"
import Link from "next/link"

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const playlist = playlists.find((p) => p.id === params.id)

  if (!playlist) {
    notFound()
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 aspect-square bg-muted rounded-md overflow-hidden">
          <img
            src={playlist.coverUrl || "/placeholder.svg"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-sm font-medium">Playlist</p>
          <h1 className="text-5xl font-bold mt-2 mb-6">{playlist.title}</h1>
          <p className="text-muted-foreground">{playlist.description}</p>
          <div className="text-sm text-muted-foreground mt-2">{playlist.tracks.length} songs</div>
        </div>
      </div>

      <div className="bg-card/30 rounded-md">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="w-12 text-right">⏱️</div>
        </div>

        <div className="divide-y divide-border">
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 hover:bg-accent/50 transition-colors"
            >
              <div className="w-8 text-center flex items-center justify-center text-muted-foreground">{index + 1}</div>
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

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">More Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {playlists
            .filter((p) => p.id !== params.id)
            .slice(0, 4)
            .map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="group p-4 rounded-md bg-card hover:bg-accent transition-colors"
              >
                <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
                  <img
                    src={playlist.coverUrl || "/placeholder.svg"}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-base">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

