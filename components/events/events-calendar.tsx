"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from "date-fns"

type EventWithRelations = {
  id: string
  eventName: string
  eventDate: Date
  services: string[]
  lead: {
    clientName: string
  } | null
  assignments: {
    user: {
      firstName: string
      lastName: string
    }
  }[]
}

function getServiceColor(services: string[]) {
  if (services.includes("TRIDENT_FILMS")) return "bg-blue-500"
  if (services.includes("TRIDENT_MUSIC")) return "bg-purple-500"
  if (services.includes("TRIDENT_STUDIOS")) return "bg-pink-500"
  if (services.includes("TRIDENT_PHOTOBOOTH")) return "bg-cyan-500"
  if (services.includes("TRIDENT_AV")) return "bg-green-500"
  return "bg-gray-500"
}

export function EventsCalendar({
  events,
  onDateClick
}: {
  events: EventWithRelations[]
  onDateClick?: (date: Date) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => null)

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            <CardDescription>View and manage your event calendar</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
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
            {paddingDays.map((_, idx) => (
              <div key={`padding-${idx}`} className="min-h-24 p-2" />
            ))}

            {daysInMonth.map((date) => {
              const dayEvents = events.filter((e) => isSameDay(new Date(e.eventDate), date))
              const isDayToday = isToday(date)
              const isSelected = selectedDate && isSameDay(selectedDate, date)

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`min-h-24 p-2 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer ${isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
                    : isDayToday
                      ? "border-primary bg-primary/5"
                      : "border-border"
                    }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isSelected ? "text-primary font-bold" : isDayToday ? "text-primary" : "text-foreground"
                    }`}>
                    {format(date, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => {
                      const color = getServiceColor(event.services)
                      return (
                        <div key={event.id} className={`text-xs p-1 rounded ${color} bg-opacity-20 truncate`}>
                          <div className={`w-1 h-1 rounded-full ${color} inline-block mr-1`} />
                          {event.eventName}
                        </div>
                      )
                    })}
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
