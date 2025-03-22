import Link from "next/link"

export default function ArtistNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the artist you're looking for. They might be in the studio recording their next hit.
      </p>
      <Link
        href="/artist"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
      >
        Browse All Artists
      </Link>
    </div>
  )
}

