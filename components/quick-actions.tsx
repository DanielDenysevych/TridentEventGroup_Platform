import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Users, Mail } from "lucide-react"

const actions = [
  { label: "Clock In/Out", icon: Clock, variant: "default" as const },
  { label: "New Event", icon: Calendar, variant: "outline" as const },
  { label: "Add Client", icon: Users, variant: "outline" as const },
  { label: "Send Email", icon: Mail, variant: "outline" as const },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button key={action.label} variant={action.variant} className="h-20 flex-col gap-2">
            <action.icon className="h-5 w-5" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
