'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

interface WaterTrackerProps {
  waterIntake: number;
  nutritionGoals: NutritionGoals;
  onUpdateWaterIntake: (amount: number) => void;
}

export function WaterTracker({
  waterIntake,
  nutritionGoals,
  onUpdateWaterIntake,
}: WaterTrackerProps) {
  const waterPercent = (waterIntake / nutritionGoals.water) * 100;

  return (
    <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-white'>Water Intake</CardTitle>
            <CardDescription className='text-white/60'>
              Track your daily hydration
            </CardDescription>
          </div>
          <div className='text-right'>
            <div className='text-xl font-bold text-white'>
              {(waterIntake / 1000).toFixed(1)}L
            </div>
            <p className='text-xs text-white/60'>
              of {(nutritionGoals.water / 1000).toFixed(1)}L goal
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={waterPercent} className='h-4 bg-white/20' />
        <div className='flex justify-between mt-4'>
          <Button
            variant='outline'
            className='border-white/30 text-white hover:bg-white/10 bg-transparent'
            onClick={() => onUpdateWaterIntake(-250)}
          >
            -250ml
          </Button>
          <Button
            variant='outline'
            className='border-white/30 text-white hover:bg-white/10 bg-transparent'
            onClick={() => onUpdateWaterIntake(250)}
          >
            +250ml
          </Button>
          <Button
            variant='outline'
            className='border-white/30 text-white hover:bg-white/10 bg-transparent'
            onClick={() => onUpdateWaterIntake(500)}
          >
            +500ml
          </Button>
          <Button
            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            onClick={() => onUpdateWaterIntake(1000)}
          >
            +1L
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
