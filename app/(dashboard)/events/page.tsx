import { EventsHeader } from "@/components/events/events-header"
import { EventsCalendar } from "@/components/events/events-calendar"
import { EventsList } from "@/components/events/events-list"

export default function EventsPage() {
  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <EventsHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventsCalendar />
        </div>
        <EventsList />
      </div>
    </main>
  )
}
