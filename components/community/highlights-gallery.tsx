'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const highlights = [
  { id: 1, image: '/moments1.jpg', trip: 'Puga Valley Ladakh', likes: 342 },
  { id: 2, image: '/moments2.png', trip: 'Meghalaya caves', likes: 521 },
  { id: 3, image: '/moments3.png', trip: 'Tyrna Meghalaya', likes: 298 },
  { id: 4, image: '/moments4.png', trip: 'Arunachal Pradesh', likes: 445 },
  { id: 5, image: '/moments5.png', trip: 'Spiti Valley Komic', likes: 678 },
  { id: 6, image: '/moments6.png', trip: 'Arunachal Pradesh beauty', likes: 512 },
]

export function HighlightsGallery() {
  const [autoRotate, setAutoRotate] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoRotate((prev) => (prev + 1) % highlights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Moments from the trips</h2>
        <p className="font-sans text-muted-foreground mb-12">
          Real photos. Real people. Real connections.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main featured highlight */}
          <div className="md:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-card">
              <Image
                src={highlights[autoRotate].image}
                alt={highlights[autoRotate].trip}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-sans text-sm text-muted-foreground">{highlights[autoRotate].trip}</p>
              </div>
            </div>
          </div>

          {/* Mini thumbnails */}
          <div className="space-y-2">
            {highlights.map((highlight, idx) => (
              <div
                key={highlight.id}
                onClick={() => setAutoRotate(idx)}
                className={`relative h-20 overflow-hidden rounded cursor-pointer transition-all duration-300 ${idx === autoRotate ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <Image
                  src={highlight.image}
                  alt={highlight.trip}
                  fill
                  className="object-cover"
                  sizes="120px"
                  quality={60}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {highlights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setAutoRotate(idx)}
              className={`h-2 rounded-full transition-all ${idx === autoRotate ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
