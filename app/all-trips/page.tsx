import { AllTripsDynamic } from "@/components/all-trips/all-trips-dynamic"
import { getTrips } from "@/lib/trips"

export const revalidate = 0

export const metadata = {
  title: "All Trips | Wanderpals",
  description: "Every journey we currently run. Different places. Same pace.",
}

export default async function AllTrips() {
  const initialTrips = await getTrips()
  return <AllTripsDynamic initialTrips={initialTrips} />
}
