import express from 'express';
import mongoose from 'mongoose'; // For ObjectId validation
import Post from '../models/Post.js';
import User from '../models/User.js'; // Needed if you want to populate user details or check user existence
import upload from '../middleware/imageUploadMiddleware.js';
import protect from '../middleware/authMiddleware.js'; // Your authentication middleware
// Cloudinary is configured globally in index.js, so direct import here isn't strictly needed for config
// but might be if you were calling other Cloudinary SDK methods directly.

const router = express.Router();

// --- CREATE A POST (Authenticated & Uploads images to Cloudinary) ---
router.post('/', protect, upload.array('postImages', 5), async (req, res) => {
  console.log("POSTS.JS: POST /api/posts - Attempting to create post by authenticated user.");

  // userId comes from the 'protect' middleware (req.user which is the authenticated user document)
  const userIdFromToken = req.user._id;
  const { desc, title /* if you send title from frontend */ } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required for the post." });
  }

  // Optional: Validate description or title
  if (!desc && !title) { // Example: if neither is provided
    // Depending on requirements, you might not need this strict check
    // return res.status(400).json({ message: "Post description or title is required." });
  }

  try {
    const processedImagesDetails = req.files.map(file => ({
      url: file.path,        // Cloudinary URL
      public_id: file.filename, // Cloudinary public_id
      // height and width might not always be populated by multer-storage-cloudinary directly
      // depending on the version and Cloudinary's immediate response.
      // If you need them reliably, you might need to query Cloudinary after upload
      // or ensure your Cloudinary SDK version populates them.
      height: file.height || null, // Default to null if not present
      width: file.width || null,   // Default to null if not present
    }));

    console.log("POSTS.JS: Images processed. Details from Cloudinary:", processedImagesDetails);

    const newPost = new Post({
      userId: userIdFromToken,
      desc: desc || title || '', // Use desc, or title as fallback, or empty if both are null
      img: processedImagesDetails,
    });

    const savedPost = await newPost.save();
    console.log("POSTS.JS: Post saved to MongoDB. Post ID:", savedPost._id, "by User ID:", userIdFromToken);

    // Optionally, populate user details for the response
    // const postWithAuthor = await Post.findById(savedPost._id).populate('userId', 'username profilePicture');
    // res.status(201).json(postWithAuthor || savedPost);

    res.status(201).json(savedPost);

  } catch (err) {
    console.error("POSTS.JS ERROR (Create Post):", err.name, err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Post data validation failed.", errors: err.errors });
    }
    // Handle potential Cloudinary errors if they propagate here
    if (err.message && (err.message.includes("Cloudinary") || (err.http_code && err.http_code >=400))) {
        return res.status(500).json({ message: `Image upload or Cloudinary processing failed: ${err.message}` });
    }
    res.status(500).json({ message: "Failed to create post due to an internal server error.", details: err.message });
  }
});

// --- GET ALL POSTS (for the feed/Photobuble - Publicly Accessible) ---
// No 'protect' middleware here if posts are public.
// If the feed should be personalized or only for logged-in users, add 'protect'.
router.get("/", async (req, res) => {
  console.log("POSTS.JS: GET /api/posts - Fetching all posts for feed.");
  try {
    // Consider adding pagination here for performance (e.g., using req.query.page and req.query.limit)
    const allPostsFromDB = await Post.find({})
                                     .sort({ createdAt: -1 }) // Sort by newest first
                                     // Optionally populate user details directly
                                     // .populate('userId', 'username profilePicture email') // Select fields you need
                                     .lean(); // .lean() for faster read-only queries

    // If you don't populate above, you might need to fetch user details separately if needed for each post,
    // or adapt the frontend to make a separate request for user details.
    // For simplicity, the current frontend structure seems to handle user display later or expects userId.

    const adaptedPosts = allPostsFromDB.map(post => {
      let displayImageUrl = null;
      let displayHeight = 200; // Default fallback
      let displayWidth = 200;  // Default fallback

      if (post.img && post.img.length > 0) {
        const firstImage = post.img[0];
        if (firstImage && firstImage.url) {
          displayImageUrl = firstImage.url;
          displayHeight = firstImage.height || 200; // Use stored height or fallback
          displayWidth = firstImage.width || 200;   // Use stored width or fallback
        }
      }
      return {
        id: post._id,
        image: displayImageUrl,
        height: displayHeight,
        width: displayWidth,
        desc: post.desc,
        userId: post.userId, // Send userId so frontend can fetch user details or display as is
        likes: post.likes, // Send likes array
        createdAt: post.createdAt // Useful for display
        // If you populated 'userId' above, you could do:
        // author: post.userId // This would be the populated user object
      };
    }).filter(post => post.image !== null);

    console.log(`POSTS.JS: GET /api/posts - Sending ${adaptedPosts.length} posts to frontend.`);
    res.status(200).json(adaptedPosts);
  } catch (err) {
    console.error("POSTS.JS ERROR (Get All Posts):", err);
    res.status(500).json({ message: "Failed to retrieve posts for the feed." });
  }
});

// --- GET A SPECIFIC POST (Publicly Accessible) ---
// No 'protect' needed if individual posts are public.
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }
  try {
    // Optionally populate user details
    const postFromDB = await Post.findById(req.params.id)
                                //.populate('userId', 'username profilePicture')
                                .lean();
    if (!postFromDB) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(postFromDB);
  } catch (err) {
    console.error("POSTS.JS ERROR (Get Specific Post):", err);
    res.status(500).json({ message: "Failed to retrieve post." });
  }
});


// --- LIKE/DISLIKE A POST (Authenticated) ---
router.put("/:id/like", protect, async (req, res) => {
  console.log(`POSTS.JS: PUT /api/posts/${req.params.id}/like - User ${req.user._id} attempting to like/unlike.`);
  const postId = req.params.id;
  const currentUserId = req.user._id; // User ID from authenticated token

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid Post ID format." });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Mongoose arrays might not have indexOf directly if not plain JS arrays.
    // Convert to string for comparison if likes are stored as ObjectIds.
    // For simplicity, assuming likes store string IDs. If ObjectIds, convert currentUserId.toString().
    const currentUserIdStr = currentUserId.toString();
    const userIndexInLikes = post.likes.findIndex(likedUserId => likedUserId.toString() === currentUserIdStr);


    if (userIndexInLikes === -1) { // User has not liked the post yet -> Like
      post.likes.push(currentUserIdStr); // Add user's ID to likes array
      await post.save();
      res.status(200).json({ message: "Post liked successfully.", likes: post.likes, likesCount: post.likes.length });
    } else { // User has already liked the post -> Unlike
      post.likes.splice(userIndexInLikes, 1); // Remove user's ID from likes array
      await post.save();
      res.status(200).json({ message: "Post unliked successfully.", likes: post.likes, likesCount: post.likes.length });
    }
  } catch (err) {
    console.error("POSTS.JS ERROR (Like/Unlike Post):", err);
    res.status(500).json({ message: "Failed to update post like status." });
  }
});


// --- DELETE A POST (Authenticated & Author only or Admin) ---
router.delete("/:id", protect, async (req, res) => {
    const postId = req.params.id;
    const currentUserId = req.user._id;
    const isAdmin = req.user.isAdmin; // Assuming isAdmin is part of JWT payload and User model

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID format." });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Authorization: Check if the current user is the author of the post OR an admin
        if (post.userId.toString() !== currentUserId.toString() && !isAdmin) {
            return res.status(403).json({ message: "Authorization failed. You can only delete your own posts." });
        }

        // Optional: Delete images from Cloudinary before deleting the post from DB
        if (post.img && post.img.length > 0) {
            const deletePromises = post.img.map(image => {
                if (image.public_id) {
                    // Ensure cloudinary.v2 is properly configured and accessible here
                    // Might need to import cloudinary directly if not available globally via some other means
                    // For now, assuming cloudinary.v2.uploader is available (it should be if configured in index.js)
                    return cloudinary.v2.uploader.destroy(image.public_id)
                        .then(result => console.log(`Cloudinary: Deleted image ${image.public_id}`, result))
                        .catch(error => console.error(`Cloudinary: Failed to delete image ${image.public_id}`, error));
                }
                return Promise.resolve(); // If no public_id, resolve immediately
            });
            await Promise.all(deletePromises);
            console.log("POSTS.JS: Associated Cloudinary images scheduled for deletion (if any).");
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post has been deleted successfully." });

    } catch (err) {
        console.error("POSTS.JS ERROR (Delete Post):", err);
        res.status(500).json({ message: "Failed to delete post." });
    }
});


// --- UPDATE A POST (Authenticated & Author only or Admin) ---
// Similar logic to delete: check ownership or admin status.
// For simplicity, this is not fully implemented here but would follow a similar pattern.
router.put("/:id", protect, upload.array('postImages', 0), async (req, res) => { // 0 if not allowing image update, or handle image update logic
    const postId = req.params.id;
    const currentUserId = req.user._id;
    const isAdmin = req.user.isAdmin;
    const { desc, title } = req.body; // Get updated fields

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid Post ID format." });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.userId.toString() !== currentUserId.toString() && !isAdmin) {
            return res.status(403).json({ message: "Authorization failed. You can only update your own posts." });
        }

        // Update fields
        if (desc !== undefined) post.desc = desc;
        if (title !== undefined) {
            // If you store title separately on Post model, update it
            // post.title = title;
            // If title is part of desc, this might not be needed directly unless changing how desc is formed
        }
        // Image update logic would be more complex:
        // - Delete old images from Cloudinary if new ones are provided.
        // - Upload new images if req.files exists.
        // - Update post.img array.
        // This example assumes only text fields are updated for simplicity.

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);

    } catch (err) {
        console.error("POSTS.JS ERROR (Update Post):", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Post update validation failed.", errors: err.errors });
        }
        res.status(500).json({ message: "Failed to update post." });
    }
});


export default router;
