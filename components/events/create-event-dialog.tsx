"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { createEvent } from "@/app/actions/event-actions"
import { toast } from "sonner"

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: Array<{ id: string; firstName: string; lastName: string; jobTitle: string | null }>
}

export function CreateEventDialog({ open, onOpenChange, users }: CreateEventDialogProps) {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Array<{ userId: string; role: string }>>([])

  const services = [
    { id: "films", label: "Trident Films" },
    { id: "music", label: "Trident Music" },
    { id: "studios", label: "Trident Studios" },
    { id: "photobooth", label: "Trident Photobooth" },
    { id: "av", label: "Trident A/V" },
  ]

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleAddStaff = (userId: string, role: string) => {
    if (!userId || !role) return
    setSelectedStaff(prev => [...prev, { userId, role }])
  }

  const handleRemoveStaff = (index: number) => {
    setSelectedStaff(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    // Add date and services to formData
    if (date) {
      formData.set("date", date.toISOString())
    }
    formData.set("services", JSON.stringify(selectedServices))
    formData.set("assignments", JSON.stringify(selectedStaff))

    try {
      const result = await createEvent(formData)
      
      if (result.success) {
        toast.success("Event created successfully!")
        onOpenChange(false)
        // Reset form
        e.currentTarget.reset()
        setDate(undefined)
        setSelectedServices([])
        setSelectedStaff([])
      } else {
        toast.error(result.error || "Failed to create event")
      }
    } catch (error) {
      toast.error("An error occurred while creating the event")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Event</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new event to your calendar. Fill in all required information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Event Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Event Name *</Label>
                <Input id="name" name="name" placeholder="Smith Wedding Reception" required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Event Type *</Label>
                <Select name="type" required>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Corporate">Corporate Event</SelectItem>
                    <SelectItem value="Birthday">Birthday Party</SelectItem>
                    <SelectItem value="Social">Social Event</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-white">Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {date ? format(date, "MM/dd/yyyy") : <span className="text-slate-500">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar mode="single" selected={date} onSelect={setDate} required className="bg-slate-800 text-white" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-white">Start Time *</Label>
                <Input id="startTime" name="startTime" type="time" required className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-white">End Time *</Label>
                <Input id="endTime" name="endTime" type="time" required className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Venue/Location *</Label>
              <Input id="location" name="location" placeholder="Grand Hotel Ballroom" required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input id="address" name="address" placeholder="123 Main Street" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white">City</Label>
                <Input id="city" name="city" placeholder="Los Angeles" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCount" className="text-white">Expected Guest Count</Label>
              <Input id="guestCount" name="guestCount" type="number" placeholder="150" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Client Information</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-white">Client Name *</Label>
                <Input id="clientName" name="clientName" placeholder="John Smith" required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-white">Email *</Label>
                <Input id="clientEmail" name="clientEmail" type="email" placeholder="john@example.com" required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-white">Phone *</Label>
                <Input id="clientPhone" name="clientPhone" type="tel" placeholder="(555) 123-4567" required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Services Required *</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                    className="border-slate-600"
                  />
                  <Label htmlFor={service.id} className="font-normal cursor-pointer text-white">
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Assignments */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Staff Assignments</h3>
            <div className="space-y-3">
              {selectedStaff.map((staff, index) => {
                const user = users.find(u => u.id === staff.userId)
                return (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-800 rounded-md border border-slate-700">
                    <span className="flex-1 text-sm text-white">
                      {user?.firstName} {user?.lastName} - {staff.role}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStaff(index)}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      Remove
                    </Button>
                  </div>
                )
              })}
              
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Select onValueChange={(value) => {
                  const role = (document.getElementById('staffRole') as HTMLInputElement)?.value
                  if (role) handleAddStaff(value, role)
                }}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} {user.jobTitle ? `(${user.jobTitle})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input id="staffRole" placeholder="Role (e.g., DJ, Photographer)" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                <Button type="button" variant="outline" onClick={() => {
                  const select = document.querySelector('[role="combobox"]') as any
                  const role = (document.getElementById('staffRole') as HTMLInputElement)?.value
                  const userId = select?.getAttribute('data-value')
                  if (userId && role) handleAddStaff(userId, role)
                }} className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Financial Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalPrice" className="text-white">Total Price</Label>
                <Input id="totalPrice" name="totalPrice" type="number" step="0.01" placeholder="2500.00" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit" className="text-white">Deposit</Label>
                <Input id="deposit" name="deposit" type="number" step="0.01" placeholder="500.00" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isPaid" name="isPaid" className="border-slate-600" />
                  <Label htmlFor="isPaid" className="font-normal text-white">Paid in full</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">Client Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Special requests, preferences, etc." rows={3} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internalNotes" className="text-white">Internal Notes</Label>
              <Textarea id="internalNotes" name="internalNotes" placeholder="Internal team notes (not visible to client)" rows={3} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !date || selectedServices.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
