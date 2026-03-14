'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TripsManager } from './trips-manager'
import { StaysManager } from './stays-manager'
import { BookingsViewer } from './bookings-viewer'
import { LeadsManager } from './leads-manager'
import { AnalyticsDashboard } from './analytics-dashboard'
import { UsersManager } from './users-manager'
import { MediaExplorer } from './media-explorer'
import { MapPin, BookOpen, Users, BarChart3, MessageSquare, UserCheck, ImageIcon, Wifi, WifiOff, Zap } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'

const tabs = [
  { id: 'analytics', label: 'Analytics', short: 'Stats', icon: BarChart3, desc: 'Performance at a glance' },
  { id: 'leads', label: 'Leads CRM', short: 'Leads', icon: MessageSquare, desc: 'Pipeline & CRM' },
  { id: 'trips', label: 'Trips', short: 'Trips', icon: MapPin, desc: 'Manage expeditions' },
  { id: 'stays', label: 'Stays', short: 'Stays', icon: BookOpen, desc: 'Manage properties' },
  { id: 'bookings', label: 'Bookings', short: 'Book', icon: Users, desc: 'Track reservations' },
  { id: 'media', label: 'Media', short: 'Media', icon: ImageIcon, desc: 'Manage assets' },
  { id: 'users', label: 'Users', short: 'Users', icon: UserCheck, desc: 'Manage accounts' },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      const supabase = createClientComponentClient()
      if (!supabase) {
        setConnectionStatus('error')
        setErrorMessage('Client init failed — check NEXT_PUBLIC_SUPABASE_URL and KEY.')
        return
      }
      try {
        const { error } = await supabase.from('trips').select('id').limit(1)
        if (error) {
          const msg = String(error.message || error.code || 'DB error')
          setConnectionStatus('error')
          setErrorMessage(`${msg} | Code: ${error.code ?? 'N/A'}`)
          console.error(`[SUPABASE] message="${error.message}" code="${error.code}"`)
        } else {
          setConnectionStatus('connected')
        }
      } catch (err: any) {
        setConnectionStatus('error')
        setErrorMessage(err?.message || 'Network failure')
      }
    }
    checkConnection()
  }, [])

  const activeTabMeta = tabs.find(t => t.id === activeTab)!

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Desktop Top Nav ─────────────────────────────────────
           Hidden on mobile (< md). Mobile uses bottom bar below.  */}
      <div className="hidden md:block border-b border-white/5 px-6 py-6 md:px-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.5em] text-primary/60 font-bold">Mission Control</span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.4em] text-muted-foreground/20 font-bold">Wanderpals Admin</span>
        </div>

        {/* Connection banner */}
        {connectionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <WifiOff className="h-4 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest">Database Disconnected</p>
              <p className="text-[10px] opacity-60 truncate">{errorMessage}</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-[10px] uppercase font-bold shrink-0">Retry</button>
          </div>
        )}

        {/* Desktop tab pills */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.35em] font-bold transition-all duration-300 whitespace-nowrap ${isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.04]'
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Mobile Header ────────────────────────────────────────
           Shown only on mobile. Simple title bar.               */}
      <div className="md:hidden border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-serif text-base">{activeTabMeta.label}</span>
        </div>
        {connectionStatus === 'error' && (
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold uppercase">
            <WifiOff className="h-3 w-3" /> DB Error
          </button>
        )}
        {connectionStatus === 'connected' && (
          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Live</span>
          </div>
        )}
      </div>

      {/* ── Content Area ─────────────────────────────────────────
           Extra bottom padding on mobile for the bottom nav bar.*/}
      <div className="px-4 py-6 md:px-10 md:py-10 pb-24 md:pb-10">

        {/* Section heading — desktop only */}
        <div className="hidden md:flex items-center gap-4 mb-8">
          <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
            {(() => { const Icon = activeTabMeta.icon; return <Icon className="h-4 w-4 text-primary" /> })()}
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold">{activeTabMeta.desc}</p>
            <h2 className="font-serif text-2xl text-foreground">{activeTabMeta.label}</h2>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[9px] text-muted-foreground/20 uppercase tracking-[0.3em] font-bold">
            <Zap className="h-3 w-3 text-primary/30" /> Live
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'trips' && <TripsManager />}
            {activeTab === 'stays' && <StaysManager />}
            {activeTab === 'media' && <MediaExplorer />}
            {activeTab === 'bookings' && <BookingsViewer />}
            {activeTab === 'leads' && <LeadsManager />}
            {activeTab === 'users' && <UsersManager />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile Bottom Tab Bar ────────────────────────────────
           Only shown on mobile (md:hidden). Fixed to bottom.     */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-stretch overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-3 min-w-[64px] flex-1 transition-all duration-200 ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground/40 hover:text-muted-foreground'
                  }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-primary/15' : ''}`}>
                  <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide">{tab.short}</span>
                {isActive && (
                  <motion.div layoutId="activeTabIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
