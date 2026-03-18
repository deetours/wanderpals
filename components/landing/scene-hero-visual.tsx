"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useTransform, MotionValue, useScroll } from "framer-motion"

const heroImages = [
  {
    src: "/hero1.png",
    alt: "Strangers laughing around a campfire at 4AM in Spiti Valley",
  },
  {
    src: "/hero-campfire-spiti1.jpg",
    alt: "Two strangers becoming friends on a Kerala houseboat at sunrise",
  },
  {
    src: "/hero2.png",
    alt: "Foggy mountain valley at dawn, travellers walking together",
  },
]

interface SceneHeroVisualProps {
  scrollYProgress?: MotionValue<number>
}

export function SceneHeroVisual({ scrollYProgress }: SceneHeroVisualProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  // Parallax offset
  const { scrollYProgress: defaultScroll } = useScroll()
  const activeScroll = (scrollYProgress || defaultScroll) as MotionValue<number>
  
  const y = useTransform(activeScroll, [0, 1], ["0%", "20%"])
  const scale = useTransform(activeScroll, [0, 1], [1, 1.1])

  return (
    <motion.div 
      style={{ y, scale }}
      className="absolute inset-0 z-0"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={heroImages[index].src}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
          transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[index].src}
            alt={heroImages[index].alt}
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Enhanced cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </AnimatePresence>
      
      {/* Constant breathing effect layer */}
      <motion.div 
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
      </motion.div>
    </motion.div>
  )
}

