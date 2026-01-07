import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"

interface Leader {
  value: string | number
  name: string
  league: "AL" | "NL"
  playerId?: number
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
          <div className="space-y-2">
            {leaders.map((leader, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {leader.playerId && (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={getPlayerHeadshotUrl(leader.playerId, "small")}
                      alt={leader.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{leader.value}</span>
                    <span className="text-muted-foreground font-medium">{leader.league}</span>
                  </div>
                  <span className="text-muted-foreground truncate block">{leader.name}</span>
                </div>
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
