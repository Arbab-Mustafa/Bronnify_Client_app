import { type NextRequest, NextResponse } from "next/server"

// Maximum number of redirects to prevent infinite loops
const MAX_REDIRECTS = 3

export function middleware(request: NextRequest) {
  // Get the current redirect count from headers
  const redirectCount = Number.parseInt(request.headers.get("x-redirect-count") || "0")

  // If we've redirected too many times, stop redirecting to prevent infinite loops
  if (redirectCount >= MAX_REDIRECTS) {
    console.warn(`Too many redirects (${redirectCount}). Stopping redirect chain.`)
    return NextResponse.next()
  }

  // Extract the path from the URL
  const path = request.nextUrl.pathname

  // Only process album and artist routes
  if (path.startsWith("/album/") || path.startsWith("/artist/")) {
    // Get the current URL and create a new URL object for potential redirects
    const url = request.nextUrl.clone()

    // Extract the album or artist name from the URL
    const segments = path.split("/")
    const type = segments[1] // 'album' or 'artist'
    const name = segments[2] // The album or artist name

    if (!name) return NextResponse.next()

    // Decode the name to handle URL encoding
    const decodedName = decodeURIComponent(name)

    // Create a new response with the next middleware
    const response = NextResponse.next()

    // Set the redirect count header to track redirects
    response.headers.set("x-redirect-count", (redirectCount + 1).toString())

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/album/:path*", "/artist/:path*"],
}

