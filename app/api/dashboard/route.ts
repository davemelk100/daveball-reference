import { type NextRequest, NextResponse } from "next/server"
import { getLeaders, getStandings } from "@/lib/mlb-api"
import { getMVPWinnersStatic, getCyYoungWinnersStatic } from "@/lib/awards-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const season = Number.parseInt(searchParams.get("season") || "2024")

  try {
    const [hrLeaders, avgLeaders, eraLeaders, kLeaders, standings] = await Promise.all([
      getLeaders("hitting", "homeRuns", season, 10),
      getLeaders("hitting", "battingAverage", season, 10),
      getLeaders("pitching", "earnedRunAverage", season, 10),
      getLeaders("pitching", "strikeouts", season, 10),
      getStandings(season),
    ])

    const mvpWinners = getMVPWinnersStatic()
    const cyYoungWinners = getCyYoungWinnersStatic()

    return NextResponse.json({
      hrLeaders,
      avgLeaders,
      eraLeaders,
      kLeaders,
      standings,
      mvpWinners,
      cyYoungWinners,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
