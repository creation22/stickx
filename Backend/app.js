import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import stickerRoutes from "./routes/stickers.js";
import "dotenv/config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Routes
app.use("/api/stickers", stickerRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Sticker API is running!");
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
