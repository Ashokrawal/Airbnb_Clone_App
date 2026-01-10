import mongoose from "mongoose";
import Place from "./models/Place.js"; // Adjust path to your model
import dotenv from "dotenv";
dotenv.config();

const migratePhotos = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  const places = await Place.find({});
  console.log(`Updating ${places.length} places...`);

  for (let place of places) {
    // This adds the prefix to every photo if it doesn't already have it
    const updatedPhotos = place.photos.map((photo) => {
      if (!photo.startsWith("airbnb/photos/")) {
        // Remove .jpg if it exists and add the folder prefix
        const cleanName = photo.split(".")[0];
        return `airbnb/photos/${cleanName}`;
      }

      return photo;
    });

    place.photos = updatedPhotos;
    await place.save();
  }

  console.log("✅ Migration complete!");
  process.exit();
};

migratePhotos();
