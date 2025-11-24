'use client'

import { useState } from 'react'
import { User, UserRole } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, MoreVertical, Shield, UserCheck, UserX } from 'lucide-react'
import { EditUserDialog } from './edit-user-dialog'

type UserWithCounts = User & {
  _count: {
    assignedEvents: number
    timeEntries: number
  }
}

interface UserManagementTableProps {
  users: UserWithCounts[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [editingUser, setEditingUser] = useState<UserWithCounts | null>(null)

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'MANAGER':
        return 'default'
      case 'SALES_LEAD':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-3 w-3" />
      case 'MANAGER':
        return <UserCheck className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Events
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        {user.jobTitle && (
                          <p className="text-xs text-muted-foreground">
                            {user.jobTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? 'default' : 'outline'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{user._count.assignedEvents}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{user._count.timeEntries}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  )
}