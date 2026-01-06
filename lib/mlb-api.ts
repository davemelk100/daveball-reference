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
    strikeOuts?: number
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
