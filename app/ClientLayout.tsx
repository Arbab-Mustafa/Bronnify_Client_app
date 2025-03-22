"use client"

import type React from "react"
import { useEffect } from "react"
import { CircularStd } from "@/lib/fonts"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Player from "@/components/player"
import { LebronPledge } from "@/components/lebron-pledge"
import { MobileNav } from "@/components/mobile-nav"
import { InstallAppButton } from "@/components/install-app-button"
import { ClientRouter } from "@/components/client-router"
import Head from "next/head"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Update safe area insets for mobile devices
    const updateSafeAreas = () => {
      if (typeof window === "undefined") return

      // Detect iOS notch
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      if (iOS) {
        document.documentElement.style.setProperty("--safe-area-top", "env(safe-area-inset-top, 0px)")
        document.documentElement.style.setProperty("--safe-area-bottom", "env(safe-area-inset-bottom, 0px)")
        document.documentElement.style.setProperty("--safe-area-left", "env(safe-area-inset-left, 0px)")
        document.documentElement.style.setProperty("--safe-area-right", "env(safe-area-inset-right, 0px)")
      }
    }

    updateSafeAreas()
    window.addEventListener("resize", updateSafeAreas)

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("Service Worker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("Service Worker registration failed: ", err)
          },
        )
      })
    }

    return () => {
      window.removeEventListener("resize", updateSafeAreas)
    }
  }, [])

  const headContent = (
    <>
      <title>Bronify</title>
      <meta name="description" content="A Spotify clone dedicated to LeBron James content" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#1DB954" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/app-icon-192.png" />
      <link rel="apple-touch-icon" href="/app-icon-192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Bronify" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />

      {/* Preload critical assets */}
      <link rel="preload" href="/_next/static/css/app.css" as="style" />
      <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
      <link rel="preload" href="/app-icon-192.png" as="image" />

      {/* Preconnect to asset hosts if needed */}
      <link rel="preconnect" href="https://your-media-host.com" crossOrigin="anonymous" />

      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://your-media-host.com" />
    </>
  )

  return (
    <html lang="en">
      <Head>{headContent}</Head>
      <body className={`${CircularStd.variable} font-circular bg-background text-foreground`}>
        <ClientRouter>
          <div className="flex h-screen flex-col">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-6">{children}</main>
            </div>
            <Player />
            <MobileNav />
            <InstallAppButton />
          </div>
          <LebronPledge />
        </ClientRouter>
      </body>
    </html>
  )
}

