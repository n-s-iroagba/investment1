// server/src/middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { CustomError } from "../utils/error/CustomError.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug: Log paths
console.log('Upload middleware __dirname:', __dirname);
console.log('Upload middleware __filename:', __filename);

// Make sure this matches your main server file's upload directory
const uploadsPath = path.join(__dirname, "../uploads");
console.log('Upload destination path:', uploadsPath);

// Ensure directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory from middleware:', uploadsPath);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('Multer destination called, saving to:', uploadsPath);
    cb(null, uploadsPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `manager-${Date.now()}${ext}`;
    console.log('Generated filename:', filename);
    console.log('Full file path will be:', path.join(uploadsPath, filename));
    cb(null, filename);
  }
});

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