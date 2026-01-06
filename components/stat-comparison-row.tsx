import { cn } from "@/lib/utils"

interface StatComparisonRowProps {
  label: string
  value1: string | number | null
  value2: string | number | null
  higherIsBetter?: boolean
}

export function StatComparisonRow({ label, value1, value2, higherIsBetter = true }: StatComparisonRowProps) {
  const num1 = typeof value1 === "number" ? value1 : Number.parseFloat(String(value1)) || 0
  const num2 = typeof value2 === "number" ? value2 : Number.parseFloat(String(value2)) || 0

  const winner = higherIsBetter ? (num1 > num2 ? 1 : num1 < num2 ? 2 : 0) : num1 < num2 ? 1 : num1 > num2 ? 2 : 0

  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0">
      <div
        className={cn("text-right font-mono", winner === 1 ? "text-green-500 font-semibold" : "text-muted-foreground")}
      >
        {value1 ?? "—"}
      </div>
      <div className="text-center text-sm font-medium">{label}</div>
      <div
        className={cn("text-left font-mono", winner === 2 ? "text-green-500 font-semibold" : "text-muted-foreground")}
      >
        {value2 ?? "—"}
      </div>
    </div>
  )
}
