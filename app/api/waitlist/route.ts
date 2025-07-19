import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Email service integration (example with ConvertKit)
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

async function addToEmailService(email: string, referralCode?: string) {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
    console.log("Email service not configured")
    return
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        tags: ["waitlist", "fuelform"],
        fields: {
          referral_code: referralCode || "",
          signup_date: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to add to email service")
    }

    console.log("Successfully added to email service:", email)
  } catch (error) {
    console.error("Email service error:", error)
  }
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, referral_code, variant, user_agent, timestamp } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Generate new referral code for this user
    const newReferralCode = generateReferralCode()

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already registered",
          referral_code: existingUser.referral_code,
        },
        { status: 400 },
      )
    }

    // Handle referral tracking
    let referrer_id = null
    if (referral_code) {
      const { data: referrer } = await supabase
        .from("waitlist")
        .select("id, referral_count")
        .eq("referral_code", referral_code)
        .single()

      if (referrer) {
        referrer_id = referrer.id

        // Update referrer's referral count using RPC or direct increment
        const newCount = (referrer.referral_count || 0) + 1
        await supabase
          .from("waitlist")
          .update({
            referral_count: newCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", referrer.id)
      }
    }

    // Insert new waitlist entry
    const { data: newUser, error: insertError } = await supabase
      .from("waitlist")
      .insert({
        email,
        referral_code: newReferralCode,
        referred_by: referrer_id,
        ab_test_variant: variant,
        user_agent,
        signup_timestamp: timestamp,
        referral_count: 0,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Get position in queue
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .lte("created_at", newUser.created_at)

    // Add to email service
    await addToEmailService(email, referral_code)

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist",
      referral_code: newReferralCode,
      position: count || 1,
    })
  } catch (error: any) {
    console.error("Waitlist signup error:", error)
    return NextResponse.json(
      {
        error: "Failed to join waitlist",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get waitlist statistics
    const { data: stats, error } = await supabase.from("waitlist_stats").select("*").single()

    if (error) {
      throw error
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
