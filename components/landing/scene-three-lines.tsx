"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const threeLines = [
  {
    text: "Wake up somewhere new",
    image: "/hero-foggy-valley-dawn.png",
    position: "left" as const,
    num: "01",
  },
  {
    text: "Walk with strangers",
    image: "/hero-campfire-spiti.png",
    position: "right" as const,
    num: "02",
  },
  {
    text: "Leave with fewer goodbyes",
    image: "/hero-houseboat-kerala.jpg",
    position: "left" as const,
    num: "03",
  },
]

function ThreeLinesItem({
  line,
  index,
}: {
  line: (typeof threeLines)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.08, 1.0])
  const imgOpacity = useTransform(scrollYProgress, [0.0, 0.25, 0.75, 1.0], [0, 1, 1, 0.6])
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.75, 1.0], [0, 1, 1, 0])
  const textX = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    [line.position === "right" ? 60 : -60, 0]
  )

  return (
    <div
      ref={ref}
      className={`grid gap-12 md:gap-20 items-center md:grid-cols-2 ${
        line.position === "right" ? "md:grid-flow-dense" : ""
      }`}
    >
      {/* Image — unmasking cinematic reveal */}
      <motion.div
        style={{ opacity: imgOpacity }}
        className={`group relative aspect-[16/11] overflow-hidden rounded-[2.5rem] ${
          line.position === "right" ? "md:col-start-2" : ""
        }`}
      >
        <motion.div
          style={{ scale: imgScale }}
          className="absolute inset-0"
        >
          <Image
            src={line.image}
            alt={line.text}
            fill
            className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[3s]"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
        </motion.div>
        {/* Cinematic number overlay */}
        <div className="absolute top-6 left-6 font-serif text-[60px] leading-none text-white/5 font-bold select-none pointer-events-none">
          {line.num}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
      </motion.div>

      {/* Text */}
      <motion.div
        style={{ opacity: textOpacity, x: textX }}
        className={`${line.position === "right" ? "md:col-start-1 md:pr-12" : "md:pl-12"}`}
      >
        <span className="block font-sans text-[10px] uppercase tracking-[0.5em] text-primary/40 font-bold mb-6">
          {line.num}
        </span>
        <h3 className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-foreground leading-[0.95] tracking-tightest">
          {line.text}
        </h3>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "35%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="h-px bg-primary/20 mt-10"
        />
      </motion.div>
    </div>
  )
}

export function SceneThreeLines() {
  return (
    <section className="relative space-y-40 py-40 px-6 md:px-16 lg:px-24">
      {threeLines.map((line, index) => (
        <ThreeLinesItem key={index} line={line} index={index} />
      ))}
    </section>
  )
}
