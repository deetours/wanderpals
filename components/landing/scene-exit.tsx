"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Magnetic } from "../ui/magnetic"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function SceneExit() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
      <div className="relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={transition}
          className="space-y-4"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest">Ready to go?</h2>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground italic lowercase">
            The adventure is just one click away.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <Magnetic strength={0.15}>
            <Link
              href="/all-trips"
              className="group relative inline-flex items-center gap-4 rounded-full bg-primary px-12 py-5 font-sans text-lg font-bold text-primary-foreground tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Start wandering
              <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </Magnetic>

          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/40">
            Takes less than a minute
          </p>
        </motion.div>
      </div>

      {/* Footer - minimal */}
      <footer className="absolute bottom-12 left-0 right-0 text-center">
        <div className="flex items-center justify-center gap-6 opacity-30 hover:opacity-100 transition-opacity duration-700">
          <Link href="/terms" className="text-[10px] text-foreground hover:text-primary transition-colors uppercase tracking-widest">Terms</Link>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <Link href="/privacy" className="text-[10px] text-foreground hover:text-primary transition-colors uppercase tracking-widest">Privacy</Link>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <p className="text-[10px] text-foreground uppercase tracking-widest">Wanderpals © 2026</p>
        </div>
      </footer>
    </section>
  )
}
