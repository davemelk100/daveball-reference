import { type NextRequest, NextResponse } from "next/server"
import { getLeaders, getLeadersByLeague, getStandings } from "@/lib/mlb-api"
import { getMVPWinnersStatic, getCyYoungWinnersStatic } from "@/lib/awards-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const season = Number.parseInt(searchParams.get("season") || "2024")

  try {
    const [
      hrLeaders,
      avgLeaders,
      eraLeaders,
      kLeaders,
      standings,
      hrLeadersAL,
      hrLeadersNL,
      avgLeadersAL,
      avgLeadersNL,
      eraLeadersAL,
      eraLeadersNL,
    ] = await Promise.all([
      getLeaders("hitting", "homeRuns", season, 10),
      getLeaders("hitting", "battingAverage", season, 10),
      getLeaders("pitching", "earnedRunAverage", season, 10),
      getLeaders("pitching", "strikeouts", season, 10),
      getStandings(season),
      getLeadersByLeague("hitting", "homeRuns", 103, season, 1),
      getLeadersByLeague("hitting", "homeRuns", 104, season, 1),
      getLeadersByLeague("hitting", "battingAverage", 103, season, 1),
      getLeadersByLeague("hitting", "battingAverage", 104, season, 1),
      getLeadersByLeague("pitching", "earnedRunAverage", 103, season, 1),
      getLeadersByLeague("pitching", "earnedRunAverage", 104, season, 1),
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
      leagueLeaders: {
        hr: { al: hrLeadersAL[0], nl: hrLeadersNL[0] },
        avg: { al: avgLeadersAL[0], nl: avgLeadersNL[0] },
        era: { al: eraLeadersAL[0], nl: eraLeadersNL[0] },
      },
    })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
