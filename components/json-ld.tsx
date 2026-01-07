interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Major League Numbers",
    url: "https://majorleaguenumbers.com",
    description: "Explore MLB player stats, team rosters, and league standings in real-time.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://majorleaguenumbers.com/players?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <JsonLd data={data} />
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Major League Baseball",
    alternateName: "MLB",
    url: "https://www.mlb.com",
    sport: "Baseball",
  }

  return <JsonLd data={data} />
}

interface PlayerJsonLdProps {
  player: {
    id: number
    fullName: string
    currentAge?: number
    birthDate?: string
    birthCity?: string
    birthCountry?: string
    height?: string
    weight?: number
    primaryPosition?: { name?: string }
    currentTeam?: { name?: string }
  }
}

export function PlayerJsonLd({ player }: PlayerJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.fullName,
    url: `https://majorleaguenumbers.com/players/${player.id}`,
    jobTitle: player.primaryPosition?.name || "Baseball Player",
    affiliation: player.currentTeam?.name
      ? {
          "@type": "SportsTeam",
          name: player.currentTeam.name,
          sport: "Baseball",
        }
      : undefined,
    birthDate: player.birthDate,
    birthPlace: player.birthCity && player.birthCountry
      ? `${player.birthCity}, ${player.birthCountry}`
      : undefined,
    height: player.height,
    weight: player.weight ? `${player.weight} lbs` : undefined,
  }

  return <JsonLd data={data} />
}

interface TeamJsonLdProps {
  team: {
    id: number
    name: string
    abbreviation?: string
    league?: { name?: string }
    division?: { name?: string }
    venue?: { name?: string }
  }
}

export function TeamJsonLd({ team }: TeamJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    url: `https://majorleaguenumbers.com/teams/${team.id}`,
    sport: "Baseball",
    memberOf: {
      "@type": "SportsOrganization",
      name: "Major League Baseball",
    },
    logo: `https://www.mlbstatic.com/team-logos/${team.id}.svg`,
    location: team.venue?.name
      ? {
          "@type": "Place",
          name: team.venue.name,
        }
      : undefined,
  }

  return <JsonLd data={data} />
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}
