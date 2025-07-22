import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  full_name?: string
  user_type?: "client" | "trainer"
  phone?: string
  date_of_birth?: string
  created_at?: string
  updated_at?: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return null
    }

    if (!session?.user) {
      return null
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
      // Return basic user info from auth if profile doesn't exist
      return {
        id: session.user.id,
        email: session.user.email || "",
        full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
      }
    }

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Error getting session:", error)
      return null
    }
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    return false
  }
}

// Server-side functions (should only be called from server components)
export function createServerClient() {
  throw new Error("createServerClient should only be called from server components")
}

export function getServerSession() {
  throw new Error("getServerSession should only be called from server components")
}
