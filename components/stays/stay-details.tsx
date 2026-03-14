"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Navbar } from "../ui/navbar"
import { Footer } from "../ui/footer"
import { Check, ArrowDown, MapPin, Bed, Users, Wifi, Coffee, Wind, Mountain } from "lucide-react"
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
  duration: 1.4,
  ease: [0.23, 1, 0.32, 1] as any,
}

// Helper to map random amenity string to a nice icon
const getAmenityIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes("wifi") || n.includes("internet")) return <Wifi className="h-5 w-5" />
  if (n.includes("coffee") || n.includes("breakfast") || n.includes("tea")) return <Coffee className="h-5 w-5" />
  if (n.includes("ac") || n.includes("air") || n.includes("heater")) return <Wind className="h-5 w-5" />
  if (n.includes("view") || n.includes("mountain")) return <Mountain className="h-5 w-5" />
  return <Check className="h-5 w-5" />
}

export function StayDetails({ stay }: StayDetailsProps) {
  const [selectedRoom, setSelectedRoom] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // The Elevation Wire (Top Progress Bar)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Hero parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])

  return (
    <main ref={containerRef} className="grain min-h-screen bg-background relative selection:bg-primary/30 text-foreground overflow-x-hidden">
      
      {/* The Elevation Wire */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar visible={true} />

      {/* ── 1. CINEMATIC HERO ────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end">
        {/* Parallax Background */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src={stay.heroImage}
            alt={stay.name}
            fill
            className="object-cover grayscale-[0.1]"
            priority
            quality={100}
          />
        </motion.div>

        {/* Apple-style gradient fades */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-background to-transparent" />

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-20 w-full px-6 pb-24 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.2 }}
              className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary/80 font-bold mb-8 flex items-center justify-center gap-3"
            >
              <MapPin className="h-3 w-3" />
              {stay.location || stay.state} — Sanctuary
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(4rem,11vw,10rem)] leading-[0.85] text-white tracking-tightest mb-8"
            >
              {stay.name.replace('Wanderpals ', '')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.5 }}
              className="font-serif text-2xl md:text-4xl text-white/50 italic leading-tight max-w-3xl"
            >
              {stay.tagline}
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-medium">Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. THE MANIFESTO (Apple-style Typography) ─────────── */}
      <section className="px-6 py-40 md:py-64 md:px-16 lg:px-24 flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <h2 className="font-serif text-[clamp(2rem,5vw,5rem)] text-white/90 leading-[1.1] tracking-tight">
            {stay.feeling}
          </h2>
          <div className="h-px w-24 bg-primary/20 mx-auto mt-20" />
        </motion.div>
      </section>

      {/* ── 3. IMMERSIVE GALLERY ──────────────────────────────── */}
      {stay.images && stay.images.length > 0 && (
        <section className="py-20 bg-background overflow-hidden">
          <div className="px-6 md:px-16 lg:px-24 mb-16 max-w-7xl mx-auto flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={transition}
            >
              <h3 className="font-serif text-5xl text-foreground">Spaces.</h3>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-bold mt-4">Designed for serendipity</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2 }}
            className="flex gap-4 md:gap-8 px-6 md:px-16 lg:px-24 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-16"
            style={{ width: "max-content" }}
          >
            {stay.images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative ${idx % 2 === 0 ? 'h-[60vh] md:h-[70vh] w-[80vw] md:w-[60vw]' : 'h-[50vh] md:h-[55vh] w-[70vw] md:w-[40vw]'} shrink-0 overflow-hidden rounded-[2rem] md:rounded-[3rem] snap-center group`}
              >
                <Image src={img} alt={`Space ${idx + 1}`} fill className="object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── 4. APPLE BENTO GRID (Amenities & Specs) ───────────── */}
      <section className="px-6 py-32 md:py-48 md:px-16 lg:px-24 bg-zinc-950 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="mb-20 text-center"
          >
            <h3 className="font-serif text-5xl md:text-7xl text-white tracking-tightest">The Anatomy.</h3>
            <p className="mt-6 text-xl font-serif italic text-white/40 lowercase max-w-2xl mx-auto">
              Everything considered. Nothing superfluous.
            </p>
          </motion.div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Bento Item 1: Primary Feature / Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.1 }}
              className="md:col-span-8 rounded-[3rem] p-10 md:p-16 glass inner-glow relative overflow-hidden bg-white/[0.02]"
            >
              <div className="absolute -top-10 -right-10 text-[20rem] font-serif text-white/[0.03] leading-none pointer-events-none hover:rotate-12 transition-transform duration-1000">"</div>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <p className="font-serif text-3xl md:text-5xl text-white/90 leading-snug">
                  "{stay.quotes?.[0]?.text || "A perfect balance of isolation and absolute comfort."}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-serif text-primary text-xl">W</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60">
                    — {stay.quotes?.[0]?.author || "Wanderpals Journal"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bento Item 2: Quick Spec */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.2 }}
              className="md:col-span-4 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <Bed className="h-12 w-12 text-primary/40 mb-6" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">Capacity</p>
              <p className="font-serif text-4xl text-white">Up to {stay.roomTypes?.[0]?.description?.match(/\d+/)?.[0] || '4'} Guests</p>
            </motion.div>

            {/* Bento Item 3: Secondary Quote or Vibe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.3 }}
              className="md:col-span-4 rounded-[3rem] p-10 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-end"
            >
              <MapPin className="h-8 w-8 text-primary mb-6" />
              <h4 className="font-serif text-3xl text-white mb-2">{stay.location}</h4>
              <p className="text-sm font-sans tracking-wide text-white/60 leading-relaxed uppercase">
                {stay.state}
              </p>
            </motion.div>

            {/* Bento Item 4: Amenities Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: 0.4 }}
              className="md:col-span-8 rounded-[3rem] p-10 md:p-16 bg-white/[0.02] border border-white/5"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-10">Included Amenities</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                {(stay.amenities || []).map((amenity, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 h-8 w-8 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors flex items-center justify-center text-white/40">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 5. RESERVATION (Dossier Mode) ─────────────────────── */}
      <section id="booking-section" className="px-6 py-32 md:py-48 md:px-16 lg:px-24 bg-background">
        <div className="mx-auto max-w-5xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={transition} 
            className="text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-6 block">Reservation</span>
            <h2 className="font-serif text-[clamp(3rem,8vw,6rem)] text-white tracking-tightest leading-none">
              Commit to<br/>the Sanctuary.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...transition, delay: 0.2 }}
            className="glass rounded-[3rem] p-8 md:p-16 inner-glow border border-white/10 shadow-2xl relative overflow-hidden bg-black/40"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-12">
                <div>
                  <h3 className="font-serif text-4xl text-white">Select Quarters</h3>
                  <p className="mt-2 text-white/40 font-serif italic text-xl lowercase">Your space awaits.</p>
                </div>
              </div>

              {/* Seamless Room Selection List */}
              <div className="space-y-4 mb-20">
                {stay.roomTypes.map((room, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRoom(idx)}
                    className={`w-full text-left group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] transition-all duration-700 border ${
                      selectedRoom === idx 
                        ? "bg-primary/10 border-primary/40 shadow-[0_0_40px_rgba(230,184,115,0.1)]" 
                        : "bg-transparent border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <h3 className={`font-serif text-3xl mb-3 transition-colors duration-500 ${selectedRoom === idx ? "text-primary" : "text-white group-hover:text-white/90"}`}>
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-6 text-sm tracking-widest text-white/50 uppercase font-sans">
                        <span className="flex items-center gap-2"><Bed className="h-4 w-4" /> Space</span>
                        <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {room.description}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 md:mt-0 text-left md:text-right">
                      <p className={`font-serif text-4xl ${selectedRoom === idx ? "text-white" : "text-white/60"}`}>
                        ₹{room.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 mt-2">Per Night</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Apple-style Call to Action */}
              <div className="flex flex-col items-center pt-8">
                <p className="font-sans text-xs uppercase tracking-[0.3em] font-medium text-white/40 mb-8 text-center max-w-sm leading-relaxed">
                  Proceeding connects you with our concierge to secure and personalize your dates.
                </p>
                
                <Magnetic strength={0.2}>
                  <Link
                    href={`/booking/stay/${stay.id}?room=${encodeURIComponent(stay.roomTypes[selectedRoom]?.name)}`}
                    className="relative group inline-flex"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                    <div className="relative px-16 py-6 bg-primary text-black rounded-full font-sans text-xs uppercase tracking-[0.4em] font-bold flex items-center gap-4 hover:shadow-[0_0_30px_rgba(230,184,115,0.4)] transition-all duration-500">
                      Reserve Quarters
                      <ArrowDown className="h-4 w-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Magnetic>

                <Link 
                  href={`https://wa.me/917629877144?text=${encodeURIComponent(`Hi! I'm looking at ${stay.name} (${stay.roomTypes[selectedRoom]?.name}). Can you help me with a booking?`)}`}
                  target="_blank"
                  className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/20 hover:text-primary transition-colors font-bold"
                >
                  Chat with Concierge
                </Link>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

