"use client"

import { PageHeader } from "@/components/page-header"
import { Search } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  // Get a selection of featured LeBrons for the categories
  const featuredLeBrons = [
    {
      category: "Superhero LeBron",
      image: "/assets/images/lethor.jpg",
    }, // LeThor
    {
      category: "Anime LeBron",
      image: "/assets/images/levegeta.jpg",
    }, // LeVegeta
    {
      category: "Fantasy LeBron",
      image: "/assets/images/lezelda.jpg",
    }, // LeZelda
    {
      category: "Cartoon LeBron",
      image: "/assets/images/spongebron.jpg",
    }, // SpongeBron
    {
      category: "Sports LeBron",
      image: "/assets/images/max-bronstappen.jpg",
    }, // Max Bronstappen
    {
      category: "Classical LeBron",
      image: "/assets/images/leviolin.jpg",
    }, // LeViolin
    {
      category: "Medieval LeBron",
      image: "/assets/images/sirbron.jpg",
    }, // Sir Bron
    {
      category: "Mythical LeBron",
      image: "/assets/images/lezeus.jpg",
    }, // LeZeus
  ]

  return (
    <div className="space-y-6 pb-24">
      <PageHeader title="Search" description="Find your favorite LeBron content" />

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm rounded-lg bg-card border border-border focus:ring-primary focus:border-primary outline-none"
          placeholder="Search for LeBron images or tracks..."
          onChange={(e) => {
            // This is a client component, so we can use window.location
            if (e.target.value.length > 2) {
              const searchParams = new URLSearchParams(window.location.search)
              searchParams.set("q", e.target.value)
              const newUrl = `${window.location.pathname}?${searchParams.toString()}`
              window.history.pushState({ path: newUrl }, "", newUrl)
            }
          }}
        />
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredLeBrons.map((item) => (
            <Link
              key={item.category}
              href={`/lebron-categories#${item.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="aspect-square relative rounded-lg overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <img src={item.image || "/placeholder.svg"} alt={item.category} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-xl font-bold p-4">{item.category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

