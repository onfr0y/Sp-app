// back-end/routes/posts.js
import express from 'express';
// Assuming User model might be needed for future enhancements, e.g., populating author details.
// import User from '../models/User.js'; // Uncomment if you plan to use User model here
import Post from '../models/Post.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation if needed in other routes

const router = express.Router();

// --- CREATE A POST ---
router.post('/', async (req, res) => {
  
  // Simplified version assuming req.body is already structured correctly:
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost); // Corrected: savedPost and status 201
  } catch (err) {
    console.error("Create Post Error:", err); // Log the full error on the server

    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Post validation failed.", errors: err.errors });
    }
    // Check for CastError (e.g. wrong data type for a field)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid data type for field: ${err.path}`, value: err.value });
    }

    // Generic server error for other cases
    res.status(500).json({ message: "Failed to create post due to an internal server error." });
  }
});

// --- LIKE/DISLIKE A POST ---
router.put("/:id/like", async (req, res) => {
  // IMPORTANT: req.body.userId is insecure. Use authenticated user ID.
  const currentUserId = req.body.userId; // Replace with req.user.id from auth middleware

  if (!currentUserId) {
      return res.status(400).json({ message: "User ID is missing in the request body." });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ message: "Invalid Post ID or User ID format." });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Ensure post.likes is an array before calling .includes
    if (!Array.isArray(post.likes)) {
        // This case might indicate a data corruption or an older document structure.
        // Initialize likes as an empty array if it's not.
        post.likes = [];
    }

    if (!post.likes.includes(currentUserId)) {
      await post.updateOne({ $push: { likes: currentUserId } });
      res.status(200).json({ message: "The post has been liked." });
    } else {
      await post.updateOne({ $pull: { likes: currentUserId } });
      res.status(200).json({ message: "The post has been disliked." });
    }
  } catch (err) {
    console.error("Like/Dislike Post Error:", err);
    res.status(500).json({ message: "Failed to update post like status." });
  }
});

// --- GET A POST ---
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format." });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Get Post Error:", err);
    res.status(500).json({ message: "Failed to retrieve post." });
  }
});




export default router;
