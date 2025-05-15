// back-end/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

// ---- ENSURE THIS IMPORT LINE IS PRESENT AND CORRECT ----
import localUpload from '../middleware/localUpload.js'; // For handling file uploads
// ---- END OF IMPORT ----

import sharp from 'sharp';                             // For image processing (dimensions)
import path from 'path';                               // For working with file paths
import fs from 'fs';                                   // For file system operations

const router = express.Router();

// --- GET ALL POSTS (for the feed/Photobuble) ---
router.get("/", async (req, res) => {
  console.log("BACKEND: GET /api/posts - Fetching all posts for feed. Request received.");
  try {
    const allPostsFromDB = await Post.find({})
                                     .sort({ createdAt: -1 })
                                     .lean();
    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const adaptedPosts = allPostsFromDB.map(post => {
      let displayImageFullUrl = null;
      let displayHeight = 200;
      if (post.img && post.img.length > 0) {
        const firstImage = post.img[0];
        if (firstImage && firstImage.url && typeof firstImage.height === 'number') {
          displayImageFullUrl = serverBaseUrl + firstImage.url;
          displayHeight = firstImage.height;
        } else if (firstImage && firstImage.url) {
          displayImageFullUrl = serverBaseUrl + firstImage.url;
        }
      }
      return {
        id: post._id,
        image: displayImageFullUrl,
        height: displayHeight,
        desc: post.desc,
        userId: post.userId
      };
    }).filter(post => post.image !== null);
    console.log(`BACKEND: GET /api/posts - Sending ${adaptedPosts.length} posts to frontend.`);
    res.status(200).json(adaptedPosts);
  } catch (err) {
    console.error("BACKEND ERROR in GET /api/posts (all posts):", err);
    res.status(500).json({ message: "Failed to retrieve posts for the feed." });
  }
});

// --- CREATE A POST ---
// Uses 'localUpload.array('postImages', 5)' middleware
router.post('/', localUpload.array('postImages', 5), async (req, res) => {
  console.log("BACKEND: POST /api/posts - Create Post with local file storage attempt");
  console.log("Body:", req.body);
  console.log("Files:", req.files);

  const { userId, desc } = req.body;

  if (!userId) {
    if (req.files) {
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlink(file.path, err => { if(err) console.error("Error deleting orphaned file on userId validation fail:", file.path, err)});
            }
        });
    }
    return res.status(400).json({ message: "User ID is required." });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required for the post." });
  }

  try {
    const processedImages = [];
    for (const file of req.files) {
      const imagePathOnServer = file.path;
      const metadata = await sharp(imagePathOnServer).metadata();
      const relativePathFromPublic = path.relative(path.join(path.dirname(file.destination), '..'), imagePathOnServer);
      const fileUrl = '/' + relativePathFromPublic.replace(/\\/g, '/');
      processedImages.push({
        url: fileUrl,
        height: metadata.height,
        width: metadata.width,
        localPath: imagePathOnServer,
      });
    }
    const newPost = new Post({ userId, desc, img: processedImages });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error (Backend Processing):", err);
    if (req.files) {
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlink(file.path, unlinkErr => {
                    if(unlinkErr) console.error("Error deleting file after failed post creation logic:", file.path, unlinkErr);
                });
            }
        });
    }
    let errorMessage = "Failed to create post due to an internal server error.";
    if (err.message && err.message.includes("File upload only supports")) {
        errorMessage = err.message;
        return res.status(400).json({ message: errorMessage });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Post validation failed.", errors: err.errors });
    }
    res.status(500).json({ message: errorMessage, details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// --- LIKE/DISLIKE A POST ---
router.put("/:id/like", async (req, res) => {
  const currentUserId = req.body.userId; // INSECURE: Should come from auth (req.user.id)
  if (!currentUserId) return res.status(400).json({ message: "User ID is missing in the request body." });
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ message: "Invalid Post ID or User ID format." });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (!Array.isArray(post.likes)) post.likes = []; // Defensive check
    const userIdIndex = post.likes.indexOf(currentUserId);
    if (userIdIndex === -1) { // User hasn't liked it yet
      post.likes.push(currentUserId);
      await post.save();
      res.status(200).json({ message: "The post has been liked." });
    } else { // User has already liked it, so dislike
      post.likes.splice(userIdIndex, 1);
      await post.save();
      res.status(200).json({ message: "The post has been unliked." });
    }
  } catch (err) {
    console.error("Like/Dislike Post Error:", err);
    res.status(500).json({ message: "Failed to update post like status." });
  }
});

// --- GET A SPECIFIC POST ---
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format." });
  }
  try {
    const postFromDB = await Post.findById(req.params.id).lean(); // Use .lean() if you are not modifying the document before sending
    if (!postFromDB) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Adapt the post for the client if necessary (e.g., convert relative image URLs to absolute)
    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const adaptedPost = { ...postFromDB }; // Create a shallow copy to modify

    if (adaptedPost.img && Array.isArray(adaptedPost.img)) {
        adaptedPost.img = adaptedPost.img.map(imgObj => ({
            ...imgObj, // Spread existing image object properties
            url: imgObj.url ? serverBaseUrl + imgObj.url : null // Convert relative to absolute URL
        }));
    }

    res.status(200).json(adaptedPost);
  } catch (err) {
    console.error("Get Post Error (/:id):", err); // More specific log
    res.status(500).json({ message: "Failed to retrieve post." });
  }
}); // <--- THIS CLOSING BRACE AND PARENTHESIS WAS MISSING/IMPLIED THE CUTOFF

export default router; // This should be the last line
