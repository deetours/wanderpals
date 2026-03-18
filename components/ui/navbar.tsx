"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Magnetic } from "./magnetic"

interface NavbarProps {
  visible: boolean
}

const navLinks = [
  { href: "/journeys", label: "Journeys" },
  { href: "/stays", label: "Stays" },
  { href: "/all-trips", label: "All Trips" },
  { href: "/about", label: "About" },
]

export function Navbar({ visible }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`fixed top-8 left-0 right-0 z-50 px-6 transition-all duration-700 ease-[0.23,1,0.32,1] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between glass rounded-full px-6 py-3 inner-glow shadow-2xl">
          <Link href="/" className="font-serif text-xl text-foreground tracking-tight hover:text-primary transition-colors">
            Wanderpals
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Magnetic key={link.href} strength={0.2}>
                <Link
                  href={link.href}
                  className="font-sans text-xs uppercase tracking-widest text-muted-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </Magnetic>
            ))}
            <div className="w-px h-4 bg-white/10 mx-2" />
            <Link
              href="/login"
              className="font-sans text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
            >
              Return
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-background/80 md:hidden"
          >
            <motion.nav 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.23,1,0.32,1] }}
              className="flex h-full flex-col items-center justify-center gap-10"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif text-4xl text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="font-serif text-4xl text-primary transition-colors hover:text-primary/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Return
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
