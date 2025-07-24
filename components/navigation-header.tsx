'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HeroLogo } from '@/components/hero-logo';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { getCurrentUser, signOut, type User } from '@/lib/auth';
import { ThemeToggle } from './theme-toggle';

interface NavigationHeaderProps {
  user?: User | null;
}

export function NavigationHeader({ user: userProp }: NavigationHeaderProps) {
  const [user, setUser] = useState<User | null>(userProp || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
    } else {
      // Fallback: try to fetch user if not provided
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, [userProp]);

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      router.push('/');
    }
  };

  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (user: User) => {
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      'User'
    );
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Workouts', href: '/workout' },
    { name: 'Nutrition', href: '/nutrition' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Messages', href: '/messages' },
  ];

  return (
    <header className='w-full bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50'>
      <div className='w-full max-w-7xl xl:max-w-none 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/dashboard' className='flex items-center space-x-2'>
            <HeroLogo className='h-8 w-auto' />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full'
                  >
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={
                          user.user_metadata?.avatar_url || '/placeholder.svg'
                        }
                      />
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 bg-slate-800 border-slate-700'
                  align='end'
                >
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-medium text-white'>
                        {getUserDisplayName(user)}
                      </p>
                      <p className='w-[200px] truncate text-sm text-slate-400'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className='bg-slate-700' />
                  <DropdownMenuItem
                    asChild
                    className='text-white hover:bg-slate-700'
                  >
                    <Link href='/dashboard' className='flex items-center'>
                      <Settings className='mr-2 h-4 w-4' />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className='text-white hover:bg-slate-700'
                  >
                    <Link href='/settings' className='flex items-center'>
                      <Settings className='mr-2 h-4 w-4' />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='bg-slate-700' />
                  <DropdownMenuItem
                    className='text-white hover:bg-slate-700 cursor-pointer'
                    onClick={handleSignOut}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center space-x-2'>
                <Button
                  asChild
                  variant='ghost'
                  className='text-white hover:bg-white/10'
                >
                  <Link href='/login'>Sign In</Link>
                </Button>
                <Button
                  asChild
                  className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                >
                  <Link href='/signup'>Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden text-white hover:bg-white/10'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-white/10'>
            <nav className='flex flex-col space-y-2'>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
