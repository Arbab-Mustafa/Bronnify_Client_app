"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Home, Search, Library, Music, Image, Video, ChevronUp, Plus } from "lucide-react"
import { tracks } from "@/lib/data"

export default function Sidebar() {
  const pathname = usePathname()
  const [showAllAlbums, setShowAllAlbums] = useState(false)

  // Get unique albums for sidebar
  const uniqueAlbums = Array.from(new Set(tracks.map((track) => track.album))).sort()

  // Display first 5 albums or all albums based on state
  const displayedAlbums = showAllAlbums ? uniqueAlbums : uniqueAlbums.slice(0, 5)

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">Bronify</span>
        </Link>
      </div>

      <nav className="px-3 py-2">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/search"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <Search className="h-5 w-5" />
              Search
            </Link>
          </li>
          <li>
            <Link
              href="/library"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/library"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
            >
              <Library className="h-5 w-5" />
              Your Library
            </Link>
          </li>
        </ul>
      </nav>

      {/* Albums section */}
      <div className="mt-6 px-3 overflow-y-auto flex-1">
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs uppercase font-semibold text-muted-foreground">Albums</h3>
            <button
              onClick={() => setShowAllAlbums(!showAllAlbums)}
              className="text-muted-foreground hover:text-foreground"
              title={showAllAlbums ? "Show less" : "Show more"}
            >
              {showAllAlbums ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
          <ul className="space-y-1">
            {displayedAlbums.map((album) => (
              <li key={album}>
                <Link
                  href={`/album/${encodeURIComponent(album)}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === `/album/${encodeURIComponent(album)}`
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                >
                  <Music className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{album}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border mt-4 pt-4">
          <h3 className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">LeBron Collections</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/top-lebrons"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/top-lebrons"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <Image className="h-4 w-4" />
                Top LeBrons
              </Link>
            </li>
            <li>
              <Link
                href="/lebron-categories"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/lebron-categories"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <Image className="h-4 w-4" />
                LeBron Categories
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-border mt-4 pt-4">
          <h3 className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">Media</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/lebron-edits"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/lebron-edits"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <Video className="h-4 w-4" />
                LeBron Edits
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

