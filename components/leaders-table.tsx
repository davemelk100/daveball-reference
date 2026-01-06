"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface Leader {
  rank: number
  person: {
    id: number
    fullName: string
  }
  team?: {
    id: number
    name: string
    abbreviation?: string
  }
  value: string
}

interface LeadersTableProps {
  title: string
  leaders: Leader[]
  statLabel: string
}

export function LeadersTable({ title, leaders, statLabel }: LeadersTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">{statLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.slice(0, 5).map((leader) => (
              <TableRow key={leader.person.id}>
                <TableCell className="text-center text-muted-foreground">{leader.rank}</TableCell>
                <TableCell>
                  <Link href={`/players/${leader.person.id}`} className="hover:text-primary transition-colors">
                    <div className="font-medium">{leader.person.fullName}</div>
                    {leader.team && <div className="text-xs text-muted-foreground">{leader.team.name}</div>}
                  </Link>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">{leader.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
