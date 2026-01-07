import type { Metadata } from "next"
import { getHallOfFamers } from "@/lib/mlb-api"
import { HofPageContent } from "@/components/hof-page-content"

export const revalidate = 86400 // 24 hours

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "Browse the complete list of MLB Hall of Fame inductees. View induction years, positions, teams, and voting details.",
  alternates: {
    canonical: "/hof",
  },
  openGraph: {
    title: "MLB Hall of Fame - Complete Inductee List",
    description: "Browse the complete list of MLB Hall of Fame inductees. View induction years, positions, teams, and voting details.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLB Hall of Fame",
    description: "Complete list of MLB Hall of Fame inductees with induction years and details.",
  },
}

export default async function HofPage() {
  const hofMembers = await getHallOfFamers()

  return <HofPageContent initialData={hofMembers} />
}
