'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Navbar } from '../ui/navbar'
import { TripGridCard } from './trip-grid-card'
import { TripFilters } from './trip-filters'

export function AllTripsDynamic() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    region: 'all',
    terrain: 'all',
    duration: 'all',
  })
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const midpointPauseRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    fetchTrips()
    const timer = setTimeout(() => setShowFilters(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    setTrips(data || [])
    setLoading(false)
  }

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (filters.region !== 'all' && trip.region !== filters.region) return false
      if (filters.terrain !== 'all' && trip.terrain !== filters.terrain) return false
      if (filters.duration !== 'all' && !trip.duration?.toLowerCase().includes(filters.duration)) return false
      return true
    })
  }, [trips, filters])

  const firstHalf = filteredTrips.slice(0, 4)
  const secondHalf = filteredTrips.slice(4)

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      {/* Opening */}
      <section className="px-6 pt-32 pb-16 md:px-16 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className={`font-serif text-4xl md:text-6xl lg:text-7xl text-foreground transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Every journey we currently run.
          </h1>
          <p
            className={`mt-6 font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            Different places. Same pace.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className={`transition-all duration-700 ${showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <section className="px-6 py-4 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <TripFilters activeFilters={filters} onFilterChange={setFilters} />
          </div>
        </section>
      </div>

      {/* First Half Grid */}
      <section className="px-6 py-12 md:px-16 lg:px-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading journeys...</p>
            </div>
          ) : firstHalf.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No trips match your filters</p>
            </div>
          ) : (
            firstHalf.map((trip, index) => (
              <div
                key={trip.id}
                className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <TripGridCard trip={trip} index={index} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Midpoint Pause */}
      {secondHalf.length > 0 && (
        <section className="px-6 py-24 md:px-16 lg:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className={`font-serif text-3xl md:text-4xl text-foreground transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: '1200ms' }}
            >
              Each one earns its place.
            </p>
            <p
              className={`mt-4 font-sans text-base text-muted-foreground transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: '1400ms' }}
            >
              We don't add trips often. When we do, it's because the hosts are exceptional.
            </p>
          </div>
        </section>
      )}

      {/* Second Half Grid */}
      {secondHalf.length > 0 && (
        <section className="px-6 py-12 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {secondHalf.map((trip, index) => (
              <div
                key={trip.id}
                className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${1600 + index * 100}ms` }}
              >
                <TripGridCard trip={trip} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && trips.length === 0 && (
        <section className="px-6 py-24 md:px-16 lg:px-24 text-center">
          <p className="text-muted-foreground">No trips yet. Check back soon!</p>
        </section>
      )}
    </main>
  )
}
