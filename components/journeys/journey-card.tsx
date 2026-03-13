"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Clock, Users } from "lucide-react"

interface Journey {
  id: string
  name: string
  tagline: string
  duration: string
  images: string[]
  groupSize: string
  terrain?: string
  price?: number
}

interface JourneyCardProps {
  journey: Journey
  index: number
}

export function JourneyCard({ journey, index }: JourneyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  // Per-card Ken Burns — image scales as it scrolls into view
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1.0])
  const cardOpacity = useTransform(scrollYProgress, [0.0, 0.2, 0.85, 1.0], [0, 1, 1, 0.6])
  const textX = useTransform(
    scrollYProgress,
    [0.05, 0.3],
    [isEven ? -40 : 40, 0]
  )
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1])

  const image = journey.images?.[0] || "/placeholder.jpg"

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity: cardOpacity }}
      className="group"
    >
      <Link href={`/trips/${journey.id}`} className="block">
        <div className={`grid md:grid-cols-12 gap-8 md:gap-16 items-center ${isEven ? "" : "md:grid-flow-dense"}`}>

          {/* ── Image Column ────────────────────────────────── */}
          <div className={`relative md:col-span-7 ${isEven ? "" : "md:col-start-6"}`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] inner-glow">
              {/* Ken Burns parallax */}
              <motion.div style={{ scale: imgScale }} className="absolute inset-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 bg-cover bg-center grayscale-[0.1] group-hover:grayscale-0 transition-all duration-[3s]"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              </motion.div>

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Border glow */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 group-hover:border-primary/10 transition-colors duration-700 pointer-events-none" />

              {/* Arrow badge */}
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full glass flex items-center justify-center text-white/20 group-hover:text-primary group-hover:rotate-45 group-hover:bg-primary/10 transition-all duration-700">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Index number overlay */}
              <div className="absolute bottom-6 left-8 font-serif text-[80px] leading-none text-white/5 select-none pointer-events-none font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* ── Text Column ─────────────────────────────────── */}
          <motion.div
            style={{ opacity: textOpacity, x: textX }}
            className={`md:col-span-5 ${isEven ? "" : "md:col-start-1 md:row-start-1"}`}
          >
            {/* Meta */}
            <div className="flex items-center gap-6 mb-8">
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold">
                <Clock className="w-3 h-3" />
                {journey.duration}
              </span>
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold">
                <Users className="w-3 h-3" />
                {journey.groupSize} souls
              </span>
            </div>

            {/* Name */}
            <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] text-foreground leading-[0.95] tracking-tightest group-hover:text-primary transition-colors duration-700">
              {journey.name}
            </h2>

            {/* Tagline */}
            <p className="mt-6 font-serif text-xl text-muted-foreground/50 italic lowercase leading-relaxed group-hover:text-muted-foreground/70 transition-colors duration-700">
              {journey.tagline}
            </p>

            {/* Expanding line reveal */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "30%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="h-px bg-primary/20 mt-10"
            />

            {/* CTA */}
            <div className="mt-10 flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-700">
              <span className="text-[9px] uppercase tracking-[0.5em] text-primary font-bold">
                Explore journey
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
