"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Navbar } from "../ui/navbar"
import { Magnetic } from "../ui/magnetic"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

// ─── Cinematic Manifesto Section ───────────────────────────────────────────
function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.8, 1], [0, 1, 1, 0])
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 0.08, 0])

  const p1Opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const p1Y = useTransform(scrollYProgress, [0.1, 0.3], [40, 0])
  const p2Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])
  const p2Y = useTransform(scrollYProgress, [0.2, 0.4], [40, 0])
  const p3Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1])
  const p3Y = useTransform(scrollYProgress, [0.35, 0.55], [20, 0])

  return (
    <section ref={ref} className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden border-y border-white/5">
        {/* Parallax background */}
        <motion.div style={{ scale: bgScale, opacity: overlayOpacity }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        </motion.div>
        {/* Gold radial glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(230,184,115,1),transparent)] pointer-events-none"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <motion.div style={{ opacity: textOpacity }} className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 text-center">
          <span className="text-[10px] uppercase tracking-[0.8em] text-primary/60 font-bold mb-16 block">The Manifesto</span>
          <div className="space-y-10">
            <motion.p style={{ opacity: p1Opacity, y: p1Y }} className="font-serif text-2xl md:text-4xl text-foreground/90 leading-[1.4] italic">
              We believe travel is the most human of acts. It breaks you open.
              It teaches you what matters. It reminds you that the{" "}
              <span className="text-foreground not-italic">world is made of people</span>, not pins on a map.
            </motion.p>
            <motion.p style={{ opacity: p2Opacity, y: p2Y }} className="text-muted-foreground/40 font-serif text-xl md:text-2xl italic">
              We're building Wanderpals because the travel industry has forgotten this.<br />
              It's turned journeys into consumption. We reject that.
            </motion.p>
            <motion.div style={{ opacity: p3Opacity, y: p3Y }} className="flex flex-col items-center gap-6 pt-8">
              <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <p className="text-lg font-sans uppercase tracking-[0.4em] text-primary/60 font-bold">
                More human, or less? We will always choose more.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Reusable Reveal Section ───────────────────────────────────────────────
function RevealSection({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null)
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative ${className}`}
      style={style}
    >
      {children}
    </motion.section>
  )
}

export function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const heroBgScale = useTransform(scrollYProgress, [0, 0.2], [1.0, 1.08])

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <Navbar visible={true} />
      <div className="noise-overlay grayscale" />

      {/* ── Hero Scene ──────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Hero Background — scales independently */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale: heroBgScale }} className="absolute inset-0">
            <Image
              src="/hero-foggy-valley-dawn.png"
              alt="Foggy Valley"
              fill
              className="object-cover opacity-20 blur-2xl"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="inline-block text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-8"
          >
            The Philosophy
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] text-foreground tracking-tightest"
          >
            Travel is about <span className="italic text-foreground/40">people</span>,{" "}
            <br />
            not just places.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.8 }}
            className="mt-12 font-serif text-xl md:text-3xl text-muted-foreground/60 max-w-2xl mx-auto lowercase italic leading-relaxed"
          >
            About belonging, not just visiting.
            <br />
            About staying long enough to actually know a place.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Origin Story ──────────────────────────────────────── */}
      <RevealSection className="px-6 py-48 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-24 items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/40 font-bold mb-6 block">Origin</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight tracking-tightest">
              How it <br />
              <span className="italic text-foreground/30">started.</span>
            </h2>
          </div>
          <div className="space-y-12 text-xl text-muted-foreground/80 leading-relaxed font-serif italic">
            <p>
              Wanderpals started with a simple observation: the best parts of travel are rarely planned. They happen when you stay somewhere long enough to stop being a tourist.
            </p>
            <p className="text-foreground/60">
              We were tired of hostel chains that felt like hotels, and group trips that felt like tours. We wanted something different—places where you could actually belong.
            </p>
            <div className="h-px w-24 bg-primary/20" />
            <p className="text-sm font-sans uppercase tracking-widest leading-loose">
              Not a booking platform,
              <br />
              but a community.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* ── Values – Bento ──────────────────────────────────────── */}
      <RevealSection className="px-6 py-48 md:px-16 lg:px-24 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-32">
            <span className="text-[10px] uppercase tracking-[0.6em] text-primary/60 font-bold mb-6 block">Tenets</span>
            <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest italic">What we believe.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Slow over fast", desc: "The best travel happens when you stop rushing. When you stay long enough to see the same sunrise twice." },
              { title: "People over places", desc: "You'll forget the landmarks. You won't forget the conversations, the shared meals, the friendships." },
              { title: "Belonging over visiting", desc: "We don't want guests. We want travellers who become part of the story, not just observers." },
            ].map((value, i) => (
              <div key={i} className="glass p-12 rounded-[2.5rem] inner-glow group hover:bg-white/[0.03] transition-all duration-700">
                <div className="h-1 w-12 bg-primary/30 mb-8 group-hover:w-24 transition-all duration-700" />
                <h3 className="font-serif text-3xl text-foreground mb-6 leading-tight">{value.title}</h3>
                <p className="text-muted-foreground/60 leading-relaxed italic font-serif text-lg">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Hero Stat ──────────────────────────────────────── */}
      <RevealSection className="px-6 py-64 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl text-center relative">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center opacity-5 -z-10"
          >
            <span className="font-serif text-[40vw] leading-none text-primary pointer-events-none">98</span>
          </motion.div>
          <p className="font-serif text-8xl md:text-[12rem] leading-none text-foreground tracking-tightest mb-8">98%</p>
          <p className="font-serif text-2xl md:text-4xl text-muted-foreground/40 italic lowercase mb-12">
            of our travellers come back.
          </p>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
            What surprises us more is how many friendships survive <br />
            long after the trip ends.
          </p>
        </div>
      </RevealSection>

      {/* ── Manifesto — Cinematic Sticky Scroll ──────────────── */}
      <ManifestoSection />

      {/* ── CTA ──────────────────────────────────────── */}
      <RevealSection className="px-6 py-64 md:px-16 lg:px-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-6xl md:text-8xl text-foreground mb-16 tracking-tightest">Ready to belong?</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Magnetic>
              <Link
                href="/stays"
                className="group relative px-12 py-5 rounded-full glass inner-glow text-foreground hover:text-primary-foreground transition-all duration-700 overflow-hidden"
              >
                <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold">Explore stays</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/all-trips" className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Browse journeys</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-700" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </RevealSection>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="px-6 py-24 border-t border-white/5 md:px-16 lg:px-24 opacity-60">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12">
          <Link href="/" className="font-serif text-3xl text-foreground tracking-tightest">
            Wanderpals.
          </Link>
          <nav className="flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-bold">
            <Link href="/stays" className="hover:text-primary transition-colors">Stays</Link>
            <Link href="/all-trips" className="hover:text-primary transition-colors">Trips</Link>
            <Link href="/about" className="text-primary">About</Link>
          </nav>
          <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-muted-foreground/30">© 2026 Crafted for souls</p>
        </div>
      </footer>
    </main>
  )
}
