import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from 'lucide-react'
import { Event, EventAssignment, User } from "@prisma/client"

interface UpcomingEventsProps {
  events: (Event & { assignments: (EventAssignment & { user: User })[] })[]
}

const getServiceColor = (services: string[]) => {
  if (!services || services.length === 0) return 'bg-gray-500'
  const firstService = services[0].toLowerCase()
  
  const colors: Record<string, string> = {
    'videography': 'bg-blue-500',
    'films': 'bg-blue-500',
    'dj': 'bg-purple-500',
    'music': 'bg-purple-500',
    'photography': 'bg-pink-500',
    'studios': 'bg-pink-500',
    'photobooth': 'bg-orange-500',
    'av': 'bg-green-500',
    'audio': 'bg-green-500',
  }
  
  for (const [key, color] of Object.entries(colors)) {
    if (firstService.includes(key)) return color
  }
  
  return 'bg-gray-500'
}

const formatEventDate = (date: Date) => {
  const now = new Date()
  const eventDate = new Date(date)
  const isToday = eventDate.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString()

  const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  
  if (isToday) return `Today, ${time}`
  if (isTomorrow) return `Tomorrow, ${time}`
  return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your next scheduled events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className={`w-1 rounded-full ${getServiceColor(event.services)}`} />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">{event.name}</h4>
                  {event.services.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {event.services[0]}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  {event.assignments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{event.assignments.length} staff assigned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
