"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Navbar } from "../ui/navbar"
import { Footer } from "../ui/footer"
import { Check, ArrowRight, MapPin, Bed, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Magnetic } from "../ui/magnetic"

interface Stay {
  id: string
  name: string
  location: string
  state: string
  tagline: string
  heroImage: string
  feeling: string
  images: string[]
  quotes: { text: string; author: string }[]
  amenities: string[]
  roomTypes: { name: string; price: number; description: string }[]
}

interface StayDetailsProps {
  stay: Stay
}

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function StayDetails({ stay }: StayDetailsProps) {
  const [selectedRoom, setSelectedRoom] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Hero parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 250])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Navbar visible={true} />
      <div className="noise-overlay grayscale pointer-events-none z-50 opacity-40 mix-blend-overlay" />

      {/* ── 1. CINEMATIC HERO ────────────────────────────────── */}
      <section className="relative h-[100vh] sm:min-h-[800px] w-full overflow-hidden flex items-end justify-center px-6 pb-24 md:px-16 lg:pb-32 lg:px-24">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src={stay.heroImage}
            alt={stay.name}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </motion.div>

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 w-full max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="flex-1 max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.1 }}
              className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary/80 font-bold mb-6 flex items-center gap-2"
            >
              <MapPin className="h-3 w-3" />
              {stay.location || stay.state}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
              className="font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[0.85] text-foreground tracking-tightest mb-6"
            >
              {stay.name.replace('Wanderpals ', '')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.4 }}
              className="font-serif text-2xl md:text-4xl text-white/50 italic leading-tight"
            >
              {stay.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transition, delay: 0.8 }}
            className="shrink-0"
          >
            <Magnetic>
              <div onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })} className="group relative overflow-hidden px-8 py-4 rounded-full glass border border-white/10 hover:border-primary/50 cursor-pointer transition-all duration-700 flex items-center gap-3">
                <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold text-foreground">Reserve Stay</span>
                <ArrowRight className="h-3.5 w-3.5 relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </div>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. THE FEELING (Manifesto Style) ────────────────────── */}
      <section className="px-6 py-32 md:px-16 lg:py-48 lg:px-24 border-b border-white/5 bg-background relative z-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition}
            className="font-serif text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.3] text-foreground/90"
          >
            {stay.feeling}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="h-px w-24 bg-primary/30 mx-auto mt-16 origin-center"
          />
        </div>
      </section>

      {/* ── 3. VISUAL NARRATIVE (Cinematic Gallery) ─────────────── */}
      {stay.images && stay.images.length > 0 && (
        <section className="py-24 md:py-40 bg-background relative z-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition}
            className="flex gap-6 md:gap-12 px-6 md:px-16 lg:px-24 overflow-x-auto no-scrollbar snap-x snap-mandatory"
            style={{ width: "max-content" }}
          >
            {stay.images.map((img, idx) => (
              <div key={idx} className="relative h-[50vh] min-h-[400px] max-h-[700px] w-[85vw] md:w-[60vw] max-w-[900px] shrink-0 overflow-hidden rounded-[2rem] snap-center">
                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover transition-transform duration-[2s] hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
              </div>
            ))}
          </motion.div>
          
          <div className="px-6 pt-16 text-center md:px-16 lg:px-24">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition} className="font-serif text-xl md:text-3xl text-muted-foreground/50 italic mb-2">Spaces designed for serendipity.</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: 0.1 }} className="text-[9px] uppercase tracking-[0.5em] text-primary/40 font-bold">Swipe to explore</motion.p>
          </div>
        </section>
      )}

      {/* ── 4. AMENITIES & QUOTES ───────────────────────────────── */}
      <section className="px-6 py-24 md:px-16 lg:py-40 lg:px-24 bg-[#0a0a0a] border-y border-white/5 relative z-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Amenities Grid */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition}>
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary/60 font-bold mb-10">The Details</p>
            <h3 className="font-serif text-4xl md:text-5xl text-foreground mb-12">What to expect</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              {stay.amenities.map((amenity, idx) => (
                <div key={idx} className="group flex items-center gap-4 text-muted-foreground/70 hover:text-foreground transition-colors duration-300">
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-sans text-sm tracking-wide">{amenity}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quotes Context */}
          {stay.quotes && stay.quotes.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: 0.2 }} className="glass p-12 md:p-16 rounded-[3rem] relative overflow-hidden inner-glow">
              <div className="absolute top-0 right-0 p-12 opacity-10 font-serif text-[12rem] leading-none text-primary pointer-events-none">"</div>
              <div className="relative z-10 space-y-16">
                {stay.quotes.map((quote, idx) => (
                  <div key={idx}>
                    <p className="font-serif text-2xl md:text-3xl text-foreground/90 leading-snug">"{quote.text}"</p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">— {quote.author}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* ── 5. ROOMS & BOOKING (The DOSSIER Vibe) ───────────────── */}
      <section id="booking-section" className="px-6 py-32 md:px-16 lg:py-48 lg:px-24 relative z-20 bg-background">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition} className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary/60 font-bold mb-6 block">Reservation</span>
            <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest">Secure your space.</h2>
          </motion.div>

          <div className="glass rounded-[2.5rem] p-6 md:p-12 inner-glow">
            {/* Rooms List */}
            <div className="space-y-4">
              {stay.roomTypes.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRoom(idx)}
                  className={`w-full text-left group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-[1.5rem] transition-all duration-500 border ${
                    selectedRoom === idx 
                      ? "bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(230,184,115,0.05)]" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div>
                    <h3 className={`font-serif text-2xl md:text-3xl mb-2 transition-colors duration-500 ${selectedRoom === idx ? "text-primary" : "text-foreground group-hover:text-foreground/80"}`}>
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs tracking-wider text-muted-foreground/60">
                      <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" /> Private/Dorm</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {room.description}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0 text-left md:text-right">
                    <p className="font-serif text-3xl text-foreground">₹{room.price.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 mt-1">Per Night</p>
                  </div>
                </button>
              ))}
            </div>

            {/* AI Booking Agent CTA */}
            <div className="mt-12 pt-12 border-t border-white/5 text-center">
              <p className="font-sans text-sm text-muted-foreground/60 mb-8 max-w-md mx-auto leading-relaxed">
                Connect with our concierge to confirm availability, personalize your stay, and finalize your booking.
              </p>
              <Magnetic strength={0.2}>
                <Link
                  href={`/booking/stay?id=${stay.id}&room=${encodeURIComponent(stay.roomTypes[selectedRoom]?.name)}`}
                  className="group relative inline-flex items-center justify-center overflow-hidden px-14 py-6 rounded-full bg-primary text-background font-bold text-[11px] uppercase tracking-[0.4em] transition-all duration-500 hover:shadow-[0_0_40px_rgba(230,184,115,0.3)] hover:scale-[1.02]"
                >
                  <span className="relative z-10">Request Availability</span>
                  <ArrowRight className="h-4 w-4 ml-3 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

