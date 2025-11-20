"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, DollarSign, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { updateEvent } from "@/app/actions/event-actions"
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
  onEventUpdate: () => void
}

export function EventDetailsDialog({ event, open, onOpenChange, onEventUpdate }: EventDetailsDialogProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    // Form state
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
        }
    }, [event])

    if (!event) return null

    const handleSave = async () => {
        if (!event) return

        setIsSaving(true)

        const result = await updateEvent(event.id, {
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

        setIsSaving(false)

        if (result.success) {
            setIsEditing(false)
            onOpenChange(false)
            router.refresh()
            toast.success("Event updated successfully")
        } else {
            toast.error("Failed to update event")
            console.error("Failed to update event")
        }
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
                                    <Input
                                        value={formData.eventName}
                                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-foreground">{event.eventName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={format(new Date(formData.eventDate), "yyyy-MM-dd")}
                                        onChange={(e) => setFormData({ ...formData, eventDate: new Date(e.target.value) })}
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-foreground">{format(new Date(event.eventDate), "MMM d, yyyy")}</p>
                                )}
                            </div>

                            {event.eventTime && (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Time
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.eventTime}
                                            onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-foreground">{event.eventTime}</p>
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
                                        <Input
                                            type="number"
                                            value={formData.guestCount}
                                            onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-foreground">{event.guestCount} guests</p>
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
                                            <Input
                                                value={formData.venue}
                                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">{event.venue}</p>
                                        )}
                                    </div>
                                )}

                                {event.address && (
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">{event.address}</p>
                                        )}
                                    </div>
                                )}

                                {event.city && (
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">{event.city}</p>
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
                                    <p className="text-sm font-medium text-foreground">{event.lead.clientName}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <p className="text-sm font-medium text-foreground">{event.lead.clientEmail}</p>
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
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.totalPrice}
                                                onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })}
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">${event.totalPrice.toFixed(2)}</p>
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
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.deposit}
                                                onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">${event.deposit.toFixed(2)}</p>
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
                            <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
                                {isSaving ? "Saving..." : "Save Changes"}
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