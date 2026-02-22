"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import Link from "next/link"
import { Check } from "lucide-react"

interface TripDetailsDynamicProps {
  tripId: string
}

export function TripDetailsDynamic({ tripId }: TripDetailsDynamicProps) {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true)
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .single()

        if (error || !data) {
          setTrip(null)
          return
        }

        setTrip(data)
      } catch (error) {
        console.error("Error fetching trip:", error)
        setTrip(null)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchTrip()
    }
  }, [tripId, mounted])

  if (loading) {
    return (
      <main className="grain min-h-screen bg-background">
        <Navbar visible={true} />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </main>
    )
  }

  if (!trip) {
    return (
      <main className="grain min-h-screen bg-background">
        <Navbar visible={true} />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-lg">
            Maybe it's time to wander somewhere new. Check all trips.
          </p>
          <Link href="/all-trips" className="text-primary hover:text-primary/80 transition-colors">
            ← Back to all trips
          </Link>
        </div>
      </main>
    )
  }

  // Parse description for itinerary days
  const parseItinerary = (description: string) => {
    const days: { title: string; content: string[] }[] = []
    const lines = description.split("\n")
    let currentDay: { title: string; content: string[] } | null = null

    lines.forEach((line) => {
      const dayMatch = line.match(/^DAY\s+(\d+|0)\s*-\s*(.+)$/i)
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay)
        }
        currentDay = { title: `${dayMatch[1].padStart(1, "0")} - ${dayMatch[2]}`, content: [] }
      } else if (currentDay && line.trim()) {
        if (!line.match(/^ROUTE:|^TERMS|^\s*-|^Winter Spiti|^DURATION:|^INCLUSIONS/i)) {
          currentDay.content.push(line.trim())
        }
      }
    })

    if (currentDay) {
      days.push(currentDay)
    }

    return days
  }

  const itinerary = parseItinerary(trip.description || "")

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${trip.image_url || "/placeholder.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-5xl">
            <p
              className={`text-sm uppercase tracking-widest text-primary transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {trip.region || "Destination"}
            </p>
            <h1
              className={`mt-4 font-serif text-5xl md:text-7xl lg:text-8xl text-foreground transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {trip.name}
            </h1>
            <p
              className={`mt-4 font-serif text-xl md:text-2xl text-foreground/80 italic transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {trip.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Key Info */}
      <section className="px-6 py-24 md:px-16 lg:px-24 bg-card/30">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-sm text-muted-foreground mb-2">Duration</p>
              <p className="font-serif text-2xl text-foreground">{trip.duration}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Group Size</p>
              <p className="font-serif text-2xl text-foreground">{trip.group_size || "8-12"}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Terrain</p>
              <p className="font-serif text-2xl text-foreground">{trip.terrain || "Mountains"}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Starting from</p>
              <p className="font-serif text-2xl text-foreground">₹{trip.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      {itinerary.length > 0 && (
        <section className="px-6 py-24 md:px-16 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-16">The Journey</h2>

            <div className="space-y-12">
              {itinerary.map((day, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-out ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${100 + index * 50}ms` }}
                >
                  <div className="grid gap-8 md:grid-cols-2 items-center">
                    <div className={index % 2 === 1 ? "md:order-2" : ""}>
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">{day.title}</h3>
                      <div className="space-y-3">
                        {day.content.map((line, idx) => (
                          <p key={idx} className="text-muted-foreground leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className={`bg-card/50 h-64 rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}>
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <p className="text-muted-foreground text-center">{day.title.split(" - ")[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inclusions */}
      <section className="px-6 py-24 md:px-16 lg:px-24 bg-card/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-12">What's Included</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "All accommodation",
              "Breakfast & dinner",
              "Local experiences",
              "Experienced trip lead",
              "Transport included",
              "Scenic routes",
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${100 + index * 50}ms` }}
              >
                <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div
            className={`rounded-lg border border-primary/20 bg-primary/5 p-8 md:p-12 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Ready to wander?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg text-lg">
              Join us on this unforgettable journey and create memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/booking/trip/${trip.id}?date=${selectedDate}`}
                className="inline-block rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
              >
                Reserve your spot
              </Link>
              <Link
                href="/all-trips"
                className="inline-block rounded-lg border border-primary/30 px-8 py-4 font-medium text-primary transition-all duration-300 hover:bg-primary/10"
              >
                Explore other trips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
