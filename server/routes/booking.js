import express from "express";
const router = express.Router();

// Middleware to ensure user is authenticated
import { isLoggedIn } from "../middlewares/user.js";

// Controller functions
import {
  createBookings,
  getBookings,
} from "../controllers/bookingController.js";

// --- ROUTES ---

// In server/routes/index.js, this is mounted at "/bookings"
// So the full path for these is:
// GET  /api/v1/bookings (Get all bookings for the logged-in user)
// POST /api/v1/bookings (Create a new booking)

router.route("/").get(isLoggedIn, getBookings).post(isLoggedIn, createBookings);

export default router;
