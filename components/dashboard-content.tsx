"use client"

import { useState } from "react"
import { StatCard } from "@/components/stat-card"
import { LeadersTable } from "@/components/leaders-table"
import { StandingsMini } from "@/components/standings-mini"
import { LeadersBarChart } from "@/components/leaders-bar-chart"
import { SeasonSelector } from "@/components/season-selector"
import { AwardsCard } from "@/components/awards-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Target, Zap, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { TriviaCard } from "@/components/trivia-card"
import type { AwardWinner } from "@/lib/awards-data"

interface DashboardData {
  hrLeaders: any[]
  avgLeaders: any[]
  eraLeaders: any[]
  kLeaders: any[]
  standings: any[]
  mvpWinners: { al: AwardWinner[]; nl: AwardWinner[] }
  cyYoungWinners: { al: AwardWinner[]; nl: AwardWinner[] }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DashboardContent({
  initialData,
  initialSeason,
}: { initialData: DashboardData; initialSeason: number }) {
  const [season, setSeason] = useState(initialSeason)

  const { data, isLoading } = useSWR<DashboardData>(`/api/dashboard?season=${season}`, fetcher, {
    fallbackData: season === initialSeason ? initialData : undefined,
    revalidateOnFocus: false,
  })

  const hrLeaders = data?.hrLeaders || []
  const avgLeaders = data?.avgLeaders || []
  const eraLeaders = data?.eraLeaders || []
  const kLeaders = data?.kLeaders || []
  const standings = data?.standings || []
  const mvpWinners = data?.mvpWinners || { al: [], nl: [] }
  const cyYoungWinners = data?.cyYoungWinners || { al: [], nl: [] }

  const displayDivisions = standings.slice(0, 2)

  const currentYear = new Date().getFullYear()
  const isCurrentSeason = season === currentYear
  const seasonStatus = isCurrentSeason ? "In Progress" : "Completed"
  const seasonDescription = isCurrentSeason ? "Regular season games" : "Final standings"

  return (
    <main className="container py-8">
      {/* Hero Section */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">MLB Universe</h1>
          <p className="text-muted-foreground">Explore MLB statistics and track standings</p>
        </div>
        <div className="ml-auto">
          <TriviaCard />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Season</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <SeasonSelector season={season} onSeasonChange={setSeason} />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {seasonStatus} &middot; {seasonDescription}
            </p>
          </CardContent>
        </Card>

        <StatCard
          title="Home Run Leader"
          value={isLoading ? "..." : hrLeaders[0]?.value || "—"}
          description={isLoading ? "Loading..." : hrLeaders[0]?.person?.fullName || "No data"}
          icon={Zap}
        />
        <StatCard
          title="Batting Avg Leader"
          value={isLoading ? "..." : avgLeaders[0]?.value || "—"}
          description={isLoading ? "Loading..." : avgLeaders[0]?.person?.fullName || "No data"}
          icon={Target}
        />
        <StatCard
          title="ERA Leader"
          value={isLoading ? "..." : eraLeaders[0]?.value || "—"}
          description={isLoading ? "Loading..." : eraLeaders[0]?.person?.fullName || "No data"}
          icon={TrendingUp}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Award Winners</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <AwardsCard title="MVP Winners" icon="trophy" alWinners={mvpWinners.al} nlWinners={mvpWinners.nl} limit={5} />
          <AwardsCard
            title="Cy Young Winners"
            icon="award"
            alWinners={cyYoungWinners.al}
            nlWinners={cyYoungWinners.nl}
            limit={5}
          />
        </div>
      </div>

      {/* Data Visualizations Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Visualizations</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <LeadersBarChart title="Home Run Leaders" leaders={hrLeaders} color="#ef4444" />
          <LeadersBarChart title="Strikeout Leaders (Pitching)" leaders={kLeaders} color="#3b82f6" />
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">League Leaders</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/players">View All Players</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LeadersTable title="Home Runs" leaders={hrLeaders} statLabel="HR" />
          <LeadersTable title="Batting Average" leaders={avgLeaders} statLabel="AVG" />
          <LeadersTable title="ERA" leaders={eraLeaders} statLabel="ERA" />
          <LeadersTable title="Strikeouts" leaders={kLeaders} statLabel="K" />
        </div>
      </div>

      {/* Standings Preview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Standings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/standings">View All Standings</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {displayDivisions.map((division: any, idx: number) => (
            <StandingsMini key={division.division?.id || idx} division={division} />
          ))}
        </div>
      </div>
    </main>
  )
}
