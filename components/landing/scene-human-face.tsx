"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function SceneHumanFace() {
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
    <section ref={sectionRef} className="relative px-6 py-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Image */}
          <div
            className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-800 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <Image
              src="/traveller-testimonial-aisha.png"
              alt="Aisha, a Wanderpals traveller"
              fill
              className="object-cover"
            />

          </div>

          {/* Testimony */}
          <div
            className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <blockquote className="space-y-6">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed">
                "I booked 6 days. I stayed 3 weeks. I still don't know why I left."
              </p>
              <footer className="font-sans text-muted-foreground">
                <p className="font-medium text-foreground">Aisha</p>
                <p className="text-sm">Mumbai → Spiti Valley</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
