import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, Users, BarChart, Edit, Copy, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const campaigns = [
  {
    id: 1,
    name: "Holiday Special Promotion",
    subject: "Save 20% on All Event Packages This Holiday Season!",
    status: "sent",
    sentDate: "Dec 1, 2024",
    recipients: 2458,
    opens: 1024,
    clicks: 456,
    openRate: 41.7,
    clickRate: 18.6,
  },
  {
    id: 2,
    name: "New Year Event Packages",
    subject: "Ring in the New Year with Trident Event Group",
    status: "scheduled",
    sendDate: "Dec 20, 2024",
    recipients: 3200,
    opens: 0,
    clicks: 0,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: 3,
    name: "Wedding Season Kickoff",
    subject: "Book Your 2025 Wedding with Exclusive Benefits",
    status: "draft",
    recipients: 0,
    opens: 0,
    clicks: 0,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: 4,
    name: "Corporate Events Newsletter",
    subject: "Elevate Your Corporate Events in 2025",
    status: "sent",
    sentDate: "Nov 15, 2024",
    recipients: 1856,
    opens: 892,
    clicks: 367,
    openRate: 48.1,
    clickRate: 19.8,
  },
]

const statusColors = {
  sent: "bg-green-500",
  scheduled: "bg-blue-500",
  draft: "bg-gray-500",
  active: "bg-purple-500",
}

export function CampaignsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>Manage your email marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4 hover:bg-accent/50 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{campaign.name}</h4>
                    <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{campaign.subject}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Recipients</p>
                  </div>
                </div>
                {campaign.status === "sent" ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{campaign.opens}</p>
                        <p className="text-xs text-muted-foreground">Opens</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{campaign.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{campaign.clickRate}%</p>
                        <p className="text-xs text-muted-foreground">Click Rate</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-3 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {campaign.status === "scheduled" ? `Scheduled for ${campaign.sendDate}` : "Not sent yet"}
                    </span>
                  </div>
                )}
              </div>

              {campaign.status === "sent" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium">{campaign.openRate}% open rate</span>
                  </div>
                  <Progress value={campaign.openRate} className="h-1.5" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
