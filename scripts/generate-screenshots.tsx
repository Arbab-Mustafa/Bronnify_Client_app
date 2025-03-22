"use client"

import { useEffect, useRef } from "react"

export default function GenerateScreenshots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateScreenshots = async () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Create a simple screenshot with app name and icon
      // Desktop screenshot (1280x720)
      canvas.width = 1280
      canvas.height = 720

      // Background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green accent
      ctx.fillStyle = "#1DB954"
      ctx.fillRect(0, 0, canvas.width, 5)

      // App name
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bronify", canvas.width / 2, canvas.height / 2 - 50)

      // Tagline
      ctx.fillStyle = "#AAAAAA"
      ctx.font = "24px Arial"
      ctx.fillText("A Spotify clone dedicated to LeBron James content", canvas.width / 2, canvas.height / 2)

      const desktopScreenshot = canvas.toDataURL("image/png")

      // Mobile screenshot (720x1280)
      canvas.width = 720
      canvas.height = 1280

      // Background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Green accent
      ctx.fillStyle = "#1DB954"
      ctx.fillRect(0, 0, 5, canvas.height)

      // App name
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bronify", canvas.width / 2, canvas.height / 2 - 50)

      // Tagline
      ctx.fillStyle = "#AAAAAA"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("A Spotify clone dedicated", canvas.width / 2, canvas.height / 2)
      ctx.fillText("to LeBron James content", canvas.width / 2, canvas.height / 2 + 30)

      const mobileScreenshot = canvas.toDataURL("image/png")

      // Display download links
      const container = document.getElementById("download-container")
      if (container) {
        container.innerHTML = `
          <p>Right-click on each link and select "Save link as..." to download the screenshots:</p>
          <div class="flex flex-col gap-2 mt-4">
            <a href="${desktopScreenshot}" download="app-screenshot.png" class="text-primary hover:underline">Download Desktop Screenshot (1280x720)</a>
            <a href="${mobileScreenshot}" download="app-screenshot-mobile.png" class="text-primary hover:underline">Download Mobile Screenshot (720x1280)</a>
          </div>
        `
      }
    }

    generateScreenshots()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">App Screenshot Generator</h1>
      <p className="mb-4">This tool generates app screenshots for the PWA manifest.</p>

      <div className="hidden">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div id="download-container" className="mt-4 p-4 border border-border rounded-md">
        Generating screenshots...
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Download both screenshot sizes</li>
          <li>Place them in the public folder of your project</li>
          <li>They will be used by the manifest.json file for PWA installation</li>
        </ol>
      </div>
    </div>
  )
}

