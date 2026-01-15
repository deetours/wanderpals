"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../ui/navbar"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Stay {
  id: string
  name: string
  location: string
  roomTypes: { name: string; price: number; description: string }[]
}

interface StayBookingFlowProps {
  stay: Stay
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
      // Navigate to payment
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
      return bookingData.firstName && bookingData.lastName && bookingData.email && bookingData.phone
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
            href={`/stays/${stay.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {stay.name}
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
            {/* Step 1: Dates */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Save your spot.</h1>
                  <p className="mt-2 text-muted-foreground">
                    {stay.name}, {stay.location}
                  </p>
                </div>

                {/* Room type */}
                <div>
                  <label className="text-sm text-muted-foreground">Room type</label>
                  <div className="mt-2 space-y-2">
                    {stay.roomTypes.map((room, index) => (
                      <button
                        key={index}
                        onClick={() => setBookingData({ ...bookingData, roomType: index })}
                        className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                          bookingData.roomType === index
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{room.name}</p>
                            <p className="text-sm text-muted-foreground">{room.description}</p>
                          </div>
                          <p className="font-serif text-lg text-foreground">₹{room.price}/night</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-muted-foreground">Check in</label>
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Check out</label>
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                      min={bookingData.checkIn}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="text-sm text-muted-foreground">Number of guests</label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number.parseInt(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
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
                  <p className="mt-2 text-muted-foreground">Just a few details about you.</p>
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
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Read once. Breathe.</h1>
                  <p className="mt-2 text-muted-foreground">Review your booking details.</p>
                </div>

                <div className="rounded-xl bg-card p-6 space-y-6">
                  {/* Stay info */}
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-serif text-xl text-foreground">{stay.name}</h3>
                    <p className="text-sm text-muted-foreground">{stay.location}</p>
                  </div>

                  {/* Booking details */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room type</span>
                      <span className="text-foreground">{stay.roomTypes[bookingData.roomType].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check in</span>
                      <span className="text-foreground">
                        {new Date(bookingData.checkIn).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check out</span>
                      <span className="text-foreground">
                        {new Date(bookingData.checkOut).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="text-foreground">{bookingData.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights</span>
                      <span className="text-foreground">{nights}</span>
                    </div>
                  </div>

                  {/* Guest info */}
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
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-end justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <div className="text-right">
                        <p className="font-serif text-3xl text-foreground">₹{totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{stay.roomTypes[bookingData.roomType].price} × {nights} nights × {bookingData.guests}{" "}
                          {bookingData.guests === 1 ? "guest" : "guests"}
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
