"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SeasonSelectorProps {
  season: number
  onSeasonChange: (season: number) => void
  isLoading?: boolean
}

const getMaxYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  // Use 2025 until April 2026
  if (year < 2026 || (year === 2026 && month < 3)) {
    return 2025
  }
  return year
}

const maxYear = getMaxYear()
const seasons = Array.from({ length: maxYear - 1960 + 1 }, (_, i) => maxYear - i)

export function SeasonSelector({ season, onSeasonChange, isLoading }: SeasonSelectorProps) {
  return (
    <Select value={season.toString()} onValueChange={(val) => onSeasonChange(Number.parseInt(val))}>
      <Card className="w-full py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="p-0 flex justify-center">
          <SelectTrigger className="w-auto border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-[#4e6095]">Season</span>
              <span className="text-xl font-bold border-b-2 border-foreground">
                <SelectValue placeholder="Season" />
              </span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </SelectTrigger>
        </CardContent>
      </Card>
      <SelectContent className="max-h-[300px]">
        {seasons.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
