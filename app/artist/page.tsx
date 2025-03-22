import Link from "next/link"
import { artists } from "@/lib/artist-data"

export default function ArtistsPage() {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Artists</h1>
      <p className="text-muted-foreground">Browse all artists on Bronify</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {artists.map((artist) => (
          <Link
            key={artist.name}
            href={`/artist/${encodeURIComponent(artist.name)}`}
            className="group flex flex-col items-center p-4 rounded-lg bg-card hover:bg-accent transition-colors"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src={artist.imageUrl || "/placeholder.svg"}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-lg font-medium text-center">{artist.name}</h2>
            {artist.currentTeam && <p className="text-sm text-muted-foreground text-center">{artist.currentTeam}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}

