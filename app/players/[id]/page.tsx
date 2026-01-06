import { Header } from "@/components/header"
import { PlayerStatsTable } from "@/components/player-stats-table"
import { StatCard } from "@/components/stat-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPlayer } from "@/lib/mlb-api"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Ruler, Scale, Plus } from "lucide-react"

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params
  const player = await getPlayer(Number(id))

  if (!player) {
    notFound()
  }

  // Extract stats by type
  const hittingStats =
    player.stats?.filter((s: any) => s.group?.displayName === "hitting").flatMap((s: any) => s.splits || []) || []
  const pitchingStats =
    player.stats?.filter((s: any) => s.group?.displayName === "pitching").flatMap((s: any) => s.splits || []) || []

  // Get current season stats
  const currentHitting = hittingStats.find((s: any) => s.season === "2024")
  const currentPitching = pitchingStats.find((s: any) => s.season === "2024")

  const isPitcher = player.primaryPosition?.type === "Pitcher"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/players">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
          </Link>
        </Button>

        {/* Player Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-4xl md:text-5xl shrink-0">
            {player.primaryNumber || "#"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{player.fullName}</h1>
              {player.active && (
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {player.currentTeam?.name || "Free Agent"} • {player.primaryPosition?.name}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Age {player.currentAge}</span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{player.height}</span>
              </div>
              <div className="flex items-center gap-1">
                <Scale className="h-4 w-4" />
                <span>{player.weight} lbs</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {player.birthCity}, {player.birthCountry}
                </span>
              </div>
            </div>

            {/* Compare button */}
            <Button asChild className="mt-4" size="sm">
              <Link href={`/compare?player1=${player.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Compare Player
              </Link>
            </Button>
          </div>
        </div>

        {/* Current Season Stats Quick View */}
        {(currentHitting || currentPitching) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2024 Season</h2>
            {isPitcher && currentPitching ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                <StatCard title="W-L" value={`${currentPitching.stat.wins || 0}-${currentPitching.stat.losses || 0}`} />
                <StatCard title="ERA" value={currentPitching.stat.era || "—"} />
                <StatCard title="IP" value={currentPitching.stat.inningsPitched || "—"} />
                <StatCard title="K" value={currentPitching.stat.strikeOuts || "—"} />
                <StatCard title="WHIP" value={currentPitching.stat.whip || "—"} />
                <StatCard title="SV" value={currentPitching.stat.saves || "—"} />
              </div>
            ) : currentHitting ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                <StatCard title="AVG" value={currentHitting.stat.avg || "—"} />
                <StatCard title="HR" value={currentHitting.stat.homeRuns || "—"} />
                <StatCard title="RBI" value={currentHitting.stat.rbi || "—"} />
                <StatCard title="OPS" value={currentHitting.stat.ops || "—"} />
                <StatCard title="SB" value={currentHitting.stat.stolenBases || "—"} />
                <StatCard title="H" value={currentHitting.stat.hits || "—"} />
              </div>
            ) : null}
          </div>
        )}

        {/* Career Stats Tables */}
        <div className="space-y-6">
          {hittingStats.length > 0 && <PlayerStatsTable stats={hittingStats} type="hitting" />}
          {pitchingStats.length > 0 && <PlayerStatsTable stats={pitchingStats} type="pitching" />}

          {hittingStats.length === 0 && pitchingStats.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Career Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No career statistics available for this player.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
