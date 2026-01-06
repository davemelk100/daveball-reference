import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getTeam, getTeamRoster, getStandings, getTeamHistory, getDefaultSeason } from "@/lib/mlb-api"
import { TeamPageContent } from "@/components/team-page-content"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 3600

interface TeamPageProps {
  params: Promise<{ id: string }>
}

function TeamDetailSkeleton() {
  return (
    <main className="container py-8">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Skeleton className="h-24 w-24 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-96 w-full" />
    </main>
  )
}

async function TeamContent({ id }: { id: string }) {
  const teamId = Number.parseInt(id, 10)
  const defaultSeason = getDefaultSeason()

  const [team, roster, standings, history] = await Promise.all([
    getTeam(teamId),
    getTeamRoster(teamId, defaultSeason),
    getStandings(defaultSeason),
    getTeamHistory(teamId, 1960, defaultSeason),
  ])

  if (!team) notFound()

  // Find team's record in standings
  let teamRecord = null
  for (const division of standings) {
    const found = division.teamRecords?.find((r: any) => r.team.id === teamId)
    if (found) {
      teamRecord = found
      break
    }
  }

  return (
    <TeamPageContent
      teamId={teamId}
      initialData={{
        team,
        roster,
        teamRecord,
        history,
      }}
    />
  )
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<TeamDetailSkeleton />}>
      <TeamContent id={id} />
    </Suspense>
  )
}
