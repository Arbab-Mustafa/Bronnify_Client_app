"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ClientRouterProps {
  children: React.ReactNode
}

export function ClientRouter({ children }: ClientRouterProps) {
  const router = useRouter()
  const [isRouting, setIsRouting] = useState(false)

  useEffect(() => {
    // Function to intercept all link clicks
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor element
      let target = e.target as HTMLElement

      while (target && target.tagName !== "A") {
        target = target.parentElement as HTMLElement

        if (!target) break
      }

      // If it's not an anchor or has a special modifier key, don't handle
      if (!target || !target.tagName || target.tagName !== "A" || e.ctrlKey || e.metaKey || e.shiftKey) {
        return
      }

      const href = target.getAttribute("href")

      // Skip if no href, or if it's an external link, hash link, or data URL
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("data:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return
      }

      // Handle internal link
      e.preventDefault()
      setIsRouting(true)

      // Update browser history
      window.history.pushState({}, "", href)

      // Trigger route change
      router.push(href)

      // Set a timeout to reset the routing state
      setTimeout(() => {
        setIsRouting(false)
      }, 300)
    }

    // Add click event listener
    document.addEventListener("click", handleClick)

    // Handle back/forward navigation
    const handlePopState = () => {
      setIsRouting(true)
      router.refresh()
      setTimeout(() => {
        setIsRouting(false)
      }, 300)
    }

    window.addEventListener("popstate", handlePopState)

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [router])

  return (
    <>
      {children}
      {isRouting && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  )
}

