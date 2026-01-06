import { getTeams } from "@/lib/mlb-api"
import { TeamCard } from "@/components/team-card"

export const revalidate = 3600

export default async function TeamsPage() {
  const teams = await getTeams()

  // Group teams by division
  const divisions: Record<string, typeof teams> = {}
  teams.forEach((team) => {
    const divName = team.division?.name || "Other"
    if (!divisions[divName]) divisions[divName] = []
    divisions[divName].push(team)
  })

  // Sort divisions by league then name
  const sortedDivisions = Object.entries(divisions).sort(([a], [b]) => {
    const aIsAL = a.includes("American")
    const bIsAL = b.includes("American")
    if (aIsAL && !bIsAL) return -1
    if (!aIsAL && bIsAL) return 1
    return a.localeCompare(b)
  })

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">MLB Teams</h1>
        <p className="text-muted-foreground mt-1">Browse all 30 Major League Baseball teams by division</p>
      </div>

      <div className="space-y-10">
        {sortedDivisions.map(([divisionName, divTeams]) => (
          <section key={divisionName}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${divisionName.includes("American") ? "bg-blue-500" : "bg-green-500"}`}
              />
              {divisionName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {divTeams
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
