import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    // 1. Check for token in Cookies OR Authorization Header
    let token = req.cookies.token;

    // If no cookie, check Authorization header (Bearer token)
    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    // 2. If no token at all, stop here
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login first to access this page",
      });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user and attach them to the 'req' object
    // This allows the next function to know exactly WHO is making the request
    req.user = await User.findById(decoded.id);

    next(); // Move to the actual controller (e.g., addPlace)
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
