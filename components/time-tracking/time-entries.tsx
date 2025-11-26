"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, Trash2 } from "lucide-react"

type RecentEntry = {
  id: string
  dateLabel: string
  clockInLabel: string
  clockOutLabel: string | null
  hours: number
  project: string
  branch: string | null
  status: string
}

export function TimeEntries() {
  const [entries, setEntries] = useState<RecentEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/time-entries/me")
        if (!res.ok) throw new Error("Failed to load time entries")
        const data = await res.json()
        if (cancelled) return
        setEntries(data.recentEntries as RecentEntry[])
      } catch {
        if (!cancelled) setEntries([])
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>Your recent work sessions</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading your recent entries…
          </p>
        )}

        {!loading && entries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No time entries yet. Once you clock in and out, your sessions will appear here.
          </p>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border bg-card/40 px-4 py-3 flex items-center justify-between"
              >
                {/* Left side: date, project, time */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{entry.dateLabel}</p>
                    {entry.branch && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0">
                        {entry.branch}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium leading-tight">
                    {entry.project}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {entry.clockInLabel}
                      {entry.clockOutLabel && ` – ${entry.clockOutLabel}`}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{entry.hours.toFixed(2)}h</span>
                  </div>
                </div>

                {/* Right side: status + icons */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={entry.status === "active" ? "default" : "outline"}
                    className={
                      entry.status === "active"
                        ? "bg-green-600 text-xs"
                        : "text-xs"
                    }
                  >
                    {entry.status === "active" ? "In progress" : "Completed"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
