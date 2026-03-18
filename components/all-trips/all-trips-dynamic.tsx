"use client"

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { createClientComponentClient } from '@/lib/supabase-client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Search } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { TripGridCard } from './trip-grid-card'
import { TripFilters } from './trip-filters'
import { Footer } from '../ui/footer'
import { Magnetic } from '../ui/magnetic'

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function AllTripsDynamic({ initialTrips = [] }: { initialTrips?: any[] }) {
  const [trips, setTrips] = useState<any[]>(initialTrips)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [moodSearch, setMoodSearch] = useState('')
  const [filters, setFilters] = useState({
    region: 'all',
    terrain: 'all',
    duration: 'all',
  })
  const [mounted, setMounted] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
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
  }, [trips, filters, moodSearch])

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      
      {/* Decorative Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] grayscale" style={{ backgroundImage: "url('/noise.png')" }} />

      {/* Cinematic Header Section */}
      <section ref={headerRef} className="relative px-6 pt-56 pb-20 md:px-16 lg:px-24 overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Depth */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero1.png" 
            alt="Catalog Background" 
            fill 
            className="object-cover opacity-20 blur-2xl scale-110" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-8 block"
          >
            The Catalog
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(2.5rem,10vw,7.5rem)] leading-[0.85] text-foreground tracking-tightest"
          >
            Every journey <br />
            <span className="text-foreground/40 italic">we currently run.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.8 }}
            className="mt-12 font-serif text-2xl md:text-3xl text-muted-foreground/60 lowercase italic max-w-2xl leading-relaxed"
          >
            Different places. same pace. A collection of moments <br className="hidden md:block" /> waiting for the right souls.
          </motion.p>
        </motion.div>
      </section>

      {/* Discovery Bar - Magnetic & Glassmorphic */}
      <section className="px-6 py-12 md:px-16 lg:px-24 sticky top-0 z-40">
        <div className="mx-auto max-w-5xl">
          <Magnetic strength={0.1}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...transition, delay: 1 }}
                className="group relative flex items-center glass rounded-full px-8 py-5 shadow-2xl hover:bg-white/[0.03] transition-all duration-500 inner-glow"
            >
                <Search className="w-5 h-5 text-primary/40 mr-6 group-focus-within:text-primary transition-colors" />
                <input
                type="text"
                value={moodSearch}
                onChange={(e) => setMoodSearch(e.target.value)}
                placeholder="Filter by terrain, vibe, or destination..."
                className="w-full bg-transparent font-sans text-xs md:text-sm text-foreground placeholder:text-muted-foreground/20 focus:outline-none tracking-[0.3em] uppercase font-bold"
                />
                <div className="flex items-center gap-6 ml-4 border-l border-white/5 pl-6">
                <button
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="flex items-center gap-3 text-muted-foreground/40 hover:text-foreground transition-all"
                >
                    <div className={`transition-transform duration-700 ease-apple-ease ${filtersExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                    </div>
                </button>
                </div>
            </motion.div>
          </Magnetic>

          <AnimatePresence>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden mt-6"
              >
                <div className="glass rounded-[2rem] p-10 mb-4 inner-glow">
                  <TripFilters activeFilters={filters} onFilterChange={setFilters} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bento Discovery Grid */}
      <section className="px-6 py-24 md:px-16 lg:px-24 pb-48">
        <div className="mx-auto max-w-[1400px]">
          <AnimatePresence mode="popLayout">
            {filteredTrips.length === 0 ? (
                <motion.div 
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-48 rounded-[3rem] glass inner-glow"
                >
                <p className="font-serif text-3xl text-muted-foreground/40 italic">No journeys matched your vibe.</p>
                <button 
                    onClick={() => { setFilters({ region: 'all', terrain: 'all', duration: 'all' }); setMoodSearch('') }}
                    className="mt-8 text-primary uppercase tracking-[0.4em] text-[10px] font-bold border border-primary/20 px-8 py-3 rounded-full hover:bg-primary/5 transition-all"
                >
                    Reset Curiosity
                </button>
                </motion.div>
            ) : (
                <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid gap-6 md:grid-cols-12 auto-rows-[300px] md:auto-rows-[450px]"
                >
                {filteredTrips.map((trip, index) => {
                    const mod = index % 6;
                    let gridClass = "md:col-span-4 md:row-span-1";
                    let featured = false;

                    if (mod === 0) { gridClass = "md:col-span-8 md:row-span-2"; featured = true; }
                    else if (mod === 1) { gridClass = "md:col-span-4 md:row-span-1"; }
                    else if (mod === 2) { gridClass = "md:col-span-4 md:row-span-2"; }
                    else if (mod === 3) { gridClass = "md:col-span-4 md:row-span-1"; }
                    else if (mod === 4) { gridClass = "md:col-span-8 md:row-span-1"; }
                    else if (mod === 5) { gridClass = "md:col-span-4 md:row-span-1"; }
                    
                    const mappedTrip = {
                    ...trip,
                    name: trip.name || trip.title,
                    image: trip.image_url || trip.image || "/placeholder.jpg",
                    groupSize: trip.group_size || "8-10"
                    };

                    return (
                    <motion.div 
                        key={trip.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: index * 0.05 }}
                        className={`${gridClass}`}
                    >
                        <TripGridCard trip={mappedTrip} index={index} featured={featured} />
                    </motion.div>
                    );
                })}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  )
}

