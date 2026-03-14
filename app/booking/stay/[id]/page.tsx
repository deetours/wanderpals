import { StayBookingFlow } from "@/components/booking/stay-booking-flow"
import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createSupabaseServerClient()
    const { data: stay } = await supabase.from('stays').select('name').eq('id', id).single()
    if (!stay) return { title: "Booking | Wanderpals" }
    return {
      title: `Book ${stay.name} | Wanderpals`,
      description: `Reserve your spot at ${stay.name}`,
    }
  } catch {
    return { title: "Booking | Wanderpals" }
  }
}

export default async function StayBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const { data: stay, error } = await supabase
    .from('stays')
    .select('id, name, location, price, room_type, capacity, amenities')
    .eq('id', id)
    .single()

  if (error || !stay) {
    notFound()
  }

  // Build roomTypes array from Supabase data
  const roomTypes = [
    {
      name: stay.room_type || 'Standard Room',
      price: stay.price || 0,
      description: `Up to ${stay.capacity || 1} guest${(stay.capacity || 1) !== 1 ? 's' : ''}`,
    },
  ]

  const stayForFlow = {
    id: stay.id,
    name: stay.name,
    location: stay.location || '',
    roomTypes,
  }

  return <StayBookingFlow stay={stayForFlow} />
}
