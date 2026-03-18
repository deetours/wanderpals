"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import { JourneyCard } from "./journey-card"

export function JourneysPage() {
  const [mounted, setMounted] = useState(false)
  const [journeys, setJourneys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchFeaturedTrips()
  }, [])

  const fetchFeaturedTrips = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('trips')
        .select('id, name, tagline, duration, image_url, group_size')
        .eq('status', 'published')
        .not('name', 'is', null)
        .eq('is_featured', true)
        .limit(5)

      if (error) throw error

      // Transform Supabase data to match JourneyCard format
      const transformedData = (data || []).map((trip: any) => ({
        id: trip.id,
        name: trip.name,
        tagline: trip.tagline,
        duration: trip.duration,
        images: [trip.image_url], // Wrap single image in array
        groupSize: `${trip.group_size}`,
      }))

      setJourneys(transformedData)
    } catch (error) {
      console.error('Error fetching featured trips:', error)
      setJourneys([]) // Fall back to empty
    } finally {
      setLoading(false)
    }
  }

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

      {/* Journey Cards - vertical storytelling */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-24">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading curated journeys...</div>
          ) : journeys.length > 0 ? (
            journeys.map((journey, index) => (
              <JourneyCard key={journey.id} journey={journey} index={index} />
            ))
          ) : (
            <div className="text-center py-16 text-muted-foreground">No featured journeys at the moment.</div>
          )}
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
