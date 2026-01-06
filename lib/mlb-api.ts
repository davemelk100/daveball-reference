// MLB Stats API utilities

const BASE_URL = "https://statsapi.mlb.com/api/v1"

export interface Player {
  id: number
  fullName: string
  firstName: string
  lastName: string
  primaryNumber?: string
  birthDate: string
  currentAge: number
  birthCity: string
  birthCountry: string
  height: string
  weight: number
  active: boolean
  primaryPosition: {
    code: string
    name: string
    type: string
    abbreviation: string
  }
  currentTeam?: {
    id: number
    name: string
  }
  stats?: PlayerStats[]
}

export interface PlayerStats {
  season: string
  stat: {
    gamesPlayed?: number
    groundOuts?: number
    airOuts?: number
    runs?: number
    doubles?: number
    triples?: number
    homeRuns?: number
    strikeOuts?: number
    baseOnBalls?: number
    hits?: number
    avg?: string
    atBats?: number
    obp?: string
    slg?: string
    ops?: string
    rbi?: number
    stolenBases?: number
    // Pitching stats
    wins?: number
    losses?: number
    era?: string
    inningsPitched?: string
    pitchStrikeOuts?: number
    whip?: string
    saves?: number
  }
  team?: {
    id: number
    name: string
  }
}

export interface Team {
  id: number
  name: string
  teamName: string
  abbreviation: string
  locationName: string
  division: {
    id: number
    name: string
  }
  league: {
    id: number
    name: string
  }
}

export interface StandingsRecord {
  team: Team
  wins: number
  losses: number
  winningPercentage: string
  gamesBack: string
  runsScored: number
  runsAllowed: number
  runDifferential: number
  streak: {
    streakCode: string
  }
}

export interface Division {
  division: {
    id: number
    name: string
  }
  teamRecords: StandingsRecord[]
}

export interface TeamHistoricalRecord {
  season: number
  wins: number
  losses: number
  winningPercentage: string
  runsScored: number
  runsAllowed: number
  runDifferential: number
  divisionRank?: number
  leagueRank?: number
  playoffResult?: string
}

export async function searchPlayers(query: string): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/people/search?names=${encodeURIComponent(query)}&sportId=1&limit=10`)
    if (!res.ok) throw new Error("Failed to search players")
    const data = await res.json()
    return data.people || []
  } catch (error) {
    console.error("Error searching players:", error)
    return []
  }
}

export async function getPlayer(playerId: number): Promise<Player | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/people/${playerId}?hydrate=currentTeam,stats(group=[hitting,pitching],type=[yearByYear])`,
    )
    if (!res.ok) throw new Error("Failed to fetch player")
    const data = await res.json()
    return data.people?.[0] || null
  } catch (error) {
    console.error("Error fetching player:", error)
    return null
  }
}

export async function getPlayerStats(playerId: number, season = 2024): Promise<PlayerStats[]> {
  try {
    const res = await fetch(`${BASE_URL}/people/${playerId}/stats?stats=season&season=${season}&group=hitting,pitching`)
    if (!res.ok) throw new Error("Failed to fetch player stats")
    const data = await res.json()
    return data.stats?.[0]?.splits || []
  } catch (error) {
    console.error("Error fetching player stats:", error)
    return []
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    const res = await fetch(`${BASE_URL}/teams?sportId=1`)
    if (!res.ok) throw new Error("Failed to fetch teams")
    const data = await res.json()
    return data.teams || []
  } catch (error) {
    console.error("Error fetching teams:", error)
    return []
  }
}

export async function getStandings(season = 2024): Promise<Division[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team(division)`,
    )
    if (!res.ok) throw new Error("Failed to fetch standings")
    const data = await res.json()
    return data.records || []
  } catch (error) {
    console.error("Error fetching standings:", error)
    return []
  }
}

export async function getLeaders(
  statType: "hitting" | "pitching",
  statCategory: string,
  season = 2024,
  limit = 10,
): Promise<any[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/stats/leaders?leaderCategories=${statCategory}&season=${season}&sportId=1&limit=${limit}&statGroup=${statType}`,
    )
    if (!res.ok) throw new Error("Failed to fetch leaders")
    const data = await res.json()
    return data.leagueLeaders?.[0]?.leaders || []
  } catch (error) {
    console.error("Error fetching leaders:", error)
    return []
  }
}

export async function getTeam(teamId: number): Promise<Team | null> {
  try {
    const res = await fetch(`${BASE_URL}/teams/${teamId}`)
    if (!res.ok) throw new Error("Failed to fetch team")
    const data = await res.json()
    return data.teams?.[0] || null
  } catch (error) {
    console.error("Error fetching team:", error)
    return null
  }
}

export async function getTeamRoster(teamId: number, season = 2024): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/teams/${teamId}/roster?season=${season}`)
    if (!res.ok) throw new Error("Failed to fetch roster")
    const data = await res.json()
    return data.roster?.map((r: any) => r.person) || []
  } catch (error) {
    console.error("Error fetching roster:", error)
    return []
  }
}

export async function getTeamStats(teamId: number, season = 2024): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/teams/${teamId}/stats?stats=season&season=${season}&group=hitting,pitching`)
    if (!res.ok) throw new Error("Failed to fetch team stats")
    const data = await res.json()
    return data.stats || []
  } catch (error) {
    console.error("Error fetching team stats:", error)
    return []
  }
}

export async function getTeamHistory(
  teamId: number,
  startYear = 1960,
  endYear = 2024,
): Promise<TeamHistoricalRecord[]> {
  const records: TeamHistoricalRecord[] = []

  // Fetch in batches to avoid too many concurrent requests
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  // Process in chunks of 5 years at a time
  for (let i = 0; i < years.length; i += 5) {
    const chunk = years.slice(i, i + 5)
    const results = await Promise.all(
      chunk.map(async (year) => {
        try {
          const res = await fetch(
            `${BASE_URL}/standings?leagueId=103,104&season=${year}&standingsTypes=regularSeason&hydrate=team`,
          )
          if (!res.ok) return null
          const data = await res.json()

          for (const division of data.records || []) {
            const teamRecord = division.teamRecords?.find((r: any) => r.team.id === teamId)
            if (teamRecord) {
              return {
                season: year,
                wins: teamRecord.wins || 0,
                losses: teamRecord.losses || 0,
                winningPercentage: teamRecord.winningPercentage || ".000",
                runsScored: teamRecord.runsScored || 0,
                runsAllowed: teamRecord.runsAllowed || 0,
                runDifferential: teamRecord.runDifferential || 0,
                divisionRank: teamRecord.divisionRank,
                leagueRank: teamRecord.leagueRank,
              } as TeamHistoricalRecord
            }
          }
          return null
        } catch {
          return null
        }
      }),
    )
    records.push(...results.filter((r): r is TeamHistoricalRecord => r !== null))
  }

  return records.sort((a, b) => b.season - a.season)
}

export async function getFranchiseHistory(teamId: number): Promise<{ allTeamIds: number[]; name: string }> {
  try {
    const res = await fetch(`${BASE_URL}/teams/${teamId}?hydrate=previousScheduledTeams`)
    if (!res.ok) throw new Error("Failed to fetch franchise history")
    const data = await res.json()
    const team = data.teams?.[0]

    // Collect all historical team IDs for this franchise
    const allTeamIds = [teamId]
    if (team?.previousScheduledTeams) {
      team.previousScheduledTeams.forEach((t: any) => allTeamIds.push(t.id))
    }

    return { allTeamIds, name: team?.name || "" }
  } catch {
    return { allTeamIds: [teamId], name: "" }
  }
}

// Helper functions for player headshots and team logos
export function getPlayerHeadshotUrl(playerId: number, size: "small" | "medium" | "large" = "medium"): string {
  const sizeMap = {
    small: 67,
    medium: 213,
    large: 426,
  }
  const width = sizeMap[size]
  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_${width},q_auto:best/v1/people/${playerId}/headshot/67/current`
}

export function getTeamLogoUrl(teamId: number, size: "small" | "medium" | "large" = "medium"): string {
  // MLB static team logos - uses SVG which scales well
  return `https://www.mlbstatic.com/team-logos/${teamId}.svg`
}
