'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Users, BookOpen, MapPin, TrendingUp, IndianRupee, RefreshCcw } from 'lucide-react'

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalTrips: 0,
    totalStays: 0,
    totalRevenue: 0,
    totalLeads: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClientComponentClient()
    if (client) fetchStats(client)
  }, [])

  const fetchStats = async (client: any) => {
    setLoading(true)
    try {
      // Use profiles table (not users) — profiles is what actually exists
      const [
        profilesRes,
        bookingsRes,
        tripsRes,
        staysRes,
        leadsRes,
      ] = await Promise.all([
        client.from('profiles').select('*', { count: 'exact', head: true }),
        client.from('bookings').select('id, status, total_amount, payment_status'),
        client.from('trips').select('*', { count: 'exact', head: true }),
        client.from('stays').select('*', { count: 'exact', head: true }),
        client.from('leads').select('*', { count: 'exact', head: true }),
      ])

      if (profilesRes.error) console.warn(`[ANALYTICS] profiles: ${profilesRes.error.message}`)
      if (bookingsRes.error) console.warn(`[ANALYTICS] bookings: ${bookingsRes.error.message}`)
      if (tripsRes.error) console.warn(`[ANALYTICS] trips: ${tripsRes.error.message}`)
      if (staysRes.error) console.warn(`[ANALYTICS] stays: ${staysRes.error.message}`)
      if (leadsRes.error) console.warn(`[ANALYTICS] leads: ${leadsRes.error.message}`)

      const bookingRows = bookingsRes.data || []
      const confirmed = bookingRows.filter((b: any) => b.status === 'confirmed')
      const revenue = confirmed.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)

      setStats({
        totalUsers: profilesRes.count || 0,
        totalBookings: bookingRows.length,
        confirmedBookings: confirmed.length,
        totalTrips: tripsRes.count || 0,
        totalStays: staysRes.count || 0,
        totalRevenue: revenue,
        totalLeads: leadsRes.count || 0,
      })
    } catch (err: any) {
      console.error('Analytics fetch error:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
        fullError: err
      })
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    const client = createClientComponentClient()
    if (client) fetchStats(client)
  }

  const cards = [
    { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/5 border-blue-400/10' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5 border-primary/10' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/5 border-green-400/10' },
    { label: 'Active Trips', value: stats.totalTrips, icon: MapPin, color: 'text-orange-400', bg: 'bg-orange-400/5 border-orange-400/10' },
    { label: 'Properties', value: stats.totalStays, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/5 border-purple-400/10' },
    { label: 'Leads', value: stats.totalLeads, icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-400/5 border-yellow-400/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Revenue Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(230,184,115,0.08),transparent_60%)] pointer-events-none" />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary/60 font-bold mb-3">Total Revenue Confirmed</p>
            <p className="font-serif text-5xl md:text-6xl text-foreground">
              {loading ? '—' : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <IndianRupee className="h-12 w-12 text-primary/20" />
            <button
              onClick={refresh}
              className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
              title="Refresh stats"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`p-6 rounded-2xl border ${card.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 font-bold">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.color} opacity-60`} />
            </div>
            <p className={`font-serif text-4xl ${card.color}`}>
              {loading ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
