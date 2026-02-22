'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface StayFormProps {
  stay?: any
  onSuccess: () => void
}

export function StayForm({ stay, onSuccess }: StayFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const [formData, setFormData] = useState({
    name: stay?.name || '',
    location: stay?.location || '',
    tagline: stay?.tagline || '',
    price: stay?.price || 0,
    room_type: stay?.room_type || 'Dorm',
    description: stay?.description || '',
    image_url: stay?.image_url || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (stay?.id) {
        await supabase
          .from('stays')
          .update(formData)
          .eq('id', stay.id)
      } else {
        await supabase.from('stays').insert([formData])
      }
      onSuccess()
    } catch (error) {
      alert('Error saving stay')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-muted-foreground/10 rounded space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Name
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
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded text-foreground"
          />
        </div>
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
        {loading ? 'Saving...' : stay ? 'Update Stay' : 'Create Stay'}
      </button>
    </form>
  )
}
