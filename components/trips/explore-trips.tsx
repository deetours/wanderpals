"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../ui/navbar"
import { TripCard } from "./trip-card"
import { createClientComponentClient } from "@/lib/supabase-client"

// Static trips data
const staticTrips = [
  {
    id: "spiti",
    name: "Spiti Valley",
    tagline: "Silence, altitude, and shared roads",
    duration: "9 Days",
    images: ["/trips/spiti-1.jpg", "/trips/spiti-2.jpg", "/trips/spiti-3.jpg"],
    difficulty: "Moderate",
    groupSize: "8-10",
  },
  {
    id: "ladakh",
    name: "Ladakh Circuit",
    tagline: "Where the sky meets the earth",
    duration: "11 Days",
    images: ["/trips/ladakh-1.jpg", "/trips/ladakh-2.jpg", "/trips/ladakh-3.jpg"],
    difficulty: "Challenging",
    groupSize: "8-10",
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    tagline: "Slow rivers, slower days",
    duration: "6 Days",
    images: ["/trips/kerala-1.jpg", "/trips/kerala-2.jpg", "/trips/kerala-3.jpg"],
    difficulty: "Easy",
    groupSize: "10-12",
  },
  {
    id: "meghalaya",
    name: "Meghalaya Trails",
    tagline: "Clouds below, roots above",
    duration: "7 Days",
    images: ["/trips/meghalaya-1.jpg", "/trips/meghalaya-2.jpg", "/trips/meghalaya-3.jpg"],
    difficulty: "Moderate",
    groupSize: "8-10",
  },
]

export function ExploreTrips() {
  const [mounted, setMounted] = useState(false)
  const [trips, setTrips] = useState(staticTrips)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchSupabaseTrips = async () => {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("trips")
          .select("id, name, tagline, duration, image_url, terrain, price")
          .order("created_at", { ascending: false })

        if (error || !data) {
          setTrips(staticTrips)
          setLoading(false)
          return
        }

        // Convert Supabase trips to card format
        const supabaseTrips = data.map((trip: any) => ({
          id: trip.id,
          name: trip.name,
          tagline: trip.tagline,
          duration: trip.duration,
          images: [trip.image_url || "/placeholder.jpg"],
          difficulty: trip.terrain || "Moderate",
          groupSize: "8",
        }))

        // Combine static and Supabase trips
        const allTrips = [...staticTrips, ...supabaseTrips]
        setTrips(allTrips)
      } catch (error) {
        console.error("Error fetching trips:", error)
        setTrips(staticTrips)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchSupabaseTrips()
    }
  }, [mounted])

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

      {/* Trip Cards - vertical storytelling */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        {loading ? (
          <div className="mx-auto max-w-5xl text-center py-12">
            <p className="text-muted-foreground">Loading trips...</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-24">
            {trips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Mid page line */}
      <section className="px-6 py-24 text-center md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl space-y-4">
          <p className="font-serif text-xl md:text-2xl text-muted-foreground">No megaphones.</p>
          <p className="font-serif text-xl md:text-2xl text-foreground">No crowded routes.</p>
        </div>
      </section>
    </main>
  )
}
