"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, DollarSign, Mail, Trash2, X, Plus } from "lucide-react"
import { format } from "date-fns"
import { updateEvent, deleteEvent, updateEventAssignments } from "@/app/actions/event-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
    id: string
    role: string
    user: {
      id: string
      firstName: string
      lastName: string
    }
  }[]
}

interface EventDetailsDialogProps {
  event: EventWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventUpdate: () => void
  isAdmin: boolean
  users?: Array<{ id: string; firstName: string; lastName: string; jobTitle: string | null }>
}

function getServiceLabel(services: string[]) {
  const serviceMap: Record<string, string> = {
    TRIDENT_FILMS: 'Films',
    TRIDENT_MUSIC: 'Music',
    TRIDENT_STUDIOS: 'Studios',
    TRIDENT_PHOTOBOOTH: 'Photobooth',
    TRIDENT_AV: 'A/V',
  }
  return services.map(s => serviceMap[s] || s)
}

export function EventDetailsDialog({ 
  event, 
  open, 
  onOpenChange, 
  onEventUpdate, 
  isAdmin, 
  users = [] 
}: EventDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    eventName: event?.eventName || "",
    eventDate: event?.eventDate || new Date(),
    eventTime: event?.eventTime || "",
    venue: event?.venue || "",
    address: event?.address || "",
    city: event?.city || "",
    guestCount: event?.guestCount || 0,
    totalPrice: event?.totalPrice || 0,
    deposit: event?.deposit || 0,
  })

  const [assignments, setAssignments] = useState<Array<{ userId: string; role: string }>>([])

  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName,
        eventDate: event.eventDate,
        eventTime: event.eventTime || "",
        venue: event.venue || "",
        address: event.address || "",
        city: event.city || "",
        guestCount: event.guestCount || 0,
        totalPrice: event.totalPrice || 0,
        deposit: event.deposit || 0,
      })
      setAssignments(
        event.assignments.map(a => ({
          userId: a.user.id,
          role: a.role || "",
        }))
      )
      setIsEditing(false)
    }
  }, [event])

  if (!event) return null

  const handleSave = async () => {
    if (!event) return
    setIsSaving(true)

    // Update event details
    const eventResult = await updateEvent(event.id, {
      name: formData.eventName,
      date: new Date(formData.eventDate),
      startTime: formData.eventTime,
      location: formData.venue,
      address: formData.address,
      city: formData.city,
      guestCount: formData.guestCount,
      totalPrice: formData.totalPrice,
      deposit: formData.deposit,
    })

    // Update assignments
    const assignmentsResult = await updateEventAssignments(
      event.id,
      assignments.filter(a => a.userId && a.role) // Only save complete assignments
    )

    setIsSaving(false)

    if (eventResult.success && assignmentsResult.success) {
      setIsEditing(false)
      onOpenChange(false)
      router.refresh()
      toast.success("Event updated successfully")
    } else {
      toast.error("Failed to update event")
    }
  }

  const handleDelete = async () => {
    if (!event || !confirm("Are you sure you want to delete this event? This action cannot be undone.")) return
    setIsDeleting(true)

    const result = await deleteEvent(event.id)
    setIsDeleting(false)

    if (result.success) {
      onOpenChange(false)
      router.refresh()
      toast.success("Event deleted successfully")
    } else {
      toast.error("Failed to delete event")
    }
  }

  const services = getServiceLabel(event.services)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 z-50"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl pr-8">
            {isEditing ? (
              <Input
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="text-2xl font-bold h-auto py-2 bg-muted/50 border-muted-foreground/20"
              />
            ) : (
              event.eventName
            )}
          </DialogTitle>
          <div className="flex gap-2 flex-wrap pt-2">
            {services.map((service, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Information */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Event Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Date</span>
                </div>
                {isEditing ? (
                  <Input
                    type="date"
                    value={format(new Date(formData.eventDate), "yyyy-MM-dd")}
                    onChange={(e) => setFormData({ ...formData, eventDate: new Date(e.target.value) })}
                    className="bg-muted/50 border-muted-foreground/20"
                  />
                ) : (
                  <p className="text-base font-semibold">{format(new Date(event.eventDate), "MMMM d, yyyy")}</p>
                )}
              </div>

              {(event.eventTime || isEditing) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Time</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="bg-muted/50 border-muted-foreground/20"
                    />
                  ) : (
                    <p className="text-base font-semibold">{event.eventTime}</p>
                  )}
                </div>
              )}

              {(event.guestCount || isEditing) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>Guest Count</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                      className="bg-muted/50 border-muted-foreground/20"
                    />
                  ) : (
                    <p className="text-base font-semibold">{event.guestCount} guests</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {(event.venue || event.address || event.city || isEditing) && (
            <div>
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Location</h3>
              <div className="space-y-4">
                {(event.venue || isEditing) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Venue</span>
                    </div>
                    {isEditing ? (
                      <Input
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="bg-muted/50 border-muted-foreground/20"
                      />
                    ) : (
                      <p className="text-base font-semibold">{event.venue}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {(event.address || isEditing) && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      {isEditing ? (
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="bg-muted/50 border-muted-foreground/20"
                        />
                      ) : (
                        <p className="text-sm font-medium">{event.address}</p>
                      )}
                    </div>
                  )}

                  {(event.city || isEditing) && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">City</Label>
                      {isEditing ? (
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="bg-muted/50 border-muted-foreground/20"
                        />
                      ) : (
                        <p className="text-sm font-medium">{event.city}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Client Information */}
          {event.lead && (
            <div>
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Client Name</Label>
                  <p className="text-base font-semibold">{event.lead.clientName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </div>
                  <a
                    href={`mailto:${event.lead.clientEmail}`}
                    className="text-sm font-medium text-blue-500 hover:underline block truncate"
                  >
                    {event.lead.clientEmail}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Financial Details */}
          {(event.totalPrice !== null || event.deposit !== null || isEditing) && (
            <div>
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Financial Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {(event.totalPrice !== null || isEditing) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>Total Price</span>
                    </div>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) || 0 })}
                        className="bg-muted/50 border-muted-foreground/20"
                      />
                    ) : (
                      <p className="text-xl font-bold">${event.totalPrice?.toFixed(2) || '0.00'}</p>
                    )}
                  </div>
                )}

                {(event.deposit !== null || isEditing) && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Deposit</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) || 0 })}
                        className="bg-muted/50 border-muted-foreground/20"
                      />
                    ) : (
                      <p className="text-base font-semibold">${event.deposit?.toFixed(2) || '0.00'}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assigned Staff */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assigned Staff</h3>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignments([...assignments, { userId: "", role: "" }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No staff assigned. Click "Add Staff" to assign someone.
                  </p>
                ) : (
                  assignments.map((assignment, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Staff Member</Label>
                        <Select
                          value={assignment.userId}
                          onValueChange={(value) => {
                            const newAssignments = [...assignments]
                            newAssignments[idx].userId = value
                            setAssignments(newAssignments)
                          }}
                        >
                          <SelectTrigger className="bg-muted/50 border-muted-foreground/20">
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                                {user.jobTitle && ` - ${user.jobTitle}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Role</Label>
                        <Input
                          placeholder="e.g., DJ, Photographer"
                          value={assignment.role}
                          onChange={(e) => {
                            const newAssignments = [...assignments]
                            newAssignments[idx].role = e.target.value
                            setAssignments(newAssignments)
                          }}
                          className="bg-muted/50 border-muted-foreground/20"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newAssignments = assignments.filter((_, i) => i !== idx)
                          setAssignments(newAssignments)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {event.assignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No staff assigned</p>
                ) : (
                  event.assignments.map((assignment, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm font-medium">
                      {assignment.user.firstName} {assignment.user.lastName}
                      {assignment.role && ` - ${assignment.role}`}
                    </Badge>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 pt-4 border-t mt-6">
          {isAdmin && !isEditing && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          )}

          {!isAdmin && !isEditing && <div />}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      eventName: event.eventName,
                      eventDate: event.eventDate,
                      eventTime: event.eventTime || "",
                      venue: event.venue || "",
                      address: event.address || "",
                      city: event.city || "",
                      guestCount: event.guestCount || 0,
                      totalPrice: event.totalPrice || 0,
                      deposit: event.deposit || 0,
                    })
                    setAssignments(
                      event.assignments.map(a => ({
                        userId: a.user.id,
                        role: a.role || "",
                      }))
                    )
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                {isAdmin && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Event
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}