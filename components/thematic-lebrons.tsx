import Link from "next/link"
import { lebronImages } from "@/lib/data"

// Define themed collections
const collections = [
  {
    title: "Musical LeBrons",
    description: "LeBron showing off his musical talents",
    images: [
      lebronImages.find((img) => img.id === 15), // LeViolin
      lebronImages.find((img) => img.id === 23), // LeSaxophone
      lebronImages.find((img) => img.id === 28), // LeSinger
      lebronImages.find((img) => img.id === 94), // LeConductor
    ].filter(Boolean),
  },
  {
    title: "Anime LeBrons",
    description: "LeBron in popular anime series",
    images: [
      lebronImages.find((img) => img.id === 6), // LeZoro
      lebronImages.find((img) => img.id === 13), // LeVegeta
      lebronImages.find((img) => img.id === 32), // LeStrawHat
      lebronImages.find((img) => img.id === 39), // LeTanjiro
    ].filter(Boolean),
  },
  {
    title: "Food LeBrons",
    description: "LeBron and his culinary adventures",
    images: [
      lebronImages.find((img) => img.id === 38), // LeTacoTuesday
      lebronImages.find((img) => img.id === 37), // LeSushi
      lebronImages.find((img) => img.id === 40), // LeTeaParty
      lebronImages.find((img) => img.id === 87), // LePizza
    ].filter(Boolean),
  },
  {
    title: "Character LeBrons",
    description: "LeBron as famous characters",
    images: [
      lebronImages.find((img) => img.id === 26), // LeShrek
      lebronImages.find((img) => img.id === 3), // SpongeBron SquarePants
      lebronImages.find((img) => img.id === 1), // Mike Bronsowski
      lebronImages.find((img) => img.id === 11), // LeTrain
    ].filter(Boolean),
  },
]

export function ThematicLebrons() {
  return (
    <div className="space-y-6">
      {collections.map((collection) => (
        <div key={collection.title} className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold">{collection.title}</h3>
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collection.images.map(
              (lebron) =>
                lebron && (
                  <Link
                    key={lebron.id}
                    href={`/lebron/${lebron.id}`}
                    className="group relative rounded-md overflow-hidden transition-all hover:bg-card"
                  >
                    <div className="aspect-square bg-muted rounded-md overflow-hidden">
                      <img
                        src={lebron.url || "/placeholder.svg"}
                        alt={lebron.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm truncate">{lebron.title}</h3>
                      <p className="text-xs text-muted-foreground">{lebron.likes} likes</p>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

