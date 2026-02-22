import { TripBookingFlow } from "@/components/booking/trip-booking-flow"
import { notFound } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const tripsData: Record<
  string,
  {
    name: string
    duration: string
    price: number
    dates: { start: string; end: string; spots: number }[]
  }
> = {
  spiti: {
    name: "Spiti Valley",
    duration: "9 Days",
    price: 28999,
    dates: [
      { start: "Jun 15", end: "Jun 23", spots: 4 },
      { start: "Jul 6", end: "Jul 14", spots: 8 },
      { start: "Aug 10", end: "Aug 18", spots: 2 },
      { start: "Sep 1", end: "Sep 9", spots: 10 },
    ],
  },
  ladakh: {
    name: "Ladakh Circuit",
    duration: "11 Days",
    price: 38999,
    dates: [
      { start: "Jun 20", end: "Jun 30", spots: 6 },
      { start: "Jul 15", end: "Jul 25", spots: 4 },
      { start: "Aug 5", end: "Aug 15", spots: 8 },
    ],
  },
  kerala: {
    name: "Kerala Backwaters",
    duration: "6 Days",
    price: 22999,
    dates: [
      { start: "Oct 10", end: "Oct 15", spots: 8 },
      { start: "Nov 5", end: "Nov 10", spots: 6 },
      { start: "Dec 20", end: "Dec 25", spots: 4 },
    ],
  },
  meghalaya: {
    name: "Meghalaya Trails",
    duration: "7 Days",
    price: 25999,
    dates: [
      { start: "Oct 15", end: "Oct 21", spots: 6 },
      { start: "Nov 10", end: "Nov 16", spots: 8 },
      { start: "Mar 5", end: "Mar 11", spots: 10 },
    ],
  },
}

async function getSupabaseTrip(tripId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data, error } = await supabase
      .from("trips")
      .select("id, name, duration, price")
      .eq("id", tripId)
      .single()

    if (error || !data) return null

    // Create default dates for Supabase trips
    const getMonth = (offset: number) => {
      const date = new Date()
      date.setMonth(date.getMonth() + offset)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return {
      id: data.id,
      name: data.name,
      duration: data.duration,
      price: data.price,
      dates: [
        { start: getMonth(0), end: getMonth(0), spots: 8 },
        { start: getMonth(1), end: getMonth(1), spots: 8 },
        { start: getMonth(2), end: getMonth(2), spots: 8 },
      ],
    }
  } catch (error) {
    console.error("Error fetching Supabase trip:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const staticTrip = tripsData[id]

  if (staticTrip) {
    return {
      title: `Join ${staticTrip.name} | Wanderpals`,
      description: `Reserve your spot on the ${staticTrip.name} journey`,
    }
  }

  const supabaseTrip = await getSupabaseTrip(id)
  if (!supabaseTrip) return { title: "Booking | Wanderpals" }

  return {
    title: `Join ${supabaseTrip.name} | Wanderpals`,
    description: `Reserve your spot on the ${supabaseTrip.name} journey`,
  }
}

export default async function TripBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { id } = await params
  const { date } = await searchParams

  // Try static trips first
  let trip = tripsData[id]

  // If not found, try Supabase
  if (!trip) {
    trip = await getSupabaseTrip(id)
  }

  if (!trip) {
    notFound()
  }

  return <TripBookingFlow trip={{ id, ...trip }} initialDateIndex={date ? Number.parseInt(date) : 0} />
}
