import { type NextRequest, NextResponse } from "next/server"
import { getTrainers } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const trainers = await getTrainers()
    return NextResponse.json(trainers)
  } catch (error) {
    console.error("Error fetching trainers:", error)
    return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 })
  }
}
