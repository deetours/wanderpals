'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'

export function ReturnForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      setSupabase(createClientComponentClient())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Supabase')
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Supabase client not initialized')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Redirect based on user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (userData?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/return')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <label className="block font-sans text-sm text-foreground mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2.5 bg-card border border-muted-foreground/20 rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors font-sans"
          required
        />
      </div>

      <div>
        <label className="block font-sans text-sm text-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 bg-card border border-muted-foreground/20 rounded text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors font-sans"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-500 font-sans">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !supabase}
        className="w-full bg-primary hover:bg-primary/90 text-background font-sans"
      >
        {loading ? 'Signing in...' : 'Return'}
      </Button>
    </form>
  )
}
