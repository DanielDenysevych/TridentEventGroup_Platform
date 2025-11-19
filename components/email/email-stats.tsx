import { Card } from "@/components/ui/card"
import { Mail, Send, Eye, MousePointerClick } from "lucide-react"

const stats = [
  {
    title: "Total Sent",
    value: "12,458",
    change: "+8%",
    icon: Send,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Open Rate",
    value: "42.3%",
    change: "+12%",
    icon: Eye,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Click Rate",
    value: "18.5%",
    change: "+5%",
    icon: MousePointerClick,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2",
    icon: Mail,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
]

export function EmailStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-sm font-medium text-green-500">{stat.change}</span>
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
