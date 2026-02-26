"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const threeLines = [
  {
    text: "Wake up somewhere new",
    image: "/hero-foggy-valley-dawn.png",
    position: "left",
    priority: true, // Forces immediate preload
  },
  {
    text: "Walk with strangers",
    image: "/hero-campfire-spiti.png",
    position: "right",
    priority: true, // Forces immediate preload
  },
  {
    text: "Leave with fewer goodbyes",
    image: "/hero-houseboat-kerala.jpg",
    position: "left",
    priority: true, // Forces immediate preload
  },
]


export function SceneThreeLines() {
  const [visibleLines, setVisibleLines] = useState<boolean[]>([false, false, false])
  const lineRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])

  useEffect(() => {
    const observers = lineRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleLines((prev) => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          }
        },
        { threshold: 0.3 },
      )

      if (ref) {
        observer.observe(ref)
      }

      return observer
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <section className="relative space-y-32 py-24 px-6 md:px-16 lg:px-24">
      {threeLines.map((line, index) => (
        <div
          key={index}
          ref={(el) => {
            lineRefs.current[index] = el
          }}
          className={`grid gap-8 items-center md:grid-cols-2 ${line.position === "right" ? "md:grid-flow-dense" : ""}`}
        >
          {/* Image */}
          <div
            className="relative aspect-video overflow-hidden rounded-lg"
          >
            <Image
              src={line.image}
              alt={line.text}
              fill
              className="object-cover"
              priority={line.priority}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
          </div>

          {/* Text */}
          <div
            className={`transition-all duration-700 ease-out ${visibleLines[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: visibleLines[index] ? "200ms" : "0ms" }}
          >
            <h3 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
              {line.text}
            </h3>
          </div>
        </div>
      ))}
    </section>
  )
}
