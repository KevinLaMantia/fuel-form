'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { NavigationHeader } from '@/components/navigation-header';
import LoadingSpinner from '@/components/loading-spinner';
import WelcomeSection from './components/welcome-section';
import StatsCards from './components/stats-card';
import DashboardTabs from './components/dashboard-tabs';

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
  workoutsCompleted: number;
  totalWorkouts: number;
  streakDays: number;
  caloriesBurned: number;
  totalMinutes: number;
  avgHeartRate: number;
  weeklyGoal: number;
  completedThisWeek: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
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
    const simulateLoading = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
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
        console.error('Error during loading:', error);
        setLoading(false);
        router.replace('/login');
      }
    };

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

    simulateLoading();

    return () => subscription.unsubscribe();
  }, [router]);

  const getUserName = (user: any) => {
    return (
      user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    );
  };

  const upcomingWorkouts: Workout[] = [
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

  const recentActivities: Activity[] = [
    {
      type: 'workout',
      title: 'Completed Upper Body Strength',
      time: '2 hours ago',
      icon: 'Dumbbell',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      type: 'achievement',
      title: '7-Day Streak Achieved!',
      time: '1 day ago',
      icon: 'Award',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      type: 'message',
      title: 'New message from Sarah',
      time: '3 hours ago',
      icon: 'MessageCircle',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      type: 'workout',
      title: 'Cardio Session Completed',
      time: '2 days ago',
      icon: 'Activity',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  const workoutPlans = [
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
  ];

  const nutritionMeals = [
    { meal: 'Breakfast', calories: 420, status: 'completed' },
    { meal: 'Lunch', calories: 580, status: 'completed' },
    { meal: 'Dinner', calories: 650, status: 'pending' },
    { meal: 'Snacks', calories: 200, status: 'pending' },
  ];

  if (loading) {
    return <LoadingSpinner />;
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <NavigationHeader user={user} />
      <div className='container mx-auto p-4 space-y-6'>
        <WelcomeSection user={user} getUserName={getUserName} router={router} />
        <StatsCards stats={stats} />
        <DashboardTabs
          stats={stats}
          upcomingWorkouts={upcomingWorkouts}
          recentActivities={recentActivities}
          workoutPlans={workoutPlans}
          nutritionMeals={nutritionMeals}
          router={router}
        />
      </div>
    </div>
  );
}
