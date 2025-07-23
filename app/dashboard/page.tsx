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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Calendar,
  Award,
  Clock,
  Dumbbell,
  Activity,
  Target,
  MessageCircle,
  Play,
  CheckCircle,
  FlameIcon as Fire,
  Zap,
  Heart,
  Trophy,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { NavigationHeader } from '@/components/navigation-header';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsCompleted: 24,
    totalWorkouts: 30,
    streakDays: 7,
    caloriesBurned: 2450,
    totalMinutes: 1280,
    avgHeartRate: 142,
    weeklyGoal: 5,
    completedThisWeek: 3,
  });
  const router = useRouter();

  useEffect(() => {
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.replace('/login');
      } else if (session) {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkSession = async () => {
    try {

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        setLoading(false);
        router.replace('/login');
        return;
      }

      if (!session || !session.user) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
      router.replace('/login');
    }
  };

  const getUserName = (user: any) => {
    return (
      user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
          <p className='mt-4 text-white/70'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-white/70'>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (stats.workoutsCompleted / stats.totalWorkouts) * 100;
  const weeklyProgress = (stats.completedThisWeek / stats.weeklyGoal) * 100;

  const upcomingWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      time: '2:00 PM',
      duration: '45 min',
      trainer: 'Sarah Mitchell',
      type: 'Strength',
    },
    {
      id: 2,
      name: 'HIIT Cardio',
      time: 'Tomorrow 9:00 AM',
      duration: '30 min',
      trainer: 'Mike Johnson',
      type: 'Cardio',
    },
    {
      id: 3,
      name: 'Yoga Flow',
      time: 'Friday 6:00 PM',
      duration: '60 min',
      trainer: 'Emma Davis',
      type: 'Flexibility',
    },
  ];

  const recentActivities = [
    {
      type: 'workout',
      title: 'Completed Upper Body Strength',
      time: '2 hours ago',
      icon: Dumbbell,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      type: 'achievement',
      title: '7-Day Streak Achieved!',
      time: '1 day ago',
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      type: 'message',
      title: 'New message from Sarah',
      time: '3 hours ago',
      icon: MessageCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      type: 'workout',
      title: 'Cardio Session Completed',
      time: '2 days ago',
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header - Full Width */}
      <NavigationHeader user={user} />

      {/* Main Content */}
      <div className='container mx-auto p-4 space-y-6'>
        {/* Welcome Section */}
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

        {/* Quick Stats Cards */}
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
              <Progress
                value={progressPercentage}
                className='mt-2 bg-white/20'
              />
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
                <span className='text-xs text-green-400'>
                  +12% from last month
                </span>
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

        {/* Main Content */}
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList className='bg-white/10 backdrop-blur-lg border border-white/20'>
            <TabsTrigger
              value='overview'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='workouts'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Workouts
            </TabsTrigger>
            <TabsTrigger
              value='progress'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value='nutrition'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Nutrition
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Upcoming Workouts */}
              <div className='lg:col-span-2'>
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
                            <h3 className='font-medium text-white'>
                              {workout.name}
                            </h3>
                            <p className='text-sm text-white/60'>
                              {workout.time} • {workout.duration}
                            </p>
                            <p className='text-xs text-white/50'>
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

              {/* Recent Activity */}
              <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
                <CardHeader>
                  <CardTitle className='text-white'>Recent Activity</CardTitle>
                  <CardDescription className='text-white/60'>
                    Your latest achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {recentActivities.map((activity, index) => (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-white truncate'>
                          {activity.title}
                        </p>
                        <p className='text-xs text-white/50'>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
                <CardHeader>
                  <CardTitle className='text-white'>
                    This Week's Progress
                  </CardTitle>
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
                      <div className='text-xs text-white/60'>
                        Minutes Active
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-bold text-white'>
                        {stats.avgHeartRate}
                      </div>
                      <div className='text-xs text-white/60'>
                        Avg Heart Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
                <CardHeader>
                  <CardTitle className='text-white'>Your Trainer</CardTitle>
                  <CardDescription className='text-white/60'>
                    Stay connected with your fitness coach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center space-x-4 mb-4'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage
                        src='/placeholder.svg'
                        alt='Sarah Mitchell'
                      />
                      <AvatarFallback className='bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
                        SM
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-white'>
                        Sarah Mitchell
                      </h3>
                      <p className='text-sm text-white/60'>
                        Certified Personal Trainer
                      </p>
                      <div className='flex items-center mt-1'>
                        <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                        <span className='text-xs text-green-400'>
                          Online now
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <Button
                      size='sm'
                      className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600'
                      onClick={() => router.push('/messages')}
                    >
                      <MessageCircle className='w-4 h-4 mr-2' />
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
          </TabsContent>

          <TabsContent value='workouts' className='space-y-4'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-white'>
                      Your Workout Plans
                    </CardTitle>
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
                  {[
                    {
                      name: 'Strength Building',
                      progress: 75,
                      sessions: 12,
                      type: 'Strength',
                    },
                    {
                      name: 'Cardio Blast',
                      progress: 60,
                      sessions: 8,
                      type: 'Cardio',
                    },
                    {
                      name: 'Flexibility Focus',
                      progress: 40,
                      sessions: 6,
                      type: 'Flexibility',
                    },
                  ].map((plan, index) => (
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
                        <Progress
                          value={plan.progress}
                          className='bg-white/20'
                        />
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
          </TabsContent>

          <TabsContent value='progress' className='space-y-4'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Progress Tracking</CardTitle>
                <CardDescription className='text-white/60'>
                  Monitor your fitness journey over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                  <div className='text-center p-4 bg-white/5 rounded-lg'>
                    <Trophy className='h-8 w-8 text-yellow-400 mx-auto mb-2' />
                    <div className='text-2xl font-bold text-white'>15</div>
                    <div className='text-sm text-white/60'>Goals Achieved</div>
                  </div>
                  <div className='text-center p-4 bg-white/5 rounded-lg'>
                    <Heart className='h-8 w-8 text-red-400 mx-auto mb-2' />
                    <div className='text-2xl font-bold text-white'>142</div>
                    <div className='text-sm text-white/60'>Avg Heart Rate</div>
                  </div>
                  <div className='text-center p-4 bg-white/5 rounded-lg'>
                    <Activity className='h-8 w-8 text-green-400 mx-auto mb-2' />
                    <div className='text-2xl font-bold text-white'>85%</div>
                    <div className='text-sm text-white/60'>Goal Completion</div>
                  </div>
                </div>
                <div className='h-64 bg-white/5 rounded-lg flex items-center justify-center'>
                  <p className='text-white/60'>
                    Progress charts will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='nutrition' className='space-y-4'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Nutrition Plan</CardTitle>
                <CardDescription className='text-white/60'>
                  Your personalized meal plans and dietary guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-white'>
                      Today's Meals
                    </h3>
                    {[
                      { meal: 'Breakfast', calories: 420, status: 'completed' },
                      { meal: 'Lunch', calories: 580, status: 'completed' },
                      { meal: 'Dinner', calories: 650, status: 'pending' },
                      { meal: 'Snacks', calories: 200, status: 'pending' },
                    ].map((meal, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                      >
                        <div className='flex items-center space-x-3'>
                          {meal.status === 'completed' ? (
                            <CheckCircle className='h-5 w-5 text-green-400' />
                          ) : (
                            <Clock className='h-5 w-5 text-white/40' />
                          )}
                          <div>
                            <p className='font-medium text-white'>
                              {meal.meal}
                            </p>
                            <p className='text-sm text-white/60'>
                              {meal.calories} calories
                            </p>
                          </div>
                        </div>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-white/30 text-white bg-transparent'
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-white'>
                      Daily Summary
                    </h3>
                    <div className='p-4 bg-white/5 rounded-lg space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-white/70'>Calories</span>
                        <span className='text-white'>1,200 / 1,850</span>
                      </div>
                      <Progress value={65} className='bg-white/20' />

                      <div className='flex justify-between'>
                        <span className='text-white/70'>Protein</span>
                        <span className='text-white'>85g / 120g</span>
                      </div>
                      <Progress value={71} className='bg-white/20' />

                      <div className='flex justify-between'>
                        <span className='text-white/70'>Carbs</span>
                        <span className='text-white'>140g / 200g</span>
                      </div>
                      <Progress value={70} className='bg-white/20' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
