"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, MessageCircle, ArrowRight } from "lucide-react"

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const type = searchParams.get("type")
  const id = searchParams.get("id")

  useEffect(() => {
    setMounted(true)
    // Delayed confetti effect
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const staysData: Record<string, { name: string; location: string }> = {
    bir: { name: "Wanderpals Bir", location: "Himachal Pradesh" },
    gokarna: { name: "Wanderpals Gokarna", location: "Karnataka" },
    manali: { name: "Wanderpals Manali", location: "Himachal Pradesh" },
    pondicherry: { name: "Wanderpals Pondicherry", location: "Tamil Nadu" },
    rishikesh: { name: "Wanderpals Rishikesh", location: "Uttarakhand" },
    varkala: { name: "Wanderpals Varkala", location: "Kerala" },
  }

  const tripsData: Record<string, { name: string; duration: string }> = {
    spiti: { name: "Spiti Valley", duration: "9 Days" },
    ladakh: { name: "Ladakh Circuit", duration: "11 Days" },
    kerala: { name: "Kerala Backwaters", duration: "6 Days" },
    meghalaya: { name: "Meghalaya Trails", duration: "7 Days" },
  }

  const booking = type === "stay" ? staysData[id || ""] : tripsData[id || ""]

  return (
    <main className="grain min-h-screen bg-background flex items-center justify-center px-6">
      {/* Confetti-like subtle animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20 animate-fade-up"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50 + 30}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg text-center">
        {/* Success icon */}
        <div
          className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <Check className="h-10 w-10 text-primary" />
        </div>

        {/* Main heading */}
        <h1
          className={`font-serif text-5xl md:text-6xl text-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          You're in.
        </h1>

        {/* Subheading */}
        <p
          className={`mt-4 font-serif text-xl md:text-2xl text-muted-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          We'll handle the rest.
        </p>

        {/* Booking info */}
        {booking && (
          <div
            className={`mt-8 rounded-xl bg-card p-6 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-serif text-lg text-foreground">
              {type === "stay" ? (booking as { name: string; location: string }).name : booking.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {type === "stay"
                ? (booking as { name: string; location: string }).location
                : (booking as { name: string; duration: string }).duration}
            </p>
          </div>
        )}

        {/* WhatsApp notification */}
        <div
          className={`mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Our team will message you on WhatsApp with details</span>
        </div>

        {/* Packing message */}
        <p
          className={`mt-12 font-serif text-lg text-foreground/60 italic transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          Start packing slowly.
        </p>

        {/* Navigation */}
        <div
          className={`mt-12 flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-primary hover:underline transition-colors"
          >
            Continue exploring
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  )
}

export function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <main className="grain min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <ConfirmedContent />
    </Suspense>
  )
}
