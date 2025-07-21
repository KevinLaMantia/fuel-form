import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, userType } = body

    if (!email || !password || !firstName || !lastName || !userType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        },
      },
    })
    console.log("Auth data:", authData);
    if (authError) {
      console.error("Auth signup error:", authError)
      if (authError.message?.includes("User already registered")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create user profile in our users table
    try {
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        })
        .select()
        .single()

      if (dbError) {
        console.error("Database error:", dbError)
        // Don't fail the signup if profile creation fails
        console.warn("User created in auth but profile creation failed")
      }

      return NextResponse.json({
        success: true,
        user: authData.user,
        session: authData.session,
        profile: userData,
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json({
        success: true,
        user: authData.user,
        session: authData.session,
        warning: "Profile creation partially failed",
      })
    }
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 })
  }
}
