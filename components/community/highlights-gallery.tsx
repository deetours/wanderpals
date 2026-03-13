'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Magnetic } from '../ui/magnetic'

const highlights = [
  { id: 1, image: '/moments1.jpg', trip: 'Puga Valley Ladakh' },
  { id: 2, image: '/moments2.png', trip: 'Meghalaya caves' },
  { id: 3, image: '/moments3.png', trip: 'Tyrna Meghalaya' },
  { id: 4, image: '/moments4.png', trip: 'Arunachal Pradesh' },
  { id: 5, image: '/moments5.png', trip: 'Spiti Valley Komic' },
  { id: 6, image: '/moments6.png', trip: 'Arunachal Pradesh beauty' },
]

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function HighlightsGallery() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % highlights.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 px-6 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mb-20 text-center"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-tight">Moments</h2>
          <p className="font-serif text-xl text-muted-foreground/60 italic lowercase">
            Real connections captured in silence.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-4 items-start">
          {/* Main featured highlight */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl glass inner-glow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ ...transition, duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={highlights[active].image}
                    alt={highlights[active].trip}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 75vw"
                    quality={100}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transition, delay: 0.5 }}
                    className="absolute bottom-10 left-10"
                  >
                    <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Location</p>
                    <p className="font-serif text-2xl text-white">{highlights[active].trip}</p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mini thumbnails */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {highlights.map((highlight, idx) => (
              <Magnetic key={highlight.id} strength={0.2}>
                <div
                  onClick={() => setActive(idx)}
                  className={`group relative aspect-square overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                    idx === active ? 'ring-2 ring-primary bg-primary/10' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={highlight.image}
                    alt={highlight.trip}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="200px"
                    quality={60}
                  />
                  <div className={`absolute inset-0 transition-opacity duration-700 ${idx === active ? 'opacity-0' : 'bg-black/20 group-hover:opacity-0'}`} />
                </div>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Mobile indicators */}
        <div className="flex lg:hidden justify-center gap-3 mt-12">
          {highlights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`h-1 transition-all duration-700 ${idx === active ? 'w-12 bg-primary' : 'w-3 bg-muted-foreground/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
