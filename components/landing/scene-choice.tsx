"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Magnetic } from "../ui/magnetic"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function SceneChoice() {
  return (
    <section className="relative min-h-screen px-6 py-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-5 md:gap-16 items-start">
          {/* LEFT - STAYS (Muted, smaller) */}
          <div className="md:col-span-2">
            <Magnetic strength={0.2}>
              <Link href="/stays" className="block group relative overflow-hidden rounded-3xl glass inner-glow">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={transition}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] as any }}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('/cozy-hostel-dorm-warm-lights-quiet-evening-mountai.jpg')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      <h3 className="font-serif text-4xl text-foreground group-hover:text-primary transition-colors duration-500">
                        Stay
                      </h3>
                      <p className="mt-2 text-muted-foreground/80 lowercase italic">Homes built for conversations</p>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Dorms and private rooms</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Magnetic>
          </div>

          {/* RIGHT - TRIPS (Stronger contrast, larger) */}
          <div className="md:col-span-3">
            <Magnetic strength={0.15}>
              <Link href="/all-trips" className="block group relative overflow-hidden rounded-3xl glass inner-glow shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...transition, delay: 0.2 }}
                >
                  <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] as any }}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('/mountain-road-trip-group-travelers-sunrise-himalay.jpg')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/0 transition-all duration-1000" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                      <h3 className="font-serif text-5xl md:text-7xl text-foreground group-hover:text-primary transition-colors duration-500">
                        Go
                      </h3>
                      <p className="mt-3 text-lg md:text-xl text-muted-foreground lowercase italic">Journeys built for connection</p>
                      <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground/60">
                          Small groups, slow routes
                        </p>
                        <span className="text-primary text-2xl transition-transform duration-500 group-hover:translate-x-2">→</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
