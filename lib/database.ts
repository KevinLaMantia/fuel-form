import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  full_name: string
  user_type: "client" | "trainer"
  phone?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface Client extends User {
  fitness_goals?: string
  experience_level?: string
  medical_conditions?: string
}

export interface Trainer extends User {
  certifications: string
  specializations?: string
  experience: string
  bio?: string
  hourly_rate?: number
  is_verified: boolean
}

export async function createUser(userData: Partial<User>) {
  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) throw error
  return data
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function getTrainers() {
  const { data, error } = await supabase.from("users").select("*").eq("user_type", "trainer").eq("is_verified", true)

  if (error) throw error
  return data
}
