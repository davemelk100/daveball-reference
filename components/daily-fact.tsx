"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { getDailyFact } from "@/lib/facts-data"
import { Button } from "@/components/ui/button"

export function DailyFact() {
  const [fact, setFact] = useState<{ fact: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setFact(getDailyFact())
    const today = new Date().toISOString().split("T")[0]
    const dismissedDate = localStorage.getItem("mlb-fact-dismissed")
    if (dismissedDate === today) {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("mlb-fact-dismissed", today)
    setDismissed(true)
  }

  if (!fact || dismissed) return null

  return (
    <Card>
      <CardContent className="py-0.5 px-4 relative">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-base font-semibold">Did You Know?</span>
          <p className="text-sm text-muted-foreground basis-full">{fact.fact}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground absolute top-2 right-2"
            onClick={handleDismiss}
            aria-label="Dismiss fact"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
