import multer from "multer";
import { HttpError } from "../utils/http-error.js";

// Files stay in memory (Workers have no disk) and are streamed on to Cloudinary.
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new HttpError(400, "Only image uploads are allowed")),
});
