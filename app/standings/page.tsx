import { getStandings } from "@/lib/mlb-api"
import { StandingsPageContent } from "@/components/standings-page-content"

export const revalidate = 3600

const DEFAULT_SEASON = 2025

export default async function StandingsPage() {
  const standings = await getStandings(DEFAULT_SEASON)

  return <StandingsPageContent initialStandings={standings} initialSeason={DEFAULT_SEASON} />
}
