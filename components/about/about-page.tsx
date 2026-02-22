"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "../ui/navbar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Hero */}
      <section className="px-6 pt-32 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            We believe travel is about people, not places.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground max-w-2xl transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            About belonging, not just visiting. About staying long enough to actually know a place.
          </p>
        </div>
      </section>

      {/* Story section */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24 bg-card">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">How it started</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Wanderpals started with a simple observation: the best parts of travel are rarely planned. They happen
              when you stay somewhere long enough to stop being a tourist.
            </p>
            <p>
              We were tired of hostel chains that felt like hotels, and group trips that felt like tours. We wanted
              something different—places where you could actually belong, and journeys where you could actually connect.
            </p>
            <p>
              So we built Wanderpals. Not as a booking platform, but as a community. Every stay is designed for
              conversation. Every trip is curated for connection.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Values */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 text-center">What we believe</h2>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <h3 className="font-serif text-xl text-foreground mb-3">Slow over fast</h3>
              <p className="text-muted-foreground">
                The best travel happens when you stop rushing. When you stay long enough to see the same sunrise twice.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl text-foreground mb-3">People over places</h3>
              <p className="text-muted-foreground">
                You'll forget the landmarks. You won't forget the conversations, the shared meals, the unexpected
                friendships.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl text-foreground mb-3">Belonging over visiting</h3>
              <p className="text-muted-foreground">
                We don't want guests. We want travellers who become part of the story, not just observers of it.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 98% Return Rate - As Hero Stat */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground mb-4">98%</p>
          <p className="font-serif text-2xl md:text-3xl text-muted-foreground mb-6">
            of our travellers come back.
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            We've stopped being surprised by this number. What surprises us more is how many friendships survive after the trip ends.
          </p>
        </div>
      </RevealSection>

      {/* Other Numbers */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24 bg-card">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <p className="font-serif text-4xl md:text-5xl text-primary">4,800+</p>
              <p className="mt-2 text-sm text-muted-foreground">Travellers</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl text-primary">120+</p>
              <p className="mt-2 text-sm text-muted-foreground">Locations</p>
            </div>
            <div>
              <p className="font-serif text-4xl md:text-5xl text-primary">6</p>
              <p className="mt-2 text-sm text-muted-foreground">Years of wandering</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Manifesto */}
      <RevealSection className="px-6 py-32 md:px-16 lg:px-24 bg-card/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-10">Our Manifesto</h2>
          <div className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed">
            <p>
              We believe travel is the most human of acts. It breaks you open. It teaches you what matters. It reminds
              you that the world is made of people, not pins on a map.
            </p>
            <p>
              We're building Wanderpals because the travel industry has forgotten this. It's turned journeys into
              consumption, stays into check-ins, and connection into content. We reject that entirely.
            </p>
            <p>
              Every trip we run is small. Every stay we host is designed for conversation. Every decision we make asks:
              Will this make someone feel more human, or less? We will always choose more.
            </p>
            <p>
              We're not interested in scale for its own sake. We're interested in depth. In the traveller who arrives
              as a stranger and leaves as a friend. In the stay where nobody checks their phone at dinner. In the journey
              where time moves differently.
            </p>
            <p>
              This is what we're building. Not a business. A better way to travel.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Team */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">The team</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're a small team of travellers, designers, and storytellers spread across India. We've slept in the dorms,
            led the trips, and made the friendships we now help others make. This isn't a business for us—it's a way of
            life.
          </p>
        </div>
      </RevealSection>

      {/* CTA */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Ready to belong somewhere?</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/stays"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Explore stays
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/trips"
              className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
            >
              Browse trips
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="font-serif text-xl text-foreground">
            Wanderpals
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/stays" className="hover:text-foreground transition-colors">
              Stays
            </Link>
            <Link href="/trips" className="hover:text-foreground transition-colors">
              Trips
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground/50">© 2026 Wanderpals</p>
        </div>
      </footer>
    </main>
  )
}

// Reveal section component
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  )
}
