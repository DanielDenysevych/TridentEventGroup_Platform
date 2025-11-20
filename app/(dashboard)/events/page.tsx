import { EventsHeader } from "@/components/events/events-header"
import { EventsCalendar } from "@/components/events/events-calendar"
import { EventsList } from "@/components/events/events-list"
import { db } from "@/lib/db"

export default async function EventsPage() {
  const users = await db.user.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      jobTitle: true,
    },
    orderBy: {
      firstName: "asc",
    },
  })

  const eventsRaw = await db.event.findMany({
    include: {
      lead: {
        select: {
          clientName: true,
          clientEmail: true,
        },
      },
      assignments: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const events = eventsRaw.map((event) => ({
    ...event,
    eventName: event.name,
    eventDate: event.date,
    eventTime: event.startTime,
    venue: event.location,
    totalPrice: event.totalPrice ? Number(event.totalPrice) : null,
    deposit: event.deposit ? Number(event.deposit) : null,
  }))

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <EventsHeader users={users} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventsCalendar events={events} />
        </div>
        <EventsList events={events} />
      </div>
    </main>
  )
}
