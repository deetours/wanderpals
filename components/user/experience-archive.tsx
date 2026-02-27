'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Bookmark, Share2, MessageCircle, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react'
import { UserOnboarding } from './user-onboarding'
import { WhatsappRequirement } from './whatsapp-requirement'
import { motion } from 'framer-motion'
import { isAfter, isBefore, isWithinInterval, parseISO, addDays, formatDistanceToNow } from 'date-fns'

interface Journey {
  id: string
  type: 'trip' | 'stay'
  title: string
  image: string
  date: string
  rawDate: string
  endDate: string
  duration: number
  people: number
  memories: string[]
  status: 'upcoming' | 'current' | 'past'
  bookingId: string
}

interface ExperienceArchiveProps {
  userId?: string
}

export function ExperienceArchive({ userId }: ExperienceArchiveProps) {
  const [journeys, setJourneys] = useState<{ upcoming: Journey[], current: Journey[], past: Journey[] }>({ upcoming: [], current: [], past: [] })
  const [recommendedTrips, setRecommendedTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUserJourneys()
      fetchRecommendations()
    }
  }, [userId])

  const fetchRecommendations = async () => {
    const supabase = createClientComponentClient()
    if (!supabase) return
    const { data } = await supabase.from('trips').select('*').eq('status', 'published').limit(2)
    setRecommendedTrips(data || [])
  }

  const fetchUserJourneys = async () => {
    const supabase = createClientComponentClient()
    if (!supabase || !userId) return

    setLoading(true)
    try {
      // Fetch user's actual confirmed bookings joined with trip data
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          trip_id,
          trips (id, name, duration, group_size, image_url, dates)
        `)
        .eq('user_id', userId)
        .eq('status', 'confirmed')

      if (error) throw error

      const today = new Date()
      const bucketed: { upcoming: Journey[], current: Journey[], past: Journey[] } = { upcoming: [], current: [], past: [] }

      if (bookingsData && bookingsData.length > 0) {
        bookingsData.forEach((b: any) => {
          if (!b.trips) return

          // For this prototype, we'll assume the trip starts 30 days from booking if no explicit trip date is supplied
          // In a real scenario, this would check b.trips.dates or a specific booked_date column
          const tripStartDate = b.trips.dates && b.trips.dates.length > 0 ? parseISO(b.trips.dates[0].start) : addDays(parseISO(b.created_at), 30)
          const tripEndDate = addDays(tripStartDate, b.trips.duration || 5)

          let stateStatus: 'upcoming' | 'current' | 'past' = 'past'

          if (isAfter(tripStartDate, today)) {
            stateStatus = 'upcoming'
          } else if (isWithinInterval(today, { start: tripStartDate, end: tripEndDate })) {
            stateStatus = 'current'
          }

          const j: Journey = {
            id: b.trips.id,
            bookingId: b.id,
            type: 'trip',
            title: b.trips.name || 'Unknown Trip',
            image: b.trips.image_url || '/highlights/spiti-sunset.jpg',
            date: tripStartDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            rawDate: tripStartDate.toISOString(),
            endDate: tripEndDate.toISOString(),
            duration: b.trips.duration || 0,
            people: b.trips.group_size || 0,
            memories: [], // Could be fetched separately from the memories table
            status: stateStatus
          }

          bucketed[stateStatus].push(j)
        })
      }

      // Sort logic
      bucketed.upcoming.sort((a, b) => parseISO(a.rawDate).getTime() - parseISO(b.rawDate).getTime())
      bucketed.past.sort((a, b) => parseISO(b.rawDate).getTime() - parseISO(a.rawDate).getTime())

      setJourneys(bucketed)
    } catch (err) {
      console.error('Error fetching journeys:', err)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">Syncing your timeline...</p>
      </div>
    )
  }

  return (
    <div className="space-y-24 pb-24">
      {userId && (
        <>
          <UserOnboarding userId={userId} />
          <WhatsappRequirement userId={userId} />
        </>
      )}

      {/* ═══ 1. COMMAND CENTER (Upcoming / Current) ═══ */}
      {(journeys.upcoming.length > 0 || journeys.current.length > 0) && (
        <section className="relative -mt-12 px-2">

          {journeys.current.map((trip, i) => (
            <motion.div
              key={`curr-${trip.id}-${i}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-card border border-primary/20 shadow-[0_0_40px_rgba(230,184,115,0.1)] p-1 mb-8"
            >
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <div className="relative bg-background/80 backdrop-blur-xl rounded-[22px] p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Happening Now</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">{trip.title}</h2>
                  <p className="text-muted-foreground font-sans max-w-md">You are currently immersed in this journey. Disconnect, explore, and soak it all in. We'll be here when you get back.</p>
                </div>
              </div>
            </motion.div>
          ))}

          {journeys.upcoming.map((trip, i) => (
            <motion.div
              key={`up-${trip.id}-${i}`}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="group relative overflow-hidden rounded-3xl border border-muted-foreground/20 hover:border-primary/30 transition-all duration-500 min-h-[400px] flex items-end p-6 md:p-10 mb-8"
            >
              {/* Parallax Background */}
              <Image src={trip.image} alt={trip.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

              <div className="relative w-full flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">Upcoming Expedition</span>
                  <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-4 leading-tight">{trip.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm font-sans text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {trip.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {trip.duration} Days</span>
                  </div>
                </div>

                <div className="w-full md:w-auto p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-muted-foreground/20 flex flex-col items-center justify-center min-w-[200px]">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Starts In</p>
                  <p className="font-serif text-4xl text-primary">{formatDistanceToNow(parseISO(trip.rawDate), { addSuffix: false }).replace('about ', '')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}


      {/* ═══ 2. ARCHIVED MEMORIES (Past) ═══ */}
      <section className="relative">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-foreground mb-2">The Archive</h2>
            <p className="font-sans text-muted-foreground">Stories written in miles and memories.</p>
          </div>

          {journeys.past.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-3xl">
              <p className="font-serif text-xl text-muted-foreground mb-2">No past journeys yet.</p>
              <p className="font-sans text-sm text-muted-foreground/60 max-w-sm mx-auto">Once you complete an expedition with us, your memories, photos, and campfire stories will live here forever.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journeys.past.map((exp, i) => (
                <motion.div
                  key={`past-${exp.id}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col bg-card border border-muted-foreground/10 hover:border-primary/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Social Hover Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Link href={`/return/memories/${exp.id}`} className="w-full px-4 py-3 bg-primary/90 backdrop-blur-md text-background rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-primary transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Campfire Feed
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-foreground mb-1 group-hover:text-primary transition-colors">{exp.title}</h3>
                      <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider mb-4">
                        {exp.date} &nbsp;•&nbsp; {exp.duration} Days
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ 3. UPSELL FOR NEXT BOOKING ═══ */}
      <section className="py-12 border-t border-muted-foreground/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Where to next?</h3>
              <p className="font-sans text-muted-foreground">Curated based on your travel style</p>
            </div>
            <Link href="/all-trips" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
              <span className="font-sans text-sm font-semibold tracking-wider uppercase">Explore all journeys</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendedTrips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id} className="group flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-muted-foreground/5 hover:border-primary/20 hover:bg-card transition-all">
                <div className="relative w-full md:w-32 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                  <Image src={trip.image_url || "/highlights/spiti-sunset.jpg"} alt={trip.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{trip.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{trip.duration} Days • {trip.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
