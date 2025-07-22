'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationHeader } from '@/components/navigation-header';
import {
  Play,
  Pause,
  Square,
  Dumbbell,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WorkoutPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    } catch (error) {
      console.error('Error checking session:', error);
      router.replace('/login');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const workoutPlans = [
    {
      id: 1,
      name: 'Upper Body Strength',
      duration: '45 min',
      exercises: 8,
      difficulty: 'Intermediate',
      calories: 320,
      description:
        'Focus on building upper body strength with compound movements',
    },
    {
      id: 2,
      name: 'HIIT Cardio Blast',
      duration: '30 min',
      exercises: 6,
      difficulty: 'Advanced',
      calories: 450,
      description: 'High-intensity interval training for maximum calorie burn',
    },
    {
      id: 3,
      name: 'Full Body Beginner',
      duration: '35 min',
      exercises: 10,
      difficulty: 'Beginner',
      calories: 280,
      description: 'Perfect introduction to strength training',
    },
    {
      id: 4,
      name: 'Core & Flexibility',
      duration: '25 min',
      exercises: 7,
      difficulty: 'Beginner',
      calories: 180,
      description: 'Strengthen your core and improve flexibility',
    },
  ];

  const startWorkout = (workout: any) => {
    setActiveWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  const endWorkout = () => {
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    setWorkoutTimer(0);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
          <p className='mt-4 text-white/70'>Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <NavigationHeader user={user} />

      <div className='container mx-auto px-4 py-8'>
        {/* Active Workout Timer */}
        {activeWorkout && (
          <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl mb-6'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='p-3 bg-purple-500/20 rounded-full'>
                    <Dumbbell className='h-6 w-6 text-purple-400' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white'>
                      {activeWorkout.name}
                    </h3>
                    <p className='text-white/60'>Active Workout</p>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-white'>
                      {formatTime(workoutTimer)}
                    </div>
                    <p className='text-xs text-white/60'>Elapsed Time</p>
                  </div>
                  <div className='flex space-x-2'>
                    {isWorkoutActive ? (
                      <Button
                        variant='outline'
                        className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                        onClick={pauseWorkout}
                      >
                        <Pause className='h-4 w-4 mr-2' />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        onClick={resumeWorkout}
                      >
                        <Play className='h-4 w-4 mr-2' />
                        Resume
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      className='border-red-400/50 text-red-400 hover:bg-red-500/10 bg-transparent'
                      onClick={endWorkout}
                    >
                      <Square className='h-4 w-4 mr-2' />
                      End
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Plans */}
        <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
          <CardHeader>
            <CardTitle className='text-white'>Available Workouts</CardTitle>
            <CardDescription className='text-white/60'>
              Choose a workout plan to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {workoutPlans.map((workout) => (
                <div
                  key={workout.id}
                  className='p-6 bg-white/5 rounded-lg border border-white/10'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-bold text-white mb-2'>
                        {workout.name}
                      </h3>
                      <p className='text-white/60 text-sm mb-3'>
                        {workout.description}
                      </p>
                    </div>
                    <Badge
                      variant='outline'
                      className={`${
                        workout.difficulty === 'Beginner'
                          ? 'border-green-400/50 text-green-400'
                          : workout.difficulty === 'Intermediate'
                          ? 'border-yellow-400/50 text-yellow-400'
                          : 'border-red-400/50 text-red-400'
                      }`}
                    >
                      {workout.difficulty}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-3 gap-4 mb-4'>
                    <div className='text-center'>
                      <div className='flex items-center justify-center mb-1'>
                        <Clock className='h-4 w-4 text-purple-400' />
                      </div>
                      <div className='text-sm font-medium text-white'>
                        {workout.duration}
                      </div>
                      <div className='text-xs text-white/60'>Duration</div>
                    </div>
                    <div className='text-center'>
                      <div className='flex items-center justify-center mb-1'>
                        <Target className='h-4 w-4 text-blue-400' />
                      </div>
                      <div className='text-sm font-medium text-white'>
                        {workout.exercises}
                      </div>
                      <div className='text-xs text-white/60'>Exercises</div>
                    </div>
                    <div className='text-center'>
                      <div className='flex items-center justify-center mb-1'>
                        <TrendingUp className='h-4 w-4 text-green-400' />
                      </div>
                      <div className='text-sm font-medium text-white'>
                        {workout.calories}
                      </div>
                      <div className='text-xs text-white/60'>Calories</div>
                    </div>
                  </div>

                  <Button
                    className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    onClick={() => startWorkout(workout)}
                    disabled={activeWorkout?.id === workout.id}
                  >
                    {activeWorkout?.id === workout.id ? (
                      <>
                        <CheckCircle className='h-4 w-4 mr-2' />
                        Active
                      </>
                    ) : (
                      <>
                        <Play className='h-4 w-4 mr-2' />
                        Start Workout
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl mt-6'>
          <CardHeader>
            <CardTitle className='text-white'>Recent Workouts</CardTitle>
            <CardDescription className='text-white/60'>
              Your workout history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[
                {
                  name: 'Upper Body Strength',
                  date: 'Today',
                  duration: '42 min',
                  calories: 315,
                },
                {
                  name: 'HIIT Cardio Blast',
                  date: 'Yesterday',
                  duration: '28 min',
                  calories: 420,
                },
                {
                  name: 'Full Body Beginner',
                  date: '2 days ago',
                  duration: '35 min',
                  calories: 280,
                },
              ].map((workout, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='p-2 bg-purple-500/20 rounded-lg'>
                      <Dumbbell className='h-5 w-5 text-purple-400' />
                    </div>
                    <div>
                      <h3 className='font-medium text-white'>{workout.name}</h3>
                      <p className='text-sm text-white/60'>{workout.date}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-white'>{workout.duration}</p>
                    <p className='text-sm text-white/60'>
                      {workout.calories} calories
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
