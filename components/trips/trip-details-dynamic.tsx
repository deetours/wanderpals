"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import Link from "next/link"
import {
  Check, Calendar, Users, Mountain, CreditCard,
  AlertTriangle, FileText, MinusCircle, ShieldCheck,
  Backpack, Thermometer, MapPin, ChevronRight
} from "lucide-react"
import { Footer } from "../ui/footer"

interface TripDetailsDynamicProps {
  tripId: string
}

// ─── Tab types ───
type InfoTab = "inclusions" | "exclusions" | "terms" | "carry" | "altitude"

// ─── Day Images Mapping ───
const DAY_IMAGES_MAP: Record<string, string[]> = {
  "Jaisalmer - Longewala Desert Adventure": ["/jai1.png", "/jai2.png", "/jai3.png"],
}

const TAB_META: Record<InfoTab, { label: string; icon: React.ReactNode }> = {
  inclusions: { label: "Inclusions", icon: <Check className="h-4 w-4" /> },
  exclusions: { label: "Exclusions", icon: <MinusCircle className="h-4 w-4" /> },
  terms: { label: "Terms & Conditions", icon: <ShieldCheck className="h-4 w-4" /> },
  carry: { label: "Things to Carry", icon: <Backpack className="h-4 w-4" /> },
  altitude: { label: "Altitude & Weather", icon: <Thermometer className="h-4 w-4" /> },
}

export function TripDetailsDynamic({ tripId }: TripDetailsDynamicProps) {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(0)
  const [activeTab, setActiveTab] = useState<InfoTab>("inclusions")

  useEffect(() => { setMounted(true) }, [])

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

        if (error || !data) { setTrip(null); return }
        setTrip(data)
      } catch (error) {
        console.error("Error fetching trip:", error)
        setTrip(null)
      } finally {
        setLoading(false)
      }
    }
    if (mounted) fetchTrip()
  }, [tripId, mounted])

  // ─── Loading ───
  if (loading) {
    return (
      <main className="grain min-h-screen bg-background">
        <Navbar visible={true} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground font-serif text-lg">Loading trip details…</p>
          </div>
        </div>
      </main>
    )
  }

  // ─── Not Found ───
  if (!trip) {
    return (
      <main className="grain min-h-screen bg-background">
        <Navbar visible={true} />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-lg">
            Maybe it&apos;s time to wander somewhere new.
          </p>
          <Link href="/all-trips" className="text-primary hover:text-primary/80 transition-colors">
            ← Back to all trips
          </Link>
        </div>
      </main>
    )
  }

  // ───────────────────────────────────────────────────────────
  //  PARSER — Extracts structured sections from the description
  // ───────────────────────────────────────────────────────────
  const parse = (description: string) => {
    const result = {
      itinerary: [] as { title: string; content: string[] }[],
      inclusions: [] as string[],
      exclusions: [] as string[],
      terms: [] as string[],
      carry: [] as string[],
      altitude: [] as string[],
      why: "",
    }

    if (!description) return result

    const normalized = description.replace(/<br\s*\/?>/gi, "\n").split(/[\n\r]+/)
    const lines = normalized.map(l => l.trim()).filter(Boolean)

    // Section header detectors (order matters — check specific first)
    const sectionHeaders: { key: keyof typeof result; pattern: RegExp }[] = [
      { key: "terms", pattern: /^TERMS\s*[&]\s*CONDITIONS/i },
      { key: "inclusions", pattern: /^INCLUSIONS?\s*[:—-]?/i },
      { key: "exclusions", pattern: /^EXCLUSIONS?\s*[:—-]?/i },
      { key: "carry", pattern: /^THINGS\s+TO\s+CARRY\s*[:—-]?/i },
      { key: "altitude", pattern: /^(ALTITUDE|WEATHER|BEST\s+TIME)\s*[:&—-]?/i },
    ]

    let currentSection: string = "none"

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // ── Check if this line is a DAY header ──
      const dayMatch = line.match(/^DAY\s+(\d+)\s*[-–—:]?\s*(.*)$/i)
      if (dayMatch) {
        currentSection = "itinerary"
        const dayNum = dayMatch[1]
        const dayTitle = dayMatch[2] || "Journey"
        const content: string[] = []

        let j = i + 1
        while (j < lines.length) {
          const next = lines[j]
          // Stop when we hit another DAY header OR any known section header
          if (next.match(/^DAY\s+\d+/i)) break
          let hitSection = false
          for (const sh of sectionHeaders) {
            if (sh.pattern.test(next)) { hitSection = true; break }
          }
          if (hitSection) break
          content.push(next)
          j++
        }
        result.itinerary.push({
          title: `Day ${dayNum} — ${dayTitle}`,
          content: content.length > 0 ? content : ["Exploring the unknown."],
        })
        i = j - 1
        continue
      }

      // ── Check if this line is a section header ──
      let matched = false
      for (const sh of sectionHeaders) {
        if (sh.pattern.test(line)) {
          currentSection = sh.key
          matched = true
          break
        }
      }
      if (matched) continue

      // ── Collect content into correct bucket ──
      const cleanLine = line.replace(/^[-•–]\s*/, "").trim()
      if (!cleanLine || cleanLine.length < 3) continue

      if (currentSection === "none" && !result.why && line.length > 40 && i < 5) {
        result.why = line
      } else if (currentSection !== "none" && currentSection !== "itinerary") {
        const arr = result[currentSection as keyof typeof result]
        if (Array.isArray(arr)) {
          arr.push(cleanLine)
        }
      }
    }

    return result
  }

  const data = parse(trip.description || "")

  // Set default active tab to first non-empty one
  const availableTabs = (Object.keys(TAB_META) as InfoTab[]).filter(
    (tab) => data[tab] && data[tab].length > 0
  )

  // ─── Icon for each tab item ───
  const getTabIcon = (tab: InfoTab) => {
    switch (tab) {
      case "inclusions": return <Check className="h-4 w-4 text-emerald-400/70 mt-0.5 shrink-0" />
      case "exclusions": return <AlertTriangle className="h-4 w-4 text-orange-400/70 mt-0.5 shrink-0" />
      case "terms": return <FileText className="h-4 w-4 text-primary/40 mt-0.5 shrink-0" />
      case "carry": return <Backpack className="h-4 w-4 text-sky-400/70 mt-0.5 shrink-0" />
      case "altitude": return <Thermometer className="h-4 w-4 text-violet-400/70 mt-0.5 shrink-0" />
    }
  }

  const getTabAccent = (tab: InfoTab) => {
    switch (tab) {
      case "inclusions": return "border-emerald-500/10 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]"
      case "exclusions": return "border-orange-500/10 bg-orange-500/[0.03] hover:bg-orange-500/[0.06]"
      case "terms": return "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
      case "carry": return "border-sky-500/10 bg-sky-500/[0.03] hover:bg-sky-500/[0.06]"
      case "altitude": return "border-violet-500/10 bg-violet-500/[0.03] hover:bg-violet-500/[0.06]"
    }
  }

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* ═══ HERO ═══ */}
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
              {trip.region || "Wanderpals"} · Journey
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

      {/* ═══ VISION ═══ */}
      {data.why && (
        <section className="px-6 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className={`font-serif text-2xl md:text-3xl text-foreground leading-relaxed transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {data.why}
            </p>
          </div>
        </section>
      )}

      {/* ═══ KEY INFO CARDS ═══ */}
      <section className="px-6 py-24 md:px-16 lg:px-24 bg-card/10 border-y border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-4">
            {[
              { label: "Duration", value: `${trip.duration} Days`, icon: <Calendar className="h-4 w-4" /> },
              { label: "Group Size", value: `${trip.max_group_size || "8–10"} Max`, icon: <Users className="h-4 w-4" /> },
              { label: "Terrain", value: trip.terrain || "Mountains", icon: <Mountain className="h-4 w-4" /> },
              { label: "Cost", value: `₹${trip.price?.toLocaleString()}`, icon: <CreditCard className="h-4 w-4" /> },
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

      {/* ═══ ITINERARY ═══ */}
      {data.itinerary.length > 0 && (
        <section className="px-6 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px w-12 bg-primary/40" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">The Journey</h2>
            </div>

            <div className="space-y-24">
              {data.itinerary.map((day, index) => (
                <div
                  key={index}
                  className={`grid gap-12 md:grid-cols-2 items-start transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-3 font-bold">
                      ACT {index + 1}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-8 leading-tight">{day.title}</h3>
                    <div className="space-y-3">
                      {day.content.map((line, idx) => (
                        <p key={idx} className="text-muted-foreground/80 leading-relaxed text-lg flex items-start gap-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/30 mt-2.5 shrink-0" />
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-card/20 border border-white/5 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    {DAY_IMAGES_MAP[trip.name]?.[index] ? (
                      <img
                        src={DAY_IMAGES_MAP[trip.name][index]}
                        alt={day.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center gap-2">
                          <MapPin className="h-8 w-8 text-primary/10" />
                          <span className="font-serif text-6xl opacity-[0.04] select-none uppercase tracking-tighter">
                            {day.title.split("—")[0]?.trim()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TABBED DETAILS — Inclusions / Exclusions / Terms / Things to Carry / Altitude ═══ */}
      {availableTabs.length > 0 && (
        <section className="px-6 py-32 md:px-16 lg:px-24 bg-card/10 border-y border-white/5">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-12 bg-primary/40" />
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">Trip Details</h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2 mb-12">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-white/[0.03] border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
                    }
                  `}
                >
                  {TAB_META[tab].icon}
                  {TAB_META[tab].label}
                  <span className="ml-1 text-xs opacity-50">
                    ({data[tab].length})
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              <div className="grid gap-3 md:grid-cols-2">
                {data[activeTab].map((item, i) => (
                  <div
                    key={`${activeTab}-${i}`}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${getTabAccent(activeTab)}`}
                    style={{
                      animationDelay: `${i * 30}ms`,
                      animation: "fadeInUp 0.4s ease-out both",
                    }}
                  >
                    {getTabIcon(activeTab)}
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
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

      {/* ═══ CSS Animation ═══ */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Footer />
    </main>
  )
}
