"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function SceneChoice() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<"stays" | "trips" | null>(null)
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
    <section ref={sectionRef} className="relative min-h-screen px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-5 md:gap-10 lg:gap-14">
          {/* LEFT - STAYS (Muted, smaller) */}
          <Link
            href="/stays"
            className={`group relative md:col-span-2 overflow-hidden rounded-lg bg-card transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "300ms" }}
            onMouseEnter={() => setHoveredCard("stays")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
                  hoveredCard === "stays" ? "scale-[1.02]" : "scale-100"
                }`}
                style={{
                  backgroundImage: `url('/cozy-hostel-dorm-warm-lights-quiet-evening-mountai.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-background/50" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3
                  className={`font-serif text-3xl md:text-4xl text-foreground transition-all duration-500 ${
                    hoveredCard === "stays" ? "text-primary" : ""
                  }`}
                >
                  Stay
                </h3>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">Homes built for conversations</p>
                <p className="mt-3 text-xs text-muted-foreground/60 tracking-wide">Dorms and private rooms</p>
              </div>
            </div>
          </Link>

          {/* RIGHT - TRIPS (Stronger contrast, larger) */}
          <Link
            href="/journeys"
            className={`group relative md:col-span-3 overflow-hidden rounded-lg bg-card transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "500ms" }}
            onMouseEnter={() => setHoveredCard("trips")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
                  hoveredCard === "trips" ? "scale-[1.02]" : "scale-100"
                }`}
                style={{
                  backgroundImage: `url('/mountain-road-trip-group-travelers-sunrise-himalay.jpg')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <h3
                  className={`font-serif text-3xl md:text-5xl text-foreground transition-all duration-500 ${
                    hoveredCard === "trips" ? "text-primary" : ""
                  }`}
                >
                  Go
                </h3>
                <p className="mt-2 text-sm md:text-lg text-muted-foreground">Journeys built for connection</p>
                <p className="mt-3 text-xs md:text-sm text-muted-foreground/60 tracking-wide">
                  Small groups, slow routes
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
