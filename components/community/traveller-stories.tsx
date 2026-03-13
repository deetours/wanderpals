'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Send, X } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Magnetic } from '../ui/magnetic'

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
    traveller: 'Apoorva H',
    trip: 'Tawang',
    duration: '7 days',
    image: '/stories/apoorva.jpg',
    quote: 'Went solo, came back with a family. Still text the group daily.',
    date: 'Feb 2025',
    likes: 342,
    comments: 28,
  },
  {
    id: '2',
    traveller: 'Shreeram H',
    trip: 'Meghalaya',
    duration: '5 days',
    image: '/stories/shree.jpg',
    quote: 'We booked for us two. Left with 6 friends planning the next trip.',
    date: 'Jan 2025',
    likes: 521,
    comments: 45,
  },
  {
    id: '3',
    traveller: 'Prashansa R',
    trip: 'Ladakh Roads',
    duration: '10 days',
    image: '/stories/prashansa.png',
    quote: '3,700 meters up. Lowest I\'ve ever felt anxiety. Highest I\'ve ever felt free.',
    date: 'Dec 2024',
    likes: 798,
    comments: 67,
  },
]

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function TravellerStories() {
  const [stories, setStories] = useState<Story[]>(staticStories)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [commentText, setCommentText] = useState("")
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClientComponentClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.log("Supabase connectivity restricted (Stories)")
      }
    }
    checkUser()
  }, [])

  const handleLike = async (storyId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

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
    const currentStory = stories.find(s => s.id === storyId)
    if (!currentStory?.isLiked) {
      await (supabase.from('story_likes' as any).upsert({ user_id: user.id, story_id: storyId } as any) as any)
    } else {
      await (supabase.from('story_likes' as any).delete().eq('user_id', user.id).eq('story_id', storyId) as any)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }
    if (!commentText.trim() || !selectedStory) return

    setStories(prev => prev.map(s => {
      if (s.id === selectedStory.id) {
        return { ...s, comments: s.comments + 1 }
      }
      return s
    }))

    if (supabase) {
      await (supabase.from('story_comments' as any).insert({
        user_id: user.id,
        story_id: selectedStory.id,
        content: commentText
      } as any) as any)
    }

    setCommentText("")
  }

  return (
    <section className="py-32 px-6 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="mb-24"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-tight">Stories</h2>
          <p className="font-serif text-xl text-muted-foreground/60 italic lowercase">
            Lives changed, one journey at a time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: index * 0.15 }}
              className="group cursor-pointer space-y-8"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass inner-glow">
                <Image
                  src={story.image}
                  alt={story.traveller}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-700" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-foreground tracking-wide uppercase text-xs">{story.traveller}</p>
                    <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{story.trip} • {story.duration}</p>
                  </div>
                  <p className="font-sans text-[10px] text-muted-foreground/40 uppercase tracking-widest">{story.date}</p>
                </div>

                <p className="font-serif text-2xl text-foreground/90 leading-snug group-hover:text-primary transition-colors duration-500">
                  "{story.quote}"
                </p>

                <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                  <span className={`flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors ${story.isLiked ? 'text-primary' : 'text-muted-foreground/60'}`}>
                    <Heart className={`h-3 w-3 ${story.isLiked ? 'fill-current' : ''}`} />
                    {story.likes}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    <MessageCircle className="h-3 w-3" />
                    {story.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedStory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-6" 
              onClick={() => setSelectedStory(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={transition}
                className="bg-card glass inner-glow border border-white/5 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/5] md:aspect-auto">
                    <Image
                      src={selectedStory.image}
                      alt={selectedStory.traveller}
                      fill
                      className="object-cover"
                      quality={100}
                    />
                  </div>
                  
                  <div className="p-10 md:p-16 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <p className="font-sans font-bold text-foreground text-xs uppercase tracking-widest">{selectedStory.traveller}</p>
                          <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{selectedStory.trip} • {selectedStory.date}</p>
                        </div>
                        <Magnetic strength={0.2}>
                          <button onClick={() => setSelectedStory(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </Magnetic>
                      </div>

                      <p className="font-serif text-3xl md:text-4xl text-foreground mb-12 leading-tight italic">"{selectedStory.quote}"</p>
                    </div>

                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <Magnetic strength={0.1}>
                          <button
                            onClick={() => handleLike(selectedStory.id)}
                            className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 px-6 py-4 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${selectedStory.isLiked
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-white/5 text-foreground hover:bg-white/10'
                              }`}
                          >
                            <Heart className={`h-4 w-4 ${selectedStory.isLiked ? 'fill-current' : ''}`} />
                            {selectedStory.isLiked ? 'Liked' : 'Like'}
                          </button>
                        </Magnetic>
                        
                        <div className="flex-[2] relative">
                          <form onSubmit={handleComment} className="relative">
                            <input
                              type="text"
                              placeholder="Share your thoughts..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="w-full px-8 py-4 pr-16 rounded-full bg-white/5 border border-white/5 text-sm focus:outline-none focus:border-primary transition-colors focus:bg-white/10"
                            />
                            <button
                              type="submit"
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary-foreground transition-all"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
