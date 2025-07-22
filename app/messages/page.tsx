'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
} from 'lucide-react';
import { NavigationHeader } from '@/components/navigation-header';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const conversations = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Personal Trainer',
    lastMessage: "Great job on today's workout! How are you feeling?",
    time: '2:30 PM',
    unread: 2,
    avatar: 'SM',
    online: true,
  },
  {
    id: 2,
    name: 'John Doe',
    role: 'Client',
    lastMessage: 'Thanks for the new program! When should I start?',
    time: '1:45 PM',
    unread: 0,
    avatar: 'JD',
    online: false,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Client',
    lastMessage: "I'm struggling with the nutrition plan...",
    time: '11:20 AM',
    unread: 1,
    avatar: 'MJ',
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: 'Sarah Mitchell',
    content: 'Hi! How did your workout go today?',
    time: '2:15 PM',
    isMe: false,
  },
  {
    id: 2,
    sender: 'Me',
    content:
      'It went really well! I managed to increase my bench press by 5 lbs 💪',
    time: '2:18 PM',
    isMe: true,
  },
  {
    id: 3,
    sender: 'Sarah Mitchell',
    content:
      "That's fantastic! I'm so proud of your progress. How are you feeling about the new program overall?",
    time: '2:20 PM',
    isMe: false,
  },
  {
    id: 4,
    sender: 'Me',
    content:
      'I love it! The variety keeps things interesting and I can definitely feel myself getting stronger.',
    time: '2:25 PM',
    isMe: true,
  },
  {
    id: 5,
    sender: 'Sarah Mitchell',
    content: "Great job on today's workout! How are you feeling?",
    time: '2:30 PM',
    isMe: false,
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className='container mx-auto px-4 py-8'>
        <div className='h-[calc(100vh-12rem)] flex rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10'>
          {/* Conversations Sidebar */}
          <div className='w-80 bg-white/10 border-r border-white/10 flex flex-col backdrop-blur-sm'>
            {/* Header */}
            <div className='p-4 border-b border-white/10'>
              <h1 className='text-xl font-bold text-white mb-4'>Messages</h1>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60' />
                <Input
                  placeholder='Search conversations...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/20'
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className='flex-1 overflow-y-auto'>
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 ${
                    selectedConversation.id === conversation.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-r-2 border-r-purple-400'
                      : ''
                  }`}
                >
                  <div className='flex items-start space-x-3'>
                    <div className='relative'>
                      <Avatar>
                        <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full'></div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-medium text-white truncate'>
                          {conversation.name}
                        </h3>
                        <span className='text-xs text-white/60'>
                          {conversation.time}
                        </span>
                      </div>
                      <p className='text-sm text-purple-300 mb-1'>
                        {conversation.role}
                      </p>
                      <p className='text-sm text-white/70 truncate'>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs border-0'>
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className='flex-1 flex flex-col bg-white/5'>
            {/* Chat Header */}
            <div className='bg-white/10 border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-sm'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <Avatar>
                    <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full'></div>
                  )}
                </div>
                <div>
                  <h2 className='font-medium text-white'>
                    {selectedConversation.name}
                  </h2>
                  <p className='text-sm text-white/70'>
                    {selectedConversation.online
                      ? 'Online'
                      : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-white/70 hover:text-white hover:bg-white/10'
                >
                  <Phone className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-white/70 hover:text-white hover:bg-white/10'
                >
                  <Video className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-white/70 hover:text-white hover:bg-white/10'
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isMe
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 border border-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    <p className='text-sm'>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isMe ? 'text-purple-100' : 'text-white/60'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className='bg-white/10 border-t border-white/10 p-4 backdrop-blur-sm'>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-white/70 hover:text-white hover:bg-white/10'
                >
                  <Paperclip className='h-4 w-4' />
                </Button>
                <div className='flex-1 relative'>
                  <Input
                    placeholder='Type a message...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className='pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-purple-400 focus:ring-purple-400/20'
                  />
                  <Button
                    variant='ghost'
                    size='sm'
                    className='absolute right-1 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10'
                  >
                    <Smile className='h-4 w-4' />
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 disabled:opacity-50'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
