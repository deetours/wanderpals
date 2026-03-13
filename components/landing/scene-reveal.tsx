"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const revealLines = [
  { text: "Trade the rush", emph: "for the rhythm" },
  { text: "Stay until it", emph: "feels like home" },
  { text: "Let the journey", emph: "change you" },
]

// Each line gets its own component with its own scroll offset
// This avoids the "hooks in loops" React rule violation
function RevealLine({
  line,
  sectionProgress,
  enterStart,
  enterEnd,
}: {
  line: { text: string; emph: string }
  sectionProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  enterStart: number
  enterEnd: number
}) {
  // Keep text fully visible from its enter point until 0.85, then gently fade
  const lineOpacity = useTransform(
    sectionProgress,
    [enterStart, enterEnd, 0.85, 1.0],
    [0, 1, 1, 0]
  )
  const lineY = useTransform(sectionProgress, [enterStart, enterEnd], [40, 0])

  return (
    <motion.p
      style={{ opacity: lineOpacity, y: lineY }}
      className="font-serif text-[clamp(2.5rem,8vw,6.5rem)] text-foreground tracking-tightest leading-[0.95]"
    >
      {line.text}{" "}
      <span className="italic text-foreground/50">{line.emph}</span>
    </motion.p>
  )
}

export function SceneReveal() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // offset: start start/end end so progress is 0 when pinned at top, 1 when fully scrolled through
    offset: ["start start", "end end"],
  })

  // Background: stays consistent, no large fade-out that creates black space
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12])
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 0.45, 0.45, 0]
  )

  // Overlay darkens at the start (for readability) then stays stable – no black gap
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.95, 0.5, 0.5, 0.95]
  )

  return (
    // Reduced from 300vh → 160vh — lines come in cleanly, no endless blank scrolling
    <div ref={sectionRef} className="relative min-h-[160vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Parallax Background */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale-[0.4]"
            style={{
              backgroundImage: `url('/hostel-lights-mountain-roads-shared-meals-bonfire-.jpg')`,
            }}
          />
        </motion.div>

        {/* Overlay – no longer fades to pure black near exit */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background pointer-events-none"
        />

        {/* Section-blend fades */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        {/* Lines — each enters at an evenly-spaced window, stays until 0.85 */}
        <div className="relative z-10 text-center px-6 space-y-2 md:space-y-4">
          {revealLines.map((line, i) => {
            // Distributed across the first 50% of the scroll so all 3 are visible early
            const enterStart = 0.05 + i * 0.12
            const enterEnd = enterStart + 0.15
            return (
              <RevealLine
                key={i}
                line={line}
                sectionProgress={scrollYProgress}
                enterStart={enterStart}
                enterEnd={enterEnd}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
