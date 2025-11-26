import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { LeadStatus } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params
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

    // Get the current lead with its converted event
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: {
        convertedToEvent: true,
      },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Statuses that create/keep an event
    const eventStatuses: LeadStatus[] = ['ATTEND_EVENT', 'WON']
    
    // Check if we're reverting FROM an event status TO a non-event status
    const isRevertingFromEventStatus = eventStatuses.includes(lead.status) && !eventStatuses.includes(status)
    
    // If reverting and there's a converted event, delete it
    if (isRevertingFromEventStatus && lead.convertedToEventId) {
      await db.$transaction(async (tx) => {
        // First, delete any event assignments
        await tx.eventAssignment.deleteMany({
          where: { eventId: lead.convertedToEventId! },
        })

        // Delete any time entries associated with the event
        await tx.timeEntry.deleteMany({
          where: { eventId: lead.convertedToEventId! },
        })

        // Delete the event
        await tx.event.delete({
          where: { id: lead.convertedToEventId! },
        })

        // Update the lead - clear the event link and set new status
        await tx.lead.update({
          where: { id: leadId },
          data: {
            status,
            convertedToEventId: null,
          },
        })
      })

      // Revalidate both leads and events pages
      revalidatePath('/admin/leads')
      revalidatePath('/events')
      revalidatePath('/')

      return NextResponse.json({
        id: leadId,
        status,
        eventDeleted: true,
        message: 'Status reverted and event deleted',
      })
    }

    // If changing to ATTEND_EVENT or WON and lead hasn't been converted yet, create an event
    if (eventStatuses.includes(status) && !lead.convertedToEventId) {
      const result = await db.$transaction(async (tx) => {
        // Create the event with data from the lead
        const event = await tx.event.create({
          data: {
            name: lead.eventName,
            type: lead.eventType,
            date: lead.eventDate || new Date(),
            startTime: '18:00',
            endTime: '23:00',
            location: lead.eventLocation || 'TBA',
            clientName: lead.clientName,
            clientEmail: lead.clientEmail,
            clientPhone: lead.clientPhone,
            guestCount: lead.guestCount,
            services: [],
            notes: lead.notes,
            status: 'SCHEDULED',
            leadId: lead.id,
          },
        })

        // Update the lead with the new status and link to event
        const updatedLead = await tx.lead.update({
          where: { id: leadId },
          data: {
            status,
            convertedToEventId: event.id,
          },
        })

        return { lead: updatedLead, event }
      })

      // Revalidate both leads and events pages
      revalidatePath('/admin/leads')
      revalidatePath('/events')
      revalidatePath('/')

      return NextResponse.json({
        ...result.lead,
        eventCreated: true,
        eventId: result.event.id,
      })
    }

    // For all other status changes (including between event statuses), just update the status
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