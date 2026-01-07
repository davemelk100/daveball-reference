"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getDailyFact } from "@/lib/facts-data"
import { Lightbulb } from "lucide-react"

export function DailyFact() {
  const [fact, setFact] = useState<{ fact: string } | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setFact(getDailyFact())
  }, [])

  if (!fact) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 bg-transparent">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span>Did You Know?</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="font-semibold">Did You Know?</span>
          </div>
          <p className="text-sm text-muted-foreground">{fact.fact}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
