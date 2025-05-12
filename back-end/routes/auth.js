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
// --- LOGIN Endpoint (Refactored) ---
router.post("/login", async (req, res) => {
  try {
   // 1. Get data from request body
   const { email, password } = req.body;

   // 2. Basic input validation
   if (!email || !password) {
     // Send 400 Bad Request if data is missing
     return res.status(400).json({ message: "Email and password are required." });
   }

   // 3. Find user by email
   const user = await User.findOne({ email: email });

   // 4. Check if user exists AND if password is valid (using same error message for security)
   //    We check user first to avoid error if user is null, then check password.
   if (!user) {
       // User not found - Send 401 Unauthorized
       // Log potentially useful info server-side if needed for debugging failed attempts
       // console.log(`Login attempt failed: User not found for email ${email}`);
       return res.status(401).json({ message: "Invalid email or password." });
   }

   // 5. Compare submitted password with the hashed password in the database
   const validPassword = await bcrypt.compare(password, user.password);
   if (!validPassword) {
       // Password doesn't match - Send 401 Unauthorized (same message as user not found)
       // console.log(`Login attempt failed: Invalid password for email ${email}`);
       return res.status(401).json({ message: "Invalid email or password." });
   }

   // 6. Login successful - Respond with 200 OK (excluding password)
   //    In a real app, you'd typically generate and return a JWT (JSON Web Token) here
   const { password: userPassword, ...otherDetails } = user._doc;
   res.status(200).json(otherDetails); // Send back user details (without password)

  } catch (err) {
    // 7. Handle unexpected errors during the process
    console.error("Login Error:", err); // Log the detailed error on the server
    res.status(500).json({ message: "Internal server error during login." });
  }
});


// Simple test route for the base path
router.get('/', (req, res) => {
  console.log('Received GET request on /api/auth/');
  res.status(200).send('Auth route base path (/api/auth) is working!');
});

export default router;
