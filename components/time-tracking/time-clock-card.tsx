"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock as ClockIcon, Play, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TimeClockStatusResponse = {
  isClockedIn: boolean
  openEntry: {
    id: string
    clockIn: string
    clockOut: string | null
    totalHours: string | number | null
  } | null
  totalSecondsToday: number
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function formatTimeLabel(dateStr: string | null) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

export function TimeClockCard() {
  const { toast } = useToast()

  const [isClockedIn, setIsClockedIn] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [loading, setLoading] = useState(false)

  // 1) Load initial status from server
  useEffect(() => {
    let cancelled = false

    const loadStatus = async () => {
      try {
        const res = await fetch("/api/time-clock", { method: "GET" })
        if (!res.ok) return
        const data: TimeClockStatusResponse = await res.json()
        if (cancelled) return

        setIsClockedIn(data.isClockedIn)

        if (data.isClockedIn && data.openEntry) {
          const clockInDate = new Date(data.openEntry.clockIn)
          setStartTime(clockInDate)

          const now = Date.now()
          const initialElapsed = Math.floor((now - clockInDate.getTime()) / 1000)
          setElapsedSeconds(initialElapsed)
        } else {
          setStartTime(null)
          setElapsedSeconds(data.totalSecondsToday || 0)
        }
      } catch (error) {
        console.error("Failed to load time clock status", error)
      }
    }

    loadStatus()
    return () => {
      cancelled = true
    }
  }, [])

  // 2) Update timer every second while clocked in
  useEffect(() => {
    if (!isClockedIn || !startTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const diffSeconds = Math.floor((now - startTime.getTime()) / 1000)
      setElapsedSeconds(diffSeconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [isClockedIn, startTime])

  const handleClockToggle = async () => {
    if (loading) return
    setLoading(true)

    try {
      const action = isClockedIn ? "clock-out" : "clock-in"

      const res = await fetch("/api/time-clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          title: "Time tracking error",
          description: data?.message || "Something went wrong updating your time.",
          variant: "destructive",
        })
        return
      }

      if (action === "clock-in") {
        const clockIn = new Date(data.entry.clockIn)
        setIsClockedIn(true)
        setStartTime(clockIn)
        setElapsedSeconds(0)

        toast({
          title: "Clocked in",
          description: `Started at ${formatTimeLabel(clockIn.toISOString())}`,
        })
      } else {
        // clock-out
        setIsClockedIn(false)
        setStartTime(null)

        // Refresh today's total from server
        try {
          const statusRes = await fetch("/api/time-clock")
          if (statusRes.ok) {
            const statusData: TimeClockStatusResponse = await statusRes.json()
            setElapsedSeconds(statusData.totalSecondsToday || 0)
          }
        } catch {
          // ignore
        }

        let hoursNumber: number | null = null
        if (typeof data.entry.totalHours === "string") {
          hoursNumber = parseFloat(data.entry.totalHours)
        } else if (typeof data.entry.totalHours === "number") {
          hoursNumber = data.entry.totalHours
        }

        toast({
          title: "Clocked out",
          description:
            hoursNumber != null
              ? `You logged ${hoursNumber.toFixed(2)} hours.`
              : "Time entry saved.",
        })
      }
    } catch (error) {
      console.error("Clock toggle failed", error)
      toast({
        title: "Time tracking error",
        description: "We couldn’t update your clock right now. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startedAtLabel = startTime ? formatTimeLabel(startTime.toISOString()) : null

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Clock In/Out</CardTitle>
          {isClockedIn ? (
            <Badge className="bg-green-500">Active</Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          )}
        </div>
        <CardDescription>Track your work hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <ClockIcon className="h-12 w-12 text-primary" />
          </div>
          <div className="text-4xl font-bold font-mono">
            {formatDuration(Math.max(0, elapsedSeconds))}
          </div>
          {isClockedIn && startedAtLabel && (
            <p className="text-sm text-muted-foreground">Started at {startedAtLabel}</p>
          )}
        </div>

        <Button
          onClick={handleClockToggle}
          className="w-full h-12"
          variant={isClockedIn ? "destructive" : "default"}
          disabled={loading}
        >
          {isClockedIn ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              {loading ? "Clocking out..." : "Clock Out"}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {loading ? "Clocking in..." : "Clock In"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
