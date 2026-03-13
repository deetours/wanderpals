"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { createClientComponentClient } from '@/lib/supabase-client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, ChevronDown } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { StayCard } from './stay-card'
import { StayFilters } from './stay-filters'
import { Footer } from '../ui/footer'
import { Magnetic } from '../ui/magnetic'

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function ExploreStaysDynamic({ initialStays = [] }: { initialStays?: any[] }) {
  const [stays, setStays] = useState<any[]>(initialStays)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    roomType: 'all',
    vibe: 'all',
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
        .order('created_at', { ascending: false })
      setStays(data || [])
    } catch (err) {
      console.error('Fetch stays error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStays = stays.filter((stay) => {
    if (filters.type !== 'all' && stay.type !== filters.type) return false
    if (filters.roomType !== 'all' && stay.room_type !== filters.roomType && stay.room_type !== 'both') return false
    if (filters.vibe !== 'all' && stay.vibe !== filters.vibe) return false
    return true
  })

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      
      {/* Decorative Grain Overlay */}
      <div className="noise-overlay grayscale" />

      {/* Cinematic Header Section */}
      <section ref={headerRef} className="relative px-6 pt-56 pb-20 md:px-16 lg:px-24 overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Depth */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero2.png" 
            alt="Stays Background" 
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
            The Collection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(2.5rem,10vw,7.5rem)] leading-[0.85] text-foreground tracking-tightest"
          >
            Places <br />
            <span className="text-foreground/40 italic">to actually belong.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.8 }}
            className="mt-12 font-serif text-2xl md:text-3xl text-muted-foreground/60 lowercase italic max-w-2xl leading-relaxed"
          >
            You arrive as a guest. You leave knowing names. <br className="hidden md:block" /> Across mountains, coasts, and cities in India.
          </motion.p>
        </motion.div>
      </section>

      {/* Discovery Filters - Magnetic & Glassmorphic */}
      <section className="px-6 py-12 md:px-16 lg:px-24 sticky top-0 z-40">
        <div className="mx-auto max-w-5xl">
            <Magnetic strength={0.05}>
                <div className="glass rounded-full px-8 py-5 shadow-2xl inner-glow flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Search className="w-5 h-5 text-primary/40" />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/60">Filter your stay</span>
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-3 text-muted-foreground/40 hover:text-foreground transition-all"
                    >
                        <div className={`transition-transform duration-700 ease-apple-ease ${showFilters ? 'rotate-180' : ''}`}>
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </button>
                </div>
            </Magnetic>
            
            <AnimatePresence>
                {showFilters && (
                <motion.div
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden mt-6"
                >
                    <div className="glass rounded-[2rem] p-10 mb-4 inner-glow">
                        <StayFilters visible={true} filters={filters} onChange={setFilters} />
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </section>

      {/* Stay Grid */}
      <section className="px-6 py-12 md:px-16 lg:px-24 pb-48">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="col-span-full text-center py-48">
              <motion.p 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-serif text-2xl text-muted-foreground/40 italic"
              >
                Seeking sanctuaries...
              </motion.p>
            </div>
          ) : filteredStays.length === 0 ? (
            <div className="col-span-full text-center py-48 rounded-[3rem] glass inner-glow">
              <p className="font-serif text-3xl text-muted-foreground/40 italic">No sanctuaries found for these filters.</p>
              <button 
                onClick={() => setFilters({ type: 'all', roomType: 'all', vibe: 'all' })}
                className="mt-8 text-primary uppercase tracking-[0.4em] text-[10px] font-bold border border-primary/20 px-8 py-3 rounded-full hover:bg-primary/5 transition-all"
              >
                Reset Curiosity
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredStays.map((stay, index) => (
                <motion.div
                  key={stay.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: index * 0.1 }}
                >
                  <StayCard stay={stay} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mid-Grid Pause / Narrative */}
      <section className="px-6 py-48 md:px-16 lg:px-24 border-y border-white/5 bg-fixed" style={{ backgroundImage: "radial-gradient(circle at 10% 10%, rgba(230, 184, 115, 0.02) 0%, transparent 50%)" }}>
        <div className="mx-auto max-w-2xl text-center space-y-12">
            <span className="text-[10px] uppercase tracking-[0.6em] text-primary/40 font-bold block mb-4">The Depth</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight tracking-tightest italic">
                Most people stay for a night. <br />
                <span className="text-foreground/30">Some extend.</span>
            </h2>
            <div className="h-px w-24 bg-primary/20 mx-auto" />
            <p className="font-serif text-xl text-muted-foreground/60 leading-relaxed italic">
                A few don't leave on time. <br />
                That's how we know we're doing something right.
            </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-64 md:px-16 lg:px-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-6xl md:text-8xl text-foreground mb-16 tracking-tightest">Follow the path.</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Magnetic>
                <Link
                href="/all-trips"
                className="group relative px-12 py-5 rounded-full glass inner-glow text-foreground hover:text-primary transition-all duration-700 overflow-hidden"
                >
                <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold">Explore journeys</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-apple-ease" />
                </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

