"use client"

import { useState, useEffect } from "react"
import { User, Award } from "lucide-react"
import { getDailyPlayer, getDailyManager, getDailyTeam, type SpotlightPlayer, type SpotlightManager, type SpotlightTeam } from "@/lib/player-spotlight-data"
import { getPlayerHeadshotUrl, getTeamLogoUrl } from "@/lib/mlb-api"
import Image from "next/image"
import Link from "next/link"

export function PlayerSpotlight() {
  const [player, setPlayer] = useState<SpotlightPlayer | null>(null)
  const [manager, setManager] = useState<SpotlightManager | null>(null)
  const [team, setTeam] = useState<SpotlightTeam | null>(null)
  const [playerImageError, setPlayerImageError] = useState(false)

  useEffect(() => {
    setPlayer(getDailyPlayer())
    setManager(getDailyManager())
    setTeam(getDailyTeam())
  }, [])

  if (!player || !manager || !team) return null

  return (
    <div className="w-full h-full bg-muted/30 rounded-lg border p-3 sm:p-4">
      <div className="grid gap-4 lg:grid-rows-3 h-full">
        {/* Player of the Day */}
        <div className="space-y-2">
          <span className="text-base font-semibold text-primary uppercase tracking-wider">Player of the Day</span>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link href={`/players/${player.id}`} className="shrink-0 group relative overflow-hidden rounded-xl">
              {!playerImageError ? (
                <Image
                  src={getPlayerHeadshotUrl(player.id, "large") || "/placeholder.svg"}
                  alt={player.name}
                  width={64}
                  height={64}
                  style={{ width: 'auto', height: '64px' }}
                  className="rounded-xl transition-transform group-hover:scale-105"
                  onError={() => setPlayerImageError(true)}
                />
              ) : (
                <div className="w-[64px] h-[64px] bg-muted flex items-center justify-center rounded-xl">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </Link>
            <div className="space-y-0.5 flex-1 min-w-0">
              <Link
                href={`/players/${player.id}`}
                className="text-lg font-bold hover:underline decoration-primary decoration-2 underline-offset-4 block truncate"
              >
                {player.name}
              </Link>
              <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                <span>{player.team}</span>
                <span>•</span>
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.years}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {player.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Manager of the Day */}
        <div className="space-y-2 border-t border-border pt-4 lg:pt-0 lg:border-t-0">
          <span className="text-base font-semibold text-primary uppercase tracking-wider">Manager of the Day</span>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="shrink-0 w-[64px] h-[64px] bg-muted/50 flex items-center justify-center rounded-xl">
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-lg font-bold truncate">
                {manager.name}
              </p>
              <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                <span>{manager.team}</span>
                <span>•</span>
                <span>{manager.years}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {manager.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Team of the Day */}
        <div className="space-y-2 border-t border-border pt-4 lg:pt-0 lg:border-t-0">
          <span className="text-base font-semibold text-primary uppercase tracking-wider">Team of the Day</span>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link href={`/teams/${team.id}`} className="shrink-0 w-[64px] h-[64px] flex items-center justify-center group">
              <Image
                src={getTeamLogoUrl(team.id)}
                alt={`${team.city} ${team.name} logo`}
                width={64}
                height={64}
                className="object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="space-y-0.5 flex-1 min-w-0">
              <Link
                href={`/teams/${team.id}`}
                className="text-lg font-bold hover:underline decoration-primary decoration-2 underline-offset-4 block truncate"
              >
                {team.city} {team.name}
              </Link>
              <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                <span>{team.league}</span>
                <span>•</span>
                <span>Est. {team.founded}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {team.fact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
