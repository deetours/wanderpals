import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReturnForm } from '@/components/auth/return-form'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main className="grain min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Welcome back
          </h1>
          <p className="font-sans text-base text-muted-foreground">
            Sign in to revisit your memories and book your next journey
          </p>
        </div>

        <ReturnForm />

        <p className="mt-8 text-center font-sans text-sm text-muted-foreground">
          First time here?{' '}
          <Link href="/" className="text-primary hover:underline">
            Explore trips
          </Link>
        </p>
      </div>
    </main>
  )
}
