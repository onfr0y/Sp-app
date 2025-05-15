// back-end/middleware/localUpload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto'; // For secure random filenames

// ES Module equivalent for __dirname, to construct paths reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the destination for uploads, relative to the project root.
// This resolves to your_backend_project/public/uploads/posts
const uploadDir = path.resolve(__dirname, '..', 'public', 'uploads', 'posts');

// Ensure the upload directory exists, create it if it doesn't.
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Multer: Upload directory created successfully at ${uploadDir}`);
  } catch (err) {
    console.error(`Multer: Error creating upload directory ${uploadDir}:`, err);
  }
} else {
  console.log(`Multer: Upload directory already exists at ${uploadDir}`);
}

// Configure multer's disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
        return cb(new Error(`Upload destination directory does not exist: ${uploadDir}`), null);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use crypto for a more secure random suffix
    const randomSuffix = crypto.randomBytes(8).toString('hex'); // Generates 16 random hex characters
    const uniqueFilename = Date.now() + '-' + randomSuffix + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

// Define a file filter to accept only certain image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetypeIsValid = allowedTypes.test(file.mimetype);
  const extensionIsValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetypeIsValid && extensionIsValid) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('File upload only supports the following filetypes - ' + allowedTypes.toString().replace(/\//g, '')), false);
  }
};

// --- THIS IS WHERE localUpload IS DEFINED ---
// Initialize multer with the storage and file filter configurations
const localUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set a file size limit (e.g., 10MB)
  fileFilter: fileFilter
});
// --- END OF DEFINITION ---

// Export the configured multer instance
export default localUpload;
