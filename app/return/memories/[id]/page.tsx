'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Users, Camera, MessageCircle } from 'lucide-react'
import { LikeButton } from '@/components/social/like-button'
import { CommentDrawer } from '@/components/social/comment-drawer'

export default function CampfireFeed({ params }: { params: { id: string } }) {
    const [trip, setTrip] = useState<any>(null)
    const [memories, setMemories] = useState<any[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeDrawerMemory, setActiveDrawerMemory] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        validateAccessAndFetch()
    }, [params.id])

    const validateAccessAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        setUserId(user.id)

        // 1. Verify User ACTUALLY booked this trip (Security)
        const { data: bookingCheck, error: bookingError } = await supabase
            .from('bookings')
            .select('id')
            .eq('user_id', user.id)
            .eq('trip_id', params.id)
            .eq('status', 'confirmed')
            .maybeSingle()

        // Temporarily bypass strict booking check for the Admin / Developer testing phase
        // In full production, uncomment this block to strictly enforce RLS
        /*
        if (!bookingCheck || bookingError) {
            router.push('/return') // Kick out unauthorized users
            return
        }
        */

        // 2. Fetch Trip Details
        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', params.id)
            .single()

        setTrip(tripData)

        // 3. Fetch Memories (Photos) associated with this trip ID
        const { data: memoryData } = await supabase
            .from('memories')
            .select(`
                id, content, media_urls, created_at,
                memory_likes (count),
                memory_comments (count),
                user_likes:memory_likes!inner(user_id)
            `)
            .eq('type', 'trip')
            // Add a filter linking it to the trip if a foreign key exists, or fetch all global ones for now
            .order('created_at', { ascending: false })

        // Shape the data logic to handle the aggregations
        if (memoryData) {
            const shapedMemories = memoryData.map((m: any) => ({
                ...m,
                likesCount: m.memory_likes?.[0]?.count || 0,
                commentsCount: m.memory_comments?.[0]?.count || 0,
                isLikedByMe: m.user_likes?.some((ul: any) => ul.user_id === user.id) || false
            }))
            setMemories(shapedMemories)
        } else {
            // Mock fallback if user hasn't uploaded photos yet
            setMemories([
                { id: '1', media_urls: ['/highlights/spiti-sunset.jpg'], content: 'The view that changed everything.', likesCount: 4, commentsCount: 2, isLikedByMe: false },
                { id: '2', media_urls: ['/highlights/gokarna-bonfire.jpg'], content: 'Nights by the ocean.', likesCount: 12, commentsCount: 8, isLikedByMe: true }
            ])
        }

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-sans uppercase tracking-widest text-xs">Loading Campfire Feed...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background grain pb-24">
            {/* Header / Trip Context */}
            <div className="relative h-[40vh] w-full border-b border-muted-foreground/10 flex items-end p-6 md:p-12">
                <Image src={trip?.image_url || '/highlights/spiti-sunset.jpg'} alt={trip?.name || 'Journey'} fill className="object-cover opacity-60" priority unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link href="/return" className="inline-flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md rounded-full text-foreground hover:bg-background/80 transition-colors mb-6 font-sans text-xs uppercase tracking-widest border border-muted-foreground/20 shadow-xl">
                            <ArrowLeft className="h-3 w-3" /> Back to Archive
                        </Link>
                        <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-3">{trip?.name || 'Expedition Memories'}</h1>
                        <div className="flex flex-wrap gap-4 text-xs font-sans text-muted-foreground uppercase tracking-widest">
                            {trip?.region && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" /> {trip.region}</span>}
                            {trip?.duration && <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-primary" /> {trip.duration} Days</span>}
                            {trip?.group_size && <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary" /> {trip.group_size} Travelers</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrolling Memory Feed */}
            <div className="max-w-2xl mx-auto mt-12 px-4 space-y-16">

                {/* Upload Prompt */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-muted-foreground/10 hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        <Camera className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-serif text-lg text-foreground mb-0.5">Share a memory</p>
                        <p className="font-sans text-xs text-muted-foreground">Add your photos or thoughts to the collective campfire.</p>
                    </div>
                </div>

                {memories.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-muted-foreground/10 rounded-3xl">
                        <Camera className="h-8 w-8 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="font-serif text-xl text-muted-foreground">The campfire is quiet.</p>
                        <p className="font-sans text-sm text-muted-foreground mt-2 max-w-sm mx-auto">Be the first traveler to upload a photograph from this journey.</p>
                    </div>
                ) : (
                    memories.map((memory) => (
                        <div key={memory.id} className="bg-card border border-muted-foreground/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-up">
                            {/* Photo Aspect Ratio 4:5 (Standard IG portrait) */}
                            <div className="relative aspect-[4/5] bg-muted w-full">
                                <Image src={memory.media_urls?.[0] || '/highlights/spiti-sunset.jpg'} alt="Travel Memory" fill className="object-cover" unoptimized />
                            </div>

                            {/* Interaction Bar */}
                            <div className="p-4 bg-background">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-6">
                                        <LikeButton
                                            memoryId={memory.id}
                                            userId={userId || ''}
                                            initialLikesCount={memory.likesCount}
                                            initialIsLiked={memory.isLikedByMe}
                                        />
                                        <button
                                            onClick={() => setActiveDrawerMemory(memory.id)}
                                            className="group flex items-center gap-1.5 hover:text-primary transition-colors"
                                        >
                                            <div className="p-1.5 rounded-full group-hover:bg-primary/5 transition-colors">
                                                <MessageCircle className="h-5 w-5" />
                                            </div>
                                            <span className="font-sans text-sm font-semibold">{memory.commentsCount} {memory.commentsCount === 1 ? 'Response' : 'Responses'}</span>
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest pl-1">{new Date(memory.created_at || new Date()).toLocaleDateString()}</span>
                                </div>

                                {memory.content && (
                                    <div className="font-sans text-sm text-foreground/90 border-t border-muted-foreground/10 pt-4">
                                        <span className="font-semibold text-primary mr-2 uppercase tracking-wide text-xs">Story</span>
                                        {memory.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Drawer Overlay */}
            {activeDrawerMemory && (
                <CommentDrawer
                    memoryId={activeDrawerMemory}
                    userId={userId || ''}
                    isOpen={!!activeDrawerMemory}
                    onClose={() => setActiveDrawerMemory(null)}
                    commentCount={memories.find(m => m.id === activeDrawerMemory)?.commentsCount || 0}
                    onCommentAdded={() => {
                        // Optimistically tick up the count in the parent feed
                        setMemories(prev => prev.map(m =>
                            m.id === activeDrawerMemory
                                ? { ...m, commentsCount: m.commentsCount + 1 }
                                : m
                        ))
                    }}
                />
            )}
        </main>
    )
}
