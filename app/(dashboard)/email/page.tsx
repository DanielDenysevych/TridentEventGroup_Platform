import { EmailHeader } from "@/components/email/email-header"
import { EmailStats } from "@/components/email/email-stats"
import { CampaignsList } from "@/components/email/campaigns-list"
import { EmailTemplates } from "@/components/email/email-templates"

export default function EmailPage() {
  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <EmailHeader />
      <EmailStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CampaignsList />
        </div>
        <EmailTemplates />
      </div>
    </main>
  )
}
