'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { CheckCircle, Clock, XCircle, IndianRupee, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function BookingsViewer() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchBookings(client)
  }, [])

  const fetchBookings = async (client: any) => {
    if (!client) return
    setLoading(true)
    try {
      const { data, error } = await client
        .from('bookings')
        .select('*, trips(name, duration, region, price), stays(name, location, price)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setBookings(data || [])
    } catch (err: any) {
      console.error('Bookings fetch error:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
        fullError: err
      })
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings(supabase)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle className="h-3.5 w-3.5" />
    if (status === 'pending') return <Clock className="h-3.5 w-3.5" />
    if (status === 'cancelled') return <XCircle className="h-3.5 w-3.5" />
    return null
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', count: bookings.length, color: 'text-foreground' },
          { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length, color: 'text-green-400' },
          { label: 'Revenue', count: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl border border-white/5 bg-card text-center">
            <p className={`font-serif text-2xl ${s.color}`}>{loading ? '—' : s.count}</p>
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter pills + Refresh */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'glass text-muted-foreground/40 hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => supabase && fetchBookings(supabase)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs">
          <RefreshCcw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Booking rows */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-12 text-muted-foreground animate-pulse">Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground italic">No {filter === 'all' ? '' : filter} bookings.</p>
        ) : (
          filtered.map((booking) => {
            const experience = booking.trips?.name || booking.stays?.name || 'Unknown'
            const isExpanded = expandedId === booking.id
            return (
              <div key={booking.id} className="rounded-2xl border border-white/5 bg-card overflow-hidden">
                {/* Row header */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-foreground truncate">{experience}</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
                        {booking.trip_id ? 'Trip' : 'Stay'}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
                        {new Date(booking.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  {booking.total_amount ? (
                    <span className="font-serif text-foreground text-lg">₹{booking.total_amount.toLocaleString('en-IN')}</span>
                  ) : null}
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mb-1">Booking ID</p>
                            <p className="text-foreground font-mono text-xs truncate">{booking.id}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mb-1">Payment</p>
                            <p className="text-foreground capitalize">{booking.payment_status || 'unpaid'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mb-1">Amount</p>
                            <p className="text-foreground">₹{(booking.total_amount || 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-xs font-bold uppercase tracking-wider"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Confirm Booking
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-wider"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          )}
                          {booking.status === 'cancelled' && (
                            <button
                              onClick={() => updateStatus(booking.id, 'pending')}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl glass text-muted-foreground hover:text-foreground transition-all text-xs font-bold uppercase tracking-wider"
                            >
                              Restore to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
