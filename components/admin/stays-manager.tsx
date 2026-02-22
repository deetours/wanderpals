'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, Edit2, Trash2 } from 'lucide-react'
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

  const fetchStays = async (client: typeof supabase) => {
    if (!client) return
    setLoading(true)
    const { data } = await client
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
      if (supabase) fetchStays(supabase)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => {
            setEditingStay(null)
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 transition-colors font-sans"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Stay'}
        </button>
      </div>

      {showForm && (
        <StayForm
          stay={editingStay}
          onSuccess={() => {
            setShowForm(false)
            fetchStays()
          }}
        />
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading stays...</p>
        ) : stays.length === 0 ? (
          <p className="text-muted-foreground">No stays yet. Create your first one!</p>
        ) : (
          stays.map((stay) => (
            <div
              key={stay.id}
              className="p-6 bg-card border border-muted-foreground/10 rounded flex items-center justify-between"
            >
              <div>
                <h3 className="font-serif text-lg text-foreground">{stay.name}</h3>
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  {stay.location} • From ₹{stay.price?.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingStay(stay)
                    setShowForm(true)
                  }}
                  className="p-2 hover:bg-foreground/10 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(stay.id)}
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
