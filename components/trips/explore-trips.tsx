"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../ui/navbar"
import { TripCard } from "./trip-card"
import { createClientComponentClient } from "@/lib/supabase-client"

export function ExploreTrips() {
  const [mounted, setMounted] = useState(false)
  const [trips, setTrips] = useState<any[]>([])
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
          .eq("status", "published")
          .not("name", "is", null)
          .order("created_at", { ascending: false })

        if (error || !data) {
          setTrips([])
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
          groupSize: trip.group_size || "8",
        }))

        setTrips(supabaseTrips)
      } catch (error) {
        console.error("Error fetching trips:", error)
        setTrips([])
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
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            Journeys for people who don't rush places.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
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
