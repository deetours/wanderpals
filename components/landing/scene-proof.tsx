"use client"

import { useEffect, useRef, useState } from "react"

export function SceneProof() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.4 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="space-y-5">
        <p
          className={`font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Trusted by <span className="text-foreground font-medium">4,800+</span> travellers
        </p>
        <p
          className={`font-sans text-lg md:text-xl text-muted-foreground transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          Across <span className="text-foreground font-medium">120+</span> places in India
        </p>
      </div>
    </section>
  )
}
