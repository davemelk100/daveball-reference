import { Suspense } from "react"
import { CompareContent } from "@/components/compare-content"
import { Header } from "@/components/header"

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<CompareLoading />}>
        <CompareContent />
      </Suspense>
    </div>
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
