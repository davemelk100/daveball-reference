"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SeasonSelectorProps {
  season: number
  onSeasonChange: (season: number) => void
}

const currentYear = new Date().getFullYear()
const seasons = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i)

export function SeasonSelector({ season, onSeasonChange }: SeasonSelectorProps) {
  return (
    <Select value={season.toString()} onValueChange={(val) => onSeasonChange(Number.parseInt(val))}>
      <SelectTrigger className="w-[120px] text-2xl font-bold border-none shadow-none p-0 h-auto">
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
