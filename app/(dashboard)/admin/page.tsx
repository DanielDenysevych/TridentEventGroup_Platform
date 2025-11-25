import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersIcon, CalendarIcon, ClockIcon, TrendingUpIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { UserManagementTable } from '@/components/admin/user-management-table'

export default async function AdminDashboard() {
  await requireAdmin() // Protect this route

  // Fetch admin-specific stats
  const [
    totalUsers,
    activeEmployees,
    pendingLeads,
    upcomingEvents,
    recentTimeEntries,
    totalRevenue
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isActive: true, role: 'EMPLOYEE' } }),
    db.lead.count({ where: { status: 'NEW' } }),
    db.event.count({
      where: {
        date: { gte: new Date() },
        status: 'SCHEDULED'
      }
    }),
    db.timeEntry.findMany({
      take: 5,
      orderBy: { clockIn: 'desc' },
      include: {
        user: true,
        event: true
      }
    }),
    db.event.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: { in: ['COMPLETED', 'SCHEDULED'] }
      }
    })
  ])

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          assignedEvents: true,
          timeEntries: true
        }
      }
    }
  })

  const revenueValue = totalRevenue._sum.totalPrice ? Number(totalRevenue._sum.totalPrice) : 0

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, view system stats, and control platform settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} active employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leads</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{pendingLeads}</div>
            <p className="text-xs text-muted-foreground mb-3">
              Require attention
            </p>

            <a
              href="/admin/leads"
              className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              View Leads
            </a>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed & scheduled events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={users} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTimeEntries.length === 0 ? (
            <p className="text-muted-foreground text-sm">No time entries yet</p>
          ) : (
            <div className="space-y-4">
              {recentTimeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">
                      {entry.user.firstName} {entry.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.event?.name || 'No event'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium flex items-center gap-1">
                      {entry.totalHours ? `${entry.totalHours}h` : 'Active'}
                      {entry.isApproved ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.clockIn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}