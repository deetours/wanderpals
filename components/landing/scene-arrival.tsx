"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SceneHeroVisual } from "./scene-hero-visual"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any, // apple-ease
}

export function SceneArrival() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Parallax offsets
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section 
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-start px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <SceneHeroVisual scrollYProgress={scrollYProgress} />
      
      {/* Fade gradient overlay - blends carousel into next section */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-[5]" />
      
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 max-w-4xl"
      >
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "normal" }}
          transition={{ ...transition, delay: 0.2 }}
        >
          <h1 className="font-serif text-[clamp(4rem,12vw,10rem)] leading-[0.9] font-medium text-foreground tracking-tightest">
            Wanderpals
          </h1>
        </motion.div>

        {/* Tagline - delayed */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.6 }}
          className="mt-8 font-serif text-xl md:text-3xl text-muted-foreground/80 lowercase italic"
        >
          Travel slower. Stay longer.
        </motion.p>
      </motion.div>
    </section>
  )
}

