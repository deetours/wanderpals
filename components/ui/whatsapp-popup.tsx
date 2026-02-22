"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle } from "lucide-react"

export function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show popup after 45 seconds of scrolling
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !isOpen && !localStorage.getItem("wanderpals_whatsapp_shown")) {
        setTimeout(() => {
          setIsOpen(true)
          localStorage.setItem("wanderpals_whatsapp_shown", "true")
        }, 1000)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      // WhatsApp link to +91 9876543210 (placeholder)
      const message = `Hi Wanderpals! I'm interested in your trips and stays. My phone: ${phoneNumber}`
      const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`
      window.open(whatsappLink, "_blank")
      setIsOpen(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Popup */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-card rounded-2xl p-6 max-w-sm shadow-xl border border-primary/20">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Chat with us</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Have questions? Send your WhatsApp number and we'll reach out with personalized recommendations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="tel"
                placeholder="Your WhatsApp number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-muted-foreground/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary text-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-sans text-sm font-medium"
              >
                Connect on WhatsApp
              </button>
            </form>

            <p className="text-xs text-muted-foreground/50 mt-3 text-center">
              We respond in &lt;5 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Floating button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
          aria-label="Open WhatsApp chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  )
}
