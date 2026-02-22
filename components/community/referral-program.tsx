'use client'

import { useState } from 'react'
import { Copy, Check, Users } from 'lucide-react'

export function ReferralProgram() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'WANDERPAL2025'

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-card/30">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Bring your people</h2>
        <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Share a trip with a friend. You both get ₹500 off. No limits. No catches.
        </p>

        {/* Referral code */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="px-6 py-3 bg-background/50 rounded-lg font-mono text-lg text-primary">
            {referralCode}
          </div>
          <button
            onClick={copyCode}
            className="p-3 hover:bg-background/50 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-primary" />
            ) : (
              <Copy className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center font-serif text-lg text-primary">
              1
            </div>
            <h3 className="font-serif text-lg text-foreground">Share your code</h3>
            <p className="font-sans text-sm text-muted-foreground">
              Send WANDERPAL2025 to your friends on WhatsApp
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center font-serif text-lg text-primary">
              2
            </div>
            <h3 className="font-serif text-lg text-foreground">They book a trip</h3>
            <p className="font-sans text-sm text-muted-foreground">
              They enter the code at checkout for ₹500 off
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center font-serif text-lg text-primary">
              3
            </div>
            <h3 className="font-serif text-lg text-foreground">You get ₹500</h3>
            <p className="font-sans text-sm text-muted-foreground">
              Your credit appears before you leave for the trip
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-12 border-t border-muted-foreground/10 grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-serif text-3xl text-primary">847</p>
            <p className="font-sans text-sm text-muted-foreground mt-2">Travellers brought by friends</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-primary">₹4.2L</p>
            <p className="font-sans text-sm text-muted-foreground mt-2">Total credits distributed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
