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
  hasOneHourBreak?: boolean
}

export function TimeEntries() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [updatingBreak, setUpdatingBreak] = useState<string | null>(null)
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    setDeleting(true)
    try {
      const res = await fetch("/api/time-entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      if (!res.ok) throw new Error("Failed to delete entries")

      setEntries((prev) => prev.filter((e) => !selectedIds.has(e.id)))
      clearSelection()
    } catch (e) {
      console.error(e)
      // (optional) toast here
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteSingle = async (id: string) => {
    await handleDeleteSelectedFromIds([id])
  }

  const handleDeleteSelectedFromIds = async (ids: string[]) => {
    if (!ids.length) return
    setDeleting(true)
    try {
      const res = await fetch("/api/time-entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error("Failed to delete entries")

      setEntries((prev) => prev.filter((e) => !ids.includes(e.id)))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  const toggleOneHourBreak = async (entry: RecentEntry) => {
    setUpdatingBreak(entry.id)
    try {
      const currentlyHasBreak = entry.hasOneHourBreak === true

      const newBreakMinutes = currentlyHasBreak ? 0 : 60

      const res = await fetch("/api/time-entries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, breakMinutes: newBreakMinutes }),
      })
      if (!res.ok) throw new Error("Failed to update break")

      // Recompute hours on client side just for immediate feedback.
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? {
              ...e,
              hours:
                e.hours + (currentlyHasBreak ? +1 : -1), // +1h back when removing break, -1h when adding
              hasOneHourBreak: !currentlyHasBreak,
            }
            : e,
        ),
      )
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingBreak(null)
    }
  }


  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>Your recent work sessions</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={deleting || selectedIds.size === 0}
          >
            Delete selected
          </Button>
        </div>
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
                {/* Left side: select + date/project/time */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(entry.id)}
                    onChange={() => toggleSelect(entry.id)}
                    className="mt-1 h-4 w-4 rounded border-muted-foreground/40 bg-background"
                  />

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{entry.dateLabel}</p>
                      {entry.branch && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          {entry.branch}
                        </Badge>
                      )}
                      {entry.hasOneHourBreak && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          1h break
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm font-medium leading-tight">{entry.project}</p>

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
                </div>

                {/* Right side: status + actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={entry.hasOneHourBreak ? "secondary" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleOneHourBreak(entry)}
                    disabled={updatingBreak === entry.id}
                  >
                    {entry.hasOneHourBreak ? "Remove 1h break" : "Add 1h break"}
                  </Button>

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
                    onClick={() => handleDeleteSingle(entry.id)}
                    disabled={deleting}
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
