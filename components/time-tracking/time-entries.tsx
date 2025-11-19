import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, Trash2 } from "lucide-react"

const entries = [
  {
    id: 1,
    date: "Today",
    clockIn: "9:00 AM",
    clockOut: "5:30 PM",
    hours: 8.5,
    project: "Wedding - Smith & Johnson",
    branch: "Films",
    status: "completed",
  },
  {
    id: 2,
    date: "Yesterday",
    clockIn: "10:00 AM",
    clockOut: "6:00 PM",
    hours: 8,
    project: "Corporate Gala - Tech Corp",
    branch: "A/V",
    status: "completed",
  },
  {
    id: 3,
    date: "Dec 10",
    clockIn: "9:30 AM",
    clockOut: "5:00 PM",
    hours: 7.5,
    project: "Photo Session - Anderson",
    branch: "Studios",
    status: "completed",
  },
]

export function TimeEntries() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>Your recent work sessions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">{entry.date}</p>
                  <p className="text-xs text-muted-foreground">{entry.project}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {entry.clockIn} - {entry.clockOut}
                  </span>
                </div>
                <div>
                  <Badge variant="outline">{entry.branch}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{entry.hours}h</p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
