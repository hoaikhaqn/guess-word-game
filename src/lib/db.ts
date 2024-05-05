import mongoose from "mongoose"
import env from "@config/env"

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true
  }
  try {
    await mongoose.connect(env.database.uri)
    console.log("[Database]: MongoDB connected")
    return true
  } catch (error) {
    console.error(error)
  }
}
