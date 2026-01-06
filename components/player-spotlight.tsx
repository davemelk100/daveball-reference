"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { User, X } from "lucide-react"
import { getDailyPlayer, type SpotlightPlayer } from "@/lib/player-spotlight-data"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function PlayerSpotlight() {
  const [player, setPlayer] = useState<SpotlightPlayer | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setPlayer(getDailyPlayer())
    const today = new Date().toISOString().split("T")[0]
    const dismissedDate = localStorage.getItem("mlb-spotlight-dismissed")
    if (dismissedDate === today) {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("mlb-spotlight-dismissed", today)
    setDismissed(true)
  }

  if (!player || dismissed) return null

  return (
    <Card>
      <CardContent className="py-0.5 px-4 relative">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Player of the Day</span>
          <div className="flex items-center gap-2">
            <Link href={`/players/${player.id}`} className="shrink-0">
              {!imageError ? (
                <Image
                  src={getPlayerHeadshotUrl(player.id) || "/placeholder.svg"}
                  alt={player.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 bg-muted object-cover rounded"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-8 h-8 bg-muted flex items-center justify-center rounded">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </Link>
            <Link href={`/players/${player.id}`} className="text-sm font-medium hover:underline">
              {player.name}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">{player.fact}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground absolute top-2 right-2"
            onClick={handleDismiss}
            aria-label="Dismiss spotlight"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
