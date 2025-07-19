'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type') || 'client';
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = userType === 'trainer' ? 4 : 3;

  const [clientData, setClientData] = useState({
    goals: [] as string[],
    fitnessLevel: '',
    workoutFrequency: '',
    dietaryRestrictions: '',
    injuries: '',
  });

  const [trainerData, setTrainerData] = useState({
    bio: '',
    specialties: [] as string[],
    certifications: [] as string[],
    experience: '',
    pricing: '',
    availability: '',
  });

  const clientGoals = [
    'Weight Loss',
    'Muscle Building',
    'Strength Training',
    'Endurance',
    'Flexibility',
    'Sports Performance',
    'General Fitness',
    'Rehabilitation',
  ];

  const trainerSpecialties = [
    'Weight Loss',
    'Muscle Building',
    'Strength Training',
    'Powerlifting',
    'Bodybuilding',
    'CrossFit',
    'Yoga',
    'Pilates',
    'Sports Training',
    'Rehabilitation',
    'Nutrition Coaching',
    'Senior Fitness',
  ];

  const certifications = [
    'NASM',
    'ACE',
    'ACSM',
    'NSCA',
    'ISSA',
    'NCSF',
    'NFPT',
    'Other',
  ];

  const handleGoalToggle = (goal: string) => {
    setClientData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setTrainerData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setTrainerData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    setError('');

    try {
      const profileData = userType === 'client' ? clientData : trainerData;

      console.log('Submitting onboarding data:', { userType, profileData });

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType,
          profileData,
        }),
      });

      const data = await response.json();
      console.log('Onboarding response:', data);

      if (response.ok) {
        // Success! Use router.push instead of window.location.href
        console.log('Onboarding successful, redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to complete onboarding');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderClientStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                What are your fitness goals?
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Select all that apply
              </p>
              <div className='grid grid-cols-2 gap-3'>
                {clientGoals.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      clientData.goals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className='text-sm font-medium dark:text-gray-200'>
                      {goal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Tell us about your fitness background
              </h2>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='fitnessLevel' className='dark:text-gray-200'>
                    Current Fitness Level
                  </Label>
                  <Select
                    value={clientData.fitnessLevel}
                    onValueChange={(value) =>
                      setClientData((prev) => ({
                        ...prev,
                        fitnessLevel: value,
                      }))
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                      <SelectValue placeholder='Select your fitness level' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-700 dark:border-gray-600'>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor='workoutFrequency'
                    className='dark:text-gray-200'
                  >
                    How often do you currently work out?
                  </Label>
                  <Select
                    value={clientData.workoutFrequency}
                    onValueChange={(value) =>
                      setClientData((prev) => ({
                        ...prev,
                        workoutFrequency: value,
                      }))
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                      <SelectValue placeholder='Select frequency' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-700 dark:border-gray-600'>
                      <SelectItem value='never'>Never</SelectItem>
                      <SelectItem value='1-2'>1-2 times per week</SelectItem>
                      <SelectItem value='3-4'>3-4 times per week</SelectItem>
                      <SelectItem value='5+'>5+ times per week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Health & Safety Information
              </h2>

              <div className='space-y-4'>
                <div>
                  <Label
                    htmlFor='dietaryRestrictions'
                    className='dark:text-gray-200'
                  >
                    Dietary Restrictions or Allergies
                  </Label>
                  <Textarea
                    id='dietaryRestrictions'
                    placeholder='List any dietary restrictions, allergies, or food preferences...'
                    value={clientData.dietaryRestrictions}
                    onChange={(e) =>
                      setClientData((prev) => ({
                        ...prev,
                        dietaryRestrictions: e.target.value,
                      }))
                    }
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>

                <div>
                  <Label htmlFor='injuries' className='dark:text-gray-200'>
                    Previous Injuries or Physical Limitations
                  </Label>
                  <Textarea
                    id='injuries'
                    placeholder='Describe any injuries, surgeries, or physical limitations we should know about...'
                    value={clientData.injuries}
                    onChange={(e) =>
                      setClientData((prev) => ({
                        ...prev,
                        injuries: e.target.value,
                      }))
                    }
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTrainerStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Tell us about yourself
              </h2>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='bio' className='dark:text-gray-200'>
                    Professional Bio
                  </Label>
                  <Textarea
                    id='bio'
                    placeholder='Write a compelling bio that showcases your experience and training philosophy...'
                    value={trainerData.bio}
                    onChange={(e) =>
                      setTrainerData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={4}
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>

                <div>
                  <Label htmlFor='experience' className='dark:text-gray-200'>
                    Years of Experience
                  </Label>
                  <Select
                    value={trainerData.experience}
                    onValueChange={(value) =>
                      setTrainerData((prev) => ({ ...prev, experience: value }))
                    }
                  >
                    <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
                      <SelectValue placeholder='Select experience level' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-gray-700 dark:border-gray-600'>
                      <SelectItem value='0-1'>0-1 years</SelectItem>
                      <SelectItem value='2-5'>2-5 years</SelectItem>
                      <SelectItem value='6-10'>6-10 years</SelectItem>
                      <SelectItem value='10+'>10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Your Specialties
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Select your areas of expertise
              </p>
              <div className='grid grid-cols-2 gap-3'>
                {trainerSpecialties.map((specialty) => (
                  <div
                    key={specialty}
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      trainerData.specialties.includes(specialty)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className='text-sm font-medium dark:text-gray-200'>
                      {specialty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Certifications
              </h2>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Select your certifications
              </p>
              <div className='grid grid-cols-2 gap-3'>
                {certifications.map((cert) => (
                  <div
                    key={cert}
                    onClick={() => handleCertificationToggle(cert)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      trainerData.certifications.includes(cert)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className='text-sm font-medium dark:text-gray-200'>
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4 dark:text-white'>
                Pricing & Availability
              </h2>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='pricing' className='dark:text-gray-200'>
                    Monthly Coaching Rate ($)
                  </Label>
                  <Input
                    id='pricing'
                    type='number'
                    placeholder='e.g., 150'
                    value={trainerData.pricing}
                    onChange={(e) =>
                      setTrainerData((prev) => ({
                        ...prev,
                        pricing: e.target.value,
                      }))
                    }
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>

                <div>
                  <Label htmlFor='availability' className='dark:text-gray-200'>
                    Availability
                  </Label>
                  <Textarea
                    id='availability'
                    placeholder='Describe your availability for new clients...'
                    value={trainerData.availability}
                    onChange={(e) =>
                      setTrainerData((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              FuelForm
            </span>
            <ThemeToggle />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {userType === 'client'
              ? "Let's Get You Started"
              : 'Set Up Your Trainer Profile'}
          </h1>
          <p className='text-gray-600 dark:text-gray-300 mt-2'>
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className='mb-8'>
          <Progress value={(currentStep / totalSteps) * 100} className='h-2' />
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

            {userType === 'client' ? renderClientStep() : renderTrainerStep()}

            <div className='flex justify-between mt-8'>
              <Button
                variant='outline'
                onClick={prevStep}
                disabled={currentStep === 1}
                className='flex items-center space-x-2 bg-transparent dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                <ArrowLeft className='h-4 w-4' />
                <span>Previous</span>
              </Button>

              <Button
                onClick={nextStep}
                disabled={isLoading}
                className='flex items-center space-x-2 dark:bg-blue-600 dark:hover:bg-blue-700'
              >
                <span>
                  {isLoading
                    ? 'Saving...'
                    : currentStep === totalSteps
                    ? 'Complete'
                    : 'Next'}
                </span>
                <ArrowRight className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
