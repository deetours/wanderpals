"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  visible: boolean
}

export function Navbar({ visible }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-serif text-xl text-foreground transition-colors hover:text-primary">
            Wanderpals
          </Link>

          {/* Desktop nav - Updated order: Journeys, Stays, All Trips, About, Return */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/journeys"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Journeys
            </Link>
            <Link
              href="/stays"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Stays
            </Link>
            <Link
              href="/all-trips"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              All Trips
            </Link>
            <Link
              href="/about"
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/login"
              className="font-sans text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Return
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu - Updated order: Journeys, Stays, All Trips, About, Return */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          <Link
            href="/journeys"
            className="font-serif text-3xl text-foreground transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Journeys
          </Link>
          <Link
            href="/stays"
            className="font-serif text-3xl text-foreground transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Stays
          </Link>
          <Link
            href="/all-trips"
            className="font-serif text-3xl text-foreground transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            All Trips
          </Link>
          <Link
            href="/about"
            className="font-serif text-3xl text-foreground transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/login"
            className="font-serif text-3xl text-primary transition-colors hover:text-primary/80"
            onClick={() => setMobileMenuOpen(false)}
          >
            Return
          </Link>
        </nav>
      </div>
    </>
  )
}
