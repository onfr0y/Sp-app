// back-end/middleware/imageUploadMiddleware.js
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp/;
  const allowedMimeTypes = /image\/jpeg|image\/pjpeg|image\/png|image\/gif|image\/webp/;
  const extensionIsValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetypeIsValid = allowedMimeTypes.test(file.mimetype);
  if (mimetypeIsValid && extensionIsValid) {
    cb(null, true);
  } else {
    cb(new Error('File upload only supports the following image filetypes: JPEG, PNG, GIF, WEBP.'), false);
  }
};

const memoryUpload = multer({ // This defines memoryUpload
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

export default memoryUpload; // This exports it
