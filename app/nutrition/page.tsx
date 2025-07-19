"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Apple, TrendingUp, Target, Utensils, Clock } from "lucide-react"

const nutritionGoals = {
  calories: 2200,
  protein: 165,
  carbs: 220,
  fat: 73,
}

const todayIntake = {
  calories: 1847,
  protein: 142,
  carbs: 198,
  fat: 67,
}

const recentFoods = [
  { name: "Greek Yogurt", calories: 150, protein: 20, carbs: 8, fat: 5, time: "8:30 AM" },
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, time: "8:30 AM" },
  { name: "Chicken Breast", calories: 231, protein: 43, carbs: 0, fat: 5, time: "12:30 PM" },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 2, time: "12:30 PM" },
  { name: "Broccoli", calories: 55, protein: 4, carbs: 11, fat: 1, time: "12:30 PM" },
]

const quickAddFoods = [
  { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: "Eggs (2 large)", calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Salmon (4 oz)", calories: 206, protein: 28, carbs: 0, fat: 9 },
  { name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0 },
]

export default function NutritionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddFood, setShowAddFood] = useState(false)
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  })

  const caloriesPercent = (todayIntake.calories / nutritionGoals.calories) * 100
  const proteinPercent = (todayIntake.protein / nutritionGoals.protein) * 100
  const carbsPercent = (todayIntake.carbs / nutritionGoals.carbs) * 100
  const fatPercent = (todayIntake.fat / nutritionGoals.fat) * 100

  const handleCustomFoodChange = (field: string, value: string) => {
    setCustomFood((prev) => ({ ...prev, [field]: value }))
  }

  const addCustomFood = () => {
    // Add custom food logic here
    console.log("Adding custom food:", customFood)
    setCustomFood({ name: "", calories: "", protein: "", carbs: "", fat: "" })
    setShowAddFood(false)
  }

  const addQuickFood = (food: any) => {
    // Add quick food logic here
    console.log("Adding quick food:", food)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracking</h1>
              <p className="text-gray-600">Track your daily macros and calories</p>
            </div>
            <Button onClick={() => setShowAddFood(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Daily Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories</CardTitle>
                  <Apple className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayIntake.calories}</div>
                  <p className="text-xs text-muted-foreground">of {nutritionGoals.calories} goal</p>
                  <Progress value={caloriesPercent} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protein</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayIntake.protein}g</div>
                  <p className="text-xs text-muted-foreground">of {nutritionGoals.protein}g goal</p>
                  <Progress value={proteinPercent} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayIntake.carbs}g</div>
                  <p className="text-xs text-muted-foreground">of {nutritionGoals.carbs}g goal</p>
                  <Progress value={carbsPercent} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fat</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayIntake.fat}g</div>
                  <p className="text-xs text-muted-foreground">of {nutritionGoals.fat}g goal</p>
                  <Progress value={fatPercent} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle>{"Today's Meals"}</CardTitle>
                <CardDescription>Your logged food items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFoods.map((food, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Apple className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{food.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{food.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{food.calories} cal</p>
                        <p className="text-xs text-gray-600">
                          P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Foods */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Add</CardTitle>
                <CardDescription>Common foods for easy logging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickAddFoods.map((food, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start bg-transparent"
                      onClick={() => addQuickFood(food)}
                    >
                      <span className="font-medium text-sm">{food.name}</span>
                      <span className="text-xs text-gray-600">{food.calories} cal</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition History</CardTitle>
                <CardDescription>Your nutrition tracking over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Today", calories: 1847, protein: 142, carbs: 198, fat: 67 },
                    { date: "Yesterday", calories: 2156, protein: 158, carbs: 215, fat: 71 },
                    { date: "2 days ago", calories: 2089, protein: 165, carbs: 201, fat: 69 },
                    { date: "3 days ago", calories: 2234, protein: 171, carbs: 223, fat: 74 },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{day.date}</h3>
                        <p className="text-sm text-gray-600">{day.calories} calories</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>
                          P: {day.protein}g • C: {day.carbs}g • F: {day.fat}g
                        </p>
                        <div className="flex space-x-1 mt-1">
                          <Badge variant={day.calories >= nutritionGoals.calories * 0.9 ? "default" : "secondary"}>
                            Cal
                          </Badge>
                          <Badge variant={day.protein >= nutritionGoals.protein * 0.9 ? "default" : "secondary"}>
                            Pro
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Goals</CardTitle>
                <CardDescription>Your daily macro and calorie targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="calories">Daily Calories</Label>
                      <Input id="calories" type="number" defaultValue={nutritionGoals.calories} />
                    </div>
                    <div>
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input id="protein" type="number" defaultValue={nutritionGoals.protein} />
                    </div>
                    <div>
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input id="carbs" type="number" defaultValue={nutritionGoals.carbs} />
                    </div>
                    <div>
                      <Label htmlFor="fat">Fat (g)</Label>
                      <Input id="fat" type="number" defaultValue={nutritionGoals.fat} />
                    </div>
                  </div>
                  <Button>Update Goals</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Food</CardTitle>
                <CardDescription>Search for food or add custom entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Or add custom food</p>
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Food name"
                    value={customFood.name}
                    onChange={(e) => handleCustomFoodChange("name", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Calories"
                      type="number"
                      value={customFood.calories}
                      onChange={(e) => handleCustomFoodChange("calories", e.target.value)}
                    />
                    <Input
                      placeholder="Protein (g)"
                      type="number"
                      value={customFood.protein}
                      onChange={(e) => handleCustomFoodChange("protein", e.target.value)}
                    />
                    <Input
                      placeholder="Carbs (g)"
                      type="number"
                      value={customFood.carbs}
                      onChange={(e) => handleCustomFoodChange("carbs", e.target.value)}
                    />
                    <Input
                      placeholder="Fat (g)"
                      type="number"
                      value={customFood.fat}
                      onChange={(e) => handleCustomFoodChange("fat", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddFood(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={addCustomFood}>
                    Add Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
