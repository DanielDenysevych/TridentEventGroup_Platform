import { db } from '@/lib/db'
import { LeadStatus, LeadSource } from '@prisma/client'
import { format } from 'date-fns'
import { BackArrow } from '@/components/back-arrow'
import { LeadStatusSelect } from '@/components/lead-status-select'
import { LeadAssigneeSelect } from '@/components/lead-assignee-select'

function getStatusClasses(status: LeadStatus) {
    switch (status) {
        case 'NEW':
            return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'CONTACTED':
            return 'bg-amber-100 text-amber-800 border-amber-200'
        case 'QUOTED':
            return 'bg-purple-100 text-purple-800 border-purple-200'
        case 'FOLLOW_UP':
            return 'bg-orange-100 text-orange-800 border-orange-200'
        case 'ATTEND_EVENT':
            return 'bg-sky-100 text-sky-800 border-sky-200'
        case 'WON':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200'
        case 'LOST':
            return 'bg-rose-100 text-rose-800 border-rose-200'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

function formatSource(source: LeadSource) {
    switch (source) {
        case 'WEBSITE_FORM':
            return 'Website form'
        case 'PHONE':
            return 'Phone'
        case 'EMAIL':
            return 'Email'
        case 'REFERRAL':
            return 'Referral'
        case 'SOCIAL_MEDIA':
            return 'Social media'
        default:
            return source
    }
}

export default async function LeadsPage() {
    // Fetch latest leads with assignee info
    const leads = await db.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
            assignedTo: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })

    // Fetch sales team members (ADMIN, SALES_LEAD, MANAGER)
    const salesUsers = await db.user.findMany({
        where: {
            isActive: true,
            role: 'SALES_LEAD'
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
        },
        orderBy: {
            firstName: 'asc'
        }
    })

    return (
        <div className="px-6 py-8 max-w-7xl mx-auto">
            <BackArrow href="/admin" className="mb-6" />

            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New inquiries
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Showing the latest {leads.length} leads captured from your forms.
                    </p>
                </div>
            </div>

            {leads.length === 0 ? (
                <div className="rounded-lg border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
                    No leads yet. Once someone submits the music form, they&apos;ll appear
                    here automatically.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border bg-card">
                    <table className="min-w-full text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Client</th>
                                <th className="px-4 py-3 text-left">Event</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Source</th>
                                <th className="px-4 py-3 text-left">Assigned To</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                                >
                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium">{lead.clientName}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {lead.clientEmail}
                                            {lead.clientPhone ? ` • ${lead.clientPhone}` : ''}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-top">
                                        <div className="font-medium">{lead.eventName}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {lead.eventLocation || 'Location TBA'}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 align-top whitespace-nowrap">
                                        {lead.eventDate ? (
                                            <span>
                                                {format(new Date(lead.eventDate), 'MMM d, yyyy')}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Not set
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 align-top whitespace-nowrap text-xs">
                                        {formatSource(lead.source)}
                                    </td>

                                    <td className="px-4 py-3 align-top whitespace-nowrap">
                                        <LeadAssigneeSelect
                                            leadId={lead.id}
                                            initialAssigneeId={lead.assignedToId}
                                            salesUsers={salesUsers}
                                        />
                                    </td>

                                    <td className="px-4 py-3 align-top whitespace-nowrap">
                                        <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
                                    </td>

                                    <td className="px-4 py-3 align-top whitespace-nowrap text-right text-xs text-muted-foreground">
                                        {format(new Date(lead.createdAt), 'MMM d, yyyy HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}