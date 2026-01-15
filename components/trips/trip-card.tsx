"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Trip {
  id: string
  name: string
  tagline: string
  duration: string
  images: string[]
  difficulty: string
  groupSize: string
}

interface TripCardProps {
  trip: Trip
  index: number
}

export function TripCard({ trip, index }: TripCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-cycle through images when visible
  useEffect(() => {
    if (isVisible && !isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % trip.images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isVisible, isHovered, trip.images.length])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/trips/${trip.id}`} className="group block">
        {/* Image strip - scrolls like chapters */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          {trip.images.map((image, imgIndex) => (
            <div
              key={imgIndex}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
                currentImageIndex === imgIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              style={{ backgroundImage: `url('${image}')` }}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          {/* Image indicators */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {trip.images.map((_, imgIndex) => (
              <button
                key={imgIndex}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentImageIndex(imgIndex)
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentImageIndex === imgIndex ? "w-8 bg-primary" : "w-4 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content below image */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-300">
              {trip.name}
            </h2>
            <p className="mt-2 font-serif text-lg text-muted-foreground italic">{trip.tagline}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{trip.duration}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{trip.groupSize} travellers</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm">See the journey</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </div>
  )
}
