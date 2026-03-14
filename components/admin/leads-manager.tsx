'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search, RefreshCcw, Filter, LayoutGrid, List as ListIcon,
  Phone, Mail, MessageCircle, X, ChevronRight, Clock,
  Tag, Send, Trash2, User, Star, Download, Plus,
  CheckCircle2, AlertCircle, XCircle, ArrowRight, Zap,
  Calendar, TrendingUp, Users, Archive
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Lead {
  id: string
  created_at: string
  name?: string
  full_name?: string
  email?: string
  phone_number?: string
  message?: string
  source?: string
  status: string
  notes?: string
  trip_interest?: string
  stay_interest?: string
  metadata?: Record<string, any>
}

interface ActivityEntry {
  time: string
  action: string
  author?: string
}

// ─── Pipeline Stages ────────────────────────────────────────────────────────
const PIPELINE = [
  { id: 'new', label: 'New', color: 'bg-primary/20 text-primary border-primary/30', dot: 'bg-primary' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  { id: 'interested', label: 'Interested', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  { id: 'converted', label: 'Converted', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400' },
]

function getStage(status: string) {
  return PIPELINE.find(p => p.id === status) || PIPELINE[0]
}

// ─── Export CSV ─────────────────────────────────────────────────────────────
function exportCSV(leads: Lead[]) {
  const headers = ['Name', 'Phone', 'Email', 'Status', 'Source', 'Trip Interest', 'Notes', 'Created']
  const rows = leads.map(l => [
    l.name || l.full_name || '',
    l.phone_number || '',
    l.email || '',
    l.status,
    l.source || '',
    l.trip_interest || l.stay_interest || '',
    (l.notes || '').replace(/\n/g, ' | '),
    new Date(l.created_at).toLocaleDateString('en-IN'),
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `wanderpals-leads-${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

// ─── Lead Detail Drawer ─────────────────────────────────────────────────────
function LeadDrawer({ lead, onClose, onUpdate, onDelete }: {
  lead: Lead
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Lead>) => void
  onDelete: (id: string) => void
}) {
  const [notes, setNotes] = useState(lead.notes || '')
  const [saving, setSaving] = useState(false)
  const [activity, setActivity] = useState<ActivityEntry[]>(
    lead.metadata?.activity || []
  )
  const [newComment, setNewComment] = useState('')
  const notesTimeout = useRef<any>(null)
  const displayName = lead.name || lead.full_name || 'Unknown Lead'

  // Auto-save notes
  const handleNotesChange = (val: string) => {
    setNotes(val)
    clearTimeout(notesTimeout.current)
    notesTimeout.current = setTimeout(async () => {
      setSaving(true)
      await onUpdate(lead.id, { notes: val })
      setSaving(false)
    }, 800)
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    const entry: ActivityEntry = {
      time: new Date().toISOString(),
      action: newComment.trim(),
      author: 'Admin',
    }
    const updatedActivity = [...activity, entry]
    setActivity(updatedActivity)
    setNewComment('')
    await onUpdate(lead.id, { metadata: { ...(lead.metadata || {}), activity: updatedActivity } })
  }

  const changeStatus = async (newStatus: string) => {
    const entry: ActivityEntry = { time: new Date().toISOString(), action: `Status changed → ${newStatus}`, author: 'Admin' }
    const updatedActivity = [...activity, entry]
    setActivity(updatedActivity)
    await onUpdate(lead.id, { status: newStatus, metadata: { ...(lead.metadata || {}), activity: updatedActivity } })
  }

  const whatsappUrl = lead.phone_number
    ? `https://wa.me/${lead.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${displayName}! This is Wanderpals team 🌿`)}`
    : null

  const stage = getStage(lead.status)

  return (
    <div className="flex flex-col h-full">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${stage.color}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${stage.dot}`} />
                {stage.label}
              </span>
              {lead.source && (
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {lead.source}
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl text-foreground truncate">{displayName}</h3>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">
              {new Date(lead.created_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Quick Contact */}
        <div className="grid grid-cols-3 gap-2">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 hover:bg-green-500/20 transition-all text-[10px] font-bold uppercase tracking-widest">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          )}
          {lead.phone_number && (
            <a href={`tel:${lead.phone_number}`}
              className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all text-[10px] font-bold uppercase tracking-widest">
              <Phone className="h-5 w-5" />
              Call
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}?subject=Wanderpals Trip Inquiry`}
              className="flex flex-col items-center gap-1.5 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-all text-[10px] font-bold uppercase tracking-widest">
              <Mail className="h-5 w-5" />
              Email
            </a>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Contact Info</p>
          <div className="bg-card border border-white/5 rounded-xl divide-y divide-white/5">
            {lead.phone_number && (
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                <span className="text-foreground">{lead.phone_number}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                <span className="text-foreground">{lead.email}</span>
              </div>
            )}
            {lead.trip_interest && (
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <Tag className="h-4 w-4 text-primary/60 shrink-0" />
                <span className="text-primary">Interest: {lead.trip_interest}</span>
              </div>
            )}
            {lead.stay_interest && (
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <Tag className="h-4 w-4 text-emerald-400/60 shrink-0" />
                <span className="text-emerald-400">Stay: {lead.stay_interest}</span>
              </div>
            )}
          </div>
        </div>

        {/* Original Message */}
        {lead.message && (
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Original Message</p>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-muted-foreground italic leading-relaxed">
              "{lead.message}"
            </div>
          </div>
        )}

        {/* Pipeline Mover */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Move to Stage</p>
          <div className="flex gap-1.5 flex-wrap">
            {PIPELINE.map(stage => (
              <button
                key={stage.id}
                onClick={() => changeStatus(stage.id)}
                disabled={lead.status === stage.id}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${lead.status === stage.id
                    ? stage.color
                    : 'border-white/5 text-muted-foreground/50 hover:border-white/20 hover:text-foreground'
                  }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes — Auto-save */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Notes</p>
            {saving && <span className="text-[9px] text-muted-foreground/30 tracking-widest uppercase">Saving…</span>}
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-card border border-white/5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none resize-none"
            placeholder="Add notes about this lead — auto-saved every keystroke…"
          />
        </div>

        {/* Activity Timeline */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Activity Log</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="text-xs text-muted-foreground/30 italic px-1">No activity yet. Changes and comments will appear here.</p>
            ) : (
              [...activity].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-0.5" />
                    {i < activity.length - 1 && <div className="w-px flex-1 bg-white/5" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-foreground">{entry.action}</p>
                    <p className="text-muted-foreground/30 text-[10px] mt-0.5">
                      {entry.author && <span>{entry.author} · </span>}
                      {new Date(entry.time).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2 mt-2">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComment()}
              className="flex-1 px-3 py-2 bg-card border border-white/5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none"
              placeholder="Add note or action comment…"
            />
            <button onClick={addComment} className="p-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-all">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-4 border-t border-white/5 shrink-0 flex gap-2">
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all text-xs font-bold uppercase tracking-widest">
            <MessageCircle className="h-4 w-4" /> Chat Now
          </a>
        )}
        <button
          onClick={() => { if (confirm('Remove this lead?')) { onDelete(lead.id); onClose() } }}
          className="p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/20 rounded-xl transition-all"
          title="Delete Lead"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Kanban Column ──────────────────────────────────────────────────────────
function KanbanColumn({ stage, leads, onSelectLead }: {
  stage: typeof PIPELINE[0]
  leads: Lead[]
  onSelectLead: (l: Lead) => void
}) {
  return (
    <div className="flex flex-col gap-2 min-w-[240px] max-w-[280px] shrink-0">
      <div className="flex items-center justify-between px-1 pb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stage.label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground/30 font-mono">{leads.length}</span>
      </div>
      <div className="space-y-2">
        {leads.length === 0 ? (
          <div className="h-16 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground/20">Empty</p>
          </div>
        ) : (
          leads.map(lead => (
            <button
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="w-full text-left p-3 bg-card border border-white/5 rounded-xl hover:border-primary/30 transition-all space-y-1.5 group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {lead.name || lead.full_name || 'Anonymous'}
              </p>
              {lead.phone_number && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Phone className="h-2.5 w-2.5" />{lead.phone_number}
                </p>
              )}
              {(lead.trip_interest || lead.stay_interest) && (
                <p className="text-[10px] text-primary/70 truncate">{lead.trip_interest || lead.stay_interest}</p>
              )}
              <p className="text-[9px] text-muted-foreground/30">{new Date(lead.created_at).toLocaleDateString('en-IN')}</p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main CRM Component ─────────────────────────────────────────────────────
export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => { fetchLeads() }, [])

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/leads')
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Failed to load leads'); setLeads([]) }
      else setLeads(json.data || [])
    } catch (err: any) {
      setError(err.message || 'Network error'); setLeads([])
    } finally { setLoading(false) }
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, ...updates } : prev)
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
  }

  const deleteLead = async (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id))
    await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' })
  }

  const openLead = (lead: Lead) => { setSelectedLead(lead); setDrawerOpen(true) }
  const closeLead = () => { setDrawerOpen(false); setTimeout(() => setSelectedLead(null), 300) }

  const filtered = leads.filter(l => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (l.name || l.full_name || '').toLowerCase().includes(q) ||
      (l.phone_number || '').includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.trip_interest || '').toLowerCase().includes(q) ||
      (l.notes || '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    hot: leads.filter(l => l.status === 'interested').length,
    converted: leads.filter(l => l.status === 'converted').length,
    thisWeek: leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 86400000)).length,
  }

  return (
    <div className="relative">
      {/* ── Lead Detail Slide-Over ───────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeLead}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-white/5 z-50 shadow-2xl"
            >
              <LeadDrawer
                lead={selectedLead}
                onClose={closeLead}
                onUpdate={updateLead}
                onDelete={deleteLead}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* ── Stats Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-foreground' },
            { label: 'New This Week', value: stats.thisWeek, icon: Zap, color: 'text-primary' },
            { label: 'Hot Prospects', value: stats.hot, icon: TrendingUp, color: 'text-amber-400' },
            { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-card border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color} opacity-60`} />
                <p className={`font-serif text-2xl ${stat.color}`}>{loading ? '—' : stat.value}</p>
              </div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground/40 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            ⚠️ {error} — check that <code>SUPABASE_SERVICE_ROLE_KEY</code> is set in <code>.env.local</code>
          </div>
        )}

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-white/5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none"
              placeholder="Search by name, phone, trip interest…"
            />
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View toggle */}
            <div className="flex p-1 bg-card border border-white/5 rounded-lg">
              <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}><ListIcon className="h-4 w-4" /></button>
              <button onClick={() => setView('kanban')} className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}><LayoutGrid className="h-4 w-4" /></button>
            </div>
            <button onClick={() => exportCSV(filtered)} className="p-2.5 border border-white/5 bg-card rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all" title="Export CSV"><Download className="h-4 w-4" /></button>
            <button onClick={fetchLeads} className="p-2.5 border border-white/5 bg-card rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"><RefreshCcw className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...PIPELINE.map(p => p.id)].map(s => {
            const count = s === 'all' ? leads.length : leads.filter(l => l.status === s).length
            const stage = PIPELINE.find(p => p.id === s)
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${filterStatus === s
                    ? (s === 'all' ? 'bg-foreground/10 text-foreground border-foreground/20' : stage?.color || '')
                    : 'border-white/5 text-muted-foreground/40 hover:text-foreground hover:border-white/10'
                  }`}
              >
                {s} <span className="ml-1 opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        {/* ── Kanban View ─────────────────────────────────── */}
        {view === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-h-64">
              {PIPELINE.map(stage => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={filtered.filter(l => l.status === stage.id)}
                  onSelectLead={openLead}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── List View ───────────────────────────────────── */}
        {view === 'list' && (
          <div className="space-y-2">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground animate-pulse">Loading leads…</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-muted-foreground italic">No leads found.</p>
              </div>
            ) : (
              filtered.map(lead => {
                const stage = getStage(lead.status)
                const name = lead.name || lead.full_name || 'Anonymous'
                return (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className="w-full text-left p-4 bg-card border border-white/5 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {name[0].toUpperCase()}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">{name}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${stage.color}`}>
                            {stage.label}
                          </span>
                          {lead.source && (
                            <span className="text-[9px] text-muted-foreground/40 uppercase tracking-widest">{lead.source}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          {lead.phone_number && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone_number}</span>}
                          {lead.email && <span className="flex items-center gap-1 truncate max-w-[160px]"><Mail className="h-3 w-3" />{lead.email}</span>}
                          {(lead.trip_interest || lead.stay_interest) && (
                            <span className="text-primary/70">↳ {lead.trip_interest || lead.stay_interest}</span>
                          )}
                        </div>
                        {lead.notes && <p className="mt-1 text-[11px] text-muted-foreground/40 italic truncate">"{lead.notes}"</p>}
                      </div>
                      {/* Meta */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-[10px] text-muted-foreground/30">{new Date(lead.created_at).toLocaleDateString('en-IN')}</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/20 mt-1 ml-auto group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
