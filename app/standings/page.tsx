import { Header } from "@/components/header"
import { StandingsTable } from "@/components/standings-table"
import { getStandings } from "@/lib/mlb-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const revalidate = 3600

export default async function StandingsPage() {
  const standings = await getStandings(2024)

  // Separate by league
  const alDivisions = standings.filter((d) => d.division?.name?.includes("American"))
  const nlDivisions = standings.filter((d) => d.division?.name?.includes("National"))

  // Sort divisions by name (East, Central, West)
  const sortDivisions = (divisions: typeof standings) => {
    return [...divisions].sort((a, b) => {
      const order = ["East", "Central", "West"]
      const aIdx = order.findIndex((o) => a.division?.name?.includes(o))
      const bIdx = order.findIndex((o) => b.division?.name?.includes(o))
      return aIdx - bIdx
    })
  }

  const sortedAL = sortDivisions(alDivisions)
  const sortedNL = sortDivisions(nlDivisions)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">MLB Standings</h1>
          <p className="text-muted-foreground">2024 Regular Season standings by division</p>
        </div>

        <Tabs defaultValue="al" className="space-y-6">
          <TabsList>
            <TabsTrigger value="al">American League</TabsTrigger>
            <TabsTrigger value="nl">National League</TabsTrigger>
            <TabsTrigger value="all">All Divisions</TabsTrigger>
          </TabsList>

          <TabsContent value="al" className="space-y-6">
            {sortedAL.map((division, idx) => (
              <StandingsTable key={division.division?.id || idx} division={division} />
            ))}
          </TabsContent>

          <TabsContent value="nl" className="space-y-6">
            {sortedNL.map((division, idx) => (
              <StandingsTable key={division.division?.id || idx} division={division} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">American League</h2>
                {sortedAL.map((division, idx) => (
                  <StandingsTable key={division.division?.id || idx} division={division} />
                ))}
              </div>
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">National League</h2>
                {sortedNL.map((division, idx) => (
                  <StandingsTable key={division.division?.id || idx} division={division} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
