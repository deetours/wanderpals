'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Plus, Edit2, Trash2, MapPin, IndianRupee, Bed, Users, X, Eye, RefreshCcw } from 'lucide-react'
import { StayForm } from './stay-form'
import { motion, AnimatePresence } from 'framer-motion'

export function StaysManager() {
  const [stays, setStays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingStay, setEditingStay] = useState<any>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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

  const openEditor = (stay: any = null) => {
    setEditingStay(stay)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setEditingStay(null), 300)
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (confirm('Delete this stay? This action cannot be undone.')) {
      await supabase.from('stays').delete().eq('id', id)
      fetchStays()
    }
  }

  const toggleStatus = async (stay: any) => {
    if (!supabase) return
    const newStatus = stay.status === 'published' ? 'draft' : 'published'
    setTogglingId(stay.id)
    await supabase.from('stays').update({ status: newStatus }).eq('id', stay.id)
    setStays(prev => prev.map(s => s.id === stay.id ? { ...s, status: newStatus } : s))
    setTogglingId(null)
  }

  return (
    <div className="relative">
      {/* ── Slide-Over Drawer ──────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-white/5 z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/40 font-bold mb-1">
                    {editingStay ? 'Editing Stay' : 'New Stay'}
                  </p>
                  <h3 className="font-serif text-xl text-foreground">
                    {editingStay?.name || 'New Property'}
                  </h3>
                </div>
                <button onClick={closeDrawer} className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <StayForm
                  stay={editingStay}
                  onSuccess={() => {
                    closeDrawer()
                    fetchStays()
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────── */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-foreground">Stays & Retreats</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">
              {stays.length} total · {stays.filter(s => s.status === 'published').length} live
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchStays()}
              className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditor(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-background hover:bg-primary/90 transition-all font-sans font-semibold text-sm shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              Add New Stay
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse font-sans">Loading stays...</div>
          ) : stays.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-muted-foreground/10 rounded-2xl">
              <p className="font-sans text-muted-foreground italic mb-4">No stays yet.</p>
              <button
                onClick={() => openEditor(null)}
                className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all"
              >
                <Plus className="h-4 w-4 inline mr-2" />Create your first property
              </button>
            </div>
          ) : (
            stays.map((stay) => (
              <div key={stay.id} className="group p-4 sm:p-5 bg-card border border-white/5 rounded-2xl hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {stay.image_url && (
                    <div className="w-full sm:w-20 h-36 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                      <img src={stay.image_url} alt={stay.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{stay.name}</h3>
                      <button
                        onClick={() => toggleStatus(stay)}
                        disabled={togglingId === stay.id}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${stay.status === 'published'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                          } disabled:opacity-50`}
                      >
                        {togglingId === stay.id ? '…' : stay.status === 'published' ? '● Live' : '○ Draft'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {stay.location && <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded"><MapPin className="h-3 w-3" />{stay.location}</span>}
                      <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded"><Bed className="h-3 w-3" />{stay.room_type || 'Room'}</span>
                      {stay.capacity && <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded"><Users className="h-3 w-3" />{stay.capacity} guests</span>}
                      <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">₹{stay.price?.toLocaleString('en-IN')}/night</span>
                    </div>
                    {stay.tagline && <p className="text-xs text-muted-foreground italic truncate">{stay.tagline}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => openEditor(stay)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Details
                  </button>
                  <a
                    href={`/stays/${stay.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] text-muted-foreground border border-white/5 rounded-xl hover:text-foreground hover:border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </a>
                  <button
                    onClick={() => handleDelete(stay.id)}
                    className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/20 rounded-xl transition-all"
                    title="Delete Stay"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
