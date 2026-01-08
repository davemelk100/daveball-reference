"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { TeamHistoricalRecord } from "@/lib/mlb-api"

interface HistoricalTableProps {
  data: TeamHistoricalRecord[]
}

type SortKey = "season" | "wins" | "losses" | "winningPercentage" | "runDifferential"
type SortDirection = "asc" | "desc"

export function HistoricalTable({ data }: HistoricalTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("season")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [decadeFilter, setDecadeFilter] = useState<string>("all")
  const [searchYear, setSearchYear] = useState("")

  const decades = useMemo(() => {
    const uniqueDecades = [...new Set(data.map((r) => Math.floor(r.season / 10) * 10))]
    return uniqueDecades.sort((a, b) => b - a)
  }, [data])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data]

    // Filter by decade
    if (decadeFilter !== "all") {
      const decade = Number.parseInt(decadeFilter)
      filtered = filtered.filter((r) => r.season >= decade && r.season < decade + 10)
    }

    // Filter by search year
    if (searchYear) {
      filtered = filtered.filter((r) => r.season.toString().includes(searchYear))
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: number, bVal: number
      if (sortKey === "winningPercentage") {
        aVal = Number.parseFloat(a.winningPercentage)
        bVal = Number.parseFloat(b.winningPercentage)
      } else {
        aVal = a[sortKey] as number
        bVal = b[sortKey] as number
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    })

    return filtered
  }, [data, sortKey, sortDirection, decadeFilter, searchYear])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  // Stats summary
  const stats = useMemo(() => {
    if (filteredAndSortedData.length === 0) return null
    const totalWins = filteredAndSortedData.reduce((sum, r) => sum + r.wins, 0)
    const totalLosses = filteredAndSortedData.reduce((sum, r) => sum + r.losses, 0)
    const bestSeason = [...filteredAndSortedData].sort(
      (a, b) => Number.parseFloat(b.winningPercentage) - Number.parseFloat(a.winningPercentage),
    )[0]
    const avgWinPct = (totalWins / (totalWins + totalLosses)) * 100
    return { totalWins, totalLosses, bestSeason, avgWinPct }
  }, [filteredAndSortedData])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <CardTitle className="text-lg">Year-by-Year Results</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search year..."
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-28 h-8 text-sm"
            />
            <select
              value={decadeFilter}
              onChange={(e) => setDecadeFilter(e.target.value)}
              className="h-8 px-2 text-sm rounded-md border border-input bg-background"
            >
              <option value="all">All Decades</option>
              {decades.map((decade) => (
                <option key={decade} value={decade}>
                  {decade}s
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Total Record</p>
              <p className="font-bold">
                {stats.totalWins}-{stats.totalLosses}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Win %</p>
              <p className="font-bold">{stats.avgWinPct.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Season</p>
              <p className="font-bold">
                {stats.bestSeason.season} ({stats.bestSeason.wins}-{stats.bestSeason.losses})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seasons</p>
              <p className="font-bold">{filteredAndSortedData.length}</p>
            </div>
          </div>
        )}

        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("season")}>
                  Year <SortIcon columnKey="season" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("wins")}>
                  W <SortIcon columnKey="wins" />
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("losses")}>
                  L <SortIcon columnKey="losses" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("winningPercentage")}
                >
                  PCT <SortIcon columnKey="winningPercentage" />
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">RS</TableHead>
                <TableHead className="text-right hidden sm:table-cell">RA</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("runDifferential")}
                >
                  Diff <SortIcon columnKey="runDifferential" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((record) => (
                <TableRow key={record.season}>
                  <TableCell className="font-medium">{record.season}</TableCell>
                  <TableCell className="text-right">{record.wins}</TableCell>
                  <TableCell className="text-right">{record.losses}</TableCell>
                  <TableCell className="text-right">
                    {(Number.parseFloat(record.winningPercentage) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{record.runsScored}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{record.runsAllowed}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${record.runDifferential > 0 ? "text-green-500" : record.runDifferential < 0 ? "text-red-500" : ""
                      }`}
                  >
                    {record.runDifferential > 0 ? "+" : ""}
                    {record.runDifferential}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No records found for the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
