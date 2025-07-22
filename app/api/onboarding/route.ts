import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, profileData } = body

    // Get the current authenticated user using server client
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("Creating profile for user:", user.id, "Type:", userType)

    if (userType === "client") {
      // Create client profile
      const { data, error } = await supabase
        .from("client_profiles")
        .insert({
          user_id: user.id,
          goals: profileData.goals || [],
          fitness_level: profileData.fitnessLevel || null,
          workout_frequency: profileData.workoutFrequency || null,
          dietary_restrictions: profileData.dietaryRestrictions || null,
          injuries: profileData.injuries || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Client profile creation error:", error)
        return NextResponse.json({ error: `Failed to create client profile: ${error.message}` }, { status: 500 })
      }

      console.log("Client profile created:", data)

      // Mark onboarding as completed in users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Failed to mark onboarding as completed:", updateError)
        // Don't fail the request, just log the error
      } else {
        console.log("Onboarding marked as completed for user:", user.id)
      }

      return NextResponse.json({ success: true, profile: data })
    } else if (userType === "trainer") {
      // Create trainer profile
      const { data, error } = await supabase
        .from("trainer_profiles")
        .insert({
          user_id: user.id,
          bio: profileData.bio || null,
          specialties: profileData.specialties || [],
          certifications: profileData.certifications || [],
          experience: profileData.experience || null,
          pricing: profileData.pricing ? Number.parseFloat(profileData.pricing) : null,
          availability: profileData.availability || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Trainer profile creation error:", error)
        return NextResponse.json({ error: `Failed to create trainer profile: ${error.message}` }, { status: 500 })
      }

      console.log("Trainer profile created:", data)

      // Mark onboarding as completed in users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Failed to mark onboarding as completed:", updateError)
        // Don't fail the request, just log the error
      } else {
        console.log("Onboarding marked as completed for user:", user.id)
      }

      return NextResponse.json({ success: true, profile: data })
    } else {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: error.message || "Failed to complete onboarding" }, { status: 500 })
  }
}
