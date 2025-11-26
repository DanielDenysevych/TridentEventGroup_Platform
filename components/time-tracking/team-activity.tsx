"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

function formatAgo(dateStr: string | null) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / (1000 * 60))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function TeamActivity() {
  const [activeMembers, setActiveMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/time-clock/team")
        if (!res.ok) throw new Error("Failed to load team activity")
        const data = (await res.json()) as { members: Member[] }
        if (cancelled) return
        setActiveMembers(data.members.filter((m) => m.isClockedIn))
      } catch (e) {
        if (!cancelled) setActiveMembers([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // optional: refresh every 30s
    const interval = setInterval(load, 30_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
        <CardDescription>Who’s currently clocked in.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading activity…</p>}
        {!loading && activeMembers.length === 0 && (
          <p className="text-sm text-muted-foreground">No one is clocked in right now.</p>
        )}

        {!loading && activeMembers.length > 0 && (
          <div className="space-y-4">
            {activeMembers.map((m) => (
              <div key={m.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-green-500 text-xs">Active</Badge>
                  {m.lastClockIn && (
                    <p className="text-xs text-muted-foreground">
                      Clocked in {formatAgo(m.lastClockIn)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
