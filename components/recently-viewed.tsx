import Link from "next/link"
import { recentlyViewed } from "@/lib/data"

export function RecentlyViewed() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {recentlyViewed.map((lebron) => (
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
            <p className="text-xs text-muted-foreground">Recently viewed</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

