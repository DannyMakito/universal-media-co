"use client"

import { Input } from "@/components/ui/input"
import { Search, Edit, Send, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const chats = [
    { id: 1, name: "Alex John", message: "You: See you later, Alex!", avatar: "/avatars/01.png" },
    { id: 2, name: "Taylor Grande", message: "Yeah, it's really well-explained. You should give it a try.", avatar: "/avatars/02.png" },
    { id: 3, name: "John Doe", message: "You: Yep, see ya. 👍", avatar: "/avatars/03.png" },
    { id: 4, name: "Megan Flux", message: "You: Sure ✌️", avatar: "/avatars/04.png" },
    { id: 5, name: "David Brown", message: "You: Great, I'll review them now!", avatar: "/avatars/05.png" },
    { id: 6, name: "Julia Carter", message: "Julia: Thanks!", avatar: "/avatars/06.png" },
]

export default function ChatsPage() {
    return (
        <div className="flex w-full h-[calc(100vh-10rem)] shadow-sm rounded-lg overflow-hidden border bg-card">
            {/* Sidebar */}
            <div className="w-80 border-r flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Inbox <MessageSquare className="h-5 w-5" />
                    </h2>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search chat..." className="pl-8 bg-muted/50" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer border-b last:border-0 ${chat.id === 1 ? 'bg-muted/30' : ''}`}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={chat.avatar} alt={chat.name} />
                                <AvatarFallback>{getInitials(chat.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-medium text-sm truncate">{chat.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/5">
                <div className="text-center max-w-sm">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                        <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Your messages</h3>
                    <p className="text-muted-foreground mb-6">Send a message to start a chat.</p>
                    <Button size="lg" className="rounded-full shadow-lg">
                        Send message
                    </Button>
                </div>
            </div>
        </div>
    )
}
