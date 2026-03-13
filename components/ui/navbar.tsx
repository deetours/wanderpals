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

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function Navbar({ visible }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`fixed top-8 left-0 right-0 z-50 px-6 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between glass rounded-full px-8 py-4 inner-glow shadow-2xl">
          <Link href="/" className="font-serif text-2xl text-foreground tracking-tightest hover:text-primary transition-colors duration-500">
            Wanderpals
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Magnetic key={link.href} strength={0.2}>
                <Link
                  href={link.href}
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </Magnetic>
            ))}
            <div className="w-px h-4 bg-white/10 mx-2" />
            <Link
              href="/login"
              className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-primary hover:text-primary/80 transition-colors"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-background/90 backdrop-blur-3xl md:hidden"
          >
            <motion.nav 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-12"
            >
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 + i * 0.1 }}>
                    <Link
                    href={link.href}
                    className="font-serif text-5xl text-foreground transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                    >
                    {link.label}
                    </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...transition, delay: 0.6 }}>
                <Link
                    href="/login"
                    className="font-serif text-5xl text-primary transition-colors hover:text-primary/80"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    Return
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
