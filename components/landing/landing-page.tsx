"use client"

import { useState, useEffect } from "react"
import { SceneArrival } from "./scene-arrival"
import { SceneVillain } from "./scene-villain"
import { SceneThreeLines } from "./scene-three-lines"
import { SceneHumanFace } from "./scene-human-face"
import { ScenePause } from "./scene-pause"
import { SceneReveal } from "./scene-reveal"
import { SceneChoice } from "./scene-choice"
import { SceneProof } from "./scene-proof"
import { SceneIndependence } from "./scene-independence"
import { SceneTrust } from "./scene-trust"
import { SceneFAQ } from "./scene-faq"
import { SceneExit } from "./scene-exit"
import { TravellerStories } from "../community/traveller-stories"
import { ReferralProgram } from "../community/referral-program"
import { HighlightsGallery } from "../community/highlights-gallery"
import { PostTripJourney } from "../community/post-trip-journey"
import { Navbar } from "../ui/navbar"

export function LandingPage() {
  const [showNavbar, setShowNavbar] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show navbar after first scroll
      if (scrollY > 100 && !showNavbar) {
        setShowNavbar(true)
      }

      // Track current scene based on scroll position
      const vh = window.innerHeight
      const scene = Math.floor(scrollY / (vh * 0.8))
      setCurrentScene(scene)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showNavbar])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={showNavbar} />

      {/* Scene 1: Arrival with hero visual */}
      <SceneArrival />

      {/* Scene 2: Villain Statement */}
      <SceneVillain />

      {/* Scene 3: Three Poetic Lines with visuals */}
      <SceneThreeLines />

      {/* Scene 4: Human Face + Testimonial */}
      <SceneHumanFace />

      {/* Scene 5: Pause */}
      <ScenePause />

      {/* Scene 6: Reveal */}
      <SceneReveal />

      {/* Scene 7: Choice */}
      <SceneChoice />

      {/* Scene 8: Social Proof */}
      <SceneProof />

      {/* Scene 9: Independence Manifesto */}
      <SceneIndependence />

      {/* Scene 10: Trust & Why Us */}
      <SceneTrust />

      {/* Scene 11: Traveller Stories */}
      <TravellerStories />

      {/* Scene 12: Highlights Gallery */}
      <HighlightsGallery />

      {/* Scene 13: Post-Trip Journey */}
      <PostTripJourney />

      {/* Scene 14: Referral Program */}
      <ReferralProgram />

      {/* Scene 15: FAQ */}
      <SceneFAQ />

      {/* Scene 16: Exit CTA */}
      <SceneExit />
    </main>
  )
}
