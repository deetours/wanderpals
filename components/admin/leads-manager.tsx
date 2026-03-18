'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { UserCheck, Clock, CheckCircle2, XCircle, RefreshCcw, Search, Phone, Mail, Trash2, MessageSquare } from 'lucide-react'

export function LeadsManager() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [supabase, setSupabase] = useState<any>(null)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const client = createClientComponentClient()
        setSupabase(client)
        fetchLeads(client)
    }, [])

    const fetchLeads = async (client?: any) => {
        const activeClient = client || supabase
        if (!activeClient) return
        setLoading(true)
        try {
            const { data, error } = await activeClient
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Leads fetch error:', error)
                setLeads([])
            } else {
                setLeads(data || [])
            }
        } catch (err) {
            console.error('Leads fetch exception:', err)
            setLeads([])
        } finally {
            setLoading(false)
        }
    }

    const updateLeadStatus = async (id: string, status: string) => {
        if (!supabase) return
        const { error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', id)

        if (!error) fetchLeads(supabase)
    }

    const updateLeadNotes = async (id: string, notes: string) => {
        if (!supabase) return
        await supabase
            .from('leads')
            .update({ notes })
            .eq('id', id)
    }

    const deleteLead = async (id: string) => {
        if (!supabase) return
        if (confirm('Remove this lead?')) {
            await supabase.from('leads').delete().eq('id', id)
            fetchLeads(supabase)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-primary/20 text-primary border-primary/30'
            case 'contacted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'interested': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'converted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
        }
    }

    const filteredLeads = leads.filter(lead => {
        const matchesFilter = filter === 'all' || lead.status === filter
        const matchesSearch = !search.trim() ||
            lead.phone_number?.toLowerCase().includes(search.toLowerCase()) ||
            lead.email?.toLowerCase().includes(search.toLowerCase()) ||
            lead.name?.toLowerCase().includes(search.toLowerCase()) ||
            lead.notes?.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        interested: leads.filter(l => l.status === 'interested').length,
        converted: leads.filter(l => l.status === 'converted').length,
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Total', value: stats.total, color: 'text-foreground' },
                    { label: 'New', value: stats.new, color: 'text-primary' },
                    { label: 'Contacted', value: stats.contacted, color: 'text-blue-400' },
                    { label: 'Interested', value: stats.interested, color: 'text-green-400' },
                    { label: 'Converted', value: stats.converted, color: 'text-emerald-400' },
                ].map(stat => (
                    <div key={stat.label} className="p-3 bg-card border border-muted-foreground/10 rounded-xl text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background border border-muted-foreground/20 rounded-xl text-sm text-foreground focus:border-primary outline-none" placeholder="Search leads..." />
                </div>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1">
                    {['all', 'new', 'contacted', 'interested', 'converted', 'lost'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <button onClick={() => fetchLeads(supabase)} className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground text-xs">
                    <RefreshCcw className="h-4 w-4" /> Refresh
                </button>
            </div>

            {/* Lead Cards */}
            <div className="grid gap-3">
                {loading ? (
                    <p className="text-muted-foreground animate-pulse text-center py-12">Scanning for leads...</p>
                ) : filteredLeads.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-12">No leads match your filters.</p>
                ) : (
                    filteredLeads.map((lead) => (
                        <div key={lead.id} className="p-5 bg-card border border-muted-foreground/10 rounded-xl space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                        <p className="font-serif text-lg text-foreground">{lead.name || 'Anonymous'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {lead.phone_number && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone_number}</span>}
                                        {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(lead.created_at).toLocaleDateString()}</span>
                                        {lead.source && <span className="uppercase tracking-wider">src: {lead.source.replace('_', ' ')}</span>}
                                        {lead.trip_interest && <span className="text-primary">Trip: {lead.trip_interest}</span>}
                                    </div>
                                </div>
                                <button onClick={() => deleteLead(lead.id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Notes */}
                            <div className="flex gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-2 shrink-0" />
                                <textarea
                                    defaultValue={lead.notes || ''}
                                    onBlur={(e) => updateLeadNotes(lead.id, e.target.value)}
                                    className="w-full px-3 py-2 bg-background/50 border border-muted-foreground/10 rounded-lg text-sm text-foreground focus:border-primary outline-none resize-none h-16"
                                    placeholder="Add notes about this lead..."
                                />
                            </div>

                            {/* Status Actions */}
                            <div className="flex flex-wrap gap-2">
                                {['new', 'contacted', 'interested', 'converted', 'lost'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateLeadStatus(lead.id, s)}
                                        disabled={lead.status === s}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-all ${lead.status === s ? getStatusColor(s) + ' opacity-100' : 'border-muted-foreground/10 text-muted-foreground hover:border-muted-foreground/30'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
