"use client"

import { useMemo, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeamHistoricalRecord } from "@/lib/mlb-api"

interface HistoricalChartProps {
  data: TeamHistoricalRecord[]
  teamName: string
}

type MetricType = "wins" | "winPct" | "runDiff"

export function HistoricalChart({ data, teamName }: HistoricalChartProps) {
  const [metric, setMetric] = useState<MetricType>("wins")

  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.season - b.season)
      .map((record) => ({
        season: record.season,
        wins: record.wins,
        losses: record.losses,
        winPct: Number.parseFloat(record.winningPercentage) * 100,
        runDiff: record.runDifferential,
      }))
  }, [data])

  const metricConfig = {
    wins: { label: "Wins", color: "hsl(var(--primary))", domain: [0, 120] as [number, number] },
    winPct: { label: "Win %", color: "hsl(142, 76%, 36%)", domain: [20, 80] as [number, number] },
    runDiff: { label: "Run Differential", color: "hsl(217, 91%, 60%)", domain: [-300, 300] as [number, number] },
  }

  const config = metricConfig[metric]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{teamName} Historical Performance</CardTitle>
        <div className="flex gap-2">
          {(["wins", "winPct", "runDiff"] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                metric === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {metricConfig[m].label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="season"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={config.domain}
              />
              {metric === "runDiff" && (
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: config.color }}
                formatter={(value: number) => [metric === "winPct" ? `${value.toFixed(1)}%` : value, config.label]}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: config.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
