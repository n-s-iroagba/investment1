// server/src/middleware/upload.ts
import multer from "multer";
import path from "path";
import { CustomError } from "../utils/error/CustomError.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `manager-${Date.now()}${ext}`);
  }
});

export const upload = multer({
  storage,
  fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    // <— force the right signature here
    cb: multer.FileFilterCallback
  ) {
    if (!file.mimetype.startsWith("image/")) {
      // now accepted, because CustomError extends Error
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
