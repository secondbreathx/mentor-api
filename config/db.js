import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
  try {
    // Set strictQuery option to false (new behavior in Mongoose 7)
    mongoose.set("strictQuery", false);

    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000 // Set timeout for connection
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process with failure
  }
};
