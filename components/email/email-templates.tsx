import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

const templates = [
  {
    id: 1,
    name: "Event Promotion",
    description: "Promote your upcoming events",
    uses: 24,
  },
  {
    id: 2,
    name: "Newsletter",
    description: "Monthly updates and news",
    uses: 18,
  },
  {
    id: 3,
    name: "Special Offer",
    description: "Limited time discounts",
    uses: 32,
  },
  {
    id: 4,
    name: "Follow-up",
    description: "Post-event thank you",
    uses: 15,
  },
]

export function EmailTemplates() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Quick-start email templates</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template) => (
          <Card key={template.id} className="p-3 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{template.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{template.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Used {template.uses} times</p>
              </div>
            </div>
          </Card>
        ))}
        <Button variant="outline" className="w-full bg-transparent">
          View All Templates
        </Button>
      </CardContent>
    </Card>
  )
}
