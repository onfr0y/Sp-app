// back-end/routes/posts.js
import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js'; // Your Mongoose Post model with Cloudinary fields
import memoryUpload from '../middleware/imageUploadMiddleware.js'; // Multer configured for memoryStorage
import cloudinary from 'cloudinary'; // Cloudinary v2 SDK

const router = express.Router();

// --- No Cloudinary SDK configuration block here ---
// It's assumed that index.js has already called dotenv.config() and then cloudinary.v2.config()
// with the necessary environment variables (CLOUDINARY_URL or individual keys).

// --- Cloudinary Upload Helper Function ---
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Critical check: Ensure Cloudinary SDK was configured globally (e.g., by index.js)
    // by checking if essential config values like api_key are present in the SDK's current config.
    if (!cloudinary.v2.config().api_key || !cloudinary.v2.config().cloud_name || !cloudinary.v2.config().api_secret) {
        console.error("[POSTS.JS_UPLOAD_ERROR] Cloudinary SDK does not appear to be configured (api_key, cloud_name, or api_secret missing from its internal config). This should have been set globally in index.js.");
        return reject(new Error("Server configuration error: Image upload service is not properly initialized."));
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "image",        // Let Cloudinary auto-detect or be specific
        folder: "social_app_posts",    // Optional: specify a folder in Cloudinary
        // Example of an eager transformation:
        // eager: [{ width: 1200, height: 1200, crop: "limit", quality: "auto:good" }],
        ...options
      },
      (error, result) => {
        if (error) {
          console.error("POSTS.JS_CLOUDINARY_UPLOAD_STREAM_ERROR:", error);
          return reject(error); // Forward the Cloudinary error
        }
        resolve(result); // result contains secure_url, public_id, width, height, etc.
      }
    );
    // Write the buffer to the stream to start the upload
    uploadStream.end(fileBuffer);
  });
};


// --- CREATE A POST (Uploads images to Cloudinary) ---
router.post('/', memoryUpload.array('postImages', 5), async (req, res) => {
  console.log("POSTS.JS: POST /api/posts - Attempting to create post with Cloudinary upload.");
  const { userId, desc } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required for the post." });
  }

  // Final check before attempting upload within the route
  if (!cloudinary.v2.config().api_key) {
    console.error("POSTS.JS ERROR: POST /api/posts - Cloudinary not configured (checked before upload attempt). Aborting.");
    return res.status(500).json({ message: "Server error: Image upload service not configured." });
  }

  try {
    const imageUploadPromises = req.files.map(async (file) => {
      console.log(`POSTS.JS: Processing file ${file.originalname} (size: ${file.size} bytes) for Cloudinary upload.`);
      const uploadResult = await uploadToCloudinary(file.buffer);
      console.log(`POSTS.JS: File ${file.originalname} uploaded to Cloudinary. Public ID: ${uploadResult.public_id}, URL: ${uploadResult.secure_url}`);
      return {
        url: uploadResult.secure_url,
        height: uploadResult.height,
        width: uploadResult.width,
        public_id: uploadResult.public_id
      };
    });

    const processedImagesDetails = await Promise.all(imageUploadPromises);
    console.log("POSTS.JS: All images processed. Details from Cloudinary:", processedImagesDetails);

    const newPost = new Post({
      userId,
      desc,
      img: processedImagesDetails // This now contains Cloudinary URLs and metadata
    });

    const savedPost = await newPost.save();
    console.log("POSTS.JS: Post saved to MongoDB with Cloudinary image details. Post ID:", savedPost._id);
    res.status(201).json(savedPost);

  } catch (err) {
    console.error("POSTS.JS ERROR: POST /api/posts - Workflow error:", err);
    let errorMessage = "Failed to create post due to an internal server error.";
    if (err.message) { // Give more specific error if available
        if (err.message.includes("Cloudinary") || (err.http_code && err.http_code >=400)) {
            errorMessage = `Image upload to Cloudinary failed: ${err.message}`;
        } else if (err.message.includes("Image upload service unavailable") || err.message.includes("Image upload service not configured")) {
            errorMessage = err.message; // Use specific message from our checks
        }
    }
    if (err.name === 'ValidationError') { // Mongoose validation error
        errorMessage = "Post data validation failed.";
        return res.status(400).json({ message: errorMessage, errors: err.errors });
    }
    res.status(500).json({ message: errorMessage, details: process.env.NODE_ENV === 'development' ? err.toString() : undefined });
  }
});


// --- GET ALL POSTS (for the feed/Photobuble) ---
router.get("/", async (req, res) => {
  console.log("POSTS.JS: GET /api/posts - Fetching all posts for feed (expecting Cloudinary URLs).");
  try {
    const allPostsFromDB = await Post.find({})
                                     .sort({ createdAt: -1 })
                                     .lean();
    const adaptedPosts = allPostsFromDB.map(post => {
      let displayImageUrl = null;
      let displayHeight = 200; // Default fallback
      let displayWidth = 200;  // Default fallback

      if (post.img && post.img.length > 0) {
        const firstImage = post.img[0];
        if (firstImage && firstImage.url && typeof firstImage.height === 'number') {
          displayImageUrl = firstImage.url; // Already full Cloudinary URL
          displayHeight = firstImage.height;
          if (typeof firstImage.width === 'number') {
            displayWidth = firstImage.width;
          }
        }
      }
      return {
        id: post._id,
        image: displayImageUrl,
        height: displayHeight,
        width: displayWidth,
        desc: post.desc,
        userId: post.userId
        // You might want to populate associated user details (username, profilePic) later
      };
    }).filter(post => post.image !== null); // Ensure we only send posts with an image for Photobuble

    console.log(`POSTS.JS: GET /api/posts - Sending ${adaptedPosts.length} posts to frontend.`);
    res.status(200).json(adaptedPosts);
  } catch (err) {
    console.error("POSTS.JS ERROR: GET /api/posts - Fetching all posts:", err);
    res.status(500).json({ message: "Failed to retrieve posts for the feed." });
  }
});


// --- LIKE/DISLIKE A POST ---
router.put("/:id/like", async (req, res) => {
  const currentUserId = req.body.userId; // REMINDER: INSECURE - should come from authenticated req.user.id
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
    if (!Array.isArray(post.likes)) { // Defensive check
        post.likes = [];
    }
    const userIdIndex = post.likes.indexOf(currentUserId);
    if (userIdIndex === -1) { // Like
      post.likes.push(currentUserId);
      await post.save();
      res.status(200).json({ message: "Post liked.", likesCount: post.likes.length });
    } else { // Unlike
      post.likes.splice(userIdIndex, 1);
      await post.save();
      res.status(200).json({ message: "Post unliked.", likesCount: post.likes.length });
    }
  } catch (err) {
    console.error("POSTS.JS ERROR: PUT /api/posts/:id/like - Error updating like status:", err);
    res.status(500).json({ message: "Failed to update post like status." });
  }
});

// --- GET A SPECIFIC POST ---
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID format." });
  }
  try {
    const postFromDB = await Post.findById(req.params.id).lean(); // .lean() for read-only queries
    if (!postFromDB) {
      return res.status(404).json({ message: "Post not found." });
    }
    // The image URLs in postFromDB.img are already full Cloudinary URLs as stored in DB.
    res.status(200).json(postFromDB);
  } catch (err) {
    console.error("POSTS.JS ERROR: GET /api/posts/:id - Error retrieving specific post:", err);
    res.status(500).json({ message: "Failed to retrieve post." });
  }
});

export default router;
