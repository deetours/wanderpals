"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
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
import { HighlightsGallery } from "../community/highlights-gallery"
import { PostTripJourney } from "../community/post-trip-journey"
import { Navbar } from "../ui/navbar"

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showNavbar, setShowNavbar] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowNavbar(scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main 
      ref={containerRef}
      className="grain min-h-screen bg-background relative overflow-x-hidden no-scrollbar"
    >
      <Navbar visible={showNavbar} />

      {/* Traveler's Compass (Innovation Indicator) */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-primary/30 z-50 origin-[0%]"
        style={{ scaleX }}
      />
      
      <div className="fixed top-1/2 right-4 -translate-y-1/2 flex-col gap-4 z-40 mix-blend-difference hidden md:flex">
        {[...Array(16)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            style={{ 
              backgroundColor: useTransform(
                scrollYProgress, 
                [i / 16, (i + 1) / 16], 
                ["rgba(255,255,255,0.2)", "#e6b873"]
              ) 
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <SceneArrival />
        <SceneVillain />
        <SceneThreeLines />
        <SceneHumanFace />
        <ScenePause />
        <SceneReveal />
        <SceneChoice />
        <SceneProof />
        <SceneIndependence />
        <SceneTrust />
        <TravellerStories />
        <HighlightsGallery />
        <PostTripJourney />
        <SceneFAQ />
        <SceneExit />
      </div>
    </main>
  )
}
