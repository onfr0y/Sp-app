// back-end/index.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'; // For global error handler to catch MulterError
import fs from 'fs';         // For checking if public directory exists
import cloudinary from "cloudinary"; // Correctly imported

// --- Load Environment Variables FIRST ---
dotenv.config();
console.log("SERVER_INIT: Environment variables loaded.");

// --- Import Routes ---
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';

// --- Create Express App ---
const app = express();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware Configuration ---
console.log("SERVER_SETUP: Configuring middleware...");

// 1. CORS
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: clientOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
console.log(`SERVER_SETUP: CORS configured for origin: ${clientOrigin}`);

// 2. Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 3. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. HTTP Request Logger (Morgan)
app.use(morgan('dev'));
console.log("SERVER_SETUP: Essential middleware (Helmet, Body Parsers, Morgan) configured.");

// 5. Static File Serving
const publicDirectoryPath = path.join(__dirname, 'public');
if (fs.existsSync(publicDirectoryPath)) {
    app.use(express.static(publicDirectoryPath));
    console.log(`SERVER_SETUP: Static files being served from: ${publicDirectoryPath}`);
} else {
    console.warn(`SERVER_WARN: Static files directory not found: ${publicDirectoryPath}.`);
}
console.log("SERVER_SETUP: Middleware configuration complete.");

// --- API Routes ---
console.log("SERVER_SETUP: Configuring API routes...");
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
console.log("SERVER_SETUP: API routes configured.");

// --- Basic Root Route ---
app.get("/", (req, res) => {
    res.status(200).send("Backend API is operational!");
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("--- GLOBAL_ERROR ---");
    console.error(`Timestamp: ${new Date().toISOString()} | Path: ${req.path} | Method: ${req.method}`);
    console.error(`Name: ${err.name} | Message: ${err.message}`);
    if (process.env.NODE_ENV === 'development' && err.stack) {
        console.error("Stack:", err.stack);
    }
    console.error("--------------------");

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `File upload error: ${err.message}.`, field: err.field });
    } else if (err.message && err.message.toLowerCase().includes("file upload only supports")) {
        return res.status(400).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Data validation failed.", errors: err.errors });
    } else if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid data format for field '${err.path}'. Expected: ${err.kind}.` });
    }
    const statusCode = err.status || err.statusCode || 500;
    const errMessage = err.expose || process.env.NODE_ENV === 'development' ? err.message : "An unexpected server error occurred.";
    res.status(statusCode).json({ message: errMessage });
});

// --- Configuration & Server Start ---
console.log("SERVER_INIT: Initializing configurations...");
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("FATAL: MONGODB_URI environment variable is NOT SET. Exiting.");
  process.exit(1);
}

// Configure Cloudinary SDK
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Corrected variable name
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true // Good practice to ensure HTTPS URLs
    });
    console.log("SERVER_INIT: Cloudinary SDK configured successfully.");
    // Optional: Ping Cloudinary to verify connection
    // cloudinary.v2.api.ping((error, result) => {
    //   if (error) console.warn("CLOUDINARY_WARN: Ping failed. Check credentials/network.", error.message);
    //   else console.log("CLOUDINARY_INFO: Ping successful.", result);
    // });
  } catch (e) {
    console.error("SERVER_ERROR: Failed to configure Cloudinary SDK.", e);
  }
} else {
  console.warn("SERVER_WARN: Cloudinary environment variables (CLOUD_NAME, API_KEY, API_SECRET) are MISSING or incomplete. Cloudinary features will fail.");
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("DB_INFO: MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`SERVER_ONLINE: Server running on http://localhost:${PORT}`);
      console.log(`SERVER_INFO: Expecting frontend requests from origin: ${clientOrigin}`);
    });
  })
  .catch((err) => {
    console.error("DB_FATAL: MongoDB connection error. Exiting.", err);
    process.exit(1);
  });
