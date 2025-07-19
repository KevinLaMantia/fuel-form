'use client';

import type React from 'react';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Target, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'client';
  const [userType, setUserType] = useState(defaultType);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      return "Passwords don't match";
    if (!formData.agreeToTerms) return 'You must agree to the terms';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to onboarding
        window.location.href = `/onboarding?type=${userType}`;
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
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
            Create Your Account
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-2'>
            Join the FuelForm community today
          </p>
        </div>

        <Card className='dark:bg-gray-800 dark:border-gray-700'>
          <CardHeader className='pb-4'>
            <Tabs
              value={userType}
              onValueChange={setUserType}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-2 dark:bg-gray-700'>
                <TabsTrigger
                  value='client'
                  className='flex items-center space-x-2 dark:data-[state=active]:bg-gray-600'
                >
                  <Target className='h-4 w-4' />
                  <span>Client</span>
                </TabsTrigger>
                <TabsTrigger
                  value='trainer'
                  className='flex items-center space-x-2 dark:data-[state=active]:bg-gray-600'
                >
                  <Users className='h-4 w-4' />
                  <span>Trainer</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {error && (
              <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2'>
                <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
                <span className='text-sm text-red-700 dark:text-red-300'>
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='dark:text-gray-200'>
                    First Name
                  </Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='dark:text-gray-200'>
                    Last Name
                  </Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>
              </div>

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

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword' className='dark:text-gray-200'>
                  Confirm Password
                </Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='agreeToTerms'
                  name='agreeToTerms'
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked as boolean,
                    }))
                  }
                />
                <Label
                  htmlFor='agreeToTerms'
                  className='text-sm dark:text-gray-300'
                >
                  I agree to the{' '}
                  <Link
                    href='/terms'
                    className='text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='/privacy'
                    className='text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type='submit'
                className='w-full dark:bg-blue-600 dark:hover:bg-blue-700'
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
