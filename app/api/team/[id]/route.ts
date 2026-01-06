import { type NextRequest, NextResponse } from "next/server"
import { getTeam, getTeamRoster, getStandings } from "@/lib/mlb-api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const teamId = Number.parseInt(id, 10)
  const searchParams = request.nextUrl.searchParams
  const season = searchParams.get("season") || new Date().getFullYear().toString()

  try {
    const [team, roster, standings] = await Promise.all([
      getTeam(teamId),
      getTeamRoster(teamId, Number.parseInt(season)),
      getStandings(Number.parseInt(season)),
    ])

    // Find team's record in standings
    let teamRecord = null
    for (const division of standings) {
      const found = division.teamRecords?.find((r: any) => r.team.id === teamId)
      if (found) {
        teamRecord = found
        break
      }
    }

    return NextResponse.json({ team, roster, teamRecord, season: Number.parseInt(season) })
  } catch (error) {
    console.error("Error fetching team data:", error)
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 })
  }
}
