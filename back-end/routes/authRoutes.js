// routes/authRoutes.js
import express from 'express';
import { registerUser } from '../controllers/authController.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router();

// --- ADD THIS TEST ROUTE ---
router.get('/', (req, res) => {
  res.send('Auth route base path is working!');
});
// --------------------------

router.post('/register', uploadFile, registerUser);

export default router;
