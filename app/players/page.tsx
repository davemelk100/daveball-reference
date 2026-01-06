import { Suspense } from "react"
import { PlayersPageContent } from "@/components/players-page-content"
import { getLeaders, getPlayer, getDefaultSeason } from "@/lib/mlb-api"

export const revalidate = 3600

export default async function PlayersPage() {
  const defaultSeason = getDefaultSeason()

  // Get top players from various categories to feature
  const [hrLeaders, avgLeaders] = await Promise.all([
    getLeaders("hitting", "homeRuns", defaultSeason, 8),
    getLeaders("hitting", "battingAverage", defaultSeason, 8),
  ])

  // Get unique player IDs
  const playerIds = new Set<number>()
  const featuredPlayers: any[] = []

  for (const leader of [...hrLeaders, ...avgLeaders]) {
    if (!playerIds.has(leader.person.id) && featuredPlayers.length < 12) {
      playerIds.add(leader.person.id)
      const playerData = await getPlayer(leader.person.id)
      if (playerData) {
        featuredPlayers.push(playerData)
      }
    }
  }

  return (
    <Suspense fallback={null}>
      <PlayersPageContent initialPlayers={featuredPlayers} initialSeason={defaultSeason} />
    </Suspense>
  )
}
