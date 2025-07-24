'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

interface WorkoutPlan {
  name: string;
  progress: number;
  sessions: number;
  type: string;
}

interface WorkoutsTabProps {
  workoutPlans: WorkoutPlan[];
}

export default function WorkoutsTab({ workoutPlans }: WorkoutsTabProps) {
  return (
    <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-white'>Your Workout Plans</CardTitle>
            <CardDescription className='text-white/60'>
              Personalized training programs
            </CardDescription>
          </div>
          <Button className='bg-gradient-to-r from-purple-600 to-blue-600'>
            <Plus className='w-4 h-4 mr-2' />
            New Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {workoutPlans.map((plan, index) => (
            <div
              key={index}
              className='p-4 bg-white/5 rounded-lg border border-white/10'
            >
              <div className='flex items-center justify-between mb-3'>
                <h3 className='font-medium text-white'>{plan.name}</h3>
                <Badge
                  variant='outline'
                  className='border-purple-400/50 text-purple-400'
                >
                  {plan.type}
                </Badge>
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-white/70'>Progress</span>
                  <span className='text-white'>{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className='bg-white/20' />
                <p className='text-xs text-white/60'>
                  {plan.sessions} sessions completed
                </p>
              </div>
              <Button
                size='sm'
                className='w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600'
              >
                Continue
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
