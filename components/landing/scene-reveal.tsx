"use client"

import { useEffect, useRef, useState } from "react"

const revealLines = ["Trade the rush for the rhythm", "Stay until it feels like home", "Let the journey change you"]

export function SceneReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLineIndex, setActiveLineIndex] = useState(-1)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      revealLines.forEach((_, index) => {
        setTimeout(
          () => {
            setActiveLineIndex(index)
          },
          400 + index * 600,
        )
      })
    }
  }, [isVisible])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"
          }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hostel-lights-mountain-roads-shared-meals-bonfire-.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="space-y-8 md:space-y-10">
          {revealLines.map((line, index) => (
            <p
              key={index}
              className={`font-serif text-2xl md:text-4xl lg:text-5xl text-foreground transition-all duration-700 ease-out ${activeLineIndex >= index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
