import express from "express";
import multer from "multer";
import { uploadSticker } from "../controllers/stickerController.js";
import Sticker from "../models/Sticker.js";
import cloudinary from "cloudinary";
import fs from "fs";

const router = express.Router();

const PENDING_FILE = "data/pending.json";

/* -----------------------
   MULTER CONFIG
------------------------ */
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
  },
});

/* -----------------------
   USER UPLOAD (NO DB SAVE)
------------------------ */
router.post("/upload", upload.single("file"), uploadSticker);

/* -----------------------
   FEED (REAL MONGODB)
------------------------ */
router.get("/", async (req, res) => {
  try {
    const stickers = await Sticker.find().sort({ createdAt: -1 });
    res.json(stickers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch stickers" });
  }
});

/* ---------------------------------------------------
   SAVE USER EXPORTED STICKER → pending.json (NO DB)
   POST /api/stickers/pending
----------------------------------------------------- */
router.post("/pending", (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl missing" });
    }

    // Load existing json file or create empty list
    let pending = [];
    if (fs.existsSync(PENDING_FILE)) {
      pending = JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
    }

    pending.push({
      imageUrl,
      date: new Date().toISOString(),
    });

    fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save pending sticker" });
  }
});

/* -----------------------
   ADMIN ADD STICKER (SAVE TO DB)
------------------------ */
router.post("/admin/add", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file missing" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "stickers/feed",
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    // Save to MongoDB
    const newSticker = await Sticker.create({
      imageUrl: result.secure_url,
    });

    return res.json({
      success: true,
      sticker: newSticker,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to save admin sticker" });
  }
});

export default router;
