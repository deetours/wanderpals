"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const transition = {
  duration: 1,
  ease: [0.23, 1, 0.32, 1] as any,
}

const faqs = [
  {
    question: "How do I know if Wanderpals is right for me?",
    answer:
      "If you've ever felt lonely while travelling, wanted to meet real people instead of taking selfies, or felt like your trip was too rushed—Wanderpals is built for you. We're for travellers who want depth over highlights.",
  },
  {
    question: "Are the stays and trips really that small?",
    answer:
      "Yes. Our stays host maximum 8-12 people. Our trips are 8-15 people. We've intentionally stayed small because we believe real connection only happens in small groups. Bigger is never better for us.",
  },
  {
    question: "What if I'm travelling alone?",
    answer:
      "Perfect. That's our demographic. You'll be grouped with other solo travellers who are looking for the same thing—genuine connection. Not a party. Not a business trip. Just humans being human.",
  },
  {
    question: "How much time should I plan?",
    answer:
      "For stays, anywhere from 2 nights to 2 weeks. For trips, they range from 5-11 days. We recommend at least 3 nights at a stay to really settle in, and the full duration of a trip to experience the arc.",
  },
  {
    question: "Can I bring a friend?",
    answer:
      "Yes, friends are welcome. Actually, we love when friends come together. The trips and stays are designed to help friendships deepen. So bring your best friend, your college gang, your travel buddy.",
  },
  {
    question: "What's included in the price?",
    answer:
      "For stays: accommodation, meals, and activities. For trips: everything except flights. We include transport, stays, most meals, activities, and a local host who becomes your friend. Ask in WhatsApp for detailed breakdowns.",
  },
]

export function SceneFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-32 md:px-16 lg:px-24 bg-card/20 relative overflow-hidden">
      <div className="mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={transition}
          className="mb-20"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-tight">Questions, answered.</h2>
          <p className="font-sans text-xl text-muted-foreground/80 lowercase italic">
            Everything you need to know before you book.
          </p>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-2xl glass inner-glow hover:bg-white/5 transition-colors duration-500 group"
              >
                <div className="flex items-center justify-between gap-6">
                  <h3 className="font-sans text-lg md:text-xl text-foreground font-medium group-hover:text-primary transition-colors duration-500">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={transition}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-base md:text-lg text-muted-foreground/80 leading-relaxed border-t border-white/5 pt-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="font-sans text-muted-foreground/60 mb-8 lowercase italic">Still have questions?</p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-sans text-sm font-semibold tracking-widest uppercase"
          >
            Message us on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
