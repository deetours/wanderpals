"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "../ui/navbar"
import { Check, Users, Calendar, Mountain } from "lucide-react"
import Link from "next/link"

interface Trip {
  id: string
  name: string
  tagline: string
  heroImage: string
  why: string
  acts: { title: string; description: string; image: string }[]
  groupInfo: string
  dates: { start: string; end: string; spots: number }[]
  difficulty: string
  inclusions: string[]
  price: number
  duration: string
}

interface TripDetailsProps {
  trip: Trip
}

export function TripDetails({ trip }: TripDetailsProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${trip.heroImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-5xl">
            <p
              className={`text-sm uppercase tracking-widest text-primary transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {trip.duration} Journey
            </p>
            <h1
              className={`mt-4 font-serif text-5xl md:text-7xl lg:text-8xl text-foreground transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {trip.name}
            </h1>
            <p
              className={`mt-4 font-serif text-xl md:text-2xl text-foreground/80 italic transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {trip.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ACT 1: Why this trip exists */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed">{trip.why}</p>
        </div>
      </RevealSection>

      {/* ACT 2: The Flow */}
      <section className="py-12">
        <div className="px-6 md:px-16 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl md:text-3xl text-muted-foreground mb-12">The Journey</h2>
          </div>
        </div>

        <div className="space-y-24">
          {trip.acts.map((act, index) => (
            <ActSection key={index} act={act} index={index} />
          ))}
        </div>
      </section>

      {/* ACT 3: The People */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24 text-center">
        <div className="mx-auto max-w-2xl">
          <Users className="h-8 w-8 text-primary mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-foreground">{trip.groupInfo}</p>
          <p className="mt-4 text-muted-foreground">You'll return with fewer goodbyes.</p>
        </div>
      </RevealSection>

      {/* ACT 4: Practicals (late reveal) */}
      <RevealSection className="px-6 py-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-card p-6 md:p-10">
            {/* Quick info */}
            <div className="grid grid-cols-3 gap-6 pb-8 border-b border-border">
              <div className="text-center">
                <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground">{trip.duration}</p>
              </div>
              <div className="text-center">
                <Mountain className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="font-medium text-foreground">{trip.difficulty}</p>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Group size</p>
                <p className="font-medium text-foreground">8-10</p>
              </div>
            </div>

            {/* Date selection */}
            <div className="py-8 border-b border-border">
              <h3 className="font-serif text-xl text-foreground mb-4">Choose your dates</h3>
              <div className="space-y-3">
                {trip.dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    disabled={date.spots === 0}
                    className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                      selectedDate === index
                        ? "border-primary bg-primary/10"
                        : date.spots === 0
                          ? "border-border bg-secondary/50 opacity-50 cursor-not-allowed"
                          : "border-border bg-secondary hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">
                        {date.start} — {date.end}
                      </span>
                      <span className={`text-sm ${date.spots <= 3 ? "text-primary" : "text-muted-foreground"}`}>
                        {date.spots === 0 ? "Full" : `${date.spots} spots left`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="py-8 border-b border-border">
              <h3 className="font-serif text-xl text-foreground mb-4">What's included</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {trip.inclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="pt-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="font-serif text-4xl text-foreground">₹{trip.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>

              <Link
                href={`/booking/trip/${trip.id}?date=${selectedDate}`}
                className="block w-full rounded-lg bg-primary py-4 text-center font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
              >
                Join this journey
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>
    </main>
  )
}

// Act Section component
function ActSection({ act, index }: { act: { title: string; description: string; image: string }; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
        {/* Image */}
        <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg mx-6 md:mx-0 md:ml-16 lg:ml-24">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${act.image}')` }} />
          </div>
        </div>

        {/* Content */}
        <div className={`px-6 md:px-16 lg:px-24 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}>
          <p className="text-sm uppercase tracking-widest text-primary mb-2">
            {["One", "Two", "Three", "Four"][index]}
          </p>
          <h3 className="font-serif text-3xl md:text-4xl text-foreground">{act.title}</h3>
          <p className="mt-4 text-lg text-muted-foreground">{act.description}</p>
        </div>
      </div>
    </div>
  )
}

// Reveal section component
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
