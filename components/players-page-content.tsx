"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { PlayerSearch } from "@/components/player-search"
import { PlayerCard } from "@/components/player-card"
import { SeasonSelector } from "@/components/season-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar } from "lucide-react"
import type { Player } from "@/lib/mlb-api"

interface PlayersPageContentProps {
  initialPlayers: Player[]
  initialSeason: number
}

export function PlayersPageContent({ initialPlayers, initialSeason }: PlayersPageContentProps) {
  const [season, setSeason] = useState(initialSeason)
  const [featuredPlayers, setFeaturedPlayers] = useState<Player[]>(initialPlayers)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (season === initialSeason) {
      setFeaturedPlayers(initialPlayers)
      return
    }

    const fetchPlayers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/players?season=${season}`)
        const data = await response.json()
        setFeaturedPlayers(data.featuredPlayers)
      } catch (error) {
        console.error("Error fetching players:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [season, initialSeason, initialPlayers])

  return (
    <main className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Player Search</h1>
            <p className="text-muted-foreground">Search for any MLB player to view their stats and profile</p>
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
        <Suspense fallback={<div className="h-10 bg-secondary rounded-md animate-pulse max-w-xl" />}>
          <PlayerSearch />
        </Suspense>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {season} Featured Players
          {isLoading && <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />}
        </h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-secondary" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-secondary rounded mb-2" />
                      <div className="h-3 w-32 bg-secondary rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
