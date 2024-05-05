import mongoose from "mongoose"

const { Schema } = mongoose

export type LibraryDocument = {
  _id: string
  word: string
  hint: string
  created_at: string
  updated_at: string
}

const librarySchema = new Schema(
  {
    word: {
      type: String,
      unique: true,
      required: true
    },
    hint: {
      type: String,
      required: true,
      default: ""
    }
  },
  {
    collection: "Library",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const Library = mongoose.models.Library || mongoose.model("Library", librarySchema)
export default Library
