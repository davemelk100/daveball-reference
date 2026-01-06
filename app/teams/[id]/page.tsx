import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { getTeam, getTeamRoster, getStandings, getTeamHistory, getTeamLogoUrl } from "@/lib/mlb-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RosterTable } from "@/components/roster-table"
import { HistoricalChart } from "@/components/historical-chart"
import { HistoricalTable } from "@/components/historical-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const revalidate = 3600

interface TeamPageProps {
  params: Promise<{ id: string }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params
  const teamId = Number.parseInt(id, 10)

  const [team, roster, standings, history] = await Promise.all([
    getTeam(teamId),
    getTeamRoster(teamId),
    getStandings(),
    getTeamHistory(teamId, 1960, 2024),
  ])

  if (!team) notFound()

  // Find team's record in standings
  let teamRecord = null
  for (const division of standings) {
    const found = division.teamRecords?.find((r) => r.team.id === teamId)
    if (found) {
      teamRecord = found
      break
    }
  }

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

      {teamRecord && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
        </div>
      )}

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Historical Data (1960-Present)</TabsTrigger>
          <TabsTrigger value="roster">Current Roster</TabsTrigger>
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
          <h2 className="text-2xl font-bold">Roster</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RosterTable players={pitchers} title="Pitchers" />
            <div className="space-y-8">
              <RosterTable players={catchers} title="Catchers" />
              <RosterTable players={infielders} title="Infielders" />
              <RosterTable players={outfielders} title="Outfielders" />
              {dh.length > 0 && <RosterTable players={dh} title="Designated Hitters" />}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
