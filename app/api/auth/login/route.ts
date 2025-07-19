import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      if (error.message?.includes("Invalid login credentials")) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
