import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const userType = searchParams.get("userType") || "client"
  const plan = searchParams.get("plan")

  if (code) {
    const cookieStore = await cookies()

    // Create Supabase client for auth operations
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    )

    // Create admin client for database operations (bypasses RLS)
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignore cookie errors in server components
            }
          },
        },
      },
    )

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/login?error=auth_error`)
      }

      if (data.user) {
        // Look for existing profile
        const { data: profiles } = await supabaseAdmin.from("users").select("*").eq("id", data.user.id)

        const existingProfile = profiles && profiles[0]

        if (!existingProfile) {
          // Create new user profile
          const userMetadata = data.user.user_metadata || {}
          const fullName = userMetadata.full_name || userMetadata.name || ""
          const nameParts = fullName.trim().split(" ")
          const firstName = nameParts[0] || "User"
          const lastName = nameParts.slice(1).join(" ") || ""

          const profileData = {
            id: data.user.id,
            email: data.user.email!,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            user_type: userType as "client" | "trainer",
            avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
            plan: plan || null,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          await supabaseAdmin.from("users").insert(profileData)

          // New user - redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        } else {
          // Existing user - check onboarding status
          if (!existingProfile.onboarding_completed) {
            return NextResponse.redirect(`${origin}/onboarding`)
          } else {
            return NextResponse.redirect(`${origin}${next}`)
          }
        }
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${origin}/login?error=server_error`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
