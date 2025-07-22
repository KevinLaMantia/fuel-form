'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Dumbbell,
  Apple,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HeroLogo } from '@/components/hero-logo';

interface NavigationHeaderProps {
  user?: any;
}

export function NavigationHeader({ user }: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserName = (user: any) => {
    return (
      user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    );
  };

  const getUserInitials = (user: any) => {
    const name = getUserName(user);
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Workouts', href: '/workout', icon: Dumbbell },
    { name: 'Nutrition', href: '/nutrition', icon: Apple },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Trainers', href: '/trainers', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className='bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-xl sticky top-0 z-50'>
      <div className='w-full max-w-7xl xl:max-w-none 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/dashboard' className='flex items-center space-x-2'>
              <HeroLogo className='h-8 w-auto' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-1'>
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant='ghost'
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {/* Mobile menu button */}
            <Button
              variant='ghost'
              size='sm'
              className='md:hidden text-white'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-10 w-10 rounded-full'
                >
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src={
                        user?.user_metadata?.avatar_url || '/placeholder.svg'
                      }
                      alt={getUserName(user)}
                    />
                    <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56 bg-slate-900/95 backdrop-blur-lg border border-white/20'
                align='end'
              >
                <DropdownMenuLabel className='text-white'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium'>{getUserName(user)}</p>
                    <p className='text-xs text-white/60'>{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-white/20' />
                <DropdownMenuItem
                  className='text-white hover:bg-white/10 cursor-pointer'
                  onClick={() => router.push('/settings')}
                >
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-white hover:bg-white/10 cursor-pointer'
                  onClick={() => router.push('/settings')}
                >
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-white/20' />
                <DropdownMenuItem
                  className='text-red-400 hover:bg-red-500/10 cursor-pointer'
                  onClick={handleSignOut}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-white/5 backdrop-blur-lg rounded-lg mt-2 border border-white/10'>
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant='ghost'
                    className={`w-full justify-start flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className='h-4 w-4' />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
