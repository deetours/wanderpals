import { ExploreStaysDynamic } from "@/components/stays/explore-stays-dynamic"
import { getStays } from "@/lib/trips"

export const revalidate = 0

export const metadata = {
  title: "Stays | Wanderpals",
  description: "Places you don't just check into. You arrive as a guest. You leave knowing names.",
}

export default async function StaysPage() {
  const initialStays = await getStays()
  return <ExploreStaysDynamic initialStays={initialStays} />
}
