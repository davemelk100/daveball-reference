"use client"

import { useState, Suspense, lazy } from "react"
import dynamic from "next/dynamic"
import { StatCard } from "@/components/stat-card"
import { LeadersTable } from "@/components/leaders-table"
import { SeasonSelector } from "@/components/season-selector"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Loader2 } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import type { AwardWinner } from "@/lib/awards-data"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load heavy components
const LeadersBarChart = dynamic(() => import("@/components/leaders-bar-chart").then(mod => ({ default: mod.LeadersBarChart })), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false,
})

const AwardsCard = dynamic(() => import("@/components/awards-card").then(mod => ({ default: mod.AwardsCard })), {
  loading: () => <Skeleton className="h-[200px] w-full" />,
})

const TriviaCard = dynamic(() => import("@/components/trivia-card").then(mod => ({ default: mod.TriviaCard })), {
  loading: () => <Skeleton className="h-[100px] w-full" />,
})

const DailyFact = dynamic(() => import("@/components/daily-fact").then(mod => ({ default: mod.DailyFact })), {
  loading: () => <Skeleton className="h-[80px] w-full" />,
})

const PlayerSpotlight = dynamic(() => import("@/components/player-spotlight").then(mod => ({ default: mod.PlayerSpotlight })), {
  loading: () => <Skeleton className="h-[80px] w-full" />,
})

interface LeagueLeader {
  value: string | number
  person?: { fullName: string }
}

interface DashboardData {
  hrLeaders: any[]
  avgLeaders: any[]
  eraLeaders: any[]
  kLeaders: any[]
  standings: any[]
  mvpWinners: { al: AwardWinner[]; nl: AwardWinner[] }
  cyYoungWinners: { al: AwardWinner[]; nl: AwardWinner[] }
  leagueLeaders?: {
    hr: { al: LeagueLeader; nl: LeagueLeader }
    avg: { al: LeagueLeader; nl: LeagueLeader }
    era: { al: LeagueLeader; nl: LeagueLeader }
  }
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
  const mvpWinners = data?.mvpWinners || { al: [], nl: [] }
  const cyYoungWinners = data?.cyYoungWinners || { al: [], nl: [] }
  const leagueLeaders = data?.leagueLeaders

  const currentYear = new Date().getFullYear()
  const isCurrentSeason = season === currentYear
  const seasonStatus = isCurrentSeason ? "In Progress" : "Completed"
  const seasonDescription = isCurrentSeason ? "Regular season games" : "Final standings"

  const formatLeaders = (al: LeagueLeader | undefined, nl: LeagueLeader | undefined) => {
    if (!al && !nl) return undefined
    return [
      { league: "AL" as const, value: al?.value || "—", name: al?.person?.fullName || "No data" },
      { league: "NL" as const, value: nl?.value || "—", name: nl?.person?.fullName || "No data" },
    ]
  }

  return (
    <main className="container py-8">
      {/* Hero Section */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Major League Numbers</h1>
          <p className="text-muted-foreground">Explore MLB statistics and track standings</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DailyFact />
          <PlayerSpotlight />
          <TriviaCard />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="py-2 px-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-semibold">Season</span>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <SeasonSelector season={season} onSeasonChange={setSeason} />
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {seasonStatus} · {seasonDescription}
            </p>
          </CardContent>
        </Card>

        <StatCard
          title="Home Run Leader"
          leaders={isLoading ? undefined : formatLeaders(leagueLeaders?.hr?.al, leagueLeaders?.hr?.nl)}
          value={isLoading ? "..." : undefined}
          description={isLoading ? "Loading..." : undefined}
        />
        <StatCard
          title="Batting Avg Leader"
          leaders={isLoading ? undefined : formatLeaders(leagueLeaders?.avg?.al, leagueLeaders?.avg?.nl)}
          value={isLoading ? "..." : undefined}
          description={isLoading ? "Loading..." : undefined}
        />
        <StatCard
          title="ERA Leader"
          leaders={isLoading ? undefined : formatLeaders(leagueLeaders?.era?.al, leagueLeaders?.era?.nl)}
          value={isLoading ? "..." : undefined}
          description={isLoading ? "Loading..." : undefined}
        />
      </div>

      {/* Award Winners */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Award Winners</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <AwardsCard title="MVP Winners" alWinners={mvpWinners.al} nlWinners={mvpWinners.nl} limit={5} />
          <AwardsCard
            title="Cy Young Winners"
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
    </main>
  )
}
