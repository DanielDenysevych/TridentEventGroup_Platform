"use client"

import { useState } from "react"
import { EventsCalendar } from "./events-calendar"
import { EventsList } from "./events-list"

type EventWithRelations = {
  id: string
  eventName: string
  eventDate: Date
  eventTime: string | null
  venue: string | null
  address: string | null
  city: string | null
  guestCount: number | null
  services: string[]
  totalPrice: number | null
  deposit: number | null
  lead: {
    clientName: string
    clientEmail: string
  } | null
  assignments: {
    user: {
      firstName: string
      lastName: string
    }
  }[]
}

export function EventsView({ events, isAdmin }: { events: EventWithRelations[]; isAdmin: boolean }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <EventsCalendar events={events} onDateClick={setSelectedDate} />
      </div>
      <EventsList events={events} selectedDate={selectedDate} isAdmin={isAdmin} />
    </div>
  )
}