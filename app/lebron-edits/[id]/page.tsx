"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { VideoCard } from "@/components/video-card"
import { videoEdits } from "@/lib/data"
import { ThumbsUp, Share2, MessageSquare } from "lucide-react"

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const router = useRouter()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  // Find the video by ID
  const videoIndex = videoEdits.findIndex((video) => video.id === params.id)

  if (videoIndex === -1) {
    notFound()
  }

  const video = videoEdits[videoIndex]

  // Set the current video index when the component mounts
  useEffect(() => {
    setCurrentVideoIndex(videoIndex)
  }, [videoIndex])

  // Get related videos (excluding the current one)
  const relatedVideos = videoEdits
    .filter((_, index) => index !== currentVideoIndex)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6)

  // Handle next/previous video navigation
  const handleNext = () => {
    const nextIndex = (currentVideoIndex + 1) % videoEdits.length
    router.push(`/lebron-edits/${videoEdits[nextIndex].id}`)
  }

  const handlePrevious = () => {
    const prevIndex = (currentVideoIndex - 1 + videoEdits.length) % videoEdits.length
    router.push(`/lebron-edits/${videoEdits[prevIndex].id}`)
  }

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    } else {
      return `${views} views`
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video player */}
          <VideoPlayer
            video={video}
            autoPlay={false} // Change to false initially
            onNext={handleNext}
            onPrevious={handlePrevious}
          />

          {/* Video info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{formatViews(video.views)} • Added to Bronify</div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`} />
                  <span>{isLiked ? video.likes + 1 : video.likes}</span>
                </button>

                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>

                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg">
              <p className="text-muted-foreground">{video.description}</p>
            </div>
          </div>
        </div>

        {/* Related videos */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Up Next</h2>

          <div className="space-y-4">
            {relatedVideos.map((relatedVideo) => (
              <VideoCard key={relatedVideo.id} video={relatedVideo} size="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

