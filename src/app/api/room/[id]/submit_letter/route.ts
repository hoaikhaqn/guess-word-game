import { connectDB } from "@/lib/db"
import Rooms, { RoomDocument } from "@/models/rooms"
import _ from "lodash"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const { letter, player_id } = await request.json()
    if (room_id && player_id) {
      const room: RoomDocument | null = await Rooms.findOne({ room_id })
      if (room) {
        const round = room.current_round_number
        const rounds = room.rounds
        const players = room.players

        if (players[player_id]) {
          // If player submit a letter
          if (letter) {
            // UPDATE CURRENT ROUND & PLAYER'S STATE
            rounds[round].guessed_letters.push(letter)
            // Check letter be sumitted. Do it have correct ?
            if (rounds[round].correct_letters.includes(letter)) {
              // Increase score point
              players[player_id].player_score += room.winning_score
              // Check to see if the text has been completed?
              if (rounds[round].correct_letters.every((c) => rounds[round].guessed_letters.includes(c))) {
                rounds[round].winner_player_id = player_id
              }
            } else {
              // Penalty player's health
              players[player_id].player_health--
            }
            // clean up chosen letter
            players[player_id].chosen_letter = ""
          }else{
            // Player cannot submit any letter before it's end time.
            players[player_id].player_health--
          }
          players[player_id].guess_count++
        }

        // SWITCH TURN
        let current_turn_player_id = room?.current_turn_player_id
        if(!rounds[round].winner_player_id){
          const next_player_id = _.chain(players)
          .map((value, key) => ({ key, ...value }))
          .filter(p => p.player_health > 0)
          .sortBy(["guess_count", "order"])
          .head()
          .value().player_id
          current_turn_player_id = next_player_id
        }else{
          players[player_id].guess_count--
        }

        const data_updated = await Rooms.findOneAndUpdate({ room_id }, { rounds, players, current_turn_player_id }, { new: true })

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
