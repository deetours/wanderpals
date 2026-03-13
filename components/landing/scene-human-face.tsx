"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export function SceneHumanFace() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const imgScale = useTransform(scrollYProgress, [0.0, 0.5], [1.1, 1.0])
  const imgOpacity = useTransform(scrollYProgress, [0.05, 0.3, 0.8, 1.0], [0, 1, 1, 0])
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.8, 1.0], [0, 1, 1, 0])
  const textX = useTransform(scrollYProgress, [0.15, 0.4], [40, 0])
  const quoteMark = useTransform(scrollYProgress, [0.2, 0.45], [0, 1])

  return (
    <section ref={sectionRef} className="relative px-6 py-40 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:gap-24 md:grid-cols-2 items-center">
          {/* Cinematic Portrait */}
          <motion.div
            style={{ opacity: imgOpacity }}
            className="relative aspect-[3/4] overflow-hidden rounded-[3rem] inner-glow"
          >
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src="/traveller-testimonial-aisha.png"
                alt="Aisha, a Wanderpals traveller"
                fill
                className="object-cover grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </motion.div>

            {/* Name overlay at bottom */}
            <div className="absolute bottom-8 left-8 z-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">The Story</p>
              <p className="font-serif text-2xl text-white">Aisha</p>
              <p className="font-sans text-xs uppercase tracking-widest text-white/30 mt-1">
                Mumbai → Spiti Valley
              </p>
            </div>
          </motion.div>

          {/* Testimony */}
          <motion.div style={{ opacity: textOpacity, x: textX }}>
            <motion.div
              style={{ opacity: quoteMark }}
              className="font-serif text-[120px] leading-none text-primary/10 -mb-8 select-none"
              aria-hidden
            >
              "
            </motion.div>
            <blockquote className="space-y-8">
              <p className="font-serif text-[clamp(1.8rem,4vw,3.5rem)] text-foreground leading-[1.2] tracking-tightest">
                I booked 6 days.{" "}
                <span className="italic text-foreground/60">I stayed 3 weeks.</span>
              </p>
              <p className="font-serif text-2xl md:text-3xl text-foreground/40 italic">
                I still don't know why I left.
              </p>
              <div className="h-px w-16 bg-primary/20" />
              <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground/30">
                Real traveller. Real experience. Not curated.
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
