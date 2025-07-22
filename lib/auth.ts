import { supabase } from "./supabase"

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

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Server-side functions (only use these in server components)
export async function getCurrentUserServer() {
  // This function should only be used in server components
  // For client components, use getCurrentUser() instead
  throw new Error("Use getCurrentUser() in client components")
}

export async function getSessionServer() {
  // This function should only be used in server components
  // For client components, use getSession() instead
  throw new Error("Use getSession() in client components")
}
