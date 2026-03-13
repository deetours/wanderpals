"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Clock, Users } from "lucide-react"

interface Trip {
  id: string
  name: string
  tagline: string
  duration: string
  image: string
  groupSize: string
  price?: number
  spotsLeft?: number
  terrain?: string
}

interface TripGridCardProps {
  trip: Trip
  index: number
  featured?: boolean
}

export function TripGridCard({ trip, index, featured = false }: TripGridCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  // Ken Burns — image scales from 1.08 to 1.0 as it scrolls into view
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.08, 1.0])
  const cardOpacity = useTransform(scrollYProgress, [0.0, 0.2], [0, 1])
  const cardY = useTransform(scrollYProgress, [0.0, 0.2], [40, 0])

  const isSoldOut = trip.spotsLeft === 0
  const isAlmostFull = trip.spotsLeft && trip.spotsLeft <= 3

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity: cardOpacity, y: cardY }}
      className="h-full"
    >
      <Link href={`/trips/${trip.id}`} className="group block h-full">
        <div
          className={`relative h-full overflow-hidden transition-all duration-700
            group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)]
            ${featured ? "rounded-[3rem]" : "rounded-[2.5rem]"}
          `}
        >
          {/* Ken Burns Image Layer */}
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${trip.image}')` }}
              />
            </motion.div>

            {/* Color grade overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-transparent" />
          </div>

          {/* Glass border inner glow */}
          <div className="absolute inset-0 rounded-[inherit] border border-white/5 group-hover:border-primary/10 transition-colors duration-700 pointer-events-none" />

          {/* ── Badges ── */}
          <div className="absolute top-7 left-7 flex items-center gap-3 z-10">
            {trip.terrain && (
              <div className="px-4 py-1.5 rounded-full glass text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">
                {trip.terrain}
              </div>
            )}
            {isAlmostFull && !isSoldOut && (
              <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/20 text-[9px] uppercase tracking-[0.4em] text-orange-400 font-bold">
                {trip.spotsLeft} spots left
              </div>
            )}
            {isSoldOut && (
              <div className="px-4 py-1.5 rounded-full glass text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold line-through">
                Full
              </div>
            )}
          </div>

          {/* Arrow — rotates on hover */}
          <div className="absolute top-7 right-7 z-10">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/20 group-hover:text-primary group-hover:rotate-45 transition-all duration-700 group-hover:bg-primary/10">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* ── Content ── */}
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-10">
            {/* Duration & Group meta */}
            <div className="flex items-center gap-6 mb-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">
                <Clock className="w-3 h-3" />
                {trip.duration}
              </span>
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">
                <Users className="w-3 h-3" />
                {trip.groupSize} souls
              </span>
            </div>

            {/* Trip Name */}
            <h3
              className={`font-serif text-foreground tracking-tightest leading-[0.95] group-hover:text-primary transition-colors duration-500
                ${featured ? "text-4xl md:text-6xl" : "text-2xl md:text-4xl"}
              `}
            >
              {trip.name}
            </h3>

            {/* Tagline — italic, fades to primary on hover */}
            <p className="mt-3 font-serif italic text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-500 line-clamp-1 text-base md:text-lg lowercase">
              {trip.tagline}
            </p>

            {/* Price + CTA line */}
            <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-700 delay-75">
              {trip.price ? (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold mb-1">From</p>
                  <p className="font-serif text-2xl text-foreground">₹{trip.price.toLocaleString()}</p>
                </div>
              ) : <div />}
              <span className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold">
                Explore →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
