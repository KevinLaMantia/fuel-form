'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  FlameIcon as Fire,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

interface Stats {
  workoutsCompleted: number;
  totalWorkouts: number;
  streakDays: number;
  caloriesBurned: number;
  totalMinutes: number;
  avgHeartRate: number;
  weeklyGoal: number;
  completedThisWeek: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const progressPercentage =
    (stats.workoutsCompleted / stats.totalWorkouts) * 100;
  const weeklyProgress = (stats.completedThisWeek / stats.weeklyGoal) * 100;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Workouts This Month
          </CardTitle>
          <div className='p-2 bg-blue-500/20 rounded-lg'>
            <Dumbbell className='h-4 w-4 text-blue-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {stats.workoutsCompleted}
          </div>
          <p className='text-xs text-white/60'>
            of {stats.totalWorkouts} planned
          </p>
          <Progress value={progressPercentage} className='mt-2 bg-white/20' />
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Current Streak
          </CardTitle>
          <div className='p-2 bg-orange-500/20 rounded-lg'>
            <Fire className='h-4 w-4 text-orange-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {stats.streakDays}
          </div>
          <p className='text-xs text-white/60'>days in a row</p>
          <div className='flex items-center mt-2'>
            <Zap className='h-3 w-3 text-orange-400 mr-1' />
            <span className='text-xs text-orange-400'>On fire!</span>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Calories Burned
          </CardTitle>
          <div className='p-2 bg-red-500/20 rounded-lg'>
            <TrendingUp className='h-4 w-4 text-red-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {stats.caloriesBurned.toLocaleString()}
          </div>
          <p className='text-xs text-white/60'>this month</p>
          <div className='flex items-center mt-2'>
            <TrendingUp className='h-3 w-3 text-green-400 mr-1' />
            <span className='text-xs text-green-400'>+12% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Weekly Goal
          </CardTitle>
          <div className='p-2 bg-green-500/20 rounded-lg'>
            <Target className='h-4 w-4 text-green-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {stats.completedThisWeek}/{stats.weeklyGoal}
          </div>
          <p className='text-xs text-white/60'>workouts completed</p>
          <Progress value={weeklyProgress} className='mt-2 bg-white/20' />
        </CardContent>
      </Card>
    </div>
  );
}
