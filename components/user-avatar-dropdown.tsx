'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { HeroLogo } from '@/components/hero-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, getCurrentUser } from '@/lib/auth';

interface NavigationHeaderProps {
  user?: any;
}

export function NavigationHeader({ user: propUser }: NavigationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(propUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!propUser) {
      // If no user prop is passed, try to get the current user
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Workouts', href: '/workout' },
    { name: 'Nutrition', href: '/nutrition' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Messages', href: '/messages' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className='w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50'>
      <div className='w-full max-w-7xl xl:max-w-none 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <HeroLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm'>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 bg-slate-800 border-slate-700'
                  align='end'
                  forceMount
                >
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-medium text-white'>{user.email}</p>
                      <p className='w-[200px] truncate text-sm text-slate-400'>
                        {user.user_metadata?.full_name || 'FuelForm User'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className='bg-slate-700' />
                  <DropdownMenuItem
                    asChild
                    className='text-white hover:bg-slate-700'
                  >
                    <Link href='/dashboard' className='flex items-center'>
                      <User className='mr-2 h-4 w-4' />
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
                  className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'
                >
                  <Link href='/signup'>Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-white hover:bg-white/10'
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
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-lg mt-2 border border-white/20'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <div className='border-t border-white/20 pt-4 mt-4'>
                  <div className='flex items-center px-3 py-2'>
                    <Avatar className='h-8 w-8 mr-3'>
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm'>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-white font-medium'>{user.email}</p>
                      <p className='text-slate-400 text-sm'>
                        {user.user_metadata?.full_name || 'FuelForm User'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href='/settings'
                    className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className='block w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md'
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className='border-t border-white/20 pt-4 mt-4 space-y-2'>
                  <Link
                    href='/login'
                    className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href='/signup'
                    className='block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-center'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
