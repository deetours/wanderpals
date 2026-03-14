import { StayBookingFlow } from "@/components/booking/stay-booking-flow"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const revalidate = 0

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ room?: string }>
}) {
  const { id } = await params
  const { room } = await searchParams
  try {
    const supabase = await createSupabaseServerClient()
    const { data: stay } = await supabase.from('stays').select('name').eq('id', id).single()
    const name = stay?.name || room || "Stay"
    return {
      title: `Book ${name} | Wanderpals`,
      description: `Reserve your space at ${name}`,
    }
  } catch {
    return { title: "Booking | Wanderpals" }
  }
}

export default async function StayBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ room?: string }>
}) {
  const { id } = await params
  const { room: roomParam } = await searchParams

  // Try to fetch from Supabase — but NEVER 404 if it fails.
  // The booking flow can proceed with whatever info we have.
  let stayForFlow = {
    id,
    name: "Your Selected Stay",
    location: "",
    roomTypes: [
      {
        name: roomParam ? decodeURIComponent(roomParam) : "Standard Room",
        price: 0,
        description: "Contact us to confirm room details",
      },
    ],
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data: stay } = await supabase
      .from('stays')
      .select('id, name, location, price, room_type, capacity')
      .eq('id', id)
      .single()

    if (stay) {
      stayForFlow = {
        id: stay.id,
        name: stay.name || "Your Selected Stay",
        location: stay.location || "",
        roomTypes: [
          {
            name: roomParam
              ? decodeURIComponent(roomParam)
              : stay.room_type || "Standard Room",
            price: stay.price || 0,
            description: `Up to ${stay.capacity || 1} guest${(stay.capacity || 1) !== 1 ? 's' : ''}`,
          },
        ],
      }
    }
  } catch {
    // RLS may be blocking — still render the booking flow with fallback data
  }

  return <StayBookingFlow stay={stayForFlow} />
}
