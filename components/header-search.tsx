"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { searchPlayers, getPlayerHeadshotUrl, type Player } from "@/lib/mlb-api"
import { cn } from "@/lib/utils"

export function HeaderSearch() {
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
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search all players..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-10 w-48 sm:w-64 bg-white border-border text-sm h-9"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50 max-h-96 overflow-auto">
          <CardContent className="p-2">
            {results.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                onClick={() => {
                  setIsOpen(false)
                  setQuery("")
                }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors",
                  "cursor-pointer",
                )}
              >
                <Image
                  src={getPlayerHeadshotUrl(player.id, "small") || "/placeholder.svg"}
                  alt={player.fullName}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{player.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.primaryPosition?.name || "Unknown"}
                    {player.currentTeam?.name ? ` • ${player.currentTeam.name}` : player.active ? "" : " • Historical"}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50">
          <CardContent className="p-4 text-center text-muted-foreground text-sm">
            No players found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  )
}
