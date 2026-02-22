'use client'

import { useState } from 'react'
import { TripsManager } from './trips-manager'
import { StaysManager } from './stays-manager'
import { BookingsViewer } from './bookings-viewer'
import { LeadsManager } from './leads-manager'
import { AnalyticsDashboard } from './analytics-dashboard'
import { Users, MapPin, BookOpen, BarChart3, MessageSquare } from 'lucide-react'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('trips')

  const tabs = [
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'stays', label: 'Stays', icon: BookOpen },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]


  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-muted-foreground/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-sans text-sm border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'trips' && <TripsManager />}
        {activeTab === 'stays' && <StaysManager />}
        {activeTab === 'bookings' && <BookingsViewer />}
        {activeTab === 'leads' && <LeadsManager />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>

    </div>
  )
}
