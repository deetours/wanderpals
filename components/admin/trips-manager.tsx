'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { TripForm } from './trip-form'

export function TripsManager() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTrips()
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

  const handleDelete = async (id: string) => {
    if (confirm('Delete this trip? This action cannot be undone.')) {
      await supabase.from('trips').delete().eq('id', id)
      fetchTrips()
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Trip Button */}
      <div>
        <button
          onClick={() => {
            setEditingTrip(null)
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 transition-colors font-sans"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Trip'}
        </button>
      </div>

      {/* Trip Form */}
      {showForm && (
        <TripForm
          trip={editingTrip}
          onSuccess={() => {
            setShowForm(false)
            fetchTrips()
          }}
        />
      )}

      {/* Trips List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-muted-foreground">No trips yet. Create your first one!</p>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="p-6 bg-card border border-muted-foreground/10 rounded flex items-center justify-between"
            >
              <div>
                <h3 className="font-serif text-lg text-foreground">{trip.name}</h3>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {trip.duration} • {trip.group_size} travellers • From ₹{trip.price?.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTrip(trip)
                    setShowForm(true)
                  }}
                  className="p-2 hover:bg-foreground/10 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="p-2 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
