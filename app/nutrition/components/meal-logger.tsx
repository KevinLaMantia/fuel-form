'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Utensils, Plus } from 'lucide-react';
import { getFoodIcon } from '../utils/food-utils';

interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  mealType: string;
  time: string;
  date: string;
}

interface MealLoggerProps {
  mealEntries: MealEntry[];
  selectedMealType: string;
  onMealTypeChange: (mealType: string) => void;
  onAddFood: () => void;
}

export function MealLogger({
  mealEntries,
  selectedMealType,
  onMealTypeChange,
  onAddFood,
}: MealLoggerProps) {
  const todayEntries = mealEntries.filter(
    (entry) =>
      entry.mealType === selectedMealType &&
      entry.date === new Date().toISOString().split('T')[0]
  );

  return (
    <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-white'>Today's Meals</CardTitle>
            <CardDescription className='text-white/60'>
              Your logged food items
            </CardDescription>
          </div>
          <Select value={selectedMealType} onValueChange={onMealTypeChange}>
            <SelectTrigger className='w-[180px] bg-white/10 border-white/30 text-white'>
              <SelectValue placeholder='Select meal' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='breakfast'>Breakfast</SelectItem>
              <SelectItem value='lunch'>Lunch</SelectItem>
              <SelectItem value='dinner'>Dinner</SelectItem>
              <SelectItem value='snacks'>Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {todayEntries.map((entry, index) => {
            const FoodIcon = getFoodIcon(entry.foodName);
            return (
              <div
                key={index}
                className='flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                    <FoodIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <div>
                    <h3 className='font-medium text-white'>{entry.foodName}</h3>
                    <div className='flex items-center space-x-2 text-sm text-white/60'>
                      <Clock className='h-3 w-3' />
                      <span>{entry.time}</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-white'>{entry.calories} cal</p>
                  <p className='text-xs text-white/60'>
                    P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                  </p>
                </div>
              </div>
            );
          })}

          {todayEntries.length === 0 && (
            <div className='text-center py-8'>
              <Utensils className='h-12 w-12 text-white/20 mx-auto mb-3' />
              <p className='text-white/60'>
                No foods logged for {selectedMealType} yet
              </p>
              <Button
                className='mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                onClick={onAddFood}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Food
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
