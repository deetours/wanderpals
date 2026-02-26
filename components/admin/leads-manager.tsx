'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { UserCheck, Clock, CheckCircle2, XCircle } from 'lucide-react'

export function LeadsManager() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [supabase, setSupabase] = useState<any>(null)

    useEffect(() => {
        const client = createClientComponentClient()
        setSupabase(client)
        fetchLeads(client)
    }, [])

    const fetchLeads = async (client: any) => {
        if (!client) return
        setLoading(true)
        try {
          const { data, error } = await client
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <Clock className="h-4 w-4 text-primary" />
            case 'contacted': return <UserCheck className="h-4 w-4 text-blue-400" />
            case 'interested': return <CheckCircle2 className="h-4 w-4 text-green-400" />
            default: return <XCircle className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {loading ? (
                    <p className="text-muted-foreground animate-pulse">Scanning the road for leads...</p>
                ) : leads.length === 0 ? (
                    <p className="text-muted-foreground italic">No leads captured yet. Your marketing tools are quiet.</p>
                ) : (
                    leads.map((lead) => (
                        <div key={lead.id} className="p-6 bg-card border border-muted-foreground/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${lead.status === 'new' ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'
                                        }`}>
                                        {lead.status}
                                    </span>
                                    <p className="font-serif text-lg text-foreground">{lead.phone_number || lead.email || 'Anonymous'}</p>
                                </div>
                                <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
                                    Source: {lead.source?.replace('_', ' ')} • {new Date(lead.created_at).toLocaleDateString()}
                                </p>
                                {lead.notes && <p className="text-sm text-muted-foreground italic py-2 border-l-2 border-primary/20 pl-3">"{lead.notes}"</p>}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                    className="px-3 py-1.5 rounded-lg border border-muted-foreground/10 hover:bg-muted-foreground/5 text-xs font-sans transition-colors"
                                    title="Mark as Contacted"
                                >
                                    Contacted
                                </button>
                                <button
                                    onClick={() => updateLeadStatus(lead.id, 'interested')}
                                    className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-xs font-sans transition-colors"
                                    title="Qualified Lead"
                                >
                                    Qualified
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
