'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Phone, CheckCircle2, Shield } from 'lucide-react'

export function WhatsappRequirement({ userId }: { userId: string }) {
    const [isVisible, setIsVisible] = useState(false)
    const [whatsapp, setWhatsapp] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSuccessfullySaved, setIsSuccessfullySaved] = useState(false)

    useEffect(() => {
        checkWhatsapp()
    }, [userId])

    const checkWhatsapp = async () => {
        const supabase = createClientComponentClient()
        if (!supabase) return

        const { data } = await supabase
            .from('profiles')
            .select('whatsapp_number')
            .eq('id', userId)
            .single()

        if (data && !(data as any).whatsapp_number) {
            setIsVisible(true)
        }

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!whatsapp.trim()) return

        setLoading(true)
        const supabase = createClientComponentClient()
        if (supabase) {
            const { error } = await (supabase
                .from('profiles' as any)
                .update({ whatsapp_number: whatsapp } as any)
                .eq('id', userId) as any)



            if (!error) {
                setIsSuccessfullySaved(true)
                setTimeout(() => setIsVisible(false), 2000)
            }
        }
        setLoading(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 backdrop-blur-xl p-6">
            <div className="bg-card border border-primary/20 rounded-3xl max-w-sm w-full p-8 shadow-2xl space-y-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Phone className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="font-serif text-2xl text-foreground">Stay Connected</h2>
                    <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                        We use WhatsApp to send you trip coordinates, campfire photos, and private journey updates.
                    </p>
                </div>

                {isSuccessfullySaved ? (
                    <div className="flex flex-col items-center gap-2 py-4 text-primary animate-bounce">
                        <CheckCircle2 className="h-10 w-10" />
                        <p className="font-sans font-semibold">Tribe synced!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <input
                                type="tel"
                                placeholder="Your WhatsApp (e.g. +91 ...)"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background border border-muted-foreground/20 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-background rounded-xl hover:bg-primary/90 font-sans text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Syncing...' : 'Secure My Experience'}
                        </button>
                    </form>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/50 uppercase tracking-widest font-sans">
                    <Shield className="h-3 w-3" />
                    End-to-end encrypted
                </div>
            </div>
        </div>
    )
}
