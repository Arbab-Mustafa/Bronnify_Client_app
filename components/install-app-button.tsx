"use client"

import { useState, useEffect } from "react"
import { Download, X, Share2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"

export function InstallAppButton() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Only show on mobile devices
    if (!isMobile) return

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if user has previously dismissed the banner
    const hasClosedBanner = localStorage.getItem("installBannerClosed") === "true"
    if (hasClosedBanner) return

    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOSDevice(isIOS)

    // For Android/Chrome - listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show banner immediately
    setShowBanner(true)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [isMobile])

  const handleInstallClick = async () => {
    // Hide the banner
    setShowBanner(false)

    // If it's Android/Chrome and we have the deferred prompt
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)

      // We've used the prompt, and can't use it again, so clear it
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const closeBanner = () => {
    setShowBanner(false)
    // Store in localStorage to avoid showing again in this session
    localStorage.setItem("installBannerClosed", "true")
  }

  // Don't show anything if not on mobile or already installed
  if (!isMobile || isInstalled || !showBanner) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-primary text-primary-foreground rounded-lg shadow-lg z-30 animate-fade-in">
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 mr-3 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src="/assets/images/app-icon.png"
            alt="Bronify App"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Install Bronify App</h3>
          <p className="text-xs mt-1">
            {isIOSDevice
              ? "Tap the share icon below and select 'Add to Home Screen'"
              : "Install Bronify for the best standalone experience"}
          </p>
        </div>
        <div className="flex gap-2 ml-2">
          {isIOSDevice ? (
            <div className="flex items-center text-xs">
              <Share2 className="h-4 w-4 mr-1" />
              Then "Add to Home Screen"
            </div>
          ) : (
            showInstallPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-white text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Install
              </button>
            )
          )}
          <button onClick={closeBanner} className="text-primary-foreground p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

