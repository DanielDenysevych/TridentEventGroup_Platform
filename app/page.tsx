import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatsCards } from "@/components/stats-cards"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingEvents } from "@/components/upcoming-events"
import { TeamActivity } from "@/components/team-activity"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome Back</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your events today.</p>
          </div>

          <StatsCards />

          <div className="grid gap-6 lg:grid-cols-2">
            <QuickActions />
            <UpcomingEvents />
          </div>

          <TeamActivity />
        </main>
      </div>
    </div>
  )
}
