"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { VideoThumbnailGenerator } from "@/components/video-thumbnail-generator"
import { videoEdits } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ThumbnailGeneratorPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [timeInSeconds, setTimeInSeconds] = useState(5)
  const [customVideoUrl, setCustomVideoUrl] = useState("")

  const handleThumbnailGenerated = (url: string) => {
    setThumbnailUrl(url)
  }

  const copyToClipboard = () => {
    if (thumbnailUrl) {
      navigator.clipboard
        .writeText(thumbnailUrl)
        .then(() => alert("Thumbnail URL copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err))
    }
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="Video Thumbnail Generator" description="Generate thumbnails from specific frames in videos" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeInSeconds">Time in seconds</Label>
              <Input
                id="timeInSeconds"
                type="number"
                value={timeInSeconds}
                onChange={(e) => setTimeInSeconds(Number(e.target.value))}
                min={0}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customVideoUrl">Custom Video URL</Label>
              <Input
                id="customVideoUrl"
                type="text"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="Enter a video URL"
              />
              <Button onClick={() => setSelectedVideo(customVideoUrl)} disabled={!customVideoUrl} className="w-full">
                Use Custom Video
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Or select from library</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {videoEdits.map((video) => (
                  <Button
                    key={video.id}
                    variant="outline"
                    onClick={() => setSelectedVideo(video.videoUrl)}
                    className="h-auto py-2 text-xs text-left justify-start"
                  >
                    {video.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Thumbnail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVideo ? (
              <>
                <VideoThumbnailGenerator
                  videoUrl={selectedVideo}
                  onThumbnailGenerated={handleThumbnailGenerated}
                  timeInSeconds={timeInSeconds}
                />

                {thumbnailUrl && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      <img
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt="Generated thumbnail"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <Button onClick={copyToClipboard} className="w-full">
                      Copy Thumbnail URL
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Select a video to generate a thumbnail</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select a video from the library or enter a custom video URL</li>
            <li>Set the time in seconds to capture the frame (default is 5 seconds)</li>
            <li>Click "Generate Thumbnail" to create a thumbnail from that frame</li>
            <li>Copy the generated thumbnail URL to use in your application</li>
            <li>Note: For videos hosted on external services, CORS restrictions may apply</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

