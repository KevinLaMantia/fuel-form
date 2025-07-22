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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Apple,
  TrendingUp,
  Target,
  Utensils,
  Clock,
  ChevronRight,
  BarChart3,
  X,
  Edit,
  Save,
  ArrowRight,
  Info,
  Egg,
  Beef,
  Fish,
  Milk,
  Coffee,
  Banana,
  Salad,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { NavigationHeader } from '@/components/navigation-header';

// Types
interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  water: number;
}

interface DailyIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  water: number;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  serving: string;
  servingSize: number;
  favorite?: boolean;
  time?: string;
  mealType?: string;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  days: number;
  createdBy: string;
}

// Sample data
const nutritionGoals: NutritionGoals = {
  calories: 2200,
  protein: 165,
  carbs: 220,
  fat: 73,
  fiber: 30,
  sugar: 50,
  water: 3000,
};

const todayIntake: DailyIntake = {
  calories: 1847,
  protein: 142,
  carbs: 198,
  fat: 67,
  fiber: 22,
  sugar: 35,
  water: 2100,
};

const recentFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Greek Yogurt',
    calories: 150,
    protein: 20,
    carbs: 8,
    fat: 5,
    fiber: 0,
    sugar: 6,
    serving: 'cup',
    servingSize: 1,
    time: '8:30 AM',
    mealType: 'breakfast',
  },
  {
    id: '2',
    name: 'Banana',
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
    fiber: 3,
    sugar: 14,
    serving: 'medium',
    servingSize: 1,
    time: '8:30 AM',
    mealType: 'breakfast',
  },
  {
    id: '3',
    name: 'Chicken Breast',
    calories: 231,
    protein: 43,
    carbs: 0,
    fat: 5,
    fiber: 0,
    sugar: 0,
    serving: '4 oz',
    servingSize: 1,
    time: '12:30 PM',
    mealType: 'lunch',
  },
  {
    id: '4',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 2,
    fiber: 4,
    sugar: 0,
    serving: 'cup',
    servingSize: 1,
    time: '12:30 PM',
    mealType: 'lunch',
  },
  {
    id: '5',
    name: 'Broccoli',
    calories: 55,
    protein: 4,
    carbs: 11,
    fat: 1,
    fiber: 5,
    sugar: 2,
    serving: 'cup',
    servingSize: 1,
    time: '12:30 PM',
    mealType: 'lunch',
  },
];

const quickAddFoods: FoodItem[] = [
  {
    id: '6',
    name: 'Oatmeal',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    serving: 'cup',
    servingSize: 1,
  },
  {
    id: '7',
    name: 'Eggs (2 large)',
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    fiber: 0,
    sugar: 0,
    serving: 'large',
    servingSize: 2,
  },
  {
    id: '8',
    name: 'Almonds (1 oz)',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    fiber: 3,
    sugar: 1,
    serving: 'oz',
    servingSize: 1,
  },
  {
    id: '9',
    name: 'Apple',
    calories: 95,
    protein: 0,
    carbs: 25,
    fat: 0,
    fiber: 4,
    sugar: 19,
    serving: 'medium',
    servingSize: 1,
  },
  {
    id: '10',
    name: 'Salmon (4 oz)',
    calories: 206,
    protein: 28,
    carbs: 0,
    fat: 9,
    fiber: 0,
    sugar: 0,
    serving: '4 oz',
    servingSize: 1,
  },
  {
    id: '11',
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0,
    fiber: 4,
    sugar: 5,
    serving: 'medium',
    servingSize: 1,
  },
];

const mealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'High Protein Plan',
    description: 'Designed for muscle building and recovery',
    days: 7,
    createdBy: 'Sarah Mitchell',
  },
  {
    id: '2',
    name: 'Weight Loss Plan',
    description: 'Calorie-controlled plan for steady weight loss',
    days: 14,
    createdBy: 'Mike Johnson',
  },
  {
    id: '3',
    name: 'Balanced Nutrition',
    description: 'Well-rounded nutrition for general health',
    days: 7,
    createdBy: 'Emma Davis',
  },
];

// Food database (simplified)
const foodDatabase: FoodItem[] = [
  ...quickAddFoods,
  {
    id: '12',
    name: 'Quinoa',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 4,
    fiber: 5,
    sugar: 0,
    serving: 'cup',
    servingSize: 1,
  },
  {
    id: '13',
    name: 'Avocado',
    calories: 234,
    protein: 3,
    carbs: 12,
    fat: 21,
    fiber: 10,
    sugar: 1,
    serving: 'medium',
    servingSize: 1,
  },
  {
    id: '14',
    name: 'Spinach',
    calories: 41,
    protein: 5,
    carbs: 7,
    fat: 0,
    fiber: 4,
    sugar: 0,
    serving: 'cup',
    servingSize: 2,
  },
  {
    id: '15',
    name: 'Protein Shake',
    calories: 170,
    protein: 30,
    carbs: 8,
    fat: 2,
    fiber: 1,
    sugar: 2,
    serving: 'scoop',
    servingSize: 1,
  },
  {
    id: '16',
    name: 'Whole Wheat Bread',
    calories: 69,
    protein: 3,
    carbs: 12,
    fat: 1,
    fiber: 2,
    sugar: 1,
    serving: 'slice',
    servingSize: 1,
  },
  {
    id: '17',
    name: 'Peanut Butter',
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
    fiber: 2,
    sugar: 3,
    serving: 'tbsp',
    servingSize: 2,
  },
  {
    id: '18',
    name: 'Cottage Cheese',
    calories: 206,
    protein: 28,
    carbs: 8,
    fat: 9,
    fiber: 0,
    sugar: 8,
    serving: 'cup',
    servingSize: 1,
  },
  {
    id: '19',
    name: 'Blueberries',
    calories: 84,
    protein: 1,
    carbs: 21,
    fat: 0,
    fiber: 4,
    sugar: 15,
    serving: 'cup',
    servingSize: 1,
  },
  {
    id: '20',
    name: 'Chicken Thigh',
    calories: 209,
    protein: 26,
    carbs: 0,
    fat: 10,
    fiber: 0,
    sugar: 0,
    serving: '4 oz',
    servingSize: 1,
  },
];

// Helper function to get food icon
const getFoodIcon = (foodName: string) => {
  const name = foodName.toLowerCase();
  if (name.includes('egg')) return Egg;
  if (name.includes('beef') || name.includes('steak')) return Beef;
  if (name.includes('fish') || name.includes('salmon')) return Fish;
  if (
    name.includes('milk') ||
    name.includes('yogurt') ||
    name.includes('cheese')
  )
    return Milk;
  if (name.includes('coffee')) return Coffee;
  if (name.includes('banana')) return Banana;
  if (
    name.includes('salad') ||
    name.includes('spinach') ||
    name.includes('broccoli')
  )
    return Salad;
  return Apple;
};

export default function NutritionPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState(1);
  const [customFood, setCustomFood] = useState<FoodItem>({
    id: '',
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    serving: 'serving',
    servingSize: 1,
  });
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [waterIntake, setWaterIntake] = useState(todayIntake.water);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState<NutritionGoals>({
    ...nutritionGoals,
  });
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = foodDatabase.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

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

  const caloriesPercent =
    (todayIntake.calories / nutritionGoals.calories) * 100;
  const proteinPercent = (todayIntake.protein / nutritionGoals.protein) * 100;
  const carbsPercent = (todayIntake.carbs / nutritionGoals.carbs) * 100;
  const fatPercent = (todayIntake.fat / nutritionGoals.fat) * 100;
  const fiberPercent = (todayIntake.fiber / nutritionGoals.fiber) * 100;
  const sugarPercent = (todayIntake.sugar / nutritionGoals.sugar) * 100;
  const waterPercent = (waterIntake / nutritionGoals.water) * 100;

  const handleCustomFoodChange = (field: keyof FoodItem, value: any) => {
    setCustomFood((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomFood = () => {
    // Add custom food logic here
    toast({
      title: 'Food Added',
      description: `${customFood.name} has been added to your log.`,
    });
    setCustomFood({
      id: '',
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      serving: 'serving',
      servingSize: 1,
    });
    setShowAddFood(false);
  };

  const addQuickFood = (food: FoodItem) => {
    // Add quick food logic here
    toast({
      title: 'Food Added',
      description: `${food.name} has been added to your log.`,
    });
  };

  const addFoodFromSearch = (food: FoodItem) => {
    toast({
      title: 'Food Added',
      description: `${food.name} has been added to your ${selectedMealType}.`,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const viewMealPlan = (plan: MealPlan) => {
    setSelectedMealPlan(plan);
    setSelectedDay(1);
    setShowMealPlanDetails(true);
  };

  const saveNutritionGoals = () => {
    // Save nutrition goals logic here
    toast({
      title: 'Goals Updated',
      description: 'Your nutrition goals have been updated successfully.',
    });
    setEditingGoals(false);
  };

  const updateWaterIntake = (amount: number) => {
    const newAmount = Math.min(
      Math.max(0, waterIntake + amount),
      nutritionGoals.water * 1.5
    );
    setWaterIntake(newAmount);
    toast({
      title: 'Water Intake Updated',
      description: `${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(
        amount
      )}ml of water.`,
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto'></div>
          <p className='mt-4 text-white/70'>Loading nutrition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <NavigationHeader user={user} />

      <div className='container mx-auto px-4 py-8'>
        <Tabs defaultValue='today' className='space-y-6'>
          <TabsList className='bg-white/10 backdrop-blur-lg border border-white/20'>
            <TabsTrigger
              value='today'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value='meal-plans'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Meal Plans
            </TabsTrigger>
            <TabsTrigger
              value='history'
              className='data-[state=active]:bg-white/20 text-white'
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value='goals'
              className='data-[state=active]:bg-white/20 text-white'
            >
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value='today' className='space-y-6'>
            {/* Daily Overview */}
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
                  <Progress
                    value={caloriesPercent}
                    className='mt-2 bg-white/20'
                  />
                  <div className='flex justify-between mt-2 text-xs text-white/60'>
                    <span>
                      Remaining:{' '}
                      {nutritionGoals.calories - todayIntake.calories}
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
                  <Progress
                    value={proteinPercent}
                    className='mt-2 bg-white/20'
                  />
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
                    <span>
                      Remaining: {nutritionGoals.carbs - todayIntake.carbs}g
                    </span>
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
                  <p className='text-xs text-white/60'>
                    of {nutritionGoals.fat}g goal
                  </p>
                  <Progress value={fatPercent} className='mt-2 bg-white/20' />
                  <div className='flex justify-between mt-2 text-xs text-white/60'>
                    <span>
                      Remaining: {nutritionGoals.fat - todayIntake.fat}g
                    </span>
                    <span>{fatPercent.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Water Tracking */}
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
                    onClick={() => updateWaterIntake(-250)}
                  >
                    -250ml
                  </Button>
                  <Button
                    variant='outline'
                    className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                    onClick={() => updateWaterIntake(250)}
                  >
                    +250ml
                  </Button>
                  <Button
                    variant='outline'
                    className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                    onClick={() => updateWaterIntake(500)}
                  >
                    +500ml
                  </Button>
                  <Button
                    className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    onClick={() => updateWaterIntake(1000)}
                  >
                    +1L
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-white'>Today's Meals</CardTitle>
                    <CardDescription className='text-white/60'>
                      Your logged food items
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedMealType}
                    onValueChange={setSelectedMealType}
                  >
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
                  {recentFoods
                    .filter((food) => food.mealType === selectedMealType)
                    .map((food, index) => {
                      const FoodIcon = getFoodIcon(food.name);
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
                              <h3 className='font-medium text-white'>
                                {food.name}
                              </h3>
                              <div className='flex items-center space-x-2 text-sm text-white/60'>
                                <Clock className='h-3 w-3' />
                                <span>{food.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='font-medium text-white'>
                              {food.calories} cal
                            </p>
                            <p className='text-xs text-white/60'>
                              P: {food.protein}g • C: {food.carbs}g • F:{' '}
                              {food.fat}g
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  {recentFoods.filter(
                    (food) => food.mealType === selectedMealType
                  ).length === 0 && (
                    <div className='text-center py-8'>
                      <Utensils className='h-12 w-12 text-white/20 mx-auto mb-3' />
                      <p className='text-white/60'>
                        No foods logged for {selectedMealType} yet
                      </p>
                      <Button
                        className='mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        onClick={() => setShowAddFood(true)}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Add Food
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Macro Distribution */}
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Macro Distribution</CardTitle>
                <CardDescription className='text-white/60'>
                  Breakdown of your daily macronutrients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-center h-48 mb-4'>
                  <div className='w-48 h-48 rounded-full border-8 border-white/10 relative'>
                    <div
                      className='absolute inset-0 rounded-full border-8 border-purple-500'
                      style={{
                        clipPath:
                          'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)',
                        transform: 'rotate(0deg)',
                      }}
                    ></div>
                    <div
                      className='absolute inset-0 rounded-full border-8 border-blue-500'
                      style={{
                        clipPath:
                          'polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, 50% 100%)',
                        transform: 'rotate(0deg)',
                      }}
                    ></div>
                    <div
                      className='absolute inset-0 rounded-full border-8 border-green-500'
                      style={{
                        clipPath:
                          'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)',
                        transform: 'rotate(0deg)',
                      }}
                    ></div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>
                          {todayIntake.calories}
                        </div>
                        <div className='text-xs text-white/60'>calories</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-3 h-3 bg-purple-500 rounded-full'></div>
                      <span className='text-white'>Protein</span>
                    </div>
                    <p className='text-white/60 text-sm'>
                      {Math.round(
                        ((todayIntake.protein * 4) / todayIntake.calories) * 100
                      )}
                      %
                    </p>
                    <p className='text-white font-medium'>
                      {todayIntake.protein}g
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                      <span className='text-white'>Carbs</span>
                    </div>
                    <p className='text-white/60 text-sm'>
                      {Math.round(
                        ((todayIntake.carbs * 4) / todayIntake.calories) * 100
                      )}
                      %
                    </p>
                    <p className='text-white font-medium'>
                      {todayIntake.carbs}g
                    </p>
                  </div>
                  <div className='text-center'>
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span className='text-white'>Fat</span>
                    </div>
                    <p className='text-white/60 text-sm'>
                      {Math.round(
                        ((todayIntake.fat * 9) / todayIntake.calories) * 100
                      )}
                      %
                    </p>
                    <p className='text-white font-medium'>{todayIntake.fat}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Foods */}
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
                        onClick={() => addQuickFood(food)}
                      >
                        <FoodIcon className='h-5 w-5 text-purple-400 flex-shrink-0' />
                        <div className='text-left'>
                          <span className='font-medium text-sm block'>
                            {food.name}
                          </span>
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
          </TabsContent>

          <TabsContent value='meal-plans' className='space-y-6'>
            {!showMealPlanDetails ? (
              <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle className='text-white'>Meal Plans</CardTitle>
                      <CardDescription className='text-white/60'>
                        Personalized nutrition plans
                      </CardDescription>
                    </div>
                    <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'>
                      <Plus className='h-4 w-4 mr-2' />
                      Create Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {mealPlans.map((plan, index) => (
                    <div
                      key={index}
                      className='p-4 bg-white/5 rounded-lg border border-white/10'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-medium text-white'>
                            {plan.name}
                          </h3>
                          <p className='text-sm text-white/60'>
                            {plan.description}
                          </p>
                          <div className='flex items-center mt-2 space-x-4'>
                            <Badge
                              variant='outline'
                              className='border-purple-400/50 text-purple-400'
                            >
                              {plan.days} days
                            </Badge>
                            <span className='text-xs text-white/60'>
                              By {plan.createdBy}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                          onClick={() => viewMealPlan(plan)}
                        >
                          View Plan
                          <ChevronRight className='ml-2 h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Button
                        variant='ghost'
                        className='text-white/70 hover:text-white -ml-4 mb-2'
                        onClick={() => setShowMealPlanDetails(false)}
                      >
                        <ArrowRight className='h-4 w-4 mr-2 rotate-180' />
                        Back to Plans
                      </Button>
                      <CardTitle className='text-white'>
                        {selectedMealPlan?.name}
                      </CardTitle>
                      <CardDescription className='text-white/60'>
                        {selectedMealPlan?.description}
                      </CardDescription>
                    </div>
                    <Button className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'>
                      Apply Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex space-x-2 overflow-x-auto pb-2'>
                    {Array.from({ length: selectedMealPlan?.days || 0 }).map(
                      (_, i) => (
                        <Button
                          key={i}
                          variant={
                            selectedDay === i + 1 ? 'default' : 'outline'
                          }
                          className={
                            selectedDay === i + 1
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                              : 'border-white/30 text-white hover:bg-white/10 bg-transparent'
                          }
                          onClick={() => setSelectedDay(i + 1)}
                        >
                          Day {i + 1}
                        </Button>
                      )
                    )}
                  </div>

                  <div className='space-y-6'>
                    {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(
                      (meal, index) => (
                        <div key={index}>
                          <h3 className='text-lg font-medium text-white mb-3'>
                            {meal}
                          </h3>
                          <div className='space-y-3'>
                            {/* Sample meal items */}
                            {index === 0 && (
                              <>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Egg className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Scrambled Eggs
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        2 large eggs
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      140 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 12g • C: 1g • F: 10g
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Apple className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Whole Wheat Toast
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        2 slices
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      138 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 6g • C: 24g • F: 2g
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                            {index === 1 && (
                              <>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Salad className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Chicken Salad
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        4oz chicken, mixed greens
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      320 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 35g • C: 10g • F: 15g
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                            {index === 2 && (
                              <>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Fish className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Grilled Salmon
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        6oz fillet
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      350 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 42g • C: 0g • F: 20g
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Salad className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Steamed Vegetables
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        Broccoli, carrots, cauliflower
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      85 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 4g • C: 18g • F: 0g
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                            {index === 3 && (
                              <>
                                <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center'>
                                      <Apple className='h-5 w-5 text-purple-400' />
                                    </div>
                                    <div>
                                      <h4 className='font-medium text-white'>
                                        Greek Yogurt
                                      </h4>
                                      <p className='text-xs text-white/60'>
                                        1 cup with berries
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-medium text-white'>
                                      180 cal
                                    </p>
                                    <p className='text-xs text-white/60'>
                                      P: 20g • C: 13g • F: 5g
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
                    <h3 className='text-lg font-medium text-white mb-3'>
                      Daily Nutrition Summary
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>
                          2,100
                        </div>
                        <div className='text-sm text-white/60'>Calories</div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>
                          165g
                        </div>
                        <div className='text-sm text-white/60'>Protein</div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>
                          210g
                        </div>
                        <div className='text-sm text-white/60'>Carbs</div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>70g</div>
                        <div className='text-sm text-white/60'>Fat</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='history'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-white'>Nutrition History</CardTitle>
                <CardDescription className='text-white/60'>
                  Your nutrition tracking over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    {
                      date: 'Today',
                      calories: 1847,
                      protein: 142,
                      carbs: 198,
                      fat: 67,
                    },
                    {
                      date: 'Yesterday',
                      calories: 2156,
                      protein: 158,
                      carbs: 215,
                      fat: 71,
                    },
                    {
                      date: '2 days ago',
                      calories: 2089,
                      protein: 165,
                      carbs: 201,
                      fat: 69,
                    },
                    {
                      date: '3 days ago',
                      calories: 2234,
                      protein: 171,
                      carbs: 223,
                      fat: 74,
                    },
                  ].map((day, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10'
                    >
                      <div>
                        <h3 className='font-medium text-white'>{day.date}</h3>
                        <p className='text-sm text-white/60'>
                          {day.calories} calories
                        </p>
                      </div>
                      <div className='text-right text-sm'>
                        <p className='text-white/70'>
                          P: {day.protein}g • C: {day.carbs}g • F: {day.fat}g
                        </p>
                        <div className='flex space-x-1 mt-1'>
                          <Badge
                            variant={
                              day.calories >= nutritionGoals.calories * 0.9
                                ? 'default'
                                : 'outline'
                            }
                            className={
                              day.calories >= nutritionGoals.calories * 0.9
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'border-white/30 text-white/70'
                            }
                          >
                            Cal
                          </Badge>
                          <Badge
                            variant={
                              day.protein >= nutritionGoals.protein * 0.9
                                ? 'default'
                                : 'outline'
                            }
                            className={
                              day.protein >= nutritionGoals.protein * 0.9
                                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                : 'border-white/30 text-white/70'
                            }
                          >
                            Pro
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6 h-64 bg-white/5 rounded-lg flex items-center justify-center'>
                  <div className='text-center'>
                    <BarChart3 className='h-12 w-12 text-white/20 mx-auto mb-3' />
                    <p className='text-white/60'>
                      Nutrition trends chart will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='goals'>
            <Card className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-white'>
                      Nutrition Goals
                    </CardTitle>
                    <CardDescription className='text-white/60'>
                      Your daily macro and calorie targets
                    </CardDescription>
                  </div>
                  {!editingGoals ? (
                    <Button
                      variant='outline'
                      className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                      onClick={() => setEditingGoals(true)}
                    >
                      <Edit className='h-4 w-4 mr-2' />
                      Edit Goals
                    </Button>
                  ) : (
                    <div className='flex space-x-2'>
                      <Button
                        variant='outline'
                        className='border-white/30 text-white hover:bg-white/10 bg-transparent'
                        onClick={() => {
                          setTempGoals({ ...nutritionGoals });
                          setEditingGoals(false);
                        }}
                      >
                        <X className='h-4 w-4 mr-2' />
                        Cancel
                      </Button>
                      <Button
                        className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        onClick={saveNutritionGoals}
                      >
                        <Save className='h-4 w-4 mr-2' />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {!editingGoals ? (
                    <div className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>
                                Daily Calories
                              </Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.calories}
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Protein (g)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.protein}g
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                            <div className='text-xs text-white/60 text-right'>
                              {Math.round(
                                ((nutritionGoals.protein * 4) /
                                  nutritionGoals.calories) *
                                  100
                              )}
                              % of calories
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Carbs (g)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.carbs}g
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                            <div className='text-xs text-white/60 text-right'>
                              {Math.round(
                                ((nutritionGoals.carbs * 4) /
                                  nutritionGoals.calories) *
                                  100
                              )}
                              % of calories
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Fat (g)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.fat}g
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                            <div className='text-xs text-white/60 text-right'>
                              {Math.round(
                                ((nutritionGoals.fat * 9) /
                                  nutritionGoals.calories) *
                                  100
                              )}
                              % of calories
                            </div>
                          </div>
                        </div>

                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Fiber (g)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.fiber}g
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Sugar (g)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.sugar}g
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between'>
                              <Label className='text-white'>Water (ml)</Label>
                              <span className='text-white font-medium'>
                                {nutritionGoals.water}ml
                              </span>
                            </div>
                            <Progress value={100} className='bg-white/20' />
                          </div>

                          <div className='p-4 bg-white/5 rounded-lg border border-white/10 mt-6'>
                            <div className='flex items-start space-x-3'>
                              <Info className='h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5' />
                              <div>
                                <h4 className='font-medium text-white'>
                                  Nutrition Goal Recommendations
                                </h4>
                                <p className='text-sm text-white/60 mt-1'>
                                  These goals are based on your profile,
                                  activity level, and fitness objectives. Adjust
                                  them as needed to meet your specific
                                  requirements.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <Label htmlFor='calories' className='text-white'>
                            Daily Calories
                          </Label>
                          <Input
                            id='calories'
                            type='number'
                            value={tempGoals.calories}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                calories: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='protein' className='text-white'>
                            Protein (g)
                          </Label>
                          <Input
                            id='protein'
                            type='number'
                            value={tempGoals.protein}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                protein: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='carbs' className='text-white'>
                            Carbs (g)
                          </Label>
                          <Input
                            id='carbs'
                            type='number'
                            value={tempGoals.carbs}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                carbs: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='fat' className='text-white'>
                            Fat (g)
                          </Label>
                          <Input
                            id='fat'
                            type='number'
                            value={tempGoals.fat}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                fat: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='fiber' className='text-white'>
                            Fiber (g)
                          </Label>
                          <Input
                            id='fiber'
                            type='number'
                            value={tempGoals.fiber}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                fiber: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='sugar' className='text-white'>
                            Sugar (g)
                          </Label>
                          <Input
                            id='sugar'
                            type='number'
                            value={tempGoals.sugar}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                sugar: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                        <div>
                          <Label htmlFor='water' className='text-white'>
                            Water (ml)
                          </Label>
                          <Input
                            id='water'
                            type='number'
                            value={tempGoals.water}
                            onChange={(e) =>
                              setTempGoals({
                                ...tempGoals,
                                water: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className='bg-white/10 border-white/30 text-white'
                          />
                        </div>
                      </div>

                      <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
                        <div className='flex items-center space-x-3'>
                          <div className='flex items-center space-x-2'>
                            <Switch id='auto-adjust' />
                            <Label htmlFor='auto-adjust' className='text-white'>
                              Auto-adjust based on activity
                            </Label>
                          </div>
                          <div className='text-xs text-white/60'>
                            Automatically adjust calorie goals based on your
                            daily activity level
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <Card className='w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-white'>Add Food</CardTitle>
                    <CardDescription className='text-white/60'>
                      Search for food or add custom entry
                    </CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-white/70 hover:text-white hover:bg-white/10'
                    onClick={() => setShowAddFood(false)}
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40' />
                  <Input
                    placeholder='Search foods...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/40'
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className='max-h-60 overflow-y-auto space-y-2'>
                    {searchResults.map((food, index) => {
                      const FoodIcon = getFoodIcon(food.name);
                      return (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10'
                          onClick={() => addFoodFromSearch(food)}
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center'>
                              <FoodIcon className='h-4 w-4 text-purple-400' />
                            </div>
                            <div>
                              <h4 className='font-medium text-white'>
                                {food.name}
                              </h4>
                              <p className='text-xs text-white/60'>
                                {food.serving} ({food.calories} cal)
                              </p>
                            </div>
                          </div>
                          <div className='text-xs text-white/60'>
                            P: {food.protein}g • C: {food.carbs}g • F:{' '}
                            {food.fat}g
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className='text-center'>
                  <p className='text-sm text-white/60 mb-2'>
                    Or add custom food
                  </p>
                </div>

                <div className='space-y-3'>
                  <Input
                    placeholder='Food name'
                    value={customFood.name}
                    onChange={(e) =>
                      handleCustomFoodChange('name', e.target.value)
                    }
                    className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                  />

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label
                        htmlFor='serving'
                        className='text-white/70 text-xs'
                      >
                        Serving
                      </Label>
                      <Input
                        id='serving'
                        placeholder='e.g., cup, oz'
                        value={customFood.serving}
                        onChange={(e) =>
                          handleCustomFoodChange('serving', e.target.value)
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='servingSize'
                        className='text-white/70 text-xs'
                      >
                        Amount
                      </Label>
                      <Input
                        id='servingSize'
                        type='number'
                        placeholder='1'
                        value={customFood.servingSize}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'servingSize',
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label
                        htmlFor='calories'
                        className='text-white/70 text-xs'
                      >
                        Calories
                      </Label>
                      <Input
                        id='calories'
                        placeholder='Calories'
                        type='number'
                        value={customFood.calories || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'calories',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='protein'
                        className='text-white/70 text-xs'
                      >
                        Protein (g)
                      </Label>
                      <Input
                        id='protein'
                        placeholder='Protein (g)'
                        type='number'
                        value={customFood.protein || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'protein',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label htmlFor='carbs' className='text-white/70 text-xs'>
                        Carbs (g)
                      </Label>
                      <Input
                        id='carbs'
                        placeholder='Carbs (g)'
                        type='number'
                        value={customFood.carbs || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'carbs',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                    <div>
                      <Label htmlFor='fat' className='text-white/70 text-xs'>
                        Fat (g)
                      </Label>
                      <Input
                        id='fat'
                        placeholder='Fat (g)'
                        type='number'
                        value={customFood.fat || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'fat',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <Label htmlFor='fiber' className='text-white/70 text-xs'>
                        Fiber (g)
                      </Label>
                      <Input
                        id='fiber'
                        placeholder='Fiber (g)'
                        type='number'
                        value={customFood.fiber || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'fiber',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                    <div>
                      <Label htmlFor='sugar' className='text-white/70 text-xs'>
                        Sugar (g)
                      </Label>
                      <Input
                        id='sugar'
                        placeholder='Sugar (g)'
                        type='number'
                        value={customFood.sugar || ''}
                        onChange={(e) =>
                          handleCustomFoodChange(
                            'sugar',
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className='bg-white/10 border-white/30 text-white placeholder:text-white/40'
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='mealType' className='text-white/70 text-xs'>
                      Meal Type
                    </Label>
                    <Select
                      value={selectedMealType}
                      onValueChange={setSelectedMealType}
                    >
                      <SelectTrigger className='bg-white/10 border-white/30 text-white'>
                        <SelectValue placeholder='Select meal type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='breakfast'>Breakfast</SelectItem>
                        <SelectItem value='lunch'>Lunch</SelectItem>
                        <SelectItem value='dinner'>Dinner</SelectItem>
                        <SelectItem value='snacks'>Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex space-x-2 pt-2'>
                  <Button
                    variant='outline'
                    className='flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent'
                    onClick={() => setShowAddFood(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    onClick={addCustomFood}
                  >
                    Add Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
