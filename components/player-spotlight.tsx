"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Star } from "lucide-react"
import { getDailyPlayer, type SpotlightPlayer } from "@/lib/player-spotlight-data"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import Image from "next/image"
import Link from "next/link"

export function PlayerSpotlight() {
  const [player, setPlayer] = useState<SpotlightPlayer | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setPlayer(getDailyPlayer())
  }, [])

  if (!player) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 bg-transparent">
          <Star className="h-4 w-4 text-primary" />
          <span>Player of the Day</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-semibold">Player of the Day</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/players/${player.id}`} className="shrink-0" onClick={() => setIsOpen(false)}>
              {!imageError ? (
                <Image
                  src={getPlayerHeadshotUrl(player.id) || "/placeholder.svg"}
                  alt={player.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 bg-muted object-cover rounded"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-16 h-16 bg-muted flex items-center justify-center rounded">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/players/${player.id}`}
                className="font-medium hover:underline block truncate"
                onClick={() => setIsOpen(false)}
              >
                {player.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{player.fact}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
