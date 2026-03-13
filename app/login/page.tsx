import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { ReturnForm } from '@/components/auth/return-form'
import { Magnetic } from '@/components/ui/magnetic'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center px-6 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero2.png" 
          alt="Cinematic Background" 
          fill 
          className="object-cover opacity-20 blur-3xl scale-110" 
          priority
        />
        <div className="noise-overlay grayscale" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-12 flex justify-center">
            <Magnetic strength={0.2}>
                <Link href="/" className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-all">
                    <ArrowLeft className="h-3 w-3 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 group-hover:text-foreground transition-colors">Return Home</span>
                </Link>
            </Magnetic>
        </div>

        <div className="text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4 tracking-tightest">Identity</h1>
            <p className="font-serif italic text-muted-foreground/40 text-lg lowercase">Retrace your steps or begin a new story.</p>
        </div>

        <ReturnForm />

        <div className="mt-16 text-center">
            <p className="font-serif italic text-muted-foreground/20 text-sm lowercase">
                Lost in the fog?{' '}
                <Link href="/all-trips" className="text-primary/40 hover:text-primary transition-colors underline decoration-primary/10">
                    Find your way.
                </Link>
            </p>
        </div>
      </div>
      
      {/* Decorative Grain */}
      <div className="noise-overlay grayscale" />
    </main>
  )
}

