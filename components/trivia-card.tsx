"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getTriviaForTimePeriod, getNextTriviaTime, type TriviaQuestion } from "@/lib/trivia-data"
import { HelpCircle, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function TriviaCard() {
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeUntilNext, setTimeUntilNext] = useState("")

  useEffect(() => {
    setTrivia(getTriviaForTimePeriod())

    const updateCountdown = () => {
      const next = getNextTriviaTime()
      const now = new Date()
      const diff = next.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeUntilNext(`${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === trivia?.correctAnswer

  if (!trivia) return null

  const categoryColors: Record<string, string> = {
    history: "bg-amber-500/20 text-amber-400",
    records: "bg-blue-500/20 text-blue-400",
    players: "bg-green-500/20 text-green-400",
    teams: "bg-purple-500/20 text-purple-400",
    rules: "bg-red-500/20 text-red-400",
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 bg-transparent">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>Daily Trivia</span>
          {showResult &&
            (isCorrect ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={categoryColors[trivia.category]}>
              {trivia.category}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Next in {timeUntilNext}
            </span>
          </div>

          {/* Question */}
          <p className="font-medium text-sm">{trivia.question}</p>

          {/* Options */}
          <div className="grid gap-2">
            {trivia.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === trivia.correctAnswer

              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start h-auto py-2 px-3 text-left text-sm",
                    showResult && isCorrectAnswer && "border-green-500 bg-green-500/10",
                    showResult && isSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                    !showResult && "hover:bg-muted",
                  )}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                >
                  <span className="flex items-center gap-2">
                    {showResult && isCorrectAnswer && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {showResult && isSelected && !isCorrectAnswer && <XCircle className="h-3 w-3 text-red-500" />}
                    {option}
                  </span>
                </Button>
              )
            })}
          </div>

          {/* Result */}
          {showResult && (
            <div className={cn("p-2 rounded-lg text-xs", isCorrect ? "bg-green-500/10 text-green-400" : "bg-muted")}>
              {isCorrect ? (
                <p className="font-medium">Correct!</p>
              ) : (
                <p className="font-medium text-red-400">Not quite!</p>
              )}
              <p className="mt-1 text-muted-foreground">{trivia.explanation}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
