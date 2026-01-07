"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getDailyTriviaQuestions, getNextTriviaTime, getTodayStorageKey, type TriviaQuestion } from "@/lib/trivia-data"
import { HelpCircle, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnsweredQuestion {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

export function TriviaCard() {
  const [dailyQuestions, setDailyQuestions] = useState<TriviaQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
  const [timeUntilNext, setTimeUntilNext] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const questions = getDailyTriviaQuestions()
    setDailyQuestions(questions)

    const storageKey = getTodayStorageKey()
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = JSON.parse(stored) as AnsweredQuestion[]
      setAnsweredQuestions(parsed)

      if (parsed.length >= 5) {
        setIsComplete(true)
      } else {
        const firstUnanswered = questions.findIndex((q) => !parsed.some((a) => a.questionId === q.id))
        if (firstUnanswered !== -1) {
          setCurrentIndex(firstUnanswered)
        }
      }
    }

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

  const currentQuestion = dailyQuestions[currentIndex]
  const currentAnswered = answeredQuestions.find((a) => a.questionId === currentQuestion?.id)
  const totalAnswered = answeredQuestions.length
  const totalCorrect = answeredQuestions.filter((a) => a.isCorrect).length

  const handleAnswer = (index: number) => {
    if (currentAnswered || !currentQuestion) return

    const isCorrect = index === currentQuestion.correctAnswer
    const newAnswered: AnsweredQuestion = {
      questionId: currentQuestion.id,
      selectedAnswer: index,
      isCorrect,
    }

    const updated = [...answeredQuestions, newAnswered]
    setAnsweredQuestions(updated)

    if (updated.length >= 5) {
      setIsComplete(true)
    }

    const storageKey = getTodayStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const goToNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!currentQuestion) return null

  const categoryColors: Record<string, string> = {
    history: "bg-amber-500/20 text-amber-400",
    records: "bg-blue-500/20 text-blue-400",
    players: "bg-green-500/20 text-green-400",
    teams: "bg-purple-500/20 text-purple-400",
    rules: "bg-red-500/20 text-red-400",
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/20 hover:text-black dark:hover:text-white bg-transparent">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>Daily Trivia</span>
          {totalAnswered > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {totalCorrect}/5
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={categoryColors[currentQuestion.category]}>
                {currentQuestion.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{currentIndex + 1} of 5</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              New in {timeUntilNext}
            </span>
          </div>

          <div className="flex justify-center gap-1.5">
            {dailyQuestions.slice(0, 5).map((q, i) => {
              const answered = answeredQuestions.find((a) => a.questionId === q.id)
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentIndex && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                    answered?.isCorrect && "bg-green-500",
                    answered && !answered.isCorrect && "bg-red-500",
                    !answered && "bg-muted-foreground/30",
                  )}
                />
              )
            })}
          </div>

          <p className="font-medium text-sm">{currentQuestion.question}</p>

          <div className="grid gap-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswered?.selectedAnswer === index
              const isCorrectAnswer = index === currentQuestion.correctAnswer

              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start h-auto py-2 px-3 text-left text-sm",
                    currentAnswered && isCorrectAnswer && "border-green-500 bg-green-500/10",
                    currentAnswered && isSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                    !currentAnswered && "hover:bg-muted",
                  )}
                  onClick={() => handleAnswer(index)}
                  disabled={!!currentAnswered}
                >
                  <span className="flex items-center gap-2">
                    {currentAnswered && isCorrectAnswer && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {currentAnswered && isSelected && !isCorrectAnswer && <XCircle className="h-3 w-3 text-red-500" />}
                    {option}
                  </span>
                </Button>
              )
            })}
          </div>

          {currentAnswered && (
            <div
              className={cn(
                "p-2 rounded-lg text-xs",
                currentAnswered.isCorrect ? "bg-green-500/10 text-green-400" : "bg-muted",
              )}
            >
              {currentAnswered.isCorrect ? (
                <p className="font-medium">Correct!</p>
              ) : (
                <p className="font-medium text-red-400">Not quite!</p>
              )}
              <p className="mt-1 text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={goToPrev} disabled={currentIndex === 0} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">{totalCorrect} of 5 correct</span>
            {currentIndex < 4 ? (
              <Button variant="ghost" size="sm" onClick={goToNext} className="gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : isComplete ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="gap-1 text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                Done
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <div className="w-[72px]" />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
