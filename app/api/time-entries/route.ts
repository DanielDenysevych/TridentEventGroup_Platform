import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// Bulk delete entries
export async function DELETE(req: NextRequest) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return new NextResponse("Unauthorized", { status: 401 })

  const appUser = await db.user.findUnique({ where: { clerkId: clerkUserId } })
  if (!appUser) return new NextResponse("User not found", { status: 400 })

  const body = await req.json().catch(() => ({}))
  const ids = (body.ids as string[] | undefined) ?? []

  if (!ids.length) {
    return new NextResponse("No ids provided", { status: 400 })
  }

  // If you have roles, you could allow admins to delete any user's entries.
  // For now, only delete entries that belong to this user.
  await db.timeEntry.deleteMany({
    where: {
      id: { in: ids },
      userId: appUser.id,
    },
  })

  return NextResponse.json({ success: true })
}

// Update breakMinutes on a single entry (e.g. set/remove 1h break)
export async function PATCH(req: NextRequest) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return new NextResponse("Unauthorized", { status: 401 })

  const appUser = await db.user.findUnique({ where: { clerkId: clerkUserId } })
  if (!appUser) return new NextResponse("User not found", { status: 400 })

  const body = await req.json().catch(() => ({}))
  const entryId = body.id as string | undefined
  const breakMinutes = body.breakMinutes as number | undefined

  if (!entryId || breakMinutes == null) {
    return new NextResponse("id and breakMinutes are required", { status: 400 })
  }

  const entry = await db.timeEntry.update({
    where: {
      // ensure they own it
      id: entryId,
      userId: appUser.id,
    },
    data: { breakMinutes },
  })

  return NextResponse.json({ entry })
}
