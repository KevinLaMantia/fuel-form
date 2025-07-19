'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Failed to sign in');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <span className='text-2xl font-bold text-gray-900 dark:text-white'>
                FuelForm
              </span>
            </Link>
            <ThemeToggle />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Welcome Back
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-2'>
            Sign in to your account
          </p>
        </div>

        <Card className='dark:bg-gray-800 dark:border-gray-700'>
          <CardContent className='pt-6'>
            {error && (
              <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2'>
                <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
                <span className='text-sm text-red-700 dark:text-red-300'>
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email' className='dark:text-gray-200'>
                  Email
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='dark:text-gray-200'>
                  Password
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
              </div>

              <div className='flex items-center justify-between'>
                <Link
                  href='/forgot-password'
                  className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                className='w-full dark:bg-blue-600 dark:hover:bg-blue-700'
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {"Don't have an account? "}
                <Link
                  href='/signup'
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
