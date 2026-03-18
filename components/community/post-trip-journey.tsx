"use client"

import { motion } from "framer-motion"

export function PostTripJourney() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Journey Continues</h2>
        <p className="text-lg text-muted-foreground">
          Stay connected with your travel companions and cherish memories together.
        </p>
      </motion.div>
    </section>
  )
}
