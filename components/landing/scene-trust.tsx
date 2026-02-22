"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle2 } from "lucide-react"

const trustPoints = [
  {
    icon: "🎯",
    title: "Instant WhatsApp Confirmation",
    description: "No long emails. No waiting. Confirmation arrives on your phone in minutes.",
  },
  {
    icon: "🤝",
    title: "Chat with Hosts Directly",
    description: "Message your host before you arrive. Ask questions. Get travel tips. Build friendship.",
  },
  {
    icon: "💯",
    title: "Money-Back Guarantee",
    description: "Not feeling it? Full refund up to 48 hours before arrival. We're confident you'll love it.",
  },
  {
    icon: "🛡️",
    title: "Trusted by 4,800+ Travellers",
    description: "98% return rate. Thousands of friendships that started with us. We're battle-tested.",
  },
]

export function SceneTrust() {
  const [mounted, setMounted] = useState(false)
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
    <section ref={sectionRef} className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Why trust us?</h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            We've removed the friction from booking. No hidden fees. No corporate speak. Just real reassurance.
          </p>
        </div>

        {/* Trust points grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="space-y-3">
                <div className="text-4xl">{point.icon}</div>
                <h3 className="font-serif text-xl text-foreground">{point.title}</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Urgency note */}
        <div
          className={`mt-16 p-6 rounded-lg bg-primary/5 border border-primary/20 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-sans text-sm text-foreground font-medium mb-1">
                Popular stays and trips fill fast
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Especially in peak season (Oct-Mar). Most dates have waitlists. Message us now to check availability—
                we keep spots reserved for serious travellers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
