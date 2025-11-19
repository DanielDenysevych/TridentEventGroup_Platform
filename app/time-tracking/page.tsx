import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TimeClockCard } from "@/components/time-tracking/time-clock-card"
import { WeeklySummary } from "@/components/time-tracking/weekly-summary"
import { TimeEntries } from "@/components/time-tracking/time-entries"
import { TeamTimesheet } from "@/components/time-tracking/team-timesheet"

export default function TimeTrackingPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Time Tracking</h1>
            <p className="text-muted-foreground mt-1">Manage your work hours and view team timesheets.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <TimeClockCard />
            <WeeklySummary />
          </div>

          <TimeEntries />

          <TeamTimesheet />
        </main>
      </div>
    </div>
  )
}
