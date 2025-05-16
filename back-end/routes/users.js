// back-end/routes/users.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose'; // Import mongoose to check ObjectId validity
import protect from '../middleware/authMiddleware.js'; // Assuming you might want to protect search or use req.user

const router = express.Router();

// --- SEARCH USERS ---
// GET /api/users/search?q=searchText
router.get("/search", protect, async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === "") {
    return res.status(400).json({ message: "Search query (q) is required and must be a non-empty string." });
  }

  try {
    // Case-insensitive search for username.
    // Using a regular expression for partial matching.
    // 'i' flag for case-insensitivity.
    // We use '^' to match from the beginning of the string for better relevance,
    // but you can remove it for broader partial matching anywhere in the username.
    const users = await User.find({
      username: { $regex: `^${searchQuery.trim()}`, $options: "i" }
    })
    .select('-password -updatedAt -email') // Exclude sensitive/unnecessary fields
    .limit(15); // Limit the number of results

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found matching your search." });
    }

    res.status(200).json(users);

  } catch (err) {
    console.error("Search Users Error:", err);
    res.status(500).json({ message: "Failed to search for users." });
  }
});


// --- GET A USER ---
router.get("/:id", async (req, res) => {
  // Validate ID format first
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const user = await User.findById(req.params.id);
    // Check if user was found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Exclude sensitive/unnecessary fields
    // Ensure user._doc exists before destructuring
    const { password, updatedAt, ...other } = user._doc || {};
    res.status(200).json(other);
  } catch (err) {
    // Log the actual error for debugging
    console.error("Get User Error:", err);
    // Send generic error response to client
    res.status(500).json({ message: "Failed to retrieve user." });
  }
});

// --- FOLLOW A USER ---
// Now uses req.user from 'protect' middleware
router.put("/:id/follow", protect, async (req, res) => {
  const userIdToFollow = req.params.id;
  const currentUserId = req.user._id; // User ID from authenticated token

  if (!mongoose.Types.ObjectId.isValid(userIdToFollow)) {
     return res.status(400).json({ message: "Invalid user ID format for user to follow." });
  }

  if (currentUserId.toString() === userIdToFollow) {
    return res.status(403).json({ message: "You can't follow yourself." });
  }

  try {
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId); // req.user is already the currentUser document

    if (!userToFollow) {
      return res.status(404).json({ message: `User with ID ${userIdToFollow} not found.` });
    }
     if (!currentUser) { // Should not happen if protect middleware works
      return res.status(404).json({ message: "Current user not found." });
    }


    if (!userToFollow.followers.includes(currentUserId)) {
      await userToFollow.updateOne({ $push: { followers: currentUserId } });
      await currentUser.updateOne({ $push: { followings: userIdToFollow } });
      res.status(200).json({ message: "User has been followed." });
    } else {
      res.status(403).json({ message: "You already follow this user." });
    }
  } catch (err) {
    console.error("Follow User Error:", err);
    res.status(500).json({ message: "Failed to follow user." });
  }
});

// --- UNFOLLOW A USER ---
// Now uses req.user from 'protect' middleware
router.put("/:id/unfollow", protect, async (req, res) => {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user._id; // User ID from authenticated token

    if (!mongoose.Types.ObjectId.isValid(userIdToUnfollow)) {
        return res.status(400).json({ message: "Invalid user ID format for user to unfollow." });
    }

    if (currentUserId.toString() === userIdToUnfollow) {
      return res.status(403).json({ message: "You can't unfollow yourself." });
    }

    try {
       const userToUnfollow = await User.findById(userIdToUnfollow);
       const currentUser = await User.findById(currentUserId); // req.user

       if (!userToUnfollow) {
           return res.status(404).json({ message: `User with ID ${userIdToUnfollow} not found.` });
       }
       if (!currentUser) {
           return res.status(404).json({ message: "Current user not found." });
       }

       if (userToUnfollow.followers.includes(currentUserId)) {
           await userToUnfollow.updateOne({ $pull: { followers: currentUserId } });
           await currentUser.updateOne({ $pull: { followings: userIdToUnfollow } });
           res.status(200).json({ message: "User has been unfollowed." });
       } else {
           res.status(403).json({ message: "You don't follow this user." });
       }
    } catch (err) {
       console.error("Unfollow User Error:", err);
       res.status(500).json({ message: "Failed to unfollow user." });
    }
});

// --- UPDATE A USER ---
// Now uses req.user from 'protect' middleware for authorization
router.put("/:id", protect, async (req, res) => {
  const userIdToUpdate = req.params.id;
  const currentUserId = req.user._id; // User ID from authenticated token
  const isAdmin = req.user.isAdmin;   // isAdmin from authenticated token

  if (!mongoose.Types.ObjectId.isValid(userIdToUpdate)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  // Authorization Check
  if (currentUserId.toString() === userIdToUpdate || isAdmin) {
    if (req.body.password) {
      if(req.body.password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long."});
      }
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.error("Password Hashing Error:", err);
        return res.status(500).json({ message: "Error processing password update." });
      }
    }

    try {
      const allowedUpdates = { ...req.body };
      // Prevent users from directly updating these sensitive fields via this route
      delete allowedUpdates.followers;
      delete allowedUpdates.followings;
      if (!isAdmin) { // Only admin can change isAdmin status
        delete allowedUpdates.isAdmin;
      }


      const user = await User.findByIdAndUpdate(userIdToUpdate, {
        $set: allowedUpdates,
      }, { new: true, runValidators: true });

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      const { password, updatedAt, ...other } = user._doc || {};
      res.status(200).json({ message: "Account has been updated", user: other });

    } catch (err) {
      console.error("User Update Error:", err);
      if (err.name === 'CastError') {
         return res.status(400).json({ message: "Invalid data type in update." });
      }
      if (err.name === 'ValidationError') {
         return res.status(400).json({ message: "Update validation failed", errors: err.errors });
      }
       if (err.code === 11000) {
        return res.status(409).json({ message: "Update failed. Username or email may already exist." });
      }
      return res.status(500).json({ message: "Failed to update account." });
    }
  } else {
    return res.status(403).json({ message: "You are not authorized to update this account." });
  }
});

export default router;
