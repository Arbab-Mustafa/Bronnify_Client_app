import Link from "next/link"
import { playlists } from "@/lib/data"

export function LebronPlaylists() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist) => (
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
  )
}

