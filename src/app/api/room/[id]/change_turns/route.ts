import { connectDB } from "@/lib/db"
import Rooms, { PlayerItem, RoomDocument } from "@/models/rooms"
import { NextRequest, NextResponse } from "next/server"
import _ from "lodash"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const { player_id } = await request.json()
    if (room_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        let current_turn_player_id = room?.current_turn_player_id
        let players = room.players
        if (player_id && players[player_id]) {
          players = _.mapValues(players, item => ({ ...item, guess_count: item.guess_count + 1 }))
          current_turn_player_id = player_id
        } else {
          const next_player_id = _.chain(players)
            .map((value, key) => ({ key, ...value }))
            .filter(p => p.player_health > 0)
            .sortBy(["guess_count", "order"])
            .head()
            .value().player_id
            current_turn_player_id = next_player_id
        }

        const data_updated = await Rooms.findOneAndUpdate({ room_id }, { players, current_turn_player_id }, { new: true })

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
