// index.js
/* jshint esversion: 11, node: true, module: true */
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'; // Import multer to catch its specific errors in global handler
import fs from 'fs';         // IMPORT FILE SYSTEM MODULE

// --- Load Environment Variables FIRST ---
dotenv.config();

// --- Import Routes ---
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';

// --- Create Express App ---
const app = express();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// --- SERVE STATIC FILES ---
const publicDirectoryPath = path.join(__dirname, 'public');
console.log(`Attempting to serve static files from: ${publicDirectoryPath}`);
if (fs.existsSync(publicDirectoryPath)) {
    app.use(express.static(publicDirectoryPath));
    console.log(`Static files successfully being served from: ${publicDirectoryPath}`);
} else {
    console.warn(`Static files directory does not exist: ${publicDirectoryPath}. Images may not load.`);
}
// --- End Static File Serving ---

// --- API Routes ---
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
// --- End API Routes ---

// --- Basic Root Route ---
app.get("/", (req, res) => {
    res.send("Backend API is running smoothly!");
});
// --- End Basic Route ---

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("--- Global Error Handler Caught ---");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    // console.error("Error Stack:", err.stack || "No stack available"); // Potentially too verbose for all errors
    console.error("Request Path:", req.path);
    console.error("Request Method:", req.method);
    console.error("---------------------------------");

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: `File upload error: ${err.message}.`,
            field: err.field
        });
    } else if (err.message && err.message.toLowerCase().includes("file upload only supports")) {
        return res.status(400).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    } else if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid data format for field ${err.path}. Expected ${err.kind}.` });
    }

    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.expose ? err.message : "An unexpected server error occurred.",
        ...(process.env.NODE_ENV === 'development' && { errorDetails: err.message, stack: err.stack })
    });
});
// --- End Global Error Handler ---

// --- Database Connection and Server Start ---
const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGODB_URI environment variable is not set or loaded correctly from .env file.");
  console.error("Please ensure your .env file is in the project root and contains MONGODB_URI=your_connection_string");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Frontend client expected at origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB initial connection error:", err);
    process.exit(1);
  });
