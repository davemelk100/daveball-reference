"use client";

import { useState, Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { StatCard } from "@/components/stat-card";
import { LeadersTable } from "@/components/leaders-table";
import { SeasonSelector } from "@/components/season-selector";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import type { AwardWinner } from "@/lib/awards-data";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const LeadersBarChart = dynamic(
  () =>
    import("@/components/leaders-bar-chart").then((mod) => ({
      default: mod.LeadersBarChart,
    })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

const AwardsCard = dynamic(
  () =>
    import("@/components/awards-card").then((mod) => ({
      default: mod.AwardsCard,
    })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
  }
);

const TriviaPanel = dynamic(
  () =>
    import("@/components/trivia-card").then((mod) => ({
      default: mod.TriviaPanel,
    })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

const PlayerSpotlight = dynamic(
  () =>
    import("@/components/player-spotlight").then((mod) => ({
      default: mod.PlayerSpotlight,
    })),
  {
    loading: () => <Skeleton className="h-[80px] w-full" />,
  }
);

interface LeagueLeader {
  value: string | number;
  person?: { id: number; fullName: string };
}

interface DashboardData {
  hrLeaders: any[];
  avgLeaders: any[];
  eraLeaders: any[];
  kLeaders: any[];
  standings: any[];
  mvpWinners: { al: AwardWinner[]; nl: AwardWinner[] };
  cyYoungWinners: { al: AwardWinner[]; nl: AwardWinner[] };
  leagueLeaders?: {
    hr: { al: LeagueLeader; nl: LeagueLeader };
    avg: { al: LeagueLeader; nl: LeagueLeader };
    era: { al: LeagueLeader; nl: LeagueLeader };
  };
  chartLeaders?: {
    hr: { al: any[]; nl: any[] };
    k: { al: any[]; nl: any[] };
  };
  tableLeaders?: {
    hr: { al: any[]; nl: any[] };
    avg: { al: any[]; nl: any[] };
    era: { al: any[]; nl: any[] };
    k: { al: any[]; nl: any[] };
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardContent({
  initialData,
  initialSeason,
}: {
  initialData: DashboardData;
  initialSeason: number;
}) {
  const [season, setSeason] = useState(initialSeason);
  const [selectedLeague, setSelectedLeague] = useState<"AL" | "NL">("AL");
  const [chartLeague, setChartLeague] = useState<"AL" | "NL">("AL");
  const [tableLeague, setTableLeague] = useState<"AL" | "NL">("AL");
  const [awardsLeague, setAwardsLeague] = useState<"AL" | "NL">("AL");

  const { data, isLoading } = useSWR<DashboardData>(
    `/api/dashboard?season=${season}`,
    fetcher,
    {
      fallbackData: season === initialSeason ? initialData : undefined,
      revalidateOnFocus: false,
    }
  );

  const hrLeaders = data?.hrLeaders || [];
  const avgLeaders = data?.avgLeaders || [];
  const eraLeaders = data?.eraLeaders || [];
  const kLeaders = data?.kLeaders || [];
  const mvpWinners = data?.mvpWinners || { al: [], nl: [] };
  const cyYoungWinners = data?.cyYoungWinners || { al: [], nl: [] };
  const leagueLeaders = data?.leagueLeaders;
  const chartLeaders = data?.chartLeaders;
  const tableLeaders = data?.tableLeaders;

  const currentYear = new Date().getFullYear();
  const isCurrentSeason = season === currentYear;
  const seasonStatus = isCurrentSeason ? "In Progress" : "Completed";
  const seasonDescription = isCurrentSeason
    ? "Regular season games"
    : "Final standings";

  const formatLeader = (
    al: LeagueLeader | undefined,
    nl: LeagueLeader | undefined
  ) => {
    const leader = selectedLeague === "AL" ? al : nl;
    if (!leader) return undefined;
    return [
      {
        league: selectedLeague,
        value: leader?.value || "—",
        name: leader?.person?.fullName || "No data",
        playerId: leader?.person?.id,
      },
    ];
  };

  return (
    <main className="container py-8">
      {/* Hero Section */}
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/mln-logo.png"
          alt="MLN Logo"
          width={120}
          height={120}
          className="h-16 md:h-24 w-auto object-contain"
        />
        <div className="flex flex-col">
          <h1 className="mb-0">Major League Numbers</h1>
          <p className="text-muted-foreground text-lg">
            The simplest way to search MLB history.
          </p>
        </div>
      </div>

      {/* Daily Trivia & Player of the Day Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <TriviaPanel />
        <PlayerSpotlight />
      </div>

      {/* Season Card */}
      <div className="mb-4">
        <SeasonSelector
          season={season}
          onSeasonChange={setSeason}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">League Best</h2>
          <Tabs
            value={selectedLeague}
            onValueChange={(value) => setSelectedLeague(value as "AL" | "NL")}
          >
            <TabsList>
              <TabsTrigger value="AL">AL</TabsTrigger>
              <TabsTrigger value="NL">NL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Home Run Leader"
            leaders={
              isLoading
                ? undefined
                : formatLeader(leagueLeaders?.hr?.al, leagueLeaders?.hr?.nl)
            }
            value={isLoading ? "..." : undefined}
            description={isLoading ? "Loading..." : undefined}
          />
          <StatCard
            title="Batting Avg Leader"
            leaders={
              isLoading
                ? undefined
                : formatLeader(leagueLeaders?.avg?.al, leagueLeaders?.avg?.nl)
            }
            value={isLoading ? "..." : undefined}
            description={isLoading ? "Loading..." : undefined}
          />
          <StatCard
            title="ERA Leader"
            leaders={
              isLoading
                ? undefined
                : formatLeader(leagueLeaders?.era?.al, leagueLeaders?.era?.nl)
            }
            value={isLoading ? "..." : undefined}
            description={isLoading ? "Loading..." : undefined}
          />
        </div>
      </div>

      {/* Award Winners */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Award Winners</h2>
          <Tabs
            value={awardsLeague}
            onValueChange={(value) => setAwardsLeague(value as "AL" | "NL")}
          >
            <TabsList>
              <TabsTrigger value="AL">AL</TabsTrigger>
              <TabsTrigger value="NL">NL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <AwardsCard
            title="MVP Winners"
            winners={awardsLeague === "AL" ? mvpWinners.al : mvpWinners.nl}
            limit={5}
          />
          <AwardsCard
            title="Cy Young Winners"
            winners={
              awardsLeague === "AL" ? cyYoungWinners.al : cyYoungWinners.nl
            }
            limit={5}
          />
        </div>
      </div>

      {/* Data Visualizations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Data Visualizations</h2>
          <Tabs
            value={chartLeague}
            onValueChange={(value) => setChartLeague(value as "AL" | "NL")}
          >
            <TabsList>
              <TabsTrigger value="AL">AL</TabsTrigger>
              <TabsTrigger value="NL">NL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <LeadersBarChart
            title="Home Run Leaders"
            leaders={
              chartLeague === "AL"
                ? chartLeaders?.hr?.al || hrLeaders
                : chartLeaders?.hr?.nl || hrLeaders
            }
            color="#ef4444"
          />
          <LeadersBarChart
            title="Strikeout Leaders (Pitching)"
            leaders={
              chartLeague === "AL"
                ? chartLeaders?.k?.al || kLeaders
                : chartLeaders?.k?.nl || kLeaders
            }
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">League Leaders</h2>
          <div className="flex items-center gap-4">
            <Tabs
              value={tableLeague}
              onValueChange={(value) => setTableLeague(value as "AL" | "NL")}
            >
              <TabsList>
                <TabsTrigger value="AL">AL</TabsTrigger>
                <TabsTrigger value="NL">NL</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LeadersTable
            title="Home Runs"
            leaders={
              tableLeague === "AL"
                ? tableLeaders?.hr?.al || hrLeaders
                : tableLeaders?.hr?.nl || hrLeaders
            }
            statLabel="HR"
          />
          <LeadersTable
            title="Batting Average"
            leaders={
              tableLeague === "AL"
                ? tableLeaders?.avg?.al || avgLeaders
                : tableLeaders?.avg?.nl || avgLeaders
            }
            statLabel="AVG"
          />
          <LeadersTable
            title="ERA"
            leaders={
              tableLeague === "AL"
                ? tableLeaders?.era?.al || eraLeaders
                : tableLeaders?.era?.nl || eraLeaders
            }
            statLabel="ERA"
          />
          <LeadersTable
            title="Strikeouts"
            leaders={
              tableLeague === "AL"
                ? tableLeaders?.k?.al || kLeaders
                : tableLeaders?.k?.nl || kLeaders
            }
            statLabel="K"
          />
        </div>
      </div>
    </main>
  );
}
