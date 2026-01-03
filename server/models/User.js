import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/djcgonxur/image/upload/v1767437305/airbnb/photos/no-profile_x8nlm7.webp",
    },
  },
  { timestamps: true }
); // Useful for knowing when a user joined

// 1. Encrypting password only if it's new or modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// 2. Create and return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "3d", // Fallback to 3 days
  });
};

// 3. Validate the password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
