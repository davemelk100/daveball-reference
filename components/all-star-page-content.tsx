"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPlayerHeadshotUrl, type AwardWinner } from "@/lib/mlb-api"
import { SeasonSelector } from "@/components/season-selector"

interface AllStarPageContentProps {
    initialSeason: number
    rosters: {
        al: AwardWinner[]
        nl: AwardWinner[]
    }
}

export function AllStarPageContent({ initialSeason, rosters }: AllStarPageContentProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleSeasonChange = (season: number) => {
        startTransition(() => {
            router.push(`/all-star?season=${season}`)
        })
    }

    const RosterGrid = ({ players }: { players: AwardWinner[] }) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.length > 0 ? (
                players.map((player) => (
                    <Link key={`${player.playerId}-${player.id}`} href={`/players/${player.playerId}`}>
                        <Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={getPlayerHeadshotUrl(player.playerId, "small") || "/placeholder.svg"}
                                        alt={player.playerName}
                                        width={60}
                                        height={60}
                                        className="h-[60px] w-auto rounded-lg shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{player.playerName}</p>
                                        {player.team && <p className="text-sm text-muted-foreground">{player.team.name}</p>}
                                        {player.notes && <p className="text-xs text-muted-foreground italic mt-1">{player.notes}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                    No All-Star data available for this league/season.
                </div>
            )}
        </div>
    )

    return (
        <main className="container py-8">
            <div className="mb-8">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        All-Star Game Rosters
                    </h1>
                </div>
                <div>
                    <SeasonSelector season={initialSeason} onSeasonChange={handleSeasonChange} isLoading={isPending} startYear={1933} />
                </div>
            </div>

            <Tabs defaultValue="al" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="al">American League</TabsTrigger>
                    <TabsTrigger value="nl">National League</TabsTrigger>
                </TabsList>
                <TabsContent value="al">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>American League Roster</span>
                                <span className="text-sm font-normal text-muted-foreground">{rosters.al.length} Players</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RosterGrid players={rosters.al} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="nl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>National League Roster</span>
                                <span className="text-sm font-normal text-muted-foreground">{rosters.nl.length} Players</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RosterGrid players={rosters.nl} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
