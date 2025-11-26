import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Monday as start of week
function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() // 0 (Sun) - 6 (Sat)
  const diff = (day + 6) % 7 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Map Clerk user → local User (same as in /api/time-clock)
  const currentUser = await db.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!currentUser) {
    return new NextResponse("User record not found", { status: 400 })
  }

  // You *could* restrict to ADMIN/MANAGER here if you want:
  // if (!["ADMIN", "MANAGER"].includes(currentUser.role)) {
  //   return new NextResponse("Forbidden", { status: 403 })
  // }

  const todayStart = startOfToday()
  const weekStart = startOfWeek()
  const now = new Date()

  // All active employees
  const users = await db.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      jobTitle: true,
    },
  })

  const userIds = users.map((u) => u.id)
  if (userIds.length === 0) {
    return NextResponse.json({ members: [] })
  }

  // All time entries for this week for those users
  const entries = await db.timeEntry.findMany({
    where: {
      userId: { in: userIds },
      clockIn: { gte: weekStart },
    },
    orderBy: { clockIn: "asc" },
  })

  type Acc = {
    hoursToday: number
    hoursWeek: number
    isClockedIn: boolean
    lastClockIn: Date | null
  }

  const msToHours = (ms: number) => ms / (1000 * 60 * 60)

  const aggregates = new Map<string, Acc>()

  for (const entry of entries) {
    const end = entry.clockOut ?? now
    const durationHours = msToHours(end.getTime() - entry.clockIn.getTime())

    const existing: Acc =
      aggregates.get(entry.userId) ?? {
        hoursToday: 0,
        hoursWeek: 0,
        isClockedIn: false,
        lastClockIn: null,
      }

    existing.hoursWeek += durationHours

    if (entry.clockIn >= todayStart) {
      existing.hoursToday += durationHours
    }

    if (!entry.clockOut) {
      existing.isClockedIn = true
      existing.lastClockIn = entry.clockIn
    } else if (!existing.lastClockIn || entry.clockIn > existing.lastClockIn) {
      // keep track of most recent clock-in for "last active" style info
      existing.lastClockIn = entry.clockIn
    }

    aggregates.set(entry.userId, existing)
  }

  const members = users.map((u) => {
    const agg = aggregates.get(u.id) ?? {
      hoursToday: 0,
      hoursWeek: 0,
      isClockedIn: false,
      lastClockIn: null,
    }

    const name = `${u.firstName} ${u.lastName}`
    const initials =
      (u.firstName?.[0] ?? "").toUpperCase() + (u.lastName?.[0] ?? "").toUpperCase()

    return {
      userId: u.id,
      name,
      initials,
      role: u.jobTitle || u.role,
      hoursToday: Number(agg.hoursToday.toFixed(2)),
      hoursWeek: Number(agg.hoursWeek.toFixed(2)),
      targetWeek: 40, // you can customize later (per contract, etc.)
      isClockedIn: agg.isClockedIn,
      lastClockIn: agg.lastClockIn,
    }
  })

  return NextResponse.json({ members })
}
