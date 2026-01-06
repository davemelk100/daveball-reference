import { Suspense } from "react"
import { CompareContent } from "@/components/compare-content"

export default function ComparePage() {
  return (
    <>
      <Suspense fallback={<CompareLoading />}>
        <CompareContent />
      </Suspense>
    </>
  )
}

function CompareLoading() {
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Player Comparison</h1>
        <p className="text-muted-foreground">Compare statistics between two MLB players</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="h-24 bg-card rounded-lg animate-pulse" />
        <div className="h-24 bg-card rounded-lg animate-pulse" />
      </div>
    </main>
  )
}
