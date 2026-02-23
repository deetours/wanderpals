'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

interface Story {
  id: string
  traveller: string
  trip: string
  duration: string
  image: string
  quote: string
  date: string
  likes: number
  comments: number
  isLiked?: boolean
}

const staticStories: Story[] = [
  {
    id: '1',
    traveller: 'Priya M.',
    trip: 'Spiti Valley',
    duration: '7 days',
    image: '/stories/spiti-priya.jpeg',
    quote: 'Went solo, came back with a family. Still text the group daily.',
    date: 'Feb 2025',
    likes: 342,
    comments: 28,
  },
  {
    id: '2',
    traveller: 'Vikram & Ananya',
    trip: 'Kerala Backwaters',
    duration: '5 days',
    image: '/stories/kerala-couple.jpeg',
    quote: 'We booked for us two. Left with 6 friends planning the next trip.',
    date: 'Jan 2025',
    likes: 521,
    comments: 45,
  },
  {
    id: '3',
    traveller: 'Arjun K.',
    trip: 'Ladakh Roads',
    duration: '10 days',
    image: '/stories/ladakh-arjun.jpg',
    quote: '3,700 meters up. Lowest I\'ve ever felt anxiety. Highest I\'ve ever felt free.',
    date: 'Dec 2024',
    likes: 798,
    comments: 67,
  },
]

export function TravellerStories() {
  const [stories, setStories] = useState<Story[]>(staticStories)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [commentText, setCommentText] = useState("")
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
    fetchInteractions()
  }, [])

  const fetchInteractions = async () => {
    if (!supabase) return
    // In a real app, we'd fetch counts from the DB. For now, let's just use static + local state
  }

  const handleLike = async (storyId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    // Optimistic update
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          likes: s.isLiked ? s.likes - 1 : s.likes + 1,
          isLiked: !s.isLiked
        }
      }
      return s
    }))

    if (!supabase) return
    if (!selectedStory?.isLiked) {
      await supabase.from('story_likes').upsert({ user_id: user.id, story_id: storyId })
    } else {
      await supabase.from('story_likes').delete().eq('user_id', user.id).eq('story_id', storyId)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }
    if (!commentText.trim() || !selectedStory) return

    // Optimistic update
    setStories(prev => prev.map(s => {
      if (s.id === selectedStory.id) {
        return { ...s, comments: s.comments + 1 }
      }
      return s
    }))

    if (supabase) {
      await supabase.from('story_comments').insert({
        user_id: user.id,
        story_id: selectedStory.id,
        content: commentText
      })
    }

    setCommentText("")
    // Maybe show a "Comment posted!" toast?
  }

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Stories from the road</h2>
        <p className="font-sans text-muted-foreground max-w-2xl mb-12">
          Real moments. Real connections. Real lives changed.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-card">
                <Image
                  src={story.image}
                  alt={story.traveller}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-sans font-semibold text-foreground">{story.traveller}</p>
                  <p className="font-sans text-xs text-muted-foreground">{story.trip} • {story.duration}</p>
                </div>

                <p className="font-sans text-sm text-muted-foreground italic group-hover:text-foreground transition-colors">
                  "{story.quote}"
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-muted-foreground/10">
                  <span className={`flex items-center gap-1 transition-colors ${story.isLiked ? 'text-primary' : ''}`}>
                    <Heart className={`h-4 w-4 ${story.isLiked ? 'fill-current' : ''}`} />
                    {story.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {story.comments}
                  </span>
                  <span className="ml-auto">{story.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setSelectedStory(null)}>
            <div className="bg-card border border-primary/20 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-sans font-semibold text-foreground text-lg">{selectedStory.traveller}</p>
                  <p className="font-sans text-sm text-muted-foreground">{selectedStory.trip} • {selectedStory.date}</p>
                </div>
                <button onClick={() => setSelectedStory(null)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted-foreground/10 transition-colors">×</button>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-xl mb-6">
                <Image
                  src={selectedStory.image}
                  alt={selectedStory.traveller}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <p className="font-serif text-xl text-foreground mb-8 leading-relaxed">"{selectedStory.quote}"</p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(selectedStory.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-sans text-sm transition-all ${selectedStory.isLiked
                        ? 'bg-primary text-background'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                  >
                    <Heart className={`h-4 w-4 ${selectedStory.isLiked ? 'fill-current' : ''}`} />
                    {selectedStory.isLiked ? 'Liked' : 'Like'}
                  </button>
                  <div className="flex-[2] relative">
                    <form onSubmit={handleComment} className="relative">
                      <input
                        type="text"
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-background border border-muted-foreground/20 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
