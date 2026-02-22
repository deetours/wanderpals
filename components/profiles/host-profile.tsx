'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, Users, MapPin } from 'lucide-react'

interface Host {
  id: string
  name: string
  photo: string
  location: string
  yearsHosting: number
  bio: string
  philosophy: string
  hostsTrips: number
  travelledTo: number
  languages: string[]
}

export function HostProfile({ host }: { host: Host }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="space-y-6 py-12 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Meet your host</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Host photo */}
        <div className="md:col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={host.photo}
              alt={host.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="font-serif text-xl text-foreground">{host.name}</h3>
            <p className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {host.location}
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              Hosting for {host.yearsHosting} years
            </p>
          </div>
        </div>

        {/* Host story */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h4 className="font-serif text-lg text-foreground mb-3">The story</h4>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              {host.bio}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-foreground mb-3">My philosophy</h4>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground italic">
              "{host.philosophy}"
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-muted-foreground/10">
            <div>
              <p className="font-serif text-2xl text-primary">{host.hostsTrips}+</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">Trips hosted</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-primary">{host.travelledTo}</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">Countries visited</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-primary">{host.languages.length}</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">Languages</p>
            </div>
          </div>

          {/* Contact host */}
          <button className="w-full mt-6 px-4 py-3 bg-primary/10 hover:bg-primary/15 rounded-lg font-sans text-sm text-primary transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask a question before booking
          </button>
        </div>
      </div>
    </section>
  )
}
