import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// Monday as start of week
function startOfWeek(date: Date = new Date()) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = (day + 6) % 7
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function startOfDay(date: Date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export async function GET() {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Map Clerk user → User table
    const appUser = await db.user.findUnique({
        where: { clerkId: clerkUserId }
    })

    if (!appUser) {
        return new NextResponse("User not found", { status: 400 })
    }

    const internalUserId = appUser.id

    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    // WEEKLY SUMMARY
    const weekEntries = await db.timeEntry.findMany({
        where: {
            userId: internalUserId,
            clockIn: { gte: weekStart, lt: weekEnd }
        },
        orderBy: { clockIn: "asc" }
    })

    const msToHours = (ms: number) => ms / (1000 * 60 * 60)

    const days = [
        { key: 1, label: "Mon", hours: 0, target: 8 },
        { key: 2, label: "Tue", hours: 0, target: 8 },
        { key: 3, label: "Wed", hours: 0, target: 8 },
        { key: 4, label: "Thu", hours: 0, target: 8 },
        { key: 5, label: "Fri", hours: 0, target: 8 },
        { key: 6, label: "Sat", hours: 0, target: 0 },
        { key: 0, label: "Sun", hours: 0, target: 0 }
    ]

    for (const entry of weekEntries) {
        const start = new Date(entry.clockIn)
        const end = entry.clockOut ? new Date(entry.clockOut) : now

        let h = msToHours(end.getTime() - start.getTime())

        // Subtract unpaid break
        const breakMinutes = entry.breakMinutes ?? 0
        h -= breakMinutes / 60
        if (h < 0) h = 0

        const bucket = days.find((d) => d.key === start.getDay())
        if (bucket) bucket.hours += h
    }

    const totalHours = days.reduce((s, d) => s + d.hours, 0)
    const targetHours = days.reduce((s, d) => s + d.target, 0) || 1
    const progress = (totalHours / targetHours) * 100

    // RECENT ENTRIES
    const recentEntriesRaw = await db.timeEntry.findMany({
        where: { userId: internalUserId },
        orderBy: { clockIn: "desc" },
        take: 10,
        include: { event: true }
    })

    const todayStart = startOfDay(now)
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    function dateLabel(date: Date) {
        const d = startOfDay(date).getTime()
        if (d === todayStart.getTime()) return "Today"
        if (d === yesterdayStart.getTime()) return "Yesterday"
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric"
        })
    }

    function timeLabel(d: Date | null) {
        if (!d) return ""
        return d.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit"
        })
    }

    const recentEntries = recentEntriesRaw.map((entry) => {
        const ci = new Date(entry.clockIn)
        const co = entry.clockOut ? new Date(entry.clockOut) : null

        let hours = msToHours((co ?? now).getTime() - ci.getTime())

        // Subtract unpaid break
        const breakMinutes = entry.breakMinutes ?? 0
        hours -= breakMinutes / 60
        if (hours < 0) hours = 0

        const event = entry.event as any | null

        let project = "Work Session"
        if (event) {
            project =
                (event.name as string | undefined) ??
                (event.type && event.clientName
                    ? `${event.type} - ${event.clientName}`
                    : undefined) ??
                project
        }

        const branch: string | null = (event?.type as string | undefined) ?? null

        return {
            id: entry.id,
            dateLabel: dateLabel(ci),
            clockInLabel: timeLabel(ci),
            clockOutLabel: co ? timeLabel(co) : null,
            hours: Number(hours.toFixed(2)),
            project,
            branch,
            status: co ? "completed" : "active",
            hasOneHourBreak: breakMinutes >= 60,
        }
    })

    return NextResponse.json({
        week: {
            totalHours: Number(totalHours.toFixed(2)),
            targetHours,
            progress,
            days: days.map((d) => ({
                day: d.label,
                hours: Number(d.hours.toFixed(2)),
                target: d.target
            }))
        },
        recentEntries
    })
}
