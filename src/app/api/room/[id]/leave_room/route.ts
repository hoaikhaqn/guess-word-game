import { connectDB } from "@/lib/db"
import Rooms, { PlayerItem, RoomDocument } from "@/models/rooms"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const { player_id } = await request.json()
    if (player_id && room_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        let players = room.players

        players = Object.keys(players).reduce((prev: Record<string, PlayerItem>, pId) => {
          if (players[pId].order > players[player_id].order) {
            players[pId].order = players[pId].order - 1
          }
          prev[pId] = players[pId]
          return prev
        }, {})
        delete players[player_id]

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
