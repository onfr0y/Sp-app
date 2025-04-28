import express from 'express';  

import { registerUser } from '../controllers/authController.js';    
import uploadFile from '../middlewares/multer.js';


const router = express.Router();

router.post('/register',uploadFile, registerUser);
export default router;

