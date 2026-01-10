import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Matches the name of your User model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photos: [String], // Array of Cloudinary URLs
    description: String,
    perks: [String], // Array of strings like ['wifi', 'parking', 'kitchen']
    extraInfo: String,
    maxGuests: Number,
    price: Number,
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
); // Automatically adds 'createdAt' and 'updatedAt' fields

const Place = mongoose.model("Place", placeSchema);

export default Place;
