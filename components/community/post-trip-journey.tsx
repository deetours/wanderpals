'use client'

import { MessageCircle, Check } from 'lucide-react'

const sequence = [
  {
    day: '📅 24 hours before trip',
    messages: [
      'Pack light. Pack right. Here\'s your packing checklist →',
      'Your host Rohit will be there to greet you. Quick intro video →',
    ],
  },
  {
    day: '🚀 Day 1 of trip',
    messages: [
      'Welcome! Here\'s where everyone is meeting.',
      'Fun fact: 3 of your fellow travellers are from the same city!',
    ],
  },
  {
    day: '✨ Day 4 (Middle)',
    messages: [
      'Take a group photo. Tag us. Get featured on our page.',
      'Need anything? Message anytime. We\'re here.',
    ],
  },
  {
    day: '🔄 After trip ends',
    messages: [
      'The adventure doesn\'t end here. Here are 3 ways to stay connected →',
      'Special 20% discount on next trip ends in 3 days →',
    ],
  },
]

export function PostTripJourney() {
  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-card/20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Before, during, after</h2>
        <p className="font-sans text-muted-foreground mb-12">
          We're with you every step. WhatsApp messages keep the journey alive.
        </p>

        <div className="space-y-8">
          {sequence.map((phase, idx) => (
            <div key={idx}>
              <h3 className="font-sans font-semibold text-foreground mb-4">{phase.day}</h3>
              
              <div className="space-y-3 ml-4 border-l border-primary/20 pl-4">
                {phase.messages.map((msg, msgIdx) => (
                  <div key={msgIdx} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-sm text-muted-foreground">{msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-muted-foreground/10">
          <p className="font-sans text-center text-sm text-muted-foreground mb-4">
            Everyone stays in touch after. Our oldest group still travels together.
          </p>
          <button className="w-full px-6 py-3 bg-primary/10 hover:bg-primary/15 rounded-lg font-sans text-sm text-primary transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Save your spot on next trip
          </button>
        </div>
      </div>
    </section>
  )
}
