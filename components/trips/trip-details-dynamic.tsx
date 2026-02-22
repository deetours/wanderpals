"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import { NotFound } from "next/navigation"
import Link from "next/link"

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
            Maybe it's time to wander somewhere new. After adding trip you're getting this error? Check all trips.
          </p>
          <Link href="/all-trips" className="text-primary hover:text-primary/80 transition-colors">
            ← Back to all trips
          </Link>
        </div>
      </main>
    )
  }

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

      {/* Description */}
      <section className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div
            className={`space-y-6 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed">
              {trip.description}
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
              <p className="font-serif text-xl text-foreground">{trip.duration}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Group Size</p>
              <p className="font-serif text-xl text-foreground">{trip.group_size || "8-12"}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Difficulty</p>
              <p className="font-serif text-xl text-foreground">{trip.terrain || "Moderate"}</p>
            </div>
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="text-sm text-muted-foreground mb-2">Price</p>
              <p className="font-serif text-xl text-foreground">₹{trip.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div
            className={`rounded-lg border border-primary/20 bg-primary/5 p-8 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Ready to wander?</h2>
            <p className="text-muted-foreground mb-8">Join us on this journey and make unforgettable memories.</p>
            <Link
              href={`/booking/trip/${trip.id}?date=${selectedDate}`}
              className="inline-block rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Reserve your spot
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
