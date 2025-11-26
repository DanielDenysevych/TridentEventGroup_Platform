"use client"

import { useState, useTransition, useId } from "react"
import { Check, ChevronDown, UserCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SalesUser = {
  id: string
  firstName: string
  lastName: string
  role: string
}

export function LeadAssigneeSelect({
  leadId,
  initialAssigneeId,
  salesUsers,
}: {
  leadId: string
  initialAssigneeId: string | null
  salesUsers: SalesUser[]
}) {
    const id = useId();
  const [assigneeId, setAssigneeId] = useState<string | null>(initialAssigneeId)
  const [isPending, startTransition] = useTransition()

  const currentAssignee = salesUsers.find((u) => u.id === assigneeId)

  const updateAssignee = (newAssigneeId: string | null) => {
    setAssigneeId(newAssigneeId)

    startTransition(async () => {
      await fetch(`/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: newAssigneeId }),
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild id={id}>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 rounded-full border flex items-center gap-2 min-w-[120px]"
          disabled={isPending}
        >
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">
            {currentAssignee
              ? `${currentAssignee.firstName} ${currentAssignee.lastName.charAt(0)}.`
              : "Unassigned"}
          </span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        {/* Unassign option */}
        <DropdownMenuItem
          onClick={() => updateAssignee(null)}
          className="flex items-center justify-between cursor-pointer text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Unassigned
          </span>
          {assigneeId === null && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        {/* Divider */}
        <div className="h-px bg-border my-1" />

        {/* Sales team members */}
        {salesUsers.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => updateAssignee(user.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              {user.firstName} {user.lastName}
            </span>
            {assigneeId === user.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}

        {salesUsers.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No sales team members
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}