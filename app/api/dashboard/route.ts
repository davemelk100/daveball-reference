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
      hrLeadersALTop,
      hrLeadersNLTop,
      avgLeadersALTop,
      avgLeadersNLTop,
      eraLeadersALTop,
      eraLeadersNLTop,
      hrLeadersALChart,
      hrLeadersNLChart,
      kLeadersALChart,
      kLeadersNLChart,
      avgLeadersALTable,
      avgLeadersNLTable,
      eraLeadersALTable,
      eraLeadersNLTable,
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
      getLeadersByLeague("hitting", "homeRuns", 103, season, 10),
      getLeadersByLeague("hitting", "homeRuns", 104, season, 10),
      getLeadersByLeague("pitching", "strikeouts", 103, season, 10),
      getLeadersByLeague("pitching", "strikeouts", 104, season, 10),
      getLeadersByLeague("hitting", "battingAverage", 103, season, 5),
      getLeadersByLeague("hitting", "battingAverage", 104, season, 5),
      getLeadersByLeague("pitching", "earnedRunAverage", 103, season, 5),
      getLeadersByLeague("pitching", "earnedRunAverage", 104, season, 5),
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
        hr: { al: hrLeadersALTop[0], nl: hrLeadersNLTop[0] },
        avg: { al: avgLeadersALTop[0], nl: avgLeadersNLTop[0] },
        era: { al: eraLeadersALTop[0], nl: eraLeadersNLTop[0] },
      },
      chartLeaders: {
        hr: { al: hrLeadersALChart, nl: hrLeadersNLChart },
        k: { al: kLeadersALChart, nl: kLeadersNLChart },
      },
      tableLeaders: {
        hr: { al: hrLeadersALChart, nl: hrLeadersNLChart },
        avg: { al: avgLeadersALTable, nl: avgLeadersNLTable },
        era: { al: eraLeadersALTable, nl: eraLeadersNLTable },
        k: { al: kLeadersALChart, nl: kLeadersNLChart },
      },
    })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
