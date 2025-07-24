'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  Award,
  MessageCircle,
  Activity,
  Play,
  ArrowRight,
  Calendar,
  MessageCircle as MessageIcon,
} from 'lucide-react';
import { NextRouter } from 'next/router';

interface Workout {
  id: number;
  name: string;
  time: string;
  duration: string;
  trainer: string;
  type: string;
}

interface Activity {
  type: string;
  title: string;
  time: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface Stats {
  completedThisWeek: number;
  weeklyGoal: number;
  totalMinutes: number;
  avgHeartRate: number;
}

interface OverviewTabProps {
  stats: Stats;
  upcomingWorkouts: Workout[];
  recentActivities: Activity[];
  router: NextRouter;
}

const iconMap = {
  Dumbbell,
  Award,
  MessageCircle,
  Activity,
};

export default function OverviewTab({
  stats,
  upcomingWorkouts,
  recentActivities,
  router,
}: OverviewTabProps) {
  const weeklyProgress = (stats.completedThisWeek / stats.weeklyGoal) * 100;

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Upcoming Workouts Card */}
        <div className='lg:col-span-3'>
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-white'>
                    Upcoming Workouts
                  </CardTitle>
                  <CardDescription className='text-white/60'>
                    Your scheduled training sessions
                  </CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-purple-400 hover:text-purple-300'
                  onClick={() => router.push('/schedule')}
                >
                  View All
                  <ArrowRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {upcomingWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className='flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='p-2 bg-purple-500/20 rounded-lg'>
                      <Dumbbell className='h-5 w-5 text-purple-400' />
                    </div>
                    <div>
                      <h3 className='font-medium text-white'>{workout.name}</h3>
                      <p className='text-sm text-white/60'>
                        {workout.time} • {workout.duration}
                      </p>
                      <p className='text-xs text-white/60'>
                        with {workout.trainer}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      variant='outline'
                      className='border-purple-400/50 text-purple-400'
                    >
                      {workout.type}
                    </Badge>
                    <Button
                      size='sm'
                      className='bg-gradient-to-r from-purple-600 to-blue-600'
                    >
                      <Play className='w-3 h-3 mr-1' />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Recent Activities Card */}
        {/* <div className='lg:col-span-1'> */}
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-white'>Recent Activity</CardTitle>
              <CardDescription className='text-white/60'>
                Your latest achievements
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentActivities.map((activity, index) => {
                const Icon = iconMap[activity.icon as keyof typeof iconMap];
                return (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-white truncate'>
                        {activity.title}
                      </p>
                      <p className='text-xs text-white/50'>{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        {/* </div> */}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Stats Card */}
        <div className='lg:col-span-2'>
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-white'>This Week's Progress</CardTitle>
              <CardDescription className='text-white/60'>
                Your weekly fitness metrics
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-white/70'>Workouts Completed</span>
                  <span className='text-white'>
                    {stats.completedThisWeek}/{stats.weeklyGoal}
                  </span>
                </div>
                <Progress value={weeklyProgress} className='bg-white/20' />
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>
                    {stats.totalMinutes}
                  </div>
                  <div className='text-xs text-white/60'>Minutes Active</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>
                    {stats.avgHeartRate}
                  </div>
                  <div className='text-xs text-white/60'>Avg Heart Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Trainer Card */}
        <div className='lg:col-span-2'>
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
            <CardHeader>
              <CardTitle className='text-white'>Your Trainer</CardTitle>
              <CardDescription className='text-white/60'>
                Stay connected with your fitness coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-4 mb-6'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src='/placeholder.svg' alt='Sarah Mitchell' />
                  <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                    SM
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h3 className='font-semibold text-white'>Sarah Mitchell</h3>
                  <p className='text-sm text-white/60'>
                    Certified Personal Trainer
                  </p>
                  <div className='flex items-center mt-1'>
                    <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                    <span className='text-xs text-green-400'>Online now</span>
                  </div>
                </div>
              </div>
              <div className='flex space-x-2'>
                <Button
                  size='sm'
                  className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600'
                  onClick={() => router.push('/messages')}
                >
                  <MessageIcon className='w-4 h-4 mr-2' />
                  Message
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                >
                  <Calendar className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
