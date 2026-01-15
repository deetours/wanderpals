import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="grain min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-6xl md:text-8xl text-foreground">404</h1>
        <p className="mt-4 font-serif text-xl text-muted-foreground">This path doesn't exist yet.</p>
        <p className="mt-2 text-muted-foreground">Maybe it's time to wander somewhere new.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-primary hover:underline transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to wandering
        </Link>
      </div>
    </main>
  )
}
