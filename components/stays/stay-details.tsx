"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "../ui/navbar"
import { Check } from "lucide-react"
import Link from "next/link"

interface Stay {
  id: string
  name: string
  location: string
  state: string
  tagline: string
  heroImage: string
  feeling: string
  images: string[]
  quotes: { text: string; author: string }[]
  amenities: string[]
  roomTypes: { name: string; price: number; description: string }[]
}

interface StayDetailsProps {
  stay: Stay
}

export function StayDetails({ stay }: StayDetailsProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Hero - full bleed image */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${stay.heroImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Overlay copy */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-7xl">
            <h1
              className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {stay.name}
            </h1>
            <p
              className={`mt-2 text-lg text-muted-foreground transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {stay.state}
            </p>
            <p
              className={`mt-4 font-serif text-xl md:text-2xl text-foreground/80 italic transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {stay.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: The Feeling */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed">{stay.feeling}</p>
        </div>
      </RevealSection>

      {/* Section 2: The Space - horizontal scroll */}
      <section className="py-12">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 md:px-16 lg:px-24" style={{ width: "max-content" }}>
            {stay.images.map((image, index) => (
              <div
                key={index}
                className="relative h-[300px] w-[400px] md:h-[400px] md:w-[500px] flex-shrink-0 overflow-hidden rounded-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-[1.02]"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Caption after images */}
        <div className="px-6 pt-8 text-center md:px-16 lg:px-24">
          <p className="font-serif text-lg md:text-xl text-muted-foreground">Dorms that feel personal.</p>
          <p className="mt-1 font-serif text-lg md:text-xl text-muted-foreground">Rooms that stay quiet.</p>
        </div>
      </section>

      {/* Section 3: The People (Proof) */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl space-y-12">
          {stay.quotes.map((quote, index) => (
            <blockquote key={index} className="text-center">
              <p className="font-serif text-xl md:text-2xl text-foreground italic">"{quote.text}"</p>
              <cite className="mt-4 block text-sm text-muted-foreground not-italic">— {quote.author}</cite>
            </blockquote>
          ))}
        </div>
      </RevealSection>

      {/* Section 4: Safety & Trust */}
      <RevealSection className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-8">
          {stay.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Section 5: Booking */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl rounded-xl bg-card p-6 md:p-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground">Choose your space</h2>

          {/* Room type selector */}
          <div className="mt-6 space-y-3">
            {stay.roomTypes.map((room, index) => (
              <button
                key={index}
                onClick={() => setSelectedRoom(index)}
                className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                  selectedRoom === index
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{room.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-foreground">₹{room.price}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Date picker placeholder */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Check in</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Check out</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/booking/stay/${stay.id}`}
            className="mt-8 block w-full rounded-lg bg-primary py-4 text-center font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            Check availability
          </Link>
        </div>
      </RevealSection>
    </main>
  )
}

// Reveal section component
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  )
}
