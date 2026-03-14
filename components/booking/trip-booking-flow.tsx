"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "../ui/navbar"
import { ArrowLeft, ArrowRight, Check, Calendar, Users, ShieldCheck, Mail, Phone, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Magnetic } from "../ui/magnetic"
import { Footer } from "../ui/footer"

interface Trip {
  id: string
  name: string
  duration: string
  price: number
  dates: { start: string; end: string; spots: number }[]
}

interface TripBookingFlowProps {
  trip: Trip
  initialDateIndex: number
}

const transition = {
  duration: 0.8,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function TripBookingFlow({ trip, initialDateIndex }: TripBookingFlowProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    dateIndex: initialDateIndex,
    travellers: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalPrice = trip.price * bookingData.travellers

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // 1. Log the lead
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: bookingData.firstName,
            last_name: bookingData.lastName,
            email: bookingData.email,
            phone_number: bookingData.phone,
            source: 'trip_booking_flow',
            details: {
              trip_id: trip.id,
              trip_name: trip.name,
              date: `${trip.dates[bookingData.dateIndex].start} to ${trip.dates[bookingData.dateIndex].end}`,
              travellers: bookingData.travellers,
              total_price: totalPrice
            }
          })
        })
      } catch (err) {
        console.warn('Lead logging failed:', err)
      }

      // 2. WhatsApp redirect
      const message = `Hi Wanderpals! I'd like to join a journey.

Journey: ${trip.name}
Dates: ${trip.dates[bookingData.dateIndex].start} to ${trip.dates[bookingData.dateIndex].end}
Travellers: ${bookingData.travellers}
Total Contribution: ₹${totalPrice.toLocaleString()}

My Name: ${bookingData.firstName} ${bookingData.lastName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Emergency Contact: ${bookingData.emergencyContact} (${bookingData.emergencyPhone})`

      const whatsappLink = `https://wa.me/917629877144?text=${encodeURIComponent(message)}`
      window.open(whatsappLink, "_blank")
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return trip.dates[bookingData.dateIndex]?.spots >= bookingData.travellers
    }
    if (step === 2) {
      return (
        bookingData.firstName &&
        bookingData.lastName &&
        bookingData.email &&
        bookingData.phone &&
        bookingData.emergencyContact &&
        bookingData.emergencyPhone
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
                href={`/trips/${trip.id}`}
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 hover:text-primary transition-all mb-4"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Return to {trip.name}
              </Link>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tightest">
                Dossier <span className="text-foreground/30 italic">Application</span>
              </h1>
            </div>
            <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/5 pl-6 md:pl-0 md:pr-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Status</p>
              <div className="flex items-center gap-2 md:justify-end">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-500/80 tracking-widest uppercase">Protocol Active</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <div className="relative mb-20">
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
                    {s === 1 ? "Logistics" : s === 2 ? "Identity" : "Review"}
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
                
                {/* Step 1: Logistics */}
                {step === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl text-foreground">Specify the window.</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">Select your journey dates and tribe size.</p>
                    </div>

                    <div className="grid gap-4">
                      {trip.dates.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setBookingData({ ...bookingData, dateIndex: index })}
                          disabled={date.spots === 0}
                          className={`group relative w-full rounded-2xl border px-8 py-6 text-left transition-all duration-500 flex items-center justify-between overflow-hidden ${
                            bookingData.dateIndex === index
                              ? "border-primary bg-primary/5 shadow-inner"
                              : date.spots === 0
                                ? "border-white/5 opacity-20 cursor-not-allowed"
                                : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            <Calendar className={`h-5 w-5 transition-colors ${bookingData.dateIndex === index ? "text-primary" : "text-muted-foreground/20"}`} />
                            <span className="font-serif text-xl text-foreground">
                              {date.start} — {date.end}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${date.spots <= 3 && date.spots > 0 ? "text-orange-400" : "text-muted-foreground/40"}`}>
                              {date.spots === 0 ? "Exhausted" : `${date.spots} spots remaining`}
                            </span>
                          </div>
                          {bookingData.dateIndex === index && (
                            <motion.div layoutId="active-bg" className="absolute inset-0 bg-primary/5 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Number of Travellers</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            onClick={() => setBookingData({ ...bookingData, travellers: n })}
                            disabled={n > (trip.dates[bookingData.dateIndex]?.spots || 0)}
                            className={`flex-1 h-14 rounded-xl border font-serif text-lg transition-all duration-500 ${
                              bookingData.travellers === n
                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                            } disabled:opacity-10 disabled:cursor-not-allowed`}
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
                      <h2 className="font-serif text-3xl text-foreground">Who is joining?</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">We value privacy as much as connection.</p>
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
                            placeholder="e.g. Julian"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Last Name</label>
                          <input
                            type="text"
                            value={bookingData.lastName}
                            onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="e.g. Thorne"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Digital Address</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/20" />
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-16 pr-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="julian@ethereal.voyage"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Communication</label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/20" />
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-16 pr-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                            placeholder="+91 ···· ····"
                          />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                          <ShieldCheck className="h-4 w-4 text-primary/40" />
                          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Emergency Safeguard</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <input
                            type="text"
                            placeholder="Nexus Name"
                            value={bookingData.emergencyContact}
                            onChange={(e) => setBookingData({ ...bookingData, emergencyContact: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                          />
                          <input
                            type="tel"
                            placeholder="Nexus Phone"
                            value={bookingData.emergencyPhone}
                            onChange={(e) => setBookingData({ ...bookingData, emergencyPhone: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-serif text-lg placeholder:text-white/5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl text-foreground">Read once. Breathe.</h2>
                      <p className="text-muted-foreground/60 font-serif italic text-lg lowercase">Confirm the details of your next chapter.</p>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-end border-b border-white/5 pb-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">Journey</p>
                          <h3 className="font-serif text-2xl text-foreground">{trip.name}</h3>
                          <p className="font-serif italic text-primary/60">{trip.duration} Days · {bookingData.travellers} Travellers</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">Window</p>
                          <p className="font-serif text-foreground text-lg">{trip.dates[bookingData.dateIndex].start}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 text-sm">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Identity</p>
                            <p className="font-serif text-lg text-foreground">{bookingData.firstName} {bookingData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Contact</p>
                            <p className="font-serif text-lg text-foreground">{bookingData.email}</p>
                            <p className="font-serif text-lg text-foreground">{bookingData.phone}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Emergency Nexus</p>
                            <p className="font-serif text-lg text-foreground">{bookingData.emergencyContact}</p>
                            <p className="font-serif text-lg text-foreground">{bookingData.emergencyPhone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-8 mt-12">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Total Contribution</p>
                            <p className="font-serif text-5xl text-foreground tracking-tighter">₹{totalPrice.toLocaleString()}</p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
                    {step === 3 ? "Connect via WhatsApp" : "Continue Journey"}
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

