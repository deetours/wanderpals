'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, X, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'

interface TripFormProps {
  trip?: any
  onSuccess: () => void
}

export function TripForm({ trip, onSuccess }: TripFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<string>('basic')

  // ─── Basic Info ───
  const [formData, setFormData] = useState({
    name: trip?.name || '',
    tagline: trip?.tagline || '',
    description: trip?.description || '',
    region: trip?.region || '',
    terrain: trip?.terrain || '',
    duration: trip?.duration || 5,
    price: trip?.price || 0,
    group_size: trip?.group_size || 12,
    status: trip?.status || 'draft',
    image_url: trip?.image_url || '',
    is_featured: trip?.is_featured || false,
    show_on_all_trips: trip?.show_on_all_trips !== false,
    show_on_journeys: trip?.show_on_journeys || trip?.is_featured || false,
  })

  // ─── Itinerary Days ───
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string; image_url: string }[]>(
    trip?.itinerary || [{ day: 1, title: '', description: '', image_url: '' }]
  )

  // ─── Lists ───
  const [inclusions, setInclusions] = useState<string[]>(trip?.inclusions || [''])
  const [exclusions, setExclusions] = useState<string[]>(trip?.exclusions || [''])
  const [terms, setTerms] = useState<string[]>(trip?.terms || [''])
  const [thingsToCarry, setThingsToCarry] = useState<string[]>(trip?.things_to_carry || [''])
  const [dates, setDates] = useState<{ start: string; end: string; spots: number }[]>(
    trip?.dates || [{ start: '', end: '', spots: 10 }]
  )

  useEffect(() => {
    setSupabase(createClientComponentClient())
  }, [])

  // ─── Image Upload ───
  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    if (!supabase || !file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `trips/${fileName}`

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

  // ─── List Helpers ───
  const addListItem = (list: string[], setList: (l: string[]) => void) => setList([...list, ''])
  const removeListItem = (list: string[], setList: (l: string[]) => void, index: number) => setList(list.filter((_, i) => i !== index))
  const updateListItem = (list: string[], setList: (l: string[]) => void, index: number, value: string) => {
    const updated = [...list]
    updated[index] = value
    setList(updated)
  }

  // ─── Submit ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)

    try {
      const payload = {
        ...formData,
        is_featured: formData.show_on_journeys,
        itinerary: itinerary.filter(d => d.title.trim()),
        inclusions: inclusions.filter(i => i.trim()),
        exclusions: exclusions.filter(i => i.trim()),
        terms: terms.filter(i => i.trim()),
        things_to_carry: thingsToCarry.filter(i => i.trim()),
        dates: dates.filter(d => d.start.trim()),
      }

      if (trip?.id) {
        const { error } = await supabase.from('trips').update(payload).eq('id', trip.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('trips').insert([payload])
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

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'itinerary', label: `Itinerary (${itinerary.length} days)` },
    { id: 'inclusions', label: `Inclusions (${inclusions.filter(i => i.trim()).length})` },
    { id: 'exclusions', label: `Exclusions (${exclusions.filter(i => i.trim()).length})` },
    { id: 'terms', label: `Terms & Conditions (${terms.filter(i => i.trim()).length})` },
    { id: 'carry', label: `Things to Carry (${thingsToCarry.filter(i => i.trim()).length})` },
    { id: 'dates', label: `Dates & Availability (${dates.filter(d => d.start.trim()).length})` },
    { id: 'visibility', label: 'Visibility & Publishing' },
  ]

  const inputClass = "w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
  const labelClass = "block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-primary/10 rounded-2xl shadow-xl overflow-hidden">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-1 p-3 bg-background/50 border-b border-muted-foreground/10">
        {sections.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSection === s.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {/* ═══ BASIC INFO ═══ */}
        {activeSection === 'basic' && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Trip Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required placeholder="e.g. Spiti Valley Expedition" />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className={inputClass} placeholder="e.g. Silence, altitude, and shared roads" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description / Story</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} h-32 resize-y`} placeholder="Tell the story of this journey..." />
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Region</label>
                <input type="text" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className={inputClass} placeholder="e.g. Himachal Pradesh" />
              </div>
              <div>
                <label className={labelClass}>Terrain</label>
                <select value={formData.terrain} onChange={(e) => setFormData({ ...formData, terrain: e.target.value })} className={inputClass} required>
                  <option value="">Select terrain</option>
                  <option value="mountains">Mountains</option>
                  <option value="forest">Forest</option>
                  <option value="coast">Coast</option>
                  <option value="desert">Desert</option>
                  <option value="plateaus">Plateaus</option>
                  <option value="valleys">Valleys</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration (Days)</label>
                <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Max Group Size</label>
                <input type="number" value={formData.group_size} onChange={(e) => setFormData({ ...formData, group_size: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className={labelClass}>Hero Image</label>
              <div className="flex gap-3">
                <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={`${inputClass} flex-1`} placeholder="Paste image URL or upload" />
                <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl cursor-pointer hover:bg-primary/20 transition-all text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
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
          </div>
        )}

        {/* ═══ ITINERARY ═══ */}
        {activeSection === 'itinerary' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Add each day of the journey with a title, description, and optional image.</p>
            {itinerary.map((day, index) => (
              <div key={index} className="p-4 border border-muted-foreground/10 rounded-xl space-y-3 bg-background/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Day {index + 1}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => setItinerary(itinerary.filter((_, i) => i !== index))} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input type="text" value={day.title} onChange={(e) => { const u = [...itinerary]; u[index].title = e.target.value; setItinerary(u) }} className={inputClass} placeholder="Day title (e.g. Shimla to Narkanda)" />
                <textarea value={day.description} onChange={(e) => { const u = [...itinerary]; u[index].description = e.target.value; setItinerary(u) }} className={`${inputClass} h-20 resize-y`} placeholder="What happens on this day..." />
                <div className="flex gap-3 items-center">
                  <input type="url" value={day.image_url} onChange={(e) => { const u = [...itinerary]; u[index].image_url = e.target.value; setItinerary(u) }} className={`${inputClass} flex-1`} placeholder="Day image URL (optional)" />
                  <label className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-lg cursor-pointer hover:bg-primary/20 transition-all text-xs">
                    <ImageIcon className="h-3 w-3" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, (url) => { const u = [...itinerary]; u[index].image_url = url; setItinerary(u) })
                    }} />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '', image_url: '' }])} className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/5 transition-all w-full justify-center">
              <Plus className="h-4 w-4" /> Add Day {itinerary.length + 1}
            </button>
          </div>
        )}

        {/* ═══ INCLUSIONS ═══ */}
        {activeSection === 'inclusions' && (
          <ListEditor label="Inclusions" placeholder="e.g. All accommodation" items={inclusions} setItems={setInclusions} addItem={addListItem} removeItem={removeListItem} updateItem={updateListItem} />
        )}

        {/* ═══ EXCLUSIONS ═══ */}
        {activeSection === 'exclusions' && (
          <ListEditor label="Exclusions" placeholder="e.g. Personal expenses" items={exclusions} setItems={setExclusions} addItem={addListItem} removeItem={removeListItem} updateItem={updateListItem} />
        )}

        {/* ═══ TERMS ═══ */}
        {activeSection === 'terms' && (
          <ListEditor label="Terms & Conditions" placeholder="e.g. 50% refund on cancellation 7 days before" items={terms} setItems={setTerms} addItem={addListItem} removeItem={removeListItem} updateItem={updateListItem} />
        )}

        {/* ═══ THINGS TO CARRY ═══ */}
        {activeSection === 'carry' && (
          <ListEditor label="Things to Carry" placeholder="e.g. Warm jacket, sunscreen" items={thingsToCarry} setItems={setThingsToCarry} addItem={addListItem} removeItem={removeListItem} updateItem={updateListItem} />
        )}

        {/* ═══ DATES ═══ */}
        {activeSection === 'dates' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Add available travel dates and spots for each batch.</p>
            {dates.map((d, index) => (
              <div key={index} className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="text" value={d.start} onChange={(e) => { const u = [...dates]; u[index].start = e.target.value; setDates(u) }} className={inputClass} placeholder="e.g. Jun 15" />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input type="text" value={d.end} onChange={(e) => { const u = [...dates]; u[index].end = e.target.value; setDates(u) }} className={inputClass} placeholder="e.g. Jun 23" />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className={labelClass}>Spots</label>
                    <input type="number" value={d.spots} onChange={(e) => { const u = [...dates]; u[index].spots = parseInt(e.target.value) || 0; setDates(u) }} className={inputClass} />
                  </div>
                  {dates.length > 1 && <button type="button" onClick={() => setDates(dates.filter((_, i) => i !== index))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg mb-0.5"><X className="h-4 w-4" /></button>}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setDates([...dates, { start: '', end: '', spots: 10 }])} className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/5 transition-all w-full justify-center">
              <Plus className="h-4 w-4" /> Add Date Batch
            </button>
          </div>
        )}

        {/* ═══ VISIBILITY ═══ */}
        {activeSection === 'visibility' && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:bg-primary/10 transition-all">
                <input type="checkbox" checked={formData.show_on_all_trips} onChange={(e) => setFormData({ ...formData, show_on_all_trips: e.target.checked })} className="w-5 h-5 accent-primary" />
                <div>
                  <span className="text-sm font-semibold text-foreground">Show on All Trips Page</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Trip appears on the /all-trips browsing page</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/10 transition-all">
                <input type="checkbox" checked={formData.show_on_journeys} onChange={(e) => setFormData({ ...formData, show_on_journeys: e.target.checked })} className="w-5 h-5 accent-emerald-500" />
                <div>
                  <span className="text-sm font-semibold text-foreground">Show on Journeys Page</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Featured on the curated /journeys page</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="p-6 border-t border-muted-foreground/10 bg-background/30">
        <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-sans font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]">
          {loading ? 'Saving to Supabase...' : trip ? 'Update Expedition' : 'Create New Expedition'}
        </button>
      </div>
    </form>
  )
}

// ─── Reusable List Editor ───
function ListEditor({ label, placeholder, items, setItems, addItem, removeItem, updateItem }: {
  label: string; placeholder: string; items: string[]; setItems: (l: string[]) => void;
  addItem: (l: string[], s: (l: string[]) => void) => void;
  removeItem: (l: string[], s: (l: string[]) => void, i: number) => void;
  updateItem: (l: string[], s: (l: string[]) => void, i: number, v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Add each {label.toLowerCase()} item. These appear as bullet points on the trip detail page.</p>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input type="text" value={item} onChange={(e) => updateItem(items, setItems, index, e.target.value)} className="w-full px-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder={placeholder} />
          {items.length > 1 && <button type="button" onClick={() => removeItem(items, setItems, index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><X className="h-4 w-4" /></button>}
        </div>
      ))}
      <button type="button" onClick={() => addItem(items, setItems)} className="flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 rounded-xl text-primary text-sm hover:bg-primary/5 transition-all w-full justify-center">
        <Plus className="h-4 w-4" /> Add {label} Item
      </button>
    </div>
  )
}
