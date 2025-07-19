import { supabase } from "./supabase"

// User operations
export async function createUserProfile(userData: any) {
  const { data, error } = await supabase.from("users").insert(userData).select().single()

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      trainer_profiles(*),
      client_profiles(*)
    `)
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}

// Trainer operations
export async function getTrainers(filters?: any) {
  let query = supabase
    .from("users")
    .select(`
      *,
      trainer_profiles(*)
    `)
    .eq("user_type", "trainer")

  if (filters?.specialties?.length > 0) {
    query = query.overlaps("trainer_profiles.specialties", filters.specialties)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// Workout operations
export async function getWorkoutSessions(clientId: string) {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`
      *,
      workout_exercises(
        *,
        exercises(*)
      )
    `)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Nutrition operations
export async function logFood(clientId: string, foodData: any) {
  const { data, error } = await supabase
    .from("nutrition_logs")
    .insert({
      client_id: clientId,
      ...foodData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Messages operations
export async function getMessages(userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id(first_name, last_name),
      recipient:recipient_id(first_name, last_name)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
