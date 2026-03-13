"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Navbar } from "../ui/navbar"
import { Check, Users, Calendar, Mountain, ArrowDown } from "lucide-react"
import Link from "next/link"
import { Magnetic } from "../ui/magnetic"

interface Trip {
  id: string
  name: string
  tagline: string
  heroImage: string
  why: string
  acts: { title: string; description: string; image: string }[]
  groupInfo: string
  dates: { start: string; end: string; spots: number }[]
  difficulty: string
  inclusions: string[]
  price: number
  duration: string
}

interface TripDetailsProps {
  trip: Trip
}

const transition = {
  duration: 1,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function TripDetails({ trip }: TripDetailsProps) {
  const [selectedDate, setSelectedDate] = useState(0)
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

  return (
    <main ref={containerRef} className="grain min-h-screen bg-background relative selection:bg-primary/30">
      {/* Scroll Progress Indicator - The Elevation Wire */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar visible={true} />

      {/* Hero: Cinematic Entrance */}
      <section className="relative h-screen overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
          style={{ backgroundImage: `url('${trip.heroImage}')` }} 
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
                {trip.duration} Journey
              </span>
              <h1 className="mt-6 font-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] text-foreground tracking-tighter">
                {trip.name}
              </h1>
              <p className="mt-8 font-serif text-xl md:text-3xl text-foreground/70 lowercase italic max-w-2xl">
                {trip.tagline}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Prompt */}
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

      {/* ACT 1: The Soul of the Journey */}
      <section className="px-6 py-64 md:px-16 lg:px-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={transition}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.2] tracking-tight">
            {trip.why}
          </h2>
        </motion.div>
      </section>

      {/* ACT 2: The Elevation Timeline */}
      <section className="py-32 relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 md:block hidden" />
        
        <div className="space-y-64">
          {trip.acts.map((act, index) => (
            <ActSection key={index} act={act} index={index} />
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
          <p className="font-serif text-3xl md:text-5xl text-foreground tracking-tight">{trip.groupInfo}</p>
          <p className="mt-8 text-muted-foreground font-serif text-xl italic lowercase">You'll return with fewer goodbyes.</p>
        </motion.div>
      </section>

      {/* ACT 4: Dossier Application (Practicals) */}
      <section className="px-6 py-32 md:px-16 lg:px-24 pb-64 bg-black/20">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition}
            className="rounded-[2.5rem] glass inner-glow p-10 md:p-16 shadow-2xl overflow-hidden relative"
          >
            {/* Background Texture */}
            <div className="noise-overlay grayscale" />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <h3 className="font-serif text-4xl md:text-5xl text-foreground">The Details</h3>
                  <p className="mt-2 text-muted-foreground font-serif italic text-lg lowercase">Everything you need to know.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 mb-2">Contribution</p>
                  <p className="font-serif text-5xl text-foreground">₹{trip.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-20">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-medium">Duration</p>
                  <p className="font-serif text-2xl text-foreground">{trip.duration}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-medium">Character</p>
                  <p className="font-serif text-2xl text-foreground">{trip.difficulty}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-medium">Intensity</p>
                  <p className="font-serif text-2xl text-foreground">8 Travellers</p>
                </div>
              </div>

              {/* Date Selection: The Selection Slot */}
              <div className="space-y-6 mb-20">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 text-center mb-8">Available Departures</p>
                <div className="grid gap-4">
                  {trip.dates.map((date, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedDate(index)}
                      disabled={date.spots === 0}
                      className={`w-full rounded-2xl border px-8 py-6 text-left transition-all duration-500 flex items-center justify-between ${
                        selectedDate === index
                          ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                          : date.spots === 0
                            ? "border-white/5 opacity-30 cursor-not-allowed"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <span className="font-serif text-xl md:text-2xl text-foreground">
                        {date.start} — {date.end}
                      </span>
                      <div className="text-right">
                        <span className={`text-xs uppercase tracking-widest font-medium ${date.spots <= 3 && date.spots > 0 ? "text-orange-400" : "text-muted-foreground/60"}`}>
                          {date.spots === 0 ? "Exhausted" : `${date.spots} spots remaining`}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Inclusions Bento */}
              <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-serif text-lg text-foreground mb-6">The Inclusion</h4>
                  <div className="space-y-4">
                    {trip.inclusions.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 text-muted-foreground/80">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-sans tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4">
                    <p className="font-serif text-muted-foreground leading-relaxed lowercase italic">
                      Price includes all curated logistics so you can focus on the connection. No hidden fees. Just shared roads and silent nights.
                    </p>
                </div>
              </div>

              {/* Final Apply CTA */}
              <Link href={`/booking/trip/${trip.id}?date=${selectedDate}`}>
                <Magnetic strength={0.2}>
                  <div className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-6 text-center shadow-2xl transition-all hover:shadow-primary/20">
                    <motion.span 
                      className="relative z-10 font-sans text-xs uppercase tracking-[0.5em] font-bold text-primary-foreground"
                    >
                      Apply for this Journey
                    </motion.span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                </Magnetic>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// Act Section: The Cinematic Frame
function ActSection({ act, index }: { act: { title: string; description: string; image: string }; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative px-6 md:px-16 lg:px-24">
      <div className={`grid md:grid-cols-12 items-center gap-16 md:gap-24`}>
        {/* Content Frame */}
        <motion.div 
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={transition}
          className={`md:col-span-5 ${isEven ? 'md:order-1' : 'md:order-2 md:text-right'}`}
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary/60 font-medium mb-4 block">
            Phase {index + 1}
          </span>
          <h3 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight leading-[1.1]">
            {act.title}
          </h3>
          <p className="mt-8 text-xl text-muted-foreground leading-relaxed font-serif italic lowercase">
            {act.description}
          </p>
        </motion.div>

        {/* Visual Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ ...transition, duration: 1.5 }}
          className={`md:col-span-7 ${isEven ? 'md:order-2' : 'md:order-1'}`}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] glass inner-glow group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
              style={{ backgroundImage: `url('${act.image}')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
