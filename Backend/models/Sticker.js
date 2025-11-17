import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Sticker", stickerSchema);