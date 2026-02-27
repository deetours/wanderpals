'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { LogOut } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  return (
    <main className="grain min-h-screen bg-background">
      <div className="px-6 md:px-16 lg:px-24 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">
            Admin Control Panel
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded border border-muted-foreground/20 hover:bg-card transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-sans text-sm">Logout</span>
          </button>
        </div>

        <AdminDashboard />
      </div>
    </main>
  )
}
