import { StayDetails } from "@/components/stays/stay-details"
import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createSupabaseServerClient()
    const { data: stay } = await supabase
      .from('stays')
      .select('name, description, tagline')
      .eq('id', id)
      .single()

    if (!stay) return { title: "Stay Not Found | Wanderpals" }
    return {
      title: `${stay.name} | Wanderpals`,
      description: stay.description || stay.tagline || "A Wanderpals stay.",
    }
  } catch {
    return { title: "Stay | Wanderpals" }
  }
}

export default async function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const { data: stay, error } = await supabase
    .from('stays')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !stay) {
    notFound()
  }

  // Map Supabase stay fields to the shape StayDetails expects
  const stayForComponent = {
    id: stay.id,
    name: stay.name || "Untitled Stay",
    location: stay.location || "",
    state: stay.location || "",
    tagline: stay.tagline || "",
    heroImage: stay.image_url || "/hero2.png",
    feeling: stay.description || stay.tagline || "",
    images: Array.isArray(stay.gallery) ? stay.gallery.filter(Boolean) : [],
    quotes: [] as { text: string; author: string }[],
    amenities: Array.isArray(stay.amenities) ? stay.amenities.filter(Boolean) : [],
    roomTypes: [
      {
        name: stay.room_type || "Room",
        price: stay.price || 0,
        description: `Capacity: ${stay.capacity || 1} guest${(stay.capacity || 1) !== 1 ? 's' : ''}`,
      },
    ],
  }

  return <StayDetails stay={stayForComponent} />
}
