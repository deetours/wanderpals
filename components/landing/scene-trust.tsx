"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const trustPoints = [
  {
    num: "01",
    title: "Instant WhatsApp Confirmation",
    description:
      "No long emails. No waiting. Confirmation arrives on your phone in minutes.",
  },
  {
    num: "02",
    title: "Direct Host Access",
    description:
      "Message your host before you arrive. Ask questions. Build friendship before the trip begins.",
  },
  {
    num: "03",
    title: "Money-Back Guarantee",
    description:
      "Full refund up to 48 hours before. We are that confident you'll love it.",
  },
  {
    num: "04",
    title: "4,800+ Travellers. 98% Return",
    description:
      "Battle-tested since 2019. Thousands of journeys. Not a single generic tour.",
  },
]

export function SceneTrust() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  const headerY = useTransform(scrollYProgress, [0.05, 0.2], [30, 0])

  return (
    <section ref={sectionRef} className="relative px-6 py-40 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-24">
          <span className="text-[10px] uppercase tracking-[0.6em] text-primary/50 font-bold block mb-6">
            The Guarantee
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest leading-tight">
            Why trust us?
          </h2>
        </motion.div>

        {/* Trust Points — each has its own scroll reveal */}
        <div className="space-y-0">
          {trustPoints.map((point, i) => {
            const startIn = 0.1 + i * 0.1
            const endIn = startIn + 0.15
            const ptOpacity = useTransform(scrollYProgress, [startIn, endIn, 0.85, 0.98], [0, 1, 1, 0])
            const ptX = useTransform(scrollYProgress, [startIn, endIn], [-30, 0])

            return (
              <motion.div
                key={i}
                style={{ opacity: ptOpacity, x: ptX }}
                className="group grid md:grid-cols-[80px_1fr] gap-8 items-start py-14 border-b border-white/5 hover:border-primary/10 transition-colors duration-700"
              >
                <span className="font-sans text-[60px] leading-none text-foreground/5 font-bold group-hover:text-foreground/10 transition-colors duration-700 select-none">
                  {point.num}
                </span>
                <div className="pt-2">
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                    {point.title}
                  </h3>
                  <p className="font-serif italic text-muted-foreground/50 text-lg leading-relaxed lowercase">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Final Note */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.55, 0.7], [0, 1]) }}
          className="mt-20 px-8 py-12 rounded-[2rem] bg-primary/5 border border-primary/10"
        >
          <p className="font-serif text-lg md:text-xl text-foreground/60 italic lowercase text-center">
            Popular dates sell out weeks in advance. Most peaks have waitlists.
            <span className="block mt-4 text-primary/60 not-italic font-sans text-[10px] uppercase tracking-[0.5em] font-bold">
              Message us now to check availability.
            </span>
          </p>
        </motion.div>

      </div>
    </section>
  )
}
