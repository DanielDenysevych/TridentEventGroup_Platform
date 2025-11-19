import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const weekData = [
  { day: "Mon", hours: 8, target: 8 },
  { day: "Tue", hours: 7.5, target: 8 },
  { day: "Wed", hours: 8.5, target: 8 },
  { day: "Thu", hours: 6, target: 8 },
  { day: "Fri", hours: 0, target: 8 },
]

export function WeeklySummary() {
  const totalHours = weekData.reduce((sum, day) => sum + day.hours, 0)
  const targetHours = weekData.reduce((sum, day) => sum + day.target, 0)
  const progress = (totalHours / targetHours) * 100

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
        <CardDescription>Your hours this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-4xl font-bold">{totalHours}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-2xl font-semibold">{targetHours}h</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekData.map((day) => (
            <div key={day.day} className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">{day.day}</p>
              <div
                className={`h-16 rounded-lg flex items-end justify-center p-2 ${
                  day.hours >= day.target ? "bg-primary/20" : day.hours > 0 ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <div
                  className={`w-full rounded-sm ${
                    day.hours >= day.target ? "bg-primary" : day.hours > 0 ? "bg-primary/50" : "bg-muted-foreground/20"
                  }`}
                  style={{ height: `${(day.hours / day.target) * 100}%` }}
                />
              </div>
              <p className="text-xs font-medium">{day.hours}h</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
