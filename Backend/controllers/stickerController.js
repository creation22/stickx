import Sticker from "../models/Sticker.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadSticker = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "stickers",


    });

    const sticker = await Sticker.create({
      imageUrl: result.secure_url
    });

    // clean local file
    fs.unlink(file.path, (err) => {
      if (err) console.log("Failed to delete temp file:", err);
    });

    return res.json(sticker);

  } catch (err) {
    console.log("Sticker upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};
