"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Star, X } from "lucide-react"
import { getDailyPlayer, type SpotlightPlayer } from "@/lib/player-spotlight-data"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import Image from "next/image"
import Link from "next/link"



export function PlayerSpotlight() {
  const [player, setPlayer] = useState<SpotlightPlayer | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const dailyPlayer = getDailyPlayer()
    setPlayer(dailyPlayer)

    // Check if dismissed for today
    const today = new Date().toLocaleDateString('en-US')
    const dismissedKey = `spotlight-dismissed-${today}-${dailyPlayer.id}`
    if (localStorage.getItem(dismissedKey)) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    if (!player) return
    setIsVisible(false)
    const today = new Date().toLocaleDateString('en-US')
    const dismissedKey = `spotlight-dismissed-${today}-${player.id}`
    localStorage.setItem(dismissedKey, 'true')
  }

  if (!player || !isVisible) return null

  return (
    <div className="w-full bg-muted/30 rounded-lg border p-3 sm:p-4 mb-8 relative group/card">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"
        onClick={handleDismiss}
        aria-label="Dismiss Player of the Day"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Link href={`/players/${player.id}`} className="shrink-0 group relative overflow-hidden rounded-xl">
          {!imageError ? (
            <Image
              src={getPlayerHeadshotUrl(player.id, "large") || "/placeholder.svg"}
              alt={player.name}
              width={80}
              height={80}
              style={{ width: 'auto', height: '80px' }}
              className="rounded-xl transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-[80px] h-[80px] bg-muted flex items-center justify-center rounded-xl">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </Link>
        <div className="space-y-1 flex-1 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <h2 className="text-sm font-medium text-primary uppercase tracking-wider">Player of the Day</h2>
          </div>
          <Link
            href={`/players/${player.id}`}
            className="text-xl sm:text-2xl font-bold hover:underline decoration-primary decoration-2 underline-offset-4"
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
          <p className="text-sm sm:text-base max-w-2xl leading-relaxed">
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
