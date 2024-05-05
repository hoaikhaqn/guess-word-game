import { RoomStatus } from "@/types/enum"
import mongoose from "mongoose"

const { Schema } = mongoose

export type RoomDocument = {
  _id: string
  room_id: string
  round_total: string
  max_health: number
  winning_score: number
  current_turn_player_id: string
  current_round_number: number
  rounds: Record<string, RoundItem>
  players: Record<string, PlayerItem>
  room_status: RoomStatus
  created_at: string
  updated_at: string
}

export type RoundItem = {
  round_number: number
  guessed_letters: string[]
  word_id: string
  correct_letters: string[]
  hints: string[]
  winner_player_id: string
}

export type PlayerItem = {
  player_id: string
  player_name: string
  player_score: number
  player_health: number
  guess_count: number
  chosen_letter: string
  order: number
}

const schema = new Schema(
  {
    room_id: {
      type: String,
      unique: true,
      required: true
    },
    round_total: {
      type: Number,
      required: true
    },
    max_health: {
      type: Number,
      required: true
    },
    winning_score: {
      type: Number,
      required: true
    },
    current_turn_player_id: {
      type: String,
      default: null
    },
    current_round_number: {
      type: Number,
      default: null
    },
    rounds: {
      type: Schema.Types.Mixed,
      default: {}
    },
    players: {
      type: Schema.Types.Mixed,
      default: {}
    },
    room_status: {
      type: Number,
      required: true,
      default: RoomStatus.WAITING
    }
  },
  {
    collection: "Rooms",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false,
    minimize: false
  }
)

const Rooms = mongoose.models.Rooms || mongoose.model("Rooms", schema)
export default Rooms
