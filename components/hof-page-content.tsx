"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import type { HallOfFamer } from "@/lib/mlb-api"
import Image from "next/image"
import Link from "next/link"
import { Search, Trophy } from "lucide-react"

interface HofPageContentProps {
  initialData: HallOfFamer[]
}

export function HofPageContent({ initialData }: HofPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  // Get unique years for filtering
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>()
    initialData.forEach((member) => {
      yearSet.add(member.inductionYear)
    })
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [initialData])

  // Filter HOF members based on search and year
  const filteredMembers = useMemo(() => {
    return initialData.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYear =
        selectedYear === "all" ||
        member.inductionYear === Number(selectedYear)

      return matchesSearch && matchesYear
    })
  }, [initialData, searchQuery, selectedYear])

  // Group by induction year
  const groupedByYear = useMemo(() => {
    const groups: Record<number, HallOfFamer[]> = {}
    filteredMembers.forEach((member) => {
      if (!groups[member.inductionYear]) {
        groups[member.inductionYear] = []
      }
      groups[member.inductionYear].push(member)
    })
    return groups
  }, [filteredMembers])

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <main className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Hall of Fame
            </h1>
            <p className="text-muted-foreground">
              {initialData.length} inductees in baseball history
            </p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex justify-center mb-6">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <Card className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-0">
                <SelectTrigger className="w-full border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-[#4e6095]">Induction Year</span>
                    <span className="text-xl font-bold border-b-2 border-foreground">
                      <SelectValue placeholder="All Years" />
                    </span>
                  </div>
                </SelectTrigger>
              </CardContent>
            </Card>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {years.map((year) => (
          <div key={year}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">{year}</span>
              <span className="text-muted-foreground text-base font-normal">
                ({groupedByYear[year].length} inductee{groupedByYear[year].length !== 1 ? "s" : ""})
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupedByYear[year].map((member) => (
                <Link
                  key={`${member.playerId}-${member.inductionYear}`}
                  href={member.playerId ? `/players/${member.playerId}` : "#"}
                  className={member.playerId ? "" : "pointer-events-none"}
                >
                  <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {member.playerId ? (
                            <Image
                              src={getPlayerHeadshotUrl(member.playerId, "small")}
                              alt={member.playerName}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.playerName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {member.position && <span>{member.position}</span>}
                            {member.team && (
                              <>
                                <span>•</span>
                                <span className="truncate">{member.team.name}</span>
                              </>
                            )}
                          </div>
                          {member.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {member.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Hall of Fame members found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  )
}
