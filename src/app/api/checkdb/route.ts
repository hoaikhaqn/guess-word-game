import { connectDB } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  try {
    await connectDB()
    return new NextResponse(JSON.stringify({message: "Connected with MongoDB"}), { status: 200 })
  } catch (error) {
    return new NextResponse(JSON.stringify({message: "Error connect with MongoDB"}), { status: 500 })
  }
}
