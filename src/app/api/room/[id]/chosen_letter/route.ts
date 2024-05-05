import { connectDB } from "@/lib/db"
import Rooms, { RoomDocument } from "@/models/rooms"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const { letter , player_id } = await request.json()
    if (room_id && letter && player_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        const players = room.players
        if(players[player_id])
          players[player_id].chosen_letter = letter

        const data_updated = await Rooms.findOneAndUpdate({ room_id }, { players }, { new: true })

        return new NextResponse(JSON.stringify(data_updated), { status: 200 })
      }
      return new NextResponse(JSON.stringify({ message: "Not found" }), { status: 404 })
    }
    return new NextResponse(JSON.stringify({ message: "Missing parameters" }), { status: 400 })
  } catch (error) {
    console.log(error)
    return new NextResponse(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 })
  }
}
