'use client';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { NextRouter } from 'next/router';

interface WelcomeSectionProps {
  user: any;
  getUserName: (user: any) => string;
  router: NextRouter;
}

export default function WelcomeSection({
  user,
  getUserName,
  router,
}: WelcomeSectionProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div>
        <h1 className='text-3xl font-bold text-white'>
          Welcome back, {getUserName(user)}!
        </h1>
        <p className='text-white/70'>
          Ready to crush your fitness goals today?
        </p>
      </div>
      <Button
        className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
        onClick={() => router.push('/workout')}
      >
        <Play className='w-4 h-4 mr-2' />
        Start Workout
      </Button>
    </div>
  );
}
