import { connectDB } from "@/lib/db"
import library from "@/models/library"
import mongoose, { PipelineStage } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    await connectDB()
    const { expect }: { expect: string[] } = await request.json()
    const agg: PipelineStage[] = [{ $sample: { size: 1 } }]
    if (expect?.length > 0) {
      agg.unshift({
        $match: {
          _id: { $nin: expect.map((id) => new mongoose.Types.ObjectId(id)) }
        }
      })
    }
    const result = await library.aggregate(agg)
    return new NextResponse(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ message: error }), { status: 500 })
  }
}
