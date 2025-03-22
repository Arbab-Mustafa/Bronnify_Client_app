"use client"

import { useEffect, useRef } from "react"

export default function GenerateAppIcons() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateIcons = async () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Load the source image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = "/assets/images/app-icon.png"

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Generate 192x192 icon
      canvas.width = 192
      canvas.height = 192
      ctx.drawImage(img, 0, 0, 192, 192)
      const icon192 = canvas.toDataURL("image/png")

      // Generate 512x512 icon
      canvas.width = 512
      canvas.height = 512
      ctx.drawImage(img, 0, 0, 512, 512)
      const icon512 = canvas.toDataURL("image/png")

      // Display download links
      const container = document.getElementById("download-container")
      if (container) {
        container.innerHTML = `
          <p>Right-click on each link and select "Save link as..." to download the icons:</p>
          <div class="flex flex-col gap-2 mt-4">
            <a href="${icon192}" download="app-icon-192.png" class="text-primary hover:underline">Download 192x192 icon</a>
            <a href="${icon512}" download="app-icon-512.png" class="text-primary hover:underline">Download 512x512 icon</a>
          </div>
        `
      }
    }

    generateIcons()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">App Icon Generator</h1>
      <p className="mb-4">This tool generates app icons from the provided image.</p>

      <div className="hidden">
        <canvas ref={canvasRef}></canvas>
      </div>

      <div id="download-container" className="mt-4 p-4 border border-border rounded-md">
        Generating icons...
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Download both icon sizes</li>
          <li>Place them in the public folder of your project</li>
          <li>They will be used by the manifest.json file for PWA installation</li>
        </ol>
      </div>
    </div>
  )
}

