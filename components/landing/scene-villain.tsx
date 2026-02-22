"use client"

import { useEffect, useRef, useState } from "react"

export function SceneVillain() {
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
      className="relative flex min-h-screen items-center justify-start px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-3xl">
        <div
          className={`space-y-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground">
            Most travel is consumption.
          </h2>
          <p className="font-serif text-2xl md:text-3xl text-muted-foreground mt-4">
            New city. New photo. New flight.
          </p>
        </div>

        <div
          className={`mt-12 space-y-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="font-sans text-lg text-muted-foreground">We built something different.</p>
          <p className="font-sans text-lg text-foreground">Slower. Smaller. More human.</p>
        </div>
      </div>
    </section>
  )
}
