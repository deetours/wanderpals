'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Users, ShieldCheck, RefreshCcw, Search, Shield, User } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  whatsapp_number: string
  role: string
  created_at: string
  avatar_url?: string
}

export function UsersManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [supabase, setSupabase] = useState<any>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const client = createClientComponentClient()
    setSupabase(client)
    fetchProfiles(client)
  }, [])

  const fetchProfiles = async (client: any) => {
    if (!client) return
    setLoading(true)
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProfiles(data || [])
    } catch (err) {
      console.error('Profiles fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = async (profile: Profile) => {
    if (!supabase) return
    const newRole = profile.role === 'admin' ? 'user' : 'admin'
    if (newRole === 'admin' && !confirm(`Promote ${profile.full_name || 'this user'} to admin? They will have full access to the admin dashboard.`)) return
    setUpdatingId(profile.id)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profile.id)
    if (!error) {
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, role: newRole } : p))
    }
    setUpdatingId(null)
  }

  const filtered = profiles.filter(p =>
    !search.trim() ||
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.whatsapp_number?.includes(search) ||
    p.role?.includes(search)
  )

  const admins = profiles.filter(p => p.role === 'admin').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-blue-400/10 bg-blue-400/5 text-center">
          <p className="font-serif text-4xl text-blue-400">{loading ? '—' : profiles.length}</p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">Total Users</p>
        </div>
        <div className="p-6 rounded-2xl border border-primary/10 bg-primary/5 text-center">
          <p className="font-serif text-4xl text-primary">{loading ? '—' : admins}</p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">Admins</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-card text-center">
          <p className="font-serif text-4xl text-foreground">{loading ? '—' : profiles.length - admins}</p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold mt-1">Travellers</p>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, WhatsApp, or role..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-white/5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none"
          />
        </div>
        <button
          onClick={() => supabase && fetchProfiles(supabase)}
          className="p-3 rounded-xl border border-white/5 bg-card hover:bg-white/[0.04] transition-all text-muted-foreground hover:text-foreground"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-5 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">Name</th>
                <th className="text-left px-5 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">WhatsApp</th>
                <th className="text-left px-5 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">Role</th>
                <th className="text-left px-5 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">Joined</th>
                <th className="text-right px-5 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground animate-pulse">Loading users...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground italic">No users found.</td>
                </tr>
              ) : (
                filtered.map(profile => (
                  <tr key={profile.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {profile.role === 'admin'
                            ? <Shield className="h-3.5 w-3.5" />
                            : <User className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-foreground">{profile.full_name || <span className="text-muted-foreground/40 italic">No name</span>}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{profile.whatsapp_number || <span className="italic opacity-30">—</span>}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] uppercase tracking-wider font-bold ${profile.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-muted-foreground border-white/5'}`}>
                        {profile.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {new Date(profile.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        disabled={updatingId === profile.id}
                        onClick={() => toggleRole(profile)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-bold border transition-all ${
                          profile.role === 'admin'
                            ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                            : 'border-primary/20 text-primary hover:bg-primary/10'
                        } disabled:opacity-40`}
                      >
                        {updatingId === profile.id ? '…' : profile.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
