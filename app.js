import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import roadmapRouter from "./routes/roadmap.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "";
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((e) => console.error("Mongo error:", e.message));
} else {
  console.log("ℹ️ No MONGO_URI set — skipping DB connection.");
}

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/roadmap", roadmapRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
