import { type NextRequest, NextResponse } from "next/server"
import { getLeaders, getPlayer, getDefaultSeason, getAllPlayers } from "@/lib/mlb-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const season = Number.parseInt(searchParams.get("season") || getDefaultSeason().toString())
  const type = searchParams.get("type")

  try {
    if (type === "all") {
      const allPlayers = await getAllPlayers(season)
      return NextResponse.json({ players: allPlayers, season })
    }

    const [hrLeaders, avgLeaders] = await Promise.all([
      getLeaders("hitting", "homeRuns", season, 8),
      getLeaders("hitting", "battingAverage", season, 8),
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

    return NextResponse.json({ featuredPlayers, season })
  } catch (error) {
    console.error("Error fetching players data:", error)
    return NextResponse.json({ featuredPlayers: [], season }, { status: 500 })
  }
}
