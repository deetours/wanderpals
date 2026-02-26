'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react'

interface StayFormProps {
  stay?: any
  onSuccess: () => void
}

export function StayForm({ stay, onSuccess }: StayFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: stay?.name || '',
    location: stay?.location || '',
    tagline: stay?.tagline || '',
    description: stay?.description || '',
    price: stay?.price || 0,
    room_type: stay?.room_type || 'Dorm',
    image_url: stay?.image_url || '',
    amenities: stay?.amenities || [''],
    gallery: stay?.gallery || [''],
    capacity: stay?.capacity || 4,
    status: stay?.status || 'draft',
  })

  useEffect(() => {
    setSupabase(createClientComponentClient())
  }, [])

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    if (!supabase || !file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `stays/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      callback(publicUrl)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)

    try {
      const payload = {
        ...formData,
        amenities: formData.amenities.filter((a: string) => a.trim()),
        gallery: formData.gallery.filter((g: string) => g.trim()),
      }

      if (stay?.id) {
        const { error } = await supabase.from('stays').update(payload).eq('id', stay.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('stays').insert([payload])
        if (error) throw error
      }
      onSuccess()
    } catch (error: any) {
      console.error('Save error:', error)
      alert(`Error saving stay: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
  const labelClass = "block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-primary/10 rounded-2xl space-y-6 shadow-xl">
      <h3 className="font-serif text-xl text-foreground">{stay ? 'Edit Stay' : 'Add New Stay'}</h3>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Stay Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required placeholder="e.g. Hillside Retreat" />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} placeholder="e.g. Manali, HP" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tagline</label>
        <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className={inputClass} placeholder="e.g. Where the mountains meet your soul" />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} h-28 resize-y`} placeholder="Describe the stay experience..." />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Price (₹/night)</label>
          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Room Type</label>
          <select value={formData.room_type} onChange={(e) => setFormData({ ...formData, room_type: e.target.value })} className={inputClass}>
            <option value="Dorm">Dorm</option>
            <option value="Private Room">Private Room</option>
            <option value="Cottage">Cottage</option>
            <option value="Tent">Tent</option>
            <option value="Villa">Villa</option>
            <option value="Treehouse">Treehouse</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Capacity</label>
          <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} className={inputClass} />
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <label className={labelClass}>Main Image</label>
        <div className="flex gap-3">
          <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={`${inputClass} flex-1`} placeholder="Paste URL or upload" />
          <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl cursor-pointer hover:bg-primary/20 transition-all text-sm font-medium">
            <Upload className="h-4 w-4" />
            {uploading ? '...' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file, (url) => setFormData({ ...formData, image_url: url }))
            }} />
          </label>
        </div>
        {formData.image_url && (
          <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-muted-foreground/20">
            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className={labelClass}>Gallery Images</label>
        <p className="text-xs text-muted-foreground mb-2">Add additional photos for the stay gallery.</p>
        {formData.gallery.map((url: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="url" value={url} onChange={(e) => { const g = [...formData.gallery]; g[index] = e.target.value; setFormData({ ...formData, gallery: g }) }} className={`${inputClass} flex-1`} placeholder="Image URL" />
            <label className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-all text-xs">
              <ImageIcon className="h-3 w-3" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file, (url) => { const g = [...formData.gallery]; g[index] = url; setFormData({ ...formData, gallery: g }) })
              }} />
            </label>
            {formData.gallery.length > 1 && <button type="button" onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_: any, i: number) => i !== index) })} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><X className="h-4 w-4" /></button>}
          </div>
        ))}
        <button type="button" onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ''] })} className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/5 transition-all w-full justify-center mt-2">
          <Plus className="h-4 w-4" /> Add Gallery Image
        </button>
      </div>

      {/* Amenities */}
      <div>
        <label className={labelClass}>Amenities</label>
        {formData.amenities.map((amenity: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={amenity} onChange={(e) => { const a = [...formData.amenities]; a[index] = e.target.value; setFormData({ ...formData, amenities: a }) }} className={`${inputClass} flex-1`} placeholder="e.g. Wi-Fi, Bonfire, Kitchen" />
            {formData.amenities.length > 1 && <button type="button" onClick={() => setFormData({ ...formData, amenities: formData.amenities.filter((_: any, i: number) => i !== index) })} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><X className="h-4 w-4" /></button>}
          </div>
        ))}
        <button type="button" onClick={() => setFormData({ ...formData, amenities: [...formData.amenities, ''] })} className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/5 transition-all w-full justify-center mt-2">
          <Plus className="h-4 w-4" /> Add Amenity
        </button>
      </div>

      {/* Status */}
      <div>
        <label className={labelClass}>Status</label>
        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-sans font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]">
        {loading ? 'Saving...' : stay ? 'Update Stay' : 'Create Stay'}
      </button>
    </form>
  )
}
