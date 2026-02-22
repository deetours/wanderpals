"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const heroImages = [
  {
    src: "/hero-campfire-spiti.jpg",
    alt: "Strangers laughing around a campfire at 4AM in Spiti Valley",
  },
  {
    src: "/hero-houseboat-kerala.jpg",
    alt: "Two strangers becoming friends on a Kerala houseboat at sunrise",
  },
  {
    src: "/hero-foggy-valley-dawn.jpg",
    alt: "Foggy mountain valley at dawn, travellers walking together",
  },
]


export function SceneHeroVisual() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
            quality={85}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
    </div>
  )
}
