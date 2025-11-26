import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

function startOfToday() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

type ClockAction = "clock-in" | "clock-out"

export async function GET() {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Map Clerk user → local User record
    const appUser = await db.user.findUnique({
        where: { clerkId: clerkUserId },
    })

    if (!appUser) {
        return new NextResponse("User record not found for this account", {
            status: 400,
        })
    }

    const internalUserId = appUser.id

    // current open (un-clocked-out) entry for this user
    const openEntry = await db.timeEntry.findFirst({
        where: { userId: internalUserId, clockOut: null },
        orderBy: { clockIn: "desc" },
    })

    // calculate today's total (including an open entry up to "now")
    const todayStart = startOfToday()
    const now = new Date()

    const todaysEntries = await db.timeEntry.findMany({
        where: {
            userId: internalUserId,
            clockIn: { gte: todayStart },
        },
        orderBy: { clockIn: "asc" },
    })

    let totalMs = 0
    for (const entry of todaysEntries) {
        const end = entry.clockOut ?? now
        totalMs += end.getTime() - entry.clockIn.getTime()
    }

    const totalSecondsToday = Math.floor(totalMs / 1000)

    return NextResponse.json({
        isClockedIn: !!openEntry,
        openEntry,
        totalSecondsToday,
    })
}

export async function POST(req: NextRequest) {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Map Clerk user → local User record
    const appUser = await db.user.findUnique({
        where: { clerkId: clerkUserId },
    })

    if (!appUser) {
        return new NextResponse("User record not found for this account", {
            status: 400,
        })
    }

    const internalUserId = appUser.id

    const body = await req.json().catch(() => ({}))
    const action = body.action as ClockAction | undefined

    if (!action || !["clock-in", "clock-out"].includes(action)) {
        return new NextResponse("Invalid action", { status: 400 })
    }

    if (action === "clock-in") {
        // prevent double clock-in on any open entry
        const existingOpen = await db.timeEntry.findFirst({
            where: { userId: internalUserId, clockOut: null },
        })

        if (existingOpen) {
            return NextResponse.json(
                { message: "You are already clocked in", openEntry: existingOpen },
                { status: 400 },
            )
        }

        // 🔹 Enforce ONE entry per day per user
        const todayStart = startOfToday()
        const todayEntry = await db.timeEntry.findFirst({
            where: {
                userId: internalUserId,
                clockIn: { gte: todayStart },
            },
            orderBy: { clockIn: "asc" },
        })

        if (todayEntry) {
            // Reuse today's entry: restart it & clear previous clockOut / break
            const updated = await db.timeEntry.update({
                where: { id: todayEntry.id },
                data: {
                    clockIn: new Date(),
                    clockOut: null,
                    breakMinutes: todayEntry.breakMinutes ?? 0, // keep whatever break they set
                },
            })

            return NextResponse.json({ message: "Clocked in", entry: updated })
        }

        // No entry for today yet → create one
        const entry = await db.timeEntry.create({
            data: {
                userId: internalUserId,
                clockIn: new Date(),
                // eventId: null, etc.
            },
        })

        return NextResponse.json({ message: "Clocked in", entry })
    }


    if (action === "clock-out") {
        const openEntry = await db.timeEntry.findFirst({
            where: { userId: internalUserId, clockOut: null },
            orderBy: { clockIn: "desc" },
        })

        if (!openEntry) {
            return new NextResponse("No open time entry to clock out of", { status: 400 })
        }

        const now = new Date()
        const ms = now.getTime() - openEntry.clockIn.getTime()
        const hours = ms / (1000 * 60 * 60) // raw hours

        const updated = await db.timeEntry.update({
            where: { id: openEntry.id },
            data: {
                clockOut: now,
                totalHours: hours, // number → Decimal(5,2)
            },
        })

        return NextResponse.json({ message: "Clocked out", entry: updated })
    }

    return new NextResponse("Unhandled action", { status: 400 })
}
