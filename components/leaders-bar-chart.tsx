"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

interface Leader {
  rank: number
  person: {
    id: number
    fullName: string
  }
  value: string
}

interface LeadersBarChartProps {
  title: string
  leaders: Leader[]
  color?: string
}

export function LeadersBarChart({ title, leaders, color = "#ef4444" }: LeadersBarChartProps) {
  const data = leaders.slice(0, 10).map((leader) => ({
    name: leader.person.fullName.split(" ").pop(),
    fullName: leader.person.fullName,
    value: Number.parseFloat(leader.value) || 0,
    rank: leader.rank,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              width={70}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              itemStyle={{ color: "#ffffff" }}
              formatter={(value: number, name: string, props: any) => [value, props.payload.fullName]}
              labelFormatter={() => ""}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? color : `${color}99`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
