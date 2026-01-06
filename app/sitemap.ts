import type { MetadataRoute } from "next"
import { getTeams } from "@/lib/mlb-api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mlb-universe.vercel.app"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/standings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // Dynamic team pages
  let teamPages: MetadataRoute.Sitemap = []
  try {
    const teams = await getTeams()
    teamPages = teams.map((team: { id: number }) => ({
      url: `${baseUrl}/teams/${team.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error("Error fetching teams for sitemap:", error)
  }

  return [...staticPages, ...teamPages]
}
