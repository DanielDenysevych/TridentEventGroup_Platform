"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Mail,
  Settings,
  ChevronLeft,
  Video,
  Music,
  Camera,
  MonitorPlay,
  Sparkles,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"

const branches = [
  { name: "Trident Films", icon: Video, color: "text-blue-400" },
  { name: "Trident Music", icon: Music, color: "text-purple-400" },
  { name: "Trident Studios", icon: Camera, color: "text-pink-400" },
  { name: "Trident Photobooth", icon: Sparkles, color: "text-cyan-400" },
  { name: "Trident A/V", icon: MonitorPlay, color: "text-green-400" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const currentPath = usePathname()
  const { user } = useUser()

  useEffect(() => {
    // Fetch user role from your database
    if (user) {
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => setUserRole(data.role))
        .catch(console.error)
    }
  }, [user])

  // Build navigation based on user role
  const baseNavigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", current: false },
    { name: "Time Tracking", icon: Clock, href: "/time-tracking", current: false },
    { name: "Events", icon: Calendar, href: "/events", current: false },
    { name: "Client Inquiries", icon: Users, href: "/inquiries", current: false },
    { name: "Team Chat", icon: MessageSquare, href: "/chat", current: false },
    { name: "Email Campaigns", icon: Mail, href: "/email", current: false },
    { name: "Settings", icon: Settings, href: "/settings", current: false },
  ]

  // Add admin link if user is admin (after Dashboard)
  const navigation = userRole === 'ADMIN' 
    ? [
        baseNavigation[0], // Dashboard
        { name: "Admin", icon: Shield, href: "/admin", current: false },
        ...baseNavigation.slice(1) // Rest of the items
      ]
    : baseNavigation

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <div>
              <h2 className="text-sidebar-foreground font-bold text-sm">Trident</h2>
              <p className="text-sidebar-foreground/60 text-xs">Event Group</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isCurrent = currentPath === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <p className="text-sidebar-foreground/60 text-xs font-medium mb-2 px-3">BRANCHES</p>
          <div className="space-y-1">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 cursor-pointer transition-colors"
              >
                <branch.icon className={cn("h-4 w-4", branch.color)} />
                <span className="text-xs">{branch.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sidebar-foreground/60 text-xs truncate capitalize">
                {userRole?.toLowerCase() || 'Employee'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}