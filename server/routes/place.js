import express from "express";
const router = express.Router();

// Middleware to protect private routes
import { isLoggedIn } from "../middlewares/user.js";

// Controller imports
import {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces,
} from "../controllers/placeController.js";

// --- PUBLIC ROUTES ---
// Fetches all listings for the home page
router.route("/").get(getPlaces);

// --- PROTECTED ROUTES (Requires Login) ---
router.route("/add-places").post(isLoggedIn, addPlace);
router.route("/user-places").get(isLoggedIn, userPlaces);
router.route("/update-place").put(isLoggedIn, updatePlace);

// --- DYNAMIC ROUTES ---
// These are placed last so they don't accidentally catch requests like "/add-places"
router.get("/single", singlePlace);
router.route("/search/:key").get(searchPlaces);

export default router;
