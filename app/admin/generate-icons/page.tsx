"use client"

import dynamic from "next/dynamic"

// Dynamically import the component to ensure it only runs on the client
const GenerateAppIcons = dynamic(() => import("@/scripts/generate-app-icons"), {
  ssr: false,
})

export default function GenerateIconsPage() {
  return <GenerateAppIcons />
}

