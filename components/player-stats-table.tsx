"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PlayerStats } from "@/lib/mlb-api"

interface PlayerStatsTableProps {
  stats: PlayerStats[]
  type: "hitting" | "pitching"
}

export function PlayerStatsTable({ stats, type }: PlayerStatsTableProps) {
  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{type === "hitting" ? "Batting Stats" : "Pitching Stats"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No {type} stats available</p>
        </CardContent>
      </Card>
    )
  }

  // Sort by season descending
  const sortedStats = [...stats].sort((a, b) => (b.season || "").localeCompare(a.season || ""))

  if (type === "hitting") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Batting Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">G</TableHead>
                  <TableHead className="text-center">AB</TableHead>
                  <TableHead className="text-center">H</TableHead>
                  <TableHead className="text-center">HR</TableHead>
                  <TableHead className="text-center">RBI</TableHead>
                  <TableHead className="text-center">BB</TableHead>
                  <TableHead className="text-center">K</TableHead>
                  <TableHead className="text-center">SB</TableHead>
                  <TableHead className="text-right">AVG</TableHead>
                  <TableHead className="text-right">OBP</TableHead>
                  <TableHead className="text-right">SLG</TableHead>
                  <TableHead className="text-right">OPS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStats.map((s, idx) => (
                  <TableRow key={`${s.season}-${idx}`}>
                    <TableCell className="font-medium">{s.season}</TableCell>
                    <TableCell className="text-muted-foreground">{s.team?.name || "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.gamesPlayed ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.atBats ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.hits ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.homeRuns ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.rbi ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.baseOnBalls ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.strikeOuts ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.stat.stolenBases ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono">{s.stat.avg || "—"}</TableCell>
                    <TableCell className="text-right font-mono">{s.stat.obp || "—"}</TableCell>
                    <TableCell className="text-right font-mono">{s.stat.slg || "—"}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{s.stat.ops || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pitching stats
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pitching Stats</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">IP</TableHead>
                <TableHead className="text-center">K</TableHead>
                <TableHead className="text-center">BB</TableHead>
                <TableHead className="text-center">SV</TableHead>
                <TableHead className="text-right">ERA</TableHead>
                <TableHead className="text-right">WHIP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((s, idx) => (
                <TableRow key={`${s.season}-${idx}`}>
                  <TableCell className="font-medium">{s.season}</TableCell>
                  <TableCell className="text-muted-foreground">{s.team?.name || "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.wins ?? "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.losses ?? "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.gamesPlayed ?? "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.inningsPitched || "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.strikeOuts ?? "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.baseOnBalls ?? "—"}</TableCell>
                  <TableCell className="text-center">{s.stat.saves ?? "—"}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{s.stat.era || "—"}</TableCell>
                  <TableCell className="text-right font-mono">{s.stat.whip || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
