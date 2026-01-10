import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String, // e.g., "Room in Ireland"
  address: String,
  country: String,
  details: String,
  price: Number,
  rating: Number,
  image: {
    url: String, // The web link to the photo
    publicId: String, // The ID used to delete it later
  },
});

export default mongoose.model("Listing", listingSchema);
