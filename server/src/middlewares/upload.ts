// server/src/middleware/upload.ts
import multer from "multer";

// Change from diskStorage to memoryStorage for BLOB storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    console.log('File filter called for:', file.originalname, 'Type:', file.mimetype);
    if (!file.mimetype.startsWith("image/")) {
      console.log('File rejected: not an image');
      return cb(null, false);
    }
    console.log('File accepted');
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});