"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, DollarSign, Phone, Mail } from "lucide-react"
import { format } from "date-fns"

type EventWithRelations = {
  id: string
  eventName: string
  eventDate: Date
  eventTime: string | null
  venue: string | null
  address: string | null
  city: string | null
  guestCount: number | null
  services: string[]
  totalPrice: number | null
  deposit: number | null
  lead: {
    clientName: string
    clientEmail: string
  } | null
  assignments: {
    user: {
      firstName: string
      lastName: string
    }
  }[]
}

interface EventDetailsDialogProps {
  event: EventWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!event) return null

  const handleSave = () => {
    // TODO: Implement save functionality with server action
    setIsEditing(false)
    console.log("Save event changes")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.eventName}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit event details" : "View event details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Event Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Name</Label>
                {isEditing ? (
                  <Input defaultValue={event.eventName} />
                ) : (
                  <p className="text-sm">{event.eventName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                {isEditing ? (
                  <Input type="date" defaultValue={format(new Date(event.eventDate), "yyyy-MM-dd")} />
                ) : (
                  <p className="text-sm">{format(new Date(event.eventDate), "MMM d, yyyy")}</p>
                )}
              </div>

              {event.eventTime && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  {isEditing ? (
                    <Input defaultValue={event.eventTime} />
                  ) : (
                    <p className="text-sm">{event.eventTime}</p>
                  )}
                </div>
              )}

              {event.guestCount && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Guest Count
                  </Label>
                  {isEditing ? (
                    <Input type="number" defaultValue={event.guestCount} />
                  ) : (
                    <p className="text-sm">{event.guestCount} guests</p>
                  )}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label>Services</Label>
              <div className="flex flex-wrap gap-2">
                {event.services.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service.replace("TRIDENT_", "").replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Location Information */}
          {(event.venue || event.address || event.city) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.venue && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Venue
                    </Label>
                    {isEditing ? (
                      <Input defaultValue={event.venue} />
                    ) : (
                      <p className="text-sm">{event.venue}</p>
                    )}
                  </div>
                )}

                {event.address && (
                  <div className="space-y-2">
                    <Label>Address</Label>
                    {isEditing ? (
                      <Input defaultValue={event.address} />
                    ) : (
                      <p className="text-sm">{event.address}</p>
                    )}
                  </div>
                )}

                {event.city && (
                  <div className="space-y-2">
                    <Label>City</Label>
                    {isEditing ? (
                      <Input defaultValue={event.city} />
                    ) : (
                      <p className="text-sm">{event.city}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Client Information */}
          {event.lead && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Client Name
                  </Label>
                  <p className="text-sm">{event.lead.clientName}</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm">{event.lead.clientEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Information */}
          {(event.totalPrice || event.deposit) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.totalPrice && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Price
                    </Label>
                    {isEditing ? (
                      <Input type="number" defaultValue={event.totalPrice} />
                    ) : (
                      <p className="text-sm">${event.totalPrice.toFixed(2)}</p>
                    )}
                  </div>
                )}

                {event.deposit && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Deposit
                    </Label>
                    {isEditing ? (
                      <Input type="number" defaultValue={event.deposit} />
                    ) : (
                      <p className="text-sm">${event.deposit.toFixed(2)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assigned Staff */}
          {event.assignments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assigned Staff</h3>
              <div className="flex flex-wrap gap-2">
                {event.assignments.map((assignment, idx) => (
                  <Badge key={idx} variant="outline">
                    {assignment.user.firstName} {assignment.user.lastName}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="cursor-pointer">
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
                Edit Event
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}