import { TripDetails } from "@/components/trips/trip-details"
import { TripDetailsDynamic } from "@/components/trips/trip-details-dynamic"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

// Trip data - Static trips
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
    heroImage: "/trips/spiti-hero.jpg",
    why: "This journey exists because some roads deserve patience. Because high-altitude deserts teach you things flat lands never will. Because sharing a cold night with strangers makes the warmth mean more.",
    acts: [
      {
        title: "Arrival",
        description: "Shimla to Narkanda. The mountains begin.",
        image: "/trips/spiti-arrival.jpg",
      },
      {
        title: "Ascent",
        description: "Chitkul, Kalpa, and the Kinnaur valleys. Altitude adjusts your priorities.",
        image: "/trips/spiti-ascent.jpg",
      },
      {
        title: "Stillness",
        description: "Kaza, Key, and Kibber. The heart of Spiti. Time stops making sense.",
        image: "/trips/spiti-stillness.jpg",
      },
      {
        title: "Return",
        description: "Kunzum Pass, Chandratal, and the descent. You leave different.",
        image: "/trips/spiti-return.jpg",
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
    heroImage: "/trips/ladakh-hero.jpg",
    why: "Because Ladakh isn't a destination, it's a reckoning. The kind of place that makes you question what you thought you knew about beauty, about space, about yourself.",
    acts: [
      {
        title: "Arrival",
        description: "Leh. Acclimatization. Let your body catch up with your excitement.",
        image: "/trips/ladakh-arrival.jpg",
      },
      {
        title: "Ascent",
        description: "Khardung La, Nubra Valley. The highest roads on earth.",
        image: "/trips/ladakh-ascent.jpg",
      },
      {
        title: "Stillness",
        description: "Pangong Lake. Blue that doesn't exist elsewhere. Silence that speaks.",
        image: "/trips/ladakh-stillness.jpg",
      },
      {
        title: "Return",
        description: "Tso Moriri, and the long way back. Changed.",
        image: "/trips/ladakh-return.jpg",
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
    heroImage: "/trips/kerala-hero.jpg",
    why: "Because speed is overrated. Because floating through life for a few days teaches you to stop rushing. Because the backwaters of Kerala hold stories in their stillness.",
    acts: [
      {
        title: "Arrival",
        description: "Kochi. Colonial history meets spice markets. Fort Kochi sunsets.",
        image: "/trips/kerala-arrival.jpg",
      },
      {
        title: "Ascent",
        description: "Munnar. Tea estates that roll forever. Cool mountain air.",
        image: "/trips/kerala-ascent.jpg",
      },
      {
        title: "Stillness",
        description: "Alleppey. Houseboats and hammocks. The pace of water.",
        image: "/trips/kerala-stillness.jpg",
      },
      {
        title: "Return",
        description: "Varkala cliffs. One last sunset over the Arabian Sea.",
        image: "/trips/kerala-return.jpg",
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
    heroImage: "/trips/meghalaya-hero.jpg",
    why: "Because living root bridges aren't just engineering marvels—they're lessons in patience. Because the wettest place on earth has learned to live with rain, not fight it.",
    acts: [
      {
        title: "Arrival",
        description: "Shillong. The Scotland of the East. Music in the hills.",
        image: "/trips/meghalaya-arrival.jpg",
      },
      {
        title: "Ascent",
        description: "Cherrapunji. Living root bridges. Ancient lessons in sustainability.",
        image: "/trips/meghalaya-ascent.jpg",
      },
      {
        title: "Stillness",
        description: "Dawki. Crystal rivers. The border with Bangladesh.",
        image: "/trips/meghalaya-stillness.jpg",
      },
      {
        title: "Return",
        description: "Mawlynnong. Asia's cleanest village. Simple lessons.",
        image: "/trips/meghalaya-return.jpg",
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
  const tripResult = await getTripData(id)

  if (!tripResult) return { title: "Trip Not Found | Wanderpals" }

  const trip = tripResult.data
  return {
    title: `${trip.name || trip.title} | Wanderpals`,
    description: trip.why || trip.description,
  }
}


// Check if trip is static or needs to fetch from Supabase
async function getTripData(id: string) {
  // First check static data
  if (tripsData[id]) {
    return { type: "static", data: tripsData[id] }
  }

  // Try to fetch from Supabase for new trips
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      return { type: "dynamic", data }
    }
  } catch (error) {
    console.error("Error fetching trip:", error)
  }

  return null
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Get trip data from static or Supabase
  const tripResult = await getTripData(id)

  if (!tripResult) {
    notFound()
  }

  // If it's a dynamic trip from Supabase, use the dynamic component
  if (tripResult.type === "dynamic") {
    return <TripDetailsDynamic tripId={id} />
  }

  // Otherwise use the static component
  return <TripDetails trip={tripResult.data} />
}
