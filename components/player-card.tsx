import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { getPlayerHeadshotUrl, type Player } from "@/lib/mlb-api"

interface PlayerCardProps {
  player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/players/${player.id}`}>
      <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted shrink-0">
              <Image
                src={getPlayerHeadshotUrl(player.id, "small") || "/placeholder.svg"}
                alt={player.fullName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{player.fullName}</h3>
              <p className="text-sm text-muted-foreground">{player.currentTeam?.name || "Free Agent"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{player.primaryPosition?.abbreviation || "—"}</Badge>
                {player.active && (
                  <Badge variant="outline" className="border-green-500/50 text-green-500">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
