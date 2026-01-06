"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Division } from "@/lib/mlb-api"

interface StandingsTableProps {
  division: Division
}

export function StandingsTable({ division }: StandingsTableProps) {
  const divisionName = division.division?.name || "Division"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{divisionName}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8 text-center">#</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">PCT</TableHead>
                <TableHead className="text-center">GB</TableHead>
                <TableHead className="text-center">RS</TableHead>
                <TableHead className="text-center">RA</TableHead>
                <TableHead className="text-center">DIFF</TableHead>
                <TableHead className="text-center">STRK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {division.teamRecords?.map((record, idx) => {
                const diff = record.runDifferential || 0
                return (
                  <TableRow key={record.team?.id || idx}>
                    <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{record.team?.name}</span>
                        <span className="text-xs text-muted-foreground">({record.team?.abbreviation})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">{record.wins}</TableCell>
                    <TableCell className="text-center font-mono">{record.losses}</TableCell>
                    <TableCell className="text-center font-mono">{record.winningPercentage}</TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {record.gamesBack === "-" ? "—" : record.gamesBack}
                    </TableCell>
                    <TableCell className="text-center font-mono">{record.runsScored}</TableCell>
                    <TableCell className="text-center font-mono">{record.runsAllowed}</TableCell>
                    <TableCell
                      className={cn(
                        "text-center font-mono font-semibold",
                        diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "",
                      )}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          record.streak?.streakCode?.startsWith("W")
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500",
                        )}
                      >
                        {record.streak?.streakCode || "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
