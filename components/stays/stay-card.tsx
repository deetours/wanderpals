"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"
import { Magnetic } from "../ui/magnetic"

interface Stay {
  id: string
  name: string
  location: string
  tagline: string
  stayStory?: string
  image?: string
  image_url?: string
  type?: string
  roomType?: string
  room_type?: string
  vibe?: string
  price?: number
  altitude?: string
}

interface StayCardProps {
  stay: Stay
  index: number
}

export function StayCard({ stay, index }: StayCardProps) {
  const image = stay.image_url || stay.image || ""
  const roomType = stay.roomType || stay.room_type
  const type = stay.type || stay.vibe || "Stay"

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: (index % 5) * 0.05 }}
    >
      <Magnetic strength={0.04}>
        <Link href={`/stays/${stay.id}`} className="group block h-full">
          <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/5 group-hover:border-primary/10 shadow-2xl group-hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] transition-all duration-700">

            {/* Background Image with hover scale */}
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
              {image ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 bg-cover bg-center grayscale-[0.15] group-hover:grayscale-0 transition-all duration-[3s]"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ) : (
                // Elegant gradient fallback when no image
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background/80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>

            {/* Type badge */}
            <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
              <div className="px-4 py-1.5 rounded-full glass text-[9px] uppercase tracking-[0.4em] text-primary/60 font-bold">
                {type}
              </div>
            </div>

            {/* Arrow badge */}
            <div className="absolute top-6 right-6 z-10">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/20 group-hover:text-primary group-hover:rotate-45 group-hover:bg-primary/10 transition-all duration-700">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-10">
              <div className="flex items-center gap-2 text-primary/40 mb-4">
                <MapPin className="h-3 w-3" />
                <span className="text-[9px] uppercase tracking-[0.5em] font-bold">{stay.location}</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground tracking-tightest leading-[1.0] group-hover:text-primary transition-colors duration-500">
                {stay.name}
              </h3>
              <p className="mt-3 font-serif italic text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-500 line-clamp-1 text-base lowercase">
                {stay.tagline}
              </p>

              {/* Hover reveals */}
              <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-700">
                <div className="flex items-center gap-4">
                  {roomType && (
                    <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30 font-bold">
                      {roomType === "both" ? "Private + Dorm" : roomType}
                    </span>
                  )}
                </div>
                {stay.price ? (
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/30 font-bold">From</p>
                    <p className="font-serif text-2xl text-foreground">₹{stay.price.toLocaleString()}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Link>
      </Magnetic>
    </motion.div>
  )
}
