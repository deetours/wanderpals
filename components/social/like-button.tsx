'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'

interface LikeButtonProps {
    memoryId: string
    userId: string
    initialLikesCount: number
    initialIsLiked: boolean
}

export function LikeButton({ memoryId, userId, initialLikesCount, initialIsLiked }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likesCount, setLikesCount] = useState(initialLikesCount)
    const [isAnimating, setIsAnimating] = useState(false)
    const [supabase, setSupabase] = useState<any>(null)

    useEffect(() => {
        setSupabase(createClientComponentClient())
    }, [])

    const handleToggleLike = async () => {
        if (!supabase || !userId) return

        // Optimistic UI Update
        const targetState = !isLiked
        setIsLiked(targetState)
        setLikesCount(prev => targetState ? prev + 1 : prev - 1)

        if (targetState) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 500)
        }

        try {
            if (targetState) {
                // Add like
                const { error } = await supabase.from('memory_likes').insert({
                    memory_id: memoryId,
                    user_id: userId
                })
                if (error && error.code !== '23505') throw error // ignore unique constraint errors blindly
            } else {
                // Remove like
                const { error } = await supabase.from('memory_likes')
                    .delete()
                    .eq('memory_id', memoryId)
                    .eq('user_id', userId)
                if (error) throw error
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // Revert on failure
            setIsLiked(!targetState)
            setLikesCount(prev => !targetState ? prev + 1 : prev - 1)
        }
    }

    return (
        <button
            onClick={handleToggleLike}
            className="group flex items-center gap-1.5 hover:text-primary transition-colors duration-300"
        >
            <div className={`relative p-1.5 rounded-full transition-colors ${isLiked ? 'bg-primary/10' : 'group-hover:bg-primary/5'}`}>
                <Heart
                    className={`h-5 w-5 transition-all duration-300 ${isLiked
                            ? 'fill-primary text-primary scale-110'
                            : 'text-foreground'
                        } ${isAnimating ? 'animate-shake' : ''}`}
                />
            </div>
            <span className={`font-sans text-sm font-semibold transition-colors ${isLiked ? 'text-primary' : 'text-foreground'}`}>
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </span>
        </button>
    )
}
