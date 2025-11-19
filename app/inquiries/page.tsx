import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { InquiriesHeader } from "@/components/inquiries/inquiries-header"
import { InquiriesBoard } from "@/components/inquiries/inquiries-board"
import { InquiriesStats } from "@/components/inquiries/inquiries-stats"

export default function InquiriesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <InquiriesHeader />
          <InquiriesStats />
          <InquiriesBoard />
        </main>
      </div>
    </div>
  )
}
