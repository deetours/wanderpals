"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Navbar } from "../ui/navbar"
import { TripGridCard } from "./trip-grid-card"
import { TripFilters } from "./trip-filters"

// Full catalog of trips
const allTrips = [
  {
    id: "spiti",
    name: "Spiti Valley Loop",
    tagline: "High altitude. Low noise.",
    duration: "9 Days",
    image: "/trips/spiti-hero.jpg",
    groupSize: "8-10",
    region: "north",
    terrain: "mountains",
    difficulty: "moderate",
  },
  {
    id: "ladakh",
    name: "Ladakh Circuit",
    tagline: "Where the sky meets the earth",
    duration: "11 Days",
    image: "/trips/ladakh-hero.jpg",
    groupSize: "8-10",
    region: "north",
    terrain: "mountains",
    difficulty: "challenging",
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    tagline: "Slow rivers, slower days",
    duration: "6 Days",
    image: "/trips/kerala-hero.jpg",
    groupSize: "10-12",
    region: "south",
    terrain: "coast",
    difficulty: "easy",
  },
  {
    id: "meghalaya",
    name: "Meghalaya Trails",
    tagline: "Clouds below, roots above",
    duration: "7 Days",
    image: "/trips/meghalaya-hero.jpg",
    groupSize: "8-10",
    region: "east",
    terrain: "forest",
    difficulty: "moderate",
  },
  {
    id: "rajasthan",
    name: "Rajasthan Desert Route",
    tagline: "Golden sands, ancient forts",
    duration: "8 Days",
    image: "/rajasthan-desert-golden-sand-dunes-sunset.jpg",
    groupSize: "10-12",
    region: "west",
    terrain: "desert",
    difficulty: "easy",
  },
  {
    id: "himachal",
    name: "Himachal Hidden Valleys",
    tagline: "Off the maps, on the trails",
    duration: "7 Days",
    image: "/himachal-pradesh-mountain-valley-green-forests.jpg",
    groupSize: "8-10",
    region: "north",
    terrain: "mountains",
    difficulty: "moderate",
  },
  {
    id: "goa-karnataka",
    name: "Goa to Karnataka Coast",
    tagline: "Where the Western Ghats meet the sea",
    duration: "5 Days",
    image: "/goa-karnataka-coastline-beach-western-ghats.jpg",
    groupSize: "10-12",
    region: "south",
    terrain: "coast",
    difficulty: "easy",
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand Pilgrim Trails",
    tagline: "Sacred paths, quiet peaks",
    duration: "8 Days",
    image: "/uttarakhand-himalayan-temple-mountains-pilgrimage.jpg",
    groupSize: "8-10",
    region: "north",
    terrain: "mountains",
    difficulty: "moderate",
  },
  {
    id: "northeast",
    name: "Northeast Explorer",
    tagline: "Seven sisters, one journey",
    duration: "12 Days",
    image: "/northeast-india-scenic-green-hills-tea-gardens.jpg",
    groupSize: "8-10",
    region: "east",
    terrain: "forest",
    difficulty: "moderate",
  },
  {
    id: "kashmir",
    name: "Kashmir Valley",
    tagline: "Paradise remembered",
    duration: "7 Days",
    image: "/kashmir-valley-dal-lake-mountains-houseboat.jpg",
    groupSize: "10-12",
    region: "north",
    terrain: "mountains",
    difficulty: "easy",
  },
  {
    id: "sikkim",
    name: "Sikkim Sanctuary",
    tagline: "Monasteries in the mist",
    duration: "8 Days",
    image: "/sikkim-monastery-mountains-buddhist-prayer-flags.jpg",
    groupSize: "8-10",
    region: "east",
    terrain: "mountains",
    difficulty: "moderate",
  },
  {
    id: "andaman",
    name: "Andaman Islands",
    tagline: "Where the forest meets the reef",
    duration: "6 Days",
    image: "/andaman-islands-turquoise-water-beach-tropical.jpg",
    groupSize: "10-12",
    region: "south",
    terrain: "coast",
    difficulty: "easy",
  },
]

const moodKeywords: Record<string, { terrain?: string[]; duration?: string; groupSize?: string }> = {
  mountains: { terrain: ["mountains"] },
  mountain: { terrain: ["mountains"] },
  peaks: { terrain: ["mountains"] },
  hills: { terrain: ["mountains"] },
  snow: { terrain: ["mountains"] },
  high: { terrain: ["mountains"] },
  altitude: { terrain: ["mountains"] },
  silence: { groupSize: "small" },
  quiet: { groupSize: "small" },
  peaceful: { groupSize: "small" },
  calm: { groupSize: "small" },
  forest: { terrain: ["forest"] },
  forests: { terrain: ["forest"] },
  green: { terrain: ["forest"] },
  trees: { terrain: ["forest"] },
  water: { terrain: ["coast"] },
  sea: { terrain: ["coast"] },
  beach: { terrain: ["coast"] },
  coast: { terrain: ["coast"] },
  ocean: { terrain: ["coast"] },
  short: { duration: "short" },
  quick: { duration: "short" },
  weekend: { duration: "short" },
  long: { duration: "long" },
  extended: { duration: "long" },
  desert: { terrain: ["desert"] },
  sand: { terrain: ["desert"] },
  dunes: { terrain: ["desert"] },
}

export function AllTripsPage() {
  const [mounted, setMounted] = useState(false)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [showSecondHalf, setShowSecondHalf] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    region: "all",
    terrain: "all",
    duration: "all",
  })
  const [moodSearch, setMoodSearch] = useState("")
  const midPauseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Observe mid-page pause to trigger second half
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSecondHalf(true)
        }
      },
      { threshold: 0.5 },
    )

    if (midPauseRef.current) {
      observer.observe(midPauseRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const moodFilters = useMemo(() => {
    if (!moodSearch.trim()) return null
    const words = moodSearch.toLowerCase().split(/\s+/)
    const terrains: string[] = []
    let duration: string | null = null
    let smallGroup = false

    for (const word of words) {
      const mapping = moodKeywords[word]
      if (mapping) {
        if (mapping.terrain) terrains.push(...mapping.terrain)
        if (mapping.duration) duration = mapping.duration
        if (mapping.groupSize === "small") smallGroup = true
      }
    }

    return { terrains, duration, smallGroup }
  }, [moodSearch])

  // Filter trips with mood search + traditional filters
  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      // Traditional filters
      if (activeFilters.region !== "all" && trip.region !== activeFilters.region) return false
      if (activeFilters.terrain !== "all" && trip.terrain !== activeFilters.terrain) return false
      if (activeFilters.duration !== "all") {
        const days = Number.parseInt(trip.duration)
        if (activeFilters.duration === "short" && days > 7) return false
        if (activeFilters.duration === "long" && days <= 7) return false
      }

      // Mood search filters
      if (moodFilters) {
        if (moodFilters.terrains.length > 0 && !moodFilters.terrains.includes(trip.terrain)) return false
        if (moodFilters.duration) {
          const days = Number.parseInt(trip.duration)
          if (moodFilters.duration === "short" && days > 7) return false
          if (moodFilters.duration === "long" && days <= 7) return false
        }
        if (moodFilters.smallGroup) {
          const maxGroup = Number.parseInt(trip.groupSize.split("-")[1] || trip.groupSize)
          if (maxGroup > 10) return false
        }
      }

      return true
    })
  }, [activeFilters, moodFilters])

  const firstHalf = filteredTrips.slice(0, 6)
  const secondHalf = filteredTrips.slice(6)

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Scene 1: Arrival */}
      <section className="px-6 pt-32 pb-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-5xl lg:text-6xl text-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Every journey we currently run.
          </h1>
          <p
            className={`mt-4 font-sans text-lg text-muted-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Different places. Same pace.
          </p>
        </div>
      </section>

      <section className="px-6 py-6 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <input
            type="text"
            value={moodSearch}
            onChange={(e) => setMoodSearch(e.target.value)}
            placeholder="Looking for mountains, silence, forests, or water?"
            className="w-full bg-transparent border-b border-border/50 py-3 font-sans text-lg text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-colors duration-300"
          />
        </div>
      </section>

      <section className="px-6 py-4 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span className="font-sans text-sm">Filter journeys</span>
            <span className="text-xs text-muted-foreground/60">(optional)</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${filtersExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Filters slide down */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              filtersExpanded ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <TripFilters activeFilters={activeFilters} onFilterChange={setActiveFilters} />
          </div>

          <p className="mt-4 font-sans text-xs text-muted-foreground/60">
            All journeys are hosted by local teams and run in small groups.
          </p>
        </div>
      </section>

      {/* Scene 4: Trip Grid - First Half with rhythm */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {firstHalf.map((trip, index) => (
              <div key={trip.id} className={index === 3 ? "lg:col-span-2" : ""}>
                <TripGridCard trip={trip} index={index} featured={index === 3} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scene 5: Mid-Page Pause */}
      {secondHalf.length > 0 && (
        <section ref={midPauseRef} className="px-6 py-24 text-center md:px-16 lg:px-24">
          <div className="mx-auto max-w-2xl space-y-3">
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">We don't add journeys often.</p>
            <p className="font-serif text-xl md:text-2xl text-foreground">Each one earns its place.</p>
          </div>
        </section>
      )}

      {/* Scene 6: Trip Grid - Second Half (Lazy loaded) with rhythm */}
      {secondHalf.length > 0 && showSecondHalf && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {secondHalf.map((trip, index) => (
                <div key={trip.id} className={index === 3 ? "lg:col-span-2" : ""}>
                  <TripGridCard trip={trip} index={index} featured={index === 3} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scene 7: Ending */}
      <section className="px-6 py-24 text-center md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-3">
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">
              If you're unsure, start with one journey.
            </p>
            <p className="font-serif text-xl md:text-2xl text-foreground">The rest make sense later.</p>
          </div>
          <Link
            href="/journeys"
            className="group inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors duration-300"
          >
            <span className="font-sans text-lg">See our Journeys</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </main>
  )
}
