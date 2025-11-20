import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional but useful for later search/filter
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sticker", stickerSchema);
