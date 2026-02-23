"use client"

import { useEffect, useState } from "react"
import { SceneHeroVisual } from "./scene-hero-visual"

export function SceneArrival() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-start px-6 md:px-16 lg:px-24 overflow-hidden">
      <SceneHeroVisual />
      
      {/* Fade gradient overlay - blends carousel into next section */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-5" />
      
      <div className="relative z-10 max-w-3xl">
        {/* Main title */}
        <h1
          className={`font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight text-foreground transition-all duration-[900ms] ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            animationDelay: "200ms",
            letterSpacing: mounted ? "0.02em" : "0.1em",
            transition: "opacity 800ms ease-out, transform 800ms ease-out, letter-spacing 900ms ease-out",
          }}
        >
          Wanderpals
        </h1>

        {/* Tagline - delayed */}
        <p
          className={`mt-6 font-serif text-xl md:text-2xl lg:text-3xl text-muted-foreground transition-all duration-[800ms] ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Travel slower. Stay longer.
        </p>
      </div>

      {/* No scroll cue yet - builds anticipation */}
    </section>
  )
}
