"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, DollarSign, MoreVertical } from "lucide-react"

const columns = [
  { id: "new", title: "New", color: "border-blue-500" },
  { id: "contacted", title: "Contacted", color: "border-purple-500" },
  { id: "qualified", title: "Qualified", color: "border-cyan-500" },
  { id: "proposal", title: "Proposal Sent", color: "border-yellow-500" },
]

const inquiries = [
  {
    id: 1,
    status: "new",
    client: "Emma Thompson",
    email: "emma@email.com",
    phone: "(555) 123-4567",
    eventType: "Wedding",
    branch: "Films",
    date: "June 15, 2025",
    budget: "$15,000",
    priority: "high",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    status: "new",
    client: "Tech Innovations Inc",
    email: "events@techinno.com",
    phone: "(555) 987-6543",
    eventType: "Corporate Event",
    branch: "A/V",
    date: "March 20, 2025",
    budget: "$25,000",
    priority: "medium",
    createdAt: "5 hours ago",
  },
  {
    id: 3,
    status: "contacted",
    client: "Sarah Martinez",
    email: "sarah.m@email.com",
    phone: "(555) 456-7890",
    eventType: "Birthday Party",
    branch: "Music",
    date: "Feb 10, 2025",
    budget: "$5,000",
    priority: "medium",
    createdAt: "1 day ago",
  },
  {
    id: 4,
    status: "contacted",
    client: "James Wilson",
    email: "jwilson@email.com",
    phone: "(555) 234-5678",
    eventType: "Photo Session",
    branch: "Studios",
    date: "Jan 25, 2025",
    budget: "$2,500",
    priority: "low",
    createdAt: "1 day ago",
  },
  {
    id: 5,
    status: "qualified",
    client: "Anderson Family",
    email: "anderson@email.com",
    phone: "(555) 345-6789",
    eventType: "Anniversary",
    branch: "Photobooth",
    date: "April 5, 2025",
    budget: "$3,000",
    priority: "medium",
    createdAt: "3 days ago",
  },
  {
    id: 6,
    status: "proposal",
    client: "Global Corp",
    email: "events@globalcorp.com",
    phone: "(555) 567-8901",
    eventType: "Conference",
    branch: "A/V",
    date: "May 12, 2025",
    budget: "$50,000",
    priority: "high",
    createdAt: "5 days ago",
  },
]

export function InquiriesBoard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {columns.map((column) => {
        const columnInquiries = inquiries.filter((inq) => inq.status === column.id)

        return (
          <Card key={column.id} className={`border-t-4 ${column.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{column.title}</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {columnInquiries.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">{inquiry.client}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{inquiry.eventType}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {inquiry.branch}
                      </Badge>
                      {inquiry.priority === "high" && <Badge className="bg-red-500 text-xs">High Priority</Badge>}
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{inquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{inquiry.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">{inquiry.budget}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">{inquiry.createdAt}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
