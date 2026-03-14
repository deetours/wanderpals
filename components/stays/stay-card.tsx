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
      className="h-full w-full min-h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: (index % 5) * 0.1 }}
    >
      <Link href={`/stays/${stay.id}`} className="group block h-full w-full">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 group-hover:border-primary/10 shadow-2xl transition-all duration-700">
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            {image ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 bg-cover bg-center transition-all duration-[3s]"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-zinc-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary/60" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-primary/60 font-bold">
                  {stay.location || "Sanctuary"}
                </span>
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl text-white tracking-tightest leading-tight group-hover:text-primary transition-colors">
                {stay.name || "Unnamed Sanctuary"}
              </h3>
              
              <p className="font-serif italic text-white/40 group-hover:text-white/70 transition-colors line-clamp-1 lowercase">
                {stay.tagline || "A tranquil escape awaits."}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-white/5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">
                  {roomType || "Private Space"}
                </span>
                {typeof stay.price === 'number' && (
                  <span className="font-serif text-xl text-white">₹{stay.price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-6 left-6 z-20">
            <div className="px-4 py-1.5 rounded-full glass text-[9px] uppercase tracking-[0.4em] text-primary/60 font-bold">
              {type}
            </div>
          </div>
          
          <div className="absolute top-6 right-6 z-20">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/20 group-hover:text-primary group-hover:rotate-45 transition-all duration-700">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
