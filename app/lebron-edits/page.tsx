"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { VideoCard } from "@/components/video-card"
import { videoEdits, videoCategories, trendingVideos } from "@/lib/data"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileVideoPlayer } from "@/components/mobile-video-player"

export default function LebronEditsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showMobilePlayer, setShowMobilePlayer] = useState(isMobile)

  // Make sure we have trending videos and include LeBron's Return to Cleveland
  const clevelandVideo = videoEdits.find((v) => v.id === "lebron-edit-12")
  const availableTrendingVideos = clevelandVideo
    ? [clevelandVideo, ...trendingVideos.filter((v) => v.id !== "lebron-edit-12").slice(0, 3)]
    : trendingVideos.length > 0
      ? trendingVideos
      : videoEdits.slice(0, 4)

  // If on mobile, show the video player immediately
  if (isMobile && showMobilePlayer) {
    return <MobileVideoPlayer initialVideoId={videoEdits[0].id} onClose={() => setShowMobilePlayer(false)} />
  }

  return (
    <div className="space-y-10 pb-24">
      <PageHeader title="LeBron Edits" description="Watch the best LeBron James video edits and highlights" />

      {/* Featured video section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableTrendingVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* Video categories */}
      {videoCategories.map(
        (category) =>
          category.videos.length > 0 && (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </section>
          ),
      )}

      {/* All videos section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All LeBron Edits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videoEdits.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  )
}

