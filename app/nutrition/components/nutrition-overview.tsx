'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Apple, Target, TrendingUp, Utensils } from 'lucide-react';

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface DailyIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface NutritionOverviewProps {
  todayIntake: DailyIntake;
  nutritionGoals: NutritionGoals;
}

export function NutritionOverview({
  todayIntake,
  nutritionGoals,
}: NutritionOverviewProps) {
  const caloriesPercent =
    (todayIntake.calories / nutritionGoals.calories) * 100;
  const proteinPercent = (todayIntake.protein / nutritionGoals.protein) * 100;
  const carbsPercent = (todayIntake.carbs / nutritionGoals.carbs) * 100;
  const fatPercent = (todayIntake.fat / nutritionGoals.fat) * 100;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Calories
          </CardTitle>
          <div className='p-2 bg-blue-500/20 rounded-lg'>
            <Apple className='h-4 w-4 text-blue-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {todayIntake.calories}
          </div>
          <p className='text-xs text-white/60'>
            of {nutritionGoals.calories} goal
          </p>
          <Progress value={caloriesPercent} className='mt-2 bg-white/20' />
          <div className='flex justify-between mt-2 text-xs text-white/60'>
            <span>
              Remaining: {nutritionGoals.calories - todayIntake.calories}
            </span>
            <span>{caloriesPercent.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Protein
          </CardTitle>
          <div className='p-2 bg-red-500/20 rounded-lg'>
            <Target className='h-4 w-4 text-red-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {todayIntake.protein}g
          </div>
          <p className='text-xs text-white/60'>
            of {nutritionGoals.protein}g goal
          </p>
          <Progress value={proteinPercent} className='mt-2 bg-white/20' />
          <div className='flex justify-between mt-2 text-xs text-white/60'>
            <span>
              Remaining: {nutritionGoals.protein - todayIntake.protein}g
            </span>
            <span>{proteinPercent.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Carbs
          </CardTitle>
          <div className='p-2 bg-yellow-500/20 rounded-lg'>
            <TrendingUp className='h-4 w-4 text-yellow-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {todayIntake.carbs}g
          </div>
          <p className='text-xs text-white/60'>
            of {nutritionGoals.carbs}g goal
          </p>
          <Progress value={carbsPercent} className='mt-2 bg-white/20' />
          <div className='flex justify-between mt-2 text-xs text-white/60'>
            <span>Remaining: {nutritionGoals.carbs - todayIntake.carbs}g</span>
            <span>{carbsPercent.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-white/90'>
            Fat
          </CardTitle>
          <div className='p-2 bg-green-500/20 rounded-lg'>
            <Utensils className='h-4 w-4 text-green-400' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-white'>
            {todayIntake.fat}g
          </div>
          <p className='text-xs text-white/60'>of {nutritionGoals.fat}g goal</p>
          <Progress value={fatPercent} className='mt-2 bg-white/20' />
          <div className='flex justify-between mt-2 text-xs text-white/60'>
            <span>Remaining: {nutritionGoals.fat - todayIntake.fat}g</span>
            <span>{fatPercent.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
