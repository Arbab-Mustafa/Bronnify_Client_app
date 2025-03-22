import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { lebronImages } from "@/lib/data"
import Link from "next/link"
import { ShuffleButton } from "@/components/shuffle-button"

interface LebronPageProps {
  params: {
    id: string
  }
}

export default function LebronPage({ params }: LebronPageProps) {
  const lebronId = Number.parseInt(params.id)
  const lebron = lebronImages.find((l) => l.id === lebronId)

  if (!lebron) {
    notFound()
  }

  // Get related LeBrons (random selection for mock)
  const relatedLebrons = lebronImages
    .filter((l) => l.id !== lebronId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6)

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 aspect-square bg-muted rounded-lg overflow-hidden">
          <img src={lebron.url || "/placeholder.svg"} alt={lebron.title} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <PageHeader title={lebron.title} description={lebron.description} />

          <div className="mt-4 p-4 bg-card rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Likes</span>
              <span className="text-sm">{lebron.likes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ID</span>
              <span className="text-sm">#{lebron.id}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <ShuffleButton />
          </div>

          <div className="mt-auto pt-6">
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
              Add to Favorites
            </button>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedLebrons.map((lebron) => (
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
          ))}
        </div>
      </section>
    </div>
  )
}

