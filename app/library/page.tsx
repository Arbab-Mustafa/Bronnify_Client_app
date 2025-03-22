import { PageHeader } from "@/components/page-header"
import { tracks, lebronImages } from "@/lib/data"
import Link from "next/link"

export default function LibraryPage() {
  // Get unique albums
  const albums = Array.from(
    new Set(
      tracks.map((track) =>
        JSON.stringify({
          album: track.album,
          coverUrl: track.coverUrl,
        }),
      ),
    ),
  ).map((item) => JSON.parse(item))

  // Group LeBron images by category
  const categories = {
    "Superhero LeBrons": [14, 16, 53, 56, 61, 76], // LeThor, LeThanos, LeBatman, LeBron Stark, LeCap, LeIncredible
    "Anime LeBrons": [6, 13, 32, 39, 51, 67, 69, 79, 89, 103, 106, 128], // LeZoro, LeVegeta, LeStrawHat, LeTanjiro, LeBankai, LeGear5th, LeGoku, LeKisuke, LeChainsawMan, LeDeku, LeDomain, LeRasengan
    "Character LeBrons": [1, 3, 11, 26, 54, 73, 82, 83, 88, 130], // Mike Bronsowski, SpongeBron, LeTrain, LeShrek, LeBeaver, LeHagrid, LeLuigi, LeMario, LeCJ, ChaeBron
    "Sports LeBrons": [8, 29, 42, 46, 65, 70, 101, 108, 111, 113, 115], // Max Bronstappen, LeSoccer, Blocked by James, LeAmerica, LeFightingIrish, LeGolf, LeCyclist, LeFootball, LeLiverpool, LeMMA, LeMessi
    "Historical LeBrons": [43, 45, 57, 68, 120], // Bronius Caesar, Indiana Bron, LeBronaLisa, LeGladiator, LePharaoh
    "Everyday LeBrons": [37, 38, 40, 49, 52, 55], // LeSushi, LeTacoTuesday, LeTeaParty, LeBackpacker, LeBarista, LeBook
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="Your Library" description="Your albums and LeBron collections" />

      <section>
        <h2 className="text-2xl font-bold mb-4">Albums</h2>
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
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">LeBron Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categories).map(([category, ids]) => (
            <div key={category} className="p-4 rounded-md bg-card">
              <h3 className="font-medium text-lg mb-3">{category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {ids.map((id) => {
                  const lebron = lebronImages.find((img) => img.id === id)
                  if (!lebron) return null

                  return (
                    <Link
                      key={lebron.id}
                      href={`/lebron/${lebron.id}`}
                      className="group relative rounded-md overflow-hidden transition-all hover:bg-accent/50"
                    >
                      <div className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img
                          src={lebron.url || "/placeholder.svg"}
                          alt={lebron.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-xs truncate">{lebron.title}</h4>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

