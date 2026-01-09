"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SeasonSelectorProps {
  season: number
  onSeasonChange: (season: number) => void
  isLoading?: boolean
  startYear?: number
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

export function SeasonSelector({ season, onSeasonChange, isLoading, startYear = 1960 }: SeasonSelectorProps) {
  const maxYear = getMaxYear()
  const seasons = Array.from({ length: maxYear - startYear + 1 }, (_, i) => maxYear - i)

  return (
    <Select value={season.toString()} onValueChange={(val) => onSeasonChange(Number.parseInt(val))}>
      <div className="w-full py-3 cursor-pointer hover:bg-muted/5 transition-colors">
        <div className="p-0 flex justify-start">
          <SelectTrigger className="w-auto border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 focus-visible:ring-0">
            <div className="flex items-center gap-4">
              <span className="font-league text-2xl md:text-3xl font-semibold text-[#4e6095]">Season</span>
              <span className="font-league text-2xl md:text-3xl font-bold border-b-2 border-foreground">
                <SelectValue placeholder="Season" />
              </span>
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </div>
          </SelectTrigger>
        </div>
      </div>
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
