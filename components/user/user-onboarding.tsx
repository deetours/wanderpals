'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Map, Camera, Heart } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'

export function UserOnboarding({ userId }: { userId: string }) {
    const [isVisible, setIsVisible] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        checkOnboarding()
    }, [userId])

    const checkOnboarding = async () => {
        const supabase = createClientComponentClient()
        if (!supabase) return

        const { data } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('id', userId)
            .single()

        if (data && !(data as any).onboarding_complete) {
            setIsVisible(true)
        }
    }

    const completeOnboarding = async () => {
        const supabase = createClientComponentClient()
        if (supabase) {
            await supabase.from('users').update({ onboarding_complete: true } as any).eq('id', userId)
        }
        setIsVisible(false)
    }

    const steps = [
        {
            title: "Welcome to your Archive",
            desc: "This is where your journeys come to life. Every trip you've taken with Wanderpals is stored here safely.",
            icon: Sparkles
        },
        {
            title: "Revisit Memories",
            desc: "Click on any journey to see your private photos, group highlights, and campfire stories we've curated for you.",
            icon: Camera
        },
        {
            title: "Explore the Community",
            desc: "See what other travelers are up to! Like and comment on public stories to stay connected with your travel family.",
            icon: Heart
        },
        {
            title: "Your Next Chapter",
            desc: "Ready for more? You can find recommended journeys right at the bottom of your archive to start planning your next escape.",
            icon: Map
        }
    ]

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md p-6">
            <div className="bg-card border border-primary/20 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
                {/* Progress dots */}
                <div className="flex gap-1 mb-8">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        {(() => {
                            const Icon = steps[step].icon
                            return <Icon className="h-6 w-6" />
                        })()}
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-serif text-2xl text-foreground">{steps[step].title}</h2>
                        <p className="font-sans text-muted-foreground leading-relaxed text-sm">{steps[step].desc}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-3 rounded-lg border border-muted-foreground/20 hover:bg-muted-foreground/5 font-sans text-sm transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => step < steps.length - 1 ? setStep(step + 1) : completeOnboarding()}
                            className="flex-[2] py-3 rounded-lg bg-primary text-background hover:bg-primary/90 font-sans text-sm font-semibold transition-colors"
                        >
                            {step < steps.length - 1 ? 'Next' : 'Got it!'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
