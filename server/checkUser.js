import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DB_URL).then(async () => {
  const users = await mongoose.connection.db
    .collection("users")
    .find()
    .toArray();

  console.log(`📊 Total users: ${users.length}`);

  if (users.length > 0) {
    console.log("✅ Found user:", users[0].email);
  } else {
    console.log("❌ No users found - we need to create one");
  }

  process.exit();
});
