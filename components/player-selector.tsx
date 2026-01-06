"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Loader2, X } from "lucide-react"
import { searchPlayers, type Player } from "@/lib/mlb-api"
import { cn } from "@/lib/utils"

interface PlayerSelectorProps {
  selectedPlayer: Player | null
  onSelect: (player: Player | null) => void
  label: string
}

export function PlayerSelector({ selectedPlayer, onSelect, label }: PlayerSelectorProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const players = await searchPlayers(searchQuery)
      setResults(players)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  if (selectedPlayer) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shrink-0">
                {selectedPlayer.primaryNumber || "#"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{selectedPlayer.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlayer.primaryPosition?.name} • {selectedPlayer.currentTeam?.name || "Free Agent"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onSelect(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for a player..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              className="pl-10 bg-secondary border-border"
            />
            {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />}
          </div>
        </CardContent>
      </Card>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-60 overflow-auto">
          <CardContent className="p-2">
            {results.map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  onSelect(player)
                  setQuery("")
                  setResults([])
                }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors w-full text-left",
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  {player.primaryNumber || "#"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{player.fullName}</p>
                  <p className="text-xs text-muted-foreground">{player.currentTeam?.name || "Free Agent"}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
