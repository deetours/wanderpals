"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function SceneVillain() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0.0, 0.2, 0.8, 1.0], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0.0, 0.2], [0.94, 1])
  const headlineY = useTransform(scrollYProgress, [0.0, 0.2], [50, 0])
  const subY = useTransform(scrollYProgress, [0.1, 0.3], [40, 0])
  const subOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const taglineOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const taglineY = useTransform(scrollYProgress, [0.2, 0.4], [20, 0])

  return (
    <div ref={sectionRef} className="relative min-h-[130vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden px-6 md:px-16 lg:px-24">
        {/* Horizontal scan line – adds cinematic tension */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]) }}
          className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        />

        <motion.div style={{ opacity, scale }} className="max-w-4xl">
          {/* The Indictment */}
          <motion.div style={{ y: headlineY }}>
            <h2 className="font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-foreground tracking-tightest">
              Most travel is<br />
              <span className="italic text-foreground/30">consumption.</span>
            </h2>
          </motion.div>

          <motion.div style={{ opacity: subOpacity, y: subY }} className="mt-10">
            <div className="space-y-2 max-w-xl">
              <p className="font-serif text-2xl md:text-3xl text-muted-foreground/50 italic lowercase">
                New city. New photo.
              </p>
              <p className="font-serif text-2xl md:text-3xl text-muted-foreground/20 italic lowercase">
                New flight.
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: taglineOpacity, y: taglineY }}
            className="mt-20 border-l-2 border-primary/20 pl-8 space-y-4"
          >
            <p className="font-sans text-sm text-muted-foreground/40 uppercase tracking-[0.4em] font-bold">
              We built something different.
            </p>
            <p className="font-sans text-xl md:text-2xl text-foreground font-medium uppercase tracking-[0.15em]">
              Slower. Smaller.{" "}
              <span className="text-primary">More human.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
