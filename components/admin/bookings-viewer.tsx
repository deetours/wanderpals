'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

export function BookingsViewer() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        trip:trips(name),
        stay:stays(name)
      `)
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-muted-foreground">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-muted-foreground/10">
                <th className="text-left py-2 px-4 font-semibold text-foreground">User</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Experience</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Type</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-muted-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="py-3 px-4 text-foreground">{booking.user_email}</td>
                  <td className="py-3 px-4 text-foreground">
                    {booking.trip?.name || booking.stay?.name}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {booking.booking_type === 'trip' ? 'Trip' : 'Stay'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize text-muted-foreground">{booking.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
