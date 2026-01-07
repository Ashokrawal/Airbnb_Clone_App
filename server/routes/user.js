import { Router } from "express";
import multer from "multer";

// Internal Imports
import {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
  getImagesByFolder,
} from "../controllers/userController.js";

const router = Router();

// Multer Setup for profile pictures
const upload = multer({ dest: "/tmp" });

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google/login", googleLogin);
router.get("/logout", logout);
// Add this line to your existing routes
// Change this in your router file
// router file

// This tells Express: match anything after /folder/ and put it in req.params[0]
// routes/user.js

// We use a specific path.
// This bypasses the logic that is causing your server to crash.
router.get("/folder/home/photos", getImagesByFolder);

// Profile Management
// We use .single('picture') because a user can have only one profile pic
router.post("/upload-picture", upload.single("picture"), uploadPicture);
router.put("/update-user", updateUserDetails);

export default router;
