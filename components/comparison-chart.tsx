"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface ComparisonChartProps {
  player1: {
    name: string
    stats: Record<string, number>
  }
  player2: {
    name: string
    stats: Record<string, number>
  }
  type: "radar" | "bar"
  title: string
  statLabels: Record<string, string>
}

export function ComparisonChart({ player1, player2, type, title, statLabels }: ComparisonChartProps) {
  const chartColor1 = "#ef4444" // Red
  const chartColor2 = "#3b82f6" // Blue

  if (type === "radar") {
    const radarData = Object.keys(statLabels).map((key) => {
      // Normalize values to 0-100 scale for radar chart
      const maxVal = Math.max(player1.stats[key] || 0, player2.stats[key] || 0, 1)
      return {
        stat: statLabels[key],
        [player1.name]: ((player1.stats[key] || 0) / maxVal) * 100,
        [player2.name]: ((player2.stats[key] || 0) / maxVal) * 100,
        fullMark: 100,
      }
    })

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={player1.name}
                dataKey={player1.name}
                stroke={chartColor1}
                fill={chartColor1}
                fillOpacity={0.3}
              />
              <Radar
                name={player2.name}
                dataKey={player2.name}
                stroke={chartColor2}
                fill={chartColor2}
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  // Bar chart
  const barData = Object.keys(statLabels).map((key) => ({
    stat: statLabels[key],
    [player1.name]: player1.stats[key] || 0,
    [player2.name]: player2.stats[key] || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" tick={{ fill: "#9ca3af" }} />
            <YAxis dataKey="stat" type="category" tick={{ fill: "#9ca3af", fontSize: 12 }} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey={player1.name} fill={chartColor1} radius={[0, 4, 4, 0]} />
            <Bar dataKey={player2.name} fill={chartColor2} radius={[0, 4, 4, 0]} />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
