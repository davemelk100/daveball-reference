import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { LeadersTable } from "@/components/leaders-table"
import { StandingsMini } from "@/components/standings-mini"
import { LeadersBarChart } from "@/components/leaders-bar-chart"
import { TeamScatterChart } from "@/components/team-scatter-chart"
import { LeaguePieChart } from "@/components/league-pie-chart"
import { getLeaders, getStandings } from "@/lib/mlb-api"
import { Activity, Target, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 3600

export default async function DashboardPage() {
  const [hrLeaders, avgLeaders, eraLeaders, kLeaders, standings] = await Promise.all([
    getLeaders("hitting", "homeRuns", 2024, 10),
    getLeaders("hitting", "battingAverage", 2024, 10),
    getLeaders("pitching", "earnedRunAverage", 2024, 10),
    getLeaders("pitching", "strikeouts", 2024, 10),
    getStandings(2024),
  ])

  const displayDivisions = standings.slice(0, 2)

  // Calculate league totals for pie chart
  const alDivisions = standings.filter((d) => d.division?.name?.includes("American"))
  const nlDivisions = standings.filter((d) => d.division?.name?.includes("National"))

  const alWins = alDivisions.reduce(
    (sum, div) => sum + (div.teamRecords?.reduce((s, r) => s + (r.wins || 0), 0) || 0),
    0,
  )
  const nlWins = nlDivisions.reduce(
    (sum, div) => sum + (div.teamRecords?.reduce((s, r) => s + (r.wins || 0), 0) || 0),
    0,
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Baseball Analytics Dashboard</h1>
          <p className="text-muted-foreground">Explore MLB statistics, compare players, and track standings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="2024 Season" value="In Progress" description="Regular season games" icon={Activity} />
          <StatCard
            title="Home Run Leader"
            value={hrLeaders[0]?.value || "—"}
            description={hrLeaders[0]?.person?.fullName || "Loading..."}
            icon={Zap}
          />
          <StatCard
            title="Batting Avg Leader"
            value={avgLeaders[0]?.value || "—"}
            description={avgLeaders[0]?.person?.fullName || "Loading..."}
            icon={Target}
          />
          <StatCard
            title="ERA Leader"
            value={eraLeaders[0]?.value || "—"}
            description={eraLeaders[0]?.person?.fullName || "Loading..."}
            icon={TrendingUp}
          />
        </div>

        {/* Data Visualizations Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Visualizations</h2>
          <div className="grid gap-4 lg:grid-cols-3 mb-4">
            <LeadersBarChart title="Home Run Leaders" leaders={hrLeaders} color="#ef4444" />
            <LeadersBarChart title="Strikeout Leaders (Pitching)" leaders={kLeaders} color="#3b82f6" />
            <LeaguePieChart alWins={alWins} nlWins={nlWins} />
          </div>
          <TeamScatterChart standings={standings} />
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Standings</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/standings">View All Standings</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {displayDivisions.map((division, idx) => (
              <StandingsMini key={division.division?.id || idx} division={division} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
