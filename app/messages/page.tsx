"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Personal Trainer",
    lastMessage: "Great job on today's workout! How are you feeling?",
    time: "2:30 PM",
    unread: 2,
    avatar: "SM",
    online: true,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Client",
    lastMessage: "Thanks for the new program! When should I start?",
    time: "1:45 PM",
    unread: 0,
    avatar: "JD",
    online: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Client",
    lastMessage: "I'm struggling with the nutrition plan...",
    time: "11:20 AM",
    unread: 1,
    avatar: "MJ",
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Mitchell",
    content: "Hi! How did your workout go today?",
    time: "2:15 PM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "It went really well! I managed to increase my bench press by 5 lbs 💪",
    time: "2:18 PM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Mitchell",
    content: "That's fantastic! I'm so proud of your progress. How are you feeling about the new program overall?",
    time: "2:20 PM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "I love it! The variety keeps things interesting and I can definitely feel myself getting stronger.",
    time: "2:25 PM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Mitchell",
    content: "Great job on today's workout! How are you feeling?",
    time: "2:30 PM",
    isMe: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation.id === conversation.id ? "bg-blue-50 border-r-2 border-r-blue-500" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">{conversation.avatar}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{conversation.role}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs">{conversation.unread}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">{selectedConversation.avatar}</AvatarFallback>
              </Avatar>
              {selectedConversation.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="font-medium text-gray-900">{selectedConversation.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedConversation.online ? "Online" : "Last seen 2 hours ago"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe ? "bg-blue-600 text-white" : "bg-white border text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isMe ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10"
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
