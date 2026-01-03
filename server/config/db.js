import mongoose from "mongoose";

const connectWithDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.DB_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ DB Connection Error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectWithDB;
