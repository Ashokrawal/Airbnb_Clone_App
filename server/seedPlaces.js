import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Place from "./models/Place.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const seedPlaces = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Get or create a user
    let user = await User.findOne();

    if (!user) {
      console.log("Creating default user...");
      user = await User.create({
        name: "Admin",
        email: "admin@airbnb.com",
        password: "password123",
      });
    }

    console.log(`✅ Using user: ${user.email}`);

    // Fetch images from Cloudinary
    console.log("📥 Fetching images from Cloudinary...");
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "airbnb/photos",
      max_results: 500,
    });

    console.log(`✅ Found ${result.resources.length} images`);

    const locations = [
      "London, UK",
      "New York, USA",
      "Paris, France",
      "Tokyo, Japan",
      "Mumbai, India",
      "Kathmandu, Nepal",
    ];
    const perksOptions = [
      ["Wifi", "Parking", "TV", "Kitchen"],
      ["Wifi", "Pool", "Gym", "AC"],
      ["Wifi", "Kitchen", "Washer", "Parking"],
    ];

    let created = 0;

    for (const image of result.resources) {
      const fileName = image.public_id.split("/").pop();
      const title = fileName
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      await Place.create({
        owner: user._id,
        title: title,
        address: locations[Math.floor(Math.random() * locations.length)],
        photos: [image.public_id],
        description: `Beautiful ${title} with amazing amenities.`,
        perks: perksOptions[Math.floor(Math.random() * perksOptions.length)],
        maxGuests: Math.floor(Math.random() * 6) + 2,
        price: Math.floor(Math.random() * 3000) + 1000,
      });

      created++;
      console.log(`✅ Created: ${title}`);
    }

    console.log(`\n🎉 Done! Created ${created} places`);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedPlaces();
