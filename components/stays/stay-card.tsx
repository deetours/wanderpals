import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, MapPin } from "lucide-react"
import { Magnetic } from "../ui/magnetic"

interface Stay {
  id: string
  name: string
  location: string
  tagline: string
  memoryCue: string
  stayStory: string
  image: string
  type: string
  roomType: string
  vibe: string
  price?: number
  availability?: string
}

interface StayCardProps {
  stay: Stay
  index: number
  featured?: boolean
}

const transition = {
  duration: 1,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function StayCard({ stay, index, featured = false }: StayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...transition, delay: (index % 3) * 0.05 }}
      className="h-full"
    >
      <Magnetic strength={0.05}>
        <Link href={`/stays/${stay.id}`} className="group block h-full">
          <div className="relative h-full overflow-hidden rounded-[2.5rem] glass shadow-2xl transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
            {/* Image Layer */}
            <div className="relative h-full overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] as any }}
                className="absolute inset-0 bg-cover bg-center grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000"
                style={{ backgroundImage: `url('${stay.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Arrow Indicator */}
              <div className="absolute top-8 right-8 p-3 rounded-full glass text-white/20 group-hover:text-primary group-hover:rotate-45 transition-all duration-700">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              {/* Type Badge */}
              <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-1.5 rounded-full glass inner-glow">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">
                  {stay.type}
                </span>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <div className="flex items-center gap-2 text-primary/40 mb-3">
                  <MapPin className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold">
                    {stay.location}
                  </span>
                </div>
                
                <h3 className="font-serif text-3xl md:text-5xl text-foreground tracking-tightest leading-[1.1] group-hover:text-primary transition-colors duration-500">
                  {stay.name}
                </h3>
                
                <p className="mt-4 text-base md:text-lg text-muted-foreground/60 font-serif italic lowercase line-clamp-1 group-hover:text-muted-foreground transition-colors duration-500">
                  {stay.tagline}
                </p>

                <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/30 font-bold">The Scene</span>
                    <span className="text-xs text-muted-foreground/60 font-serif italic lowercase">"{stay.stayStory}"</span>
                  </div>
                  {stay.price && (
                    <span className="font-serif text-2xl text-foreground">
                      ₹{stay.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Magnetic>
    </motion.div>
  )
}
