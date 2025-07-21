'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Dumbbell, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log(
          'Login page - Initial session check:',
          session?.user?.email || 'no session'
        );

        if (session?.user) {
          console.log('User already logged in, redirecting to dashboard');
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkUser();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login for:', formData.email);

      // Use Supabase client directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login Failed',
          description:
            error.message || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (!data.user || !data.session) {
        console.error('No user or session data returned');
        toast({
          title: 'Login Failed',
          description: 'No user data returned. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Login successful for user:', data.user.email);
      console.log('Session created:', !!data.session);
      console.log(
        'Access token:',
        data.session.access_token ? 'present' : 'missing'
      );

      toast({
        title: 'Welcome back! 👋',
        description: 'You have been successfully logged in.',
      });

      // Wait a moment for the session to be fully established
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force a page refresh to ensure middleware picks up the session
      console.log('Redirecting to dashboard...');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center space-x-2 mb-6'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center'>
              <Dumbbell className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-white'>FuelForm</span>
          </Link>
        </div>

        <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-white'>
              Welcome Back
            </CardTitle>
            <CardDescription className='text-gray-300'>
              Sign in to your account to continue your fitness journey
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-white flex items-center'
                  >
                    <Mail className='w-4 h-4 mr-2' />
                    Email Address
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                    placeholder='Enter your email address'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='password'
                    className='text-white flex items-center'
                  >
                    <Lock className='w-4 h-4 mr-2' />
                    Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400 pr-10'
                      placeholder='Enter your password'
                      required
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='remember'
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    className='border-white/30'
                  />
                  <Label htmlFor='remember' className='text-sm text-gray-300'>
                    Remember me
                  </Label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-sm text-purple-400 hover:text-purple-300'
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold'
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full bg-white/20' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-slate-900 px-2 text-gray-400'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                className='bg-white/10 border-white/30 text-white hover:bg-white/20'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='currentColor'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                Google
              </Button>
              <Button
                variant='outline'
                className='bg-white/10 border-white/30 text-white hover:bg-white/20'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                Facebook
              </Button>
            </div>

            <div className='text-center mb-6'>
              <div className='mb-4'>
                <Separator className='bg-white/20' />
              </div>
              <p className='text-gray-300'>
                New to FuelForm?{' '}
                <Link
                  href='/signup'
                  className='text-purple-400 hover:text-purple-300 font-medium'
                >
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
