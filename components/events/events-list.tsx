"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, isToday, isTomorrow, isFuture, isSameDay } from "date-fns"
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

function formatEventDate(date: Date) {
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  return format(date, "MMM d")
}

function getServiceName(services: string[]) {
  const serviceMap: Record<string, string> = {
    TRIDENT_FILMS: "Films",
    TRIDENT_MUSIC: "Music",
    TRIDENT_STUDIOS: "Studios",
    TRIDENT_PHOTOBOOTH: "Photobooth",
    TRIDENT_AV: "A/V",
  }
  return services.length > 0 ? serviceMap[services[0]] || "Event" : "Event"
}

export function EventsList({
  events,
  selectedDate
}: {
  events: EventWithRelations[]
  selectedDate?: Date | null
}) {
  const [selectedEvent, setSelectedEvent] = useState<EventWithRelations | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const displayEvents = selectedDate
    ? events.filter((e) => isSameDay(new Date(e.eventDate), selectedDate))
    : events
      .filter((e) => isFuture(new Date(e.eventDate)) || isToday(new Date(e.eventDate)))
      .slice(0, 4)

  const title = selectedDate
    ? `Events on ${format(selectedDate, "MMM d, yyyy")}`
    : "Upcoming Events"

  const description = selectedDate
    ? `${displayEvents.length} event${displayEvents.length !== 1 ? 's' : ''} scheduled`
    : "Next scheduled events"

  const handleViewDetails = (event: EventWithRelations) => {
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  const handleEventUpdate = () => {
    // Close and reopen the dialog to fetch fresh data
    setIsDetailsOpen(false)
    // Small delay to ensure the dialog closes before reopening
    setTimeout(() => {
      setIsDetailsOpen(true)
    }, 100)
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {selectedDate ? "No events scheduled for this day" : "No upcoming events scheduled"}
          </p>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleViewDetails(event)}
              className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm leading-tight">{event.eventName}</h4>
                  <p className="text-xs text-muted-foreground">{event.lead?.clientName || "No client"}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getServiceName(event.services)}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatEventDate(new Date(event.eventDate))}</span>
                </div>
                {event.eventTime && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.eventTime}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.venue}</span>
                  </div>
                )}
                {event.guestCount && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{event.guestCount} attendees</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent cursor-pointer"
              >
                View Details
              </Button>
            </div>
          ))
        )}
      </CardContent>
      <EventDetailsDialog
        event={selectedEvent}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventUpdate={handleEventUpdate}
      />
    </Card>
  )
}
