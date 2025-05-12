// back-end/routes/users.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose'; // Import mongoose to check ObjectId validity

const router = express.Router();

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
// WARNING: Using req.body.userId is insecure. User ID should come from auth.
router.put("/:id/follow", async (req, res) => {
  const userIdToFollow = req.params.id;
  const currentUserId = req.body.userId; // Using userId from request body (INSECURE)

  // Check if currentUserId was provided in the body
  if (!currentUserId) {
      return res.status(400).json({ message: "Current user ID (userId) is missing in the request body." });
  }

  // Validate IDs format
  if (!mongoose.Types.ObjectId.isValid(userIdToFollow) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
     return res.status(400).json({ message: "Invalid user ID format." });
  }

  // Prevent following oneself
  if (currentUserId === userIdToFollow) {
    return res.status(403).json({ message: "You can't follow yourself." });
  }

  try {
    // Find both users concurrently for efficiency
    const [userToFollow, currentUser] = await Promise.all([
        User.findById(userIdToFollow),
        User.findById(currentUserId)
    ]);

    // Check if both users exist
    if (!userToFollow || !currentUser) {
      // Be more specific if possible
      const notFoundId = !userToFollow ? userIdToFollow : currentUserId;
      return res.status(404).json({ message: `User with ID ${notFoundId} not found.` });
    }

    // Check if already following
    if (!userToFollow.followers.includes(currentUserId)) {
      // Use findByIdAndUpdate for atomicity if possible, or update separately
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
// WARNING: Using req.body.userId is insecure. User ID should come from auth.
router.put("/:id/unfollow", async (req, res) => {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.body.userId; // Using userId from request body (INSECURE)

    // Check if currentUserId was provided
    if (!currentUserId) {
        return res.status(400).json({ message: "Current user ID (userId) is missing in the request body." });
    }

     // Validate IDs format
    if (!mongoose.Types.ObjectId.isValid(userIdToUnfollow) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
        return res.status(400).json({ message: "Invalid user ID format." });
    }

    // Prevent unfollowing oneself
    if (currentUserId === userIdToUnfollow) {
      return res.status(403).json({ message: "You can't unfollow yourself." });
    }

    try {
       // Find both users concurrently
       const [userToUnfollow, currentUser] = await Promise.all([
            User.findById(userIdToUnfollow),
            User.findById(currentUserId)
       ]);

       // Check if both users exist
       if (!userToUnfollow || !currentUser) {
           const notFoundId = !userToUnfollow ? userIdToUnfollow : currentUserId;
           return res.status(404).json({ message: `User with ID ${notFoundId} not found.` });
       }

       // Check if currently following
       if (userToUnfollow.followers.includes(currentUserId)) {
           // Use findByIdAndUpdate or update separately
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


router.put("/:id", async (req, res) => {
  const userIdToUpdate = req.params.id;
  const currentUserId = req.body.userId; // Using userId from request body (INSECURE)
  const isAdmin = req.body.isAdmin;     // Using isAdmin from request body (INSECURE)

   // Check if currentUserId was provided for the authorization check
   if (!currentUserId) {
       return res.status(400).json({ message: "Current user ID (userId) is missing in the request body for authorization." });
   }

   // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(userIdToUpdate)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  // Authorization Check (INSECURE VERSION based on request body)
  if (currentUserId === userIdToUpdate || isAdmin) {

    // Hash password if it's being updated
    if (req.body.password) {
      // Add password validation (e.g., length check) if needed
      if(req.body.password.length < 6) { // Assuming min length 6 from User model
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
      // Prevent updating certain fields directly if needed (more secure)
      const allowedUpdates = { ...req.body };
      delete allowedUpdates.followers;
      delete allowedUpdates.followings;
      // delete allowedUpdates.isAdmin; // Be cautious allowing isAdmin update here

      const user = await User.findByIdAndUpdate(userIdToUpdate, {
        $set: allowedUpdates, // Update with (potentially filtered) fields from body
      }, { new: true, runValidators: true }); // Return updated doc and run schema validators

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      const { password, updatedAt, ...other } = user._doc || {}; // Exclude password
      res.status(200).json({ message: "Account has been updated", user: other });

    } catch (err) {
      console.error("User Update Error:", err);
      if (err.name === 'CastError') {
         return res.status(400).json({ message: "Invalid data type in update." });
      }
      if (err.name === 'ValidationError') {
         return res.status(400).json({ message: "Update validation failed", errors: err.errors });
      }
       if (err.code === 11000) { // Handle potential unique constraint errors (e.g., changing email to one that exists)
        // Determine which field caused the error if possible (requires parsing err.keyPattern or err.keyValue)
        return res.status(409).json({ message: "Update failed. Username or email may already exist." });
      }
      return res.status(500).json({ message: "Failed to update account." });
    }
  } else {
    // Authorization failed
    return res.status(403).json({ message: "You are not authorized to update this account." });
  }
});


// Export the router
export default router;
