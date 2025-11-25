"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type BackArrowProps = {
  href?: string       // optional: override router.back()
  label?: string      // optional aria label
  className?: string
}

export function BackArrow({ href, label = "Go back", className = "" }: BackArrowProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={label}
      className={className}
    >
      <ArrowLeft className="w-4 h-4" />
    </Button>
  )
}
