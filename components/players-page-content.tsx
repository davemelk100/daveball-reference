"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { PlayerSearch } from "@/components/player-search";
import Image from "next/image";
import { PlayerCard } from "@/components/player-card";
import { SeasonSelector } from "@/components/season-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronDown } from "lucide-react";
import type { Player } from "@/lib/mlb-api";

interface PlayersPageContentProps {
  initialPlayers: Player[];
  initialSeason: number;
}

export function PlayersPageContent({
  initialPlayers,
  initialSeason,
}: PlayersPageContentProps) {
  const [season, setSeason] = useState(initialSeason);
  const [featuredPlayers, setFeaturedPlayers] =
    useState<Player[]>(initialPlayers);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setShowAll(false);
      setAllPlayers([]);
      setDisplayedPlayers([]);
      setPage(1);

      try {
        const response = await fetch(`/api/players?season=${season}`);
        const data = await response.json();
        setFeaturedPlayers(data.featuredPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (season !== initialSeason || featuredPlayers.length === 0) {
      fetchPlayers();
    } else {
      setFeaturedPlayers(initialPlayers);
      setShowAll(false);
      setPage(1);
    }
  }, [season, initialSeason, initialPlayers]);

  const handleShowAll = async () => {
    if (allPlayers.length > 0) {
      setShowAll(true);
      setDisplayedPlayers(allPlayers.slice(0, itemsPerPage));
      setPage(1);
      return;
    }

    setIsFetchingAll(true);
    try {
      const response = await fetch(`/api/players?season=${season}&type=all`);
      const data = await response.json();
      setAllPlayers(data.players);
      setDisplayedPlayers(data.players.slice(0, itemsPerPage));
      setShowAll(true);
      setPage(1);
    } catch (error) {
      console.error("Error fetching all players:", error);
    } finally {
      setIsFetchingAll(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const nextPlayers = allPlayers.slice(0, nextPage * itemsPerPage);
    setDisplayedPlayers(nextPlayers);
    setPage(nextPage);
  };

  const currentList = showAll ? displayedPlayers : featuredPlayers;
  const hasMore = showAll && displayedPlayers.length < allPlayers.length;

  return (
    <main className="container py-8">
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/mln-logo.png"
          alt="MLN Logo"
          width={120}
          height={120}
          className="h-16 md:h-24 w-auto object-contain hidden md:flex hidden md:flex"
          priority
        />
        <div className="flex flex-col">
          <h1 className="mb-0">Players</h1>
        </div>
      </div>

      <div className="mb-6 flex justify-start">
        <SeasonSelector season={season} onSeasonChange={setSeason} />
      </div>

      <div className="mb-8">
        <Suspense
          fallback={
            <div className="h-10 bg-secondary rounded-md animate-pulse max-w-xl" />
          }
        >
          <PlayerSearch />
        </Suspense>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {season} {showAll ? "All Players" : "Featured Players"}
          {(isLoading || isFetchingAll) && (
            <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </h2>
        {!showAll ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowAll}
            disabled={isFetchingAll || isLoading}
          >
            {isFetchingAll ? "Loading..." : "See All Players"}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setShowAll(false)}>
            Show Featured Only
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-secondary rounded mb-2" />
                    <div className="h-3 w-32 bg-secondary rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentList.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                className="gap-2"
              >
                Load More Players
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showAll && !hasMore && allPlayers.length > 0 && (
            <p className="mt-8 text-center text-muted-foreground text-sm">
              Showing all {allPlayers.length} players for {season}
            </p>
          )}
        </>
      )}
    </main>
  );
}
