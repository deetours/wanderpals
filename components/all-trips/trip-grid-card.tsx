"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Trip {
  id: string
  name: string
  tagline: string
  duration: string
  image: string
  groupSize: string
  price?: number
  spotsLeft?: number
}

interface TripGridCardProps {
  trip: Trip
  index: number
  featured?: boolean
}

export function TripGridCard({ trip, index, featured = false }: TripGridCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: featured ? `${(index % 3) * 100 + 200}ms` : `${(index % 3) * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/trips/${trip.id}`} className="group block">
        {/* Image - featured cards are taller */}
        <div className={`relative overflow-hidden rounded-lg ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform ease-out ${
              featured ? "duration-1000" : "duration-700"
            } ${isHovered ? "scale-105" : "scale-100"}`}
            style={{ backgroundImage: `url('${trip.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div
            className={`absolute bottom-4 right-4 flex items-center gap-2 text-primary transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <span className="text-sm font-sans">See the journey</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors duration-300">
            {trip.name}
          </h3>
          <p className="mt-1 font-sans text-sm text-muted-foreground italic">{trip.tagline}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{trip.duration}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{trip.groupSize} travellers</span>
          </div>
          
          {/* Pricing and urgency */}
          <div className="mt-3 pt-3 border-t border-muted-foreground/10 flex items-center justify-between">
            {trip.price && (
              <span className="font-sans text-xs text-primary">
                From ₹{trip.price.toLocaleString()}
              </span>
            )}
            {trip.spotsLeft && trip.spotsLeft <= 3 && (
              <span className="font-sans text-xs text-orange-400">
                Only {trip.spotsLeft} spots
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
