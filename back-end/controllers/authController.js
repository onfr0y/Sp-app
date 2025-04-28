
import { User } from "../models/userModel.js";

import generateToken from "../utils/generateToken.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";


export const registerUser = async (req, res) => {
    // ... rest of your function code remains the same ...
    try {
        const { name, email, password, gender } = req.body;
        const file = req.file;

        // 1. Validate input
        if (!name || !email || !password || !gender) {
            return res.status(400).json({
                message: "Please provide name, email, password, and gender."
            });
        }
        if (!file) {
            return res.status(400).json({
                message: "Profile picture is required."
            });
        }

        // 2. Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists."
            });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Prepare file for upload
        const fileUrl = getDataUrl(file);
        if (!fileUrl || !fileUrl.content) {
             return res.status(500).json({
                message: "Failed to process file data."
            });
        }

        // 5. Upload image to Cloudinary (using the imported cloudinary object)
        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
            folder: "user_profiles",
        });

        // 6. Create the new user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            profilePic: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

        // 7. Save the user to the database
        await newUser.save();

        // 8. Generate JWT Token
        generateToken(newUser._id, res);

        // 9. Send success response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                gender: newUser.gender,
                profilePic: newUser.profilePic.url
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            message: "Server error during registration.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

