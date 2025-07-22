import { supabase } from "./supabase"

export interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    name?: string
  }
  app_metadata?: {
    provider?: string
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting user:", error)
      return null
    }

    return user as User
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
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
    console.error("Error in getSession:", error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })

  if (error) throw error
  return data
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
    console.error("Error in signOut:", error)
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
