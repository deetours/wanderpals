"use client"

import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full px-6 py-12 md:px-16 lg:px-24 bg-background">
            <div className="mx-auto max-w-5xl border-t border-muted-foreground/10 pt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="font-serif text-2xl text-foreground">Wanderpals</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Travel slower. Stay longer. Experience life like cinema.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <Link href="/all-trips" className="text-sm text-muted-foreground hover:text-primary transition-colors">Trips</Link>
                        <Link href="/stays" className="text-sm text-muted-foreground hover:text-primary transition-colors">Stays</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Story</Link>
                    </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                    <p>© 2026 Wanderpals. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-primary transition-colors">Legal</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
