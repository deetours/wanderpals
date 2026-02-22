'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Bookmark, Share2, MessageCircle, ArrowRight } from 'lucide-react'
import { UserOnboarding } from './user-onboarding'

interface Experience {
  id: string
  type: 'trip' | 'stay'
  title: string
  image: string
  date: string
  duration: string
  people: number
  memories: string[]
  saved: boolean
}

const mockExperiences: Experience[] = [
  {
    id: '1',
    type: 'trip',
    title: 'Spiti Valley Expedition',
    image: '/highlights/spiti-sunset.jpg',
    date: 'Nov 2024',
    duration: '7 days',
    people: 12,
    memories: ['Campfire conversations', 'Sunrise hike', 'Local monk visit'],
    saved: true,
  },
  {
    id: '2',
    type: 'stay',
    title: 'Gokarna Hostel',
    image: '/highlights/gokarna-bonfire.jpg',
    date: 'Oct 2024',
    duration: '3 nights',
    people: 8,
    memories: ['Beach bonfire', 'Sunset walk', 'New friends'],
    saved: false,
  },
]

interface ExperienceArchiveProps {
  userId?: string
}

export function ExperienceArchive({ userId }: ExperienceArchiveProps) {
  const [data, setData] = useState<Experience[]>(mockExperiences)
  const [recommendedTrips, setRecommendedTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (userId) {
      fetchMemories()
      fetchRecommendations()
    }
  }, [userId])

  const fetchRecommendations = async () => {
    const supabase = createClientComponentClient()
    if (!supabase) return
    const { data } = await supabase.from('trips').select('*').eq('status', 'published').limit(2)
    setRecommendedTrips(data || [])
  }

  const fetchMemories = async () => {
    const supabase = createClientComponentClient()
    if (!supabase || !userId) return

    setLoading(true)
    try {
      const { data: dbMemories, error } = await supabase
        .from('memories')
        .select(`
          *,
          trips (title, duration, max_group_size)
        `)
        .eq('user_id', userId)

      if (error) throw error

      if (dbMemories && dbMemories.length > 0) {
        const transformedData: Experience[] = dbMemories.map((m: any) => ({
          id: m.id,
          type: 'trip',
          title: m.trips?.title || 'Unknown Trip',
          image: m.media_urls?.[0] || '/cozy-hostel-dorm-warm-lights-quiet-evening-mountai.jpg',
          date: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          duration: m.trips?.duration ? `${m.trips.duration} days` : 'TBD',
          people: m.trips?.max_group_size || 0,
          memories: m.content ? [m.content] : [],
          saved: false
        }))
        setData(transformedData)
      }
    } catch (err) {
      console.error('Error fetching memories:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground animate-pulse">Gathering your memories...</p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {userId && <UserOnboarding userId={userId} />}

      <section className="py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Your archive</h2>
          <p className="font-sans text-muted-foreground mb-8">Revisit your journeys anytime</p>

          <div className="grid md:grid-cols-2 gap-8">
            {data.map((exp) => (
              <div key={exp.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-card">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleSave(exp.id)}
                      className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${saved[exp.id]
                        ? 'bg-primary/20 text-primary'
                        : 'bg-background/20 text-foreground/60 hover:bg-background/40'
                        }`}
                    >
                      <Bookmark className={`h-4 w-4 ${saved[exp.id] ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-serif text-lg text-foreground">{exp.title}</p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {exp.date} • {exp.duration} • {exp.people} people
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.memories.map((memory, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {memory}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-muted-foreground/10">
                    <button className="flex-1 text-xs font-sans text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      View memories
                    </button>
                    <button className="flex-1 text-xs font-sans text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                      <Share2 className="h-3 w-3" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upsell for next booking */}
      <section className="py-12 border-t border-muted-foreground/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Where to next?</h3>
              <p className="font-sans text-muted-foreground">Specifically curated based on your previous expeditions</p>
            </div>
            <Link href="/all-trips" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
              <span className="font-sans text-sm font-semibold">Explore all journeys</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendedTrips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id} className="group flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-muted-foreground/5 hover:border-primary/20 hover:bg-card transition-all">
                <div className="relative w-full md:w-32 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                  <Image src="/highlights/spiti-sunset.jpg" alt={trip.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{trip.title}</h4>
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
