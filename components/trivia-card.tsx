"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getDailyTriviaQuestions, getNextTriviaTime, getTodayStorageKey, type TriviaQuestion } from "@/lib/trivia-data"
import { HelpCircle, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnsweredQuestion {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

function TriviaCardContent() {
  const [quizDate, setQuizDate] = useState<Date | null>(null)
  const [dailyQuestions, setDailyQuestions] = useState<TriviaQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
  const [timeUntilNext, setTimeUntilNext] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showYesterday, setShowYesterday] = useState(false)
  const [yesterdayQuestions, setYesterdayQuestions] = useState<TriviaQuestion[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const searchParams = useSearchParams()
  const openTrivia = searchParams.get("trivia")

  useEffect(() => {
    if (openTrivia === "open") {
      setIsOpen(true)
    }
  }, [openTrivia])

  useEffect(() => {
    // Set the quiz date once on mount to avoid issues if usage crosses midnight
    const now = new Date()
    setQuizDate(now)

    const questions = getDailyTriviaQuestions(now)
    setDailyQuestions(questions)

    // Fetch yesterday's questions
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    setYesterdayQuestions(getDailyTriviaQuestions(yesterday))

    const storageKey = getTodayStorageKey(now)
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
      const currentTime = new Date()
      const diff = next.getTime() - currentTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeUntilNext(`${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)
    return () => clearInterval(interval)
  }, [])

  const currentQuestion = showYesterday ? yesterdayQuestions[currentIndex] : dailyQuestions[currentIndex]
  const currentAnswered = answeredQuestions.find((a) => a.questionId === currentQuestion?.id)
  const totalAnswered = answeredQuestions.length
  const totalCorrect = answeredQuestions.filter((a) => a.isCorrect).length

  const handleAnswer = (index: number) => {
    if (showYesterday || currentAnswered || !currentQuestion) return

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

    const storageKey = getTodayStorageKey(quizDate!)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const goToNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleShare = async () => {
    const score = answeredQuestions.filter(a => a.isCorrect).length
    const date = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
    const text = `I got ${score}/5 on today's (${date}) Major League Numbers trivia! ⚾\n\nPlay here: https://majorleaguenumbers.com?trivia=open`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Major League Numbers Trivia',
          text: text,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        toast("Results copied to clipboard!")
      } catch (err) {
        console.error('Error copying to clipboard:', err)
      }
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!currentQuestion) return null

  const questionsToLink = showYesterday ? yesterdayQuestions : dailyQuestions

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
            <span className="text-xs text-muted-foreground">{currentIndex + 1} of 5</span>
            {!showYesterday && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                New in {timeUntilNext}
              </span>
            )}
          </div>

          <div className="flex justify-center gap-1.5">
            {questionsToLink.map((q, i) => {
              const answered = answeredQuestions.find((a) => a.questionId === q.id)
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentIndex && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                    showYesterday ? "bg-primary/40" : (
                      answered?.isCorrect ? "bg-green-500" :
                        answered && !answered.isCorrect ? "bg-red-500" :
                          "bg-muted-foreground/30"
                    )
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
                    (currentAnswered || showYesterday) && isCorrectAnswer && "border-green-500 bg-green-500/10",
                    !showYesterday && currentAnswered && isSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                    !currentAnswered && !showYesterday && "hover:bg-muted",
                  )}
                  onClick={() => handleAnswer(index)}
                  disabled={!!currentAnswered || showYesterday}
                >
                  <span className="flex items-center gap-2">
                    {((currentAnswered || showYesterday) && isCorrectAnswer) && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {(!showYesterday && currentAnswered && isSelected && !isCorrectAnswer) && <XCircle className="h-3 w-3 text-red-500" />}
                    {option}
                  </span>
                </Button>
              )
            })}
          </div>

          {(currentAnswered || showYesterday) && (
            <div
              className={cn(
                "p-2 rounded-lg text-xs",
                (currentAnswered?.isCorrect || showYesterday) ? "bg-green-500/10 text-green-400" : "bg-muted",
              )}
            >
              {!showYesterday && (
                currentAnswered?.isCorrect ? (
                  <p className="font-medium">Correct!</p>
                ) : (
                  <p className="font-medium text-red-400">Not quite!</p>
                )
              )}
              {showYesterday && <p className="font-medium text-green-400">Correct Answer:</p>}
              <p className="mt-1 text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={goToPrev} disabled={currentIndex === 0} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            <Button
              variant="link"
              size="sm"
              className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary p-0 h-auto"
              onClick={() => {
                setShowYesterday(!showYesterday)
                setCurrentIndex(0)
              }}
            >
              {showYesterday ? "Back to Today" : "Yesterday's Answers"}
            </Button>

            {currentIndex < 4 ? (
              <Button variant="ghost" size="sm" onClick={goToNext} className="gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (!showYesterday && isComplete) ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
              >
                Share
                <Share2 className="h-4 w-4" />
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

export function TriviaCard() {
  return (
    <Suspense fallback={<Button variant="outline" disabled className="gap-2 border-primary/20 bg-transparent"><HelpCircle className="h-4 w-4 text-primary" /> Loading Trivia...</Button>}>
      <TriviaCardContent />
    </Suspense>
  )
}
