'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, Edit2, Trash2, Globe, Users, Clock, MapPin, Eye } from 'lucide-react'
import { TripForm } from './trip-form'

export function TripsManager() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'archived'>('published')
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchTrips(client)
  }, [])

  const fetchTrips = async (client: any) => {
    const activeClient = client || supabase
    if (!activeClient) return

    setLoading(true)
    const { data } = await activeClient
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    setTrips(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (confirm('Delete this trip? This action cannot be undone.')) {
      await supabase.from('trips').delete().eq('id', id)
      fetchTrips(supabase)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-foreground">Expeditions Cache</h2>
        <button
          onClick={() => {
            setEditingTrip(null)
            setShowForm(!showForm)
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-sans font-semibold text-sm shadow-lg ${showForm
            ? 'bg-muted-foreground/10 text-muted-foreground'
            : 'bg-primary text-background hover:bg-primary/90 shadow-primary/20'
            }`}
        >
          <Plus className={`h-4 w-4 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Close Editor' : 'Direct New Expedition'}
        </button>
      </div>

      {/* Trip Form */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[3000px] opacity-100 mb-12' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
        <TripForm
          trip={editingTrip}
          onSuccess={() => {
            setShowForm(false)
            fetchTrips(supabase)
          }}
        />
      </div>

      {/* Tabs */}
      {!loading && trips.length > 0 && (
        <div className="flex items-center gap-4 border-b border-muted-foreground/10 pb-4 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {(['published', 'draft', 'archived'] as const).map((tab) => {
            const count = trips.filter(t => (t.status || 'draft') === tab).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 -mb-[17px] text-sm font-sans font-semibold transition-colors
                  ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <span className="capitalize">{tab}</span>
                <span className="ml-2 text-[10px] bg-muted-foreground/10 px-2 py-0.5 rounded-full">{count}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary),0.5)]" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse font-sans">Syncing with satellite data...</div>
        ) : trips.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-2xl">
            <p className="font-sans text-muted-foreground italic">No expeditions recorded. Click the button above to begin.</p>
          </div>
        ) : trips.filter(t => (t.status || 'draft') === activeTab).length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-2xl">
            <p className="font-sans text-muted-foreground italic">No {activeTab} expeditions found.</p>
          </div>
        ) : (
          trips
            .filter(t => (t.status || 'draft') === activeTab)
            .map((trip) => (
              <div
                key={trip.id}
                className="p-4 sm:p-6 bg-card border border-primary/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start flex-1">
                  {trip.image_url && (
                    <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-muted-foreground/10">
                      <img src={trip.image_url} alt={trip.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{trip.name || trip.title}</h3>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${trip.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {trip.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 bg-muted-foreground/5 px-2 py-1 rounded">
                        <Clock className="h-3 w-3" />
                        {trip.duration} Days
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted-foreground/5 px-2 py-1 rounded">
                        <Users className="h-3 w-3" />
                        Max {trip.group_size}
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted-foreground/5 px-2 py-1 rounded">
                        <Globe className="h-3 w-3" />
                        {trip.region || 'Remote'}
                      </div>
                      <div className="font-sans font-bold text-foreground bg-primary/10 px-2 py-1 rounded text-primary">
                        ₹{trip.price?.toLocaleString()}
                      </div>
                    </div>

                    {/* Visibility Badges */}
                    <div className="flex flex-wrap gap-2">
                      {trip.show_on_all_trips !== false && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-semibold uppercase tracking-wider">
                          <Eye className="h-3 w-3" /> All Trips
                        </span>
                      )}
                      {trip.is_featured && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-semibold uppercase tracking-wider">
                          <MapPin className="h-3 w-3" /> Journeys
                        </span>
                      )}
                      {trip.itinerary && trip.itinerary.length > 0 && (
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px] font-semibold uppercase tracking-wider">
                          {trip.itinerary.length}-Day Itinerary
                        </span>
                      )}
                      {trip.inclusions && trip.inclusions.length > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-semibold uppercase tracking-wider">
                          {trip.inclusions.length} Inclusions
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-muted-foreground/10">
                  <button
                    onClick={() => {
                      setEditingTrip(trip)
                      setShowForm(true)
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg hover:border-primary/50 transition-all font-sans text-xs font-semibold"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Archive/Delete Expedition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
