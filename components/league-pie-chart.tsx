"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

interface LeaguePieChartProps {
  alWins: number
  nlWins: number
}

export function LeaguePieChart({ alWins, nlWins }: LeaguePieChartProps) {
  const data = [
    { name: "American League", value: alWins, color: "#ef4444" },
    { name: "National League", value: nlWins, color: "#3b82f6" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">League Wins Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value} wins`, ""]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
