"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Check, Plus, Minus, Timer } from "lucide-react"

const workoutData = {
  name: "Upper Body Strength",
  week: 3,
  day: 2,
  estimatedTime: "45-60 min",
  exercises: [
    {
      id: 1,
      name: "Bench Press",
      sets: 3,
      reps: 8,
      weight: 185,
      restTime: 120,
      notes: "Focus on controlled movement",
      completed: false,
      setData: [
        { set: 1, reps: 0, weight: 185, completed: false },
        { set: 2, reps: 0, weight: 185, completed: false },
        { set: 3, reps: 0, weight: 185, completed: false },
      ],
    },
    {
      id: 2,
      name: "Incline Dumbbell Press",
      sets: 3,
      reps: 10,
      weight: 65,
      restTime: 90,
      notes: "45-degree incline",
      completed: false,
      setData: [
        { set: 1, reps: 0, weight: 65, completed: false },
        { set: 2, reps: 0, weight: 65, completed: false },
        { set: 3, reps: 0, weight: 65, completed: false },
      ],
    },
    {
      id: 3,
      name: "Pull-ups",
      sets: 3,
      reps: 6,
      weight: 0,
      restTime: 120,
      notes: "Use assistance if needed",
      completed: false,
      setData: [
        { set: 1, reps: 0, weight: 0, completed: false },
        { set: 2, reps: 0, weight: 0, completed: false },
        { set: 3, reps: 0, weight: 0, completed: false },
      ],
    },
    {
      id: 4,
      name: "Seated Cable Row",
      sets: 3,
      reps: 12,
      weight: 120,
      restTime: 90,
      notes: "Squeeze shoulder blades",
      completed: false,
      setData: [
        { set: 1, reps: 0, weight: 120, completed: false },
        { set: 2, reps: 0, weight: 120, completed: false },
        { set: 3, reps: 0, weight: 120, completed: false },
      ],
    },
  ],
}

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(workoutData)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTimer, setRestTimer] = useState(0)
  const [workoutStarted, setWorkoutStarted] = useState(false)

  const updateSetData = (exerciseId: number, setIndex: number, field: string, value: any) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              setData: exercise.setData.map((set, index) => (index === setIndex ? { ...set, [field]: value } : set)),
            }
          : exercise,
      ),
    }))
  }

  const completeSet = (exerciseId: number, setIndex: number) => {
    updateSetData(exerciseId, setIndex, "completed", true)

    // Start rest timer
    const exercise = workout.exercises.find((e) => e.id === exerciseId)
    if (exercise) {
      setIsResting(true)
      setRestTimer(exercise.restTime)
    }
  }

  const completeExercise = (exerciseId: number) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, completed: true } : exercise,
      ),
    }))
  }

  const completedExercises = workout.exercises.filter((e) => e.completed).length
  const workoutProgress = (completedExercises / workout.exercises.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{workout.name}</h1>
              <p className="text-sm text-gray-600">
                Week {workout.week}, Day {workout.day}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Timer className="h-3 w-3 mr-1" />
                {workout.estimatedTime}
              </Badge>
              {!workoutStarted ? (
                <Button onClick={() => setWorkoutStarted(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
              ) : (
                <Button variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </div>

          {workoutStarted && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {completedExercises}/{workout.exercises.length} exercises
                </span>
              </div>
              <Progress value={workoutProgress} className="h-2" />
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {!workoutStarted ? (
          // Workout Overview
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout Overview</CardTitle>
                <CardDescription>
                  {workout.exercises.length} exercises • Estimated {workout.estimatedTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-600">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{exercise.restTime}s rest</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button size="lg" onClick={() => setWorkoutStarted(true)}>
                <Play className="h-5 w-5 mr-2" />
                Start Workout
              </Button>
            </div>
          </div>
        ) : (
          // Active Workout
          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Exercise</TabsTrigger>
              <TabsTrigger value="all">All Exercises</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              {workout.exercises.map((exercise, exerciseIndex) => (
                <Card key={exercise.id} className={exerciseIndex === currentExercise ? "" : "hidden"}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{exercise.name}</span>
                          {exercise.completed && <Check className="h-5 w-5 text-green-600" />}
                        </CardTitle>
                        <CardDescription>
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        Exercise {exerciseIndex + 1}/{workout.exercises.length}
                      </Badge>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">💡 {exercise.notes}</p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {exercise.setData.map((set, setIndex) => (
                      <div key={setIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Set {set.set}</h3>
                          {set.completed && (
                            <Badge variant="default">
                              <Check className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Reps</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateSetData(exercise.id, setIndex, "reps", Math.max(0, set.reps - 1))}
                                disabled={set.completed}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSetData(exercise.id, setIndex, "reps", Number.parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-center"
                                disabled={set.completed}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateSetData(exercise.id, setIndex, "reps", set.reps + 1)}
                                disabled={set.completed}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {exercise.weight > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Weight (lbs)</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateSetData(exercise.id, setIndex, "weight", Math.max(0, set.weight - 5))
                                  }
                                  disabled={set.completed}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) =>
                                    updateSetData(exercise.id, setIndex, "weight", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-16 text-center"
                                  disabled={set.completed}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateSetData(exercise.id, setIndex, "weight", set.weight + 5)}
                                  disabled={set.completed}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {!set.completed ? (
                          <Button
                            className="w-full"
                            onClick={() => completeSet(exercise.id, setIndex)}
                            disabled={set.reps === 0}
                          >
                            Complete Set
                          </Button>
                        ) : (
                          <div className="text-center text-green-600 font-medium">
                            ✓ Set completed: {set.reps} reps @ {set.weight} lbs
                          </div>
                        )}
                      </div>
                    ))}

                    {exercise.setData.every((set) => set.completed) && !exercise.completed && (
                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() => {
                          completeExercise(exercise.id)
                          if (exerciseIndex < workout.exercises.length - 1) {
                            setCurrentExercise(exerciseIndex + 1)
                          }
                        }}
                      >
                        Complete Exercise
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Rest Timer */}
              {isResting && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, "0")}
                    </div>
                    <p className="text-orange-700 mb-4">Rest Time</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsResting(false)
                        setRestTimer(0)
                      }}
                    >
                      Skip Rest
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <Card key={exercise.id} className={exercise.completed ? "bg-green-50 border-green-200" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              exercise.completed
                                ? "bg-green-600 text-white"
                                : index === currentExercise
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {exercise.completed ? <Check className="h-4 w-4" /> : index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{exercise.name}</CardTitle>
                            <CardDescription>
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {exercise.setData.filter((s) => s.completed).length}/{exercise.sets} sets
                          </div>
                          <Progress
                            value={(exercise.setData.filter((s) => s.completed).length / exercise.sets) * 100}
                            className="w-16 h-2 mt-1"
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Complete Workout */}
        {workoutStarted && workout.exercises.every((e) => e.completed) && (
          <Card className="border-green-200 bg-green-50 mt-6">
            <CardContent className="pt-6 text-center">
              <div className="text-green-600 mb-4">
                <Check className="h-12 w-12 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Workout Complete!</h2>
                <p>Great job finishing your {workout.name} session</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button>Save & Continue</Button>
                <Button variant="outline">View Summary</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
