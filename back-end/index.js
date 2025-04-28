import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
import cloudinary from "cloudinary"

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret
})



const app = express();



// using middleware
app.use(express.json());

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
    }
);


// import router jaa
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';



//chai route
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});