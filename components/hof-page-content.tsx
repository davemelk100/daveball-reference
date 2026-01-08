"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getPlayerHeadshotUrl, type HallOfFamer } from "@/lib/mlb-api"

interface HofPageContentProps {
  hofMembers: HallOfFamer[]
}

export function HofPageContent({ hofMembers }: HofPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  // Get unique years for the dropdown
  const years = [...new Set(hofMembers.map((m) => m.inductionYear))].sort((a, b) => b - a)

  // Filter members based on search and year
  const filteredMembers = hofMembers.filter((member) => {
    const matchesSearch = member.playerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = selectedYear === "all" || member.inductionYear === Number(selectedYear)
    return matchesSearch && matchesYear
  })

  // Group by year
  const groupedByYear = filteredMembers.reduce(
    (acc, member) => {
      const year = member.inductionYear
      if (!acc[year]) acc[year] = []
      acc[year].push(member)
      return acc
    },
    {} as Record<number, HallOfFamer[]>
  )

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Hall of Fame</h1>
      </div>

      {/* Year Selector */}
      <div className="mb-6">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <Card className="w-full py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-0 flex justify-center">
              <SelectTrigger className="w-auto border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0">
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
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Hall of Famers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results */}
      {sortedYears.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No Hall of Famers found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year}>
              <h2 className="text-xl font-semibold mb-4">{year}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedByYear[year].map((member) => (
                  <Link key={`${member.playerId}-${year}`} href={`/players/${member.playerId}`}>
                    <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={getPlayerHeadshotUrl(member.playerId, "small") || "/placeholder.svg"}
                            alt={member.playerName}
                            width={75}
                            height={75}
                            style={{ width: 'auto', height: '75px' }}
                            className="rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{member.playerName}</p>
                            {member.position && (
                              <p className="text-sm text-muted-foreground">{member.position}</p>
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
        </div>
      )}
    </main>
  )
}
