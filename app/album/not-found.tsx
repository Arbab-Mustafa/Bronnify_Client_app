import Link from "next/link"

export default function AlbumNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Album Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the album you're looking for. It might still be in the studio being recorded.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/lebronaissance"
          className="bg-card text-card-foreground px-6 py-2 rounded-full font-medium hover:bg-accent transition-colors"
        >
          Browse LeBronaissance
        </Link>
      </div>
    </div>
  )
}

