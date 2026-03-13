"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "../ui/navbar"
import { ArrowLeft, ArrowRight, Check, Calendar, Users, MapPin, Bed, Info, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Magnetic } from "../ui/magnetic"
import { Footer } from "../ui/footer"

interface Stay {
  id: string
  name: string
  location: string
  roomTypes: { name: string; price: number; description: string }[]
}

interface StayBookingFlowProps {
  stay: Stay
}

const transition = {
  duration: 0.8,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function StayBookingFlow({ stay }: StayBookingFlowProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    roomType: 0,
    checkIn: "",
    checkOut: "",
    guests: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
          (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0

  const totalPrice = stay.roomTypes[bookingData.roomType].price * nights * bookingData.guests

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push(
        `/payment?type=stay&id=${stay.id}&room=${bookingData.roomType}&checkin=${bookingData.checkIn}&checkout=${bookingData.checkOut}&guests=${bookingData.guests}&total=${totalPrice}`,
      )
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return bookingData.checkIn && bookingData.checkOut && nights > 0
    }
    if (step === 2) {
      return (
        bookingData.firstName &&
        bookingData.lastName &&
        bookingData.email &&
        bookingData.phone
      )
    }
    return true
  }

  if (!mounted) return null

  return (
    <main className="grain min-h-screen bg-background selection:bg-primary/30">
      <Navbar visible={true} />

      <div className="px-6 pt-32 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          {/* Header context */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <Link
                href={`/stays/${stay.id}`}
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 hover:text-primary transition-all mb-4"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Return to {stay.name}
              </Link>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tightest">
                Stay <span className="text-foreground/30 italic">Reservation</span>
              </h1>
            </div>
            <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/5 pl-6 md:pl-0 md:pr-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Location</p>
              <div className="flex items-center gap-2 md:justify-end text-muted-foreground/60">
                <MapPin className="h-3 w-3" />
                <span className="text-xs font-medium tracking-widest uppercase">{stay.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <div className="relative mb-20">
            <div className="noise-overlay grayscale" />
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full h-px bg-white/5" />
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: s <= step ? 1 : 0.8,
                      backgroundColor: s <= step ? "var(--primary)" : "rgba(255,255,255,0.05)",
                    }}
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500 ${
                      s <= step ? "text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" : "text-muted-foreground/40"
                    }`}
                  >
                    {s < step ? <Check className="h-4 w-4" /> : s}
                  </motion.div>
                  <span className={`mt-3 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${
                    s <= step ? "text-primary/60" : "text-muted-foreground/20"
                  }`}>
                    {s === 1 ? "Configuration" : s === 2 ? "Identity" : "Finalize"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step content with Liquid Transitions */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={transition}
                className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                <div className="noise-overlay grayscale" />
                
                {/* Step 1: Configuration */}
                {step === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl text-foreground">Select your sanctuary.</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">Choose the space and duration that resonates with you.</p>
                    </div>

                    <div className="grid gap-4">
                      {stay.roomTypes.map((room, index) => (
                        <button
                          key={index}
                          onClick={() => setBookingData({ ...bookingData, roomType: index })}
                          className={`group relative w-full rounded-2xl border px-8 py-6 text-left transition-all duration-500 flex items-center justify-between overflow-hidden ${
                            bookingData.roomType === index
                              ? "border-primary bg-primary/5 shadow-inner"
                              : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <Bed className={`h-5 w-5 transition-colors ${bookingData.roomType === index ? "text-primary" : "text-muted-foreground/20"}`} />
                            <div>
                              <p className="font-serif text-xl text-foreground">{room.name}</p>
                              <p className="text-xs text-muted-foreground/40 font-serif italic lowercase">{room.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-lg text-foreground">₹{room.price.toLocaleString()}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/20 ml-2">/ night</span>
                          </div>
                          {bookingData.roomType === index && (
                            <motion.div layoutId="room-active-bg" className="absolute inset-0 bg-primary/5 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Check In</label>
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Check Out</label>
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                          min={bookingData.checkIn}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Guests</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            onClick={() => setBookingData({ ...bookingData, guests: n })}
                            className={`flex-1 h-14 rounded-xl border font-serif text-lg transition-all duration-500 ${
                              bookingData.guests === n
                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Identity */}
                {step === 2 && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl text-foreground">A few more details.</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">Connecting the dots between your arrival and our welcome.</p>
                    </div>

                    <div className="grid gap-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">First Name</label>
                          <input
                            type="text"
                            value={bookingData.firstName}
                            onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="e.g. Elena"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Last Name</label>
                          <input
                            type="text"
                            value={bookingData.lastName}
                            onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="e.g. Vance"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Email</label>
                        <div className="relative">
                          <Zap className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/20" />
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-16 pr-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="elena@ethereal.voyage"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">WhatsApp Number</label>
                        <div className="relative">
                          <Info className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/20" />
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-16 pr-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="+91 ···· ····"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Finalize */}
                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl text-foreground">Read once. Breathe.</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">Confirm the details of your stay.</p>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-end border-b border-white/5 pb-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">Sanctuary</p>
                          <h3 className="font-serif text-2xl text-foreground">{stay.name}</h3>
                          <p className="font-serif italic text-primary/60">{stay.roomTypes[bookingData.roomType].name} · {bookingData.guests} Guests</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">Duration</p>
                          <p className="font-serif text-foreground text-lg">{nights} Nights</p>
                          <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">{bookingData.checkIn} — {bookingData.checkOut}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Identity</p>
                          <p className="font-serif text-lg text-foreground">{bookingData.firstName} {bookingData.lastName}</p>
                          <p className="font-serif text-sm text-muted-foreground/60 italic lowercase">{bookingData.email} · {bookingData.phone}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-8 mt-12">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Total Contribution</p>
                            <p className="font-serif text-5xl text-foreground tracking-tighter">₹{totalPrice.toLocaleString()}</p>
                          </div>
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-12 px-2">
            <div>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="group flex items-center gap-3 text-muted-foreground/40 hover:text-foreground transition-all duration-500 uppercase tracking-[0.4em] text-[10px] font-bold"
                >
                  <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                  Retrace
                </button>
              )}
            </div>

            <div className="flex-1 max-w-[280px]">
              <Magnetic strength={0.1}>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="w-full relative group overflow-hidden flex items-center justify-center gap-4 rounded-full bg-primary py-5 font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 uppercase tracking-[0.5em] text-[10px]">
                    {step === 3 ? "Proceed to Checkout" : "Continue Journey"}
                  </span>
                  <ArrowRight className="relative z-10 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

