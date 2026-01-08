import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getTeam, getTeamRoster, getStandings, getTeamHistory, getDefaultSeason } from "@/lib/mlb-api"
import { TeamPageContent } from "@/components/team-page-content"
import { TeamJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 3600

interface TeamPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { id } = await params
  const team = await getTeam(Number(id))

  if (!team) {
    return {
      title: "Team Not Found | Major League Numbers",
      description: "The requested team could not be found.",
    }
  }

  const division = team.division?.name || "MLB"
  const league = team.league?.name || "Major League Baseball"
  const description = `View ${team.name} roster, stats, standings, and team history. ${division} - ${league}.`

  return {
    title: `${team.name} Stats & Roster`,
    description,
    alternates: {
      canonical: `/teams/${team.id}`,
    },
    openGraph: {
      title: `${team.name} - MLB Team Stats`,
      description,
      type: "website",
      images: [
        {
          url: `https://www.mlbstatic.com/team-logos/${team.id}.svg`,
          width: 200,
          height: 200,
          alt: `${team.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${team.name} Stats & Roster`,
      description,
      images: [`https://www.mlbstatic.com/team-logos/${team.id}.svg`],
    },
  }
}

function TeamDetailSkeleton() {
  return (
    <main className="container py-8">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-16 md:h-24 w-24 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-48" />
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
    <>
      <TeamJsonLd team={team} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://majorleaguenumbers.com" },
          { name: "Teams", url: "https://majorleaguenumbers.com/teams" },
          { name: team.name, url: `https://majorleaguenumbers.com/teams/${team.id}` },
        ]}
      />
      <TeamPageContent
        teamId={teamId}
        initialData={{
          team,
          roster,
          teamRecord,
          history,
        }}
      />
    </>
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
