"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getPlayerHeadshotUrl } from "@/lib/mlb-api"
import Image from "next/image"
import { type LucideIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: number; name: string } | null>(null)

  return (
    <>
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
                  {leader.playerId ? (
                    <Link href={`/players/${leader.playerId}`} className="flex items-center gap-3 w-full hover:bg-muted/50 rounded-lg transition-colors p-1 -m-1">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedPlayer({ id: leader.playerId!, name: leader.name })
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedPlayer({ id: leader.playerId!, name: leader.name })
                          }
                        }}
                        className="relative h-[75px] w-auto shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={getPlayerHeadshotUrl(leader.playerId, "small") || "/placeholder.svg"}
                          alt={leader.name}
                          width={75}
                          height={75}
                          style={{ width: 'auto', height: '75px' }}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground">{leader.value}</p>
                        <p className="text-muted-foreground truncate">{leader.name}</p>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0 text-center">
                        <p className="font-bold">{leader.value}</p>
                        <p className="text-muted-foreground truncate">{leader.name}</p>
                      </div>
                    </>
                  )}
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

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="relative bg-background p-6 rounded-lg shadow-lg max-w-sm w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full"
              onClick={() => setSelectedPlayer(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-muted">
                <Image
                  src={getPlayerHeadshotUrl(selectedPlayer.id, "large")}
                  alt={selectedPlayer.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold">{selectedPlayer.name}</h3>
              </div>

              <Link
                href={`/players/${selectedPlayer.id}`}
                onClick={() => setSelectedPlayer(null)}
                className="w-full"
              >
                <Button className="w-full">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
