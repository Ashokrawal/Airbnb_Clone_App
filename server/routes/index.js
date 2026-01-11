import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Internal Route Imports (We'll build these next)
import userRouter from "./user.js";
import placeRouter from "./place.js";
import bookingRouter from "./booking.js";

import {
  getUserProfile,
  register,
  login,
  logout,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/user.js"; // You'll need this!

const router = Router();

// Multer Setup: Temporary storage for incoming files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 1. Health Check Route
router.get("/", (req, res) => {
  res.status(200).json({
    greeting: "🚀 Welcome to the Airbnb Clone API",
  });
});

// 2. Upload Photo via Image URL
router.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const result = await cloudinary.uploader.upload(link, {
      folder: "airbnb/photos", // Updated to match your folder name
    });
    res.json(result.secure_url);
  } catch (error) {
    console.error("Link Upload Error:", error);
    res.status(500).json({ message: "Failed to upload image from link" });
  }
});

// 3. Upload Multiple Images from Local Device
router.post("/upload", upload.array("photos", 100), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "airbnb/Places", // Updated to match your folder name
      })
    );

    const results = await Promise.all(uploadPromises);
    const imageLinks = results.map((result) => result.secure_url);

    res.status(200).json(imageLinks);
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ message: "Internal server error during upload" });
  }
});

// 4. Connect Sub-Routers
router.use("/user", userRouter);
router.use("/places", placeRouter);
router.use("/bookings", bookingRouter);

export default router;
