"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

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
  const [mounted, setMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!mounted) return null

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-16 lg:px-24 bg-card/30">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Questions, answered.</h2>
          <p className="font-sans text-lg text-muted-foreground">
            Everything you need to know before you book.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-4 rounded-lg border border-muted-foreground/10 hover:border-muted-foreground/30 transition-colors duration-300 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-sans text-base md:text-lg text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Answer */}
                {openIndex === index && (
                  <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isVisible ? `${faqs.length * 50 + 100}ms` : "0ms" }}
        >
          <p className="font-sans text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-sans text-sm font-medium"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
