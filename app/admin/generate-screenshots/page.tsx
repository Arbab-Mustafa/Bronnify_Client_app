"use client"

import dynamic from "next/dynamic"

// Dynamically import the component to ensure it only runs on the client
const GenerateScreenshots = dynamic(() => import("@/scripts/generate-screenshots"), {
  ssr: false,
})

export default function GenerateScreenshotsPage() {
  return <GenerateScreenshots />
}

