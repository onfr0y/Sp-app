import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
    }
);


// import router jaa
import userRoutes from './routes/userRoutes.js';

//chai route
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});