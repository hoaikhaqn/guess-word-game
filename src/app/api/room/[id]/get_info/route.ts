import { connectDB } from "@/lib/db"
import rooms from "@/models/rooms"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB()
    const room_id = params.id
    const room = await rooms.findOne({ room_id })
    if (room) {
      return new NextResponse(JSON.stringify(room), { status: 200 })
    }
    return new NextResponse(JSON.stringify({ message: "Not found" }), { status: 404 })
  } catch (error) {
    return new NextResponse(JSON.stringify({ data: "Error connect with MongoDB" }), { status: 500 })
  }
}
