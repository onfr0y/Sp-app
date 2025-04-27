import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    profilePicture: {
        id: String,
        url: String,
    },
    Gender: {
        type: String
        
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);