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
} from "../controllers/userController.js";

const router = Router();

// Multer Setup for profile pictures
const upload = multer({ dest: "/tmp" });

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google/login", googleLogin);
router.get("/logout", logout);

// Profile Management
// We use .single('picture') because a user can have only one profile pic
router.post("/upload-picture", upload.single("picture"), uploadPicture);
router.put("/update-user", updateUserDetails);

export default router;
