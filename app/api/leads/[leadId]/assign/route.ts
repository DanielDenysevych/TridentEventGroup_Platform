import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params
    const body = await req.json()
    const { assignedToId } = body as { assignedToId?: string | null }

    if (assignedToId) {
      const user = await db.user.findUnique({
        where: { id: assignedToId },
        select: { role: true, isActive: true },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Cannot assign to inactive user' },
          { status: 400 }
        )
      }

      // Only allow assignment to SALES_LEAD
      if (user.role !== 'SALES_LEAD') {
        return NextResponse.json(
          { error: 'Can only assign leads to sales team members' },
          { status: 400 }
        )
      }
    }

    const updated = await db.lead.update({
      where: { id: leadId },
      data: { assignedToId: assignedToId || null },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error assigning lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}