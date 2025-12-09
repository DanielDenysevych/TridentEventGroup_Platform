"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, DollarSign, Mail, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { updateEvent, deleteEvent } from "@/app/actions/event-actions"
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
    isAdmin: boolean
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

export function EventDetailsDialog({ event, open, onOpenChange, onEventUpdate, isAdmin }: EventDetailsDialogProps) {
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
            setIsEditing(false)
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
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
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
                        <h3 className="text-sm font-semibold mb-4">Event Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date</span>
                                </div>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={format(new Date(formData.eventDate), "yyyy-MM-dd")}
                                        onChange={(e) => setFormData({ ...formData, eventDate: new Date(e.target.value) })}
                                    />
                                ) : (
                                    <p className="font-medium">{format(new Date(event.eventDate), "MMMM d, yyyy")}</p>
                                )}
                            </div>

                            {(event.eventTime || isEditing) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Time</span>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="time"
                                            value={formData.eventTime}
                                            onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-medium">{event.eventTime}</p>
                                    )}
                                </div>
                            )}

                            {(event.guestCount || isEditing) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>Guest Count</span>
                                    </div>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.guestCount}
                                            onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                                        />
                                    ) : (
                                        <p className="font-medium">{event.guestCount} guests</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location */}
                    {(event.venue || event.address || event.city || isEditing) && (
                        <div>
                            <h3 className="text-sm font-semibold mb-4">Location</h3>
                            <div className="space-y-4">
                                {(event.venue || isEditing) && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>Venue</span>
                                        </div>
                                        {isEditing ? (
                                            <Input
                                                value={formData.venue}
                                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-medium">{event.venue}</p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {(event.address || isEditing) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm text-muted-foreground">Address</Label>
                                            {isEditing ? (
                                                <Input
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-sm">{event.address}</p>
                                            )}
                                        </div>
                                    )}

                                    {(event.city || isEditing) && (
                                        <div className="space-y-2">
                                            <Label className="text-sm text-muted-foreground">City</Label>
                                            {isEditing ? (
                                                <Input
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-sm">{event.city}</p>
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
                            <h3 className="text-sm font-semibold mb-4">Client Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Client Name</Label>
                                    <p className="font-medium">{event.lead.clientName}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>Email</span>
                                    </div>
                                    <a
                                        href={`mailto:${event.lead.clientEmail}`}
                                        className="text-sm text-blue-500 hover:underline block truncate"
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
                            <h3 className="text-sm font-semibold mb-4">Financial Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {(event.totalPrice !== null || isEditing) && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Total Price</span>
                                        </div>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.totalPrice}
                                                onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) || 0 })}
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold">${event.totalPrice?.toFixed(2) || '0.00'}</p>
                                        )}
                                    </div>
                                )}

                                {(event.deposit !== null || isEditing) && (
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Deposit</Label>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.deposit}
                                                onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) || 0 })}
                                            />
                                        ) : (
                                            <p className="font-medium">${event.deposit?.toFixed(2) || '0.00'}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Assigned Staff */}
                    {event.assignments.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold mb-4">Assigned Staff</h3>
                            <div className="flex flex-wrap gap-2">
                                {event.assignments.map((assignment, idx) => (
                                    <Badge key={idx} variant="secondary">
                                        {assignment.user.firstName} {assignment.user.lastName}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-2 pt-4 border-t mt-6">
                    {isAdmin && !isEditing && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="cursor-pointer"
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
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                                    Close
                                </Button>
                                {isAdmin && (
                                    <Button onClick={() => setIsEditing(true)} className="cursor-pointer">
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