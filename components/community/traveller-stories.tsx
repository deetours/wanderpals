'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'

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
}

const stories: Story[] = [
  {
    id: '1',
    traveller: 'Priya M.',
    trip: 'Spiti Valley',
    duration: '7 days',
    image: '/stories/spiti-priya.jpg',
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
    image: '/stories/kerala-couple.jpg',
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
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

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
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
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
            <div className="bg-card rounded-lg max-w-2xl w-full space-y-6 p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-sans font-semibold text-foreground">{selectedStory.traveller}</p>
                  <p className="font-sans text-sm text-muted-foreground">{selectedStory.trip}</p>
                </div>
                <button onClick={() => setSelectedStory(null)} className="text-muted-foreground hover:text-foreground">×</button>
              </div>
              
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={selectedStory.image}
                  alt={selectedStory.traveller}
                  fill
                  className="object-cover"
                />
              </div>
              
              <p className="font-serif text-xl text-foreground">"{selectedStory.quote}"</p>
              
              <div className="flex gap-4">
                <button className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/15 rounded-lg font-sans text-sm text-primary transition-colors">
                  <Heart className="h-4 w-4 inline mr-2" />
                  Like
                </button>
                <button className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/15 rounded-lg font-sans text-sm text-primary transition-colors">
                  <MessageCircle className="h-4 w-4 inline mr-2" />
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
