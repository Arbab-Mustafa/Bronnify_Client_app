"use client"

import { useEffect, useState } from "react"
import { LebronOfTheDay } from "@/components/lebron-of-the-day"
import { TopLebrons } from "@/components/top-lebrons"
import { FeaturedAlbums } from "@/components/featured-albums"
import { PageHeader } from "@/components/page-header"
import { ShuffleButton } from "@/components/shuffle-button"
import { FeaturedVideo } from "@/components/featured-video"
import staticData from "@/lib/static-data"
import Link from "next/link"

export default function Home() {
  const [featuredVideo, setFeaturedVideo] = useState(null)

  useEffect(() => {
    // Use Attack on Bron (formerly LeBron's Return to Cleveland) as the featured video
    const video = staticData.videoEdits.find((v) => v.id === "lebron-edit-12") || staticData.videoEdits[0]
    setFeaturedVideo(video)
  }, [])

  if (!featuredVideo) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="Home" description="Welcome to Bronify" />

      <LebronOfTheDay />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Video</h2>
          <Link href="/lebron-edits" className="text-sm text-primary hover:underline">
            View all videos
          </Link>
        </div>
        <FeaturedVideo video={featuredVideo} />
      </section>

      <div className="flex justify-center items-center my-8">
        <ShuffleButton />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Albums</h2>
        </div>
        <FeaturedAlbums />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Top LeBrons</h2>
        <TopLebrons />
      </section>
    </div>
  )
}

