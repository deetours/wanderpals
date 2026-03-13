"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ScenePause() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Fixed: proper string interpolation for filter – avoids .get() glitch
  const filter = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["blur(6px)", "blur(0px)"]
  )

  // Wider visibility window – text stays ON screen longer before fading
  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.2, 0.8, 1.0],
    [0, 1, 1, 0]
  )
  const scale = useTransform(scrollYProgress, [0.0, 0.25], [0.95, 1])

  // Underline and subtitle reveal
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.5], [0, 120])
  const subOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1])

  // Background glow – gentle breathing
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.3, 0.7, 1.0],
    [0, 0.07, 0.07, 0]
  )

  return (
    // Reduced from 150vh → 120vh to eliminate the black gap below
    <div ref={sectionRef} className="relative min-h-[120vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6 text-center">

        {/* Background breathing glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(230,184,115,1)_0%,transparent_100%)] pointer-events-none"
        />

        {/* Top/bottom fades so the section blends into neighbors cleanly */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <motion.div style={{ opacity, scale, filter }} className="max-w-3xl">
          <p className="font-serif text-[clamp(2rem,6vw,4rem)] text-foreground/90 leading-[1.2] lowercase italic">
            For travellers who value{" "}
            <span className="text-foreground not-italic">people</span>{" "}
            over{" "}
            <span className="text-foreground/30 not-italic">plans.</span>
          </p>

          {/* Animated underline */}
          <motion.div
            style={{ width: lineWidth }}
            className="h-px bg-primary/30 mt-12 mx-auto"
          />

          <motion.p
            style={{ opacity: subOpacity }}
            className="mt-8 font-sans text-[10px] uppercase tracking-[0.6em] text-muted-foreground/30 font-bold"
          >
            Since 2019. Independently run.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
