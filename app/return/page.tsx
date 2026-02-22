'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/navbar'
import { ExperienceArchive } from '@/components/user/experience-archive'
import { LogOut } from 'lucide-react'

export default function ReturnPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const client = createClientComponentClient()
      setSupabase(client)
      if (!client) {
        setLoading(false)
        return
      }
      const { data: { user } } = await client.auth.getUser()

      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  if (loading) return <div className="h-screen bg-background" />

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      <div className="px-6 md:px-16 lg:px-24 py-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
              Your memories
            </h1>
            <p className="font-sans text-muted-foreground">
              Every journey you've taken with us
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded border border-muted-foreground/20 hover:bg-card transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-sans text-sm">Logout</span>
          </button>
        </div>

        {/* Experience Archive */}
        <ExperienceArchive userId={user?.id} />
      </div>
    </main>
  )
}
