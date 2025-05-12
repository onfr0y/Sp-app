// models/User.js

// Use import instead of require
import mongoose from 'mongoose';

// Define the schema
const postSchema = new mongoose.Schema(
  { 
    userId: {
        type:String,
        required: true
    },
    desc: {
        type:String,
        max:500
    },
    img:{
        type:Array,
        default: []
    },
    likes:{
        type:Array,
        default:[]
    },
    
    
    
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Use export default instead of module.exports
export default mongoose.model('Post', postSchema);
