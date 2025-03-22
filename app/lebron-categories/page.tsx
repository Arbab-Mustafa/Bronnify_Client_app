import { PageHeader } from "@/components/page-header"
import { lebronImages } from "@/lib/data"
import Link from "next/link"
import { ShuffleButton } from "@/components/shuffle-button"
import { ShuffleMusicButton } from "@/components/shuffle-music-button"

export default function LebronCategoriesPage() {
  // Define categories with image IDs

  const categories = {
    "Superhero LeBrons": [14, 16, 53, 56, 61, 76], // LeThor, LeThanos, LeBatman, LeBron Stark, LeCap, LeIncredible
    "Anime LeBrons": [6, 13, 32, 39, 51, 67, 69, 79, 89, 103, 106, 128], // LeZoro, LeVegeta, LeStrawHat, LeTanjiro, LeBankai, LeGear5th, LeGoku, LeKisuke, LeChainsawMan, LeDeku, LeDomain, LeRasengan
    "Character LeBrons": [1, 3, 11, 26, 54, 73, 82, 83, 88, 130], // Mike Bronsowski, SpongeBron, LeTrain, LeShrek, LeBeaver, LeHagrid, LeLuigi, LeMario, LeCJ, ChaeBron
    "Sports LeBrons": [8, 29, 42, 46, 65, 70, 101, 108, 111, 113, 115], // Max Bronstappen, LeSoccer, Blocked by James, LeAmerica, LeFightingIrish, LeGolf, LeCyclist, LeFootball, LeLiverpool, LeMMA, LeMessi
    "Historical LeBrons": [43, 45, 57, 68, 120], // Bronius Caesar, Indiana Bron, LeBronaLisa, LeGladiator, LePharaoh
    "Food LeBrons": [37, 38, 40, 60, 63, 75, 87, 91, 99, 119], // LeSushi, LeTacoTuesday, LeTeaParty, LeBurger, LeDonut, LeIceCream, LePizza, LeChef, LeCupCake, LePancake
    "Emotional LeBrons": [20, 25, 27, 47, 62, 64, 77, 93, 105, 109, 112, 117], // LeSad, LeScream, LeSilencer, LeAnger, LeCrying, LeFear, LeJoy, LeComeback, LeDisgust, LeFrustrated, LeLockedIn, LeNightNight
    "Professional LeBrons": [52, 55, 66, 78, 81, 84, 95, 96, 97, 104, 123], // LeBarista, LeBook, LeFireFighter, LeJudge, LeLifeguard, LeMechanic, LeConstruction, LeCop, LeCowboy, LeDetective, LePilot
    "Musical LeBrons": [15, 23, 28, 94, 102, 121], // LeViolin, LeSaxophone, LeSinger, LeConductor, LeDJ, LePiano
    "Artistic LeBrons": [31, 57, 118, 122], // LeStainedGlass, LeBronaLisa, LePainter, LePicasso
    "Mythical LeBrons": [2, 59, 71, 114, 125], // LeZeus, LeBronotaur, LeGondola, LeMedusa, LePoseidon
    "Family LeBrons": [58], // LeBronny
    "Iconic LeBrons": [74, 110, 126, 127, 129], // LeHairline, LeHeadband, LePowder, LePumpkin, LeRickRoll
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="LeBron Categories" description="Browse LeBron images by category" />

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-8">
        <ShuffleButton />
        <ShuffleMusicButton variant="outline" />
      </div>

      <div className="space-y-12">
        {Object.entries(categories).map(([category, ids]) => (
          <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")} className="space-y-4">
            <h2 className="text-2xl font-bold">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {ids.map((id) => {
                const lebron = lebronImages.find((img) => img.id === id)
                if (!lebron) return null

                return (
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
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

