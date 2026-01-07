import User from "../models/User.js";
import cookieToken from "../utils/cookieToken.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// 1. Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already registered!" });
    }

    user = await User.create({ name, email, password });

    // cookieToken handles generating the JWT and setting the cookie
    cookieToken(user, res);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server Error", error: err.message });
  }
};

// 2. Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // isValidatedPassword is a custom method we will add to the User Model
    const isPasswordCorrect = await user.isValidatedPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect!" });
    }

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

// 3. Google Login
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a random password for Google users so the field isn't empty
      const tempPassword = Math.random().toString(36).slice(-10);
      user = await User.create({
        name,
        email,
        password: tempPassword,
      });
    }

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

// 4. Upload Profile Picture
export const uploadPicture = async (req, res) => {
  try {
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path, {
      folder: "airbnb/Users", // Matches your "airbnb" collection
    });
    res.status(200).json(result.secure_url);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5. Update User Details
export const updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (picture) user.picture = picture;
    if (password) user.password = password; // The Model will hash this on .save()

    const updatedUser = await user.save();
    cookieToken(updatedUser, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6. Logout
export const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

// 7. Get All Images from a Folder
// controllers/userController.js
// controllers/userController.js
export const getImagesByFolder = async (req, res) => {
  try {
    // Try the path without the "home" dashboard name
    const folderPath = "airbnb/photos";

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folderPath,
      max_results: 50,
    });

    const images = result.resources.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
    }));

    res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res
      .status(500)
      .json({ message: "Could not fetch images", error: error.message });
  }
};
