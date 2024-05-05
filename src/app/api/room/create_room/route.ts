import { connectDB } from "@/lib/db"
import Rooms from "@/models/rooms"

import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    await connectDB()
    const { round_total, max_health, winning_score } = await request.json()

    if (round_total && max_health && winning_score) {
      const new_room = {
        room_id: Math.floor(Math.random() * 9000) + 1000,
        round_total,
        max_health,
        winning_score
      }
      const RoomResult = await Rooms.create(new_room)
      return new NextResponse(JSON.stringify(RoomResult), { status: 201 })
    }
    return new NextResponse(JSON.stringify({ message: "Missing parameters" }), { status: 400 })
  } catch (error) {
    console.log("API ERROR:",error);
    
    return new NextResponse(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 })
  }
}
