'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TripsManager } from './trips-manager'
import { StaysManager } from './stays-manager'
import { BookingsViewer } from './bookings-viewer'
import { LeadsManager } from './leads-manager'
import { AnalyticsDashboard } from './analytics-dashboard'
import { UsersManager } from './users-manager'
import { MapPin, BookOpen, Users, BarChart3, MessageSquare, Zap, UserCheck } from 'lucide-react'

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Performance at a glance' },
  { id: 'trips', label: 'Trips', icon: MapPin, desc: 'Manage your journeys' },
  { id: 'stays', label: 'Stays', icon: BookOpen, desc: 'Manage properties' },
  { id: 'bookings', label: 'Bookings', icon: Users, desc: 'Track reservations' },
  { id: 'leads', label: 'Leads', icon: MessageSquare, desc: 'Incoming inquiries' },
  { id: 'users', label: 'Users', icon: UserCheck, desc: 'Manage user accounts' },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Mission Control Header ──────────────────────────── */}
      <div className="border-b border-white/5 px-6 py-8 md:px-12">
        <div className="flex items-center gap-4 mb-10">
          {/* Live pulse indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.5em] text-primary/60 font-bold">Mission Control</span>
          <span className="ml-auto text-[9px] uppercase tracking-[0.5em] text-muted-foreground/20 font-bold hidden md:block">
            Wanderpals Admin
          </span>
        </div>

        {/* Tab nav pills */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-5 py-3 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(230,184,115,0.15)]'
                    : 'text-muted-foreground/40 hover:text-foreground glass'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Tab Content ─────────────────────────────────────── */}
      <div className="px-6 py-10 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Active section heading */}
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-10">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                {(() => {
                  const tab = tabs.find(t => t.id === activeTab)
                  if (!tab) return null
                  const Icon = tab.icon
                  return <Icon className="h-4 w-4 text-primary" />
                })()}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/30 font-bold mb-1">
                  {tabs.find(t => t.id === activeTab)?.desc}
                </p>
                <h2 className="font-serif text-2xl text-foreground">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="ml-auto flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-muted-foreground/20 font-bold">
                <Zap className="h-3 w-3 text-primary/30" />
                Live
              </div>
            </div>

            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'trips' && <TripsManager />}
            {activeTab === 'stays' && <StaysManager />}
            {activeTab === 'bookings' && <BookingsViewer />}
            {activeTab === 'leads' && <LeadsManager />}
            {activeTab === 'users' && <UsersManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
