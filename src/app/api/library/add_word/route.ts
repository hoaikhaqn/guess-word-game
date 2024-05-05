import { connectDB } from "@/lib/db"
import library from "@/models/library"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    await connectDB()
    const payload: { word: string; hint: string } = await request.json()
    const word = await library.findOne({ word: payload.word })
    if (!word) {
      const letters: string[] = payload.word.toUpperCase().split("")
      // Add owner to the room
      const newWord = {
        word: payload.word,
        hint: payload.hint,
        letters
      }
      const Result = await library.create(newWord)
      return new NextResponse(JSON.stringify(Result), { status: 200 })
    }
    return new NextResponse(JSON.stringify(word), { status: 200 })
  } catch (error) {
    console.log(error)

    return new NextResponse(JSON.stringify({ message: error }), { status: 500 })
  }
}
