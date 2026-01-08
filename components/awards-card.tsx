"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import type { AwardWinner } from "@/lib/awards-data"

interface AwardsCardProps {
  title: string
  winners: AwardWinner[]
  limit?: number
}

export function AwardsCard({ title, winners, limit = 5 }: AwardsCardProps) {

  const WinnerRow = ({ winner }: { winner: AwardWinner }) => (
    <Link
      href={`/players/${winner.playerId}`}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
    >
      <Image
        src={getPlayerHeadshotUrl(winner.playerId, "small") || "/placeholder.svg"}
        alt={winner.playerName}
        width={60}
        height={60}
        className="h-[75px] w-auto flex-shrink-0 rounded-lg"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{winner.playerName}</p>
        <p className="text-muted-foreground truncate">{winner.team?.name || "—"}</p>
      </div>
      <span className="text-sm font-semibold text-primary">{winner.season}</span>
    </Link>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 mt-0">
          {winners.slice(0, limit).map((winner) => (
            <WinnerRow key={`${winner.playerId}-${winner.season}`} winner={winner} />
          ))}
          {winners.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
