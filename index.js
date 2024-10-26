import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { FRONTEND_API_URL } from "./middleware/ApiRoute.js";
import { connectDB } from "./config/db.js";

// route path
import UserRoute from "./routes/UserRoute.js";

dotenv.config();
const PORT = process.env.PORT || 9000;
const app = express();
const server = http.createServer(app);

// middleware ---------------------------------------
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_API_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"]
  })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use("/image", express.static("images"));

// routes
app.use("/user", UserRoute);

// Connect DB
connectDB();

// Start server
server.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error finding Super Admin:", error);
  }
});
