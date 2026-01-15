import { TripDetails } from "@/components/trips/trip-details"
import { notFound } from "next/navigation"

// Trip data
const tripsData: Record<
  string,
  {
    id: string
    name: string
    tagline: string
    heroImage: string
    why: string
    acts: { title: string; description: string; image: string }[]
    groupInfo: string
    dates: { start: string; end: string; spots: number }[]
    difficulty: string
    inclusions: string[]
    price: number
    duration: string
  }
> = {
  spiti: {
    id: "spiti",
    name: "Spiti Valley",
    tagline: "Silence, altitude, and shared roads",
    heroImage: "/spiti1.jpg",
    why: "This journey exists because some roads deserve patience. Because high-altitude deserts teach you things flat lands never will. Because sharing a cold night with strangers makes the warmth mean more.",
    acts: [
      {
        title: "Arrival",
        description: "Shimla to Narkanda. The mountains begin.",
        image: "/spiti1.jpg",
      },
      {
        title: "Ascent",
        description: "Chitkul, Kalpa, and the Kinnaur valleys. Altitude adjusts your priorities.",
        image: "/spiti2.jpg",
      },
      {
        title: "Stillness",
        description: "Kaza, Key, and Kibber. The heart of Spiti. Time stops making sense.",
        image: "/spiti3.jpg",
      },
      {
        title: "Return",
        description: "Kunzum Pass, Chandratal, and the descent. You leave different.",
        image: "/spiti1.jpg",
      },
    ],
    groupInfo: "8–10 travellers. No spectators. Everyone belongs.",
    dates: [
      { start: "Jun 15", end: "Jun 23", spots: 4 },
      { start: "Jul 6", end: "Jul 14", spots: 8 },
      { start: "Aug 10", end: "Aug 18", spots: 2 },
      { start: "Sep 1", end: "Sep 9", spots: 10 },
    ],
    difficulty: "Moderate",
    inclusions: [
      "All accommodation",
      "Breakfast & dinner",
      "Transport in tempo traveller",
      "Local experiences",
      "Experienced trip lead",
    ],
    price: 28999,
    duration: "9 Days",
  },
  ladakh: {
    id: "ladakh",
    name: "Ladakh Circuit",
    tagline: "Where the sky meets the earth",
    heroImage: "/ladakh2.jpg",
    why: "Because Ladakh isn't a destination, it's a reckoning. The kind of place that makes you question what you thought you knew about beauty, about space, about yourself.",
    acts: [
      {
        title: "Arrival",
        description: "Leh. Acclimatization. Let your body catch up with your excitement.",
        image: "/ladakh1.jpg",
      },
      {
        title: "Ascent",
        description: "Khardung La, Nubra Valley. The highest roads on earth.",
        image: "/ladakh2.jpg",
      },
      {
        title: "Stillness",
        description: "Pangong Lake. Blue that doesn't exist elsewhere. Silence that speaks.",
        image: "/ladakh3.jpg",
      },
      {
        title: "Return",
        description: "Tso Moriri, and the long way back. Changed.",
        image: "/ladakh2.jpg",
      },
    ],
    groupInfo: "8–10 travellers. Shared jeeps. Shared silences.",
    dates: [
      { start: "Jun 20", end: "Jun 30", spots: 6 },
      { start: "Jul 15", end: "Jul 25", spots: 4 },
      { start: "Aug 5", end: "Aug 15", spots: 8 },
    ],
    difficulty: "Challenging",
    inclusions: [
      "All accommodation",
      "All meals",
      "Innova/Tempo transport",
      "Permits",
      "Oxygen backup",
      "Experienced trip lead",
    ],
    price: 38999,
    duration: "11 Days",
  },
  kerala: {
    id: "kerala",
    name: "Kerala Backwaters",
    tagline: "Slow rivers, slower days",
    heroImage: "/kerala3.jpg",
    why: "Because speed is overrated. Because floating through life for a few days teaches you to stop rushing. Because the backwaters of Kerala hold stories in their stillness.",
    acts: [
      {
        title: "Arrival",
        description: "Kochi. Colonial history meets spice markets. Fort Kochi sunsets.",
        image: "/kerala1.jpg",
      },
      {
        title: "Ascent",
        description: "Munnar. Tea estates that roll forever. Cool mountain air.",
        image: "/kerala2.jpg",
      },
      {
        title: "Stillness",
        description: "Alleppey. Houseboats and hammocks. The pace of water.",
        image: "/kerala3.jpg",
      },
      {
        title: "Return",
        description: "Varkala cliffs. One last sunset over the Arabian Sea.",
        image: "/kerala3.jpg",
      },
    ],
    groupInfo: "10–12 travellers. Shared boats. Shared meals.",
    dates: [
      { start: "Oct 10", end: "Oct 15", spots: 8 },
      { start: "Nov 5", end: "Nov 10", spots: 6 },
      { start: "Dec 20", end: "Dec 25", spots: 4 },
    ],
    difficulty: "Easy",
    inclusions: [
      "All accommodation including houseboat",
      "Breakfast",
      "All transport",
      "Kathakali show",
      "Spice plantation visit",
    ],
    price: 22999,
    duration: "6 Days",
  },
  meghalaya: {
    id: "meghalaya",
    name: "Meghalaya Trails",
    tagline: "Clouds below, roots above",
    heroImage: "/meghalaya1.jpg",
    why: "Because living root bridges aren't just engineering marvels—they're lessons in patience. Because the wettest place on earth has learned to live with rain, not fight it.",
    acts: [
      {
        title: "Arrival",
        description: "Shillong. The Scotland of the East. Music in the hills.",
        image: "/meghalaya1.jpg",
      },
      {
        title: "Ascent",
        description: "Cherrapunji. Living root bridges. Ancient lessons in sustainability.",
        image: "/meghalaya2.jpg",
      },
      {
        title: "Stillness",
        description: "Dawki. Crystal rivers. The border with Bangladesh.",
        image: "/meghalaya3.jpg",
      },
      {
        title: "Return",
        description: "Mawlynnong. Asia's cleanest village. Simple lessons.",
        image: "/meghalaya1.jpg",
      },
    ],
    groupInfo: "8–10 travellers. Shared treks. Shared wonder.",
    dates: [
      { start: "Oct 15", end: "Oct 21", spots: 6 },
      { start: "Nov 10", end: "Nov 16", spots: 8 },
      { start: "Mar 5", end: "Mar 11", spots: 10 },
    ],
    difficulty: "Moderate",
    inclusions: ["All accommodation", "Breakfast & dinner", "Sumo transport", "Guide fees", "Living root bridge trek"],
    price: 25999,
    duration: "7 Days",
  },
}

export async function generateStaticParams() {
  return Object.keys(tripsData).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = tripsData[id]
  if (!trip) return { title: "Trip Not Found | Wanderpals" }

  return {
    title: `${trip.name} | Wanderpals`,
    description: trip.why,
  }
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = tripsData[id]

  if (!trip) {
    notFound()
  }

  return <TripDetails trip={trip} />
}
