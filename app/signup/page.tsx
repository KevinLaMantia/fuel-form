'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Dumbbell,
  Eye,
  EyeOff,
  User,
  Users,
  Target,
  Award,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserType = searchParams.get('type') || 'client';
  const plan = searchParams.get('plan');
  // supabase client is imported directly

  const [userType, setUserType] = useState<'client' | 'trainer'>(
    initialUserType as 'client' | 'trainer'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    // Client specific
    fitnessGoals: '',
    experienceLevel: '',
    medicalConditions: '',
    // Trainer specific
    certifications: '',
    specializations: '',
    experience: '',
    bio: '',
    hourlyRate: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserTypeChange = (newUserType: 'client' | 'trainer') => {
    setUserType(newUserType);
    // Clear user-type specific fields when switching
    setFormData((prev) => ({
      ...prev,
      // Reset client fields
      fitnessGoals: '',
      experienceLevel: '',
      medicalConditions: '',
      // Reset trainer fields
      certifications: '',
      specializations: '',
      experience: '',
      bio: '',
      hourlyRate: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started');

    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        plan,
        // Include user-type specific data
        ...(userType === 'client'
          ? {
              fitnessGoals: formData.fitnessGoals,
              experienceLevel: formData.experienceLevel,
              medicalConditions: formData.medicalConditions,
            }
          : {
              certifications: formData.certifications,
              specializations: formData.specializations,
              experience: formData.experience,
              bio: formData.bio,
              hourlyRate: formData.hourlyRate,
            }),
      };

      console.log('Sending signup request:', {
        ...requestData,
        password: '[REDACTED]',
      });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Signup response:', result);

      if (response.ok) {
        toast({
          title: 'Account Created! 🎉',
          description:
            result.message || 'Please check your email to verify your account.',
        });

        // Small delay to ensure session is established
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 1000);
      } else {
        console.error('Signup failed:', result);
        toast({
          title: 'Sign Up Failed',
          description:
            result.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'facebook') => {
    try {
      console.log(`Attempting ${provider} OAuth signup`);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${
            window.location.origin
          }/auth/callback?userType=${userType}&plan=${plan || ''}`,
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        toast({
          title: 'OAuth Signup Failed',
          description:
            error.message ||
            `Failed to signup with ${provider}. Please try again.`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      toast({
        title: 'OAuth Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center space-x-2 mb-6'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center'>
              <Dumbbell className='w-6 h-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-white'>FuelForm</span>
          </Link>

          {/* User Type Toggle */}
          <div className='flex justify-center mb-6'>
            <div className='bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20'>
              <div className='flex'>
                <Button
                  type='button'
                  variant={userType === 'client' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleUserTypeChange('client')}
                  className={`
                    px-6 py-2 rounded-md transition-all duration-200
                    ${
                      userType === 'client'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <User className='w-4 h-4 mr-2' />
                  Client
                </Button>
                <Button
                  type='button'
                  variant={userType === 'trainer' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => handleUserTypeChange('trainer')}
                  className={`
                    px-6 py-2 rounded-md transition-all duration-200
                    ${
                      userType === 'trainer'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Users className='w-4 h-4 mr-2' />
                  Trainer
                </Button>
              </div>
            </div>
          </div>

          {plan && (
            <div className='mb-4'>
              <Badge
                variant='outline'
                className='border-yellow-500 text-yellow-400'
              >
                <Award className='w-4 h-4 mr-2' />
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Selected
              </Badge>
            </div>
          )}
        </div>

        <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-white'>
              Create Your {userType === 'client' ? 'Client' : 'Trainer'} Account
            </CardTitle>
            <CardDescription className='text-gray-300'>
              {userType === 'client'
                ? 'Start your fitness transformation journey today'
                : 'Join our community of expert fitness professionals'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* OAuth Buttons */}
            <div className='grid gap-4'>
              <Button
                variant='outline'
                className='bg-white/10 border-white/30 text-white hover:bg-white/20'
                onClick={() => handleOAuthSignup('google')}
                type='button'
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
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full bg-white/20' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-slate-900 px-2 text-gray-400'>
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-white flex items-center'>
                  <User className='w-5 h-5 mr-2' />
                  Basic Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='fullName' className='text-white'>
                      Full Name *
                    </Label>
                    <Input
                      id='fullName'
                      type='text'
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                      placeholder='Enter your full name'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-white'>
                      Email Address *
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                      placeholder='Enter your email'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='text-white'>
                      Phone Number
                    </Label>
                    <Input
                      id='phone'
                      type='tel'
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                      placeholder='Enter your phone number'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='dateOfBirth' className='text-white'>
                      Date of Birth
                    </Label>
                    <Input
                      id='dateOfBirth'
                      type='date'
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange('dateOfBirth', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='password' className='text-white'>
                      Password *
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
                        placeholder='Create a strong password'
                        required
                        minLength={6}
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

                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword' className='text-white'>
                      Confirm Password *
                    </Label>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-gray-400 pr-10'
                        placeholder='Confirm your password'
                        required
                        minLength={6}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className='bg-white/20' />

              {/* User Type Specific Fields */}
              {userType === 'client' ? (
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-white flex items-center'>
                    <Target className='w-5 h-5 mr-2' />
                    Fitness Information
                  </h3>

                  <div className='space-y-2'>
                    <Label htmlFor='fitnessGoals' className='text-white'>
                      Fitness Goals
                    </Label>
                    <Textarea
                      id='fitnessGoals'
                      value={formData.fitnessGoals}
                      onChange={(e) =>
                        handleInputChange('fitnessGoals', e.target.value)
                      }
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                      placeholder='Describe your fitness goals (e.g., weight loss, muscle gain, endurance)'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='experienceLevel' className='text-white'>
                        Experience Level
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange('experienceLevel', value)
                        }
                        value={formData.experienceLevel}
                      >
                        <SelectTrigger className='bg-white/10 border-white/30 text-white'>
                          <SelectValue placeholder='Select your experience level' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='beginner'>Beginner</SelectItem>
                          <SelectItem value='intermediate'>
                            Intermediate
                          </SelectItem>
                          <SelectItem value='advanced'>Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='medicalConditions' className='text-white'>
                        Medical Conditions (Optional)
                      </Label>
                      <Input
                        id='medicalConditions'
                        type='text'
                        value={formData.medicalConditions}
                        onChange={(e) =>
                          handleInputChange('medicalConditions', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                        placeholder='Any medical conditions to consider'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-white flex items-center'>
                    <Award className='w-5 h-5 mr-2' />
                    Professional Information
                  </h3>

                  <div className='space-y-2'>
                    <Label htmlFor='bio' className='text-white'>
                      Professional Bio
                    </Label>
                    <Textarea
                      id='bio'
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                      placeholder='Tell clients about your background and training philosophy'
                      rows={4}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='certifications' className='text-white'>
                        Certifications *
                      </Label>
                      <Input
                        id='certifications'
                        type='text'
                        value={formData.certifications}
                        onChange={(e) =>
                          handleInputChange('certifications', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                        placeholder='e.g., NASM, ACE, ACSM'
                        required={userType === 'trainer'}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='experience' className='text-white'>
                        Years of Experience *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange('experience', value)
                        }
                        value={formData.experience}
                      >
                        <SelectTrigger className='bg-white/10 border-white/30 text-white'>
                          <SelectValue placeholder='Select experience' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='1-2'>1-2 years</SelectItem>
                          <SelectItem value='3-5'>3-5 years</SelectItem>
                          <SelectItem value='6-10'>6-10 years</SelectItem>
                          <SelectItem value='10+'>10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='specializations' className='text-white'>
                        Specializations
                      </Label>
                      <Input
                        id='specializations'
                        type='text'
                        value={formData.specializations}
                        onChange={(e) =>
                          handleInputChange('specializations', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                        placeholder='e.g., Weight Loss, Strength Training'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='hourlyRate' className='text-white'>
                        Hourly Rate ($)
                      </Label>
                      <Input
                        id='hourlyRate'
                        type='number'
                        value={formData.hourlyRate}
                        onChange={(e) =>
                          handleInputChange('hourlyRate', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-gray-400'
                        placeholder='Your hourly rate'
                        min='0'
                        step='0.01'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='terms'
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked === true)
                  }
                  className='border-white/30'
                />
                <Label htmlFor='terms' className='text-sm text-gray-300'>
                  I agree to the{' '}
                  <Link
                    href='/terms'
                    className='text-purple-400 hover:text-purple-300 underline'
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='/privacy'
                    className='text-purple-400 hover:text-purple-300 underline'
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type='submit'
                disabled={isLoading || !agreedToTerms}
                className='w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold'
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className='text-center'>
              <p className='text-gray-300'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-purple-400 hover:text-purple-300 font-medium'
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
