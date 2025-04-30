
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
import cloudinary from "cloudinary"
import morgan from 'morgan';
import helmet from 'helmet'; // Moved import higher up for consistency
import cors from 'cors'; // Moved import higher up for consistency


dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret
})

const app = express();

// using middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors({
  origin: 'http://localhost:5173', // <--- Replace with your frontend's actual origin
  credentials: true, // Allow cookies if needed
}));


// --- CORRECT IMPORT SECTION ---
// Import the routers you created
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
// -----------------------------

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
    res.send('home_page');
});

// --- CORRECT ROUTE USAGE SECTION ---
// Tell the Express app to use the imported routers with specific base paths
app.use('/api/auth', authRoutes); // Any request to /api/auth/... will be handled by authRoutes
app.use('/api/user', userRoutes); // Any request to /api/user/... will be handled by userRoutes
app.use('/api/post', postRoutes); // Any request to /api/post/... will be handled by postRoutes
// ---------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

