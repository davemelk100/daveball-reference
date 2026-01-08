// Major League Numbers API utilities

const BASE_URL = "https://statsapi.mlb.com/api/v1"

const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes default
const CACHE_TTL_LONG = 24 * 60 * 60 * 1000 // 24 hours for static data
const CACHE_TTL_HISTORY = 7 * 24 * 60 * 60 * 1000 // 7 days for historical data

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T
  }
  return null
}

function setCache(key: string, data: any, ttl: number = CACHE_TTL): void {
  cache.set(key, { data, timestamp: Date.now(), ttl })
}

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

export interface AwardWinner {
  id: number
  playerId: number
  playerName: string
  season: number
  awardName: string
  team?: {
    id: number
    name: string
  }
  notes?: string
}

async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)

      // Check for rate limiting
      if (res.status === 429) {
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
          continue
        }
        console.error("Rate limited by MLB API after retries")
        return null
      }

      if (!res.ok) {
        console.error(`API error: ${res.status} ${res.statusText}`)
        return null
      }

      return res
    } catch (error) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
        continue
      }
      console.error("Network error:", error)
      return null
    }
  }
  return null
}

async function safeJsonParse(res: Response | null): Promise<any | null> {
  if (!res) return null
  try {
    const text = await res.text()
    if (text.startsWith("Too Many")) {
      console.error("Rate limited by MLB API")
      return null
    }
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const cacheKey = `search:${query}`
  const cached = getCached<Player[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/people/search?names=${encodeURIComponent(query)}&sportId=1&limit=10`)
    const data = await safeJsonParse(res)
    const result = data?.people || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error searching players:", error)
    return []
  }
}

export async function getPlayer(playerId: number): Promise<Player | null> {
  const cacheKey = `player:${playerId}`
  const cached = getCached<Player | null>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/people/${playerId}?hydrate=currentTeam,stats(group=[hitting,pitching],type=[yearByYear])`,
    )
    const data = await safeJsonParse(res)
    const result = data?.people?.[0] || null
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching player:", error)
    return null
  }
}

export async function getAllPlayers(season = getDefaultSeason()): Promise<Player[]> {
  const cacheKey = `all-players:${season}`
  const cached = getCached<Player[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/sports/1/players?season=${season}`)
    const data = await safeJsonParse(res)
    const result = data?.people || []
    setCache(cacheKey, result, CACHE_TTL_LONG)
    return result
  } catch (error) {
    console.error("Error fetching all players:", error)
    return []
  }
}

export async function getPlayerStats(playerId: number, season = getDefaultSeason()): Promise<PlayerStats[]> {
  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/people/${playerId}/stats?stats=season&season=${season}&group=hitting,pitching`,
    )
    const data = await safeJsonParse(res)
    return data?.stats?.[0]?.splits || []
  } catch (error) {
    console.error("Error fetching player stats:", error)
    return []
  }
}

export async function getTeams(season?: number): Promise<Team[]> {
  const cacheKey = `teams:${season || "current"}`
  const cached = getCached<Team[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/teams?sportId=1`)
    const data = await safeJsonParse(res)
    const result = data?.teams || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching teams:", error)
    return []
  }
}

export async function getStandings(season = getDefaultSeason()): Promise<Division[]> {
  const cacheKey = `standings:${season}`
  const cached = getCached<Division[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team(division)`,
    )
    const data = await safeJsonParse(res)
    const result = data?.records || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching standings:", error)
    return []
  }
}

export async function getLeaders(
  statType: "hitting" | "pitching",
  statCategory: string,
  season = getDefaultSeason(),
  limit = 10,
): Promise<any[]> {
  const cacheKey = `leaders:${statType}:${statCategory}:${season}:${limit}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/stats/leaders?leaderCategories=${statCategory}&season=${season}&sportId=1&limit=${limit}&statGroup=${statType}`,
    )
    const data = await safeJsonParse(res)
    const result = data?.leagueLeaders?.[0]?.leaders || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching leaders:", error)
    return []
  }
}

export async function getLeadersByLeague(
  statType: "hitting" | "pitching",
  statCategory: string,
  leagueId: 103 | 104, // 103 = AL, 104 = NL
  season = getDefaultSeason(),
  limit = 5,
): Promise<any[]> {
  const cacheKey = `leaders:${statType}:${statCategory}:${leagueId}:${season}:${limit}`
  const cached = getCached<any[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/stats/leaders?leaderCategories=${statCategory}&season=${season}&sportId=1&limit=${limit}&statGroup=${statType}&leagueId=${leagueId}`,
    )
    const data = await safeJsonParse(res)
    const result = data?.leagueLeaders?.[0]?.leaders || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching leaders by league:", error)
    return []
  }
}

export async function getTeam(teamId: number): Promise<Team | null> {
  const cacheKey = `team:${teamId}`
  const cached = getCached<Team | null>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/teams/${teamId}`)
    const data = await safeJsonParse(res)
    const result = data?.teams?.[0] || null
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching team:", error)
    return null
  }
}

export async function getTeamRoster(teamId: number, season = getDefaultSeason()): Promise<Player[]> {
  const cacheKey = `roster:${teamId}:${season}`
  const cached = getCached<Player[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/teams/${teamId}/roster?season=${season}`)
    const data = await safeJsonParse(res)
    const result = data?.roster?.map((r: any) => ({
      ...r.person,
      primaryNumber: r.jerseyNumber,
      primaryPosition: r.position,
      status: r.status,
    })) || []
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching roster:", error)
    return []
  }
}

export async function getTeamStats(teamId: number, season = getDefaultSeason()): Promise<any> {
  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/teams/${teamId}/stats?stats=season&season=${season}&group=hitting,pitching`,
    )
    const data = await safeJsonParse(res)
    return data?.stats || []
  } catch (error) {
    console.error("Error fetching team stats:", error)
    return []
  }
}

export async function getTeamHistory(
  teamId: number,
  startYear = 1960,
  endYear = getDefaultSeason(),
): Promise<TeamHistoricalRecord[]> {
  const cacheKey = `team-history-${teamId}-${startYear}-${endYear}`
  const cached = getCached<TeamHistoricalRecord[]>(cacheKey)
  if (cached) return cached

  const records: TeamHistoricalRecord[] = []
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  // Process in larger chunks (5 years) with shorter delay for faster loading
  for (let i = 0; i < years.length; i += 5) {
    const chunk = years.slice(i, i + 5)

    // Shorter delay between batches
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const results = await Promise.all(
      chunk.map(async (year) => {
        // Check if we have this year cached individually
        const yearCacheKey = `standings-${year}`
        let data = getCached<any>(yearCacheKey)

        if (!data) {
          try {
            const res = await fetchWithRetry(
              `${BASE_URL}/standings?leagueId=103,104&season=${year}&standingsTypes=regularSeason&hydrate=team`,
            )
            data = await safeJsonParse(res)
            if (data) {
              // Cache historical years for longer (they don't change)
              const ttl = year < new Date().getFullYear() ? CACHE_TTL_HISTORY : CACHE_TTL
              setCache(yearCacheKey, data, ttl)
            }
          } catch {
            return null
          }
        }

        if (!data) return null

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
      }),
    )
    records.push(...results.filter((r): r is TeamHistoricalRecord => r !== null))
  }

  const sorted = records.sort((a, b) => b.season - a.season)
  // Cache full team history for 7 days
  setCache(cacheKey, sorted, CACHE_TTL_HISTORY)
  return sorted
}

export async function getFranchiseHistory(teamId: number): Promise<{ allTeamIds: number[]; name: string }> {
  try {
    const res = await fetchWithRetry(`${BASE_URL}/teams/${teamId}?hydrate=previousScheduledTeams`)
    const data = await safeJsonParse(res)
    const team = data?.teams?.[0]

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

export async function getAwardWinners(awardId: string, season?: number): Promise<AwardWinner[]> {
  try {
    const url = season
      ? `${BASE_URL}/awards/${awardId}/recipients?season=${season}&sportId=1`
      : `${BASE_URL}/awards/${awardId}/recipients?sportId=1`

    const res = await fetchWithRetry(url)
    const data = await safeJsonParse(res)

    return (data?.awards || []).map((award: any) => ({
      id: award.id,
      playerId: award.player?.id,
      playerName: award.player?.nameFirstLast || award.player?.fullName,
      season: award.season ? Number.parseInt(award.season) : award.date ? new Date(award.date).getFullYear() : 0,
      awardName: award.name || awardId,
      team: award.team ? { id: award.team.id, name: award.team.name } : undefined,
      notes: award.notes,
    }))
  } catch (error) {
    console.error(`Error fetching ${awardId} winners:`, error)
    return []
  }
}

export async function getMVPWinners(season?: number): Promise<{ al: AwardWinner[]; nl: AwardWinner[] }> {
  try {
    // MLBMVP = AL MVP, NLMVP = NL MVP
    const [alMvp, nlMvp] = await Promise.all([getAwardWinners("MLBMVP", season), getAwardWinners("NLMVP", season)])

    return {
      al: alMvp.sort((a, b) => b.season - a.season),
      nl: nlMvp.sort((a, b) => b.season - a.season),
    }
  } catch (error) {
    console.error("Error fetching MVP winners:", error)
    return { al: [], nl: [] }
  }
}

export async function getCyYoungWinners(season?: number): Promise<{ al: AwardWinner[]; nl: AwardWinner[] }> {
  try {
    // MLBCY = AL Cy Young, NLCY = NL Cy Young
    const [alCy, nlCy] = await Promise.all([getAwardWinners("MLBCY", season), getAwardWinners("NLCY", season)])

    return {
      al: alCy.sort((a, b) => b.season - a.season),
      nl: nlCy.sort((a, b) => b.season - a.season),
    }
  } catch (error) {
    console.error("Error fetching Cy Young winners:", error)
    return { al: [], nl: [] }
  }
}

export async function getAllStarRosters(season?: number): Promise<{ al: AwardWinner[]; nl: AwardWinner[] }> {
  try {
    // ALAS = AL All-Star, NLAS = NL All-Star
    const [alStars, nlStars] = await Promise.all([getAwardWinners("ALAS", season), getAwardWinners("NLAS", season)])

    return {
      al: alStars.sort((a, b) => (a.team?.name || "").localeCompare(b.team?.name || "")),
      nl: nlStars.sort((a, b) => (a.team?.name || "").localeCompare(b.team?.name || "")),
    }
  } catch (error) {
    console.error("Error fetching All-Star rosters:", error)
    return { al: [], nl: [] }
  }
}

export interface AllStarAppearance {
  season: number
  league: "AL" | "NL"
  team?: {
    id: number
    name: string
  }
}

export async function getPlayerAllStarAppearances(playerId: number): Promise<AllStarAppearance[]> {
  const cacheKey = `allstar:${playerId}`
  const cached = getCached<AllStarAppearance[]>(cacheKey)
  if (cached) return cached

  try {
    // Fetch both AL and NL All-Star recipients
    const [alRes, nlRes] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/awards/ALAS/recipients?sportId=1`),
      fetchWithRetry(`${BASE_URL}/awards/NLAS/recipients?sportId=1`),
    ])

    const [alData, nlData] = await Promise.all([safeJsonParse(alRes), safeJsonParse(nlRes)])

    const appearances: AllStarAppearance[] = []

    // Filter AL All-Star appearances for this player
    for (const award of alData?.awards || []) {
      if (award.player?.id === playerId) {
        appearances.push({
          season: award.season ? Number.parseInt(award.season) : new Date(award.date).getFullYear(),
          league: "AL",
          team: award.team ? { id: award.team.id, name: award.team.name } : undefined,
        })
      }
    }

    // Filter NL All-Star appearances for this player
    for (const award of nlData?.awards || []) {
      if (award.player?.id === playerId) {
        appearances.push({
          season: award.season ? Number.parseInt(award.season) : new Date(award.date).getFullYear(),
          league: "NL",
          team: award.team ? { id: award.team.id, name: award.team.name } : undefined,
        })
      }
    }

    // Sort by season descending
    const sorted = appearances.sort((a, b) => b.season - a.season)
    setCache(cacheKey, sorted, CACHE_TTL_LONG)
    return sorted
  } catch (error) {
    console.error("Error fetching All-Star appearances:", error)
    return []
  }
}

export interface HallOfFamer {
  playerId: number
  playerName: string
  inductionYear: number
  position?: string
  team?: {
    id: number
    name: string
  }
}

export async function getHallOfFamers(): Promise<HallOfFamer[]> {
  const cacheKey = "hof:all"
  const cached = getCached<HallOfFamer[]>(cacheKey)
  if (cached) return cached

  try {
    const res = await fetchWithRetry(`${BASE_URL}/awards/MLBHOF/recipients?sportId=1`)
    const data = await safeJsonParse(res)

    const hofMembers: HallOfFamer[] = (data?.awards || []).map((award: any) => ({
      playerId: award.player?.id,
      playerName: award.player?.nameFirstLast || award.player?.fullName || "Unknown",
      inductionYear: award.season ? Number.parseInt(award.season) : award.date ? new Date(award.date).getFullYear() : 0,
      position: award.player?.primaryPosition?.abbreviation,
      team: award.team ? { id: award.team.id, name: award.team.name } : undefined,
    }))

    // Sort by induction year descending
    const sorted = hofMembers.sort((a, b) => b.inductionYear - a.inductionYear)
    setCache(cacheKey, sorted, CACHE_TTL_LONG)
    return sorted
  } catch (error) {
    console.error("Error fetching Hall of Famers:", error)
    return []
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

// Helper function to get the default season (2025 until April 2026)
export function getDefaultSeason(): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed, so March = 2, April = 3

  // Use 2025 until April 2026, then use current year
  if (year < 2026 || (year === 2026 && month < 3)) {
    return 2025
  }
  return year
}
