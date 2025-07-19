import { type NextRequest, NextResponse } from "next/server"
import { getTrainers } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialties = searchParams.get("specialties")?.split(",") || []
    const priceRange = searchParams.get("priceRange")

    const filters = {
      specialties: specialties.filter(Boolean),
      priceRange,
    }

    const trainers = await getTrainers(filters)
    return NextResponse.json({ trainers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
