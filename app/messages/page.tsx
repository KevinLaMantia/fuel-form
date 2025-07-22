'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
} from 'lucide-react';
import { NavigationHeader } from '@/components/navigation-header';
import { getCurrentUser, type User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const conversations = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Personal Trainer',
    lastMessage: "Great job on today's workout! Keep it up 💪",
    timestamp: '2 min ago',
    unread: 2,
    avatar: 'SM',
    online: true,
  },
  {
    id: 2,
    name: 'Mike Johnson',
    role: 'Strength Coach',
    lastMessage: "Let's schedule your next powerlifting session",
    timestamp: '1 hour ago',
    unread: 0,
    avatar: 'MJ',
    online: false,
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Yoga Instructor',
    lastMessage: 'Remember to practice the breathing exercises',
    timestamp: '3 hours ago',
    unread: 1,
    avatar: 'EC',
    online: true,
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'CrossFit Coach',
    lastMessage: 'Your form is improving! See you tomorrow',
    timestamp: '1 day ago',
    unread: 0,
    avatar: 'DR',
    online: false,
  },
];

const messages = [
  {
    id: 1,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    content: "Hi! How are you feeling after yesterday's workout?",
    timestamp: '10:30 AM',
    isOwn: false,
  },
  {
    id: 2,
    senderId: 'me',
    senderName: 'You',
    content:
      "I'm feeling great! A bit sore but in a good way. Ready for today's session.",
    timestamp: '10:32 AM',
    isOwn: true,
  },
  {
    id: 3,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    content:
      "Perfect! That's exactly what we want to hear. Today we'll focus on upper body strength training.",
    timestamp: '10:33 AM',
    isOwn: false,
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    content:
      "Make sure to bring your water bottle and we'll get started with a proper warm-up.",
    timestamp: '10:34 AM',
    isOwn: false,
  },
  {
    id: 5,
    senderId: 'me',
    senderName: 'You',
    content: "Sounds good! I'll be there in 15 minutes.",
    timestamp: '10:35 AM',
    isOwn: true,
  },
  {
    id: 6,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    content: "Great job on today's workout! Keep it up 💪",
    timestamp: '2:15 PM',
    isOwn: false,
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <NavigationHeader user={user} />

      <div className='container mx-auto p-4 space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]'>
          {/* Conversations Sidebar */}
          <div className='lg:col-span-1'>
            <Card className='h-full bg-white/10 border-white/20 backdrop-blur-sm'>
              <CardContent className='p-0 h-full flex flex-col'>
                {/* Search Header */}
                <div className='p-4 border-b border-white/10'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60' />
                    <Input
                      placeholder='Search conversations...'
                      className='pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60'
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className='flex-1 overflow-y-auto'>
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                        selectedConversation.id === conversation.id
                          ? 'bg-white/20'
                          : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='relative'>
                          <Avatar className='h-12 w-12'>
                            <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                              {conversation.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800'></div>
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between'>
                            <h3 className='text-white font-medium truncate'>
                              {conversation.name}
                            </h3>
                            <span className='text-xs text-white/60'>
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className='text-sm text-white/60 mb-1'>
                            {conversation.role}
                          </p>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm text-white/80 truncate'>
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className='bg-purple-600 text-white text-xs ml-2'>
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className='lg:col-span-2'>
            <Card className='h-full bg-white/10 border-white/20 backdrop-blur-sm'>
              <CardContent className='p-0 h-full flex flex-col'>
                {/* Chat Header */}
                <div className='p-4 border-b border-white/10 flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='relative'>
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                          {selectedConversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800'></div>
                      )}
                    </div>
                    <div>
                      <h3 className='text-white font-medium'>
                        {selectedConversation.name}
                      </h3>
                      <p className='text-sm text-white/60'>
                        {selectedConversation.role}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-white hover:bg-white/10'
                    >
                      <Phone className='h-5 w-5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-white hover:bg-white/10'
                    >
                      <Video className='h-5 w-5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-white hover:bg-white/10'
                    >
                      <MoreVertical className='h-5 w-5' />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white/20 text-white backdrop-blur-sm'
                        }`}
                      >
                        <p className='text-sm'>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? 'text-white/80' : 'text-white/60'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className='p-4 border-t border-white/10'>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-white hover:bg-white/10'
                    >
                      <Paperclip className='h-5 w-5' />
                    </Button>
                    <div className='flex-1 relative'>
                      <Input
                        placeholder='Type a message...'
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-12'
                      />
                      <Button
                        variant='ghost'
                        size='icon'
                        className='absolute right-1 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10'
                      >
                        <Smile className='h-4 w-4' />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'
                    >
                      <Send className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
