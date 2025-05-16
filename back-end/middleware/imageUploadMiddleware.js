// back-end/middleware/imageUploadMiddleware.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

// Use the already-configured cloudinary instance (from index.js)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2, // Use the v2 API
  params: {
    folder: 'social_media_app',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

export default upload;
