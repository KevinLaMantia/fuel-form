import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      return NextResponse.json({ message: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ message: "Login failed - no user data" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
