"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  onLoad?: () => void
}

export function OptimizedImage({ src, alt, width, height, className, priority = false, onLoad }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Check if we should use WebP
  const [supportsWebP, setSupportsWebP] = useState(false)

  useEffect(() => {
    // Check WebP support
    const checkWebP = async () => {
      const webpSupport = await testWebP()
      setSupportsWebP(webpSupport)
    }

    checkWebP()
  }, [])

  // Function to test WebP support
  const testWebP = () => {
    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = () => {
        resolve(true)
      }
      webP.onerror = () => {
        resolve(false)
      }
      webP.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
    })
  }

  // Try to use WebP version if supported and not already a WebP
  const getOptimizedSrc = () => {
    if (error) return "/placeholder.svg"

    // If already WebP or SVG, use as is
    if (src.endsWith(".webp") || src.endsWith(".svg")) return src

    // If WebP is supported, try to use WebP version
    if (supportsWebP) {
      // Check if this is a Vercel Blob URL
      if (src.includes("vercel-storage.com")) {
        return src // Vercel Blob already serves optimized images
      }

      // For R2 or other URLs, try to use WebP version if available
      if (src.includes("r2.dev")) {
        return src.replace(/\.(jpg|jpeg|png)$/, ".webp")
      }
    }

    return src
  }

  const handleLoad = () => {
    setLoaded(true)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setError(true)
    // If WebP fails, try original format
    if (supportsWebP && !src.endsWith(".webp")) {
      setSupportsWebP(false)
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      {!loaded && !error && <div className="absolute inset-0 bg-muted animate-pulse" />}

      <img
        src={getOptimizedSrc() || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        loading={priority ? "eager" : "lazy"}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Image not available</span>
        </div>
      )}
    </div>
  )
}

