"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import Link from "next/link"
import { Check, Calendar, Users, Mountain, CreditCard, XCircle, AlertTriangle, FileText, MinusCircle, ShieldCheck } from "lucide-react"
import { Footer } from "../ui/footer"

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

  // Parse description for itinerary days and other sections
  const parseDetailedSections = (description: string) => {
    const sections: {
      itinerary: { title: string; content: string[] }[],
      terms: string[],
      exclusions: string[],
      why: string
    } = {
      itinerary: [],
      terms: [],
      exclusions: [],
      why: ""
    }

    if (!description) return sections

    // Normalize
    const normalized = description.replace(/<br\s*\/?>/gi, "\n").split(/[\n\r]+/)
    const lines = normalized.filter((line) => line.trim())

    let currentSection: 'none' | 'itinerary' | 'terms' | 'exclusions' | 'why' = 'none'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detection
      const dayMatch = line.match(/^DAY\s+(\d+|0)\s*[-–]?\s*(.*)$/i)
      const termsMatch = line.match(/^TERMS\s*&\s*CONDITIONS/i)
      const exclusionsMatch = line.match(/^EXCLUSIONS/i)

      if (dayMatch) {
        currentSection = 'itinerary'
        const dayNum = dayMatch[1]
        const dayTitle = dayMatch[2] || "Journey"
        const content: string[] = []

        let j = i + 1
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (nextLine.match(/^DAY\s+(\d+|0)/i) || nextLine.match(/^(TERMS|EXCLUSIONS):/i)) break
          content.push(nextLine)
          j++
        }
        sections.itinerary.push({
          title: `Day ${dayNum} — ${dayTitle}`,
          content: content.length > 0 ? content : ["Exploring new horizons."]
        })
        i = j - 1
        continue
      }

      if (termsMatch) {
        currentSection = 'terms'
        continue
      }

      if (exclusionsMatch) {
        currentSection = 'exclusions'
        continue
      }

      // Parsing content based on section
      if (line.startsWith('•')) {
        const clean = line.replace('•', '').trim()
        if (currentSection === 'terms') sections.terms.push(clean)
        else if (currentSection === 'exclusions') sections.exclusions.push(clean)
      } else if (i < 5 && !sections.why && line.length > 50) {
        // Assume first long paragraph is the "why"
        sections.why = line
      } else if (currentSection === 'terms') segments_push(sections.terms, line)
      else if (currentSection === 'exclusions') segments_push(sections.exclusions, line)
    }

    return sections
  }

  function segments_push(arr: string[], line: string) {
    if (line.length > 5) arr.push(line)
  }

  const sections = parseDetailedSections(trip.description || "")


  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* ACT 1: Hero & Vision */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${trip.image_url || "/placeholder.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-5xl">
            <p
              className={`text-sm uppercase tracking-widest text-primary font-medium transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              {trip.region || "Deep Wander"}JOURNEY
            </p>
            <h1
              className={`mt-4 font-serif text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: "100ms" }}
            >
              {trip.name}
            </h1>
            <p
              className={`mt-8 font-serif text-xl md:text-2xl text-foreground/80 italic max-w-2xl transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: "200ms" }}
            >
              {trip.tagline || "Where shared journeys become lasting stories."}
            </p>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      {sections.why && (
        <section className="px-6 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className={`font-serif text-2xl md:text-3xl text-foreground leading-relaxed transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {sections.why}
            </p>
          </div>
        </section>
      )}

      {/* ACT 2: Key Info Cards */}
      <section className="px-6 py-24 md:px-16 lg:px-24 bg-card/10 border-y border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-4">
            {[
              { label: "Duration", value: `${trip.duration} Days`, icon: <Calendar className="h-4 w-4" /> },
              { label: "Group Size", value: "8–10 Max", icon: <Users className="h-4 w-4" /> },
              { label: "Terrain", value: trip.terrain || "Mountains", icon: <Mountain className="h-4 w-4" /> },
              { label: "Cost", value: `₹${trip.price?.toLocaleString()}`, icon: <CreditCard className="h-4 w-4" /> }
            ].map((stat, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-2 text-primary mb-3">
                  {stat.icon}
                  <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">{stat.label}</span>
                </div>
                <p className="font-serif text-3xl text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT 3: The Flow (Itinerary) */}
      {sections.itinerary.length > 0 && (
        <section className="px-6 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px w-12 bg-primary/40" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">The Narrative</h2>
            </div>

            <div className="space-y-32">
              {sections.itinerary.map((day, index) => (
                <div
                  key={index}
                  className={`grid gap-12 md:grid-cols-2 items-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-3 font-bold">ACT {index + 1}</p>
                    <h3 className="font-serif text-3xl md:text-5xl text-foreground mb-8 leading-tight">{day.title}</h3>
                    <div className="space-y-4">
                      {day.content.map((line, idx) => (
                        <p key={idx} className="text-muted-foreground/80 leading-relaxed text-lg flex items-start gap-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/30 mt-2.5 shrink-0" />
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-card/20 border border-white/5 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    {/* Dynamic image placeholder - could be enhanced if data had act images */}
                    <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                      <span className="font-serif text-7xl opacity-[0.03] select-none uppercase tracking-tighter">Day {index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ACT 4: Terms & Legal (Structured Premium UI) */}
      {(sections.terms.length > 0 || sections.exclusions.length > 0) && (
        <section className="px-6 py-32 md:px-16 lg:px-24 bg-card/10 border-y border-white/5">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 md:grid-cols-2">
              {/* Terms */}
              {sections.terms.length > 0 && (
                <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h3 className="font-serif text-3xl text-foreground">Mandatories</h3>
                  </div>
                  <ul className="space-y-4">
                    {sections.terms.map((term, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <FileText className="h-4 w-4 text-primary/40 mt-1 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{term}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {sections.exclusions.length > 0 && (
                <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="flex items-center gap-3 mb-8">
                    <MinusCircle className="h-6 w-6 text-primary" />
                    <h3 className="font-serif text-3xl text-foreground">Exclusions</h3>
                  </div>
                  <ul className="space-y-4">
                    {sections.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-primary/5 hover:bg-primary/10 transition-colors">
                        <AlertTriangle className="h-4 w-4 text-primary/40 mt-1 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* JOIN CTA */}
      <section className="px-6 py-40 md:px-16 lg:px-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div
            className={`rounded-3xl border border-primary/20 bg-primary/5 p-12 md:p-20 transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 leading-tight">Begin the story?</h2>
            <p className="text-muted-foreground/70 mb-12 max-w-lg mx-auto text-xl leading-relaxed">
              Every trip is a collection of moments waiting to be shared. Claim your spot in the next chapter.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href={`/booking/trip/${trip.id}?date=${selectedDate}`}
                className="group inline-flex items-center justify-center rounded-full bg-primary px-12 py-5 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                Join the Tribe
              </Link>
              <Link
                href="/all-trips"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 px-12 py-5 font-medium text-primary transition-all duration-300 hover:bg-primary/5"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
