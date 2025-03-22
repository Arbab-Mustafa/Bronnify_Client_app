"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface VideoThumbnailGeneratorProps {
  videoUrl: string
  onThumbnailGenerated: (thumbnailUrl: string) => void
  timeInSeconds?: number
}

export function VideoThumbnailGenerator({
  videoUrl,
  onThumbnailGenerated,
  timeInSeconds = 5,
}: VideoThumbnailGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateThumbnail = () => {
    setIsGenerating(true)
    setError(null)

    if (!videoRef.current || !canvasRef.current) {
      setError("Video or canvas element not available")
      setIsGenerating(false)
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set up video event handlers
    const handleVideoLoad = () => {
      // Seek to the specified time
      video.currentTime = Math.min(timeInSeconds, video.duration || timeInSeconds)
    }

    const handleSeeked = () => {
      // Draw the current frame to the canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Could not get canvas context")
        setIsGenerating(false)
        return
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      try {
        const thumbnailUrl = canvas.toDataURL("image/jpeg")
        onThumbnailGenerated(thumbnailUrl)
      } catch (e) {
        setError("Error generating thumbnail: " + (e instanceof Error ? e.message : String(e)))
      }

      setIsGenerating(false)
    }

    const handleError = () => {
      setError("Error loading video")
      setIsGenerating(false)
    }

    // Add event listeners
    video.addEventListener("loadeddata", handleVideoLoad)
    video.addEventListener("seeked", handleSeeked)
    video.addEventListener("error", handleError)

    // Load the video
    video.src = videoUrl
    video.load()

    // Clean up event listeners
    return () => {
      video.removeEventListener("loadeddata", handleVideoLoad)
      video.removeEventListener("seeked", handleSeeked)
      video.removeEventListener("error", handleError)
    }
  }

  return (
    <div className="space-y-4">
      <div className="hidden">
        <video ref={videoRef} crossOrigin="anonymous" />
        <canvas ref={canvasRef} />
      </div>

      <Button onClick={generateThumbnail} disabled={isGenerating} className="w-full">
        {isGenerating ? "Generating..." : "Generate Thumbnail from Video"}
      </Button>

      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  )
}

