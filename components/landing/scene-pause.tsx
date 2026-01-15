"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export function ScenePause() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <div className="space-y-6">
        <p
          className={`max-w-xl font-sans text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          For travellers who value people over plans.
        </p>

        <p
          className={`font-sans text-sm text-muted-foreground/60 tracking-wide transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Since 2019. Independently run.
        </p>
      </div>

      {/* Scroll indicator - appears slowly */}
      <div
        className={`absolute bottom-12 flex flex-col items-center gap-2 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground/60">Scroll</span>
        <ChevronDown className="h-5 w-5 text-muted-foreground/60 animate-slow-pulse" />
      </div>
    </section>
  )
}
