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
import { Magnetic } from '../ui/magnetic'

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
      <div className="py-48 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary mb-8" 
        />
        <p className="text-[10px] text-muted-foreground/30 font-bold tracking-[0.4em] uppercase">Syncing your timeline</p>
      </div>
    )
  }


  return (
    <div className="space-y-40 pb-40">
      {userId && (
        <div className="space-y-12">
          <UserOnboarding userId={userId} />
          <WhatsappRequirement userId={userId} />
        </div>
      )}

      {/* ═══ 1. COMMAND CENTER (Upcoming / Current) ═══ */}
      {(journeys.upcoming.length > 0 || journeys.current.length > 0) && (
        <section className="space-y-8">
          {journeys.current.map((trip, i) => (
            <motion.div
              key={`curr-${trip.id}-${i}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-[3rem] glass p-1 shadow-2xl"
            >
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <div className="relative bg-background/40 backdrop-blur-3xl rounded-[2.8rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }} />
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"></span>
                    </span>
                    <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase">Living Narrative</span>
                  </div>
                  <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-tightest leading-[0.9]">{trip.title}</h2>
                  <p className="text-muted-foreground/60 font-serif italic text-xl lowercase max-w-lg leading-relaxed">
                    You are existing within this story right now. Every mile is a sentence, every person a new character. Breathe it in.
                  </p>
                </div>

                <div className="relative z-10 w-full md:w-auto">
                    <Magnetic strength={0.1}>
                        <Link 
                            href={`/return/memories/${trip.id}`}
                            className="group flex flex-col items-center justify-center p-12 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-700 aspect-square min-w-[240px]"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-2 font-bold group-hover:-translate-y-1 transition-transform">Contribute to</span>
                            <span className="font-serif text-3xl text-foreground">The Feed</span>
                            <ArrowRight className="h-5 w-5 mt-4 text-primary group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </Magnetic>
                </div>
              </div>
            </motion.div>
          ))}

          {journeys.upcoming.map((trip, i) => (
            <motion.div
              key={`up-${trip.id}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-background shadow-2xl min-h-[500px] flex items-end p-10 md:p-16"
            >
              {/* Parallax Background */}
              <div className="absolute inset-0 overflow-hidden">
                <Image 
                    src={trip.image} 
                    alt={trip.title} 
                    fill 
                    className="object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0" 
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>

              <div className="relative w-full flex flex-col md:flex-row items-end justify-between gap-12 z-10">
                <div className="max-w-2xl">
                  <span className="inline-block px-4 py-1.5 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Upcoming Expedition</span>
                  <h2 className="font-serif text-5xl md:text-8xl text-foreground mb-8 leading-[0.85] tracking-tightest">{trip.title}</h2>
                  <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {trip.date}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {trip.duration} Days</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Multiple Points</span>
                  </div>
                </div>

                <div className="w-full md:w-auto p-12 rounded-[2.5rem] glass shadow-2xl border border-white/5 flex flex-col items-center justify-center min-w-[280px]">
                  <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.4em] font-bold mb-4">Countdown</p>
                  <p className="font-serif text-5xl text-primary tracking-tighter">
                    {formatDistanceToNow(parseISO(trip.rawDate), { addSuffix: false }).replace('about ', '')}
                  </p>
                  <div className="mt-8 pt-8 border-t border-white/5 w-full text-center">
                    <Link href={`/trips/${trip.id}`} className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/20 hover:text-foreground transition-colors">Review Dossier</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}


      {/* ═══ 2. ARCHIVED MEMORIES (Past) ═══ */}
      <section className="space-y-16">
        <div className="flex items-end justify-between border-b border-white/5 pb-12">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-bold mb-4">Chronicle</p>
                <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest">The <span className="text-foreground/30 italic">Archive</span></h2>
                <p className="mt-6 text-muted-foreground/40 font-serif italic text-xl lowercase">Stories written in miles and quiet epiphanies.</p>
            </div>
        </div>

        {journeys.past.length === 0 ? (
          <div className="py-40 text-center rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01]">
            <p className="font-serif text-2xl text-muted-foreground/20 mb-2 lowercase italic">Empty pages awaiting ink.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {journeys.past.map((exp, i) => (
              <motion.div
                key={`past-${exp.id}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="group relative flex flex-col bg-background border border-white/5 hover:border-primary/20 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image 
                    src={exp.image} 
                    alt={exp.title} 
                    fill 
                    className="object-cover transition-transform duration-[4s] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent opacity-60" />
                  
                  {/* Metadata Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold mb-2">{exp.date}</p>
                    <h3 className="font-serif text-3xl text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">{exp.title}</h3>
                    
                    <div className="overflow-hidden">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <Link href={`/return/memories/${exp.id}`} className="flex-1 px-6 py-4 glass border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] rounded-full text-center hover:bg-white/10 transition-all">
                                Revisit Journey
                            </Link>
                        </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ 3. UPSELL FOR NEXT BOOKING ═══ */}
      <section className="pt-40 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-bold mb-4">Continuance</p>
            <h3 className="font-serif text-5xl text-foreground tracking-tightest">Where to <span className="text-foreground/30 italic">next?</span></h3>
            <p className="mt-4 text-muted-foreground/40 font-serif italic text-xl lowercase">Curated for your evolving travel style.</p>
          </div>
          <Magnetic strength={0.2}>
            <Link href="/all-trips" className="group flex items-center gap-6 px-10 py-6 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60 group-hover:text-primary transition-colors">Explore World</span>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-2 transition-transform" />
            </Link>
          </Magnetic>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {recommendedTrips.map((trip) => (
            <Link 
                href={`/trips/${trip.id}`} 
                key={trip.id} 
                className="group relative flex flex-col md:flex-row gap-8 p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/20 transition-all duration-700 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none grayscale" style={{ backgroundImage: "url('/noise.png')" }} />
              <div className="relative w-full md:w-48 aspect-square rounded-3xl overflow-hidden shrink-0 shadow-2xl">
                <Image src={trip.image_url || "/highlights/spiti-sunset.jpg"} alt={trip.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />
              </div>
              <div className="flex flex-col justify-center items-start gap-4">
                <span className="text-[9px] text-primary/40 uppercase tracking-[0.3em] font-bold">{trip.region}</span>
                <h4 className="font-serif text-3xl text-foreground group-hover:text-primary transition-colors tracking-tightest leading-none">{trip.name}</h4>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/20 font-bold">
                    <span>{trip.duration} Days</span>
                    <span className="w-1 h-1 rounded-full bg-white/5" />
                    <span>Open Dossier</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

