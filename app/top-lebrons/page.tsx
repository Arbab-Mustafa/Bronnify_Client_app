import { PageHeader } from "@/components/page-header"
import { lebronImages } from "@/lib/data"
import Link from "next/link"
import { ShuffleButton } from "@/components/shuffle-button"

export default function TopLebronsPage() {
  // Get top 20 LeBrons by likes
  const topLebrons = [...lebronImages].sort((a, b) => b.likes - a.likes).slice(0, 20)

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="Top LeBrons" description="The most liked LeBron images of all time" />

      <div className="flex justify-center my-8">
        <ShuffleButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {topLebrons.map((lebron) => (
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
    </div>
  )
}

