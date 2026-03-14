import { TripBookingFlow } from "@/components/booking/trip-booking-flow"
import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createSupabaseServerClient()
    const { data: trip } = await supabase.from('trips').select('name').eq('id', id).single()
    if (!trip) return { title: "Booking | Wanderpals" }
    return {
      title: `Join ${trip.name} | Wanderpals`,
      description: `Reserve your spot on the ${trip.name} journey`,
    }
  } catch {
    return { title: "Booking | Wanderpals" }
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

  const supabase = await createSupabaseServerClient()
  const { data: trip, error } = await supabase
    .from('trips')
    .select('id, name, duration, price, dates, group_size')
    .eq('id', id)
    .single()

  if (error || !trip) {
    notFound()
  }

  // Normalise dates — may come from Supabase as JSONB array or may be null
  const rawDates = Array.isArray(trip.dates) ? trip.dates : []
  const dates = rawDates.length > 0
    ? rawDates.map((d: any) => ({
        start: d.start || d.date || 'TBA',
        end: d.end || d.date || 'TBA',
        spots: typeof d.spots === 'number' ? d.spots : (trip.group_size || 12),
      }))
    : [
        // Fallback when no dates are configured yet
        { start: 'Next Available', end: 'Flexible', spots: trip.group_size || 12 },
      ]

  const tripForFlow = {
    id: trip.id,
    name: trip.name,
    duration: trip.duration ? `${trip.duration}` : 'Custom',
    price: trip.price || 0,
    dates,
  }

  return <TripBookingFlow trip={tripForFlow} initialDateIndex={date ? parseInt(date) : 0} />
}
