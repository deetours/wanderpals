import { StayDetails } from "@/components/stays/stay-details"
import { notFound } from "next/navigation"

// Stay data
const staysData: Record<
  string,
  {
    id: string
    name: string
    location: string
    state: string
    tagline: string
    heroImage: string
    feeling: string
    images: string[]
    quotes: { text: string; author: string }[]
    amenities: string[]
    roomTypes: { name: string; price: number; description: string }[]
  }
> = {
  bir: {
    id: "bir",
    name: "Wanderpals Bir",
    location: "Bir",
    state: "Himachal Pradesh",
    tagline: "For slow mornings and shared evenings",
    heroImage: "/stays/bir-hero.jpg",
    feeling:
      "This is the kind of place where days stretch and plans soften. Where the sound of paragliders overhead becomes your morning alarm, and conversations over chai last until the stars come out.",
    images: ["/stays/bir-1.jpg", "/stays/bir-2.jpg", "/stays/bir-3.jpg", "/stays/bir-4.jpg"],
    quotes: [
      { text: "I stayed three nights. I left after nine.", author: "A traveller, February" },
      { text: "Felt like home by day two.", author: "Solo wanderer, March" },
    ],
    amenities: ["Verified hosts", "Local team", "24/7 support"],
    roomTypes: [
      { name: "Dorm Bed", price: 599, description: "Mixed dorm, 6 beds" },
      { name: "Private Room", price: 1499, description: "Double bed, mountain view" },
    ],
  },
  gokarna: {
    id: "gokarna",
    name: "Wanderpals Gokarna",
    location: "Gokarna",
    state: "Karnataka",
    tagline: "Salt air and shared sunsets",
    heroImage: "/stays/gokarna-hero.jpg",
    feeling:
      "Where the Arabian Sea meets ancient temples, and every sunset feels earned. The kind of beach town that hasn't forgotten how to be quiet.",
    images: ["/stays/gokarna-1.jpg", "/stays/gokarna-2.jpg", "/stays/gokarna-3.jpg", "/stays/gokarna-4.jpg"],
    quotes: [
      { text: "The beach walks here hit different.", author: "Weekend traveller, January" },
      { text: "Best hammock naps of my life.", author: "Digital nomad, December" },
    ],
    amenities: ["Verified hosts", "Beach access", "24/7 support"],
    roomTypes: [
      { name: "Beach Dorm", price: 549, description: "Mixed dorm, 8 beds, sea breeze" },
      { name: "Cliff Room", price: 1299, description: "Private room with ocean view" },
    ],
  },
  manali: {
    id: "manali",
    name: "Wanderpals Manali",
    location: "Manali",
    state: "Himachal Pradesh",
    tagline: "Snow, silence, and stories",
    heroImage: "/stays/manali-hero.jpg",
    feeling:
      "Tucked away from the main bazaar chaos. The kind of place where you wake up to snow-capped peaks and fall asleep to the sound of the river.",
    images: ["/stays/manali-1.jpg", "/stays/manali-2.jpg", "/stays/manali-3.jpg", "/stays/manali-4.jpg"],
    quotes: [
      { text: "Extended my trip twice. No regrets.", author: "Mountain lover, January" },
      { text: "The bonfire nights are unmatched.", author: "First-time solo, February" },
    ],
    amenities: ["Verified hosts", "Bonfire space", "24/7 support"],
    roomTypes: [
      { name: "Mountain Dorm", price: 649, description: "Mixed dorm, 6 beds, heated" },
      { name: "River View Room", price: 1699, description: "Private room, balcony" },
    ],
  },
  pondicherry: {
    id: "pondicherry",
    name: "Wanderpals Pondicherry",
    location: "Pondicherry",
    state: "Tamil Nadu",
    tagline: "French doors, local souls",
    heroImage: "/stays/pondicherry-hero.jpg",
    feeling:
      "Colonial architecture meets South Indian warmth. Where mornings start with filter coffee and evenings end on the promenade.",
    images: [
      "/stays/pondicherry-1.jpg",
      "/stays/pondicherry-2.jpg",
      "/stays/pondicherry-3.jpg",
      "/stays/pondicherry-4.jpg",
    ],
    quotes: [
      { text: "The croissants and conversations were equally good.", author: "Café hopper, March" },
      { text: "Finally found my reading corner.", author: "Book lover, April" },
    ],
    amenities: ["Verified hosts", "Bicycle rental", "24/7 support"],
    roomTypes: [
      { name: "Heritage Dorm", price: 699, description: "Mixed dorm, 4 beds, AC" },
      { name: "French Quarter Room", price: 1899, description: "Private, courtyard access" },
    ],
  },
  rishikesh: {
    id: "rishikesh",
    name: "Wanderpals Rishikesh",
    location: "Rishikesh",
    state: "Uttarakhand",
    tagline: "River sounds and early risers",
    heroImage: "/stays/rishikesh-hero.jpg",
    feeling:
      "Where the Ganga flows and time moves differently. For those who want adventure by day and stillness by night.",
    images: ["/stays/rishikesh-1.jpg", "/stays/rishikesh-2.jpg", "/stays/rishikesh-3.jpg", "/stays/rishikesh-4.jpg"],
    quotes: [
      { text: "Rafting, yoga, repeat. Perfect.", author: "Adventure seeker, October" },
      { text: "The river view from the common area is meditative.", author: "Yoga teacher, November" },
    ],
    amenities: ["Verified hosts", "Yoga deck", "24/7 support"],
    roomTypes: [
      { name: "Riverside Dorm", price: 579, description: "Mixed dorm, 6 beds" },
      { name: "Ganga View Room", price: 1399, description: "Private, river facing" },
    ],
  },
  varkala: {
    id: "varkala",
    name: "Wanderpals Varkala",
    location: "Varkala",
    state: "Kerala",
    tagline: "Cliffs, cafes, and calm",
    heroImage: "/stays/varkala-hero.jpg",
    feeling: "Red cliffs dropping into the Arabian Sea. Where every café has a view and every sunset is a gathering.",
    images: ["/stays/varkala-1.jpg", "/stays/varkala-2.jpg", "/stays/varkala-3.jpg", "/stays/varkala-4.jpg"],
    quotes: [
      { text: "The cliff walk at sunset is mandatory.", author: "Photo enthusiast, December" },
      { text: "Best Ayurvedic massage recommendation ever.", author: "Wellness seeker, January" },
    ],
    amenities: ["Verified hosts", "Cliff access", "24/7 support"],
    roomTypes: [
      { name: "Cliff Dorm", price: 549, description: "Mixed dorm, 6 beds" },
      { name: "Sea View Suite", price: 1599, description: "Private, panoramic view" },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(staysData).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stay = staysData[id]
  if (!stay) return { title: "Stay Not Found | Wanderpals" }

  return {
    title: `${stay.name} | Wanderpals`,
    description: stay.feeling,
  }
}

export default async function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stay = staysData[id]

  if (!stay) {
    notFound()
  }

  return <StayDetails stay={stay} />
}
