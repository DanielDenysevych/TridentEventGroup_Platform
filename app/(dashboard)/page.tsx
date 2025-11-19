import { StatsCards } from "@/components/stats-cards"
import { QuickActions } from "@/components/quick-actions"
import { UpcomingEvents } from "@/components/upcoming-events"
import { TeamActivity } from "@/components/team-activity"
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName || 'there'

  const now = new Date()

  const [eventsCount, totalRevenue, activeClients, totalHours] = await Promise.all([
    db.event.count(),
    
    db.event.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: {
          in: ['SCHEDULED', 'COMPLETED']
        }
      }
    }),
    
    db.lead.count({
      where: {
        status: {
          in: ['CONTACTED', 'QUOTED', 'FOLLOW_UP']
        }
      }
    }),
    
    db.timeEntry.aggregate({
      _sum: {
        totalHours: true
      }
    })
  ])

  const upcomingEvents = await db.event.findMany({
    where: {
      date: {
        gte: now
      }
    },
    orderBy: {
      date: 'asc'
    },
    take: 3,
    include: {
      assignments: {
        include: {
          user: true
        }
      }
    }
  })

  const revenueValue = totalRevenue._sum.totalPrice ? Number(totalRevenue._sum.totalPrice) : 0
  const hoursValue = totalHours._sum.totalHours ? Number(totalHours._sum.totalHours) : 0

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome Back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your events today.</p>
      </div>

      <StatsCards 
        eventsCount={eventsCount}
        revenue={revenueValue}
        activeClients={activeClients}
        hoursLogged={hoursValue}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <TeamActivity />
    </main>
  )
}
