"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Square } from "lucide-react"

export function TimeClockCard() {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00:00")

  const handleClockToggle = () => {
    setIsClockedIn(!isClockedIn)
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Clock In/Out</CardTitle>
          {isClockedIn ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
        </div>
        <CardDescription>Track your work hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <div className="text-4xl font-bold font-mono">{currentTime}</div>
          {isClockedIn && <p className="text-sm text-muted-foreground">Started at 9:00 AM</p>}
        </div>

        <Button onClick={handleClockToggle} className="w-full h-12" variant={isClockedIn ? "destructive" : "default"}>
          {isClockedIn ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Clock Out
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Clock In
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
