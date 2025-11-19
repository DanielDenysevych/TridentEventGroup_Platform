import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"

export default function ChatPage() {
  return (
    <main className="flex-1 flex overflow-hidden">
      <ChatSidebar />
      <ChatWindow />
    </main>
  )
}
