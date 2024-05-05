import { connectDB } from "@/lib/db"
import Rooms, { RoomDocument } from "@/models/rooms"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const { player_id, player_name } = await request.json()
    if (player_id && player_name && room_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        const players = room.players
        if (!players[player_id]) {
          players[player_id] = {
            player_id: player_id as string,
            player_name: player_name as string,
            player_health: room.max_health,
            player_score: 0,
            guess_count: 0,
            chosen_letter: "",
            order: Object.keys(players).length + 1
          }
          const data_updated = await Rooms.findOneAndUpdate({ room_id }, { players }, { new: true })

          return new NextResponse(JSON.stringify(data_updated), { status: 200 })
        }
        return new NextResponse(JSON.stringify(room), { status: 200 })
      }
      return new NextResponse(JSON.stringify({ message: "Not found" }), { status: 404 })
    }
    return new NextResponse(JSON.stringify({ message: "Missing parameters" }), { status: 400 })
  } catch (error) {
    console.log(error)
    return new NextResponse(JSON.stringify({ message: JSON.stringify(error) }), { status: 500 })
  }
}
