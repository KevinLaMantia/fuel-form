import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Signup request body:", body)

    const { email, password, fullName, userType, phone, dateOfBirth, plan, ...additionalData } = body

    if (!email || !password || !fullName || !userType) {
      console.log("Missing required fields:", {
        email: !!email,
        password: !!password,
        fullName: !!fullName,
        userType: !!userType,
      })
      return NextResponse.json({ error: "Email, password, full name, and user type are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    console.log("Creating auth user for:", email)

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          user_type: userType,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
        },
      },
    })

    if (authError) {
      console.error("Auth signup error:", authError)
      if (authError.message?.includes("User already registered")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      console.error("No user returned from auth signup")
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("Auth user created successfully:", authData.user.id)

    // Prepare user profile data
    const userProfileData = {
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      user_type: userType,
      phone: phone || null,
      date_of_birth: dateOfBirth || null,
    }

    // Add user type specific data
    if (userType === "client") {
      Object.assign(userProfileData, {
        fitness_goals: additionalData.fitnessGoals || null,
        experience_level: additionalData.experienceLevel || null,
        medical_conditions: additionalData.medicalConditions || null,
      })
    } else if (userType === "trainer") {
      Object.assign(userProfileData, {
        certifications: additionalData.certifications || null,
        specializations: additionalData.specializations || null,
        experience: additionalData.experience || null,
        bio: additionalData.bio || null,
        hourly_rate: additionalData.hourlyRate ? Number.parseFloat(additionalData.hourlyRate) : null,
        is_verified: false, // New trainers need verification
      })
    }

    console.log("Creating user profile:", userProfileData)

    // Create user profile in our users table
    try {
      const { data: userData, error: dbError } = await supabase.from("users").insert(userProfileData).select().single()

      if (dbError) {
        console.error("Database error:", dbError)
        // Don't fail the signup if profile creation fails, but log it
        console.warn("User created in auth but profile creation failed:", dbError.message)

        return NextResponse.json({
          success: true,
          user: authData.user,
          session: authData.session,
          warning: "Account created but profile setup incomplete. Please contact support.",
        })
      }

      console.log("User profile created successfully:", userData.id)

      return NextResponse.json({
        success: true,
        user: authData.user,
        session: authData.session,
        profile: userData,
        message: "Account created successfully!",
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json({
        success: true,
        user: authData.user,
        session: authData.session,
        warning: "Account created but profile setup incomplete. Please contact support.",
      })
    }
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create account. Please try again.",
      },
      { status: 500 },
    )
  }
}
