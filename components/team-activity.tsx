import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Sarah Chen",
    initials: "SC",
    action: "clocked in",
    time: "5 minutes ago",
    status: "active",
  },
  {
    id: 2,
    user: "Mike Johnson",
    initials: "MJ",
    action: "updated event",
    detail: "Wedding - Smith & Johnson",
    time: "12 minutes ago",
    status: "neutral",
  },
  {
    id: 3,
    user: "Emily Davis",
    initials: "ED",
    action: "sent email campaign",
    detail: "Holiday Special Offer",
    time: "1 hour ago",
    status: "neutral",
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    initials: "AR",
    action: "added new client",
    detail: "Anderson Family",
    time: "2 hours ago",
    status: "neutral",
  },
  {
    id: 5,
    user: "Jennifer Lee",
    initials: "JL",
    action: "clocked out",
    time: "3 hours ago",
    status: "inactive",
  },
]

export function TeamActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
        <CardDescription>Recent actions by your team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                    {activity.detail && (
                      <>
                        {" "}
                        <span className="font-medium">{activity.detail}</span>
                      </>
                    )}
                  </p>
                  {activity.status === "active" && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
