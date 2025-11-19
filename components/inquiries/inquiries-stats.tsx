import { Card } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "New Inquiries",
    value: "23",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "In Progress",
    value: "18",
    change: "+5%",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Converted",
    value: "45",
    change: "+23%",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Potential Revenue",
    value: "$125K",
    change: "+18%",
    icon: DollarSign,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
]

export function InquiriesStats() {
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
