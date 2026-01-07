import type { Metadata } from "next"
import { getStandings, getDefaultSeason } from "@/lib/mlb-api"
import { StandingsPageContent } from "@/components/standings-page-content"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "MLB Standings",
  description: "View current MLB standings by division and league. Track wins, losses, winning percentage, and playoff positioning.",
  alternates: {
    canonical: "/standings",
  },
  openGraph: {
    title: "MLB Standings - Division & League Rankings",
    description: "View current MLB standings by division and league. Track wins, losses, winning percentage, and playoff positioning.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLB Standings",
    description: "Current MLB standings by division with wins, losses, and playoff positioning.",
  },
}

export default async function StandingsPage() {
  const defaultSeason = getDefaultSeason()
  const standings = await getStandings(defaultSeason)

  return <StandingsPageContent initialStandings={standings} initialSeason={defaultSeason} />
}
