import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { v2 as cloudinary } from "cloudinary";

// Internal Imports
import connectWithDB from "../config/db.js";
import router from "../routes/index.js";

// 1. Database Connection
connectWithDB();

// 2. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.set("trust proxy", 1); // Crucial for Vercel/Heroku/Render

// 3. Middlewares
app.use(express.json()); // Allows server to read JSON in request bodies

app.use(cookieParser()); // Allows server to read cookies

// Security & Sessions
app.use(
  cookieSession({
    name: "session",
    maxAge: (process.env.COOKIE_TIME || 1) * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET || "default_secret"],
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  })
);

// 4. CORS Setup (Crucial for Client-Server communication)
// 4. CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://airbnb-clone-client-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 5. Routes
// Register the health check FIRST to verify the root works
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is responsive and professionally styled!",
    timestamp: new Date().toISOString(),
  });
});

// Register your API routes
app.use("/api/v1", router);

// 6. Server Listener
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  });
}

// ALWAYS keep the export as the very last line
export default app;
