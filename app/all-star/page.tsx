import type { Metadata } from "next"
import { getAllStarRosters, getDefaultSeason } from "@/lib/mlb-api"
import { AllStarPageContent } from "@/components/all-star-page-content"

export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
    title: "All-Star Game Rosters",
    description: "View MLB All-Star Game rosters by year.",
    alternates: {
        canonical: "/all-star",
    },
}

interface PageProps {
    searchParams: { season?: string }
}

export default async function AllStarPage({ searchParams }: PageProps) {
    const season = searchParams.season ? Number.parseInt(searchParams.season) : getDefaultSeason()
    const rosters = await getAllStarRosters(season)

    return <AllStarPageContent initialSeason={season} rosters={rosters} />
}
