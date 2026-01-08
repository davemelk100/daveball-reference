"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Star } from "lucide-react"
import { getDailyPlayer, type SpotlightPlayer } from "@/lib/player-spotlight-data"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import Image from "next/image"
import Link from "next/link"

export function PlayerSpotlight() {
  const [player, setPlayer] = useState<SpotlightPlayer | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setPlayer(getDailyPlayer())
  }, [])

  if (!player) return null

  return (
    <div className="w-full bg-muted/30 rounded-lg border p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Link href={`/players/${player.id}`} className="shrink-0 group relative overflow-hidden rounded-xl">
          {!imageError ? (
            <Image
              src={getPlayerHeadshotUrl(player.id, "large") || "/placeholder.svg"}
              alt={player.name}
              width={120}
              height={120}
              className="h-[120px] w-auto rounded-xl transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-muted flex items-center justify-center rounded-xl">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <h2 className="text-sm font-medium text-primary uppercase tracking-wider">Player of the Day</h2>
          </div>
          <Link
            href={`/players/${player.id}`}
            className="text-2xl sm:text-3xl font-bold hover:underline decoration-primary decoration-2 underline-offset-4"
          >
            {player.name}
          </Link>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{player.team}</span>
            <span>•</span>
            <span>{player.position}</span>
            <span>•</span>
            <span>{player.years}</span>
          </div>
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed">
            {player.fact}
          </p>
        </div>
        <div className="hidden lg:block shrink-0">
          <Link href={`/players/${player.id}`}>
            <Button variant="outline" className="gap-2">
              View Stats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
