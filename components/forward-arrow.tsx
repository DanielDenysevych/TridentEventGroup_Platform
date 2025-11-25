"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ForwardArrowProps = {
  href: string
  label?: string
  className?: string
}

export function ForwardArrow({ href, label = "Next page", className = "" }: ForwardArrowProps) {
  return (
    <Link href={href}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={label}
        className={className}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </Link>
  )
}
