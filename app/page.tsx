import { Suspense } from "react"
import { DashboardContent } from "@/components/dashboard-content"
import { getLeaders, getStandings, getDefaultSeason } from "@/lib/mlb-api"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 3600

async function getDashboardData(season: number) {
  const [hrLeaders, avgLeaders, eraLeaders, kLeaders, standings] = await Promise.all([
    getLeaders("hitting", "homeRuns", season, 10),
    getLeaders("hitting", "battingAverage", season, 10),
    getLeaders("pitching", "earnedRunAverage", season, 10),
    getLeaders("pitching", "strikeouts", season, 10),
    getStandings(season),
  ])

  return { hrLeaders, avgLeaders, eraLeaders, kLeaders, standings }
}

function DashboardSkeleton() {
  return (
    <main className="container py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-80 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </main>
  )
}

export default async function DashboardPage() {
  const defaultSeason = getDefaultSeason()
  const initialData = await getDashboardData(defaultSeason)

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent initialData={initialData} initialSeason={defaultSeason} />
    </Suspense>
  )
}
