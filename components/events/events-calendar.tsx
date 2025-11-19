"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const events = [
  { date: 15, name: "Wedding - Smith", branch: "Films", color: "bg-blue-500" },
  { date: 17, name: "Corporate Event", branch: "A/V", color: "bg-green-500" },
  { date: 20, name: "Birthday Party", branch: "Music", color: "bg-purple-500" },
  { date: 22, name: "Photo Session", branch: "Studios", color: "bg-pink-500" },
  { date: 28, name: "Holiday Party", branch: "Photobooth", color: "bg-cyan-500" },
]

export function EventsCalendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>December 2024</CardTitle>
            <CardDescription>View and manage your event calendar</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((date) => {
              const dayEvents = events.filter((e) => e.date === date)
              const isToday = date === 12

              return (
                <div
                  key={date}
                  className={`min-h-24 p-2 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer ${
                    isToday ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                    {date}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event, idx) => (
                      <div key={idx} className={`text-xs p-1 rounded ${event.color} bg-opacity-20 truncate`}>
                        <div className={`w-1 h-1 rounded-full ${event.color} inline-block mr-1`} />
                        {event.name}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
