'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { StayCard } from './stay-card'
import { StayFilters } from './stay-filters'

export function ExploreStaysDynamic() {
  const [stays, setStays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    roomType: 'all',
    vibe: 'all',
  })
  const [mounted, setMounted] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    setMounted(true)
    fetchStays(client)
    const timer = setTimeout(() => setShowFilters(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const fetchStays = async (client: typeof supabase) => {
    if (!client) return
    setLoading(true)
    const { data } = await client
      .from('stays')
      .select('*')
      .order('created_at', { ascending: false })
    setStays(data || [])
    setLoading(false)
  }

  const filteredStays = stays.filter((stay) => {
    if (filters.type !== 'all' && stay.type !== filters.type) return false
    if (filters.roomType !== 'all' && stay.room_type !== filters.roomType && stay.room_type !== 'both') return false
    if (filters.vibe !== 'all' && stay.vibe !== filters.vibe) return false
    return true
  })

  const firstHalf = filteredStays.slice(0, 3)
  const secondHalf = filteredStays.slice(3)

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Opening */}
      <section className="px-6 pt-32 pb-16 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Places you don't just check into.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            You arrive as a guest. You leave knowing names.
          </p>
          <p
            className={`mt-2 font-sans text-sm text-muted-foreground/60 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Across mountains, coasts, and cities in India.
          </p>
        </div>
      </section>

      {/* Filters */}
      <StayFilters visible={showFilters} filters={filters} onChange={setFilters} />

      {/* Stay Grid - First Half */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading stays...</p>
            </div>
          ) : firstHalf.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No stays match your filters</p>
            </div>
          ) : (
            firstHalf.map((stay, index) => (
              <div
                key={stay.id}
                className={`transition-all duration-700 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <StayCard stay={stay} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Mid-Grid Pause */}
      {secondHalf.length > 0 && (
        <section className="px-6 py-20 md:px-16 lg:px-24">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className={`font-serif text-2xl md:text-3xl text-foreground transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              Most people stay for a night.
            </p>
            <p
              className={`mt-2 font-sans text-base text-muted-foreground transition-all duration-700 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1200ms' }}
            >
              Some extend. A few don't leave on time.
            </p>
          </div>
        </section>
      )}

      {/* Stay Grid - Second Half */}
      {secondHalf.length > 0 && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {secondHalf.map((stay, index) => (
              <div
                key={stay.id}
                className={`transition-all duration-700 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${1400 + index * 150}ms` }}
              >
                <StayCard stay={stay} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="px-6 py-24 md:px-16 lg:px-24 text-center">
        <p
          className={`font-serif text-2xl md:text-3xl text-foreground transition-all duration-1000 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1800ms' }}
        >
          Not quite ready to book?
        </p>
        <Link
          href="/all-trips"
          className={`mt-6 inline-flex items-center gap-2 font-sans text-primary hover:text-primary/80 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '2000ms' }}
        >
          Explore our journeys
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
