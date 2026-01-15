"use client"

import { useState, useEffect } from "react"
import { SceneArrival } from "./scene-arrival"
import { ScenePause } from "./scene-pause"
import { SceneReveal } from "./scene-reveal"
import { SceneChoice } from "./scene-choice"
import { SceneProof } from "./scene-proof"
import { SceneExit } from "./scene-exit"
import { Navbar } from "../ui/navbar"

export function LandingPage() {
  const [showNavbar, setShowNavbar] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          // Show navbar after first scroll
          if (scrollY > 100 && !showNavbar) {
            setShowNavbar(true)
          }

          // Track current scene based on scroll position
          const vh = window.innerHeight
          const scene = Math.floor(scrollY / (vh * 0.8))
          setCurrentScene(scene)
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showNavbar])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={showNavbar} />

      {/* Scene 1: Arrival */}
      <SceneArrival />

      {/* Scene 2: Pause */}
      <ScenePause />

      {/* Scene 3: Reveal */}
      <SceneReveal />

      {/* Scene 4: Choice */}
      <SceneChoice />

      {/* Scene 5: Social Proof */}
      <SceneProof />

      {/* Scene 6: Exit CTA */}
      <SceneExit />
    </main>
  )
}
