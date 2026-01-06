"use client"

import { useState, useEffect } from "react"
import { StandingsTable } from "@/components/standings-table"
import { SeasonSelector } from "@/components/season-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, AlertCircle } from "lucide-react"

interface StandingsPageContentProps {
  initialStandings: any[]
  initialSeason: number
}

export function StandingsPageContent({ initialStandings, initialSeason }: StandingsPageContentProps) {
  const [season, setSeason] = useState(initialSeason)
  const [standings, setStandings] = useState<any[]>(initialStandings)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (season === initialSeason) {
      setStandings(initialStandings)
      return
    }

    const fetchStandings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/standings?season=${season}`)
        const data = await response.json()
        setStandings(data.standings)
      } catch (error) {
        console.error("Error fetching standings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStandings()
  }, [season, initialSeason, initialStandings])

  // Filter by league
  const alDivisions = standings.filter((d: any) => d.league?.id === 103)
  const nlDivisions = standings.filter((d: any) => d.league?.id === 104)

  // Sort divisions by name (East, Central, West)
  const sortDivisions = (divisions: typeof standings) => {
    return [...divisions].sort((a, b) => {
      const order = ["East", "Central", "West"]
      const getDivName = (d: any) => d.division?.name || ""
      const aIdx = order.findIndex((o) => getDivName(a).includes(o))
      const bIdx = order.findIndex((o) => getDivName(b).includes(o))
      return aIdx - bIdx
    })
  }

  const sortedAL = sortDivisions(alDivisions)
  const sortedNL = sortDivisions(nlDivisions)
  const hasData = sortedAL.length > 0 || sortedNL.length > 0

  return (
    <main className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">MLB Standings</h1>
            <p className="text-muted-foreground">{season} Regular Season standings by division</p>
          </div>
          <Card className="w-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Season
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <SeasonSelector season={season} onSeasonChange={setSeason} />
            </CardContent>
          </Card>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !standings || standings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="text-lg">Unable to load standings data for {season}</p>
          <p className="text-sm">Please try a different season</p>
        </div>
      ) : !hasData ? (
        <div className="space-y-6">
          {standings.map((division: any, idx: number) => (
            <StandingsTable key={division.division?.id || idx} division={division} />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="al" className="space-y-6">
          <TabsList className="bg-[#ececec]">
            <TabsTrigger value="al">American League</TabsTrigger>
            <TabsTrigger value="nl">National League</TabsTrigger>
            <TabsTrigger value="all">All Divisions</TabsTrigger>
          </TabsList>

          <TabsContent value="al" className="space-y-6">
            {sortedAL.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No American League standings available</p>
            ) : (
              sortedAL.map((division, idx) => <StandingsTable key={division.division?.id || idx} division={division} />)
            )}
          </TabsContent>

          <TabsContent value="nl" className="space-y-6">
            {sortedNL.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No National League standings available</p>
            ) : (
              sortedNL.map((division, idx) => <StandingsTable key={division.division?.id || idx} division={division} />)
            )}
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
      )}
    </main>
  )
}
