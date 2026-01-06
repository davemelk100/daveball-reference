"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { searchPlayers, type Player } from "@/lib/mlb-api"
import { cn } from "@/lib/utils"

export function PlayerSearch() {
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

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search players by name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 bg-white border-border"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-auto">
          <CardContent className="p-2">
            {results.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors",
                  "cursor-pointer",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {player.primaryNumber || "#"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{player.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.primaryPosition?.name} • {player.currentTeam?.name || "Free Agent"}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <CardContent className="p-4 text-center text-muted-foreground">No players found for "{query}"</CardContent>
        </Card>
      )}
    </div>
  )
}
