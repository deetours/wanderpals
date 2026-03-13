"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { TripGridCard } from './trip-grid-card'
import { TripFilters } from './trip-filters'
import { Footer } from '../ui/footer'
import { Magnetic } from '../ui/magnetic'

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

// Mood-based terrain filter pills
const MOODS = [
  { label: "All Journeys", value: "all" },
  { label: "Mountains", value: "mountains" },
  { label: "Coastal", value: "coastal" },
  { label: "Desert", value: "desert" },
  { label: "Forest", value: "forest" },
  { label: "Cultural", value: "cultural" },
]

export function AllTripsDynamic({ initialTrips = [] }: { initialTrips?: any[] }) {
  const [trips, setTrips] = useState<any[]>(initialTrips)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [moodSearch, setMoodSearch] = useState('')
  const [activeMood, setActiveMood] = useState('all')
  const [filters, setFilters] = useState({
    region: 'all',
    terrain: 'all',
    duration: 'all',
  })

  const headerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (activeMood !== 'all' && trip.terrain?.toLowerCase() !== activeMood) return false
      if (filters.region !== 'all' && trip.region !== filters.region) return false
      if (filters.terrain !== 'all' && trip.terrain !== filters.terrain) return false
      if (filters.duration !== 'all') {
        const days = Number.parseInt(trip.duration?.toString() || '0')
        if (filters.duration === 'short' && days > 7) return false
        if (filters.duration === 'long' && days <= 7) return false
      }
      if (moodSearch && !trip.name?.toLowerCase().includes(moodSearch.toLowerCase())) return false
      return true
    })
  }, [trips, filters, moodSearch, activeMood])

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      <div className="noise-overlay grayscale" />

      {/* ── Cinematic Hero Header ────────────────────────────── */}
      <section
        ref={headerRef}
        className="relative flex items-end px-6 pt-48 pb-24 md:px-16 lg:px-24 overflow-hidden min-h-[85vh]"
      >
        {/* Parallax background — independent scale */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale: heroBgScale }} className="absolute inset-0">
            <Image
              src="/hero1.png"
              alt="Journeys Background"
              fill
              className="object-cover opacity-[0.18] blur-2xl"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
        </div>

        {/* Radial accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_80%,rgba(230,184,115,0.04),transparent)] pointer-events-none" />

        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative z-10 w-full max-w-6xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-10 block"
          >
            The Catalog
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(3rem,11vw,8rem)] leading-[0.85] text-foreground tracking-tightest"
          >
            Every journey
            <br />
            <span className="text-foreground/30 italic">we currently run.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.9 }}
            className="mt-14 font-serif text-xl md:text-2xl text-muted-foreground/50 lowercase italic max-w-xl leading-relaxed"
          >
            Different places. Same pace.
            <br />
            A collection of moments waiting for the right souls.
          </motion.p>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 1.2 }}
            className="mt-14 flex items-center gap-10"
          >
            <div className="flex flex-col">
              <span className="font-serif text-4xl text-foreground">{trips.length}</span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mt-1">
                Active journeys
              </span>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex flex-col">
              <span className="font-serif text-4xl text-foreground">120+</span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mt-1">
                Places in India
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Mood Terrain Selector ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.5 }}
        className="px-6 py-8 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setActiveMood(mood.value)}
                className={`flex-shrink-0 px-7 py-3 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 ${
                  activeMood === mood.value
                    ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(230,184,115,0.2)]"
                    : "glass text-muted-foreground/40 hover:text-foreground hover:border-white/10"
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Discovery Search Bar ───────────────────────────────── */}
      <section className="px-6 pb-8 md:px-16 lg:px-24 sticky top-20 z-30">
        <div className="mx-auto max-w-6xl">
          <Magnetic strength={0.08}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: 0.8 }}
              className="group relative flex items-center glass rounded-full px-8 py-5 shadow-2xl hover:bg-white/[0.03] transition-all duration-500 inner-glow"
            >
              <Search className="w-4 h-4 text-primary/40 mr-6 group-focus-within:text-primary transition-colors flex-shrink-0" />
              <input
                type="text"
                value={moodSearch}
                onChange={(e) => setMoodSearch(e.target.value)}
                placeholder="Search by name, place, or vibe..."
                className="w-full bg-transparent font-sans text-xs text-foreground placeholder:text-muted-foreground/20 focus:outline-none tracking-[0.2em] uppercase font-bold"
              />
              <div className="flex items-center gap-4 ml-4 border-l border-white/5 pl-6 flex-shrink-0">
                <button
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="flex items-center gap-2 text-muted-foreground/30 hover:text-foreground transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="text-[9px] uppercase tracking-[0.4em] font-bold hidden md:block">
                    Filter
                  </span>
                  <motion.div
                    animate={{ rotate: filtersExpanded ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </Magnetic>

          {/* Filter Panel */}
          <AnimatePresence>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden mt-4"
              >
                <div className="glass rounded-[2rem] p-10 inner-glow">
                  <TripFilters activeFilters={filters} onFilterChange={setFilters} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Bento Discovery Grid ───────────────────────────────── */}
      <section className="px-6 py-16 md:px-16 lg:px-24 pb-48">
        <div className="mx-auto max-w-[1400px]">

          {/* Results count */}
          <motion.div layout className="flex items-center justify-between mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={filteredTrips.length}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold"
              >
                {filteredTrips.length} journey{filteredTrips.length !== 1 ? "s" : ""}
                {activeMood !== "all" ? ` in ${activeMood}` : " curated"}
              </motion.p>
            </AnimatePresence>
            {(moodSearch || activeMood !== 'all') && (
              <button
                onClick={() => { setActiveMood('all'); setMoodSearch('') }}
                className="text-[9px] uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors font-bold"
              >
                Clear filters
              </button>
            )}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filteredTrips.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="text-center py-48 rounded-[3rem] glass inner-glow"
              >
                <p className="font-serif text-4xl text-muted-foreground/20 italic mb-6">
                  No journeys matched.
                </p>
                <p className="font-serif italic text-muted-foreground/30 text-xl mb-12 lowercase">
                  try a different vibe, or clear the filter.
                </p>
                <button
                  onClick={() => {
                    setFilters({ region: 'all', terrain: 'all', duration: 'all' })
                    setMoodSearch('')
                    setActiveMood('all')
                  }}
                  className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold border border-primary/20 px-10 py-4 rounded-full hover:bg-primary/5 transition-all"
                >
                  Reset Curiosity
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                layout
                className="grid gap-5 md:grid-cols-12 auto-rows-[320px] md:auto-rows-[480px]"
              >
                {filteredTrips.map((trip, index) => {
                  const mod = index % 6
                  let gridClass = "md:col-span-4 md:row-span-1"
                  let featured = false

                  if (mod === 0) { gridClass = "md:col-span-8 md:row-span-2"; featured = true }
                  else if (mod === 1) { gridClass = "md:col-span-4 md:row-span-1" }
                  else if (mod === 2) { gridClass = "md:col-span-4 md:row-span-2" }
                  else if (mod === 3) { gridClass = "md:col-span-4 md:row-span-1" }
                  else if (mod === 4) { gridClass = "md:col-span-8 md:row-span-1" }
                  else if (mod === 5) { gridClass = "md:col-span-4 md:row-span-1" }

                  const mappedTrip = {
                    ...trip,
                    name: trip.name || trip.title,
                    image: trip.image_url || trip.image || "/placeholder.jpg",
                    groupSize: trip.group_size || "8-10",
                  }

                  return (
                    <motion.div
                      key={trip.id}
                      layout
                      className={gridClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: (index % 6) * 0.05 }}
                    >
                      <TripGridCard trip={mappedTrip} index={index} featured={featured} />
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Editorial Outro ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="px-6 py-48 md:px-16 lg:px-24 border-t border-white/5 text-center"
      >
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-4xl md:text-5xl text-foreground/30 italic mb-10 leading-tight">
            Can't decide?
          </p>
          <p className="font-serif text-xl text-muted-foreground/40 italic lowercase leading-relaxed mb-16">
            Tell us what you're looking for. We'll match you with the right journey.
          </p>
          <Magnetic>
            <Link
              href="/booking"
              className="inline-flex items-center gap-4 glass px-12 py-5 rounded-full inner-glow text-[10px] uppercase tracking-[0.5em] text-foreground font-bold hover:text-primary transition-colors duration-500 group"
            >
              Talk to us
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:scale-150 transition-transform" />
            </Link>
          </Magnetic>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}
