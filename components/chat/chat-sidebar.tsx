"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Hash, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const channels = [
  { id: 1, name: "general", unread: 0, type: "channel" },
  { id: 2, name: "events-team", unread: 3, type: "channel" },
  { id: 3, name: "films-crew", unread: 0, type: "channel" },
  { id: 4, name: "music-djs", unread: 1, type: "channel" },
  { id: 5, name: "studios-team", unread: 0, type: "channel" },
]

const directMessages = [
  { id: 1, name: "Sarah Chen", initials: "SC", status: "online", unread: 2 },
  { id: 2, name: "Mike Johnson", initials: "MJ", status: "online", unread: 0 },
  { id: 3, name: "Emily Davis", initials: "ED", status: "away", unread: 0 },
  { id: 4, name: "Alex Rodriguez", initials: "AR", status: "offline", unread: 1 },
]

export function ChatSidebar() {
  const [activeChat, setActiveChat] = useState(2)

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-3">Team Chat</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Channels</h3>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Hash className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChat(channel.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors ${
                  activeChat === channel.id ? "bg-accent" : ""
                }`}
              >
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left truncate">{channel.name}</span>
                {channel.unread > 0 && <Badge className="h-5 px-1.5 text-xs">{channel.unread}</Badge>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Direct Messages</h3>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Users className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => setActiveChat(dm.id + 10)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors ${
                  activeChat === dm.id + 10 ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {dm.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                      dm.status === "online" ? "bg-green-500" : dm.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <span className="flex-1 text-left truncate">{dm.name}</span>
                {dm.unread > 0 && <Badge className="h-5 px-1.5 text-xs">{dm.unread}</Badge>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
