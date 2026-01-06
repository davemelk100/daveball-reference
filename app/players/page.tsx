import { Suspense } from "react"
import { PlayerSearch } from "@/components/player-search"
import { PlayerCard } from "@/components/player-card"
import { getLeaders, getPlayer } from "@/lib/mlb-api"

export const revalidate = 3600

export default async function PlayersPage() {
  // Get top players from various categories to feature
  const [hrLeaders, avgLeaders] = await Promise.all([
    getLeaders("hitting", "homeRuns", 2024, 8),
    getLeaders("hitting", "battingAverage", 2024, 8),
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
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Player Search</h1>
        <p className="text-muted-foreground mb-6">Search for any MLB player to view their stats and profile</p>
        <Suspense fallback={<div className="h-10 bg-secondary rounded-md animate-pulse max-w-xl" />}>
          <PlayerSearch />
        </Suspense>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Players</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </main>
  )
}
