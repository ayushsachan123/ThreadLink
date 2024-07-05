import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";
import cors from "cors";

dotenv.config();

connectDB();
job.start();

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    next()
  })
  
  app.use(
    cors({
      origin: ["https://thread-link.vercel.app", "http://127.0.0.1:3000", "http://localhost:3000"],
      methods: "GET, POST, PATCH, DELETE, PUT",
      credentials: true,
    })
  )

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
