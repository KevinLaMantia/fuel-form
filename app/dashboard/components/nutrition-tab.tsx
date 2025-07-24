'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';

interface NutritionMeal {
  meal: string;
  calories: number;
  status: string;
}

interface NutritionTabProps {
  nutritionMeals: NutritionMeal[];
}

export default function NutritionTab({ nutritionMeals }: NutritionTabProps) {
  return (
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
            <h3 className='text-lg font-semibold text-white'>Today's Meals</h3>
            {nutritionMeals.map((meal, index) => (
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
                    <p className='font-medium text-white'>{meal.meal}</p>
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
            <h3 className='text-lg font-semibold text-white'>Daily Summary</h3>
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
  );
}
