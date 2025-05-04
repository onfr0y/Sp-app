// models/User.js

// Use import instead of require
import mongoose from 'mongoose';

// Define the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array, // Or consider type: [mongoose.Schema.Types.ObjectId] if storing User IDs
      default: [],
    },
    followings: {
      type: Array, // Or consider type: [mongoose.Schema.Types.ObjectId]
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // You might want 'desc' field based on other typical social apps
    desc: {
        type: String,
        max: 150, // Example max length
        default: ''
    },
    city: {
        type: String,
        max: 50,
        default: ''
    },
    from: {
        type: String,
        max: 50,
        default: ''
    },
    relationship: {
        type: Number, // e.g., 1: Single, 2: Relationship, 3: Married
        enum: [1, 2, 3], // Optional: restrict values
        default: 1
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Use export default instead of module.exports
export default mongoose.model('User', userSchema);
