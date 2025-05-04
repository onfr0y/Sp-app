// back-end/routes/auth.js
import express from 'express';
// --- FIX: Import User model with .js extension ---
import User from '../models/User.js';
// --- FIX: Import bcrypt ---
import bcrypt from 'bcrypt';

const router = express.Router();

// --- REGISTER Endpoint with Database Interaction ---
router.post("/register", async (req, res) => { 
  // Use async because we await operations
  try {
    // 1. Get data from request body
    const { username, email, password } = req.body;

    // 2. Basic input validation
    if (!username || !email || !password) {
      // Send 400 Bad Request if data is missing
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    // 3. Check if user already exists (optional but recommended)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // Send 409 Conflict if email or username is taken
      return res.status(409).json({ message: "Email or username already exists." });
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt (10 rounds is standard)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the received password

    // 5. Create a new user instance with hashed password
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword, // Store the hashed password
      // Other fields from your User model will use their defaults
    });

    // 6. Save the new user to the database
    const savedUser = await newUser.save();

    // 7. Respond with success (201 Created) - excluding password
    // Destructure to remove password before sending response
    const { password: userPassword, ...otherDetails } = savedUser._doc;
    res.status(201).json(otherDetails); // Send back the saved user details (without password)

  } catch (err) {
    // 8. Handle errors during the process
    console.error("Registration Error:", err); // Log the detailed error on the server

    // Check for specific errors if needed (e.g., validation errors)
    // Mongoose validation errors have a 'name' property
    if (err.name === 'ValidationError') {
       return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }

    // Send 500 Internal Server Error for other unexpected errors
    res.status(500).json({ message: "Internal server error during registration." });
  }
});


// --- MINIMAL LOGIN ENDPOINT (You'll need to implement this fully later) ---
router.post("/login", async (req, res) => {
   // Add login logic here (find user, compare password with bcrypt.compare)
   res.status(501).json({ message: "Login not implemented yet."}); // 501 Not Implemented
});


// Simple test route for the base path
router.get('/', (req, res) => {
  console.log('Received GET request on /api/auth/');
  res.status(200).send('Auth route base path (/api/auth) is working!');
});

export default router;
