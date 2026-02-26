'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, Edit2, Trash2, MapPin, IndianRupee, Bed, Users } from 'lucide-react'
import { StayForm } from './stay-form'

export function StaysManager() {
  const [stays, setStays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStay, setEditingStay] = useState<any>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchStays(client)
  }, [])

  const fetchStays = async (client?: any) => {
    const activeClient = client || supabase
    if (!activeClient) return
    setLoading(true)
    const { data } = await activeClient
      .from('stays')
      .select('*')
      .order('created_at', { ascending: false })
    setStays(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (confirm('Delete this stay? This action cannot be undone.')) {
      await supabase.from('stays').delete().eq('id', id)
      fetchStays(supabase)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Stays & Retreats</h2>
        <button
          onClick={() => { setEditingStay(null); setShowForm(!showForm) }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-sans font-semibold text-sm shadow-lg ${showForm ? 'bg-muted-foreground/10 text-muted-foreground' : 'bg-primary text-background hover:bg-primary/90 shadow-primary/20'
            }`}
        >
          <Plus className={`h-4 w-4 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Close Editor' : 'Add New Stay'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[2000px] opacity-100 mb-12' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <StayForm stay={editingStay} onSuccess={() => { setShowForm(false); fetchStays(supabase) }} />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse font-sans">Loading stays...</div>
        ) : stays.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-2xl">
            <p className="font-sans text-muted-foreground italic">No stays yet. Create your first one!</p>
          </div>
        ) : (
          stays.map((stay) => (
            <div key={stay.id} className="p-6 bg-card border border-primary/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="flex gap-4 items-start flex-1">
                {stay.image_url && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-muted-foreground/10">
                    <img src={stay.image_url} alt={stay.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{stay.name}</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${stay.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {stay.status || 'draft'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {stay.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{stay.location}</span>}
                    <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{stay.price?.toLocaleString()}/night</span>
                    <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{stay.room_type || 'Room'}</span>
                    {stay.capacity && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stay.capacity} guests</span>}
                  </div>
                  {stay.tagline && <p className="text-xs text-muted-foreground italic">{stay.tagline}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-muted-foreground/10">
                <button onClick={() => { setEditingStay(stay); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg hover:border-primary/50 transition-all font-sans text-xs font-semibold">
                  <Edit2 className="h-3.5 w-3.5" />Edit
                </button>
                <button onClick={() => handleDelete(stay.id)} className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete Stay">
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
