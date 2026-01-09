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
        <CardContent className="p-2 pl-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <Image
                src={getPlayerHeadshotUrl(player.id, "small") || "/placeholder.svg"}
                alt={player.fullName}
                width={96}
                height={96}
                style={{ width: 'auto', height: '96px' }}
                className="rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{player.fullName}</h3>
              <p className="text-sm text-muted-foreground truncate">{player.currentTeam?.name || "Free Agent"}</p>
              <div className="flex items-center gap-2 mt-1">
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
