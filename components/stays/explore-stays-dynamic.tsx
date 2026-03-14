"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { createClientComponentClient } from '@/lib/supabase-client'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, ChevronDown, ArrowRight } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { StayCard } from './stay-card'
import { StayFilters } from './stay-filters'
import { Footer } from '../ui/footer'
import { Magnetic } from '../ui/magnetic'

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

// Vibe filter pills
const VIBES = [
  { label: "All", value: "all" },
  { label: "Mountains", value: "mountains" },
  { label: "Forest", value: "forest" },
  { label: "Riverside", value: "riverside" },
  { label: "Cultural", value: "cultural" },
  { label: "Remote", value: "remote" },
]

export function ExploreStaysDynamic({ initialStays = [] }: { initialStays?: any[] }) {
  const [stays, setStays] = useState<any[]>(initialStays)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeVibe, setActiveVibe] = useState("all")
  const [staySearch, setStaySearch] = useState("")
  const [filters, setFilters] = useState({
    type: 'all',
    roomType: 'all',
    vibe: 'all',
  })

  const headerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])

  useEffect(() => {
    if (initialStays.length === 0) {
      const client = createClientComponentClient()
      if (client) fetchStays(client)
    }
  }, [initialStays])

  const fetchStays = async (client: any) => {
    setLoading(true)
    try {
      const { data } = await client
        .from('stays')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      setStays(data || [])
    } catch (err) {
      console.error('Fetch stays error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStays = stays.filter((stay) => {
    // Only filter by vibe/type if stay actually has that field set
    if (activeVibe !== "all" && stay.vibe && stay.vibe.toLowerCase() !== activeVibe) return false
    if (filters.type !== 'all' && stay.type && stay.type !== filters.type) return false
    if (filters.roomType !== 'all' && stay.room_type && stay.room_type !== filters.roomType && stay.room_type !== 'both') return false
    if (staySearch && !stay.name?.toLowerCase().includes(staySearch.toLowerCase()) && !stay.location?.toLowerCase().includes(staySearch.toLowerCase())) return false
    return true
  })

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      <div className="noise-overlay grayscale" />

      {/* ── Cinematic Hero ───────────────────────────────────── */}
      <section
        ref={headerRef}
        className="relative flex items-end px-6 pt-48 pb-32 md:px-16 lg:px-24 min-h-[90vh] overflow-hidden"
      >
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale: heroBgScale }} className="absolute inset-0">
            <Image
              src="/hero2.png"
              alt="Stays"
              fill
              className="object-cover opacity-[0.2] blur-2xl"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(230,184,115,0.05),transparent)] pointer-events-none" />

        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative z-10 w-full"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-10 block"
          >
            The Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(3rem,11vw,8rem)] leading-[0.85] text-foreground tracking-tightest"
          >
            Places
            <br />
            <span className="text-foreground/30 italic">to actually belong.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.9 }}
            className="mt-14 font-serif text-xl md:text-2xl text-muted-foreground/50 lowercase italic max-w-xl leading-relaxed"
          >
            You arrive as a guest.
            <br />
            You leave knowing names.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 1.2 }}
            className="mt-14 flex items-center gap-10"
          >
            <div>
              <span className="font-serif text-4xl text-foreground">{stays.length || "4–5"}</span>
              <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mt-1">Properties</p>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div>
              <span className="font-serif text-4xl text-foreground">NE</span>
              <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mt-1">India's finest</p>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div>
              <span className="font-serif text-4xl text-foreground">98%</span>
              <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mt-1">Return rate</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Vibe Filter Pills ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.5 }}
        className="px-6 py-8 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {VIBES.map((vibe) => (
              <button
                key={vibe.value}
                onClick={() => setActiveVibe(vibe.value)}
                className={`flex-shrink-0 px-7 py-3 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 ${
                  activeVibe === vibe.value
                    ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(230,184,115,0.2)]"
                    : "glass text-muted-foreground/40 hover:text-foreground"
                }`}
              >
                {vibe.label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Search & Filter Bar ───────────────────────────────── */}
      <section className="px-6 pb-8 md:px-16 lg:px-24 sticky top-20 z-30">
        <div className="mx-auto max-w-6xl">
          <Magnetic strength={0.08}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: 0.8 }}
              className="group flex items-center glass rounded-full px-8 py-5 shadow-2xl hover:bg-white/[0.03] transition-all duration-500 inner-glow"
            >
              <Search className="w-4 h-4 text-primary/40 mr-6 group-focus-within:text-primary transition-colors flex-shrink-0" />
              <input
                type="text"
                value={staySearch}
                onChange={(e) => setStaySearch(e.target.value)}
                placeholder="Search by name or location..."
                className="w-full bg-transparent font-sans text-xs text-foreground placeholder:text-muted-foreground/20 focus:outline-none tracking-[0.2em] uppercase font-bold"
              />
              <div className="flex items-center gap-4 ml-4 border-l border-white/5 pl-6 flex-shrink-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-muted-foreground/30 hover:text-foreground transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="text-[9px] uppercase tracking-[0.4em] font-bold hidden md:block">Filter</span>
                  <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          </Magnetic>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden mt-4"
              >
                <div className="glass rounded-[2rem] p-10 inner-glow">
                  <StayFilters visible={true} filters={filters} onChange={setFilters} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Stay Grid ─────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-16 lg:px-24 pb-48">
        <div className="mx-auto max-w-[1400px]">

          {/* Results & clear */}
          <motion.div layout className="flex items-center justify-between mb-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={filteredStays.length}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold"
              >
                {loading ? "Seeking sanctuaries…" : `${filteredStays.length} sanctuar${filteredStays.length !== 1 ? "ies" : "y"}${activeVibe !== "all" ? ` in ${activeVibe}` : ""}`}
              </motion.p>
            </AnimatePresence>
            {(staySearch || activeVibe !== "all") && (
              <button
                onClick={() => { setActiveVibe("all"); setStaySearch("") }}
                className="text-[9px] uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors font-bold"
              >
                Clear
              </button>
            )}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div key="loading" className="grid gap-6 md:grid-cols-12 auto-rows-[420px]">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`${i === 0 ? "md:col-span-8" : "md:col-span-4"} rounded-[2.5rem] bg-white/[0.02] animate-pulse`} />
                ))}
              </motion.div>
            ) : filteredStays.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-48 rounded-[3rem] glass inner-glow"
              >
                <p className="font-serif text-4xl text-muted-foreground/20 italic mb-6">No sanctuaries found.</p>
                <button
                  onClick={() => { setFilters({ type: 'all', roomType: 'all', vibe: 'all' }); setActiveVibe("all"); setStaySearch("") }}
                  className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold border border-primary/20 px-10 py-4 rounded-full hover:bg-primary/5 transition-all"
                >
                  Reset Curiosity
                </button>
              </motion.div>
            ) : (
              /* Bento Grid — same editorial rhythm as all-trips */
              <motion.div
                key="grid"
                layout
                className="grid gap-5 md:grid-cols-12 auto-rows-[320px] md:auto-rows-[500px]"
              >
                {filteredStays.map((stay, index) => {
                  const mod = index % 5
                  let gridClass = "md:col-span-4 md:row-span-1"

                  if (mod === 0) gridClass = "md:col-span-8 md:row-span-2"       // large portrait
                  else if (mod === 1) gridClass = "md:col-span-4 md:row-span-1"  // square
                  else if (mod === 2) gridClass = "md:col-span-4 md:row-span-2"  // tall
                  else if (mod === 3) gridClass = "md:col-span-8 md:row-span-1"  // wide
                  else if (mod === 4) gridClass = "md:col-span-4 md:row-span-1"  // square

                  return (
                    <motion.div
                      key={stay.id}
                      layout
                      className={gridClass}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <StayCard stay={stay} index={index} />
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Manifesto Mid-Section ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="px-6 py-48 md:px-16 lg:px-24 border-y border-white/5 text-center"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] text-foreground/20 italic leading-tight">
            Most people stay for a night.
          </p>
          <p className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] text-foreground leading-tight tracking-tightest">
            Some extend.
          </p>
          <div className="h-px w-24 bg-primary/20 mx-auto mt-10" />
          <p className="mt-8 font-serif italic text-xl text-muted-foreground/40 lowercase">
            a few don't leave on time.<br />that's how we know we're doing something right.
          </p>
        </div>
      </motion.section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="px-6 py-48 md:px-16 lg:px-24 text-center"
      >
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-4xl md:text-6xl text-foreground mb-16 tracking-tightest">
            Ready to belong?
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Magnetic>
              <Link
                href="/all-trips"
                className="group relative overflow-hidden px-12 py-5 rounded-full glass inner-glow text-[10px] uppercase tracking-[0.5em] font-bold text-foreground hover:text-primary-foreground transition-all duration-700"
              >
                <span className="relative z-10">Explore journeys</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/booking"
                className="group flex items-center gap-3 text-muted-foreground/40 hover:text-foreground transition-colors duration-500"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Book a stay</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-700" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </motion.section>

      <Footer />
    </main>
  )
}
