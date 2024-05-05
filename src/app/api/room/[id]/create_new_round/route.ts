import { connectDB } from "@/lib/db"
import Library, { LibraryDocument } from "@/models/library"
import Rooms, { RoomDocument, RoundItem } from "@/models/rooms"
import _ from "lodash"
import mongoose, { PipelineStage } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    if (room_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        const rounds = room.rounds
        const current_round_count = Object.keys(rounds).length
        const next_round = current_round_count + 1
        // Choose random a word in the library
        const agg: PipelineStage[] = [{ $sample: { size: 1 } }]
        if (current_round_count > 0) {
          agg.unshift({
            $match: {
              _id: {
                $nin: Object.keys(rounds).map((num) => new mongoose.Types.ObjectId(rounds[num].word_id))
              }
            }
          })
        }
        const word_item: LibraryDocument | null = (await Library.aggregate(agg))[0]
        if (word_item) {
          const new_round: RoundItem = {
            round_number: next_round,
            guessed_letters: [],
            word_id: word_item._id,
            correct_letters: word_item.word.toUpperCase().split(""),
            hints: [word_item.hint],
            winner_player_id: ""
          }
          rounds[next_round] = new_round
        }
        const current_turn_player_id =
          room.rounds[current_round_count]?.winner_player_id ||
          _.chain(room.players)
            .map((value, key) => ({ key, ...value }))
            .sortBy(["order"])
            .head()
            .value().player_id

        const data_updated = await Rooms.findOneAndUpdate(
          { room_id },
          { rounds, current_round_number: next_round, current_turn_player_id },
          { new: true }
        )

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
