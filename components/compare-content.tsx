"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PlayerSelector } from "@/components/player-selector"
import { ComparisonChart } from "@/components/comparison-chart"
import { StatComparisonRow } from "@/components/stat-comparison-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlayer, type Player } from "@/lib/mlb-api"
import { Loader2 } from "lucide-react"

export function CompareContent() {
  const searchParams = useSearchParams()
  const [player1, setPlayer1] = useState<Player | null>(null)
  const [player2, setPlayer2] = useState<Player | null>(null)
  const [player1Full, setPlayer1Full] = useState<Player | null>(null)
  const [player2Full, setPlayer2Full] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load player from URL params
  useEffect(() => {
    const player1Id = searchParams.get("player1")
    if (player1Id && !player1) {
      getPlayer(Number(player1Id)).then((p) => {
        if (p) setPlayer1(p)
      })
    }
  }, [searchParams, player1])

  // Fetch full player data when players are selected
  useEffect(() => {
    async function fetchFullData() {
      if (player1 && player2) {
        setIsLoading(true)
        const [p1Full, p2Full] = await Promise.all([getPlayer(player1.id), getPlayer(player2.id)])
        setPlayer1Full(p1Full)
        setPlayer2Full(p2Full)
        setIsLoading(false)
      } else {
        setPlayer1Full(null)
        setPlayer2Full(null)
      }
    }
    fetchFullData()
  }, [player1, player2])

  // Extract 2024 stats
  const getSeasonStats = (player: Player | null, season = "2024") => {
    if (!player?.stats) return { hitting: null, pitching: null }

    const hitting =
      player.stats.find((s: any) => s.group?.displayName === "hitting")?.splits?.find((s: any) => s.season === season)
        ?.stat || null

    const pitching =
      player.stats.find((s: any) => s.group?.displayName === "pitching")?.splits?.find((s: any) => s.season === season)
        ?.stat || null

    return { hitting, pitching }
  }

  const p1Stats = getSeasonStats(player1Full)
  const p2Stats = getSeasonStats(player2Full)

  const hasHittingStats = p1Stats.hitting || p2Stats.hitting
  const hasPitchingStats = p1Stats.pitching || p2Stats.pitching

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Player Comparison</h1>
        <p className="text-muted-foreground">Compare statistics between two MLB players</p>
      </div>

      {/* Player Selectors */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <PlayerSelector selectedPlayer={player1} onSelect={setPlayer1} label="Player 1" />
        <PlayerSelector selectedPlayer={player2} onSelect={setPlayer2} label="Player 2" />
      </div>

      {/* Comparison Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : player1Full && player2Full ? (
        <Tabs defaultValue={hasHittingStats ? "hitting" : "pitching"} className="space-y-6">
          <TabsList>
            {hasHittingStats && <TabsTrigger value="hitting">Batting</TabsTrigger>}
            {hasPitchingStats && <TabsTrigger value="pitching">Pitching</TabsTrigger>}
          </TabsList>

          {hasHittingStats && (
            <TabsContent value="hitting" className="space-y-6">
              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ComparisonChart
                  player1={{
                    name: player1Full.fullName.split(" ").pop() || player1Full.fullName,
                    stats: {
                      avg: Number.parseFloat(p1Stats.hitting?.avg || "0") * 1000,
                      hr: p1Stats.hitting?.homeRuns || 0,
                      rbi: p1Stats.hitting?.rbi || 0,
                      sb: p1Stats.hitting?.stolenBases || 0,
                      ops: Number.parseFloat(p1Stats.hitting?.ops || "0") * 1000,
                    },
                  }}
                  player2={{
                    name: player2Full.fullName.split(" ").pop() || player2Full.fullName,
                    stats: {
                      avg: Number.parseFloat(p2Stats.hitting?.avg || "0") * 1000,
                      hr: p2Stats.hitting?.homeRuns || 0,
                      rbi: p2Stats.hitting?.rbi || 0,
                      sb: p2Stats.hitting?.stolenBases || 0,
                      ops: Number.parseFloat(p2Stats.hitting?.ops || "0") * 1000,
                    },
                  }}
                  type="radar"
                  title="Overall Comparison"
                  statLabels={{
                    avg: "AVG",
                    hr: "HR",
                    rbi: "RBI",
                    sb: "SB",
                    ops: "OPS",
                  }}
                />

                <ComparisonChart
                  player1={{
                    name: player1Full.fullName.split(" ").pop() || player1Full.fullName,
                    stats: {
                      hr: p1Stats.hitting?.homeRuns || 0,
                      rbi: p1Stats.hitting?.rbi || 0,
                      hits: p1Stats.hitting?.hits || 0,
                      runs: p1Stats.hitting?.runs || 0,
                    },
                  }}
                  player2={{
                    name: player2Full.fullName.split(" ").pop() || player2Full.fullName,
                    stats: {
                      hr: p2Stats.hitting?.homeRuns || 0,
                      rbi: p2Stats.hitting?.rbi || 0,
                      hits: p2Stats.hitting?.hits || 0,
                      runs: p2Stats.hitting?.runs || 0,
                    },
                  }}
                  type="bar"
                  title="Counting Stats"
                  statLabels={{
                    hr: "Home Runs",
                    rbi: "RBI",
                    hits: "Hits",
                    runs: "Runs",
                  }}
                />
              </div>

              {/* Stat Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2024 Batting Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border mb-2">
                    <div className="text-right font-semibold text-primary">{player1Full.fullName}</div>
                    <div className="text-center text-sm text-muted-foreground">Stat</div>
                    <div className="text-left font-semibold text-blue-500">{player2Full.fullName}</div>
                  </div>
                  <StatComparisonRow
                    label="G"
                    value1={p1Stats.hitting?.gamesPlayed}
                    value2={p2Stats.hitting?.gamesPlayed}
                  />
                  <StatComparisonRow label="AB" value1={p1Stats.hitting?.atBats} value2={p2Stats.hitting?.atBats} />
                  <StatComparisonRow label="H" value1={p1Stats.hitting?.hits} value2={p2Stats.hitting?.hits} />
                  <StatComparisonRow label="HR" value1={p1Stats.hitting?.homeRuns} value2={p2Stats.hitting?.homeRuns} />
                  <StatComparisonRow label="RBI" value1={p1Stats.hitting?.rbi} value2={p2Stats.hitting?.rbi} />
                  <StatComparisonRow label="R" value1={p1Stats.hitting?.runs} value2={p2Stats.hitting?.runs} />
                  <StatComparisonRow
                    label="BB"
                    value1={p1Stats.hitting?.baseOnBalls}
                    value2={p2Stats.hitting?.baseOnBalls}
                  />
                  <StatComparisonRow
                    label="K"
                    value1={p1Stats.hitting?.strikeOuts}
                    value2={p2Stats.hitting?.strikeOuts}
                    higherIsBetter={false}
                  />
                  <StatComparisonRow
                    label="SB"
                    value1={p1Stats.hitting?.stolenBases}
                    value2={p2Stats.hitting?.stolenBases}
                  />
                  <StatComparisonRow label="AVG" value1={p1Stats.hitting?.avg} value2={p2Stats.hitting?.avg} />
                  <StatComparisonRow label="OBP" value1={p1Stats.hitting?.obp} value2={p2Stats.hitting?.obp} />
                  <StatComparisonRow label="SLG" value1={p1Stats.hitting?.slg} value2={p2Stats.hitting?.slg} />
                  <StatComparisonRow label="OPS" value1={p1Stats.hitting?.ops} value2={p2Stats.hitting?.ops} />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasPitchingStats && (
            <TabsContent value="pitching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2024 Pitching Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border mb-2">
                    <div className="text-right font-semibold text-primary">{player1Full.fullName}</div>
                    <div className="text-center text-sm text-muted-foreground">Stat</div>
                    <div className="text-left font-semibold text-blue-500">{player2Full.fullName}</div>
                  </div>
                  <StatComparisonRow label="W" value1={p1Stats.pitching?.wins} value2={p2Stats.pitching?.wins} />
                  <StatComparisonRow
                    label="L"
                    value1={p1Stats.pitching?.losses}
                    value2={p2Stats.pitching?.losses}
                    higherIsBetter={false}
                  />
                  <StatComparisonRow
                    label="ERA"
                    value1={p1Stats.pitching?.era}
                    value2={p2Stats.pitching?.era}
                    higherIsBetter={false}
                  />
                  <StatComparisonRow
                    label="G"
                    value1={p1Stats.pitching?.gamesPlayed}
                    value2={p2Stats.pitching?.gamesPlayed}
                  />
                  <StatComparisonRow
                    label="IP"
                    value1={p1Stats.pitching?.inningsPitched}
                    value2={p2Stats.pitching?.inningsPitched}
                  />
                  <StatComparisonRow
                    label="K"
                    value1={p1Stats.pitching?.strikeOuts}
                    value2={p2Stats.pitching?.strikeOuts}
                  />
                  <StatComparisonRow
                    label="BB"
                    value1={p1Stats.pitching?.baseOnBalls}
                    value2={p2Stats.pitching?.baseOnBalls}
                    higherIsBetter={false}
                  />
                  <StatComparisonRow label="SV" value1={p1Stats.pitching?.saves} value2={p2Stats.pitching?.saves} />
                  <StatComparisonRow
                    label="WHIP"
                    value1={p1Stats.pitching?.whip}
                    value2={p2Stats.pitching?.whip}
                    higherIsBetter={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Select two players above to compare their statistics</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
