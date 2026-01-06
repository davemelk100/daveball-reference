import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Player } from "@/lib/mlb-api"

interface PlayerCardProps {
  player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/players/${player.id}`}>
      <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg shrink-0">
              {player.primaryNumber || "#"}
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
