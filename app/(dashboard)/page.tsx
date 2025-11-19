import { StatsCards } from "@/components/stats-cards"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingEvents } from "@/components/upcoming-events"
import { TeamActivity } from "@/components/team-activity"
import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName || 'there'

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome Back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your events today.</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <UpcomingEvents />
      </div>

      <TeamActivity />
    </main>
  )
}
