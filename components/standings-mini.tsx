"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Division } from "@/lib/mlb-api"

interface StandingsMiniProps {
  division: Division
}

export function StandingsMini({ division }: StandingsMiniProps) {
  const divisionName = division.division?.name || "Division"
  const shortName = divisionName.replace("American League ", "AL ").replace("National League ", "NL ")

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{shortName}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Team</TableHead>
              <TableHead className="text-center w-12">W</TableHead>
              <TableHead className="text-center w-12">L</TableHead>
              <TableHead className="text-right w-14">GB</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {division.teamRecords?.slice(0, 5).map((record, idx) => (
              <TableRow key={record.team?.id || idx}>
                <TableCell className="font-medium">{record.team?.abbreviation || record.team?.teamName}</TableCell>
                <TableCell className="text-center">{record.wins}</TableCell>
                <TableCell className="text-center">{record.losses}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {record.gamesBack === "-" ? "-" : record.gamesBack}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
