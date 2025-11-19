import { InquiriesHeader } from "@/components/inquiries/inquiries-header"
import { InquiriesStats } from "@/components/inquiries/inquiries-stats"
import { InquiriesBoard } from "@/components/inquiries/inquiries-board"

export default function InquiriesPage() {
  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <InquiriesHeader />
      <InquiriesStats />
      <InquiriesBoard />
    </main>
  )
}
