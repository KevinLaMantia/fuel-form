"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Target, Apple, DollarSign, Clock, Award, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock user type - in real app this would come from auth
const userType = "client" // or "trainer"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  if (userType === "trainer") {
    return <TrainerDashboard />
  }

  return <ClientDashboard />
}

function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold dark:text-white">FuelForm</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, John!</h1>
          <p className="text-gray-600 dark:text-gray-300">{"Here's your fitness progress overview"}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="workouts" className="dark:data-[state=active]:bg-gray-700">
              Workouts
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="dark:data-[state=active]:bg-gray-700">
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="progress" className="dark:data-[state=active]:bg-gray-700">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">This Week</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">3/4</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Workouts completed</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Calories Today</CardTitle>
                  <Apple className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">1,847</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">of 2,200 goal</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Weight Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">-3.2 lbs</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">This month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Streak</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">12</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Days active</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Workout */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{"Today's Workout"}</CardTitle>
                <CardDescription className="dark:text-gray-300">Upper Body Strength - Week 3, Day 2</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium dark:text-gray-200">Bench Press</span>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      3 sets x 8 reps
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium dark:text-gray-200">Incline Dumbbell Press</span>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      3 sets x 10 reps
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium dark:text-gray-200">Pull-ups</span>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      3 sets x 6 reps
                    </Badge>
                  </div>
                  <Button className="w-full mt-4 dark:bg-blue-600 dark:hover:bg-blue-700">Start Workout</Button>
                </div>
              </CardContent>
            </Card>

            {/* Trainer Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Your Trainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    SM
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">Sarah Mitchell</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Certified Personal Trainer</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Workout History</CardTitle>
                <CardDescription className="dark:text-gray-300">Your recent training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Today", name: "Upper Body Strength", status: "In Progress" },
                    { date: "Yesterday", name: "Lower Body Power", status: "Completed" },
                    { date: "2 days ago", name: "Cardio & Core", status: "Completed" },
                    { date: "3 days ago", name: "Upper Body Hypertrophy", status: "Completed" },
                  ].map((workout, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium dark:text-white">{workout.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{workout.date}</p>
                      </div>
                      <Badge variant={workout.status === "Completed" ? "default" : "secondary"}>{workout.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <div className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">{"Today's Nutrition"}</CardTitle>
                  <CardDescription className="dark:text-gray-300">Track your daily macros and calories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="dark:text-gray-200">Calories</span>
                        <span className="dark:text-gray-200">1,847 / 2,200</span>
                      </div>
                      <Progress value={84} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="dark:text-gray-200">Protein</span>
                        <span className="dark:text-gray-200">142g / 165g</span>
                      </div>
                      <Progress value={86} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="dark:text-gray-200">Carbs</span>
                        <span className="dark:text-gray-200">198g / 220g</span>
                      </div>
                      <Progress value={90} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="dark:text-gray-200">Fat</span>
                        <span className="dark:text-gray-200">67g / 73g</span>
                      </div>
                      <Progress value={92} />
                    </div>
                  </div>
                  <Button className="w-full mt-4 dark:bg-blue-600 dark:hover:bg-blue-700">Log Food</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Progress Tracking</CardTitle>
                <CardDescription className="dark:text-gray-300">Monitor your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2 dark:text-white">Weight Progress</h3>
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Weight chart would go here</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 dark:text-white">Strength Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="dark:text-gray-200">Bench Press</span>
                        <span className="dark:text-gray-200">185 lbs (+10 lbs)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-200">Squat</span>
                        <span className="dark:text-gray-200">225 lbs (+15 lbs)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-200">Deadlift</span>
                        <span className="dark:text-gray-200">275 lbs (+20 lbs)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold dark:text-white">FuelForm</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                SM
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Sarah!</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your clients and grow your business</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="dark:data-[state=active]:bg-gray-700">
              Clients
            </TabsTrigger>
            <TabsTrigger value="programs" className="dark:data-[state=active]:bg-gray-700">
              Programs
            </TabsTrigger>
            <TabsTrigger value="earnings" className="dark:data-[state=active]:bg-gray-700">
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">12</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">+2 this month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">$1,800</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Avg. Rating</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">4.9</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Based on 24 reviews</p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">2.3h</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Average response</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Client Activity</CardTitle>
                <CardDescription className="dark:text-gray-300">Latest updates from your clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "John Doe", action: "Completed Upper Body workout", time: "2 hours ago" },
                    { client: "Jane Smith", action: "Logged nutrition for today", time: "4 hours ago" },
                    { client: "Mike Johnson", action: "Sent a message", time: "6 hours ago" },
                    { client: "Lisa Brown", action: "Completed Lower Body workout", time: "1 day ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {activity.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">{activity.client}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.action}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Client Management</CardTitle>
                <CardDescription className="dark:text-gray-300">Manage your active clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Doe", program: "Weight Loss", progress: "85%", lastActive: "Today" },
                    { name: "Jane Smith", program: "Muscle Building", progress: "92%", lastActive: "Yesterday" },
                    { name: "Mike Johnson", program: "Strength Training", progress: "78%", lastActive: "2 days ago" },
                    { name: "Lisa Brown", program: "General Fitness", progress: "95%", lastActive: "Today" },
                  ].map((client, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="font-medium dark:text-white">{client.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{client.program}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium dark:text-white">{client.progress} complete</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Active {client.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Workout Programs</CardTitle>
                <CardDescription className="dark:text-gray-300">Create and manage workout templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">Create New Program</Button>
                  {[
                    { name: "Beginner Weight Loss", clients: 5, exercises: 12 },
                    { name: "Intermediate Muscle Building", clients: 4, exercises: 18 },
                    { name: "Advanced Strength Training", clients: 3, exercises: 15 },
                  ].map((program, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium dark:text-white">{program.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{program.exercises} exercises</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium dark:text-white">{program.clients} clients</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Earnings Overview</CardTitle>
                <CardDescription className="dark:text-gray-300">Track your income and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-400">This Month</h3>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300">$1,800</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-medium text-blue-800 dark:text-blue-400">Next Payout</h3>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">$1,530</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 dark:text-white">Recent Transactions</h3>
                    <div className="space-y-2">
                      {[
                        { client: "John Doe", amount: "$150", date: "Jan 15" },
                        { client: "Jane Smith", amount: "$200", date: "Jan 15" },
                        { client: "Mike Johnson", amount: "$175", date: "Jan 15" },
                      ].map((transaction, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border dark:border-gray-700 rounded"
                        >
                          <span className="text-sm dark:text-gray-200">{transaction.client}</span>
                          <div className="text-right">
                            <p className="text-sm font-medium dark:text-white">{transaction.amount}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
