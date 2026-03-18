"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import Link from "next/link"
import {
  Check, Calendar, Users, Mountain, CreditCard,
  AlertTriangle, FileText, MinusCircle, ShieldCheck,
  Backpack, Thermometer, MapPin, ChevronRight, ArrowDown
} from "lucide-react"
import { Footer } from "../ui/footer"
import { Magnetic } from "../ui/magnetic"

interface TripDetailsDynamicProps {
  tripId: string
  initialTrip?: any
}

const transition = {
  duration: 1,
  ease: [0.23, 1, 0.32, 1] as any,
}

// ─── Tab types ───
type InfoTab = "inclusions" | "exclusions" | "terms" | "carry" | "altitude"

const TAB_META: Record<InfoTab, { label: string; icon: React.ReactNode }> = {
  inclusions: { label: "Inclusions", icon: <Check className="h-4 w-4" /> },
  exclusions: { label: "Exclusions", icon: <MinusCircle className="h-4 w-4" /> },
  terms: { label: "Terms & Conditions", icon: <ShieldCheck className="h-4 w-4" /> },
  carry: { label: "Things to Carry", icon: <Backpack className="h-4 w-4" /> },
  altitude: { label: "Altitude & Weather", icon: <Thermometer className="h-4 w-4" /> },
}

export function TripDetailsDynamic({ tripId, initialTrip }: TripDetailsDynamicProps) {
  const [trip, setTrip] = useState<any>(initialTrip)
  const [loading, setLoading] = useState(!initialTrip)
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(0)
  const [activeTab, setActiveTab] = useState<InfoTab>("inclusions")
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    setMounted(true)
    if (!initialTrip) {
      const fetchTrip = async () => {
        setLoading(true)
        try {
          const supabase = createClientComponentClient()
          if (!supabase) return
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
      fetchTrip()
    }
  }, [tripId, initialTrip])

  if (loading) {
    return (
      <main className="grain min-h-screen bg-background text-foreground/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full" 
          />
          <p className="font-serif italic text-lg tracking-wide">Gathering the details...</p>
        </div>
      </main>
    )
  }

  if (!trip) {
    return (
      <main className="grain min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-5xl text-foreground mb-6 tracking-tighter">Vanished in the Dust</h1>
        <p className="text-muted-foreground mb-12 max-w-lg font-serif italic text-xl">
          The trail you seek has been reclaimed by the wild.
        </p>
        <Link href="/all-trips" className="text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.3em] text-xs font-bold">
          Back to the trailhead
        </Link>
      </main>
    )
  }

  // ───────────────────────────────────────────────────────────
  //  PARSER
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
      const dayMatch = line.match(/^DAY\s+(\d+)\s*[-–—:]?\s*(.*)$/i)
      if (dayMatch) {
        currentSection = "itinerary"
        const dayNum = dayMatch[1]
        const dayTitle = dayMatch[2] || "Journey"
        const content: string[] = []
        let j = i + 1
        while (j < lines.length) {
          const next = lines[j]
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
          title: `Day ${dayNum}: ${dayTitle}`,
          content: content.length > 0 ? content : ["Exploring the unknown."],
        })
        i = j - 1
        continue
      }

      let matched = false
      for (const sh of sectionHeaders) {
        if (sh.pattern.test(line)) {
          currentSection = sh.key
          matched = true
          break
        }
      }
      if (matched) continue

      const cleanLine = line.replace(/^[-•–]\s*/, "").trim()
      if (!cleanLine || cleanLine.length < 3) continue

      if (currentSection === "none" && !result.why && line.length > 40 && i < 5) {
        result.why = line
      } else if (currentSection !== "none" && currentSection !== "itinerary") {
        const arr = result[currentSection as keyof typeof result]
        if (Array.isArray(arr)) {
          ; (arr as string[]).push(cleanLine)
        }
      }
    }
    return result
  }

  const data = parse(trip.description || "")
  const availableTabs = (Object.keys(TAB_META) as InfoTab[]).filter(
    (tab) => data[tab] && data[tab].length > 0
  )

  const getCustomDayImage = (index: number) => {
    if (trip.name?.includes("Jaisalmer")) {
      const jaisalmerImages = ["/jai0.png", "/jai1.png", "/jai2.png", "/jai3.png"]
      return jaisalmerImages[index] || null
    }
    return null
  }

  return (
    <main ref={containerRef} className="grain min-h-screen bg-background relative selection:bg-primary/30">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar visible={true} />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
          style={{ backgroundImage: `url('${trip.image_url || "/placeholder.jpg"}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-24 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
            >
              <span className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
                {trip.duration} Days · {trip.region || "The Unknown"}
              </span>
              <h1 className="mt-6 font-serif text-[clamp(2.5rem,10vw,7rem)] leading-[0.9] text-foreground tracking-tighter">
                {trip.name}
              </h1>
              <p className="mt-8 font-serif text-xl md:text-3xl text-foreground/70 lowercase italic max-w-2xl">
                {trip.tagline || "Where shared journeys become lasting stories."}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">The Narrative</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ACT 1: The Soul */}
      {data.why && (
        <section className="px-6 py-64 md:px-16 lg:px-24 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={transition}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.2] tracking-tight">
              {data.why}
            </h2>
          </motion.div>
        </section>
      )}

      {/* ACT 2: Elevation Timeline */}
      <section className="py-32 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 md:block hidden" />
        <div className="space-y-64">
          {data.itinerary.map((day, index) => (
            <div key={index} className="relative px-6 md:px-16 lg:px-24">
              <div className="grid md:grid-cols-12 items-center gap-16 md:gap-24">
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={transition}
                  className={`md:col-span-5 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2 md:text-right'}`}
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-primary/60 font-medium mb-4 block">
                    Phase {index + 1}
                  </span>
                  <h3 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight leading-[1.1]">
                    {day.title}
                  </h3>
                  <div className="mt-8 space-y-4">
                    {day.content.map((line, idx) => (
                      <p key={idx} className="text-xl text-muted-foreground leading-relaxed font-serif italic lowercase">
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 1.1, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ ...transition, duration: 1.5 }}
                  className={`md:col-span-7 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] glass inner-glow group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 2 }}
                      className="absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
                      style={{ 
                        backgroundImage: `url('${getCustomDayImage(index) || trip.image_url || "/placeholder.jpg"}')` 
                      }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACT 3: The Common Ground */}
      <section className="px-6 py-64 md:px-16 lg:px-24 text-center border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mx-auto max-w-3xl"
        >
          <Users className="h-10 w-10 text-primary mx-auto mb-10 opacity-50" />
          <p className="font-serif text-3xl md:text-5xl text-foreground tracking-tight">
            Designed for curious souls.
          </p>
          <p className="mt-8 text-muted-foreground font-serif text-xl italic lowercase">
            Max group size: {trip.group_size || "10–12"} participants.
          </p>
        </motion.div>
      </section>

      {/* ACT 4: Dossier Application */}
      <section className="px-6 py-32 md:px-16 lg:px-24 pb-64 bg-black/20">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="rounded-[2.5rem] glass inner-glow p-10 md:p-16 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale" style={{ backgroundImage: "url('/noise.png')" }} />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <h3 className="font-serif text-4xl md:text-5xl text-foreground">The Dossier</h3>
                  <p className="mt-2 text-muted-foreground font-serif italic text-lg lowercase">Practical intelligence.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 mb-2">Contribution</p>
                  <p className="font-serif text-5xl text-foreground">₹{trip.price?.toLocaleString()}</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
                {[
                  { label: "Duration", value: `${trip.duration} Days` },
                  { label: "Terrain", value: trip.terrain || "Mountains" },
                  { label: "Intensity", value: "Moderate" },
                  { label: "Group", value: `${trip.group_size || "12"} Max` },
                ].map((spec, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-medium">{spec.label}</p>
                    <p className="font-serif text-2xl text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              {availableTabs.length > 0 && (
                <div className="space-y-12 mb-20">
                  <div className="flex flex-wrap gap-2">
                    {availableTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          activeTab === tab
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-white/[0.03] border border-white/10 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {TAB_META[tab].icon}
                        {TAB_META[tab].label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-3 md:grid-cols-2"
                    >
                      {data[activeTab].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* CTA */}
              <Link href={`/booking/trip/${trip.id}?date=${selectedDate}`}>
                <Magnetic strength={0.2}>
                  <div className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-6 text-center shadow-2xl transition-all hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                    <span className="relative z-10 font-sans text-xs uppercase tracking-[0.5em] font-bold text-primary-foreground">
                      Begin Your Application
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                </Magnetic>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
