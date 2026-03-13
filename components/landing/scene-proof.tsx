"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const STATS = [
  { value: "4,800+", label: "Travellers trusted", sub: "across 7 years." },
  { value: "120+", label: "Places in India", sub: "curated, not listed." },
  { value: "98%", label: "Return rate", sub: "the number that humbles us most." },
]

export function SceneProof() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const containerOpacity = useTransform(scrollYProgress, [0.05, 0.3, 0.7, 0.95], [0, 1, 1, 0])

  return (
    <div ref={sectionRef} className="relative min-h-[160vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6 md:px-16 lg:px-24">
        <motion.div style={{ opacity: containerOpacity }} className="w-full max-w-6xl">

          <motion.p
            initial={false}
            style={{
              opacity: useTransform(scrollYProgress, [0.08, 0.25], [0, 1]),
              y: useTransform(scrollYProgress, [0.08, 0.25], [20, 0]),
            }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary/50 font-bold text-center mb-20"
          >
            The Evidence
          </motion.p>

          <div className="grid md:grid-cols-3 gap-0">
            {STATS.map((stat, i) => {
              const startIn = 0.15 + i * 0.1
              const endIn = 0.35 + i * 0.1
              const statOpacity = useTransform(scrollYProgress, [startIn, endIn], [0, 1])
              const statY = useTransform(scrollYProgress, [startIn, endIn], [50, 0])

              return (
                <motion.div
                  key={i}
                  style={{ opacity: statOpacity, y: statY }}
                  className={`px-10 py-16 text-center ${i < 2 ? "md:border-r border-white/5" : ""}`}
                >
                  {/* Giant Number */}
                  <p className="font-serif text-[clamp(4rem,10vw,8rem)] leading-none text-foreground tracking-tightest mb-4">
                    {stat.value}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-primary/60 font-bold mb-3">
                    {stat.label}
                  </p>
                  <p className="font-serif italic text-muted-foreground/30 text-sm lowercase">
                    {stat.sub}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom Divider */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]) }}
            className="mt-20 flex items-center justify-center gap-8"
          >
            <div className="h-px flex-1 max-w-[80px] bg-white/5" />
            <p className="font-serif italic text-muted-foreground/20 text-sm lowercase">
              since 2019
            </p>
            <div className="h-px flex-1 max-w-[80px] bg-white/5" />
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
