"use client"

import { useState } from "react"
import Link from "next/link" // Added Next.js Link
import { usePathname } from "next/navigation" // Added usePathname hook
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", current: false },
  { name: "Time Tracking", icon: Clock, href: "/time-tracking", current: false },
  { name: "Events", icon: Calendar, href: "/events", current: false },
  { name: "Client Inquiries", icon: Users, href: "/inquiries", current: false },
  { name: "Team Chat", icon: MessageSquare, href: "/chat", current: false },
  { name: "Email Campaigns", icon: Mail, href: "/email", current: false },
  { name: "Settings", icon: Settings, href: "/settings", current: false },
]

const branches = [
  { name: "Trident Films", icon: Video, color: "text-blue-400" },
  { name: "Trident Music", icon: Music, color: "text-purple-400" },
  { name: "Trident Studios", icon: Camera, color: "text-pink-400" },
  { name: "Trident Photobooth", icon: Sparkles, color: "text-cyan-400" },
  { name: "Trident A/V", icon: MonitorPlay, color: "text-green-400" },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const currentPath = usePathname() // Use Next.js hook instead of window.location

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
            <span className="text-primary-foreground text-xs font-medium">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">John Doe</p>
              <p className="text-sidebar-foreground/60 text-xs truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
