import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getTeamLogoUrl, type Team } from "@/lib/mlb-api"

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={getTeamLogoUrl(team.id) || "/placeholder.svg"}
              alt={`${team.name} logo`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {team.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{team.division?.name || "Unknown Division"}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
