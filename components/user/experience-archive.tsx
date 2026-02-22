'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Bookmark, Share2, MessageCircle } from 'lucide-react'


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

// Keep mock data as fallback for now
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
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (userId) {
      fetchMemories()
    }
  }, [userId])

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
      // Stay with mock data on error
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
    <section className="py-12 px-6 md:px-16 lg:px-24">
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
  )
}

