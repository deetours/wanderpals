'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone, LogIn, Zap, Info } from 'lucide-react'
import { signInWithGoogle, login, signup } from '@/app/auth/actions'
import { Magnetic } from '../ui/magnetic'

const transition = {
  duration: 0.8,
  ease: [0.23, 1, 0.32, 1] as any,
}

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
        setError('Connection lost. Please retrace.')
        return
      }

      if (mode === 'signup') {
        if (!whatsapp) throw new Error('WhatsApp is required for your journey updates.')
        const result = await signup(email, password, fullName, whatsapp)
        if (result?.error) throw new Error(result.error)
        if (result?.success && result?.redirectUrl) window.location.href = result.redirectUrl
      } else {
        const result = await login(email, password)
        if (result?.error) throw new Error(result.error)
        if (result?.success && result?.redirectUrl) window.location.href = result.redirectUrl
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-10">
      {/* Mode Switcher */}
      <div className="flex p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 backdrop-blur-sm">
        <button
          onClick={() => setMode('signin')}
          className={`relative flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-500 ${
            mode === 'signin' ? 'text-primary' : 'text-muted-foreground/30 hover:text-muted-foreground'
          }`}
        >
          Sign In
          {mode === 'signin' && (
            <motion.div layoutId="auth-tab" className="absolute inset-0 bg-white shadow-xl rounded-xl mix-blend-difference" />
          )}
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`relative flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-500 ${
            mode === 'signup' ? 'text-primary' : 'text-muted-foreground/30 hover:text-muted-foreground'
          }`}
        >
          Sign Up
          {mode === 'signup' && (
            <motion.div layoutId="auth-tab" className="absolute inset-0 bg-white shadow-xl rounded-xl mix-blend-difference" />
          )}
        </button>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale" style={{ backgroundImage: "url('/noise.png')" }} />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-red-400/5 border border-red-400/10 text-red-400 text-[10px] uppercase tracking-widest font-bold rounded-xl text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="space-y-4"
            >
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Full Identity</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="e.g. Elena Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:border-primary/50 outline-none transition-all font-serif placeholder:text-white/5"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">WhatsApp Contact</label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        placeholder="+91 ···· ····"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:border-primary/50 outline-none transition-all font-serif placeholder:text-white/5"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="elena@ethereal.voyage"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:border-primary/50 outline-none transition-all font-serif placeholder:text-white/5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-14 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:border-primary/50 outline-none transition-all font-sans placeholder:text-white/5"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/20 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="pt-4">
            <Magnetic strength={0.1}>
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden flex items-center justify-center gap-4 py-5 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-[0.5em] text-[10px] shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
              >
                <span className="relative z-10">
                  {loading ? 'Retaining...' : mode === 'signin' ? 'Verify Identity' : 'Secure Entry'}
                </span>
                <LogIn className="relative z-10 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </Magnetic>
          </div>
        </form>

        <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-transparent px-4 text-[8px] uppercase tracking-[0.4em] text-muted-foreground/20 font-bold">Universal Entry</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 5.04c1.94 0 3.51.68 4.6 1.7l3.48-3.48C17.75 1.09 15.15 0 12 0 7.31 0 3.25 2.67 1.21 6.6l3.97 3.08c.95-2.85 3.6-4.64 6.82-4.64z" className="opacity-40" />
              <path fill="currentColor" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.42-4.92 3.42-8.69z" />
              <path fill="currentColor" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.03.69-2.35 1.11-3.93 1.11-3.22 0-5.87-2.19-6.82-5.11H1.07v3.15C3.11 21.33 7.17 24 12 24z" className="opacity-40" />
              <path fill="currentColor" d="M5.18 14.22c-.24-.72-.37-1.49-.37-2.22s.13-1.5.37-2.22V6.63H1.07C.39 8.11 0 9.77 0 11.5s.39 3.39 1.07 4.87l4.11-3.15z" className="opacity-20" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/60 group-hover:text-foreground transition-colors">Continue with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

