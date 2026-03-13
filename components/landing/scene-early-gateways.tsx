"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function SceneEarlyGateways() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Track scroll position within this specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Smooth the scroll progress for natural feeling scale/parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Cinematic entrance animations based on scroll
  const sectionOpacity = useTransform(smoothProgress, [0.1, 0.3, 0.8, 1.0], [0, 1, 1, 0])
  
  // The Lenses separate outwards as you scroll into the section
  const leftLensX = useTransform(smoothProgress, [0.1, 0.4], ["15%", "0%"])
  const rightLensX = useTransform(smoothProgress, [0.1, 0.4], ["-15%", "0%"])
  
  // Title fades and drifts up
  const titleY = useTransform(smoothProgress, [0.1, 0.3], [40, 0])
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1])

  const [hovered, setHovered] = useState<"stay" | "go" | null>(null)

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[120vh] px-4 py-32 md:px-12 lg:px-24 flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity: sectionOpacity }} className="w-full max-w-[1600px] relative z-10">
        
        {/* The Prompt / Heading */}
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="text-center mb-16 md:mb-24">
          <span className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-6 block">
            The World Awaits
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none text-foreground tracking-tightest">
            Two ways to <span className="italic text-foreground/40">disappear.</span>
          </h2>
        </motion.div>

        {/* The Spatial Lenses Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 h-[60vh] md:h-[65vh] w-full max-w-6xl mx-auto perspective-1000">
          
          {/* LENS 1: STAY */}
          <motion.div
            style={{ x: leftLensX }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              rotateX: 2,
              z: 50
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative w-full md:w-1/2 h-full rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:shadow-[0_0_80px_rgba(230,184,115,0.15)] border-white/10 border hover:border-primary/30"
            onMouseEnter={() => setHovered("stay")}
            onMouseLeave={() => setHovered(null)}
          >
            <Link href="/stays" className="block w-full h-full">
              {/* Image Base */}
              <div className="absolute inset-0">
                <Image
                  src="/cozy-hostel-dorm-warm-lights-quiet-evening-mountai.jpg"
                  alt="Wanderpals Stays"
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                  priority
                />
              </div>

              {/* Dynamic Glassmorphism Overlay */}
              {/* Heavy blur initially, clears up completely on hover */}
              <motion.div 
                animate={{ 
                  backdropFilter: hovered === "stay" ? "blur(0px)" : "blur(12px)",
                  backgroundColor: hovered === "stay" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.6)"
                }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 z-10 transition-colors"
                style={{ backdropFilter: "blur(12px)" }} // Initial state for SSR
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

              {/* Ghost Letterform */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                <span className="font-serif font-bold text-[20vw] md:text-[14vw] leading-none">S</span>
              </div>

              {/* Interactive Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-30">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hovered === "stay" ? 1 : 0.6, y: 0 }}
                  className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4"
                >
                  Sanctuaries
                </motion.div>
                
                <h3 className="font-serif text-4xl md:text-5xl text-foreground font-medium tracking-tightest leading-tight">
                  Stay
                </h3>
                
                <div className="overflow-hidden mt-2">
                  <motion.p 
                    animate={{ y: hovered === "stay" ? 0 : 20, opacity: hovered === "stay" ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="font-serif text-lg md:text-xl text-muted-foreground/80 italic lowercase"
                  >
                    Homes built for conversations.
                  </motion.p>
                </div>

                {/* Animated Button Reveal */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between overflow-hidden">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">
                    Dorms & Private
                  </span>
                  
                  <motion.div 
                    animate={{ 
                      x: hovered === "stay" ? 0 : -20, 
                      opacity: hovered === "stay" ? 1 : 0,
                      rotate: hovered === "stay" ? 45 : 0
                    }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                    className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center backdrop-blur-md"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* LENS 2: GO */}
          <motion.div
            style={{ x: rightLensX }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: -5,
              rotateX: 2,
              z: 50
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative w-full md:w-1/2 h-full rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:shadow-[0_0_80px_rgba(230,184,115,0.15)] border-white/10 border hover:border-primary/30"
            onMouseEnter={() => setHovered("go")}
            onMouseLeave={() => setHovered(null)}
          >
            <Link href="/all-trips" className="block w-full h-full">
              <div className="absolute inset-0">
                <Image
                  src="/mountain-road-trip-group-travelers-sunrise-himalay.jpg"
                  alt="Wanderpals Journeys"
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                  priority
                />
              </div>

              <motion.div 
                animate={{ 
                  backdropFilter: hovered === "go" ? "blur(0px)" : "blur(12px)",
                  backgroundColor: hovered === "go" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.6)"
                }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 z-10 transition-colors"
                style={{ backdropFilter: "blur(12px)" }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                <span className="font-serif font-bold text-[20vw] md:text-[14vw] leading-none">G</span>
              </div>

              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-30">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hovered === "go" ? 1 : 0.6, y: 0 }}
                  className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4"
                >
                  Expeditions
                </motion.div>
                
                <h3 className="font-serif text-4xl md:text-5xl text-foreground font-medium tracking-tightest leading-tight">
                  Go
                </h3>
                
                <div className="overflow-hidden mt-2">
                  <motion.p 
                    animate={{ y: hovered === "go" ? 0 : 20, opacity: hovered === "go" ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="font-serif text-lg md:text-xl text-muted-foreground/80 italic lowercase"
                  >
                    Journeys built for connection.
                  </motion.p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between overflow-hidden">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">
                    Small Groups
                  </span>
                  
                  <motion.div 
                    animate={{ 
                      x: hovered === "go" ? 0 : -20, 
                      opacity: hovered === "go" ? 1 : 0,
                      rotate: hovered === "go" ? 45 : 0
                    }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                    className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center backdrop-blur-md"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}
