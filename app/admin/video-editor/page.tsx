"use client"

import type React from "react"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { videoEdits } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoThumbnailGenerator } from "@/components/video-thumbnail-generator"

interface VideoEditForm {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  likes: number
  views: number
  duration: number
}

export default function VideoEditorPage() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [formData, setFormData] = useState<VideoEditForm>({
    id: "",
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    likes: 0,
    views: 0,
    duration: 0,
  })
  const [jsonOutput, setJsonOutput] = useState<string>("")

  const handleSelectVideo = (videoId: string) => {
    const video = videoEdits.find((v) => v.id === videoId)
    if (video) {
      setSelectedVideoId(videoId)
      setFormData({
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        likes: video.likes,
        views: video.views,
        duration: video.duration,
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "likes" || name === "views" || name === "duration" ? Number(value) : value,
    }))
  }

  const handleThumbnailGenerated = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: url,
    }))
  }

  const generateJson = () => {
    const jsonData = JSON.stringify(formData, null, 2)
    setJsonOutput(jsonData)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonOutput)
      .then(() => alert("JSON copied to clipboard!"))
      .catch((err) => console.error("Could not copy text: ", err))
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader title="Video Editor" description="Edit video metadata and generate unique thumbnails" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {videoEdits.map((video) => (
                <Button
                  key={video.id}
                  variant={selectedVideoId === video.id ? "default" : "outline"}
                  onClick={() => handleSelectVideo(video.id)}
                  className="h-auto py-2 text-xs text-left justify-start"
                >
                  {video.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedVideoId && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="likes">Likes</Label>
                  <Input id="likes" name="likes" type="number" value={formData.likes} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="views">Views</Label>
                  <Input id="views" name="views" type="number" value={formData.views} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (s)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Generate New Thumbnail</Label>
                <VideoThumbnailGenerator videoUrl={formData.videoUrl} onThumbnailGenerated={handleThumbnailGenerated} />
              </div>

              <Button onClick={generateJson} className="w-full">
                Generate JSON
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {jsonOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>JSON Output</span>
              <Button size="sm" onClick={copyToClipboard}>
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">{jsonOutput}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

