"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "../ui/navbar"
import { CreditCard, Smartphone, Lock } from "lucide-react"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi")
  const [upiId, setUpiId] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const total = searchParams.get("total")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Navigate to confirmation
    router.push(`/confirmed?type=${type}&id=${id}`)
  }

  const canPay = () => {
    if (paymentMethod === "upi") {
      return upiId.includes("@")
    }
    return cardDetails.number.length >= 16 && cardDetails.expiry && cardDetails.cvv && cardDetails.name
  }

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      <div className="px-6 pt-24 pb-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-xl">
          <div
            className={`transition-all duration-500 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">You're not buying a trip.</h1>
              <p className="mt-2 font-serif text-xl text-muted-foreground">You're saying yes to an experience.</p>
            </div>

            {/* Payment amount */}
            <div className="rounded-xl bg-card p-6 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total amount</span>
                <span className="font-serif text-3xl text-foreground">
                  ₹{Number.parseInt(total || "0").toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment method selection */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">UPI</p>
                    <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full rounded-lg border p-4 text-left transition-all duration-300 ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Card</p>
                    <p className="text-sm text-muted-foreground">Debit or credit card</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Payment details */}
            <div className="rounded-xl bg-card p-6 mb-8">
              {paymentMethod === "upi" ? (
                <div>
                  <label className="text-sm text-muted-foreground">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Card number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "") })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Expiry</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                        placeholder="***"
                        maxLength={3}
                        className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Name on card</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
              <Lock className="h-3 w-3" />
              <span>Secured by 256-bit encryption</span>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={!canPay() || isProcessing}
              className="w-full rounded-lg bg-primary py-4 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Confirm and begin →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="grain min-h-screen bg-background">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
