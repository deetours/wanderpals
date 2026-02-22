'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'

interface TripFormProps {
  trip?: any
  onSuccess: () => void
}

export function TripForm({ trip, onSuccess }: TripFormProps) {
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  const [formData, setFormData] = useState({
    name: trip?.name || '',
    tagline: trip?.tagline || '',
    duration: trip?.duration || '5 days',
    group_size: trip?.group_size || '8-12',
    price: trip?.price || 0,
    description: trip?.description || '',
    region: trip?.region || '',
    image_url: trip?.image_url || '',
  })

  useEffect(() => {
    setSupabase(createClientComponentClient())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      alert('Supabase not initialized')
      return
    }
    
    setLoading(true)

    try {
      if (trip?.id) {
        await supabase
          .from('trips')
          .update(formData)
          .eq('id', trip.id)
      } else {
        await supabase.from('trips').insert([formData])
      }
      onSuccess()
    } catch (error) {
      alert('Error saving trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-muted-foreground/10 rounded space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Trip Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Duration
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-background rounded hover:bg-primary/90 transition-colors font-sans disabled:opacity-50"
      >
        {loading ? 'Saving...' : trip ? 'Update Trip' : 'Create Trip'}
      </button>
    </form>
  )
}
