import type { Metadata } from "next"
import { getHallOfFamers } from "@/lib/mlb-api"
import { HofPageContent } from "@/components/hof-page-content"

export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "Browse MLB Hall of Fame inductees by year. View player profiles and career statistics.",
  alternates: {
    canonical: "/hof",
  },
  openGraph: {
    title: "MLB Hall of Fame",
    description: "Browse MLB Hall of Fame inductees by year.",
    type: "website",
  },
}

export default async function HofPage() {
  const hofMembers = await getHallOfFamers()

  return <HofPageContent hofMembers={hofMembers} />
}
