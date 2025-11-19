import { Card } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Clock } from "lucide-react"

const stats = [
  {
    title: "Events This Month",
    value: "24",
    change: "+12%",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Revenue",
    value: "$48,523",
    change: "+8%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Active Clients",
    value: "156",
    change: "+23%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Hours Logged",
    value: "342",
    change: "-5%",
    icon: Clock,
    trend: "down",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
