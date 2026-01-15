"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../ui/navbar"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Navigate to payment
      router.push(
        `/payment?type=trip&id=${trip.id}&date=${bookingData.dateIndex}&travellers=${bookingData.travellers}&total=${totalPrice}`,
      )
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return trip.dates[bookingData.dateIndex].spots >= bookingData.travellers
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

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      <div className="px-6 pt-24 pb-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href={`/trips/${trip.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {trip.name}
          </Link>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div
            className={`transition-all duration-500 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Step 1: Date & Travellers */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Save your spot.</h1>
                  <p className="mt-2 text-muted-foreground">
                    {trip.name} • {trip.duration}
                  </p>
                </div>

                {/* Date selection */}
                <div>
                  <label className="text-sm text-muted-foreground">Choose your dates</label>
                  <div className="mt-2 space-y-2">
                    {trip.dates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setBookingData({ ...bookingData, dateIndex: index })}
                        disabled={date.spots === 0}
                        className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                          bookingData.dateIndex === index
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

                {/* Number of travellers */}
                <div>
                  <label className="text-sm text-muted-foreground">Number of travellers</label>
                  <select
                    value={bookingData.travellers}
                    onChange={(e) => setBookingData({ ...bookingData, travellers: Number.parseInt(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} disabled={n > trip.dates[bookingData.dateIndex].spots}>
                        {n} {n === 1 ? "traveller" : "travellers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Almost there.</h1>
                  <p className="mt-2 text-muted-foreground">Tell us about you.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-muted-foreground">First name</label>
                    <input
                      type="text"
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Last name</label>
                    <input
                      type="text"
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Emergency contact</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Contact name</label>
                      <input
                        type="text"
                        value={bookingData.emergencyContact}
                        onChange={(e) => setBookingData({ ...bookingData, emergencyContact: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Contact phone</label>
                      <input
                        type="tel"
                        value={bookingData.emergencyPhone}
                        onChange={(e) => setBookingData({ ...bookingData, emergencyPhone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Read once. Breathe.</h1>
                  <p className="mt-2 text-muted-foreground">Review your booking.</p>
                </div>

                <div className="rounded-xl bg-card p-6 space-y-6">
                  {/* Trip info */}
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-serif text-xl text-foreground">{trip.name}</h3>
                    <p className="text-sm text-muted-foreground">{trip.duration}</p>
                  </div>

                  {/* Booking details */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dates</span>
                      <span className="text-foreground">
                        {trip.dates[bookingData.dateIndex].start} — {trip.dates[bookingData.dateIndex].end}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travellers</span>
                      <span className="text-foreground">{bookingData.travellers}</span>
                    </div>
                  </div>

                  {/* Traveller info */}
                  <div className="pt-6 border-t border-border space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">
                        {bookingData.firstName} {bookingData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{bookingData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-foreground">{bookingData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency contact</span>
                      <span className="text-foreground">{bookingData.emergencyContact}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-end justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <div className="text-right">
                        <p className="font-serif text-3xl text-foreground">₹{totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{trip.price.toLocaleString()} × {bookingData.travellers}{" "}
                          {bookingData.travellers === 1 ? "traveller" : "travellers"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-12">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 ? "Continue to payment" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
