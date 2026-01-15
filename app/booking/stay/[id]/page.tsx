import { StayBookingFlow } from "@/components/booking/stay-booking-flow"
import { notFound } from "next/navigation"

const staysData: Record<
  string,
  { name: string; location: string; roomTypes: { name: string; price: number; description: string }[] }
> = {
  bir: {
    name: "Wanderpals Bir",
    location: "Himachal Pradesh",
    roomTypes: [
      { name: "Dorm Bed", price: 599, description: "Mixed dorm, 6 beds" },
      { name: "Private Room", price: 1499, description: "Double bed, mountain view" },
    ],
  },
  gokarna: {
    name: "Wanderpals Gokarna",
    location: "Karnataka",
    roomTypes: [
      { name: "Beach Dorm", price: 549, description: "Mixed dorm, 8 beds, sea breeze" },
      { name: "Cliff Room", price: 1299, description: "Private room with ocean view" },
    ],
  },
  manali: {
    name: "Wanderpals Manali",
    location: "Himachal Pradesh",
    roomTypes: [
      { name: "Mountain Dorm", price: 649, description: "Mixed dorm, 6 beds, heated" },
      { name: "River View Room", price: 1699, description: "Private room, balcony" },
    ],
  },
  pondicherry: {
    name: "Wanderpals Pondicherry",
    location: "Tamil Nadu",
    roomTypes: [
      { name: "Heritage Dorm", price: 699, description: "Mixed dorm, 4 beds, AC" },
      { name: "French Quarter Room", price: 1899, description: "Private, courtyard access" },
    ],
  },
  rishikesh: {
    name: "Wanderpals Rishikesh",
    location: "Uttarakhand",
    roomTypes: [
      { name: "Riverside Dorm", price: 579, description: "Mixed dorm, 6 beds" },
      { name: "Ganga View Room", price: 1399, description: "Private, river facing" },
    ],
  },
  varkala: {
    name: "Wanderpals Varkala",
    location: "Kerala",
    roomTypes: [
      { name: "Cliff Dorm", price: 549, description: "Mixed dorm, 6 beds" },
      { name: "Sea View Suite", price: 1599, description: "Private, panoramic view" },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stay = staysData[id]
  if (!stay) return { title: "Booking | Wanderpals" }

  return {
    title: `Book ${stay.name} | Wanderpals`,
    description: `Reserve your spot at ${stay.name}`,
  }
}

export default async function StayBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stay = staysData[id]

  if (!stay) {
    notFound()
  }

  return <StayBookingFlow stay={{ id, ...stay }} />
}
