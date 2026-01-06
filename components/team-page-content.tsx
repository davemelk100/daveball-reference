"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getTeamLogoUrl } from "@/lib/mlb-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RosterTable } from "@/components/roster-table"
import { HistoricalChart } from "@/components/historical-chart"
import { HistoricalTable } from "@/components/historical-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeasonSelector } from "@/components/season-selector"

interface TeamPageContentProps {
  teamId: number
  initialData: {
    team: any
    roster: any[]
    teamRecord: any
    history: any[]
  }
}

export function TeamPageContent({ teamId, initialData }: TeamPageContentProps) {
  const currentYear = new Date().getFullYear()
  const [season, setSeason] = useState(currentYear)
  const [team, setTeam] = useState(initialData.team)
  const [roster, setRoster] = useState(initialData.roster)
  const [teamRecord, setTeamRecord] = useState(initialData.teamRecord)
  const [history] = useState(initialData.history)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (season === currentYear) {
      setTeam(initialData.team)
      setRoster(initialData.roster)
      setTeamRecord(initialData.teamRecord)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/team/${teamId}?season=${season}`)
        const data = await res.json()
        setTeam(data.team)
        setRoster(data.roster)
        setTeamRecord(data.teamRecord)
      } catch (error) {
        console.error("Error fetching team data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [season, teamId, currentYear, initialData])

  // Group roster by position type
  const pitchers = roster.filter((p) => p.primaryPosition?.type === "Pitcher")
  const catchers = roster.filter((p) => p.primaryPosition?.abbreviation === "C")
  const infielders = roster.filter((p) => ["1B", "2B", "3B", "SS"].includes(p.primaryPosition?.abbreviation || ""))
  const outfielders = roster.filter((p) => ["LF", "CF", "RF", "OF"].includes(p.primaryPosition?.abbreviation || ""))
  const dh = roster.filter((p) => p.primaryPosition?.abbreviation === "DH")

  return (
    <main className="container py-8">
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative h-24 w-24 shrink-0">
          <Image
            src={getTeamLogoUrl(team.id) || "/placeholder.svg"}
            alt={`${team.name} logo`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground mt-1">
            {team.league?.name} &middot; {team.division?.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{team.locationName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Season</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <SeasonSelector season={season} onSeasonChange={setSeason} />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardContent>
        </Card>

        {teamRecord ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Record</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {teamRecord.wins}-{teamRecord.losses}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Win %</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{teamRecord.winningPercentage}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Games Back</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{teamRecord.gamesBack || "-"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Run Diff</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${teamRecord.runDifferential > 0 ? "text-green-500" : teamRecord.runDifferential < 0 ? "text-red-500" : ""}`}
                >
                  {teamRecord.runDifferential > 0 ? "+" : ""}
                  {teamRecord.runDifferential}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="col-span-4">
            <CardContent className="py-6 text-center text-muted-foreground">
              No standings data available for {season}
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Historical Data (1960-Present)</TabsTrigger>
          <TabsTrigger value="roster">{season} Roster</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {history.length > 0 ? (
            <>
              <HistoricalChart data={history} teamName={team.name} />
              <HistoricalTable data={history} />
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No historical data available for this team.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roster" className="space-y-8">
          <h2 className="text-2xl font-bold">{season} Roster</h2>
          {roster.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RosterTable players={pitchers} title="Pitchers" />
              <div className="space-y-8">
                <RosterTable players={catchers} title="Catchers" />
                <RosterTable players={infielders} title="Infielders" />
                <RosterTable players={outfielders} title="Outfielders" />
                {dh.length > 0 && <RosterTable players={dh} title="Designated Hitters" />}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No roster data available for {season}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
