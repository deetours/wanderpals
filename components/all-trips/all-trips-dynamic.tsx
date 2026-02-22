'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { TripGridCard } from './trip-grid-card'
import { TripFilters } from './trip-filters'
import { Footer } from '../ui/footer'

const moodKeywords: Record<string, { terrain?: string[]; duration?: string; groupSize?: string }> = {
  mountains: { terrain: ['mountains'] },
  mountain: { terrain: ['mountains'] },
  peaks: { terrain: ['mountains'] },
  hills: { terrain: ['mountains'] },
  snow: { terrain: ['mountains'] },
  high: { terrain: ['mountains'] },
  altitude: { terrain: ['mountains'] },
  silence: { groupSize: 'small' },
  quiet: { groupSize: 'small' },
  peaceful: { groupSize: 'small' },
  calm: { groupSize: 'small' },
  forest: { terrain: ['forest'] },
  forests: { terrain: ['forest'] },
  green: { terrain: ['forest'] },
  trees: { terrain: ['forest'] },
  water: { terrain: ['coast'] },
  sea: { terrain: ['coast'] },
  beach: { terrain: ['coast'] },
  coast: { terrain: ['coast'] },
  ocean: { terrain: ['coast'] },
  short: { duration: 'short' },
  quick: { duration: 'short' },
  weekend: { duration: 'short' },
  long: { duration: 'long' },
  extended: { duration: 'long' },
  desert: { terrain: ['desert'] },
  sand: { terrain: ['desert'] },
  dunes: { terrain: ['desert'] },
}

export function AllTripsDynamic() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [moodSearch, setMoodSearch] = useState('')
  const [showSecondHalf, setShowSecondHalf] = useState(false)
  const [filters, setFilters] = useState({
    region: 'all',
    terrain: 'all',
    duration: 'all',
  })
  const [mounted, setMounted] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  const midPauseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    setMounted(true)
    fetchTrips(client)
  }, [])

  // Observe mid-page pause to trigger second half
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSecondHalf(true)
        }
      },
      { threshold: 0.5 },
    )

    if (midPauseRef.current) {
      observer.observe(midPauseRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const fetchTrips = async (client: typeof supabase) => {
    if (!client) return
    setLoading(true)
    try {
      const { data } = await client
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      setTrips(data || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const moodFilters = useMemo(() => {
    if (!moodSearch.trim()) return null
    const words = moodSearch.toLowerCase().split(/\s+/)
    const terrains: string[] = []
    let duration: string | null = null
    let smallGroup = false

    for (const word of words) {
      const mapping = moodKeywords[word]
      if (mapping) {
        if (mapping.terrain) terrains.push(...mapping.terrain)
        if (mapping.duration) duration = mapping.duration
        if (mapping.groupSize === 'small') smallGroup = true
      }
    }

    return { terrains, duration, smallGroup }
  }, [moodSearch])

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Traditional filters
      if (filters.region !== 'all' && trip.region !== filters.region) return false
      if (filters.terrain !== 'all' && trip.terrain !== filters.terrain) return false
      if (filters.duration !== 'all') {
        const days = Number.parseInt(trip.duration?.toString() || '0')
        if (filters.duration === 'short' && days > 7) return false
        if (filters.duration === 'long' && days <= 7) return false
      }

      // Mood search filters
      if (moodFilters) {
        if (moodFilters.terrains.length > 0 && !moodFilters.terrains.includes(trip.terrain)) return false
        if (moodFilters.duration) {
          const days = Number.parseInt(trip.duration?.toString() || '0')
          if (moodFilters.duration === 'short' && days > 7) return false
          if (moodFilters.duration === 'long' && days <= 7) return false
        }
        if (moodFilters.smallGroup && trip.max_group_size && trip.max_group_size > 10) return false
      }

      return true
    })
  }, [trips, filters, moodFilters])

  const firstHalf = filteredTrips.slice(0, 6)
  const secondHalf = filteredTrips.slice(6)

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Scene 1: Arrival */}
      <section className="px-6 pt-32 pb-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-5xl lg:text-6xl text-foreground transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Every journey we currently run.
          </h1>
          <p
            className={`mt-4 font-sans text-lg text-muted-foreground transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            Different places. Same pace.
          </p>
        </div>
      </section>

      {/* Mood Search */}
      <section className="px-6 py-6 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <input
            type="text"
            value={moodSearch}
            onChange={(e) => setMoodSearch(e.target.value)}
            placeholder="Looking for mountains, silence, forests, or water?"
            className="w-full bg-transparent border-b border-border/50 py-3 font-sans text-lg text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-colors duration-300"
          />
        </div>
      </section>

      {/* Filter Toggle Section */}
      <section className="px-6 py-4 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span className="font-sans text-sm">Filter journeys</span>
            <span className="text-xs text-muted-foreground/60">(optional)</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${filtersExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Filters slide down */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${filtersExpanded ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
          >
            <TripFilters activeFilters={filters} onFilterChange={setFilters} />
          </div>

          <p className="mt-4 font-sans text-xs text-muted-foreground/60">
            All journeys are hosted by local teams and run in small groups.
          </p>
        </div>
      </section>

      {/* Scene 4: Trip Grid - First Half with rhythm */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading journeys...</p>
              </div>
            ) : firstHalf.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No trips match your filters</p>
              </div>
            ) : (
              firstHalf.map((trip, index) => {
                const mappedTrip = {
                  ...trip,
                  name: trip.name || trip.title,
                  image: trip.image_url || trip.image || "/placeholder.jpg",
                  groupSize: trip.max_group_size || "8-10"
                }
                return (
                  <div key={trip.id} className={index === 3 ? 'lg:col-span-2' : ''}>
                    <TripGridCard trip={mappedTrip} index={index} featured={index === 3} />
                  </div>
                )
              })

            )}
          </div>
        </div>
      </section>

      {/* Scene 5: Mid-Page Pause */}
      {secondHalf.length > 0 && (
        <section ref={midPauseRef} className="px-6 py-24 text-center md:px-16 lg:px-24">
          <div className="mx-auto max-w-2xl space-y-3">
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">We don't add journeys often.</p>
            <p className="font-serif text-xl md:text-2xl text-foreground">Each one earns its place.</p>
          </div>
        </section>
      )}

      {/* Scene 6: Trip Grid - Second Half (Lazy loaded) with rhythm */}
      {secondHalf.length > 0 && showSecondHalf && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {secondHalf.map((trip, index) => {
                const mappedTrip = {
                  ...trip,
                  name: trip.name || trip.title,
                  image: trip.image_url || trip.image || "/placeholder.jpg",
                  groupSize: trip.max_group_size || "8-10"
                }
                return (
                  <div key={trip.id} className={index === 3 ? 'lg:col-span-2' : ''}>
                    <TripGridCard trip={mappedTrip} index={index} featured={index === 3} />
                  </div>
                )
              })}

            </div>
          </div>
        </section>
      )}

      {/* Scene 7: Ending */}
      <section className="px-6 py-24 text-center md:px-16 lg:px-24">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-3">
            <p className="font-serif text-xl md:text-2xl text-muted-foreground">
              If you're unsure, start with one journey.
            </p>
            <p className="font-serif text-xl md:text-2xl text-foreground">The rest make sense later.</p>
          </div>
          <Link
            href="/journeys"
            className="group inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors duration-300"
          >
            <span className="font-sans text-lg">See our Journeys</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
