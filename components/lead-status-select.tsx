"use client"

import { useState, useTransition } from "react"
import { LeadStatus } from "@prisma/client"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function LeadStatusSelect({
  leadId,
  initialStatus,
}: {
  leadId: string
  initialStatus: LeadStatus
}) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus)
  const [isPending, startTransition] = useTransition()

  const updateStatus = (newStatus: LeadStatus) => {
    setStatus(newStatus)

    startTransition(async () => {
      await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-3 rounded-full border ${STATUS_COLORS[status]} flex items-center gap-2`}
          disabled={isPending}
        >
          {STATUS_LABELS[status]}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-40">
        {Object.values(LeadStatus).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => updateStatus(s)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{STATUS_LABELS[s]}</span>
            {status === s && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
