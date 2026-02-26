import { AllTripsDynamic } from "@/components/all-trips/all-trips-dynamic"

export const revalidate = 0

export const metadata = {
  title: "All Trips | Wanderpals",
  description: "Every journey we currently run. Different places. Same pace.",
}

export default function AllTrips() {
  return <AllTripsDynamic />
}
