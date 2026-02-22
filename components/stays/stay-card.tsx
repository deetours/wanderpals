"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Stay {
  id: string
  name: string
  location: string
  tagline: string
  memoryCue: string
  stayStory: string
  image: string
  type: string
  roomType: string
  vibe: string
  price?: number
  availability?: string
}

interface StayCardProps {
  stay: Stay
  index: number
  featured?: boolean
}

export function StayCard({ stay, index, featured = false }: StayCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)

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
    <Link
      ref={cardRef}
      href={`/stays/${stay.id}`}
      className={`group relative block overflow-hidden rounded-lg bg-card transition-all ease-out ${
        featured ? "duration-900" : "duration-700"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[4/6]" : "aspect-[4/5]"}`}>
        {/* Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform ease-out ${
            featured ? "duration-900" : "duration-700"
          } ${isHovered ? "scale-[1.02]" : "scale-100"}`}
          style={{
            backgroundImage: `url('${stay.image}')`,
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Soft glow on hover */}
        <div
          className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3
            className={`font-serif text-2xl text-foreground transition-colors duration-500 ${
              isHovered ? "text-primary" : ""
            }`}
          >
            {stay.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{stay.location}</p>

          {/* Tagline fades up on hover */}
          <p
            className={`mt-3 font-serif text-base text-foreground/80 italic transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {stay.tagline}
          </p>

          <p className="mt-2 font-sans text-xs text-muted-foreground/50">{stay.memoryCue}</p>

          <p
            className={`mt-2 font-sans text-xs text-primary/70 italic transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            }`}
          >
            "{stay.stayStory}"
          </p>

          {/* Pricing and availability */}
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-muted-foreground/10">
            {stay.price && (
              <span className="font-sans text-xs text-primary">
                From ₹{stay.price.toLocaleString()}
              </span>
            )}
            {stay.availability && (
              <span className="font-sans text-xs text-muted-foreground/60">
                {stay.availability}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
