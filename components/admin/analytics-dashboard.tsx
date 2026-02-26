'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Users, BookOpen, MapPin, TrendingUp } from 'lucide-react'

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTrips: 0,
    totalStays: 0,
  })
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchStats(client)
  }, [])

  const fetchStats = async (client: typeof supabase) => {
    if (!client) return
    setLoading(true)
    
    try {
      const { count: usersCount, error: usersError } = await client
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      const { count: bookingsCount, error: bookingsError } = await client
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      
      const { count: tripsCount, error: tripsError } = await client
        .from('trips')
        .select('*', { count: 'exact', head: true })
      
      const { count: staysCount, error: staysError } = await client
        .from('stays')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalUsers: usersCount || 0,
        totalBookings: bookingsCount || 0,
        totalTrips: tripsCount || 0,
        totalStays: staysCount || 0,
      })
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalTrips: 0,
        totalStays: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Bookings', value: stats.totalBookings, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Trips', value: stats.totalTrips, icon: MapPin, color: 'text-orange-500' },
    { label: 'Stays', value: stats.totalStays, icon: BookOpen, color: 'text-purple-500' },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-6 bg-card border border-muted-foreground/10 rounded"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">{card.label}</h3>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <p className="font-serif text-3xl text-foreground">
            {loading ? '-' : card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
