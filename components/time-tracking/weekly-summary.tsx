"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type WeekDay = {
  day: string
  hours: number
  target: number
}

type WeekSummary = {
  totalHours: number
  targetHours: number
  progress: number
  days: WeekDay[]
}

export function WeeklySummary() {
  const [week, setWeek] = useState<WeekSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/time-entries/me")
        if (!res.ok) throw new Error("Failed to load weekly summary")
        const data = await res.json()
        if (cancelled) return
        setWeek(data.week as WeekSummary)
      } catch {
        if (!cancelled) {
          // fallback to empty week
          setWeek({
            totalHours: 0,
            targetHours: 40,
            progress: 0,
            days: [
              { day: "Mon", hours: 0, target: 8 },
              { day: "Tue", hours: 0, target: 8 },
              { day: "Wed", hours: 0, target: 8 },
              { day: "Thu", hours: 0, target: 8 },
              { day: "Fri", hours: 0, target: 8 },
            ],
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const totalHours = week?.totalHours ?? 0
  const targetHours = week?.targetHours ?? 40
  const progress = week?.progress ?? 0
  const days = week?.days ?? []

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
        <CardDescription>Your hours this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top numbers */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-3xl font-bold">
              {loading ? "--" : totalHours.toFixed(0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-xl font-semibold">{targetHours}h</p>
            <p className="text-xs text-muted-foreground">
              {loading ? "" : `${Math.round(progress)}%`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            {!loading && <span>{Math.round(progress)}%</span>}
          </div>
          <Progress value={loading ? 0 : progress} className="h-2" />
        </div>

        {/* Per-day bars */}
        <div className="flex justify-between gap-4">
          {days.map((day) => (
            <div key={day.day} className="flex-1 space-y-2">
              <p className="text-xs text-muted-foreground text-center">{day.day}</p>
              <div className="h-24 w-full rounded-md bg-muted flex items-end justify-center overflow-hidden">
                <div
                  className={`w-full rounded-sm ${
                    day.hours >= day.target
                      ? "bg-primary"
                      : day.hours > 0
                      ? "bg-primary/70"
                      : "bg-muted-foreground/20"
                  }`}
                  style={{
                    height:
                      day.target > 0
                        ? `${Math.min(100, (day.hours / day.target) * 100)}%`
                        : "0%",
                  }}
                />
              </div>
              <p className="text-xs font-medium text-center">
                {day.hours.toFixed(1)}h
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
