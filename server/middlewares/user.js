import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    // 1. Check Session (for cookie-session) OR Cookies OR Header
    let token = req.session?.token || req.cookies?.token;

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Select only needed fields for security
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid session" });
  }
};
