"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "../ui/navbar"
import { StayCard } from "./stay-card"
import { StayFilters } from "./stay-filters"

const stays = [
  {
    id: "bir",
    name: "Wanderpals Bir",
    location: "Himachal Pradesh",
    tagline: "Where mornings begin slowly",
    memoryCue: "Best for paragliding season",
    stayStory: "Most evenings end around the common table.",
    image: "/stays/bir.jpg",
    type: "mountains",
    roomType: "both",
    vibe: "social",
  },
  {
    id: "gokarna",
    name: "Wanderpals Gokarna",
    location: "Karnataka",
    tagline: "Salt air and shared sunsets",
    memoryCue: "Known for beach bonfires",
    stayStory: "Strangers become friends by the third sunset.",
    image: "/stays/gokarna.jpg",
    type: "beaches",
    roomType: "dorm",
    vibe: "social",
  },
  {
    id: "manali",
    name: "Wanderpals Manali",
    location: "Himachal Pradesh",
    tagline: "Snow, silence, and stories",
    memoryCue: "Loved for winter stays",
    stayStory: "The fireplace runs all night in December.",
    image: "/stays/manali.jpg",
    type: "mountains",
    roomType: "both",
    vibe: "quiet",
  },
  {
    id: "pondicherry",
    name: "Wanderpals Pondicherry",
    location: "Tamil Nadu",
    tagline: "French doors, local souls",
    memoryCue: "Perfect for solo travellers",
    stayStory: "The courtyard is where conversations begin.",
    image: "/stays/pondicherry.jpg",
    type: "cities",
    roomType: "private",
    vibe: "quiet",
  },
  {
    id: "rishikesh",
    name: "Wanderpals Rishikesh",
    location: "Uttarakhand",
    tagline: "River sounds and early risers",
    memoryCue: "Known for long breakfasts",
    stayStory: "Yoga at sunrise is optional, but everyone joins.",
    image: "/stays/rishikesh.jpg",
    type: "mountains",
    roomType: "both",
    vibe: "social",
  },
  {
    id: "varkala",
    name: "Wanderpals Varkala",
    location: "Kerala",
    tagline: "Cliffs, cafes, and calm",
    memoryCue: "Loved for sunset walks",
    stayStory: "The cliff path becomes a ritual by day two.",
    image: "/stays/varkala.jpg",
    type: "beaches",
    roomType: "both",
    vibe: "quiet",
  },
]

export function ExploreStays() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    roomType: "all",
    vibe: "all",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show filters after a delay
    const timer = setTimeout(() => setShowFilters(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredStays = stays.filter((stay) => {
    if (filters.type !== "all" && stay.type !== filters.type) return false
    if (filters.roomType !== "all" && stay.roomType !== filters.roomType && stay.roomType !== "both") return false
    if (filters.vibe !== "all" && stay.vibe !== filters.vibe) return false
    return true
  })

  const firstHalf = filteredStays.slice(0, 3)
  const secondHalf = filteredStays.slice(3)

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
            Places you don't just check into.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            You arrive as a guest. You leave knowing names.
          </p>
          <p
            className={`mt-2 font-sans text-sm text-muted-foreground/60 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Across mountains, coasts, and cities in India.
          </p>
        </div>
      </section>

      {/* Filters - slide in from right */}
      <StayFilters visible={showFilters} filters={filters} onChange={setFilters} />

      {/* Stay Grid - First Half */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {firstHalf.map((stay, index) => (
            <StayCard key={stay.id} stay={stay} index={index} featured={index === 2} />
          ))}
        </div>
      </section>

      {filteredStays.length > 3 && (
        <section className="px-6 py-16 text-center md:px-16 lg:px-24">
          <div className="mx-auto max-w-2xl space-y-2">
            <p className="font-serif text-lg md:text-xl text-muted-foreground">Most people stay for a night.</p>
            <p className="font-serif text-lg md:text-xl text-foreground">Some extend. A few don't leave on time.</p>
          </div>
        </section>
      )}

      {/* Stay Grid - Second Half */}
      {secondHalf.length > 0 && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondHalf.map((stay, index) => (
              <StayCard key={stay.id} stay={stay} index={index + 3} featured={(index + 3) % 3 === 2} />
            ))}
          </div>
        </section>
      )}

      {filteredStays.length === 0 && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="py-24 text-center">
            <p className="text-muted-foreground">No stays match your filters. Try adjusting them.</p>
          </div>
        </section>
      )}

      <section className="px-6 py-24 text-center md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-3">
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">Some stays are loud.</p>
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">Some are quiet.</p>
            <p className="font-serif text-xl md:text-2xl text-foreground">All are intentional.</p>
          </div>
          <p className="font-sans text-sm text-muted-foreground/70 pt-4">Choose the one that feels right.</p>
          <Link
            href="/stays/bir"
            className="group inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors duration-300 pt-2"
          >
            <span className="font-sans text-base">Explore a stay</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </main>
  )
}
