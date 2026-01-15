"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "../ui/navbar"
import { JourneyCard } from "./journey-card"

// Handpicked journeys - only 4-5 signature routes
const journeys = [
  {
    id: "spiti",
    name: "Spiti Valley",
    tagline: "Silence, altitude, and shared roads",
    duration: "9 Days",
    images: ["/spiti1.jpg", "/spiti2.jpg", "/spiti3.jpg"],
    groupSize: "8-10",
  },
  {
    id: "ladakh",
    name: "Ladakh Circuit",
    tagline: "Where the sky meets the earth",
    duration: "11 Days",
    images: ["/ladakh1.jpg", "/ladakh2.jpg", "/ladakh3.jpg"],
    groupSize: "8-10",
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    tagline: "Slow rivers, slower days",
    duration: "6 Days",
    images: ["/kerala1.jpg", "/kerala2.jpg", "/kerala3.jpg"],
    groupSize: "10-12",
  },
  {
    id: "meghalaya",
    name: "Meghalaya Trails",
    tagline: "Clouds below, roots above",
    duration: "7 Days",
    images: ["/meghalaya1.jpg", "/meghalaya2.jpg", "/meghalaya3.jpg"],
    groupSize: "8-10",
  },
]

export function JourneysPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Opening */}
      <section className="px-6 pt-32 pb-16 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Journeys for people who don't rush places.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Small groups. Local routes. Real pace.
          </p>
        </div>
      </section>

      {/* Journey Cards - vertical storytelling */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-24">
          {journeys.map((journey, index) => (
            <JourneyCard key={journey.id} journey={journey} index={index} />
          ))}
        </div>
      </section>

      {/* Mid page line */}
      <section className="px-6 py-24 text-center md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="font-serif text-xl md:text-2xl text-muted-foreground">No megaphones.</p>
          <p className="font-serif text-xl md:text-2xl text-foreground">No crowded routes.</p>
        </div>
      </section>

      {/* Soft Exit CTA - bridge to All Trips */}
      <section className="px-6 pb-32 text-center md:px-16 lg:px-24">
        <Link
          href="/all-trips"
          className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <span className="font-sans text-lg">Explore all trips</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </section>
    </main>
  )
}
