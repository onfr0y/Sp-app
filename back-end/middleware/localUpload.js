// back-end/middleware/localUpload.js
/* jshint esversion: 11, node: true */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname, to construct paths reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the destination for uploads, relative to the project root.
// This resolves to your_backend_project/public/uploads/posts
const uploadDir = path.resolve(__dirname, '..', 'public', 'uploads', 'posts');

// Ensure the upload directory exists, create it if it doesn't.
// This should run when the module is loaded.
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Multer: Upload directory created successfully at ${uploadDir}`);
  } catch (err) {
    console.error(`Multer: Error creating upload directory ${uploadDir}:`, err);
    // Depending on your error handling strategy, you might want to throw the error
    // or ensure the application doesn't start if this critical directory can't be made.
  }
} else {
  console.log(`Multer: Upload directory already exists at ${uploadDir}`);
}

// Configure multer's disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check again if directory exists before attempting to save, just in case.
    if (!fs.existsSync(uploadDir)) {
        // This is a fallback, ideally the directory is created when the module loads.
        return cb(new Error(`Upload destination directory does not exist: ${uploadDir}`), null);
    }
    cb(null, uploadDir); // Save files to the resolved 'uploadDir'
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwriting files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Define a file filter to accept only certain image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  // Test the mimetype (e.g., 'image/jpeg')
  const mimetypeIsValid = allowedTypes.test(file.mimetype);
  // Test the file extension (e.g., '.jpg')
  const extensionIsValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetypeIsValid && extensionIsValid) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with a specific error message
    cb(new Error('File upload only supports the following filetypes - ' + allowedTypes.toString().replace(/\//g, '')), false);
  }
};

// Initialize multer with the storage and file filter configurations
const localUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set a file size limit (e.g., 10MB)
  fileFilter: fileFilter
});

// Export the configured multer instance
export default localUpload;
