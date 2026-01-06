import { notFound } from "next/navigation"
import { getTeam, getTeamRoster, getStandings, getTeamHistory, getDefaultSeason } from "@/lib/mlb-api"
import { TeamPageContent } from "@/components/team-page-content"

export const revalidate = 3600

interface TeamPageProps {
  params: Promise<{ id: string }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params
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
    const found = division.teamRecords?.find((r) => r.team.id === teamId)
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
