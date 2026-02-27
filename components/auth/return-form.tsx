'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone, LogIn } from 'lucide-react'
import { signInWithGoogle, login, signup } from '@/app/auth/actions'

export function ReturnForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithGoogle(window.location.origin)
      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!supabase) {
        setError('Unable to connect. Please try again.')
        return
      }

      if (mode === 'signup') {
        if (!whatsapp) throw new Error('WhatsApp number is required for journey updates.')

        const result = await signup(email, password, fullName, whatsapp)

        if (result?.error) {
          throw new Error(result.error)
        }

        if (result?.success && result?.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      } else {
        const result = await login(email, password)

        if (result?.error) {
          throw new Error(result.error)
        }

        if (result?.success && result?.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl text-foreground">
          {mode === 'signin' ? 'Welcome back' : 'Join the tribe'}
        </h2>
        <p className="font-sans text-muted-foreground">
          {mode === 'signin' ? 'Your memories are waiting.' : 'Start your journey with Wanderpals.'}
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex p-1 bg-muted-foreground/5 rounded-xl border border-muted-foreground/10">
        <button
          onClick={() => setMode('signin')}
          className={`flex-1 py-2 text-sm font-sans rounded-lg transition-all ${mode === 'signin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 text-sm font-sans rounded-lg transition-all ${mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-card border border-muted-foreground/20 rounded-xl hover:bg-muted-foreground/5 transition-all font-sans text-sm text-foreground group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.6 1.7l3.48-3.48C17.75 1.09 15.15 0 12 0 7.31 0 3.25 2.67 1.21 6.6l3.97 3.08c.95-2.85 3.6-4.64 6.82-4.64z" />
            <path fill="#FBBC05" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.42-4.92 3.42-8.69z" />
            <path fill="#4285F4" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.03.69-2.35 1.11-3.93 1.11-3.22 0-5.87-2.19-6.82-5.11H1.07v3.15C3.11 21.33 7.17 24 12 24z" />
            <path fill="#34A853" d="M5.18 14.22c-.24-.72-.37-1.49-.37-2.22s.13-1.5.37-2.22V6.63H1.07C.39 8.11 0 9.77 0 11.5s.39 3.39 1.07 4.87l4.11-3.15z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/10"></div>
          </div>
          <span className="relative bg-background px-4 text-[10px] uppercase tracking-widest text-muted-foreground/60">or use email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-500 text-xs rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-muted-foreground/20 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="tel"
                  placeholder="WhatsApp Number (e.g. +91 ...)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-muted-foreground/20 rounded-xl text-sm focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-muted-foreground/20 rounded-xl text-sm focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-background border border-muted-foreground/20 rounded-xl text-sm focus:border-primary outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-sans font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : 'Join Wanderpals'}
            <LogIn className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed px-4">
          By continuing, you agree to Wanderpals&apos; <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and Privacy Policy. Private trip data is encrypted.
        </p>
      </div>
    </div>
  )
}
