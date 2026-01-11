import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { v2 as cloudinary } from "cloudinary";

// Internal Imports
import connectWithDB from "./config/db.js";
import router from "./routes/index.js";

// 1. Database Connection
connectWithDB();

// 2. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// 3. Middlewares
app.use(express.json()); // Allows server to read JSON in request bodies
app.use(cookieParser()); // Allows server to read cookies

// Security & Sessions
app.use(
  cookieSession({
    name: "session",
    maxAge: (process.env.COOKIE_TIME || 1) * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET || "default_secret"],
    secure: process.env.NODE_ENV === "production", // Only true in production (HTTPS)
    sameSite: "lax",
    httpOnly: true, // Prevents XSS attacks
  })
);

// 4. CORS Setup (Crucial for Client-Server communication)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allows cookies to be sent back and forth
  })
);

// 5. Routes
app.use("/api/v1", router);

// 6. Server Listener (MODIFIED FOR VERCEL)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  });
}

// Crucial: Vercel needs the app exported to handle the routing
export default app;
