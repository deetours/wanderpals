"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SceneExit() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.4 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="space-y-6">
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/stays"
            className="group inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-8 py-4 font-sans text-lg text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Start wandering
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p
          className={`text-xs text-muted-foreground/50 tracking-wide transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Takes less than a minute
        </p>
      </div>

      {/* Footer - minimal */}
      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/50">Wanderpals © 2026</p>
      </footer>
    </section>
  )
}
