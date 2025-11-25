import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LeadStatus } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const { leadId } = params
    const body = await req.json()
    const { status } = body as { status?: LeadStatus }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = Object.values(LeadStatus)
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updated = await db.lead.update({
      where: { id: leadId },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating lead status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
