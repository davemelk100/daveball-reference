"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeamLogosProps {
  teamId: number
  teamName: string
}

const LOGO_VARIANTS = [
  { key: "primary", label: "Primary Logo", path: "" },
  { key: "cap-light", label: "Cap Logo (Light)", path: "team-cap-on-light/" },
  { key: "cap-dark", label: "Cap Logo (Dark)", path: "team-cap-on-dark/" },
  { key: "primary-light", label: "Primary (Light BG)", path: "team-primary-on-light/" },
  { key: "primary-dark", label: "Primary (Dark BG)", path: "team-primary-on-dark/" },
]

function getLogoUrl(teamId: number, path: string): string {
  return `https://www.mlbstatic.com/team-logos/${path}${teamId}.svg`
}

export function TeamLogos({ teamId, teamName }: TeamLogosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Logos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {LOGO_VARIANTS.map((variant) => (
            <div key={variant.key} className="flex flex-col items-center gap-2">
              <div
                className={`relative w-20 h-20 flex items-center justify-center rounded-lg p-2 ${
                  variant.key.includes("dark") ? "bg-zinc-800" : "bg-zinc-100"
                }`}
              >
                <Image
                  src={getLogoUrl(teamId, variant.path)}
                  alt={`${teamName} ${variant.label}`}
                  width={64}
                  height={64}
                  className="object-contain max-h-16 max-w-16"
                />
              </div>
              <span className="text-xs text-muted-foreground text-center">{variant.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
