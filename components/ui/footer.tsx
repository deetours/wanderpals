"use client"

import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full px-6 py-32 md:px-16 lg:px-24 bg-background">
            <div className="mx-auto max-w-7xl border-t border-white/5 pt-20">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="space-y-6 max-w-sm">
                        <h3 className="font-serif text-4xl text-foreground tracking-tightest">Wanderpals.</h3>
                        <p className="font-serif text-lg text-muted-foreground/40 italic leading-relaxed">
                            Travel slower. Stay longer. <br />
                            Experience life like cinema.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-16">
                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">Discovery</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/all-trips" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">Trips</Link>
                                <Link href="/stays" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">Stays</Link>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">Company</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/about" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">Our Story</Link>
                                <Link href="/terms" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                                <Link href="/privacy" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-32 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-muted-foreground/20 uppercase tracking-[0.3em] font-bold">
                    <p>© 2026 Wanderpals. Crafted for souls.</p>
                    <div className="hidden md:flex items-center gap-6">
                        <span>Made in India</span>
                        <div className="w-1 h-1 rounded-full bg-white/5" />
                        <span>Available Worldwide</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
