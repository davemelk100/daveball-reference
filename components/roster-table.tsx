import Link from "next/link"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPlayerHeadshotUrl, type Player } from "@/lib/mlb-api"

interface RosterTableProps {
  players: Player[]
  title: string
}

export function RosterTable({ players, title }: RosterTableProps) {
  if (players.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">B/T</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-muted-foreground">{player.primaryNumber || "-"}</TableCell>
                <TableCell>
                  <Link
                    href={`/players/${player.id}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image
                        src={getPlayerHeadshotUrl(player.id, "small") || "/placeholder.svg"}
                        alt={player.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{player.fullName}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{player.primaryPosition?.abbreviation || "-"}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {player.batSide?.code || "-"}/{player.pitchHand?.code || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
