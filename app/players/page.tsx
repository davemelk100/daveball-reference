import type { Metadata } from "next"
import { Suspense } from "react"
import { PlayersPageContent } from "@/components/players-page-content"
import { getLeaders, getDefaultSeason } from "@/lib/mlb-api"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "MLB Players",
  description: "Browse MLB players, search by name or team, and view detailed statistics for current and historical players.",
  alternates: {
    canonical: "/players",
  },
  openGraph: {
    title: "MLB Players - Search & Stats",
    description: "Browse MLB players, search by name or team, and view detailed statistics for current and historical players.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLB Players",
    description: "Browse MLB players, search by name or team, and view detailed statistics.",
  },
}

export default async function PlayersPage() {
  const defaultSeason = getDefaultSeason()

  // Get top players from various categories - leader data already includes player info
  const [hrLeaders, avgLeaders, rbiLeaders] = await Promise.all([
    getLeaders("hitting", "homeRuns", defaultSeason, 6),
    getLeaders("hitting", "battingAverage", defaultSeason, 6),
    getLeaders("hitting", "runsBattedIn", defaultSeason, 6),
  ])

  // Convert leader data to featured players format without extra API calls
  const playerMap = new Map<number, any>()

  for (const leader of [...hrLeaders, ...avgLeaders, ...rbiLeaders]) {
    if (!playerMap.has(leader.person.id)) {
      playerMap.set(leader.person.id, {
        id: leader.person.id,
        fullName: leader.person.fullName,
        firstName: leader.person.firstName || leader.person.fullName.split(" ")[0],
        lastName: leader.person.lastName || leader.person.fullName.split(" ").slice(1).join(" "),
        currentTeam: leader.team ? { id: leader.team.id, name: leader.team.name } : undefined,
        primaryPosition: { abbreviation: leader.person.primaryPosition?.abbreviation || "P" },
        active: true,
      })
    }
  }

  const featuredPlayers = Array.from(playerMap.values()).slice(0, 12)

  return (
    <Suspense fallback={null}>
      <PlayersPageContent initialPlayers={featuredPlayers} initialSeason={defaultSeason} />
    </Suspense>
  )
}
