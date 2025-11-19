import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    role: "Videographer",
    branch: "Films",
    hoursToday: 8,
    hoursWeek: 32,
    targetWeek: 40,
    status: "active",
  },
  {
    id: 2,
    name: "Mike Johnson",
    initials: "MJ",
    role: "DJ",
    branch: "Music",
    hoursToday: 6,
    hoursWeek: 28,
    targetWeek: 40,
    status: "active",
  },
  {
    id: 3,
    name: "Emily Davis",
    initials: "ED",
    role: "Photographer",
    branch: "Studios",
    hoursToday: 0,
    hoursWeek: 24,
    targetWeek: 40,
    status: "inactive",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    initials: "AR",
    role: "A/V Technician",
    branch: "A/V",
    hoursToday: 7,
    hoursWeek: 35,
    targetWeek: 40,
    status: "active",
  },
]

export function TeamTimesheet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Timesheet</CardTitle>
        <CardDescription>Track your team's work hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="space-y-3">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{member.name}</p>
                    {member.status === "active" && <Badge className="bg-green-500 text-xs">Active</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.role} • {member.branch}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {member.hoursWeek}h / {member.targetWeek}h
                  </p>
                  <p className="text-xs text-muted-foreground">{member.hoursToday}h today</p>
                </div>
              </div>
              <Progress value={(member.hoursWeek / member.targetWeek) * 100} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
