"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Member = {
  userId: string
  name: string
  initials: string
  role: string
  hoursToday: number
  hoursWeek: number
  targetWeek: number
  isClockedIn: boolean
  lastClockIn: string | null
}

export function TeamTimesheet() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/time-clock/team")
        if (!res.ok) {
          throw new Error("Failed to load team timesheet")
        }
        const data = (await res.json()) as { members: Member[] }
        if (cancelled) return
        setMembers(data.members)
      } catch (err: any) {
        console.error(err)
        if (!cancelled) setError(err.message ?? "Failed to load team timesheet")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Team Timesheet</CardTitle>
        <CardDescription>See who’s working and how many hours they’ve logged.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading team data…</p>}
        {error && !loading && (
          <p className="text-sm text-destructive">Error: {error}</p>
        )}
        {!loading && !error && members.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No time entries yet. Once your team starts clocking in, you’ll see them here.
          </p>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="space-y-4">
            {members.map((member) => {
              const progress =
                member.targetWeek > 0
                  ? Math.min(100, (member.hoursWeek / member.targetWeek) * 100)
                  : 0

              return (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 px-4">
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-muted-foreground">This week</p>
                      <p className="font-medium">
                        {member.hoursWeek.toFixed(2)}h / {member.targetWeek}h
                      </p>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">
                      Today: {member.hoursToday.toFixed(2)}h
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      className={member.isClockedIn ? "bg-green-500" : "bg-muted text-foreground"}
                    >
                      {member.isClockedIn ? "Working now" : "Offline"}
                    </Badge>
                    {member.lastClockIn && (
                      <p className="text-xs text-muted-foreground">
                        Last clock-in:{" "}
                        {new Date(member.lastClockIn).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
