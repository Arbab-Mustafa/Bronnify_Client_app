import Link from "next/link"
import { tracks } from "@/lib/data"

// Get unique albums
const albums = Array.from(
  new Set(
    tracks.map((track) => ({ album: track.album, coverUrl: track.coverUrl })).map((item) => JSON.stringify(item)),
  ),
).map((item) => JSON.parse(item))

export function AlbumGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album, index) => (
        <Link
          key={`${album.album}-${index}`}
          href={`/album/${encodeURIComponent(album.album)}`}
          className="group p-4 rounded-md bg-card hover:bg-accent transition-colors"
        >
          <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
            <img
              src={album.coverUrl || "/placeholder.svg"}
              alt={album.album}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-medium text-base">{album.album}</h3>
          <p className="text-sm text-muted-foreground">
            {tracks.filter((track) => track.album === album.album).length} songs
          </p>
        </Link>
      ))}
    </div>
  )
}

