"use client"

import { useEffect, useRef, useState } from "react"

export function SceneIndependence() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    <section ref={sectionRef} className="relative px-6 py-32 md:px-16 lg:px-24 bg-card/30">
      <div className="mx-auto max-w-3xl text-center">
        <div
          className={`space-y-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
            No investors. No exit plan.
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Just travellers running trips for travellers. Since 2019. Independent. Intentional. Uncompromising.
          </p>
        </div>

        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
        >
          <p className="font-sans text-sm text-muted-foreground/70">
            While others chase scale, we chase meaning.
          </p>
        </div>
      </div>
    </section>
  )
}
