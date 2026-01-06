import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Leader {
  value: string | number
  name: string
  league: "AL" | "NL"
}

interface StatCardProps {
  title: string
  value?: string | number
  description?: string
  leaders?: Leader[]
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, leaders, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("py-2 px-3", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-base font-semibold">{title}</span>
          {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
        </div>
        {leaders ? (
          <div className="space-y-1">
            {leaders.map((leader, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{leader.league}</span>
                <span className="text-sm font-bold">{leader.value}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">{leader.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="text-lg font-bold leading-tight">{value}</div>
            {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
          </>
        )}
        {trend && (
          <p className={cn("text-xs", trend.isPositive ? "text-green-500" : "text-red-500")}>
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last season
          </p>
        )}
      </CardContent>
    </Card>
  )
}
