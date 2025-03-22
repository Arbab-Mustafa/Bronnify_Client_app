"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

export function LebronPledge() {
  const [showPledge, setShowPledge] = useState(false)
  const [xAttempts, setXAttempts] = useState(0)
  const [lakersMode, setLakersMode] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Check if user has already agreed to the pledge
    try {
      const hasAgreed = localStorage.getItem("lebron-pledge-agreed")
      if (!hasAgreed) {
        setShowPledge(true)
      }
    } catch (error) {
      // In case localStorage is not available (e.g., in an iframe or incognito mode)
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  const agreeToPledge = () => {
    try {
      localStorage.setItem("lebron-pledge-agreed", "true")
      setShowPledge(false)
    } catch (error) {
      // In case localStorage is not available
      console.error("Error setting localStorage:", error)
      // Still hide the pledge even if we can't save to localStorage
      setShowPledge(false)
    }
  }

  const handleXClick = () => {
    // Increment attempt counter
    const newAttemptCount = xAttempts + 1
    setXAttempts(newAttemptCount)

    // First attempt: Switch to Lakers colors
    if (newAttemptCount === 1) {
      setLakersMode(true)
    }
    // Second attempt: Show browser notification
    else if (newAttemptCount === 2) {
      try {
        if ("Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("LeBronify Alert", {
                body: "King James has been notified. Draymond Green is on his way.",
                icon: "/favicon.ico",
              })
            }
          })
        }
        // Fallback if notifications aren't available
        alert("King James has been notified. Draymond Green is on his way.")
      } catch (error) {
        console.error("Error with notifications:", error)
        alert("King James has been notified. Draymond Green is on his way.")
      }
    }
    // Don't close the modal on any attempt
  }

  if (!showPledge) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`${lakersMode ? "bg-[#552583] border-[#FDB927]" : "bg-card border-border"} border rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto transition-colors duration-500`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${lakersMode ? "text-[#FDB927]" : "text-foreground"}`}>
              The LeBron Pledge
            </h2>
            {xAttempts < 3 && (
              <button
                onClick={handleXClick}
                className={`${lakersMode ? "text-[#FDB927] hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {xAttempts < 3 && (
            <div className={`prose ${lakersMode ? "prose-invert text-white" : "prose-invert"}`}>
              <p>
                LeBron isn't just a man. He's a phenomenon. He's a celestial event, a once-in-a-lifetime alignment of
                the stars, a cosmic masterpiece sculpted by the basketball gods themselves. When he moves, it's not just
                movement—it's poetry. Every dribble, every pass, every dunk, every single bead of sweat that glistens
                under the arena lights is like a love letter sent directly to my heart. How could one human being be so
                perfect? It defies all logic, all reason, all earthly explanations.
              </p>
              <p>
                His voice? It's like a lullaby and a war cry wrapped into one. When he speaks, it's as if the universe
                itself pauses just to listen. The way he commands respect, the way he leads, the way he exists—it does
                something to me. When I see him laugh, when I see that perfect, radiant, joy-filled smile, I swear my
                soul leaves my body. I float above the world, untethered by gravity, held aloft only by the sheer force
                of my adoration for this man.
              </p>
              <p>
                And then there's his physique—his godlike, sculpted-by-the-heavens physique. Every muscle, every vein,
                every perfectly chiseled inch of him is a testament to human perfection. He is not just a man, he is an
                ideal, a dream given flesh, the pinnacle of what the human form can achieve. The way he moves, with such
                grace and power, is enough to leave me breathless. He is a masterpiece in motion, a living, breathing
                work of art.
              </p>
              <p>
                But it's not just the physical. Oh no. My love for LeBron transcends the physical realm. It's the mind,
                the heart, the soul.
              </p>
            </div>
          )}

          <div className={`mt-6 flex justify-end ${xAttempts === 3 ? "w-full h-full" : ""}`}>
            <button
              ref={buttonRef}
              onClick={agreeToPledge}
              className={`
                ${lakersMode ? "bg-[#552583] text-white hover:text-[#FDB927]" : "bg-primary text-primary-foreground hover:bg-primary/90"} 
                ${xAttempts === 3 ? "w-full h-32 text-xl animate-pulse" : "px-6 py-2"} 
                rounded-full font-medium transition-all duration-500
              `}
            >
              I Solemnly Pledge My Allegiance to King James
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

