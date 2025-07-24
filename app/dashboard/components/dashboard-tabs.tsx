'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './overview-tab';
import WorkoutsTab from './workouts-tab';
import ProgressTab from './progress-tab';
import NutritionTab from './nutrition-tab';
import { useRouter } from 'next/navigation';

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

interface WorkoutPlan {
  name: string;
  progress: number;
  sessions: number;
  type: string;
}

interface NutritionMeal {
  meal: string;
  calories: number;
  status: string;
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

interface DashboardTabsProps {
  stats: Stats;
  upcomingWorkouts: Workout[];
  recentActivities: Activity[];
  workoutPlans: WorkoutPlan[];
  nutritionMeals: NutritionMeal[];
}

export default function DashboardTabs({
  stats,
  upcomingWorkouts,
  recentActivities,
  workoutPlans,
  nutritionMeals,
}: DashboardTabsProps) {
  const router = useRouter();
  return (
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
        <OverviewTab
          stats={stats}
          upcomingWorkouts={upcomingWorkouts}
          recentActivities={recentActivities}
        />
      </TabsContent>
      <TabsContent value='workouts' className='space-y-4'>
        <WorkoutsTab workoutPlans={workoutPlans} />
      </TabsContent>
      <TabsContent value='progress' className='space-y-4'>
        <ProgressTab stats={stats} />
      </TabsContent>
      <TabsContent value='nutrition' className='space-y-4'>
        <NutritionTab nutritionMeals={nutritionMeals} />
      </TabsContent>
    </Tabs>
  );
}
