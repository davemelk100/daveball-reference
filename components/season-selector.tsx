"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SeasonSelectorProps {
  season: number
  onSeasonChange: (season: number) => void
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

export function SeasonSelector({ season, onSeasonChange }: SeasonSelectorProps) {
  return (
    <Select value={season.toString()} onValueChange={(val) => onSeasonChange(Number.parseInt(val))}>
      <SelectTrigger className="w-[140px] text-2xl font-bold border-none shadow-none p-0 h-auto [&_svg]:opacity-100 [&_svg]:size-6 [&_svg]:text-primary">
        <SelectValue placeholder="Season" />
      </SelectTrigger>
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
