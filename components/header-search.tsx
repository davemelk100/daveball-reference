"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, Users, Trophy, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { searchPlayers, getPlayerHeadshotUrl, getTeams, getAllPlayers, type Player, type Team } from "@/lib/mlb-api"
import { cn } from "@/lib/utils"
import Fuse from "fuse.js"

type SearchResult =
  | { type: "player"; data: Player }
  | { type: "team"; data: Team }

export function HeaderSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Local data for instant fuzzy matching
  const [localPlayers, setLocalPlayers] = useState<Player[]>([])
  const [localTeams, setLocalTeams] = useState<Team[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [players, teams] = await Promise.all([
          getAllPlayers(),
          getTeams()
        ])
        setLocalPlayers(players)
        setLocalTeams(teams)
      } catch (err) {
        console.error("Failed to load search data:", err)
      }
    }
    loadData()
  }, [])

  const fusePlayers = useMemo(() => new Fuse(localPlayers, {
    keys: ["fullName", "firstName", "lastName"],
    threshold: 0.3,
    distance: 100,
  }), [localPlayers])

  const fuseTeams = useMemo(() => new Fuse(localTeams, {
    keys: ["name", "teamName", "locationName", "abbreviation"],
    threshold: 0.3,
  }), [localTeams])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // 1. Instant local fuzzy search
      const playerFuzzy = fusePlayers.search(searchQuery).slice(0, 5).map(r => ({ type: "player" as const, data: r.item }))
      const teamFuzzy = fuseTeams.search(searchQuery).slice(0, 3).map(r => ({ type: "team" as const, data: r.item }))

      let currentResults: SearchResult[] = [...teamFuzzy, ...playerFuzzy]
      setResults(currentResults)

      // 2. Background API search for historical players or those not in the active list
      // Only if we don't have enough results or if it's a specific-looking search
      const apiPlayers = await searchPlayers(searchQuery)
      const uniqueApiPlayers = apiPlayers.filter(ap =>
        !playerFuzzy.some(pf => pf.data.id === ap.id)
      )

      if (uniqueApiPlayers.length > 0) {
        const additionalPlayers = uniqueApiPlayers.slice(0, 5).map(p => ({ type: "player" as const, data: p }))
        setResults([...currentResults, ...additionalPlayers])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [fusePlayers, fuseTeams])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  return (
    <div className="relative">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search players or teams..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={cn(
            "pl-10 pr-10 w-48 sm:w-80 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 focus:border-primary transition-all rounded-xl h-10 text-sm",
            isOpen && query.length > 0 && "rounded-b-none border-b-0 shadow-lg"
          )}
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full right-0 w-80 z-[60] max-h-[70vh] overflow-hidden border-t-0 rounded-t-none shadow-2xl glassmorphism animate-in fade-in slide-in-from-top-2 duration-200">
          <CardContent className="p-0 overflow-auto max-h-[inherit] custom-scrollbar">
            {results.map((result, idx) => {
              const isPlayer = result.type === "player"
              const key = isPlayer ? `p-${result.data.id}` : `t-${result.data.id}`
              const href = isPlayer ? `/players/${result.data.id}` : `/teams/${result.data.id}`

              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-primary/10 transition-all border-b border-border/50 last:border-0 group",
                    "cursor-pointer"
                  )}
                >
                  <div className="relative shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center w-[50px] h-[50px]">
                    {isPlayer ? (
                      <Image
                        src={getPlayerHeadshotUrl(result.data.id, "small")}
                        alt={result.data.fullName}
                        width={50}
                        height={50}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Image
                        src={`https://www.mlbstatic.com/team-logos/${result.data.id}.svg`}
                        alt={result.data.name}
                        width={40}
                        height={40}
                        className="p-1 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="font-semibold text-sm truncate">{isPlayer ? result.data.fullName : result.data.name}</p>
                      {isPlayer ? (
                        <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                      ) : (
                        <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate uppercase tracking-wider">
                      {isPlayer ? (
                        <>
                          {result.data.primaryPosition?.name || "Player"}
                          {result.data.currentTeam?.name ? ` • ${result.data.currentTeam.name}` : result.data.active ? "" : " • Historical"}
                        </>
                      ) : (
                        <>
                          {result.data.abbreviation} • {result.data.division?.name || "MLB"}
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <Card className="absolute top-full right-0 w-80 z-[60] border-t-0 rounded-t-none shadow-xl glassmorphism">
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No matches for "{query}"</p>
            <p className="text-[10px] mt-1 opacity-60">Try searching for a player name or team name</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
