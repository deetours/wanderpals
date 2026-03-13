"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { Navbar } from "../ui/navbar"
import { JourneyCard } from "./journey-card"
import { Footer } from "../ui/footer"
import { Magnetic } from "../ui/magnetic"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function JourneysPage() {
  const [journeys, setJourneys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const headerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1])

  useEffect(() => {
    fetchFeaturedTrips()
  }, [])

  const fetchFeaturedTrips = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("trips")
        .select("id, name, tagline, duration, image_url, group_size, terrain, price")
        .eq("status", "published")
        .not("name", "is", null)
        .eq("is_featured", true)
        .limit(6)

      if (error) throw error

      const transformedData = (data || []).map((trip: any) => ({
        id: trip.id,
        name: trip.name,
        tagline: trip.tagline,
        duration: trip.duration,
        images: [trip.image_url],
        groupSize: `${trip.group_size}`,
        terrain: trip.terrain,
        price: trip.price,
      }))

      setJourneys(transformedData)
    } catch (error) {
      console.error("Error fetching featured trips:", error)
      setJourneys([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      <div className="noise-overlay grayscale" />

      {/* ── Cinematic Hero ─────────────────────────────────── */}
      <section
        ref={headerRef}
        className="relative flex items-end px-6 pt-48 pb-32 md:px-16 lg:px-24 min-h-[90vh] overflow-hidden"
      >
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale: heroBgScale }} className="absolute inset-0">
            <Image
              src="/hero-campfire-spiti.png"
              alt="Journeys Hero"
              fill
              className="object-cover opacity-[0.15] blur-2xl"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>

        {/* Radial depth glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(230,184,115,0.05),transparent)] pointer-events-none" />

        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative z-10 w-full max-w-5xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-10 block"
          >
            Featured Journeys
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(3rem,11vw,8rem)] leading-[0.85] text-foreground tracking-tightest"
          >
            Journeys for people{" "}
            <br />
            <span className="text-foreground/30 italic">who don't rush places.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.9 }}
            className="mt-14 font-serif text-xl md:text-2xl text-muted-foreground/50 lowercase italic max-w-lg leading-relaxed"
          >
            Small groups. Local routes. Real pace.
          </motion.p>

          {/* Scroll prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-20 flex items-center gap-4"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent"
            />
            <span className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/20 font-bold">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divider line ─────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* ── Journey Cards — Vertical Editorial ─────────────── */}
      <section className="px-6 py-32 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="space-y-40">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid md:grid-cols-12 gap-16 items-center animate-pulse">
                  <div className="md:col-span-7 aspect-[16/10] rounded-[2.5rem] bg-white/[0.02]" />
                  <div className="md:col-span-5 space-y-6">
                    <div className="h-3 bg-white/[0.02] rounded w-1/3" />
                    <div className="h-12 bg-white/[0.02] rounded w-2/3" />
                    <div className="h-4 bg-white/[0.02] rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : journeys.length > 0 ? (
            <div className="space-y-48">
              {journeys.map((journey, index) => (
                <JourneyCard key={journey.id} journey={journey} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-48 rounded-[3rem] glass inner-glow"
            >
              <p className="font-serif text-4xl text-muted-foreground/20 italic mb-6">
                No featured journeys right now.
              </p>
              <p className="font-serif italic text-muted-foreground/30 text-xl mb-12 lowercase">
                check back soon — we're always curating.
              </p>
              <Magnetic>
                <Link
                  href="/all-trips"
                  className="inline-flex items-center gap-3 glass px-10 py-4 rounded-full inner-glow text-[10px] uppercase tracking-[0.5em] text-foreground font-bold hover:text-primary transition-colors duration-500"
                >
                  Browse all trips
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Magnetic>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Cinematic Mid-Page Statement ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="px-6 py-40 md:px-16 lg:px-24 border-y border-white/5 text-center"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-serif text-[clamp(2rem,6vw,4.5rem)] text-foreground/20 italic leading-tight">
            No megaphones.
          </p>
          <p className="font-serif text-[clamp(2rem,6vw,4.5rem)] text-foreground leading-tight tracking-tightest">
            No crowded routes.
          </p>
          <div className="h-px w-24 bg-primary/20 mx-auto mt-12" />
          <p className="mt-8 font-serif text-xl italic text-muted-foreground/40 lowercase">
            just the right people, in the right places.
          </p>
        </div>
      </motion.section>

      {/* ── Exit CTA ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className="px-6 py-48 md:px-16 lg:px-24 text-center"
      >
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-4xl md:text-5xl text-foreground/30 italic mb-10">
            Want more options?
          </p>
          <p className="font-serif italic text-muted-foreground/30 text-xl lowercase mb-16">
            browse the full catalog — every journey we currently run.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <Magnetic>
              <Link
                href="/all-trips"
                className="group relative overflow-hidden px-12 py-5 rounded-full glass inner-glow text-[10px] uppercase tracking-[0.5em] font-bold text-foreground hover:text-primary-foreground transition-all duration-700"
              >
                <span className="relative z-10">Browse All Trips</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/booking"
                className="group flex items-center gap-3 text-muted-foreground/40 hover:text-foreground transition-colors duration-500"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold">
                  Talk to us
                </span>
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
