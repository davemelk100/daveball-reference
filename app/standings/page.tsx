import { getStandings, getDefaultSeason } from "@/lib/mlb-api"
import { StandingsPageContent } from "@/components/standings-page-content"

export const revalidate = 3600

export default async function StandingsPage() {
  const defaultSeason = getDefaultSeason()
  const standings = await getStandings(defaultSeason)

  return <StandingsPageContent initialStandings={standings} initialSeason={defaultSeason} />
}
