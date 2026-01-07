import type { Metadata } from "next"
import { PlayerStatsTable } from "@/components/player-stats-table"
import { StatCard } from "@/components/stat-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayerJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import { getPlayer, getPlayerHeadshotUrl, getPlayerAllStarAppearances } from "@/lib/mlb-api"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, Ruler, Scale, Star } from "lucide-react"

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params
  const player = await getPlayer(Number(id))

  if (!player) {
    return {
      title: "Player Not Found | Major League Numbers",
      description: "The requested player could not be found.",
    }
  }

  const position = player.primaryPosition?.name || "Player"
  const team = player.currentTeam?.name || "Free Agent"
  const description = `View ${player.fullName}'s MLB stats, career history, and performance data. ${position} for ${team}.`

  return {
    title: `${player.fullName} Stats`,
    description,
    alternates: {
      canonical: `/players/${player.id}`,
    },
    openGraph: {
      title: `${player.fullName} - MLB Player Stats`,
      description,
      type: "profile",
      images: [
        {
          url: getPlayerHeadshotUrl(player.id, "large") || "/mln.png",
          width: 400,
          height: 400,
          alt: `${player.fullName} headshot`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${player.fullName} Stats`,
      description,
      images: [getPlayerHeadshotUrl(player.id, "large") || "/mln.png"],
    },
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params
  const [player, allStarAppearances] = await Promise.all([
    getPlayer(Number(id)),
    getPlayerAllStarAppearances(Number(id)),
  ])

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
    <>
      <PlayerJsonLd player={player} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://majorleaguenumbers.com" },
          { name: "Players", url: "https://majorleaguenumbers.com/players" },
          { name: player.fullName, url: `https://majorleaguenumbers.com/players/${player.id}` },
        ]}
      />
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
        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted shrink-0">
          <Image
            src={getPlayerHeadshotUrl(player.id, "large") || "/placeholder.svg"}
            alt={player.fullName}
            fill
            className="object-cover"
            priority
          />
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
          {allStarAppearances.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{allStarAppearances.length}x All-Star</span>
              <span className="text-muted-foreground">
                ({allStarAppearances.map((a) => a.season).join(", ")})
              </span>
            </div>
          )}
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
    </>
  )
}
