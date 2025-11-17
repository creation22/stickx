import express from "express";
import multer from "multer";
import { uploadSticker } from "../controllers/stickerController.js";
import Sticker from "../models/Sticker.js";
const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {

    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});
router.post("/upload", upload.single("image"), uploadSticker);
router.get("/", async (req, res) => {
  try {
    const stickers = await Sticker.find().sort({ createdAt: -1 });
    res.json(stickers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch stickers" });
  }
});
export default router;
