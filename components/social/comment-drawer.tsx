'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Trash2 } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        full_name: string
    }
}

interface CommentDrawerProps {
    memoryId: string
    userId: string
    isOpen: boolean
    onClose: () => void
    commentCount: number
    onCommentAdded: () => void
}

export function CommentDrawer({ memoryId, userId, isOpen, onClose, commentCount, onCommentAdded }: CommentDrawerProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [supabase, setSupabase] = useState<any>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSupabase(createClientComponentClient())
    }, [])

    useEffect(() => {
        if (isOpen && supabase) {
            fetchComments()
        }
    }, [isOpen, supabase, memoryId])

    useEffect(() => {
        scrollToBottom()
    }, [comments])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchComments = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('memory_comments')
            .select(`
                id, content, created_at, user_id,
                profiles (full_name)
            `)
            .eq('memory_id', memoryId)
            .order('created_at', { ascending: true })

        if (!error && data) {
            setComments(data as unknown as Comment[])
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !supabase) return

        setIsSubmitting(true)
        const localComment = newComment.trim()
        setNewComment('') // Optimistic clear

        const { data, error } = await supabase
            .from('memory_comments')
            .insert({
                memory_id: memoryId,
                user_id: userId,
                content: localComment
            })
            .select(`
                id, content, created_at, user_id,
                profiles (full_name)
            `).single()

        if (!error && data) {
            setComments(prev => [...prev, data as unknown as Comment])
            onCommentAdded()
        } else {
            console.error('Failed to post comment', error)
            setNewComment(localComment) // restore on failure
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (commentId: string) => {
        if (!supabase) return

        // Optimistic UI hide
        setComments(prev => prev.filter(c => c.id !== commentId))

        const { error } = await supabase
            .from('memory_comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', userId)

        if (error) {
            console.error('Failed to delete', error)
            fetchComments() // Restore if failed
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

            <div className="relative w-full md:w-[400px] h-full bg-card border-l border-muted-foreground/20 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col animate-fade-left">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-muted-foreground/10">
                    <div className="flex items-center gap-2 text-foreground font-serif text-lg">
                        <MessageCircle className="h-5 w-5" />
                        Responses ({commentCount})
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted-foreground/10 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Comment Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="animate-pulse text-muted-foreground text-sm uppercase tracking-widest">Loading memories...</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                            <MessageCircle className="h-12 w-12" />
                            <p className="font-serif text-xl">No stories yet</p>
                            <p className="text-sm">Be the first to share a memory about this photo.</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className={`flex flex-col gap-1 ${comment.user_id === userId ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest pl-1">
                                    {comment.user_id === userId ? 'You' : comment.profiles?.full_name?.split(' ')[0] || 'Traveler'}
                                </span>
                                <div className={`relative px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-sans group ${comment.user_id === userId
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-muted text-foreground rounded-bl-sm border border-muted-foreground/10'
                                    }`}>
                                    <p>{comment.content}</p>

                                    {comment.user_id === userId && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 bg-background rounded-full transition-all border border-muted-foreground/20 shadow-sm"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-muted-foreground/10">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a memory..."
                            className="flex-1 bg-muted px-4 py-3 rounded-full text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-transparent transition-all"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
