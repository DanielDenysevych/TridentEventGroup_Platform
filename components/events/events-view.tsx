// components/events/events-view.tsx

"use client"

import { useState } from "react"
import { CalendarDays, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventsCalendar } from "./events-calendar"
import { EventsList } from "./events-list"
import { EventsTable } from "./events-table"

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
  notes?: string | null
  internalNotes?: string | null
  status?: string
  lead: {
    clientName: string
    clientEmail: string
    notes?: string | null
  } | null
  assignments: {
    user: {
      firstName: string
      lastName: string
    }
  }[]
}

type ViewMode = 'calendar' | 'table'

export function EventsView({ events, isAdmin }: { events: EventWithRelations[]; isAdmin: boolean }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center rounded-lg border bg-muted p-1">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
        </div>
        
        <span className="text-sm text-muted-foreground">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Views */}
      {viewMode === 'calendar' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventsCalendar events={events} onDateClick={setSelectedDate} />
          </div>
          <EventsList events={events} selectedDate={selectedDate} isAdmin={isAdmin} />
        </div>
      ) : (
        <EventsTable events={events} isAdmin={isAdmin} />
      )}
    </div>
  )
}