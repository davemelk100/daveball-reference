"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  const [selectedDecade, setSelectedDecade] = useState<string>("all")

  // Get unique decades for filtering
  const decades = useMemo(() => {
    const decadeSet = new Set<string>()
    initialData.forEach((member) => {
      const decade = Math.floor(member.inductionYear / 10) * 10
      decadeSet.add(decade.toString())
    })
    return Array.from(decadeSet).sort((a, b) => Number(b) - Number(a))
  }, [initialData])

  // Filter HOF members based on search and decade
  const filteredMembers = useMemo(() => {
    return initialData.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDecade =
        selectedDecade === "all" ||
        Math.floor(member.inductionYear / 10) * 10 === Number(selectedDecade)

      return matchesSearch && matchesDecade
    })
  }, [initialData, searchQuery, selectedDecade])

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
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Hall of Fame
            </h1>
            <p className="text-muted-foreground">
              {initialData.length} inductees in baseball history
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={selectedDecade === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDecade("all")}
            >
              All
            </Badge>
            {decades.slice(0, 8).map((decade) => (
              <Badge
                key={decade}
                variant={selectedDecade === decade ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedDecade(decade)}
              >
                {decade}s
              </Badge>
            ))}
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
