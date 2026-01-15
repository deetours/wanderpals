import { TripBookingFlow } from "@/components/booking/trip-booking-flow"
import { notFound } from "next/navigation"

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = tripsData[id]
  if (!trip) return { title: "Booking | Wanderpals" }

  return {
    title: `Join ${trip.name} | Wanderpals`,
    description: `Reserve your spot on the ${trip.name} journey`,
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
  const trip = tripsData[id]

  if (!trip) {
    notFound()
  }

  return <TripBookingFlow trip={{ id, ...trip }} initialDateIndex={date ? Number.parseInt(date) : 0} />
}
