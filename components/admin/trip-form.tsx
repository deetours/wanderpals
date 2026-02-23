'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'

interface TripFormProps {
  trip?: any
  onSuccess: () => void
}

export function TripForm({ trip, onSuccess }: TripFormProps) {
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    description: trip?.description || '',
    region: trip?.region || '',
    duration: trip?.duration || 5,
    price: trip?.price || 0,
    max_group_size: trip?.max_group_size || 12,
    status: trip?.status || 'draft',
    image_url: trip?.image_url || '',
    is_featured: trip?.is_featured || false,
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
        const { error } = await supabase
          .from('trips')
          .update(formData)
          .eq('id', trip.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('trips').insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (error: any) {
      console.error('Save error:', error)
      alert(`Error saving trip: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-card border border-primary/10 rounded-2xl space-y-6 shadow-xl">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Trip Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            required
            placeholder="e.g. Spiti Valley Expedition"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Region</label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none transition-all"
            placeholder="e.g. Himachal Pradesh"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground h-32 resize-none focus:border-primary outline-none transition-all"
          placeholder="Tell the story of this journey..."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Duration (Days)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Max Group Size</label>
          <input
            type="number"
            value={formData.max_group_size}
            onChange={(e) => setFormData({ ...formData, max_group_size: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none font-sans"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none transition-all"
            placeholder="Direct link to primary image"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground focus:border-primary outline-none appearance-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          className="w-5 h-5 cursor-pointer"
        />
        <label htmlFor="is_featured" className="text-sm font-semibold text-foreground cursor-pointer">
          Featured on Journeys Page
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-sans font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
      >
        {loading ? 'Committing to database...' : trip ? 'Update Expedition' : 'Initialize New Expedition'}
      </button>
    </form>
  )
}
