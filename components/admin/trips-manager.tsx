'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, Edit2, Trash2, Globe, Users, Clock, MapPin, Eye, X, RefreshCcw, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { TripForm } from './trip-form'
import { motion, AnimatePresence } from 'framer-motion'

export function TripsManager() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'archived'>('published')
  const [supabase, setSupabase] = useState<any>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchTrips(client)
  }, [])

  const fetchTrips = async (client?: any) => {
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

  const openEditor = (trip: any = null) => {
    setEditingTrip(trip)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setEditingTrip(null), 300) // wait for animation
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (confirm('Delete this trip? This action cannot be undone.')) {
      await supabase.from('trips').delete().eq('id', id)
      fetchTrips()
    }
  }

  const toggleStatus = async (trip: any) => {
    if (!supabase) return
    const newStatus = trip.status === 'published' ? 'draft' : 'published'
    setTogglingId(trip.id)
    await supabase.from('trips').update({ status: newStatus }).eq('id', trip.id)
    setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, status: newStatus } : t))
    setTogglingId(null)
  }

  const tabTrips = trips.filter(t => (t.status || 'draft') === activeTab)

  return (
    <div className="relative">
      {/* ── Slide-Over Drawer ──────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-white/5 z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/40 font-bold mb-1">
                    {editingTrip ? 'Editing Expedition' : 'New Expedition'}
                  </p>
                  <h3 className="font-serif text-xl text-foreground">
                    {editingTrip?.name || 'New Trip'}
                  </h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body — Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <TripForm
                  trip={editingTrip}
                  onSuccess={() => {
                    closeDrawer()
                    fetchTrips()
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────── */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-foreground">Expeditions Cache</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">
              {trips.length} total · {trips.filter(t => t.status === 'published').length} live
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchTrips()}
              className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
              title="Refresh"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditor(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-all font-sans font-semibold text-sm shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              New Expedition
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        {!loading && trips.length > 0 && (
          <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl w-fit">
            {(['published', 'draft', 'archived'] as const).map((tab) => {
              const count = trips.filter(t => (t.status || 'draft') === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground/40 hover:text-foreground'
                    }`}
                >
                  {tab} <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Trips List */}
        <div className="grid gap-3">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse font-sans">
              Syncing expeditions...
            </div>
          ) : tabTrips.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-2xl">
              <p className="font-sans text-muted-foreground italic mb-4">No {activeTab} expeditions.</p>
              <button
                onClick={() => openEditor(null)}
                className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all"
              >
                <Plus className="h-4 w-4 inline mr-2" />Create one now
              </button>
            </div>
          ) : (
            tabTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={() => openEditor(trip)}
                onDelete={() => handleDelete(trip.id)}
                onToggleStatus={() => toggleStatus(trip)}
                togglingId={togglingId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TripCard({ trip, onEdit, onDelete, onToggleStatus, togglingId }: {
  trip: any
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
  togglingId: string | null
}) {
  const isPublished = trip.status === 'published'
  const isToggling = togglingId === trip.id

  return (
    <div className="group p-4 sm:p-5 bg-card border border-white/5 rounded-2xl hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Thumbnail */}
        {trip.image_url && (
          <div className="w-full sm:w-20 h-36 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
            <img src={trip.image_url} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {trip.name || trip.title}
            </h3>
            {/* Live toggle */}
            <button
              onClick={onToggleStatus}
              disabled={isToggling}
              title={isPublished ? 'Set to Draft' : 'Publish'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${isPublished
                  ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                } disabled:opacity-50`}
            >
              {isToggling ? '…' : isPublished ? '● Live' : '○ Draft'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {trip.region && (
              <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded">
                <MapPin className="h-3 w-3" />{trip.region}
              </span>
            )}
            {trip.duration && (
              <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded">
                <Clock className="h-3 w-3" />{trip.duration}D
              </span>
            )}
            {trip.group_size && (
              <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded">
                <Users className="h-3 w-3" />Max {trip.group_size}
              </span>
            )}
            <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              ₹{trip.price?.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {trip.show_on_all_trips !== false && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/10">
                All Trips
              </span>
            )}
            {trip.is_featured && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/10">
                Journeys
              </span>
            )}
            {trip.itinerary?.length > 0 && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/10">
                {trip.itinerary.length}-Day Itinerary
              </span>
            )}
            {trip.inclusions?.length > 0 && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/10">
                {trip.inclusions.length} Inclusions
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Full Details
        </button>
        <a
          href={`/trips/${trip.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] text-muted-foreground border border-white/5 rounded-xl hover:text-foreground hover:border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </a>
        <button
          onClick={onDelete}
          className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/20 rounded-xl transition-all"
          title="Delete Trip"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
