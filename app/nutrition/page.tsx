"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Apple,
  Target,
  Utensils,
  Clock,
  ChevronRight,
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
  Trash2,
  LineChart,
  ChevronDown,
  ChevronUp,
  Droplets,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { NavigationHeader } from "@/components/navigation-header"
import { NutritionOverview } from "./components/nutrition-overview"
import { WaterTracker } from "./components/water-tracker"
import { MealLogger } from "./components/meal-logger"
import { MacroDistribution } from "./components/macro-distribution"
import { QuickAddFoods } from "./components/quick-add-foods"

// Types
interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

interface DailyIntake {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
  servingSize: number
  favorite?: boolean
  time?: string
  mealType?: string
  isCustom?: boolean
}

interface MealEntry {
  id: string
  foodId: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  mealType: string
  time: string
  date: string
}

interface DailyNutrition {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  meals?: MealEntry[]
}

interface MealPlan {
  id: string
  name: string
  description: string
  days: number
  createdBy: string
}

// Sample data
const initialNutritionGoals: NutritionGoals = {
  calories: 2200,
  protein: 165,
  carbs: 220,
  fat: 73,
  water: 3000,
}

const initialTodayIntake: DailyIntake = {
  calories: 1847,
  protein: 142,
  carbs: 198,
  fat: 67,
  water: 2100,
}

const sampleMealEntries: MealEntry[] = [
  {
    id: "1",
    foodId: "1",
    foodName: "Greek Yogurt",
    calories: 150,
    protein: 20,
    carbs: 8,
    fat: 5,
    servingSize: 1,
    mealType: "breakfast",
    time: "8:30 AM",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    foodId: "2",
    foodName: "Banana",
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
    servingSize: 1,
    mealType: "breakfast",
    time: "8:30 AM",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    foodId: "3",
    foodName: "Chicken Breast",
    calories: 231,
    protein: 43,
    carbs: 0,
    fat: 5,
    servingSize: 1,
    mealType: "lunch",
    time: "12:30 PM",
    date: new Date().toISOString().split("T")[0],
  },
]

const quickAddFoods: FoodItem[] = [
  {
    id: "6",
    name: "Oatmeal",
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    serving: "cup",
    servingSize: 1,
  },
  {
    id: "7",
    name: "Eggs (2 large)",
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    serving: "large",
    servingSize: 2,
  },
  {
    id: "8",
    name: "Almonds (1 oz)",
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    serving: "oz",
    servingSize: 1,
  },
  {
    id: "9",
    name: "Apple",
    calories: 95,
    protein: 0,
    carbs: 25,
    fat: 0,
    serving: "medium",
    servingSize: 1,
  },
  {
    id: "10",
    name: "Salmon (4 oz)",
    calories: 206,
    protein: 28,
    carbs: 0,
    fat: 9,
    serving: "4 oz",
    servingSize: 1,
  },
  {
    id: "11",
    name: "Sweet Potato",
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0,
    serving: "medium",
    servingSize: 1,
  },
]

const mealPlans: MealPlan[] = [
  {
    id: "1",
    name: "High Protein Plan",
    description: "Designed for muscle building and recovery",
    days: 7,
    createdBy: "Sarah Mitchell",
  },
  {
    id: "2",
    name: "Weight Loss Plan",
    description: "Calorie-controlled plan for steady weight loss",
    days: 14,
    createdBy: "Mike Johnson",
  },
  {
    id: "3",
    name: "Balanced Nutrition",
    description: "Well-rounded nutrition for general health",
    days: 7,
    createdBy: "Emma Davis",
  },
]

// Food database (simplified)
const baseFoodDatabase: FoodItem[] = [
  ...quickAddFoods,
  {
    id: "12",
    name: "Quinoa",
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 4,
    serving: "cup",
    servingSize: 1,
  },
  {
    id: "13",
    name: "Avocado",
    calories: 234,
    protein: 3,
    carbs: 12,
    fat: 21,
    serving: "medium",
    servingSize: 1,
  },
  {
    id: "14",
    name: "Spinach",
    calories: 41,
    protein: 5,
    carbs: 7,
    fat: 0,
    serving: "cup",
    servingSize: 2,
  },
  {
    id: "15",
    name: "Protein Shake",
    calories: 170,
    protein: 30,
    carbs: 8,
    fat: 2,
    serving: "scoop",
    servingSize: 1,
  },
  {
    id: "16",
    name: "Whole Wheat Bread",
    calories: 69,
    protein: 3,
    carbs: 12,
    fat: 1,
    serving: "slice",
    servingSize: 1,
  },
  {
    id: "17",
    name: "Peanut Butter",
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
    serving: "tbsp",
    servingSize: 2,
  },
  {
    id: "18",
    name: "Cottage Cheese",
    calories: 206,
    protein: 28,
    carbs: 8,
    fat: 9,
    serving: "cup",
    servingSize: 1,
  },
  {
    id: "19",
    name: "Blueberries",
    calories: 84,
    protein: 1,
    carbs: 21,
    fat: 0,
    serving: "cup",
    servingSize: 1,
  },
  {
    id: "20",
    name: "Chicken Thigh",
    calories: 209,
    protein: 26,
    carbs: 0,
    fat: 10,
    serving: "4 oz",
    servingSize: 1,
  },
]

// Generate sample historical data with comprehensive meals
const generateHistoricalData = (): DailyNutrition[] => {
  const data: DailyNutrition[] = []
  const today = new Date()

  // Comprehensive sample historical meals for different days
  const sampleHistoricalMeals = [
    // Today (index 0)
    [
      {
        id: "today1",
        foodId: "1",
        foodName: "Greek Yogurt",
        calories: 150,
        protein: 20,
        carbs: 8,
        fat: 5,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:30 AM",
      },
      {
        id: "today2",
        foodId: "2",
        foodName: "Banana",
        calories: 105,
        protein: 1,
        carbs: 27,
        fat: 0,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:30 AM",
      },
      {
        id: "today3",
        foodId: "17",
        foodName: "Peanut Butter",
        calories: 188,
        protein: 8,
        carbs: 6,
        fat: 16,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:30 AM",
      },
      {
        id: "today4",
        foodId: "3",
        foodName: "Chicken Breast",
        calories: 231,
        protein: 43,
        carbs: 0,
        fat: 5,
        servingSize: 1,
        mealType: "lunch",
        time: "12:30 PM",
      },
      {
        id: "today5",
        foodId: "12",
        foodName: "Quinoa",
        calories: 222,
        protein: 8,
        carbs: 39,
        fat: 4,
        servingSize: 1,
        mealType: "lunch",
        time: "12:30 PM",
      },
      {
        id: "today6",
        foodId: "14",
        foodName: "Spinach",
        calories: 41,
        protein: 5,
        carbs: 7,
        fat: 0,
        servingSize: 1,
        mealType: "lunch",
        time: "12:30 PM",
      },
      {
        id: "today7",
        foodId: "8",
        foodName: "Almonds (1 oz)",
        calories: 164,
        protein: 6,
        carbs: 6,
        fat: 14,
        servingSize: 1,
        mealType: "snacks",
        time: "3:15 PM",
      },
      {
        id: "today8",
        foodId: "10",
        foodName: "Salmon (4 oz)",
        calories: 206,
        protein: 28,
        carbs: 0,
        fat: 9,
        servingSize: 1,
        mealType: "dinner",
        time: "7:00 PM",
      },
      {
        id: "today9",
        foodId: "11",
        foodName: "Sweet Potato",
        calories: 112,
        protein: 2,
        carbs: 26,
        fat: 0,
        servingSize: 1,
        mealType: "dinner",
        time: "7:00 PM",
      },
      {
        id: "today10",
        foodName: "Mixed Vegetables",
        calories: 85,
        protein: 4,
        carbs: 18,
        fat: 0,
        servingSize: 1,
        mealType: "dinner",
        time: "7:00 PM",
      },
    ],
    // Yesterday (index 1)
    [
      {
        id: "h1",
        foodId: "7",
        foodName: "Eggs (2 large)",
        calories: 140,
        protein: 12,
        carbs: 1,
        fat: 10,
        servingSize: 1,
        mealType: "breakfast",
        time: "7:45 AM",
      },
      {
        id: "h2",
        foodId: "16",
        foodName: "Whole Wheat Toast",
        calories: 138,
        protein: 6,
        carbs: 24,
        fat: 2,
        servingSize: 2,
        mealType: "breakfast",
        time: "7:45 AM",
      },
      {
        id: "h3",
        foodId: "13",
        foodName: "Avocado",
        calories: 234,
        protein: 3,
        carbs: 12,
        fat: 21,
        servingSize: 1,
        mealType: "breakfast",
        time: "7:45 AM",
      },
      {
        id: "h4",
        foodName: "Turkey Sandwich",
        calories: 320,
        protein: 25,
        carbs: 35,
        fat: 12,
        servingSize: 1,
        mealType: "lunch",
        time: "12:15 PM",
      },
      {
        id: "h5",
        foodName: "Side Salad",
        calories: 85,
        protein: 3,
        carbs: 8,
        fat: 5,
        servingSize: 1,
        mealType: "lunch",
        time: "12:15 PM",
      },
      {
        id: "h6",
        foodId: "9",
        foodName: "Apple",
        calories: 95,
        protein: 0,
        carbs: 25,
        fat: 0,
        servingSize: 1,
        mealType: "snacks",
        time: "3:30 PM",
      },
      {
        id: "h7",
        foodId: "20",
        foodName: "Chicken Thigh",
        calories: 209,
        protein: 26,
        carbs: 0,
        fat: 10,
        servingSize: 1,
        mealType: "dinner",
        time: "7:30 PM",
      },
      {
        id: "h8",
        foodName: "Brown Rice",
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 2,
        servingSize: 1,
        mealType: "dinner",
        time: "7:30 PM",
      },
      {
        id: "h9",
        foodName: "Steamed Broccoli",
        calories: 55,
        protein: 4,
        carbs: 11,
        fat: 0,
        servingSize: 1,
        mealType: "dinner",
        time: "7:30 PM",
      },
    ],
    // 2 days ago (index 2)
    [
      {
        id: "h10",
        foodId: "6",
        foodName: "Oatmeal",
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 3,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:00 AM",
      },
      {
        id: "h11",
        foodId: "19",
        foodName: "Blueberries",
        calories: 84,
        protein: 1,
        carbs: 21,
        fat: 0,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:00 AM",
      },
      {
        id: "h12",
        foodName: "Honey",
        calories: 64,
        protein: 0,
        carbs: 17,
        fat: 0,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:00 AM",
      },
      {
        id: "h13",
        foodName: "Grilled Chicken Salad",
        calories: 285,
        protein: 35,
        carbs: 12,
        fat: 11,
        servingSize: 1,
        mealType: "lunch",
        time: "1:00 PM",
      },
      {
        id: "h14",
        foodName: "Olive Oil Dressing",
        calories: 90,
        protein: 0,
        carbs: 2,
        fat: 10,
        servingSize: 1,
        mealType: "lunch",
        time: "1:00 PM",
      },
      {
        id: "h15",
        foodId: "15",
        foodName: "Protein Shake",
        calories: 170,
        protein: 30,
        carbs: 8,
        fat: 2,
        servingSize: 1,
        mealType: "snacks",
        time: "4:00 PM",
      },
      {
        id: "h16",
        foodName: "Beef Stir Fry",
        calories: 340,
        protein: 28,
        carbs: 15,
        fat: 20,
        servingSize: 1,
        mealType: "dinner",
        time: "6:45 PM",
      },
      {
        id: "h17",
        foodName: "Jasmine Rice",
        calories: 205,
        protein: 4,
        carbs: 45,
        fat: 0,
        servingSize: 1,
        mealType: "dinner",
        time: "6:45 PM",
      },
    ],
    // 3 days ago (index 3)
    [
      {
        id: "h18",
        foodId: "18",
        foodName: "Cottage Cheese",
        calories: 206,
        protein: 28,
        carbs: 8,
        fat: 9,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:15 AM",
      },
      {
        id: "h19",
        foodName: "Strawberries",
        calories: 49,
        protein: 1,
        carbs: 12,
        fat: 0,
        servingSize: 1,
        mealType: "breakfast",
        time: "8:15 AM",
      },
      {
        id: "h20",
        foodName: "Tuna Salad Wrap",
        calories: 380,
        protein: 32,
        carbs: 28,
        fat: 18,
        servingSize: 1,
        mealType: "lunch",
        time: "12:45 PM",
      },
      {
        id: "h21",
        foodName: "Baby Carrots",
        calories: 35,
        protein: 1,
        carbs: 8,
        fat: 0,
        servingSize: 1,
        mealType: "lunch",
        time: "12:45 PM",
      },
      {
        id: "h22",
        foodName: "Hummus",
        calories: 70,
        protein: 3,
        carbs: 6,
        fat: 5,
        servingSize: 1,
        mealType: "lunch",
        time: "12:45 PM",
      },
      {
        id: "h23",
        foodName: "Trail Mix",
        calories: 150,
        protein: 5,
        carbs: 13,
        fat: 10,
        servingSize: 1,
        mealType: "snacks",
        time: "3:45 PM",
      },
      {
        id: "h24",
        foodName: "Baked Cod",
        calories: 189,
        protein: 41,
        carbs: 0,
        fat: 1,
        servingSize: 1,
        mealType: "dinner",
        time: "7:15 PM",
      },
      {
        id: "h25",
        foodName: "Roasted Asparagus",
        calories: 40,
        protein: 4,
        carbs: 8,
        fat: 0,
        servingSize: 1,
        mealType: "dinner",
        time: "7:15 PM",
      },
      {
        id: "h26",
        foodName: "Mashed Cauliflower",
        calories: 85,
        protein: 6,
        carbs: 12,
        fat: 3,
        servingSize: 1,
        mealType: "dinner",
        time: "7:15 PM",
      },
    ],
  ]

  for (let i = 0; i <= 6; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    let meals: MealEntry[] = []

    // Add meals for the first 4 days (today and last 3 days)
    if (i <= 3 && sampleHistoricalMeals[i]) {
      meals = sampleHistoricalMeals[i].map((meal) => ({
        ...meal,
        foodId: meal.foodId ?? "",
        date: dateString,
      }))
    }

    // Calculate totals from meals
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

    data.push({
      date: dateString,
      calories: meals.length > 0 ? totals.calories : Math.floor(Math.random() * 400) + 1800,
      protein: meals.length > 0 ? totals.protein : Math.floor(Math.random() * 40) + 140,
      carbs: meals.length > 0 ? totals.carbs : Math.floor(Math.random() * 60) + 180,
      fat: meals.length > 0 ? totals.fat : Math.floor(Math.random() * 20) + 60,
      water: Math.floor(Math.random() * 1000) + 2000, // 2000-3000ml
      meals: meals,
    })
  }

  return data
}

// Helper function to get food icon
const getFoodIcon = (foodName: string) => {
  const name = foodName.toLowerCase()
  if (name.includes("egg")) return Egg
  if (name.includes("beef") || name.includes("steak")) return Beef
  if (name.includes("fish") || name.includes("salmon") || name.includes("tuna") || name.includes("cod")) return Fish
  if (name.includes("milk") || name.includes("yogurt") || name.includes("cheese")) return Milk
  if (name.includes("coffee")) return Coffee
  if (name.includes("banana")) return Banana
  if (name.includes("salad") || name.includes("spinach") || name.includes("broccoli") || name.includes("vegetables"))
    return Salad
  return Apple
}

// Simple line chart component
const TrendsChart = ({ data, selectedMacro }: { data: DailyNutrition[]; selectedMacro: keyof DailyNutrition }) => {
  const maxValue = Math.max(...data.map((d) => d[selectedMacro] as number))
  const minValue = Math.min(...data.map((d) => d[selectedMacro] as number))
  const range = maxValue - minValue || 1

  return (
    <div className="h-64 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="h-full relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 32}
              x2="380"
              y2={40 + i * 32}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = maxValue - (i * range) / 4
            return (
              <text key={i} x="35" y={45 + i * 32} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">
                {Math.round(value)}
              </text>
            )
          })}

          {/* Data line */}
          <polyline
            fill="none"
            stroke="rgb(168, 85, 247)"
            strokeWidth="2"
            points={data
              .map((d, i) => {
                const x = 40 + i * (340 / (data.length - 1))
                const y = 40 + (160 - (((d[selectedMacro] as number) - minValue) / range) * 160)
                return `${x},${y}`
              })
              .join(" ")}
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = 40 + i * (340 / (data.length - 1))
            const y = 40 + (160 - (((d[selectedMacro] as number) - minValue) / range) * 160)
            return <circle key={i} cx={x} cy={y} r="4" fill="rgb(168, 85, 247)" stroke="white" strokeWidth="2" />
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={40 + i * (340 / (data.length - 1))}
              y="190"
              fill="rgba(255,255,255,0.6)"
              fontSize="10"
              textAnchor="middle"
            >
              {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

// BMR Calculation Functions
const calculateBMR = (age: number, gender: string, weight: number, height: number) => {
  // Mifflin-St Jeor Equation
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

const calculateTDEE = (bmr: number, activityLevel: number) => {
  return Math.round(bmr * activityLevel)
}

const calculateGoalCalories = (tdee: number, goalType: string) => {
  switch (goalType) {
    case "cut":
      return tdee - 500
    case "bulk":
      return tdee + 500
    default: // maintenance
      return tdee
  }
}

const calculateMacros = (calories: number, goalType: string) => {
  let proteinRatio, carbRatio, fatRatio

  switch (goalType) {
    case "cut":
      // Higher protein for muscle preservation during cut
      proteinRatio = 0.35 // 35%
      carbRatio = 0.35 // 35%
      fatRatio = 0.3 // 30%
      break
    case "bulk":
      // Balanced macros for muscle building
      proteinRatio = 0.25 // 25%
      carbRatio = 0.45 // 45%
      fatRatio = 0.3 // 30%
      break
    default: // maintenance
      proteinRatio = 0.3 // 30%
      carbRatio = 0.4 // 40%
      fatRatio = 0.3 // 30%
      break
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram
    carbs: Math.round((calories * carbRatio) / 4), // 4 calories per gram
    fat: Math.round((calories * fatRatio) / 9), // 9 calories per gram
  }
}

export default function NutritionPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddFood, setShowAddFood] = useState(false)
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState(1)
  const [customFood, setCustomFood] = useState<FoodItem>({
    id: "",
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: "serving",
    servingSize: 1,
  })
  const [selectedMealType, setSelectedMealType] = useState("breakfast")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [editingGoals, setEditingGoals] = useState(false)
  const [selectedTrendMacro, setSelectedTrendMacro] = useState<keyof DailyNutrition>("calories")
  const [editingCustomFood, setEditingCustomFood] = useState<FoodItem | null>(null)
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  // BMR Calculator state
  const [showBMRCalculator, setShowBMRCalculator] = useState(false)
  const [bmrData, setBmrData] = useState({
    age: 25,
    gender: "male",
    weight: 70, // kg
    height: 175, // cm
    activityLevel: 1.55, // moderate
    goalType: "maintenance", // maintenance, cut, bulk
  })
  const [calculatedBMR, setCalculatedBMR] = useState(0)
  const [calculatedTDEE, setCalculatedTDEE] = useState(0)
  const [calculatedGoalCalories, setCalculatedGoalCalories] = useState(0)
  const [calculatedMacros, setCalculatedMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  // State management
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(initialNutritionGoals)
  const [tempGoals, setTempGoals] = useState<NutritionGoals>(initialNutritionGoals)
  const [todayIntake, setTodayIntake] = useState<DailyIntake>(initialTodayIntake)
  const [waterIntake, setWaterIntake] = useState(initialTodayIntake.water)
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(sampleMealEntries)
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([])
  const [historicalData, setHistoricalData] = useState<DailyNutrition[]>(generateHistoricalData())
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(baseFoodDatabase)

  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = foodDatabase.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, foodDatabase])

  useEffect(() => {
    // Update today's intake based on meal entries
    const today = new Date().toISOString().split("T")[0]
    const todayEntries = mealEntries.filter((entry) => entry.date === today)

    const totals = todayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
        water: waterIntake,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, water: waterIntake },
    )

    setTodayIntake(totals)
  }, [mealEntries, waterIntake])

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        router.replace("/login")
        return
      }

      setUser(session.user)
      setLoading(false)
    } catch (error) {
      console.error("Error checking session:", error)
      router.replace("/login")
    }
  }

  const caloriesPercent = (todayIntake.calories / nutritionGoals.calories) * 100
  const proteinPercent = (todayIntake.protein / nutritionGoals.protein) * 100
  const carbsPercent = (todayIntake.carbs / nutritionGoals.carbs) * 100
  const fatPercent = (todayIntake.fat / nutritionGoals.fat) * 100
  const waterPercent = (waterIntake / nutritionGoals.water) * 100

  const handleCustomFoodChange = (field: keyof FoodItem, value: any) => {
    if (editingCustomFood) {
      setEditingCustomFood((prev) => (prev ? { ...prev, [field]: value } : null))
    } else {
      setCustomFood((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addCustomFood = () => {
    const newFood: FoodItem = {
      ...customFood,
      id: Date.now().toString(),
      isCustom: true,
    }

    setCustomFoods((prev) => [...prev, newFood])
    setFoodDatabase((prev) => [...prev, newFood])

    toast({
      title: "Custom Food Added",
      description: `${customFood.name} has been added to your custom foods.`,
    })

    setCustomFood({
      id: "",
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      serving: "serving",
      servingSize: 1,
    })
    setShowCustomFoodForm(false)
  }

  const updateCustomFood = () => {
    if (!editingCustomFood) return

    setCustomFoods((prev) => prev.map((food) => (food.id === editingCustomFood.id ? editingCustomFood : food)))
    setFoodDatabase((prev) => prev.map((food) => (food.id === editingCustomFood.id ? editingCustomFood : food)))

    toast({
      title: "Custom Food Updated",
      description: `${editingCustomFood.name} has been updated.`,
    })

    setEditingCustomFood(null)
    setShowCustomFoodForm(false)
  }

  const deleteCustomFood = (foodId: string) => {
    const food = customFoods.find((f) => f.id === foodId)

    setCustomFoods((prev) => prev.filter((f) => f.id !== foodId))
    setFoodDatabase((prev) => prev.filter((f) => f.id !== foodId))

    toast({
      title: "Custom Food Deleted",
      description: `${food?.name} has been deleted.`,
    })
  }

  const addQuickFood = (food: FoodItem) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
    }

    setMealEntries((prev) => [...prev, newEntry])

    toast({
      title: "Food Added",
      description: `${food.name} has been added to your log.`,
    })
  }

  const addFoodFromSearch = (food: FoodItem) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
    }

    setMealEntries((prev) => [...prev, newEntry])

    toast({
      title: "Food Added",
      description: `${food.name} has been added to your ${selectedMealType}.`,
    })
    setSearchTerm("")
    setSearchResults([])
  }

  const viewMealPlan = (plan: MealPlan) => {
    setSelectedMealPlan(plan)
    setSelectedDay(1)
    setShowMealPlanDetails(true)
  }

  const saveNutritionGoals = () => {
    setNutritionGoals(tempGoals)
    toast({
      title: "Goals Updated",
      description: "Your nutrition goals have been updated successfully.",
    })
    setEditingGoals(false)
  }

  const updateWaterIntake = (amount: number) => {
    const newAmount = Math.min(Math.max(0, waterIntake + amount), nutritionGoals.water * 1.5)
    setWaterIntake(newAmount)
    toast({
      title: "Water Intake Updated",
      description: `${amount > 0 ? "Added" : "Removed"} ${Math.abs(amount)}ml of water.`,
    })
  }

  const toggleDayExpansion = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date)
  }

  const getMealsByType = (meals: MealEntry[], mealType: string) => {
    return meals.filter((meal) => meal.mealType === mealType)
  }

  const handleBMRCalculation = () => {
    const bmr = calculateBMR(bmrData.age, bmrData.gender, bmrData.weight, bmrData.height)
    const tdee = calculateTDEE(bmr, bmrData.activityLevel)
    const goalCalories = calculateGoalCalories(tdee, bmrData.goalType)
    const macros = calculateMacros(goalCalories, bmrData.goalType)

    setCalculatedBMR(Math.round(bmr))
    setCalculatedTDEE(tdee)
    setCalculatedGoalCalories(goalCalories)
    setCalculatedMacros(macros)
  }

  const applyCalculatedGoals = () => {
    const newGoals = {
      calories: calculatedGoalCalories,
      protein: calculatedMacros.protein,
      carbs: calculatedMacros.carbs,
      fat: calculatedMacros.fat,
      water: nutritionGoals.water, // Keep existing water goal
    }

    setNutritionGoals(newGoals)
    setTempGoals(newGoals)
    setShowBMRCalculator(false)

    toast({
      title: "Goals Applied",
      description: `Your nutrition goals have been updated based on your ${bmrData.goalType} plan.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white/70">Loading nutrition data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <NavigationHeader user={user} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="today" className="data-[state=active]:bg-white/20 text-white">
              Today
            </TabsTrigger>
            <TabsTrigger value="meal-plans" className="data-[state=active]:bg-white/20 text-white">
              Meal Plans
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-white/20 text-white">
              Goals
            </TabsTrigger>
            <TabsTrigger value="custom-foods" className="data-[state=active]:bg-white/20 text-white">
              Custom Foods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Daily Overview */}
            <NutritionOverview todayIntake={todayIntake} nutritionGoals={nutritionGoals} />

            {/* Water Tracking */}
            <WaterTracker
              waterIntake={waterIntake}
              nutritionGoals={nutritionGoals}
              onUpdateWaterIntake={updateWaterIntake}
            />

            {/* Today's Meals */}
            <MealLogger
              mealEntries={mealEntries}
              selectedMealType={selectedMealType}
              onMealTypeChange={setSelectedMealType}
              onAddFood={() => setShowAddFood(true)}
            />

            {/* Macro Distribution */}
            <MacroDistribution todayIntake={todayIntake} />

            {/* Quick Add Foods */}
            <QuickAddFoods quickAddFoods={quickAddFoods} onAddQuickFood={addQuickFood} />
          </TabsContent>

          <TabsContent value="meal-plans" className="space-y-6">
            {!showMealPlanDetails ? (
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Meal Plans</CardTitle>
                      <CardDescription className="text-white/60">Personalized nutrition plans</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mealPlans.map((plan, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">{plan.name}</h3>
                          <p className="text-sm text-white/60">{plan.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                              {plan.days} days
                            </Badge>
                            <span className="text-xs text-white/60">By {plan.createdBy}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => viewMealPlan(plan)}
                        >
                          View Plan
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white -ml-4 mb-2"
                        onClick={() => setShowMealPlanDetails(false)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Back to Plans
                      </Button>
                      <CardTitle className="text-white">{selectedMealPlan?.name}</CardTitle>
                      <CardDescription className="text-white/60">{selectedMealPlan?.description}</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Apply Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {Array.from({ length: selectedMealPlan?.days || 0 }).map((_, i) => (
                      <Button
                        key={i}
                        variant={selectedDay === i + 1 ? "default" : "outline"}
                        className={
                          selectedDay === i + 1
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                        }
                        onClick={() => setSelectedDay(i + 1)}
                      >
                        Day {i + 1}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-medium text-white mb-3">{meal}</h3>
                        <div className="space-y-3">
                          {/* Sample meal items */}
                          {index === 0 && (
                            <>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Egg className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Scrambled Eggs</h4>
                                    <p className="text-xs text-white/60">2 large eggs</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">140 cal</p>
                                  <p className="text-xs text-white/60">P: 12g • C: 1g • F: 10g</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Apple className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Whole Wheat Toast</h4>
                                    <p className="text-xs text-white/60">2 slices</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">138 cal</p>
                                  <p className="text-xs text-white/60">P: 6g • C: 24g • F: 2g</p>
                                </div>
                              </div>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Salad className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Chicken Salad</h4>
                                    <p className="text-xs text-white/60">4oz chicken, mixed greens</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">320 cal</p>
                                  <p className="text-xs text-white/60">P: 35g • C: 10g • F: 15g</p>
                                </div>
                              </div>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Fish className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Grilled Salmon</h4>
                                    <p className="text-xs text-white/60">6oz fillet</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">350 cal</p>
                                  <p className="text-xs text-white/60">P: 42g • C: 0g • F: 20g</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Salad className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Steamed Vegetables</h4>
                                    <p className="text-xs text-white/60">Broccoli, carrots, cauliflower</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">85 cal</p>
                                  <p className="text-xs text-white/60">P: 4g • C: 18g • F: 0g</p>
                                </div>
                              </div>
                            </>
                          )}
                          {index === 3 && (
                            <>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Apple className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">Greek Yogurt</h4>
                                    <p className="text-xs text-white/60">1 cup with berries</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">180 cal</p>
                                  <p className="text-xs text-white/60">P: 20g • C: 13g • F: 5g</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-3">Daily Nutrition Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">2,100</div>
                        <div className="text-sm text-white/60">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">165g</div>
                        <div className="text-sm text-white/60">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">210g</div>
                        <div className="text-sm text-white/60">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">70g</div>
                        <div className="text-sm text-white/60">Fat</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Nutrition Trends</CardTitle>
                    <CardDescription className="text-white/60">Your nutrition tracking over time</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LineChart className="h-4 w-4 text-purple-400" />
                    <Select
                      value={selectedTrendMacro}
                      onValueChange={(value) => setSelectedTrendMacro(value as keyof DailyNutrition)}
                    >
                      <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calories">Calories</SelectItem>
                        <SelectItem value="protein">Protein</SelectItem>
                        <SelectItem value="carbs">Carbs</SelectItem>
                        <SelectItem value="fat">Fat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TrendsChart data={historicalData} selectedMacro={selectedTrendMacro} />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Daily History</CardTitle>
                <CardDescription className="text-white/60">Your daily nutrition logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicalData.map((day, index) => {
                    const isToday = day.date === new Date().toISOString().split("T")[0]
                    const isYesterday = day.date === new Date(Date.now() - 86400000).toISOString().split("T")[0]
                    const isExpanded = expandedDay === day.date

                    let dateLabel = day.date
                    if (isToday) dateLabel = "Today"
                    else if (isYesterday) dateLabel = "Yesterday"
                    else {
                      const date = new Date(day.date)
                      dateLabel = `${Math.abs(Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)))} days ago`
                    }

                    return (
                      <div key={index} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => toggleDayExpansion(day.date)}
                        >
                          <div>
                            <h3 className="font-medium text-white">{dateLabel}</h3>
                            <p className="text-sm text-white/60">{day.calories} calories</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <p className="text-white/70">
                                P: {day.protein}g • C: {day.carbs}g • F: {day.fat}g
                              </p>
                              <div className="flex space-x-1 mt-1">
                                <Badge
                                  variant={day.calories >= nutritionGoals.calories * 0.9 ? "default" : "outline"}
                                  className={
                                    day.calories >= nutritionGoals.calories * 0.9
                                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                      : "border-white/30 text-white/70"
                                  }
                                >
                                  Cal
                                </Badge>
                                <Badge
                                  variant={day.protein >= nutritionGoals.protein * 0.9 ? "default" : "outline"}
                                  className={
                                    day.protein >= nutritionGoals.protein * 0.9
                                      ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                      : "border-white/30 text-white/70"
                                  }
                                >
                                  Pro
                                </Badge>
                              </div>
                            </div>
                            <div className="transition-transform duration-300 ease-in-out">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-white/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-white/60" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
                          <div className="border-t border-white/10 bg-white/5">
                            <div className="p-4 space-y-4 transform transition-transform duration-300 ease-in-out">
                              {day.meals && day.meals.length > 0 ? (
                                <>
                                  {/* Water Intake */}
                                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg transform transition-all duration-300 ease-in-out hover:bg-white/15">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Droplets className="h-4 w-4 text-blue-400" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white">Water Intake</h4>
                                        <p className="text-xs text-white/60">
                                          {(day.water / 1000).toFixed(1)}L consumed
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-white">{day.water}ml</p>
                                      <p className="text-xs text-white/60">
                                        {Math.round((day.water / nutritionGoals.water) * 100)}% of goal
                                      </p>
                                    </div>
                                  </div>

                                  {/* Meals by Type */}
                                  {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
                                    const mealsOfType = getMealsByType(day.meals!, mealType)
                                    if (mealsOfType.length === 0) return null

                                    return (
                                      <div key={mealType} className="mb-4">
                                        <h4 className="text-sm font-medium text-white/80 mb-2 capitalize">
                                          {mealType}
                                        </h4>
                                        <div className="space-y-2">
                                          {mealsOfType.map((meal, mealIndex) => {
                                            const FoodIcon = getFoodIcon(meal.foodName)
                                            return (
                                              <div
                                                key={mealIndex}
                                                className="flex items-center justify-between p-3 bg-white/10 rounded-lg transform transition-all duration-300 ease-in-out hover:bg-white/15 hover:scale-[1.02]"
                                                style={{
                                                  animationDelay: `${mealIndex * 50}ms`,
                                                }}
                                              >
                                                <div className="flex items-center space-x-3">
                                                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                    <FoodIcon className="h-4 w-4 text-purple-400" />
                                                  </div>
                                                  <div>
                                                    <h5 className="font-medium text-white text-sm">{meal.foodName}</h5>
                                                    <div className="flex items-center space-x-2 text-xs text-white/60">
                                                      <Clock className="h-3 w-3" />
                                                      <span>{meal.time}</span>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="text-right">
                                                  <p className="font-medium text-white text-sm">{meal.calories} cal</p>
                                                  <p className="text-xs text-white/60">
                                                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )
                                  })}

                                  {/* Daily Summary */}
                                  <div className="mt-4 p-3 bg-white/10 rounded-lg transform transition-all duration-300 ease-in-out hover:bg-white/15">
                                    <h4 className="text-sm font-medium text-white mb-3">Daily Summary</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-white">{day.calories}</div>
                                        <div className="text-xs text-white/60">Calories</div>
                                        <div className="text-xs text-white/50">
                                          {Math.round((day.calories / nutritionGoals.calories) * 100)}% of goal
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-white">{day.protein}g</div>
                                        <div className="text-xs text-white/60">Protein</div>
                                        <div className="text-xs text-white/50">
                                          {Math.round((day.protein / nutritionGoals.protein) * 100)}% of goal
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-white">{day.carbs}g</div>
                                        <div className="text-xs text-white/60">Carbs</div>
                                        <div className="text-xs text-white/50">
                                          {Math.round((day.carbs / nutritionGoals.carbs) * 100)}% of goal
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-lg font-bold text-white">{day.fat}g</div>
                                        <div className="text-xs text-white/60">Fat</div>
                                        <div className="text-xs text-white/50">
                                          {Math.round((day.fat / nutritionGoals.fat) * 100)}% of goal
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-8">
                                  <Utensils className="h-12 w-12 text-white/20 mx-auto mb-3" />
                                  <p className="text-white/60">No detailed meal data available for this day</p>
                                  <p className="text-xs text-white/50 mt-1">Only summary nutrition data is shown</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <div className="space-y-6">
              {/* BMR Calculator Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">BMR Calculator</CardTitle>
                      <CardDescription className="text-white/60">
                        Calculate your personalized calorie and macro targets
                      </CardDescription>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={() => setShowBMRCalculator(!showBMRCalculator)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {showBMRCalculator ? "Hide Calculator" : "Calculate Goals"}
                    </Button>
                  </div>
                </CardHeader>

                {showBMRCalculator && (
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Input Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="age" className="text-white">
                              Age
                            </Label>
                            <Input
                              id="age"
                              type="number"
                              value={bmrData.age}
                              onChange={(e) => setBmrData({ ...bmrData, age: Number.parseInt(e.target.value) || 0 })}
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender" className="text-white">
                              Gender
                            </Label>
                            <Select
                              value={bmrData.gender}
                              onValueChange={(value) => setBmrData({ ...bmrData, gender: value })}
                            >
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="weight" className="text-white">
                              Weight (kg)
                            </Label>
                            <Input
                              id="weight"
                              type="number"
                              value={bmrData.weight}
                              onChange={(e) =>
                                setBmrData({ ...bmrData, weight: Number.parseFloat(e.target.value) || 0 })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="height" className="text-white">
                              Height (cm)
                            </Label>
                            <Input
                              id="height"
                              type="number"
                              value={bmrData.height}
                              onChange={(e) =>
                                setBmrData({ ...bmrData, height: Number.parseFloat(e.target.value) || 0 })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="activity" className="text-white">
                            Activity Level
                          </Label>
                          <Select
                            value={bmrData.activityLevel.toString()}
                            onValueChange={(value) =>
                              setBmrData({ ...bmrData, activityLevel: Number.parseFloat(value) })
                            }
                          >
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.2">Sedentary (little/no exercise)</SelectItem>
                              <SelectItem value="1.375">Light (light exercise 1-3 days/week)</SelectItem>
                              <SelectItem value="1.55">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                              <SelectItem value="1.725">Heavy (hard exercise 6-7 days/week)</SelectItem>
                              <SelectItem value="1.9">Extreme (very hard exercise, physical job)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="goal" className="text-white">
                            Goal
                          </Label>
                          <Select
                            value={bmrData.goalType}
                            onValueChange={(value) => setBmrData({ ...bmrData, goalType: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maintenance">Maintenance (maintain weight)</SelectItem>
                              <SelectItem value="cut">Cut (lose weight, -500 cal)</SelectItem>
                              <SelectItem value="bulk">Bulk (gain weight, +500 cal)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={handleBMRCalculation}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          Calculate My Goals
                        </Button>
                      </div>

                      {/* Results Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">Calculated Results</h3>

                        {calculatedBMR > 0 && (
                          <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-white">{calculatedBMR}</div>
                                  <div className="text-sm text-white/60">BMR (calories/day)</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-white">{calculatedTDEE}</div>
                                  <div className="text-sm text-white/60">TDEE (maintenance)</div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
                              <h4 className="font-medium text-white mb-3 capitalize">{bmrData.goalType} Plan</h4>
                              <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-white">{calculatedGoalCalories}</div>
                                <div className="text-sm text-white/60">Daily Calories</div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-xl font-bold text-purple-400">{calculatedMacros.protein}g</div>
                                  <div className="text-xs text-white/60">Protein</div>
                                </div>
                                <div>
                                  <div className="text-xl font-bold text-blue-400">{calculatedMacros.carbs}g</div>
                                  <div className="text-xs text-white/60">Carbs</div>
                                </div>
                                <div>
                                  <div className="text-xl font-bold text-green-400">{calculatedMacros.fat}g</div>
                                  <div className="text-xs text-white/60">Fat</div>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-start space-x-3">
                                <Info className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-white/70">
                                  <p className="font-medium mb-1">Macro Breakdown:</p>
                                  {bmrData.goalType === "cut" && <p>• Higher protein (35%) for muscle preservation</p>}
                                  {bmrData.goalType === "bulk" && <p>• Higher carbs (45%) for energy and growth</p>}
                                  {bmrData.goalType === "maintenance" && <p>• Balanced macros for general health</p>}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={applyCalculatedGoals}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                              Apply These Goals
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Current Goals Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Current Nutrition Goals</CardTitle>
                      <CardDescription className="text-white/60">Your daily macro and calorie targets</CardDescription>
                    </div>
                    {!editingGoals ? (
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => setEditingGoals(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Goals
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => {
                            setTempGoals({ ...nutritionGoals })
                            setEditingGoals(false)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={saveNutritionGoals}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!editingGoals ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-white">Daily Calories</Label>
                                <span className="text-white font-medium">{nutritionGoals.calories}</span>
                              </div>
                              <Progress value={100} className="bg-white/20" />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-white">Protein (g)</Label>
                                <span className="text-white font-medium">{nutritionGoals.protein}g</span>
                              </div>
                              <Progress value={100} className="bg-white/20" />
                              <div className="text-xs text-white/60 text-right">
                                {Math.round(((nutritionGoals.protein * 4) / nutritionGoals.calories) * 100)}% of
                                calories
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-white">Carbs (g)</Label>
                                <span className="text-white font-medium">{nutritionGoals.carbs}g</span>
                              </div>
                              <Progress value={100} className="bg-white/20" />
                              <div className="text-xs text-white/60 text-right">
                                {Math.round(((nutritionGoals.carbs * 4) / nutritionGoals.calories) * 100)}% of calories
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-white">Fat (g)</Label>
                                <span className="text-white font-medium">{nutritionGoals.fat}g</span>
                              </div>
                              <Progress value={100} className="bg-white/20" />
                              <div className="text-xs text-white/60 text-right">
                                {Math.round(((nutritionGoals.fat * 9) / nutritionGoals.calories) * 100)}% of calories
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-white">Water (ml)</Label>
                                <span className="text-white font-medium">{nutritionGoals.water}ml</span>
                              </div>
                              <Progress value={100} className="bg-white/20" />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                              <div className="flex items-start space-x-3">
                                <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-white">Nutrition Goal Recommendations</h4>
                                  <p className="text-sm text-white/60 mt-1">
                                    Use the BMR calculator above to get personalized recommendations based on your
                                    goals, or manually adjust these values to meet your specific requirements.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="calories" className="text-white">
                              Daily Calories
                            </Label>
                            <Input
                              id="calories"
                              type="number"
                              value={tempGoals.calories}
                              onChange={(e) =>
                                setTempGoals({
                                  ...tempGoals,
                                  calories: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="protein" className="text-white">
                              Protein (g)
                            </Label>
                            <Input
                              id="protein"
                              type="number"
                              value={tempGoals.protein}
                              onChange={(e) =>
                                setTempGoals({
                                  ...tempGoals,
                                  protein: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="carbs" className="text-white">
                              Carbs (g)
                            </Label>
                            <Input
                              id="carbs"
                              type="number"
                              value={tempGoals.carbs}
                              onChange={(e) =>
                                setTempGoals({
                                  ...tempGoals,
                                  carbs: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fat" className="text-white">
                              Fat (g)
                            </Label>
                            <Input
                              id="fat"
                              type="number"
                              value={tempGoals.fat}
                              onChange={(e) =>
                                setTempGoals({
                                  ...tempGoals,
                                  fat: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="water" className="text-white">
                              Water (ml)
                            </Label>
                            <Input
                              id="water"
                              type="number"
                              value={tempGoals.water}
                              onChange={(e) =>
                                setTempGoals({
                                  ...tempGoals,
                                  water: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/30 text-white"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-cente space-x-3">
                            <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-white">Macro Distribution Preview</h4>
                              <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                <div>
                                  <span className="text-purple-400">Protein:</span>{" "}
                                  <span className="text-white">
                                    {Math.round(((tempGoals.protein * 4) / tempGoals.calories) * 100)}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-blue-400">Carbs:</span>{" "}
                                  <span className="text-white">
                                    {Math.round(((tempGoals.carbs * 4) / tempGoals.calories) * 100)}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-green-400">Fat:</span>{" "}
                                  <span className="text-white">
                                    {Math.round(((tempGoals.fat * 9) / tempGoals.calories) * 100)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="custom-foods">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Custom Foods</CardTitle>
                    <CardDescription className="text-white/60">
                      Create and manage your custom food items
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => setShowCustomFoodForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Food
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCustomFoodForm && (
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {editingCustomFood ? "Edit Custom Food" : "Add New Custom Food"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="food-name" className="text-white">
                          Food Name
                        </Label>
                        <Input
                          id="food-name"
                          value={editingCustomFood ? editingCustomFood.name : customFood.name}
                          onChange={(e) => handleCustomFoodChange("name", e.target.value)}
                          className="bg-white/10 border-white/30 text-white"
                          placeholder="e.g., Homemade Protein Bar"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serving" className="text-white">
                          Serving Unit
                        </Label>
                        <Input
                          id="serving"
                          value={editingCustomFood ? editingCustomFood.serving : customFood.serving}
                          onChange={(e) => handleCustomFoodChange("serving", e.target.value)}
                          className="bg-white/10 border-white/30 text-white"
                          placeholder="e.g., bar, cup, piece"
                        />
                      </div>
                      <div>
                        <Label htmlFor="calories" className="text-white">
                          Calories per serving
                        </Label>
                        <Input
                          id="calories"
                          type="number"
                          value={editingCustomFood ? editingCustomFood.calories : customFood.calories}
                          onChange={(e) => handleCustomFoodChange("calories", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="protein" className="text-white">
                          Protein (g)
                        </Label>
                        <Input
                          id="protein"
                          type="number"
                          value={editingCustomFood ? editingCustomFood.protein : customFood.protein}
                          onChange={(e) => handleCustomFoodChange("protein", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="carbs" className="text-white">
                          Carbs (g)
                        </Label>
                        <Input
                          id="carbs"
                          type="number"
                          value={editingCustomFood ? editingCustomFood.carbs : customFood.carbs}
                          onChange={(e) => handleCustomFoodChange("carbs", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fat" className="text-white">
                          Fat (g)
                        </Label>
                        <Input
                          id="fat"
                          type="number"
                          value={editingCustomFood ? editingCustomFood.fat : customFood.fat}
                          onChange={(e) => handleCustomFoodChange("fat", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/30 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => {
                          setShowCustomFoodForm(false)
                          setEditingCustomFood(null)
                          setCustomFood({
                            id: "",
                            name: "",
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0,
                            serving: "serving",
                            servingSize: 1,
                          })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={editingCustomFood ? updateCustomFood : addCustomFood}
                      >
                        {editingCustomFood ? "Update Food" : "Add Food"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {customFoods.length === 0 ? (
                    <div className="text-center py-8">
                      <Apple className="h-12 w-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/60">No custom foods created yet</p>
                      <p className="text-sm text-white/50 mt-1">Create custom foods for items not in our database</p>
                    </div>
                  ) : (
                    customFoods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Apple className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{food.name}</h3>
                            <p className="text-sm text-white/60">
                              {food.calories} cal per {food.serving}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm text-white/60">
                            <p>
                              P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => {
                              setEditingCustomFood(food)
                              setShowCustomFoodForm(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                            onClick={() => deleteCustomFood(food.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Add Food</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white"
                    onClick={() => setShowAddFood(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer"
                      onClick={() => addFoodFromSearch(food)}
                    >
                      <div>
                        <h4 className="font-medium text-white">{food.name}</h4>
                        <p className="text-sm text-white/60">
                          {food.calories} cal per {food.serving}
                        </p>
                      </div>
                      <div className="text-right text-sm text-white/60">
                        <p>P: {food.protein}g</p>
                        <p>C: {food.carbs}g</p>
                        <p>F: {food.fat}g</p>
                      </div>
                    </div>
                  ))}
                </div>

                {searchTerm && searchResults.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-white/60">No foods found</p>
                    <p className="text-sm text-white/50 mt-1">Try a different search term</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
