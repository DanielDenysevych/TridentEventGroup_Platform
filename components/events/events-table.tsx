"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { EventDetailsDialog } from "./event-details-dialog"

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
    id: string
    role: string
    user: {
      id: string
      firstName: string
      lastName: string
    }
  }[]
}

type SortField = 'eventName' | 'eventDate' | 'venue' | 'clientName'
type SortOrder = 'asc' | 'desc'

function getEventTypeClasses(services: string[]) {
  if (services.includes('TRIDENT_FILMS')) {
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }
  if (services.includes('TRIDENT_MUSIC')) {
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
  if (services.includes('TRIDENT_STUDIOS')) {
    return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }
  if (services.includes('TRIDENT_PHOTOBOOTH')) {
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }
  if (services.includes('TRIDENT_AV')) {
    return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

function getServiceLabel(services: string[]) {
  const serviceMap: Record<string, string> = {
    TRIDENT_FILMS: 'Films',
    TRIDENT_MUSIC: 'Music',
    TRIDENT_STUDIOS: 'Studios',
    TRIDENT_PHOTOBOOTH: 'Photobooth',
    TRIDENT_AV: 'A/V',
  }
  
  if (services.length === 0) return 'Event'
  if (services.length === 1) return serviceMap[services[0]] || services[0]
  return `${serviceMap[services[0]] || services[0]} +${services.length - 1}`
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'COMPLETED':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

function formatStatus(status: string) {
  switch (status) {
    case 'SCHEDULED':
      return 'Attend Event'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

export function EventsTable({
  events,
  isAdmin,
  users
}: {
  events: EventWithRelations[]
  isAdmin: boolean
  users: Array<{ id: string; firstName: string; lastName: string; jobTitle: string | null }>
}) {
  const [sortField, setSortField] = useState<SortField>('eventDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedEvent, setSelectedEvent] = useState<EventWithRelations | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Count notes/comments for each event
  const getNotesCount = (event: EventWithRelations) => {
    let count = 0
    if (event.notes) count++
    if (event.internalNotes) count++
    if (event.lead?.notes) count++
    return count
  }

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'eventName':
        comparison = a.eventName.localeCompare(b.eventName)
        break
      case 'eventDate':
        comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        break
      case 'venue':
        comparison = (a.venue || '').localeCompare(b.venue || '')
        break
      case 'clientName':
        comparison = (a.lead?.clientName || '').localeCompare(b.lead?.clientName || '')
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-3 w-3 inline ml-1" />
      : <ChevronDown className="h-3 w-3 inline ml-1" />
  }

  const handleViewDetails = (event: EventWithRelations) => {
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  const handleEventUpdate = () => {
    setIsDetailsOpen(false)
    setTimeout(() => {
      setIsDetailsOpen(true)
    }, 100)
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('eventName')}
                >
                  Event Name <SortIcon field="eventName" />
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('eventDate')}
                >
                  Event Date <SortIcon field="eventDate" />
                </th>
                <th className="px-4 py-3 text-left">Event Type</th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('clientName')}
                >
                  First Name <SortIcon field="clientName" />
                </th>
                <th className="px-4 py-3 text-left">Last Name</th>
                <th className="px-4 py-3 text-left">Event Stage</th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('venue')}
                >
                  Location | Venue <SortIcon field="venue" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No events found. Create your first event to get started.
                  </td>
                </tr>
              ) : (
                sortedEvents.map((event) => {
                  const notesCount = getNotesCount(event)
                  const clientName = event.lead?.clientName || ''
                  const nameParts = clientName.split(' ')
                  const firstName = nameParts[0] || ''
                  const lastName = nameParts.slice(1).join(' ') || ''

                  return (
                    <tr
                      key={event.id}
                      onClick={() => handleViewDetails(event)}
                      className="border-b last:border-b-0 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.eventName}</span>
                          {notesCount > 0 && (
                            <span className="flex items-center gap-0.5 text-muted-foreground">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span className="text-xs">{notesCount}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-middle whitespace-nowrap text-muted-foreground">
                        {format(new Date(event.eventDate), 'MMMM d, yyyy')}
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${getEventTypeClasses(event.services)}`}>
                          {getServiceLabel(event.services)}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle text-muted-foreground">
                        {firstName}
                      </td>

                      <td className="px-4 py-3 align-middle text-muted-foreground">
                        {lastName}
                      </td>

                      <td className="px-4 py-3 align-middle">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${getStatusClasses(event.status || 'SCHEDULED')}`}>
                          {formatStatus(event.status || 'SCHEDULED')}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-middle text-muted-foreground">
                        {event.venue}
                        {event.city && `, ${event.city}`}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EventDetailsDialog
        event={selectedEvent}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventUpdate={handleEventUpdate}
        isAdmin={isAdmin}
        users={users}
      />
    </>
  )
}