"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyIntake {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

interface MacroDistributionProps {
  todayIntake: DailyIntake
}

export function MacroDistribution({ todayIntake }: MacroDistributionProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Macro Distribution</CardTitle>
        <CardDescription className="text-white/60">Breakdown of your daily macronutrients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 mb-4">
          <div className="w-48 h-48 rounded-full border-8 border-white/10 relative">
            <div
              className="absolute inset-0 rounded-full border-8 border-purple-500"
              style={{
                clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                transform: "rotate(0deg)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-blue-500"
              style={{
                clipPath: "polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, 50% 100%)",
                transform: "rotate(0deg)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-green-500"
              style={{
                clipPath: "polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)",
                transform: "rotate(0deg)",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{todayIntake.calories}</div>
                <div className="text-xs text-white/60">calories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-white">Protein</span>
            </div>
            <p className="text-white/60 text-sm">
              {Math.round(((todayIntake.protein * 4) / todayIntake.calories) * 100)}%
            </p>
            <p className="text-white font-medium">{todayIntake.protein}g</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Carbs</span>
            </div>
            <p className="text-white/60 text-sm">
              {Math.round(((todayIntake.carbs * 4) / todayIntake.calories) * 100)}%
            </p>
            <p className="text-white font-medium">{todayIntake.carbs}g</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white">Fat</span>
            </div>
            <p className="text-white/60 text-sm">{Math.round(((todayIntake.fat * 9) / todayIntake.calories) * 100)}%</p>
            <p className="text-white font-medium">{todayIntake.fat}g</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
