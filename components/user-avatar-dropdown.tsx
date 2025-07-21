'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, CreditCard, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface UserAvatarDropdownProps {
  user: any;
}

export function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getUserName = (user: any) => {
    return (
      user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    );
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Error',
          description: 'Failed to sign out. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Sign out successful');
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      // Force a page refresh to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            <AvatarImage
              src={user?.user_metadata?.avatar_url || '/placeholder.svg'}
              alt={getUserName(user)}
            />
            <AvatarFallback className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
              {getUserName(user).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {getUserName(user)}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <User className='mr-2 h-4 w-4' />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className='mr-2 h-4 w-4' />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/billing')}>
          <CreditCard className='mr-2 h-4 w-4' />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/notifications')}>
          <Bell className='mr-2 h-4 w-4' />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoggingOut}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
