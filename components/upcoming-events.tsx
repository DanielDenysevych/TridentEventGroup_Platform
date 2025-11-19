import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Wedding - Smith & Johnson",
    date: "Today, 2:00 PM",
    location: "Grand Hotel Ballroom",
    branch: "Films",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Corporate Gala - Tech Corp",
    date: "Tomorrow, 6:00 PM",
    location: "Convention Center",
    branch: "A/V",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Birthday Party - Anderson",
    date: "Dec 15, 4:00 PM",
    location: "Private Residence",
    branch: "Music",
    color: "bg-purple-500",
  },
]

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your next scheduled events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className={`w-1 rounded-full ${event.color}`} />
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {event.branch}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
