"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import type { AwardWinner } from "@/lib/awards-data"

interface AwardsCardProps {
  title: string
  alWinners: AwardWinner[]
  nlWinners: AwardWinner[]
  limit?: number
}

export function AwardsCard({ title, alWinners, nlWinners, limit = 5 }: AwardsCardProps) {

  const WinnerRow = ({ winner }: { winner: AwardWinner }) => (
    <Link
      href={`/players/${winner.playerId}`}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
    >
      <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={getPlayerHeadshotUrl(winner.playerId, "small") || "/placeholder.svg"}
          alt={winner.playerName}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{winner.playerName}</p>
        <p className="text-muted-foreground truncate">{winner.team?.name || "—"}</p>
      </div>
      <span className="text-sm font-semibold text-primary">{winner.season}</span>
    </Link>
  )

  return (
    <Card>
      <Tabs defaultValue="al" className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            {title}
          </CardTitle>
          <TabsList>
            <TabsTrigger value="al">AL</TabsTrigger>
            <TabsTrigger value="nl">NL</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="al" className="space-y-1 mt-0">
            {alWinners.slice(0, limit).map((winner) => (
              <WinnerRow key={`${winner.playerId}-${winner.season}`} winner={winner} />
            ))}
            {alWinners.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </TabsContent>
          <TabsContent value="nl" className="space-y-1 mt-0">
            {nlWinners.slice(0, limit).map((winner) => (
              <WinnerRow key={`${winner.playerId}-${winner.season}`} winner={winner} />
            ))}
            {nlWinners.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
