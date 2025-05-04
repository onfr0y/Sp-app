// index.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

// --- Load Environment Variables FIRST ---
dotenv.config(); // Make sure .env variables are loaded

// --- Import Routes ---
// Make sure to add .js extension for local file imports in ES Modules
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/post.js';

// --- Create Express App ---
const app = express();

// --- Middleware --- (Should come before routes)
app.use(cors({
  origin: 'http://localhost:5173', // Or your specific frontend URL
  credentials: true,
}));
app.use(helmet()); // Apply security headers
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('common')); // HTTP request logging
// --- End Middleware ---

// --- Environment Variables and Constants ---
const PORT = process.env.PORT || 9000; // Default to 9000 if not set in .env
const MONGO_URI = process.env.MONGODB_URI; // Read the URI from .env

// --- API Routes --- (Define routes after middleware)
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
// --- End API Routes ---

// --- Basic Root Route (Optional) ---
app.get("/", (req, res) => {
    res.send("Backend API is running! grade 4 kub pls"); // Updated message
});
// --- End Basic Route ---

// --- Database Connection and Server Start ---
// Check if the MongoDB URI is actually loaded
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGODB_URI environment variable is not set or loaded correctly.");
  console.error("Please ensure you have a .env file with MONGODB_URI=your_connection_string");
  process.exit(1); // Exit the application if the DB connection string is missing
}

// Connect to MongoDB and Start Server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    // Start listening for requests only AFTER the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Catch errors during the initial connection
    console.error("MongoDB initial connection error:", err);
    process.exit(1); // Exit the application if it can't connect to the DB on startup
  });
// --- End Database Connection and Server Start ---

// NOTE: The redundant app.listen at the very end has been removed
// as it's now correctly placed inside the mongoose.connect().then() callback.

