"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Hash, MoreVertical, Send, Paperclip, Smile } from "lucide-react"

const messages = [
  {
    id: 1,
    user: "Sarah Chen",
    initials: "SC",
    message: "Hey team! Just finished setting up for the Smith wedding. Everything looks great!",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    user: "Mike Johnson",
    initials: "MJ",
    message: "Awesome! I'm heading there now with the DJ equipment. Should be there in 15 minutes.",
    time: "10:32 AM",
    isOwn: false,
  },
  {
    id: 3,
    user: "You",
    initials: "JD",
    message: "Perfect! Make sure to check the audio levels before the ceremony starts.",
    time: "10:35 AM",
    isOwn: true,
  },
  {
    id: 4,
    user: "Emily Davis",
    initials: "ED",
    message: "I've already got some great shots of the venue setup. The lighting is perfect today!",
    time: "10:38 AM",
    isOwn: false,
  },
  {
    id: 5,
    user: "Sarah Chen",
    initials: "SC",
    message: "Great work everyone! Let's make this a memorable event for the Smith family.",
    time: "10:40 AM",
    isOwn: false,
  },
]

export function ChatWindow() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <div>
            <h2 className="font-semibold">events-team</h2>
            <p className="text-xs text-muted-foreground">12 members</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
            {!msg.isOwn && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{msg.initials}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex-1 max-w-2xl ${msg.isOwn ? "items-end" : ""}`}>
              {!msg.isOwn && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${msg.isOwn ? "bg-primary text-primary-foreground ml-auto" : "bg-accent"}`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              {msg.isOwn && (
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  setMessage("")
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button size="icon" onClick={() => setMessage("")}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
