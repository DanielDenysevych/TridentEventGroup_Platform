"use client"

import { useState, useTransition, useId } from "react"
import { useRouter } from "next/navigation"
import { LeadStatus } from "@prisma/client"
import { Check, ChevronDown, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  FOLLOW_UP: "Follow Up",
  ATTEND_EVENT: "Attend Event",
  WON: "Won",
  LOST: "Lost",
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 border-blue-300",
  CONTACTED: "bg-amber-100 text-amber-800 border-amber-300",
  QUOTED: "bg-purple-100 text-purple-800 border-purple-300",
  FOLLOW_UP: "bg-orange-100 text-orange-800 border-orange-300",
  ATTEND_EVENT: "bg-sky-100 text-sky-800 border-sky-300",
  WON: "bg-emerald-100 text-emerald-800 border-emerald-300",
  LOST: "bg-rose-100 text-rose-800 border-rose-300",
}

// Statuses that will create an event when selected
const EVENT_CREATING_STATUSES: LeadStatus[] = ['ATTEND_EVENT', 'WON']

export function LeadStatusSelect({
  leadId,
  initialStatus,
  isConverted = false,
}: {
  leadId: string
  initialStatus: LeadStatus
  isConverted?: boolean
}) {
  const id = useId()
  const router = useRouter()
  const [status, setStatus] = useState<LeadStatus>(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [showRevertDialog, setShowRevertDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null)

  const updateStatus = async (newStatus: LeadStatus, confirmed = false) => {
    // Check if we're reverting from an event status to a non-event status
    const isReverting = EVENT_CREATING_STATUSES.includes(status) && 
                        !EVENT_CREATING_STATUSES.includes(newStatus) && 
                        isConverted

    // If reverting and not confirmed, show confirmation dialog
    if (isReverting && !confirmed) {
      setPendingStatus(newStatus)
      setShowRevertDialog(true)
      return
    }

    setStatus(newStatus)

    startTransition(async () => {
      try {
        const response = await fetch(`/api/leads/${leadId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })

        const data = await response.json()

        // Refresh the page to show the updated state
        if (data.eventCreated || data.eventDeleted) {
          router.refresh()
        }
      } catch (error) {
        // Revert on error
        setStatus(initialStatus)
        console.error('Failed to update status:', error)
      }
    })
  }

  const handleConfirmRevert = () => {
    if (pendingStatus) {
      updateStatus(pendingStatus, true)
    }
    setShowRevertDialog(false)
    setPendingStatus(null)
  }

  const handleCancelRevert = () => {
    setShowRevertDialog(false)
    setPendingStatus(null)
  }

  // Group statuses for better UX
  const activeStatuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP']
  const finalStatuses: LeadStatus[] = ['ATTEND_EVENT', 'WON', 'LOST']

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild id={id}>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-3 rounded-full border ${STATUS_COLORS[status]} flex items-center gap-2`}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : null}
            {STATUS_LABELS[status]}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-44">
          {/* Active/Working statuses */}
          {activeStatuses.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => updateStatus(s)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{STATUS_LABELS[s]}</span>
              {status === s && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Final statuses (these create events) */}
          {finalStatuses.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => updateStatus(s)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {STATUS_LABELS[s]}
                {EVENT_CREATING_STATUSES.includes(s) && s !== 'LOST' && !isConverted && (
                  <span className="text-[10px] text-muted-foreground">→ Event</span>
                )}
              </span>
              {status === s && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog for Reverting Status */}
      <AlertDialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Revert Status & Delete Event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Changing the status from <strong>{STATUS_LABELS[status]}</strong> to{" "}
              <strong>{pendingStatus ? STATUS_LABELS[pendingStatus] : ""}</strong> will{" "}
              <span className="text-destructive font-medium">permanently delete</span> the 
              associated event from the calendar and events table.
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRevert}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRevert}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event & Revert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}