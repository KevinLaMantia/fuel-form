'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFoodIcon } from '../utils/food-utils';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  servingSize: number;
  favorite?: boolean;
  time?: string;
  mealType?: string;
  isCustom?: boolean;
}

interface QuickAddFoodsProps {
  quickAddFoods: FoodItem[];
  onAddQuickFood: (food: FoodItem) => void;
}

export function QuickAddFoods({
  quickAddFoods,
  onAddQuickFood,
}: QuickAddFoodsProps) {
  return (
    <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
      <CardHeader>
        <CardTitle className='text-white'>Quick Add</CardTitle>
        <CardDescription className='text-white/60'>
          Common foods for easy logging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {quickAddFoods.map((food, index) => {
            const FoodIcon = getFoodIcon(food.name);
            return (
              <Button
                key={index}
                variant='outline'
                className='h-auto p-3 flex items-center space-x-3 bg-white/5 border-white/10 hover:bg-white/10 text-white'
                onClick={() => onAddQuickFood(food)}
              >
                <FoodIcon className='h-5 w-5 text-purple-400 flex-shrink-0' />
                <div className='text-left'>
                  <span className='font-medium text-sm block'>{food.name}</span>
                  <span className='text-xs text-white/60'>
                    {food.calories} cal
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
