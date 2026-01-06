import { getStandings, getDefaultSeason } from "@/lib/mlb-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = Number.parseInt(searchParams.get("season") || getDefaultSeason().toString())

  try {
    const standings = await getStandings(season)
    return NextResponse.json({ standings })
  } catch (error) {
    console.error("Error fetching standings:", error)
    return NextResponse.json({ standings: [] }, { status: 500 })
  }
}
