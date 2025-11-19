import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const upcomingEvents = [
  {
    id: 1,
    title: "Wedding - Smith & Johnson",
    date: "Today",
    time: "2:00 PM",
    location: "Grand Hotel Ballroom",
    client: "Emma Smith",
    branch: "Films",
    color: "bg-blue-500",
    attendees: 150,
  },
  {
    id: 2,
    title: "Corporate Gala",
    date: "Tomorrow",
    time: "6:00 PM",
    location: "Convention Center",
    client: "Tech Corp",
    branch: "A/V",
    color: "bg-green-500",
    attendees: 300,
  },
  {
    id: 3,
    title: "Birthday Party",
    date: "Dec 15",
    time: "4:00 PM",
    location: "Private Residence",
    client: "Sarah Anderson",
    branch: "Music",
    color: "bg-purple-500",
    attendees: 50,
  },
  {
    id: 4,
    title: "Photo Session",
    date: "Dec 17",
    time: "10:00 AM",
    location: "Downtown Studio",
    client: "John Martinez",
    branch: "Studios",
    color: "bg-pink-500",
    attendees: 5,
  },
]

export function EventsList() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Next scheduled events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                <p className="text-xs text-muted-foreground">{event.client}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {event.branch}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Details
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
