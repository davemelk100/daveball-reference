import type { Metadata } from "next";
import { Suspense } from "react";
import { getTeams, getDefaultSeason } from "@/lib/mlb-api";
import type { Team } from "@/lib/mlb-api";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "MLB Teams",
  description:
    "Browse all 30 Major League Baseball teams organized by division. View rosters, stats, and team history.",
  alternates: {
    canonical: "/teams",
  },
  openGraph: {
    title: "MLB Teams - All 30 Teams",
    description:
      "Browse all 30 Major League Baseball teams organized by division. View rosters, stats, and team history.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLB Teams",
    description: "Browse all 30 MLB teams by division with rosters and stats.",
  },
};

function TeamGrid({ divisions }: { divisions: [string, Team[]][] }) {
  return (
    <div className="space-y-10">
      {divisions.map(([divisionName, divTeams]) => (
        <section key={divisionName}>
          <h2 className="text-xl font-semibold mb-4">{divisionName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {divTeams
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => (
                <a
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="block h-full"
                >
                  <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border bg-card hover:bg-[#b7b7b7] transition-colors h-full min-h-[100px]">
                    <img
                      src={`https://www.mlbstatic.com/team-logos/${team.id}.svg`}
                      alt={team.name}
                      className="h-10 w-10 object-contain"
                      loading="lazy"
                    />
                    <p className="font-medium text-center">{team.name}</p>
                  </div>
                </a>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TeamsGridSkeleton() {
  return (
    <div className="space-y-10">
      {[1, 2, 3].map((i) => (
        <section key={i}>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="h-16 w-full" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

async function TeamsContent() {
  const defaultSeason = getDefaultSeason();
  const teams = await getTeams(defaultSeason);

  // Group teams by division
  const divisions: Record<string, Team[]> = {};
  teams.forEach((team) => {
    const divName = team.division?.name || "Other";
    if (!divisions[divName]) divisions[divName] = [];
    divisions[divName].push(team);
  });

  // Sort divisions by league then name
  const sortedDivisions = Object.entries(divisions).sort(([a], [b]) => {
    const aIsAL = a.includes("American");
    const bIsAL = b.includes("American");
    if (aIsAL && !bIsAL) return -1;
    if (!aIsAL && bIsAL) return 1;
    return a.localeCompare(b);
  });

  return <TeamGrid divisions={sortedDivisions} />;
}

import Image from "next/image";

export default function TeamsPage() {
  return (
    <main className="container py-8">
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/mln-no-text.svg"
          alt="MLN Logo"
          width={120}
          height={120}
          className="h-16 md:h-24 w-auto object-contain hidden md:flex hidden md:flex"
          priority
        />
        <div className="flex flex-col">
          <h1 className="mb-0">MLB Teams</h1>
        </div>
      </div>

      <Suspense fallback={<TeamsGridSkeleton />}>
        <TeamsContent />
      </Suspense>
    </main>
  );
}
