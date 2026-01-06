"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from "recharts"
import type { Division } from "@/lib/mlb-api"

interface TeamScatterChartProps {
  standings: Division[]
}

export function TeamScatterChart({ standings }: TeamScatterChartProps) {
  const data = standings.flatMap((division) =>
    division.teamRecords?.map((record) => ({
      name: record.team?.abbreviation || record.team?.teamName,
      fullName: record.team?.name,
      runsScored: record.runsScored,
      runsAllowed: record.runsAllowed,
      wins: record.wins,
      winPct: Number.parseFloat(record.winningPercentage) || 0,
    })),
  )

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-base">Team Performance: Runs Scored vs Runs Allowed</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="runsScored"
              name="Runs Scored"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Runs Scored", position: "bottom", fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="runsAllowed"
              name="Runs Allowed"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Runs Allowed", angle: -90, position: "left", fill: "#9ca3af", fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="wins" range={[50, 200]} name="Wins" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [value, name]}
              labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.fullName || ""}
            />
            <Scatter name="Teams" data={data} fill="#ef4444">
              {data.map((entry, index) => {
                const winPct = entry?.winPct || 0
                return (
                  <circle
                    key={`dot-${index}`}
                    fill={winPct >= 0.5 ? "#22c55e" : "#ef4444"}
                    r={Math.max(6, (entry?.wins || 0) / 10)}
                  />
                )
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Above .500</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Below .500</span>
          </div>
          <span className="text-xs">(Dot size = Wins)</span>
        </div>
      </CardContent>
    </Card>
  )
}
