'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  Dumbbell,
  MessageSquare,
  Users,
  Apple,
} from 'lucide-react';
import { HeroLogo } from '@/components/hero-logo';
import { getCurrentUser, signOut } from '@/lib/auth';
import type { User as AuthUser } from '@/lib/auth';

interface NavigationHeaderProps {
  user?: AuthUser | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Workouts', href: '/workout', icon: Dumbbell },
  { name: 'Nutrition', href: '/nutrition', icon: Apple },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Trainers', href: '/trainers', icon: Users },
];

export function NavigationHeader({ user: userProp }: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(userProp || null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
    } else {
      // Fallback: try to fetch user if not provided
      getCurrentUser().then(setUser).catch(console.error);
    }
  }, [userProp]);

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      router.push('/');
    }
  };

  const getUserInitials = (user: AuthUser | null) => {
    if (!user) return 'U';
    if (user.full_name) {
      return user.full_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserDisplayName = (user: AuthUser | null) => {
    if (!user) return 'User';
    return user.full_name || user.email?.split('@')[0] || 'User';
  };

  return (
    <header className='w-full bg-white/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
      <div className='w-full max-w-7xl xl:max-w-none 2xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <HeroLogo className='h-8 w-auto' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-1'>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.name}</span>
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
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 bg-white/10 backdrop-blur-sm border-white/20'
                  align='end'
                >
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      <p className='font-medium text-white'>
                        {getUserDisplayName(user)}
                      </p>
                      <p className='w-[200px] truncate text-sm text-white/70'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className='bg-white/20' />
                  <DropdownMenuItem
                    asChild
                    className='text-white hover:bg-white/10'
                  >
                    <Link href='/settings' className='flex items-center'>
                      <Settings className='mr-2 h-4 w-4' />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className='text-white hover:bg-white/10 cursor-pointer'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link href='/login'>
                  <Button
                    variant='ghost'
                    className='text-white hover:bg-white/10'
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0'>
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-white hover:bg-white/10'
              >
                {mobileMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-black/20 backdrop-blur-sm rounded-lg mt-2 border border-white/10'>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/20'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className='h-5 w-5' />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className='border-t border-white/20 my-2'></div>
                  <Link
                    href='/settings'
                    className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className='h-5 w-5' />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 w-full text-left'
                  >
                    <LogOut className='h-5 w-5' />
                    <span>Sign out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
