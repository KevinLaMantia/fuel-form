"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown"
import { TrendingUp, Calendar, Award, Clock, Dumbbell, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    workoutsCompleted: 24,
    totalWorkouts: 30,
    streakDays: 7,
    caloriesBurned: 2450,
  })
  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard mounted, checking session...")
    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Dashboard - Auth state changed:", event, session?.user?.email || "no user")

      if (event === "SIGNED_OUT" || !session) {
        console.log("User signed out or no session, redirecting to login")
        setUser(null)
        router.replace("/login")
      } else if (session) {
        console.log("Session found, setting user:", session.user.email)
        setUser(session.user)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const checkSession = async () => {
    try {
      console.log("Dashboard - Checking session...")

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log("Dashboard - Session check result:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        error: sessionError,
      })

      if (sessionError) {
        console.error("Session error:", sessionError)
        setLoading(false)
        router.replace("/login")
        return
      }

      if (!session || !session.user) {
        console.log("No session or user found, redirecting to login")
        setLoading(false)
        router.replace("/login")
        return
      }

      console.log("Session found for user:", session.user.email)
      setUser(session.user)
      setLoading(false)
    } catch (error) {
      console.error("Auth check error:", error)
      setLoading(false)
      router.replace("/login")
    }
  }

  const getUserName = (user: any) => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = (stats.workoutsCompleted / stats.totalWorkouts) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {getUserName(user)}!</h1>
            <p className="text-gray-600">Here's your fitness journey overview</p>
            <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Workout
            </Button>
            <UserAvatarDropdown user={user} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.workoutsCompleted}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalWorkouts} this month</p>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streakDays}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.caloriesBurned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2:00 PM</div>
              <p className="text-xs text-muted-foreground">Today with Sarah</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest workouts and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      type: "workout",
                      title: "Upper Body Strength",
                      time: "2 hours ago",
                      icon: Dumbbell,
                      color: "text-blue-600",
                    },
                    {
                      type: "achievement",
                      title: "7-Day Streak Achieved!",
                      time: "1 day ago",
                      icon: Award,
                      color: "text-yellow-600",
                    },
                    {
                      type: "workout",
                      title: "Cardio Session",
                      time: "2 days ago",
                      icon: Activity,
                      color: "text-green-600",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Profile Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Account information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                        alt={getUserName(user)}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {getUserName(user).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{getUserName(user)}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        User Type: {user.user_metadata?.user_type || "Client"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Member since: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1" onClick={() => router.push("/settings")}>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Workout Plans</CardTitle>
                <CardDescription>Your personalized fitness routines</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Workout plans will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Plan</CardTitle>
                <CardDescription>Your meal plans and dietary guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nutrition information will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Monitor your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Progress charts and metrics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
