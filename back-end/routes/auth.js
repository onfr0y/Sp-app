// back-end/routes/users.js (This file handles /register and /login)
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose'; // Not strictly needed in this file if not using its methods directly
import jwt from 'jsonwebtoken';    // <<<--- IMPORT jsonwebtoken
import dotenv from 'dotenv';      // <<<--- IMPORT dotenv

dotenv.config(); // Load environment variables (e.g., JWT_SECRET)

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    // Validate input
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }
    // Add more validation if needed (e.g., password length, email format)

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "Email already in use." }); // 409 Conflict
    }
    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(409).json({ message: "Username already taken." });
    }

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username: username,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password: hashedPassword,
    });

    //save user and respond
    const savedUser = await newUser.save();
    // Exclude password from the response
    const { password: savedPassword, ...userData } = savedUser._doc;
    res.status(201).json(userData); // 201 for successful resource creation

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    // Catch Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    res.status(500).json({ message: "Failed to register user.", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("BE LOGIN: Attempt with email:", req.body.email);
    const rawEmail = req.body.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
        return res.status(400).json({ message: "Email is required and must be a string." });
    }
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required." });
    }

    const processedEmail = rawEmail.trim().toLowerCase(); // Use consistent casing

    const user = await User.findOne({ email: processedEmail });
    if (!user) {
      console.log(`BE LOGIN: User NOT FOUND with email: '${processedEmail}'`);
      return res.status(404).json({ message: "Invalid credentials." }); // More generic for security
    }
    console.log(`BE LOGIN: User FOUND: ${user._id}`);

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      console.log(`BE LOGIN: Password INCORRECT for user: '${processedEmail}'`);
      return res.status(401).json({ message: "Invalid credentials." }); // 401 Unauthorized, more generic
    }
    console.log(`BE LOGIN: Password CORRECT for user: '${processedEmail}'`);

    // --- GENERATE JWT ---
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // Payload
      process.env.JWT_SECRET,                  // Your Secret from .env
      { expiresIn: '1d' }                      // Expiration (e.g., 1 day)
    );
    console.log(`BE LOGIN: Token generated: ${token ? 'OK' : 'FAILED TO GENERATE (check JWT_SECRET)'}`);
    if (!token) {
        // This should ideally not happen if JWT_SECRET is set and jwt.sign is called correctly
        // but it's a safeguard.
        console.error("BE LOGIN: CRITICAL - JWT_SECRET might be missing or jwt.sign failed silently.");
        return res.status(500).json({ message: "Could not process login at this time (token generation failed)." });
    }


    const { password, ...userData } = user._doc; // Exclude password from response

    // --- SEND TOKEN AND USER DATA ---
    res.status(200).json({ token: token, user: userData });
    console.log("BE LOGIN: Sent token and user data successfully.");

  } catch (err) {
    console.error("BE LOGIN ERROR:", err.name, err.message, err.stack);
    res.status(500).json({ message: "An internal server error occurred during login." });
  }
});

export default router;
